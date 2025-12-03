import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Employment Contract",
    employee: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    type: "Contract",
    uploadDate: "Jan 15, 2022",
    expiryDate: "Jan 15, 2025",
    status: "Valid",
    daysToExpiry: 408,
  },
  {
    id: 2,
    name: "Work Visa",
    employee: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    type: "Visa",
    uploadDate: "Mar 22, 2023",
    expiryDate: "Dec 22, 2024",
    status: "Expiring Soon",
    daysToExpiry: 19,
  },
  {
    id: 3,
    name: "ID Card",
    employee: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    type: "ID",
    uploadDate: "Jul 8, 2023",
    expiryDate: "Jul 8, 2028",
    status: "Valid",
    daysToExpiry: 1313,
  },
  {
    id: 4,
    name: "Medical Certificate",
    employee: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    type: "Medical",
    uploadDate: "Nov 30, 2023",
    expiryDate: "Nov 30, 2024",
    status: "Expired",
    daysToExpiry: -3,
  },
  {
    id: 5,
    name: "Driving License",
    employee: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    type: "License",
    uploadDate: "Feb 14, 2024",
    expiryDate: "Feb 14, 2029",
    status: "Valid",
    daysToExpiry: 1534,
  },
  {
    id: 6,
    name: "NDA Agreement",
    employee: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    type: "Contract",
    uploadDate: "Sep 5, 2020",
    expiryDate: "Dec 10, 2024",
    status: "Expiring Soon",
    daysToExpiry: 7,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Valid":
      return "bg-success/10 text-success border-success/20";
    case "Expiring Soon":
      return "bg-warning/10 text-warning border-warning/20";
    case "Expired":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Valid":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "Expiring Soon":
      return <Clock className="h-4 w-4 text-warning" />;
    case "Expired":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const Documents = () => {
  const expiringCount = documents.filter((d) => d.status === "Expiring Soon").length;
  const expiredCount = documents.filter((d) => d.status === "Expired").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage employee documents and track expiries</p>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Alert Cards */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-warning/80">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning">{expiringCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-destructive/80">Expired</p>
                <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
          <Button variant="outline" className="border-border hover:bg-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Document</TableHead>
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Upload Date</TableHead>
                <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-secondary p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 border border-border">
                        <AvatarImage src={doc.avatar} />
                        <AvatarFallback className="text-xs">
                          {doc.employee.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{doc.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary border-border text-muted-foreground">
                      {doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadDate}</TableCell>
                  <TableCell className="text-foreground">{doc.expiryDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <Badge variant="outline" className={getStatusBadge(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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

export default Documents;
