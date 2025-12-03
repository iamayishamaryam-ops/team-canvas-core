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
} from "lucide-react";

const expenses = [
  {
    id: 1,
    employee: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    category: "Travel",
    description: "Client meeting - Uber rides",
    amount: 85.50,
    date: "Dec 1, 2024",
    status: "Pending",
    icon: Car,
  },
  {
    id: 2,
    employee: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    category: "Equipment",
    description: "Mechanical keyboard for development",
    amount: 250.00,
    date: "Nov 28, 2024",
    status: "Approved",
    icon: Monitor,
  },
  {
    id: 3,
    employee: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    category: "Meals",
    description: "Team lunch - Q4 planning",
    amount: 320.75,
    date: "Nov 25, 2024",
    status: "Approved",
    icon: Utensils,
  },
  {
    id: 4,
    employee: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    category: "Office",
    description: "Office supplies - printer paper, pens",
    amount: 45.20,
    date: "Nov 20, 2024",
    status: "Rejected",
    icon: Building,
  },
  {
    id: 5,
    employee: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    category: "Travel",
    description: "Conference hotel - 2 nights",
    amount: 450.00,
    date: "Nov 15, 2024",
    status: "Pending",
    icon: Car,
  },
];

const categories = [
  { name: "Travel", amount: 12500, icon: Car, color: "text-primary" },
  { name: "Equipment", amount: 8200, icon: Monitor, color: "text-success" },
  { name: "Meals", amount: 5400, icon: Utensils, color: "text-warning" },
  { name: "Office", amount: 3100, icon: Building, color: "text-accent" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-success/10 text-success border-success/20";
    case "Pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "Rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

const Expenses = () => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter((e) => e.status === "Pending").reduce((sum, exp) => sum + exp.amount, 0);

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
            <Button variant="outline" className="border-border hover:bg-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
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
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(29200)}</p>
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
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
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
                <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-secondary p-2 ${category.color}`}>
                    <category.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-foreground">{category.name}</span>
                </div>
                <span className="text-foreground font-semibold">{formatCurrency(category.amount)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expenses Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="border-b border-border p-5">
            <h3 className="text-lg font-semibold text-foreground">Recent Expenses</h3>
            <p className="text-sm text-muted-foreground">Review and approve expense claims</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow
                  key={expense.id}
                  className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarImage src={expense.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {expense.employee.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{expense.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <expense.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{expense.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {expense.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.status === "Pending" ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View
                      </Button>
                    )}
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

export default Expenses;
