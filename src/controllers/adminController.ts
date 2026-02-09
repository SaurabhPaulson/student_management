import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { findAdminByEmail } from '../models/admin';
import { createStudent, getAllStudents } from '../models/student';
import { createTask, getAllTasks } from '../models/task';
import { comparePassword, hashPassword } from '../utils/password';
import { createToken } from '../utils/jwt';
import { asyncHandler } from '../middleware/errorHandler';
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
    DatabaseError
} from '../utils/errors';
import {
    validateLoginInput,
    validateCreateStudentInput,
    validateAssignTaskInput,
} from '../utils/validators';

export const loginAdmin = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = validateLoginInput(req.body);

    const admin = await findAdminByEmail(email);
    if (!admin) {
        throw new AuthenticationError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
    }

    const token = createToken({ id: admin.id, email: admin.email, role: 'admin' });

    res.json({
        message: 'Login successful',
        token,
        admin: {
            id: admin.id,
            email: admin.email,
        },
    });
});

export const addStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const studentData = validateCreateStudentInput(req.body);

    const hashedPassword = await hashPassword(studentData.password);

    try {
        const student = await createStudent(
            studentData.name,
            studentData.email,
            studentData.department,
            hashedPassword
        );

        res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: student.id,
                name: student.name,
                email: student.email,
                department: student.department,
                created_at: student.created_at,
            },
        });
    } catch (error: any) {
        if (error.code === '23505') {
            throw new ConflictError('Email already exists');
        }
        throw new DatabaseError('Failed to create student');
    }
});

export const assignTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const taskData = validateAssignTaskInput(req.body);

    try {
        const task = await createTask(
            taskData.student_id,
            taskData.title,
            taskData.description || '',
            new Date(taskData.due_time)
        );

        res.status(201).json({
            message: 'Task assigned successfully',
            task: {
                id: task.id,
                student_id: task.student_id,
                title: task.title,
                description: task.description,
                due_time: task.due_time,
                status: task.status,
                created_at: task.created_at,
            },
        });
    } catch (error: any) {
        if (error.code === '23503') {
            throw new NotFoundError('Student');
        }
        throw new DatabaseError('Failed to assign task');
    }
});

export const listStudents = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
    const students = await getAllStudents();

    res.json({
        message: 'Students retrieved successfully',
        count: students.length,
        students,
    });
});

export const listTasks = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
    const tasks = await getAllTasks();

    res.json({
        message: 'Tasks retrieved successfully',
        count: tasks.length,
        tasks,
    });
});
