import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    action: "submitted leave request",
    time: "2 minutes ago",
    type: "leave",
  },
  {
    id: 2,
    user: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    action: "clocked in",
    time: "15 minutes ago",
    type: "attendance",
  },
  {
    id: 3,
    user: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    action: "uploaded document",
    time: "1 hour ago",
    type: "document",
  },
  {
    id: 4,
    user: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    action: "expense approved",
    time: "2 hours ago",
    type: "expense",
  },
  {
    id: 5,
    user: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    action: "completed onboarding",
    time: "3 hours ago",
    type: "employee",
  },
];

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "leave":
      return "bg-warning/10 text-warning border-warning/20";
    case "attendance":
      return "bg-success/10 text-success border-success/20";
    case "document":
      return "bg-primary/10 text-primary border-primary/20";
    case "expense":
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RecentActivity = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest actions across the system</p>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <Badge variant="outline" className={getBadgeVariant(activity.type)}>
              {activity.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
