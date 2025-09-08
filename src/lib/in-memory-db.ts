
type Certificate = {
    _id: string;
    studentName: string;
    rollNumber: string;
    certificateId: string;
    issueDate: string;
    course: string;
    institution: string;
    certificateHash: string;
    status: string;
    createdAt: string;
};

type User = {
    id: string;
    email: string;
    password: string; // Hashed password
    role: "User" | "Institution" | "Super Admin";
    createdAt: string;
};

type Database = {
    certificates: Certificate[];
    users: User[];
};

// This is an in-memory database. Data will be lost on server restart.
export const db: Database = {
    certificates: [],
    users: [],
};
