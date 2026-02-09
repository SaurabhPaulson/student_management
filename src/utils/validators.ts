import { ValidationError } from './errors';

interface LoginInput {
    email: string;
    password: string;
}

interface CreateStudentInput {
    name: string;
    email: string;
    department: string;
    password: string;
}

interface AssignTaskInput {
    student_id: number;
    title: string;
    description?: string;
    due_time: string;
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateLoginInput = (data: any): LoginInput => {
    const { email, password } = data;

    if (!email || !password) {
        throw new ValidationError('Email and password are required');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new ValidationError('Email and password must be strings');
    }

    if (!isValidEmail(email)) {
        throw new ValidationError('Invalid email format');
    }

    if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
    }

    return { email: email.toLowerCase().trim(), password };
};

export const validateCreateStudentInput = (data: any): CreateStudentInput => {
    const { name, email, department, password } = data;

    if (!name || !email || !department || !password) {
        throw new ValidationError('All fields are required: name, email, department, password');
    }

    if (typeof name !== 'string' || typeof email !== 'string' ||
        typeof department !== 'string' || typeof password !== 'string') {
        throw new ValidationError('All fields must be strings');
    }

    if (!isValidEmail(email)) {
        throw new ValidationError('Invalid email format');
    }

    if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
    }

    if (name.trim().length < 2) {
        throw new ValidationError('Name must be at least 2 characters');
    }

    if (department.trim().length < 2) {
        throw new ValidationError('Department must be at least 2 characters');
    }

    return {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        department: department.trim(),
        password,
    };
};

export const validateAssignTaskInput = (data: any): AssignTaskInput => {
    const { student_id, title, description, due_time } = data;

    if (!student_id || !title || !due_time) {
        throw new ValidationError('student_id, title, and due_time are required');
    }

    if (!Number.isInteger(student_id) || student_id <= 0) {
        throw new ValidationError('student_id must be a positive integer');
    }

    if (typeof title !== 'string' || title.trim().length < 3) {
        throw new ValidationError('Title must be at least 3 characters');
    }

    const dueDate = new Date(due_time);
    if (isNaN(dueDate.getTime())) {
        throw new ValidationError('Invalid due_time format');
    }

    if (dueDate < new Date()) {
        throw new ValidationError('due_time cannot be in the past');
    }

    return {
        student_id,
        title: title.trim(),
        description: description?.trim() || '',
        due_time,
    };
};

export const validateTaskId = (id: string): number => {
    const taskId = parseInt(id, 10);

    if (isNaN(taskId) || taskId <= 0) {
        throw new ValidationError('Invalid task ID');
    }

    return taskId;
};
