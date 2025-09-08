
'use client';

import { CertificateTemplate } from '@/components/certificate-template';
import { getCertificateById } from '@/ai/flows/get-certificate-by-id-flow';
import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Printer, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


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
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);


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

    const handleDownload = async (format: 'pdf' | 'png') => {
        if (!certificateRef.current || isDownloading) return;

        setIsDownloading(true);
        try {
            // Temporarily increase scale for better quality
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null, 
            });

            const imgData = canvas.toDataURL('image/png');

            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `Q-Certify-${certificate?.certificateId || 'certificate'}.png`;
                link.href = imgData;
                link.click();
            } else {
                // Dimensions for A4 landscape
                const pdf = new jsPDF('l', 'mm', 'a4'); 
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const canvasAspectRatio = canvasWidth / canvasHeight;
                
                let finalWidth = pdfWidth;
                let finalHeight = pdfWidth / canvasAspectRatio;

                if (finalHeight > pdfHeight) {
                    finalHeight = pdfHeight;
                    finalWidth = pdfHeight * canvasAspectRatio;
                }
                
                const xOffset = (pdfWidth - finalWidth) / 2;
                const yOffset = (pdfHeight - finalHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
                pdf.save(`Q-Certify-${certificate?.certificateId || 'certificate'}.pdf`);
            }
        } catch (e) {
            console.error("Error generating file:", e);
            setError("Failed to generate the downloadable file.");
        } finally {
            setIsDownloading(false);
        }
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
             <div className="p-4 text-center print-hide space-x-4">
                <Button onClick={() => handleDownload('pdf')} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Download PDF
                </Button>
                 <Button onClick={() => handleDownload('png')} disabled={isDownloading} variant="outline">
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Download PNG
                </Button>
            </div>
            <div ref={certificateRef}>
                <CertificateTemplate certificate={templateProps} />
            </div>
        </div>
    );
}
