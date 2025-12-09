import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt,
  Plus,
  Download,
  Check,
  X,
  DollarSign,
  TrendingUp,
  Clock,
  Building,
  Car,
  Utensils,
  Monitor,
  GraduationCap,
  MoreHorizontal,
  Trash,
  Loader2,
  Upload,
  FileText,
  Paperclip,
} from "lucide-react";
import { useExpenses, useMyExpenses, useCreateExpense, useUpdateExpenseStatus, useDeleteExpense, Expense } from "@/hooks/useExpenses";
import { useUploadExpenseReceipt } from "@/hooks/useAttachments";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";

const categoryIcons: Record<string, typeof Car> = {
  travel: Car,
  meals: Utensils,
  supplies: Building,
  equipment: Monitor,
  training: GraduationCap,
  other: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  travel: "Travel",
  meals: "Meals",
  supplies: "Supplies",
  equipment: "Equipment",
  training: "Training",
  other: "Other",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "reimbursed":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "";
  }
};

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipts, setReceipts] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: allExpenses, isLoading } = useExpenses(activeTab);
  const { data: myExpenses } = useMyExpenses();
  const createExpense = useCreateExpense();
  const updateStatus = useUpdateExpenseStatus();
  const deleteExpense = useDeleteExpense();
  const uploadReceipt = useUploadExpenseReceipt();
  const { user, isAdminLevel } = useAuth();

  const expenses = isAdminLevel ? allExpenses : myExpenses;

  const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
  const pendingExpenses = expenses?.filter((e) => e.status === "pending").reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
  const approvedExpenses = expenses?.filter((e) => e.status === "approved" || e.status === "reimbursed").reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const categoryTotals = Object.keys(categoryLabels).map((cat) => {
    const total = expenses?.filter((e) => e.category === cat).reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
    return { category: cat, total };
  }).filter((c) => c.total > 0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReceipts((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeReceipt = (index: number) => {
    setReceipts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !description || !user?.id) return;

    setIsUploading(true);

    try {
      // Upload receipts first
      const uploadedPaths: string[] = [];
      
      for (const file of receipts) {
        const path = await uploadReceipt.mutateAsync({
          userId: user.id,
          file,
        });
        uploadedPaths.push(path);
      }

      await createExpense.mutateAsync({
        category,
        amount: parseFloat(amount),
        description,
        expense_date: expenseDate,
        receipts: uploadedPaths.length > 0 ? uploadedPaths : undefined,
      });

      setDialogOpen(false);
      setCategory("");
      setAmount("");
      setDescription("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setReceipts([]);
    } catch (error) {
      console.error("Failed to submit expense:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: "approved", reviewed_by: user?.id });
  };

  const handleReject = (id: string) => {
    updateStatus.mutate({ id, status: "rejected", reviewed_by: user?.id });
  };

  const handleReimburse = (id: string) => {
    updateStatus.mutate({ id, status: "reimbursed", reviewed_by: user?.id });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground mt-1">Track and manage company expenses</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Expense</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Submit a new expense for approval.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the expense..."
                      className="bg-secondary border-border min-h-[80px]"
                    />
                  </div>

                  {/* Receipts */}
                  <div className="space-y-2">
                    <Label>Receipts / Bills</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Receipts
                    </Button>
                    {receipts.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {receipts.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeReceipt(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={createExpense.isPending || isUploading}
                  >
                    {(createExpense.isPending || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Expense
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(pendingExpenses)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(approvedExpenses)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold text-foreground">{expenses?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categoryTotals.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {categoryTotals.map((cat) => {
              const Icon = categoryIcons[cat.category];
              return (
                <div
                  key={cat.category}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-secondary p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground">{categoryLabels[cat.category]}</span>
                    </div>
                    <span className="text-foreground font-semibold">{formatCurrency(cat.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Expenses Table */}
        <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "300ms" }}>
          {isAdminLevel && (
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-border px-4">
                <TabsList className="bg-transparent h-14 gap-4">
                  {["all", "pending", "approved", "rejected", "reimbursed"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      onClick={() => setActiveTab(tab)}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none capitalize"
                    >
                      {tab === "all" ? "All" : tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          )}
          
          <div className="border-b border-border p-5">
            <h3 className="text-lg font-semibold text-foreground">Recent Expenses</h3>
            <p className="text-sm text-muted-foreground">Review and approve expense claims</p>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : expenses?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No expenses found. Add an expense to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  {isAdminLevel && <TableHead className="text-muted-foreground">Employee</TableHead>}
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses?.map((expense, index) => {
                  const Icon = categoryIcons[expense.category] || MoreHorizontal;
                  const hasReceipts = (expense.receipts && expense.receipts.length > 0) || expense.receipt_url;
                  return (
                    <TableRow
                      key={expense.id}
                      className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${(index + 4) * 50}ms` }}
                    >
                      {isAdminLevel && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-2 border-border">
                              <AvatarImage src={expense.profiles?.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {expense.profiles?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{expense.profiles?.full_name || "Unknown"}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{categoryLabels[expense.category]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{expense.description}</span>
                          {hasReceipts && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0">
                              <Paperclip className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {formatCurrency(Number(expense.amount))}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(parseISO(expense.expense_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.status === "pending" && isAdminLevel ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleReject(expense.id)}
                              disabled={updateStatus.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
                              onClick={() => handleApprove(expense.id)}
                              disabled={updateStatus.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : expense.status === "approved" && isAdminLevel ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => handleReimburse(expense.id)}
                            disabled={updateStatus.isPending}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Reimburse
                          </Button>
                        ) : expense.status === "pending" && expense.user_id === user?.id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => deleteExpense.mutate(expense.id)}
                            disabled={deleteExpense.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
