import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Check,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Leave Request Approved",
    message: "Your vacation leave from Dec 15-19 has been approved by HR.",
    time: "5 minutes ago",
    type: "leave",
    read: false,
    icon: Calendar,
  },
  {
    id: 2,
    title: "Document Expiring Soon",
    message: "Michael Chen's work visa expires in 19 days. Please renew.",
    time: "1 hour ago",
    type: "document",
    read: false,
    icon: AlertTriangle,
  },
  {
    id: 3,
    title: "Expense Claim Submitted",
    message: "Lisa Anderson submitted an expense claim of $450.00.",
    time: "2 hours ago",
    type: "expense",
    read: false,
    icon: DollarSign,
  },
  {
    id: 4,
    title: "New Employee Joined",
    message: "Welcome David Kim to the Engineering team!",
    time: "Yesterday",
    type: "employee",
    read: true,
    icon: Users,
  },
  {
    id: 5,
    title: "Salary Processed",
    message: "November 2024 payroll has been processed successfully.",
    time: "2 days ago",
    type: "salary",
    read: true,
    icon: DollarSign,
  },
  {
    id: 6,
    title: "Attendance Alert",
    message: "5 employees have not clocked in today.",
    time: "3 days ago",
    type: "attendance",
    read: true,
    icon: Clock,
  },
];

const notificationSettings = [
  { id: "leave", label: "Leave Requests", description: "Notifications for leave approvals and requests" },
  { id: "document", label: "Document Expiry", description: "Alerts when documents are expiring soon" },
  { id: "expense", label: "Expense Claims", description: "Notifications for expense submissions and approvals" },
  { id: "attendance", label: "Attendance Alerts", description: "Daily attendance summaries and alerts" },
  { id: "salary", label: "Payroll Updates", description: "Salary processing and payment notifications" },
  { id: "email", label: "Email Notifications", description: "Receive notifications via email" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "leave":
      return "bg-primary/10 text-primary";
    case "document":
      return "bg-warning/10 text-warning";
    case "expense":
      return "bg-accent/10 text-accent";
    case "employee":
      return "bg-success/10 text-success";
    case "salary":
      return "bg-primary/10 text-primary";
    case "attendance":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const Notifications = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">Manage your alerts and notification preferences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border hover:bg-secondary">
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h2 className="text-lg font-semibold text-foreground">
                Recent Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-primary/10 text-primary border-primary/20">
                    {unreadCount} new
                  </Badge>
                )}
              </h2>
            </div>

            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 transition-all hover:border-primary/30 animate-fade-in ${
                    notification.read
                      ? "border-border bg-card"
                      : "border-primary/20 bg-primary/5"
                  }`}
                  style={{ animationDelay: `${(index + 2) * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2.5 ${getTypeColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">Customize your alerts</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor={setting.id} className="text-foreground cursor-pointer">
                        {setting.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      id={setting.id}
                      defaultChecked={true}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
