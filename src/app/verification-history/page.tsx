
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckCircle2, History, XCircle } from "lucide-react";


const history = [
    { id: '1', certificateId: 'JHU-84321-2023', verifier: 'Tata Steel', date: '2024-07-20', status: 'Verified' },
    { id: '2', certificateId: 'JHU-55432-2022', verifier: 'Infosys', date: '2024-07-19', status: 'Verified' },
    { id: '3', certificateId: 'JHU-19876-2023', verifier: 'Wipro', date: '2024-07-19', status: 'Verified' },
    { id: '4', certificateId: 'JHU-34567-2021', verifier: 'Deloitte', date: '2024-07-18', status: 'Failed' },
    { id: '5', certificateId: 'JHU-98765-2022', verifier: 'HCL', date: '2024-07-16', status: 'Verified' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isVerified = status === 'Verified';
  return (
    <Badge variant={isVerified ? 'default' : 'destructive'} className={cn(isVerified ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30', 'flex items-center w-fit')}>
      {isVerified ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
      {status}
    </Badge>
  );
};

export default function VerificationHistoryPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl flex items-center gap-3"><History/> Verification History</CardTitle>
           <CardDescription>
            A log of all verification attempts for certificates issued by your institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead>Verifier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {history.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.certificateId}</TableCell>
                        <TableCell>{item.verifier}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
