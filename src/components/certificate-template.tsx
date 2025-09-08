
'use client';

import React from 'react';

type CertificateProps = {
    certificate: {
        studentName: string;
        course: string;
        issueDate: string;
        institution: string;
        certificateId: string;
        certificateHash: string;
    };
};

export function CertificateTemplate({ certificate }: CertificateProps) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(certificate.certificateHash)}`;
    
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            const day = utcDate.getDate();
            const month = utcDate.toLocaleString('default', { month: 'long' });
            const year = utcDate.getFullYear();

            let daySuffix;
            if (day % 10 === 1 && day !== 11) {
                daySuffix = 'st';
            } else if (day % 10 === 2 && day !== 12) {
                daySuffix = 'nd';
            } else if (day % 10 === 3 && day !== 13) {
                daySuffix = 'rd';
            } else {
                daySuffix = 'th';
            }

            return `${day}${daySuffix} of ${month}, ${year}`;
        } catch (e) {
            return dateString;
        }
    };


    return (
        <div id="certificate-wrapper" className="certificate-wrapper">
            <div className="certificate-container">
                <div className="certificate-border-main"></div>
                <div className="certificate-corner top-left"></div>
                <div className="certificate-corner top-right"></div>
                <div className="certificate-corner bottom-left"></div>
                <div className="certificate-corner bottom-right"></div>
                
                <div className="certificate-watermark">Q Certify</div>

                <header className="certificate-header">
                    <img src="https://placehold.co/100x100/3e2723/f7f6f1?text=Logo" alt="University Logo" className="certificate-logo" data-ai-hint="university logo" />
                    <div>
                        <h1 className="certificate-institution">{certificate.institution}</h1>
                        <p className="certificate-location">Ranchi, Jharkhand</p>
                    </div>
                </header>

                <div className="certificate-body">
                    <h2 className="certificate-title">CERTIFICATE OF GRADUATION</h2>
                    <p className="certificate-certify-text">This is to certify that</p>
                    <p className="certificate-student-name">{certificate.studentName}</p>
                    <p className="certificate-award-text">
                        has successfully completed all the academic requirements and is hereby awarded the degree of
                        <br />
                        <strong>{certificate.course}</strong>
                        <br />
                        on this day, {formatDate(certificate.issueDate)}.
                    </p>

                    <div className="certificate-signatures">
                        <div className="certificate-signature-block">
                            <div className="certificate-signature-line"></div>
                            <strong>Registrar</strong>
                        </div>
                        <div className="certificate-signature-block">
                            <div className="certificate-signature-line"></div>
                            <strong>Vice-Chancellor</strong>
                        </div>
                    </div>
                </div>

                <footer className="certificate-footer">
                    <div className="qr-code-block">
                        <img src={qrCodeUrl} alt="QR Code for Verification" className="certificate-qr-code" />
                    </div>
                    <div className="certificate-details">
                        <strong className="certificate-detail-label">Certify Unique ID:</strong>
                        <p className="certificate-detail-value font-code">{certificate.certificateId}</p>
                        <strong className="certificate-detail-label">Blockchain Hash (SHA-256):</strong>
                        <p className="certificate-detail-value font-code">{certificate.certificateHash}</p>
                    </div>
                    <div className="certificate-verification-badge">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="certificate-badge-icon">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="#1e88e5" strokeWidth="3"/>
                            <path d="M30 50 L45 65 L70 40" stroke="#1e88e5" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="certificate-badge-text">Verified by Q Certify</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
