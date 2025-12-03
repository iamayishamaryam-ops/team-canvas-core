import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LeaveOverview from "@/components/dashboard/LeaveOverview";
import { Users, Clock, Calendar, DollarSign, TrendingUp, FileText } from "lucide-react";

const Dashboard = () => {
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
            <StatsCard
              title="Total Employees"
              value={248}
              change="+12 this month"
              changeType="positive"
              icon={Users}
              iconColor="text-primary"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <StatsCard
              title="Present Today"
              value={186}
              change="75% attendance"
              changeType="neutral"
              icon={Clock}
              iconColor="text-success"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <StatsCard
              title="On Leave"
              value={24}
              change="8 pending requests"
              changeType="neutral"
              icon={Calendar}
              iconColor="text-warning"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <StatsCard
              title="Monthly Payroll"
              value="$542K"
              change="+5.2% from last month"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-accent"
            />
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
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-sm text-muted-foreground">Employee Retention</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Documents Expiring Soon</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2.5">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">$28.5K</p>
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
