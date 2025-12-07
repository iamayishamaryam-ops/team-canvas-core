import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Calendar, Plus, Check, X, Clock, Palmtree, Heart, Briefcase, AlertTriangle, Loader2, Trash } from "lucide-react";
import { useLeaveRequests, useLeaveBalances, useCreateLeaveRequest, useUpdateLeaveRequest, useCheckTeamOverlap, useDeleteLeaveRequest } from "@/hooks/useLeave";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays, parseISO } from "date-fns";

const leaveTypeIcons: Record<string, typeof Palmtree> = {
  annual: Palmtree,
  sick: Heart,
  personal: Calendar,
  maternity: Heart,
  paternity: Heart,
  unpaid: Briefcase,
};

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  unpaid: "Unpaid Leave",
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

const Leave = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [overlapWarning, setOverlapWarning] = useState<{ count: number; employees: string[] } | null>(null);

  const { data: leaveRequests, isLoading } = useLeaveRequests(activeTab);
  const { data: leaveBalances } = useLeaveBalances();
  const createLeave = useCreateLeaveRequest();
  const updateLeave = useUpdateLeaveRequest();
  const deleteLeave = useDeleteLeaveRequest();
  const checkOverlap = useCheckTeamOverlap();
  const { user, isAdminLevel } = useAuth();

  // Check overlap when dates change
  useEffect(() => {
    if (startDate && endDate && user?.id) {
      checkOverlap.mutate(
        { userId: user.id, startDate, endDate },
        {
          onSuccess: (data) => {
            if (data && data.overlap_count >= 2) {
              setOverlapWarning({ count: data.overlap_count, employees: data.overlapping_employees || [] });
            } else {
              setOverlapWarning(null);
            }
          },
        }
      );
    }
  }, [startDate, endDate, user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate) return;

    const daysCount = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;

    createLeave.mutate(
      {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days_count: daysCount,
        reason,
        team_overlap_warning: overlapWarning !== null,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setLeaveType("");
          setStartDate("");
          setEndDate("");
          setReason("");
          setOverlapWarning(null);
        },
      }
    );
  };

  const handleApprove = async (id: string) => {
    // Check overlap before approving
    const request = leaveRequests?.find((r) => r.id === id);
    if (request) {
      const result = await checkOverlap.mutateAsync({
        userId: request.user_id,
        startDate: request.start_date,
        endDate: request.end_date,
      });

      if (result && result.overlap_count >= 2) {
        // Show warning but still allow approval
        const confirmApprove = window.confirm(
          `Warning: ${result.overlap_count} team members are already on leave on these dates (${result.overlapping_employees?.join(", ")}). Do you still want to approve?`
        );
        if (!confirmApprove) return;
      }
    }

    updateLeave.mutate({ id, status: "approved", reviewed_by: user?.id });
  };

  const handleReject = (id: string) => {
    updateLeave.mutate({ id, status: "rejected", reviewed_by: user?.id });
  };

  const balanceCards = [
    { type: "annual", icon: Palmtree, color: "text-primary" },
    { type: "sick", icon: Heart, color: "text-destructive" },
    { type: "personal", icon: Calendar, color: "text-warning" },
    { type: "unpaid", icon: Briefcase, color: "text-muted-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground mt-1">Review and manage leave requests</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Apply for Leave</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                
                {overlapWarning && (
                  <Alert variant="destructive" className="bg-warning/10 border-warning/20">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <AlertTitle className="text-warning">Team Overlap Warning</AlertTitle>
                    <AlertDescription className="text-warning/80">
                      {overlapWarning.count} team members are already on leave on these dates: {overlapWarning.employees.filter(Boolean).join(", ")}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label className="text-foreground">Reason</Label>
                  <Textarea
                    placeholder="Brief description of your leave reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={createLeave.isPending}
                >
                  {createLeave.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {balanceCards.map((card) => {
            const balance = leaveBalances?.find((b) => b.leave_type === card.type);
            const total = balance?.total_days || 0;
            const used = balance?.used_days || 0;
            const remaining = total - used;
            const Icon = card.icon;

            return (
              <div
                key={card.type}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-secondary p-2.5 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{leaveTypeLabels[card.type]}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">{remaining}</span>
                      <span className="text-sm text-muted-foreground">/ {total} days</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${total > 0 ? (remaining / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Leave Requests */}
        <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "200ms" }}>
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-border px-4">
              <TabsList className="bg-transparent h-14 gap-4">
                {["all", "pending", "approved", "rejected"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    onClick={() => setActiveTab(tab)}
                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none capitalize"
                  >
                    {tab === "all" ? "All Requests" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : leaveRequests?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No leave requests found
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leaveRequests?.map((request, index) => {
                  const Icon = leaveTypeIcons[request.leave_type] || Clock;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${(index + 3) * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-border">
                          <AvatarImage src={request.profiles?.avatar_url || undefined} />
                          <AvatarFallback>
                            {request.profiles?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {request.profiles?.full_name || "Unknown"}
                            </p>
                            <Badge variant="outline" className={getStatusBadge(request.status)}>
                              {request.status}
                            </Badge>
                            {request.team_overlap_warning && (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overlap
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Icon className="h-4 w-4" />
                            <span>{leaveTypeLabels[request.leave_type]}</span>
                            <span>•</span>
                            <span>{request.days_count} day{request.days_count > 1 ? "s" : ""}</span>
                            <span>•</span>
                            <span>
                              {format(parseISO(request.start_date), "MMM d")} - {format(parseISO(request.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                          {request.reason && (
                            <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === "pending" && isAdminLevel && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleReject(request.id)}
                              disabled={updateLeave.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => handleApprove(request.id)}
                              disabled={updateLeave.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        )}
                        {request.status === "pending" && request.user_id === user?.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => deleteLeave.mutate(request.id)}
                            disabled={deleteLeave.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
