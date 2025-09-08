
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
                
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                   .certificate-page-body {
                    padding: 0;
                    margin: 0;
                    background-color: #fff;
                  }
                  .certificate-container {
                    box-shadow: none !important;
                    border: 2px solid #5d4037 !important;
                    width: 100% !important;
                    height: 100% !important;
                  }
                }
            `}</style>
            <div style={{
                fontFamily: "'Montserrat', sans-serif",
                backgroundColor: "#e0e0e0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                boxSizing: "border-box",
                minHeight: "100vh",
                margin: 0
            }} className="certificate-page-body">
                <div style={{
                    width: "1123px",
                    height: "794px",
                    backgroundColor: "#f7f6f1",
                    border: "2px solid #5d4037",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    padding: "30px",
                    position: "relative",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }} className="certificate-container">
                    <div style={{
                        position: "absolute",
                        top: "15px",
                        left: "15px",
                        right: "15px",
                        bottom: "15px",
                        border: "5px solid #a1887f",
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}></div>
                    <div style={{position: 'absolute', width: '25px', height: '25px', border: '5px solid #5d4037', top: '5px', left: '5px', borderRight: 'none', borderBottom: 'none'}}></div>
                    <div style={{position: 'absolute', width: '25px', height: '25px', border: '5px solid #5d4037', top: '5px', right: '5px', borderLeft: 'none', borderBottom: 'none'}}></div>
                    <div style={{position: 'absolute', width: '25px', height: '25px', border: '5px solid #5d4037', bottom: '5px', left: '5px', borderRight: 'none', borderTop: 'none'}}></div>
                    <div style={{position: 'absolute', width: '25px', height: '25px', border: '5px solid #5d4037', bottom: '5px', right: '5px', borderLeft: 'none', borderTop: 'none'}}></div>
                    
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-30deg)",
                        fontSize: "100px",
                        color: "#5d4037",
                        opacity: 0.05,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 700,
                        pointerEvents: "none",
                        zIndex: 0
                    }}>Certify</div>

                    <header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        borderBottom: "2px solid #d7ccc8",
                        paddingBottom: "15px",
                        zIndex: 2
                    }}>
                        <img src="https://placehold.co/100x100/3e2723/f7f6f1?text=Logo" alt="University Logo" style={{width: '80px', height: '80px', marginRight: '20px'}} data-ai-hint="university logo" />
                        <div>
                            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#3e2723", margin: 0 }}>{certificate.institution}</h1>
                            <p style={{fontSize: "14px", color: "#6d4c41", margin: "5px 0 0"}}>Ranchi, Jharkhand</p>
                        </div>
                    </header>

                    <div style={{
                        textAlign: "center",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        zIndex: 2
                    }}>
                        <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: "#5d4037", margin: "20px 0 10px"}}>CERTIFICATE OF GRADUATION</h2>
                        <p style={{fontSize: "16px", marginBottom: "20px", color: "#6d4c41"}}>This is to certify that</p>
                        <p style={{fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: 700, color: "#3e2723", margin: "10px 0"}}>{certificate.studentName}</p>
                        <p style={{fontSize: "16px", margin: "20px 30px 0", lineHeight: 1.6, color: "#6d4c41"}}>
                            has successfully completed all the academic requirements and is hereby awarded the degree of
                            <br />
                            <strong>{certificate.course}</strong>
                            <br />
                            on this day, {formatDate(certificate.issueDate)}.
                        </p>

                        <div style={{display: "flex", justifyContent: "space-around", textAlign: "center", marginTop: "40px", zIndex: 2}}>
                            <div style={{fontSize: "14px", color: "#3e2723"}}>
                                <div style={{borderTop: "1px solid #3e2723", width: "200px", margin: "40px auto 10px"}}></div>
                                <strong>Registrar</strong>
                            </div>
                            <div style={{fontSize: "14px", color: "#3e2723"}}>
                                <div style={{borderTop: "1px solid #3e2723", width: "200px", margin: "40px auto 10px"}}></div>
                                <strong>Vice-Chancellor</strong>
                            </div>
                        </div>
                    </div>

                    <footer style={{
                        borderTop: "2px solid #d7ccc8",
                        paddingTop: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        zIndex: 2
                    }}>
                        <div className="qr-code-block">
                            <img src={qrCodeUrl} alt="QR Code for Verification" style={{width: '100px', height: '100px'}} />
                        </div>
                        <div style={{textAlign: "left", fontSize: "10px", flexGrow: 1, marginLeft: "20px", color: "#795548"}}>
                            <strong style={{color: "#3e2723", fontWeight: 500}}>Certify Unique ID:</strong>
                            <p style={{fontFamily: "'Roboto Mono', monospace", margin: "5px 0", wordBreak: "break-all"}}>{certificate.certificateId}</p>
                            <strong style={{color: "#3e2723", fontWeight: 500}}>Blockchain Hash (SHA-256):</strong>
                            <p style={{fontFamily: "'Roboto Mono', monospace", margin: "5px 0", wordBreak: "break-all"}}>{certificate.certificateHash}</p>
                        </div>
                        <div style={{textAlign: "center", color: "#1e88e5"}}>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{width: '60px', height: '60px', marginBottom: '5px'}}>
                                <circle cx="50" cy="50" r="48" fill="none" stroke="#1e88e5" strokeWidth="3"/>
                                <path d="M30 50 L45 65 L70 40" stroke="#1e88e5" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: "12px", margin: 0}}>Verified by Certify</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
