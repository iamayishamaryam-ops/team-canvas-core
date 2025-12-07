import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, LogIn, LogOut, Users, Calendar as CalendarIcon, TrendingUp, Loader2 } from "lucide-react";
import { useAttendance, useTodayAttendance, useClockIn, useClockOut } from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInMinutes, parseISO } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "present":
      return "bg-success/10 text-success border-success/20";
    case "late":
      return "bg-warning/10 text-warning border-warning/20";
    case "on_leave":
      return "bg-primary/10 text-primary border-primary/20";
    case "absent":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "half_day":
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "";
  }
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return "-";
  return format(parseISO(dateString), "hh:mm a");
};

const calculateHours = (clockIn: string | null, clockOut: string | null) => {
  if (!clockIn) return "-";
  const start = parseISO(clockIn);
  const end = clockOut ? parseISO(clockOut) : new Date();
  const mins = differenceInMinutes(end, start);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  
  const { data: attendanceData, isLoading } = useAttendance(dateStr);
  const { data: todayAttendance, isLoading: todayLoading } = useTodayAttendance();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { isAdminLevel } = useAuth();

  const presentCount = attendanceData?.filter((a) => a.status === "present" || a.status === "late").length || 0;
  const totalCount = attendanceData?.length || 0;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const onLeaveCount = attendanceData?.filter((a) => a.status === "on_leave").length || 0;
  const absentCount = attendanceData?.filter((a) => a.status === "absent").length || 0;

  const myProgress = todayAttendance?.clock_in 
    ? Math.min(100, Math.round((differenceInMinutes(new Date(), parseISO(todayAttendance.clock_in)) / 480) * 100))
    : 0;

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-border hover:bg-secondary">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(selectedDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {!todayAttendance?.clock_in ? (
              <Button 
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                onClick={() => clockIn.mutate()}
                disabled={clockIn.isPending}
              >
                {clockIn.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
                Clock In
              </Button>
            ) : !todayAttendance?.clock_out ? (
              <Button 
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => clockOut.mutate()}
                disabled={clockOut.isPending}
              >
                {clockOut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
                Clock Out
              </Button>
            ) : null}
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
                <CalendarIcon className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-foreground">{onLeaveCount}</p>
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
                <p className="text-2xl font-bold text-foreground">{absentCount}</p>
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
        {todayLoading ? (
          <div className="rounded-xl border border-border bg-card p-6 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground">Your Status Today</h3>
                <p className="text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-success">
                    <LogIn className="h-5 w-5" />
                    <span className="text-sm font-medium">Clock In</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {formatTime(todayAttendance?.clock_in || null)}
                  </p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Clock Out</span>
                  </div>
                  <p className="text-2xl font-bold text-muted-foreground mt-1">
                    {formatTime(todayAttendance?.clock_out || null)}
                  </p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {calculateHours(todayAttendance?.clock_in || null, todayAttendance?.clock_out || null)}
                  </p>
                </div>
              </div>
              {todayAttendance?.status && (
                <Badge variant="outline" className={getStatusBadge(todayAttendance.status)}>
                  {todayAttendance.status.replace("_", " ")}
                </Badge>
              )}
            </div>
            {todayAttendance?.clock_in && !todayAttendance?.clock_out && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress to 8 hours</span>
                  <span className="text-foreground font-medium">{myProgress}%</span>
                </div>
                <Progress value={myProgress} className="h-2 bg-secondary" />
              </div>
            )}
          </div>
        )}

        {/* Attendance Table */}
        {isAdminLevel && (
          <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="border-b border-border p-5">
              <h3 className="text-lg font-semibold text-foreground">Team Attendance</h3>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")} - Real-time attendance tracking
              </p>
            </div>
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : attendanceData?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No attendance records for this date
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Employee</TableHead>
                    <TableHead className="text-muted-foreground">Check In</TableHead>
                    <TableHead className="text-muted-foreground">Check Out</TableHead>
                    <TableHead className="text-muted-foreground">Hours</TableHead>
                    <TableHead className="text-muted-foreground">Overtime</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData?.map((record, index) => (
                    <TableRow
                      key={record.id}
                      className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${(index + 4) * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-border">
                            <AvatarImage src={record.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {record.profiles?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-foreground">{record.profiles?.full_name || "Unknown"}</span>
                            <p className="text-xs text-muted-foreground">{record.profiles?.department || "-"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{formatTime(record.clock_in)}</TableCell>
                      <TableCell className="text-foreground">{formatTime(record.clock_out)}</TableCell>
                      <TableCell className="text-foreground font-medium">
                        {calculateHours(record.clock_in, record.clock_out)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {record.overtime_hours > 0 ? `${record.overtime_hours}h` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(record.status)}>
                          {record.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
