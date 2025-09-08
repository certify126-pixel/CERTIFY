
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldX } from "lucide-react";
import { blacklist } from "@/ai/flows/in-memory-db";

export default function BlacklistPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl flex items-center gap-3"><ShieldX/> Blacklisted Certificates</CardTitle>
           <CardDescription>
            A list of all certificates that have been identified as potentially fraudulent or invalid.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {blacklist.length === 0 ? (
                 <div className="text-center text-muted-foreground py-16">
                    <p>The blacklist is currently empty.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Reason for Blacklisting</TableHead>
                        <TableHead>Date Flagged</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blacklist.map((item) => (
                        <TableRow key={item.id} className="bg-destructive/10 hover:bg-destructive/20">
                            <TableCell className="font-mono">{item.certificateId}</TableCell>
                            <TableCell className="font-mono">{item.rollNumber}</TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell>{item.date}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </main>
  );
}
