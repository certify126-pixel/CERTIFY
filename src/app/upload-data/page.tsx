
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function UploadDataPage() {
  return (
    <main className="flex-1 p-6 flex justify-center">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-4xl flex items-center gap-3"><Upload /> Upload Data</CardTitle>
                <CardDescription>
                    Upload new or previous certificate data in bulk using a CSV or Excel file.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label htmlFor="data-upload">Upload CSV or Excel File</Label>
                    <Input 
                        id="data-upload" 
                        type="file" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        className="file:text-primary file:font-semibold" 
                    />
                </div>
                <Button className="w-full" size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Process File
                </Button>
                <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>Make sure your file has columns for: `studentName`, `rollNumber`, `certificateId`, `issueDate`, `course`, and `institution`.</p>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
