
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, History } from "lucide-react";
import { VerifyCertificateDialog } from "./verify-certificate-dialog";

export function UserDashboard() {
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
                <VerifyCertificateDialog>
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
                <div className="text-center text-muted-foreground py-10">
                    <p>You have not verified any certificates yet.</p>
                </div>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}
