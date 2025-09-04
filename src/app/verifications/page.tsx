
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileClock, ScanEye, XCircle } from "lucide-react";

type VerificationLog = {
  id: string;
  certificateId: string;
  studentName: string;
  status: "Verified" | "Potential Forgery" | "Record Not Found";
  date: string;
  verifier: string;
};

const verificationLogs: VerificationLog[] = [
  { id: "1", certificateId: "JHU-84321-2023", studentName: "Rohan Kumar", status: "Verified", date: "2024-07-20", verifier: "Tata Steel" },
  { id: "2", certificateId: "BIT-55432-2022", studentName: "Priya Sharma", status: "Verified", date: "2024-07-19", verifier: "Infosys" },
  { id: "3", certificateId: "RNC-19876-2023", studentName: "Amit Singh", status: "Potential Forgery", date: "2024-07-19", verifier: "Wipro" },
  { id: "4", certificateId: "XIS-34567-2021", studentName: "Anjali Devi", status: "Verified", date: "2024-07-18", verifier: "Deloitte" },
  { id: "5", certificateId: "CJU-67890-2023", studentName: "Suresh Gupta", status: "Record Not Found", date: "2024-07-17", verifier: "TCS" },
  { id: "6", certificateId: "JHU-98765-2022", studentName: "Meena Kumari", status: "Verified", date: "2024-07-16", verifier: "HCL" },
  { id: "7", certificateId: "BIT-12345-2023", studentName: "Fake Name", status: "Potential Forgery", date: "2024-07-15", verifier: "Cognizant" },
];

const StatusBadge = ({ status }: { status: VerificationLog["status"] }) => {
  const variants = {
    "Verified": { variant: "default", className: "bg-green-500/20 text-green-500 border-green-500/30", icon: <CheckCircle2 className="mr-1 h-3 w-3" />, },
    "Potential Forgery": { variant: "destructive", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", icon: <FileClock className="mr-1 h-3 w-3" />, },
    "Record Not Found": { variant: "secondary", className: "bg-red-500/20 text-red-500 border-red-500/30", icon: <XCircle className="mr-1 h-3 w-3" />, },
  };
  const { variant, className, icon } = variants[status];
  return (
    <Badge variant={variant as any} className={cn("capitalize flex items-center w-fit", className)}>
      {icon}
      {status}
    </Badge>
  );
};


export default function VerificationsPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl flex items-center gap-3"><ScanEye/> Verification Logs</CardTitle>
           <CardDescription>
            A comprehensive log of all certificate verification attempts across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Verifier</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {verificationLogs.map((log) => (
                    <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.certificateId}</TableCell>
                    <TableCell>{log.studentName}</TableCell>
                    <TableCell><StatusBadge status={log.status} /></TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.verifier}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
