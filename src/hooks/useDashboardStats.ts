import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Get total employees
      const { count: totalEmployees } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get today's attendance (present)
      const { count: presentToday } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("date", today)
        .eq("status", "present");

      // Get employees on leave today
      const { count: onLeave } = await supabase
        .from("leave_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .lte("start_date", today)
        .gte("end_date", today);

      // Get pending leave requests
      const { count: pendingLeave } = await supabase
        .from("leave_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Get monthly payroll total
      const { data: payslips } = await supabase
        .from("payslips")
        .select("net_salary")
        .eq("month", currentMonth)
        .eq("year", currentYear);

      const monthlyPayroll = payslips?.reduce((sum, p) => sum + Number(p.net_salary), 0) || 0;

      // Get pending expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("status", "pending");

      const pendingExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      return {
        totalEmployees: totalEmployees || 0,
        presentToday: presentToday || 0,
        onLeave: onLeave || 0,
        pendingLeave: pendingLeave || 0,
        monthlyPayroll,
        pendingExpenses,
        attendanceRate: totalEmployees ? Math.round((presentToday || 0) / totalEmployees * 100) : 0,
      };
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const activities: Array<{
        id: string;
        user: string;
        avatar: string | null;
        action: string;
        time: string;
        type: string;
      }> = [];

      // Get recent leave requests
      const { data: leaves } = await supabase
        .from("leave_requests")
        .select(`
          id, created_at, status, leave_type,
          profiles!leave_requests_user_id_fkey (full_name, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      leaves?.forEach((leave) => {
        const profile = leave.profiles as { full_name: string | null; avatar_url: string | null } | null;
        activities.push({
          id: `leave-${leave.id}`,
          user: profile?.full_name || "Unknown",
          avatar: profile?.avatar_url,
          action: `${leave.status === "pending" ? "submitted" : leave.status} ${leave.leave_type} request`,
          time: formatTimeAgo(new Date(leave.created_at!)),
          type: "leave",
        });
      });

      // Get recent attendance
      const { data: attendance } = await supabase
        .from("attendance")
        .select(`
          id, clock_in, status,
          profiles:user_id (full_name, avatar_url)
        `)
        .order("clock_in", { ascending: false })
        .limit(3);

      attendance?.forEach((att) => {
        const profile = att.profiles as { full_name: string | null; avatar_url: string | null } | null;
        if (att.clock_in) {
          activities.push({
            id: `att-${att.id}`,
            user: profile?.full_name || "Unknown",
            avatar: profile?.avatar_url,
            action: "clocked in",
            time: formatTimeAgo(new Date(att.clock_in)),
            type: "attendance",
          });
        }
      });

      // Get recent expenses
      const { data: expensesList } = await supabase
        .from("expenses")
        .select(`
          id, created_at, status, amount,
          profiles!expenses_user_id_fkey (full_name, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(2);

      expensesList?.forEach((exp) => {
        const profile = exp.profiles as { full_name: string | null; avatar_url: string | null } | null;
        activities.push({
          id: `exp-${exp.id}`,
          user: profile?.full_name || "Unknown",
          avatar: profile?.avatar_url,
          action: `submitted $${exp.amount} expense`,
          time: formatTimeAgo(new Date(exp.created_at!)),
          type: "expense",
        });
      });

      // Sort by time and limit
      return activities
        .sort((a, b) => {
          const timeA = parseTimeAgo(a.time);
          const timeB = parseTimeAgo(b.time);
          return timeA - timeB;
        })
        .slice(0, 5);
    },
  });
}

export function usePendingLeaves() {
  return useQuery({
    queryKey: ["pending-leaves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          id, leave_type, days_count, start_date, end_date,
          profiles!leave_requests_user_id_fkey (full_name, avatar_url)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function parseTimeAgo(timeStr: string): number {
  if (timeStr === "just now") return 0;
  const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
  if (!match) return Infinity;
  const num = parseInt(match[1]);
  const unit = match[2];
  if (unit === "minute") return num;
  if (unit === "hour") return num * 60;
  if (unit === "day") return num * 1440;
  return Infinity;
}
