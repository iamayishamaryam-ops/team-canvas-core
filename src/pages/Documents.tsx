import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash,
  Loader2,
} from "lucide-react";
import { useEmployeeDocuments, EmployeeDocument } from "@/hooks/useEmployeeDocuments";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, parseISO, format } from "date-fns";

const getDocumentStatus = (expiryDate: string | null) => {
  if (!expiryDate) return { status: "Valid", color: "success", days: null };
  
  const days = differenceInDays(parseISO(expiryDate), new Date());
  
  if (days < 0) return { status: "Expired", color: "destructive", days };
  if (days <= 30) return { status: "Expiring Soon", color: "warning", days };
  return { status: "Valid", color: "success", days };
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: employees } = useEmployees();
  const { user, isAdminLevel } = useAuth();
  
  // For admins, fetch all documents; for employees, fetch only their own
  const targetUserId = isAdminLevel ? undefined : user?.id;
  const { documents, isLoading, uploadDocument, deleteDocument, getDocumentUrl } = useEmployeeDocuments(targetUserId || "");

  const allDocuments = isAdminLevel 
    ? employees?.flatMap(emp => {
        const { documents: empDocs } = useEmployeeDocuments(emp.id);
        return empDocs?.map(doc => ({ ...doc, employee: emp })) || [];
      }) || []
    : documents?.map(doc => ({ ...doc, employee: employees?.find(e => e.id === user?.id) })) || [];

  const filteredDocuments = allDocuments.filter(doc => 
    doc.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringCount = filteredDocuments.filter(doc => {
    const status = getDocumentStatus(doc.expiry_date);
    return status.status === "Expiring Soon";
  }).length;

  const expiredCount = filteredDocuments.filter(doc => {
    const status = getDocumentStatus(doc.expiry_date);
    return status.status === "Expired";
  }).length;

  const handleUpload = async () => {
    if (!selectedFile || !selectedEmployee || !documentName) return;

    await uploadDocument.mutateAsync({
      file: selectedFile,
      fileName: documentName,
      expiryDate: expiryDate || undefined,
    });

    setUploadDialogOpen(false);
    setSelectedFile(null);
    setSelectedEmployee("");
    setDocumentName("");
    setExpiryDate("");
  };

  const handleDownload = async (doc: EmployeeDocument) => {
    const url = await getDocumentUrl(doc.file_path);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleDelete = async (doc: EmployeeDocument) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument.mutateAsync(doc.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage employee documents and track expiries</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Upload Document</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Upload a new document for an employee.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {isAdminLevel && (
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {employees?.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <Input
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="e.g., Employment Contract, ID Card"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>File</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="bg-secondary border-border"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={uploadDocument.isPending || !selectedFile || (!isAdminLevel && !user?.id) || (isAdminLevel && !selectedEmployee)}
                >
                  {uploadDocument.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Upload Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                <p className="text-2xl font-bold text-foreground">{filteredDocuments.length}</p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No documents found. Upload documents to see them here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Document</TableHead>
                  {isAdminLevel && <TableHead className="text-muted-foreground">Employee</TableHead>}
                  <TableHead className="text-muted-foreground">Upload Date</TableHead>
                  <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc, index) => {
                  const status = getDocumentStatus(doc.expiry_date);
                  return (
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
                          <span className="font-medium text-foreground">{doc.file_name}</span>
                        </div>
                      </TableCell>
                      {isAdminLevel && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-border">
                              <AvatarImage src={doc.employee?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {doc.employee?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground">{doc.employee?.full_name || "Unknown"}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-muted-foreground">
                        {format(parseISO(doc.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {doc.expiry_date ? format(parseISO(doc.expiry_date), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status.status)}
                          <Badge variant="outline" className={getStatusBadge(status.status)}>
                            {status.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
