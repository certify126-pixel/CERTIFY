
import { createHash, randomUUID } from 'crypto';
import { z } from 'zod';

/**
 * This file acts as a simple in-memory database for demonstration purposes.
 * In a real-world application, this would be replaced with a persistent database like MongoDB or PostgreSQL.
 * The data stored here is not persisted and will be lost when the server restarts.
 */


export const CertificateDocumentSchema = z.object({
    _id: z.string(),
    studentName: z.string(),
    rollNumber: z.string(),
    certificateId: z.string(),
    issueDate: z.string(),
    course: z.string(),
    institution: z.string(),
    certificateHash: z.string(),
    status: z.string(),
    createdAt: z.string(), // Allow only string for serialization
});
export type CertificateDocument = z.infer<typeof CertificateDocumentSchema>;


export interface UserDocument {
    _id: string;
    email: string;
    password: string; // Hashed password
    role: "User" | "Institution" | "Super Admin";
    createdAt: Date;
}

export interface BlacklistDocument {
    id: string;
    certificateId: string;
    rollNumber: string;
    reason: string;
    date: string;
}

// In-memory data stores
export const certificates: CertificateDocument[] = [
    {
        _id: randomUUID(),
        studentName: 'Rohan Kumar',
        rollNumber: 'CS-123',
        certificateId: 'JHU-84321-2023',
        issueDate: '2023-05-20',
        course: 'B.Tech in Computer Science',
        institution: 'Jawaharlal Nehru University',
        certificateHash: createHash('sha256').update('CS-123' + 'JHU-84321-2023' + '2023-05-20').digest('hex'),
        status: 'Issued',
        createdAt: new Date('2023-05-20T10:00:00Z'),
    }
];

export const users: UserDocument[] = [];

export const blacklist: BlacklistDocument[] = [
    { id: '1', certificateId: 'FAKE-123', rollNumber: 'CS-9999', reason: 'Invalid hash and details mismatch.', date: '2024-07-23' },
    { id: '2', certificateId: 'FORGED-456', rollNumber: 'EE-0000', reason: 'Record not found in university database.', date: '2024-07-22' },
];
