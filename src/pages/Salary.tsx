import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Download, TrendingUp, Users, FileText, CreditCard } from "lucide-react";

const salaryData = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    department: "Marketing",
    baseSalary: 75000,
    bonus: 5000,
    deductions: 2500,
    netSalary: 77500,
    status: "Paid",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    department: "Engineering",
    baseSalary: 95000,
    bonus: 10000,
    deductions: 3200,
    netSalary: 101800,
    status: "Paid",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    department: "HR",
    baseSalary: 65000,
    bonus: 3000,
    deductions: 2100,
    netSalary: 65900,
    status: "Pending",
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    department: "Finance",
    baseSalary: 85000,
    bonus: 7500,
    deductions: 2800,
    netSalary: 89700,
    status: "Paid",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    department: "Sales",
    baseSalary: 60000,
    bonus: 12000,
    deductions: 2300,
    netSalary: 69700,
    status: "Processing",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-success/10 text-success border-success/20";
    case "Pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "Processing":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "";
  }
};

const Salary = () => {
  const totalPayroll = salaryData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const avgSalary = Math.round(totalPayroll / salaryData.length);

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
            <Select defaultValue="nov-2024">
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="dec-2024">December 2024</SelectItem>
                <SelectItem value="nov-2024">November 2024</SelectItem>
                <SelectItem value="oct-2024">October 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <CreditCard className="h-4 w-4 mr-2" />
              Run Payroll
            </Button>
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
                <p className="text-2xl font-bold text-foreground">
                  {salaryData.filter((e) => e.status === "Paid").length}/{salaryData.length}
                </p>
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
                <p className="text-2xl font-bold text-foreground">
                  {salaryData.filter((e) => e.status !== "Paid").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Payroll Details</h3>
              <p className="text-sm text-muted-foreground">November 2024 salary breakdown</p>
            </div>
            <Button variant="outline" className="border-border hover:bg-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Department</TableHead>
                <TableHead className="text-muted-foreground text-right">Base Salary</TableHead>
                <TableHead className="text-muted-foreground text-right">Bonus</TableHead>
                <TableHead className="text-muted-foreground text-right">Deductions</TableHead>
                <TableHead className="text-muted-foreground text-right">Net Salary</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryData.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 3) * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                  <TableCell className="text-right text-foreground">
                    {formatCurrency(employee.baseSalary)}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    +{formatCurrency(employee.bonus)}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    -{formatCurrency(employee.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatCurrency(employee.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Salary;
