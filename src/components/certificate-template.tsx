
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
    
    // Format date nicely, e.g., "8th of September, 2025"
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
             // to fix timezone issues
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
            return dateString; // fallback to original string
        }
    };


    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Montserrat:wght@400;500&family=Playfair+Display:wght@700&family=Roboto+Mono&display=swap');
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            `}</style>
            <style jsx>{`
                .certificate-page-body {
                    font-family: 'Montserrat', sans-serif;
                    background-color: #e0e0e0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    box-sizing: border-box;
                    min-height: 100vh;
                    margin: 0;
                }

                .certificate-container {
                    width: 1123px; /* A4 landscape width at 96 DPI */
                    height: 794px; /* A4 landscape height at 96 DPI */
                    background-color: #f7f6f1;
                    border: 2px solid #5d4037;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    padding: 30px;
                    position: relative;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .certificate-border {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    right: 15px;
                    bottom: 15px;
                    border: 5px solid #a1887f;
                    box-sizing: border-box;
                    pointer-events: none; /* Allows clicks to go through to content if needed */
                }
                
                .corner-decoration {
                    position: absolute;
                    width: 25px;
                    height: 25px;
                    border: 5px solid #5d4037;
                }
                .top-left { top: 5px; left: 5px; border-right: none; border-bottom: none; }
                .top-right { top: 5px; right: 5px; border-left: none; border-bottom: none; }
                .bottom-left { bottom: 5px; left: 5px; border-right: none; border-top: none; }
                .bottom-right { bottom: 5px; right: 5px; border-left: none; border-top: none; }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-30deg);
                    font-size: 100px;
                    color: #5d4037;
                    opacity: 0.05;
                    font-family: 'Cormorant Garamond', serif;
                    font-weight: 700;
                    pointer-events: none;
                    z-index: 0;
                }

                .cert-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    border-bottom: 2px solid #d7ccc8;
                    padding-bottom: 15px;
                    z-index: 2;
                }

                .university-logo {
                    width: 80px;
                    height: 80px;
                    margin-right: 20px;
                }

                .university-details h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 36px;
                    color: #3e2723;
                    margin: 0;
                }

                .university-details p {
                    font-size: 14px;
                    color: #6d4c41;
                    margin: 5px 0 0;
                }

                .certificate-body {
                    text-align: center;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    z-index: 2;
                }

                .certificate-body h2 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 28px;
                    color: #5d4037;
                    margin: 20px 0 10px;
                }
                
                .certificate-body .recipient-text {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #6d4c41;
                }

                .student-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 48px;
                    font-weight: 700;
                    color: #3e2723;
                    margin: 10px 0;
                }

                .certificate-body .achievement-text {
                    font-size: 16px;
                    margin: 20px 30px 0;
                    line-height: 1.6;
                    color: #6d4c41;
                }

                .signatures {
                    display: flex;
                    justify-content: space-around;
                    text-align: center;
                    margin-top: 40px;
                    z-index: 2;
                }

                .signature-block {
                    font-size: 14px;
                    color: #3e2723;
                }
                
                .signature-line {
                    border-top: 1px solid #3e2723;
                    width: 200px;
                    margin: 40px auto 10px;
                }

                .cert-footer {
                    border-top: 2px solid #d7ccc8;
                    padding-top: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    z-index: 2;
                }

                .qr-code-block img {
                    width: 100px;
                    height: 100px;
                }

                .security-details {
                    text-align: left;
                    font-size: 10px;
                    flex-grow: 1;
                    margin-left: 20px;
                    color: #795548;
                }

                .security-details strong {
                    color: #3e2723;
                    font-weight: 500;
                }
                
                .security-details p {
                    font-family: 'Roboto Mono', monospace;
                    margin: 5px 0;
                    word-break: break-all;
                }

                .certify-seal {
                    text-align: center;
                    color: #1e88e5;
                }

                .certify-seal svg {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 5px;
                }

                .certify-seal p {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 500;
                    font-size: 12px;
                    margin: 0;
                }
                
                @media print {
                  .certificate-page-body {
                    padding: 0;
                    margin: 0;
                    background-color: #fff;
                  }
                  .certificate-container {
                    box-shadow: none;
                    border: 2px solid #5d4037;
                    width: 100%;
                    height: 100%;
                  }
                }
            `}</style>
            <div className="certificate-page-body">
                <div className="certificate-container">
                    <div className="certificate-border"></div>
                    <div className="corner-decoration top-left"></div>
                    <div className="corner-decoration top-right"></div>
                    <div className="corner-decoration bottom-left"></div>
                    <div className="corner-decoration bottom-right"></div>
                    
                    <div className="watermark">Certify</div>

                    <header className="cert-header">
                        <img src="https://placehold.co/100x100/3e2723/f7f6f1?text=Logo" alt="University Logo" className="university-logo" data-ai-hint="university logo" />
                        <div className="university-details">
                            <h1>{certificate.institution}</h1>
                            <p>Ranchi, Jharkhand</p>
                        </div>
                    </header>

                    <div className="certificate-body">
                        <h2>CERTIFICATE OF GRADUATION</h2>
                        <p className="recipient-text">This is to certify that</p>
                        <p className="student-name">{certificate.studentName}</p>
                        <p className="achievement-text">
                            has successfully completed all the academic requirements and is hereby awarded the degree of
                            <br />
                            <strong>{certificate.course}</strong>
                            <br />
                            on this day, {formatDate(certificate.issueDate)}.
                        </p>

                        <div className="signatures">
                            <div className="signature-block">
                                <div className="signature-line"></div>
                                <strong>Registrar</strong>
                            </div>
                            <div className="signature-block">
                                <div className="signature-line"></div>
                                <strong>Vice-Chancellor</strong>
                            </div>
                        </div>
                    </div>

                    <footer className="cert-footer">
                        <div className="qr-code-block">
                            <img src={qrCodeUrl} alt="QR Code for Verification" />
                        </div>
                        <div className="security-details">
                            <strong>Certify Unique ID:</strong>
                            <p>{certificate.certificateId}</p>
                            <strong>Blockchain Hash (SHA-256):</strong>
                            <p>{certificate.certificateHash}</p>
                        </div>
                        <div className="certify-seal">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="#1e88e5" strokeWidth="3"/>
                                <path d="M30 50 L45 65 L70 40" stroke="#1e88e5" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p>Verified by Certify</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
