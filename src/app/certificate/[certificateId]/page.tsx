
'use client';

import { CertificateTemplate } from '@/components/certificate-template';
import { getCertificateById } from '@/ai/flows/get-certificate-by-id-flow';
import React, { useEffect, useState } from 'react';
import { Loader2, Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Define a serializable certificate type for the client-side state
type SerializableCertificate = {
    _id: string;
    studentName: string;
    course: string;
    issueDate: string;
    institution: string;
    certificateId: string;
    certificateHash: string;
    createdAt: string;
    status: string;
};

export default function CertificatePage() {
    const params = useParams();
    const [certificate, setCertificate] = useState<SerializableCertificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const certificateId = params.certificateId as string;
        
        if (!certificateId) {
            // Wait for params to be available
            return;
        }

        const fetchCertificate = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getCertificateById({ certificateId });
                if (result) {
                    setCertificate(result as SerializableCertificate);
                } else {
                    setError("Certificate not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching the certificate.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [params.certificateId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-200">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-semibold">Loading Certificate...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-200">
                <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    if (!certificate) {
         return (
             <div className="flex h-screen w-full items-center justify-center bg-gray-200">
                <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold">Not Found</h2>
                    <p>The requested certificate could not be found.</p>
                </div>
            </div>
         )
    }

    const templateProps = {
        studentName: certificate.studentName || "N/A",
        course: certificate.course || "N/A",
        issueDate: certificate.issueDate || new Date().toISOString(),
        institution: certificate.institution || "N/A",
        certificateId: certificate.certificateId || "N/A",
        certificateHash: certificate.certificateHash || "N/A",
    };

    return (
        <div className="bg-gray-200 certificate-page-body">
             <div className="p-4 text-center print-hide">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print / Save as PDF
                </Button>
            </div>
            <CertificateTemplate certificate={templateProps} />
        </div>
    );
}
