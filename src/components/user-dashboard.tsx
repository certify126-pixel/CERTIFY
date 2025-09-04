
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, History, CheckCircle, XCircle } from "lucide-react";
import { VerifyCertificateDialog, VerificationHistoryItem } from "./verify-certificate-dialog";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function UserDashboard() {
  const [history, setHistory] = React.useState<VerificationHistoryItem[]>([]);

  const handleVerificationComplete = (result: VerificationHistoryItem) => {
    setHistory(prevHistory => [result, ...prevHistory]);
  };

  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="text-center transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Welcome to Q Certify</CardTitle>
                <CardDescription>Your secure and reliable certificate verification platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6">
                    Quickly and easily verify academic certificates to ensure their authenticity. Click the button below to get started.
                </p>
                <VerifyCertificateDialog onVerificationComplete={(result, details) => handleVerificationComplete(result)}>
                    <Button size="lg">
                        <FileCheck className="mr-2 h-5 w-5" />
                        Verify a Certificate Now
                    </Button>
                </VerifyCertificateDialog>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <History className="w-8 h-8 text-primary" />
                <div>
                    <CardTitle>Your Verification History</CardTitle>
                    <CardDescription>A log of the certificates you have recently verified.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                 {history.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        <p>You have not verified any certificates yet.</p>
                    </div>
                 ) : (
                    <ul className="space-y-4">
                        {history.map((item) => (
                            <li key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-4">
                                     {item.verified ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                     ) : (
                                        <XCircle className="h-6 w-6 text-red-500" />
                                     )}
                                     <div>
                                        <p className="font-semibold">
                                            Certificate ID:{" "}
                                            <span className="font-mono text-sm text-foreground/80">{item.certificateId}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(item.timestamp), "PPP p")}
                                        </p>
                                     </div>
                                </div>
                               <Badge variant={item.verified ? 'default' : 'destructive'} className={cn(item.verified ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30')}>
                                    {item.verified ? "Verified" : "Failed"}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                 )}
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
