
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, PlusCircle } from "lucide-react";

// In a real app, this data would be fetched from a database.
const institutions = [
    { id: '1', name: 'Jawaharlal Nehru University', certificates: 1250, dateOnboarded: '2023-01-15' },
    { id: '2', name: 'Birla Institute of Technology, Mesra', certificates: 850, dateOnboarded: '2023-03-22' },
    { id: '3', name: 'Ranchi University', certificates: 2500, dateOnboarded: '2022-11-10' },
    { id: '4', name: 'St. Xavier\'s College, Ranchi', certificates: 700, dateOnboarded: '2023-05-30' },
];

export default function InstitutionsPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-4xl flex items-center gap-3"><Building/> Manage Institutions</CardTitle>
            <CardDescription>
                View, add, or manage institutions on the platform.
            </CardDescription>
          </div>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4"/>
              Add Institution
          </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Institution Name</TableHead>
                        <TableHead>Certificates Issued</TableHead>
                        <TableHead>Date Onboarded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {institutions.map((inst) => (
                    <TableRow key={inst.id}>
                        <TableCell className="font-medium">{inst.name}</TableCell>
                        <TableCell>{inst.certificates}</TableCell>
                        <TableCell>{inst.dateOnboarded}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
