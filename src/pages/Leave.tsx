import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Calendar, Plus, Check, X, Clock, Palmtree, Heart, Briefcase } from "lucide-react";

const leaveRequests = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    type: "Vacation",
    days: 5,
    startDate: "Dec 15, 2024",
    endDate: "Dec 19, 2024",
    reason: "Family vacation to Hawaii",
    status: "pending",
  },
  {
    id: 2,
    user: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    type: "Sick Leave",
    days: 2,
    startDate: "Dec 10, 2024",
    endDate: "Dec 11, 2024",
    reason: "Flu symptoms",
    status: "approved",
  },
  {
    id: 3,
    user: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    type: "Personal",
    days: 1,
    startDate: "Dec 20, 2024",
    endDate: "Dec 20, 2024",
    reason: "Personal appointment",
    status: "pending",
  },
  {
    id: 4,
    user: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    type: "Work From Home",
    days: 3,
    startDate: "Dec 12, 2024",
    endDate: "Dec 14, 2024",
    reason: "Internet installation at new apartment",
    status: "rejected",
  },
  {
    id: 5,
    user: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    type: "Vacation",
    days: 10,
    startDate: "Dec 23, 2024",
    endDate: "Jan 3, 2025",
    reason: "Holiday break with family",
    status: "approved",
  },
];

const leaveBalances = [
  { type: "Vacation", icon: Palmtree, used: 8, total: 20, color: "text-primary" },
  { type: "Sick Leave", icon: Heart, used: 2, total: 10, color: "text-destructive" },
  { type: "Personal", icon: Calendar, used: 1, total: 5, color: "text-warning" },
  { type: "Work From Home", icon: Briefcase, used: 5, total: 12, color: "text-success" },
];

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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Vacation":
      return <Palmtree className="h-4 w-4" />;
    case "Sick Leave":
      return <Heart className="h-4 w-4" />;
    case "Personal":
      return <Calendar className="h-4 w-4" />;
    case "Work From Home":
      return <Briefcase className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const Leave = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredRequests = leaveRequests.filter((req) => {
    if (activeTab === "all") return true;
    return req.status === activeTab;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground mt-1">Review and manage leave requests</p>
          </div>
          <Dialog>
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
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Leave Type</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="wfh">Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Start Date</Label>
                    <Input type="date" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">End Date</Label>
                    <Input type="date" className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Reason</Label>
                  <Textarea
                    placeholder="Brief description of your leave reason..."
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {leaveBalances.map((balance) => (
            <div
              key={balance.type}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-secondary p-2.5 ${balance.color}`}>
                  <balance.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{balance.type}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{balance.total - balance.used}</span>
                    <span className="text-sm text-muted-foreground">/ {balance.total} days</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary"
                  style={{ width: `${((balance.total - balance.used) / balance.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Leave Requests */}
        <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "200ms" }}>
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-border px-4">
              <TabsList className="bg-transparent h-14 gap-4">
                <TabsTrigger
                  value="all"
                  onClick={() => setActiveTab("all")}
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  All Requests
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  onClick={() => setActiveTab("pending")}
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  onClick={() => setActiveTab("approved")}
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Approved
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  onClick={() => setActiveTab("rejected")}
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="divide-y divide-border">
              {filteredRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 3) * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>{request.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{request.user}</p>
                        <Badge variant="outline" className={getStatusBadge(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {getTypeIcon(request.type)}
                        <span>{request.type}</span>
                        <span>•</span>
                        <span>{request.days} day{request.days > 1 ? "s" : ""}</span>
                        <span>•</span>
                        <span>{request.startDate} - {request.endDate}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                    </div>
                  </div>
                  {request.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
