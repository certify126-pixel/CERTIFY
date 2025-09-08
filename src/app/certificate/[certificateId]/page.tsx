
'use client';

import { CertificateTemplate } from '@/components/certificate-template';
import { getCertificateById, type CertificateDocument } from '@/ai/flows/get-certificate-by-id-flow';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CertificatePage() {
    const params = useParams();
    const [certificate, setCertificate] = useState<CertificateDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const certificateId = params.certificateId as string;
        
        const fetchCertificate = async () => {
            if (!certificateId) {
                setError("No certificate ID provided.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const result = await getCertificateById({ certificateId });
                if (result.success && result.certificate) {
                    setCertificate(result.certificate as CertificateDocument);
                } else {
                    setError(result.message || "Certificate not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching the certificate.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [params.certificateId]);

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

    // Cast to the expected props type for the template, ensuring required fields have fallbacks.
    const templateProps = {
        studentName: certificate.studentName || "N/A",
        course: certificate.course || "N/A",
        issueDate: certificate.issueDate || new Date().toISOString(),
        institution: certificate.institution || "N/A",
        certificateId: certificate.certificateId || "N/A",
        certificateHash: certificate.certificateHash || "N/A",
    };

    return (
        <CertificateTemplate certificate={templateProps} />
    );
}
