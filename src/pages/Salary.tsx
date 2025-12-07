import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Download, TrendingUp, Users, FileText, CreditCard, Eye, Loader2, Plus, Settings } from "lucide-react";
import { useSalaryComponents, usePayslips, useUpsertSalaryComponent, useGeneratePayslip, useUpdatePayslipStatus, Payslip } from "@/hooks/useSalary";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-success/10 text-success border-success/20";
    case "draft":
      return "bg-muted/10 text-muted-foreground border-muted/20";
    case "approved":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "";
  }
};

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const Salary = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [viewPayslip, setViewPayslip] = useState<Payslip | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [salaryForm, setSalaryForm] = useState({
    basic_salary: 0,
    housing_allowance: 0,
    transportation_allowance: 0,
    food_allowance: 0,
    phone_allowance: 0,
    other_allowances: 0,
  });
  const [payslipForm, setPayslipForm] = useState({
    overtime_hours: 0,
    overtime_amount: 0,
    late_deduction: 0,
    absence_deduction: 0,
    loan_deduction: 0,
    other_deductions: 0,
  });

  const { data: salaryComponents, isLoading: salaryLoading } = useSalaryComponents();
  const { data: payslips, isLoading: payslipsLoading } = usePayslips(selectedMonth, selectedYear);
  const { data: employees } = useEmployees();
  const upsertSalary = useUpsertSalaryComponent();
  const generatePayslip = useGeneratePayslip();
  const updateStatus = useUpdatePayslipStatus();
  const { isAdminLevel } = useAuth();

  const totalPayroll = payslips?.reduce((sum, p) => sum + Number(p.net_salary), 0) || 0;
  const avgSalary = payslips?.length ? Math.round(totalPayroll / payslips.length) : 0;
  const paidCount = payslips?.filter((p) => p.status === "paid").length || 0;
  const pendingCount = payslips?.filter((p) => p.status !== "paid").length || 0;

  const handleSaveSalary = () => {
    if (!selectedEmployee) return;
    upsertSalary.mutate(
      { user_id: selectedEmployee, ...salaryForm },
      {
        onSuccess: () => {
          setSalaryDialogOpen(false);
          setSelectedEmployee("");
          setSalaryForm({
            basic_salary: 0,
            housing_allowance: 0,
            transportation_allowance: 0,
            food_allowance: 0,
            phone_allowance: 0,
            other_allowances: 0,
          });
        },
      }
    );
  };

  const handleGeneratePayslip = () => {
    if (!selectedEmployee) return;
    
    const salary = salaryComponents?.find((s) => s.user_id === selectedEmployee);
    if (!salary) return;

    const grossSalary = 
      Number(salary.basic_salary) +
      Number(salary.housing_allowance) +
      Number(salary.transportation_allowance) +
      Number(salary.food_allowance) +
      Number(salary.phone_allowance) +
      Number(salary.other_allowances) +
      payslipForm.overtime_amount;

    const totalDeductions =
      payslipForm.late_deduction +
      payslipForm.absence_deduction +
      payslipForm.loan_deduction +
      payslipForm.other_deductions;

    const netSalary = grossSalary - totalDeductions;

    generatePayslip.mutate(
      {
        user_id: selectedEmployee,
        month: selectedMonth,
        year: selectedYear,
        basic_salary: Number(salary.basic_salary),
        housing_allowance: Number(salary.housing_allowance),
        transportation_allowance: Number(salary.transportation_allowance),
        food_allowance: Number(salary.food_allowance),
        phone_allowance: Number(salary.phone_allowance),
        other_allowances: Number(salary.other_allowances),
        overtime_hours: payslipForm.overtime_hours,
        overtime_amount: payslipForm.overtime_amount,
        late_deduction: payslipForm.late_deduction,
        absence_deduction: payslipForm.absence_deduction,
        loan_deduction: payslipForm.loan_deduction,
        other_deductions: payslipForm.other_deductions,
        gross_salary: grossSalary,
        total_deductions: totalDeductions,
        net_salary: netSalary,
        status: "draft",
        paid_at: null,
        notes: null,
      },
      {
        onSuccess: () => {
          setPayslipDialogOpen(false);
          setSelectedEmployee("");
          setPayslipForm({
            overtime_hours: 0,
            overtime_amount: 0,
            late_deduction: 0,
            absence_deduction: 0,
            loan_deduction: 0,
            other_deductions: 0,
          });
        },
      }
    );
  };

  const downloadPayslip = (payslip: Payslip) => {
    const content = `
PAYSLIP
========================
Employee: ${payslip.profiles?.full_name || "N/A"}
Department: ${payslip.profiles?.department || "N/A"}
Month: ${months.find((m) => m.value === payslip.month)?.label} ${payslip.year}

EARNINGS
------------------------
Basic Salary:           ${formatCurrency(Number(payslip.basic_salary))}
Housing Allowance:      ${formatCurrency(Number(payslip.housing_allowance))}
Transportation:         ${formatCurrency(Number(payslip.transportation_allowance))}
Food Allowance:         ${formatCurrency(Number(payslip.food_allowance))}
Phone Allowance:        ${formatCurrency(Number(payslip.phone_allowance))}
Other Allowances:       ${formatCurrency(Number(payslip.other_allowances))}
Overtime (${payslip.overtime_hours}h):        ${formatCurrency(Number(payslip.overtime_amount))}
------------------------
GROSS SALARY:           ${formatCurrency(Number(payslip.gross_salary))}

DEDUCTIONS
------------------------
Late Deduction:         ${formatCurrency(Number(payslip.late_deduction))}
Absence Deduction:      ${formatCurrency(Number(payslip.absence_deduction))}
Loan Deduction:         ${formatCurrency(Number(payslip.loan_deduction))}
Other Deductions:       ${formatCurrency(Number(payslip.other_deductions))}
------------------------
TOTAL DEDUCTIONS:       ${formatCurrency(Number(payslip.total_deductions))}

========================
NET SALARY:             ${formatCurrency(Number(payslip.net_salary))}
========================
Status: ${payslip.status.toUpperCase()}
${payslip.paid_at ? `Paid on: ${format(new Date(payslip.paid_at), "MMM d, yyyy")}` : ""}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip_${payslip.profiles?.full_name?.replace(/\s/g, "_") || "employee"}_${payslip.month}_${payslip.year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Salary Management</h1>
            <p className="text-muted-foreground mt-1">Process payroll and manage compensation</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={`${selectedMonth}-${selectedYear}`}
              onValueChange={(val) => {
                const [m, y] = val.split("-");
                setSelectedMonth(parseInt(m));
                setSelectedYear(parseInt(y));
              }}
            >
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {months.map((m) => (
                  <SelectItem key={m.value} value={`${m.value}-${selectedYear}`}>
                    {m.label} {selectedYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdminLevel && (
              <>
                <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border hover:bg-secondary">
                      <Settings className="h-4 w-4 mr-2" />
                      Setup Salary
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Setup Employee Salary</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Configure base salary and allowances for an employee.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {employees?.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Basic Salary</Label>
                          <Input
                            type="number"
                            value={salaryForm.basic_salary}
                            onChange={(e) => setSalaryForm({ ...salaryForm, basic_salary: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Housing Allowance</Label>
                          <Input
                            type="number"
                            value={salaryForm.housing_allowance}
                            onChange={(e) => setSalaryForm({ ...salaryForm, housing_allowance: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Transportation</Label>
                          <Input
                            type="number"
                            value={salaryForm.transportation_allowance}
                            onChange={(e) => setSalaryForm({ ...salaryForm, transportation_allowance: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Food Allowance</Label>
                          <Input
                            type="number"
                            value={salaryForm.food_allowance}
                            onChange={(e) => setSalaryForm({ ...salaryForm, food_allowance: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Allowance</Label>
                          <Input
                            type="number"
                            value={salaryForm.phone_allowance}
                            onChange={(e) => setSalaryForm({ ...salaryForm, phone_allowance: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Other Allowances</Label>
                          <Input
                            type="number"
                            value={salaryForm.other_allowances}
                            onChange={(e) => setSalaryForm({ ...salaryForm, other_allowances: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveSalary}
                        className="w-full gradient-primary text-primary-foreground"
                        disabled={upsertSalary.isPending}
                      >
                        {upsertSalary.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Salary Setup
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={payslipDialogOpen} onOpenChange={setPayslipDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Generate Payslip
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Generate Monthly Payslip</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Generate payslip for {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {salaryComponents?.map((s) => (
                              <SelectItem key={s.user_id} value={s.user_id}>
                                {s.profiles?.full_name} - Base: {formatCurrency(Number(s.basic_salary))}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Overtime Hours</Label>
                          <Input
                            type="number"
                            value={payslipForm.overtime_hours}
                            onChange={(e) => setPayslipForm({ ...payslipForm, overtime_hours: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Overtime Amount</Label>
                          <Input
                            type="number"
                            value={payslipForm.overtime_amount}
                            onChange={(e) => setPayslipForm({ ...payslipForm, overtime_amount: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Late Deduction</Label>
                          <Input
                            type="number"
                            value={payslipForm.late_deduction}
                            onChange={(e) => setPayslipForm({ ...payslipForm, late_deduction: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Absence Deduction</Label>
                          <Input
                            type="number"
                            value={payslipForm.absence_deduction}
                            onChange={(e) => setPayslipForm({ ...payslipForm, absence_deduction: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Loan Deduction</Label>
                          <Input
                            type="number"
                            value={payslipForm.loan_deduction}
                            onChange={(e) => setPayslipForm({ ...payslipForm, loan_deduction: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Other Deductions</Label>
                          <Input
                            type="number"
                            value={payslipForm.other_deductions}
                            onChange={(e) => setPayslipForm({ ...payslipForm, other_deductions: parseFloat(e.target.value) || 0 })}
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleGeneratePayslip}
                        className="w-full gradient-primary text-primary-foreground"
                        disabled={generatePayslip.isPending || !selectedEmployee}
                      >
                        {generatePayslip.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Generate Payslip
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2.5">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Salary</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(avgSalary)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees Paid</p>
                <p className="text-2xl font-bold text-foreground">{paidCount}/{payslips?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payslips Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Payroll Details</h3>
              <p className="text-sm text-muted-foreground">
                {months.find((m) => m.value === selectedMonth)?.label} {selectedYear} salary breakdown
              </p>
            </div>
          </div>
          {payslipsLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payslips?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No payslips for this month. Generate payslips to see them here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Employee</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground text-right">Gross</TableHead>
                  <TableHead className="text-muted-foreground text-right">Deductions</TableHead>
                  <TableHead className="text-muted-foreground text-right">Net Salary</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips?.map((payslip, index) => (
                  <TableRow
                    key={payslip.id}
                    className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-border">
                          <AvatarImage src={payslip.profiles?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {payslip.profiles?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{payslip.profiles?.full_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payslip.profiles?.department || "-"}</TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatCurrency(Number(payslip.gross_salary))}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      -{formatCurrency(Number(payslip.total_deductions))}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatCurrency(Number(payslip.net_salary))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(payslip.status)}>
                        {payslip.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          onClick={() => setViewPayslip(payslip)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          onClick={() => downloadPayslip(payslip)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {isAdminLevel && payslip.status !== "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-success hover:text-success/80"
                            onClick={() => updateStatus.mutate({ id: payslip.id, status: "paid" })}
                            disabled={updateStatus.isPending}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* View Payslip Dialog */}
        <Dialog open={!!viewPayslip} onOpenChange={() => setViewPayslip(null)}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Payslip Details</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {viewPayslip?.profiles?.full_name} - {months.find((m) => m.value === viewPayslip?.month)?.label} {viewPayslip?.year}
              </DialogDescription>
            </DialogHeader>
            {viewPayslip && (
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">Earnings</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.basic_salary))}</span>
                    <span className="text-muted-foreground">Housing Allowance</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.housing_allowance))}</span>
                    <span className="text-muted-foreground">Transportation</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.transportation_allowance))}</span>
                    <span className="text-muted-foreground">Food Allowance</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.food_allowance))}</span>
                    <span className="text-muted-foreground">Phone Allowance</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.phone_allowance))}</span>
                    <span className="text-muted-foreground">Other Allowances</span>
                    <span className="text-right text-foreground">{formatCurrency(Number(viewPayslip.other_allowances))}</span>
                    <span className="text-muted-foreground">Overtime ({viewPayslip.overtime_hours}h)</span>
                    <span className="text-right text-success">{formatCurrency(Number(viewPayslip.overtime_amount))}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Gross Salary</span>
                    <span className="text-foreground">{formatCurrency(Number(viewPayslip.gross_salary))}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 space-y-2">
                  <h4 className="font-semibold text-destructive">Deductions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Late Deduction</span>
                    <span className="text-right text-destructive">-{formatCurrency(Number(viewPayslip.late_deduction))}</span>
                    <span className="text-muted-foreground">Absence Deduction</span>
                    <span className="text-right text-destructive">-{formatCurrency(Number(viewPayslip.absence_deduction))}</span>
                    <span className="text-muted-foreground">Loan Deduction</span>
                    <span className="text-right text-destructive">-{formatCurrency(Number(viewPayslip.loan_deduction))}</span>
                    <span className="text-muted-foreground">Other Deductions</span>
                    <span className="text-right text-destructive">-{formatCurrency(Number(viewPayslip.other_deductions))}</span>
                  </div>
                  <div className="border-t border-destructive/20 pt-2 flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-destructive">-{formatCurrency(Number(viewPayslip.total_deductions))}</span>
                  </div>
                </div>

                <div className="rounded-lg gradient-primary p-4 flex justify-between items-center">
                  <span className="text-primary-foreground font-semibold text-lg">Net Salary</span>
                  <span className="text-primary-foreground font-bold text-2xl">{formatCurrency(Number(viewPayslip.net_salary))}</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadPayslip(viewPayslip)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Payslip
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Salary;
