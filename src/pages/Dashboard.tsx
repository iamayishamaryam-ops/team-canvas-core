import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LeaveOverview from "@/components/dashboard/LeaveOverview";
import { Users, Clock, Calendar, DollarSign, TrendingUp, FileText } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number) => {
  if (amount >= 1000) {
    return `SR ${(amount / 1000).toFixed(1)}K`;
  }
  return `SR ${amount.toFixed(0)}`;
};

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <StatsCard
                title="Total Employees"
                value={stats?.totalEmployees || 0}
                change={`${stats?.attendanceRate || 0}% attendance rate`}
                changeType="neutral"
                icon={Users}
                iconColor="text-primary"
              />
            )}
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <StatsCard
                title="Present Today"
                value={stats?.presentToday || 0}
                change={`${stats?.attendanceRate || 0}% attendance`}
                changeType="neutral"
                icon={Clock}
                iconColor="text-success"
              />
            )}
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <StatsCard
                title="On Leave"
                value={stats?.onLeave || 0}
                change={`${stats?.pendingLeave || 0} pending requests`}
                changeType="neutral"
                icon={Calendar}
                iconColor="text-warning"
              />
            )}
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <StatsCard
                title="Monthly Payroll"
                value={formatCurrency(stats?.monthlyPayroll || 0)}
                change="Current month total"
                changeType="neutral"
                icon={DollarSign}
                iconColor="text-accent"
              />
            )}
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <LeaveOverview />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
            <RecentActivity />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalEmployees ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Today's Attendance</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.pendingLeave || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Leave Requests</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2.5">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.pendingExpenses || 0)}</p>
                <p className="text-sm text-muted-foreground">Pending Expenses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
