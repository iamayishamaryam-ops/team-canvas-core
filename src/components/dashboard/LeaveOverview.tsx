import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

const pendingLeaves = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    type: "Vacation",
    days: 3,
    dates: "Dec 15 - Dec 17",
  },
  {
    id: 2,
    user: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    type: "Sick Leave",
    days: 1,
    dates: "Dec 10",
  },
  {
    id: 3,
    user: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    type: "Personal",
    days: 2,
    dates: "Dec 20 - Dec 21",
  },
];

const LeaveOverview = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pending Leave Requests</h3>
          <p className="text-sm text-muted-foreground">Requires your approval</p>
        </div>
        <Badge className="bg-warning/10 text-warning border-warning/20">
          {pendingLeaves.length} pending
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {pendingLeaves.map((leave, index) => (
          <div
            key={leave.id}
            className="flex items-center justify-between p-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={leave.avatar} />
                <AvatarFallback>{leave.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{leave.user}</p>
                <p className="text-xs text-muted-foreground">
                  {leave.type} • {leave.days} day{leave.days > 1 ? "s" : ""} • {leave.dates}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-success hover:bg-success/10 hover:text-success"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveOverview;
