import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { usePendingLeaves } from "@/hooks/useDashboardStats";
import { useUpdateLeaveRequest } from "@/hooks/useLeave";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const LeaveOverview = () => {
  const { data: pendingLeaves, isLoading } = usePendingLeaves();
  const updateLeave = useUpdateLeaveRequest();
  const { isAdminLevel } = useAuth();

  const handleApprove = (id: string) => {
    updateLeave.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string) => {
    updateLeave.mutate({ id, status: "rejected" });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (startDate === endDate) {
      return format(start, "MMM d");
    }
    return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pending Leave Requests</h3>
          <p className="text-sm text-muted-foreground">Requires your approval</p>
        </div>
        <Badge className="bg-warning/10 text-warning border-warning/20">
          {pendingLeaves?.length || 0} pending
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))
        ) : pendingLeaves && pendingLeaves.length > 0 ? (
          pendingLeaves.map((leave, index) => {
            const profile = leave.profiles as { full_name: string | null; avatar_url: string | null } | null;
            return (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {(profile?.full_name || "U").split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{profile?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.leave_type} • {leave.days_count} day{leave.days_count > 1 ? "s" : ""} • {formatDateRange(leave.start_date, leave.end_date)}
                    </p>
                  </div>
                </div>
                {isAdminLevel && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleReject(leave.id)}
                      disabled={updateLeave.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-success hover:bg-success/10 hover:text-success"
                      onClick={() => handleApprove(leave.id)}
                      disabled={updateLeave.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No pending leave requests
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveOverview;
