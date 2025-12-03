import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, LogIn, LogOut, Users, Calendar, TrendingUp } from "lucide-react";

const todayAttendance = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    checkIn: "09:02 AM",
    checkOut: null,
    status: "Present",
    hours: "6h 32m",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    checkIn: "08:45 AM",
    checkOut: null,
    status: "Present",
    hours: "6h 49m",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    checkIn: null,
    checkOut: null,
    status: "On Leave",
    hours: "-",
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    checkIn: "09:15 AM",
    checkOut: "06:00 PM",
    status: "Left",
    hours: "8h 45m",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    checkIn: "08:30 AM",
    checkOut: null,
    status: "Present",
    hours: "7h 4m",
  },
  {
    id: 6,
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    checkIn: null,
    checkOut: null,
    status: "Absent",
    hours: "-",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Present":
      return "bg-success/10 text-success border-success/20";
    case "Left":
      return "bg-primary/10 text-primary border-primary/20";
    case "On Leave":
      return "bg-warning/10 text-warning border-warning/20";
    case "Absent":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

const Attendance = () => {
  const presentCount = todayAttendance.filter((a) => a.status === "Present" || a.status === "Left").length;
  const totalCount = todayAttendance.length;
  const attendanceRate = Math.round((presentCount / totalCount) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground mt-1">Track employee attendance and timesheets</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border hover:bg-secondary">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Clock className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold text-foreground">{presentCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-foreground">
                  {todayAttendance.filter((a) => a.status === "On Leave").length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-foreground">
                  {todayAttendance.filter((a) => a.status === "Absent").length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clock In/Out Card */}
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground">Your Status Today</h3>
              <p className="text-muted-foreground mt-1">Tuesday, December 3, 2024</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-success">
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-medium">Clock In</span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">09:00 AM</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Clock Out</span>
                </div>
                <p className="text-2xl font-bold text-muted-foreground mt-1">--:-- --</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-primary mt-1">6h 34m</p>
              </div>
            </div>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" />
              Clock Out
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress to 8 hours</span>
              <span className="text-foreground font-medium">82%</span>
            </div>
            <Progress value={82} className="h-2 bg-secondary" />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="border-b border-border p-5">
            <h3 className="text-lg font-semibold text-foreground">Today's Attendance</h3>
            <p className="text-sm text-muted-foreground">Real-time attendance tracking</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Check In</TableHead>
                <TableHead className="text-muted-foreground">Check Out</TableHead>
                <TableHead className="text-muted-foreground">Hours</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAttendance.map((record, index) => (
                <TableRow
                  key={record.id}
                  className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarImage src={record.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {record.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{record.checkIn || "-"}</TableCell>
                  <TableCell className="text-foreground">{record.checkOut || "-"}</TableCell>
                  <TableCell className="text-foreground font-medium">{record.hours}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
