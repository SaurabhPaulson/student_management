export interface Admin {
    id: number;
    email: string;
    password: string;
    created_at: Date;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    department: string;
    password: string;
    created_at: Date;
}

export interface Task {
    id: number;
    student_id: number;
    title: string;
    description: string;
    due_time: Date;
    status: 'pending' | 'completed' | 'overdue';
    created_at: Date;
    updated_at: Date;
}

export interface AuthPayload {
    id: number;
    email: string;
    role: 'admin' | 'student';
}
