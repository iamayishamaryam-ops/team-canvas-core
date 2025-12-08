import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRecentActivity } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: activities, isLoading } = useRecentActivity();

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest actions across the system</p>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          ))
        ) : activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={activity.avatar || undefined} />
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
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
