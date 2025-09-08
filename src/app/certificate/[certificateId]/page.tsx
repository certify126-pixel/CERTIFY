
'use client';

import { CertificateTemplate } from '@/components/certificate-template';
import { getCertificateById } from '@/ai/flows/get-certificate-by-id-flow';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type CertificateData = {
    _id: string;
    studentName: string;
    rollNumber: string;
    certificateId: string;
    issueDate: string;
    course: string;
    institution: string;
    certificateHash: string;
};


export default function CertificatePage({ params }: { params: { certificateId: string } }) {
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            setLoading(true);
            try {
                const result = await getCertificateById({ certificateId: params.certificateId });
                if (result.success && result.certificate) {
                    // The flow returns an object, we need to cast it.
                    // A more robust solution might use a Zod schema on the client too.
                    setCertificate(result.certificate as CertificateData);
                } else {
                    setError(result.message || "Certificate not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching the certificate.");
            } finally {
                setLoading(false);
            }
        };

        if (params.certificateId) {
            fetchCertificate();
        }
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
                <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    if (!certificate) {
         return (
             <div className="flex h-screen w-full items-center justify-center bg-gray-200">
                <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold">Not Found</h2>
                    <p>The requested certificate could not be found.</p>
                </div>
            </div>
         )
    }

    return (
        <CertificateTemplate certificate={certificate} />
    );
}
