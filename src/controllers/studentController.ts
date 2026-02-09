import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { findStudentByEmail } from '../models/student';
import { getTasksByStudentId, updateTaskStatus, getTaskById } from '../models/task';
import { comparePassword } from '../utils/password';
import { createToken } from '../utils/jwt';
import { asyncHandler } from '../middleware/errorHandler';
import {
    AuthenticationError,
    NotFoundError,
    ValidationError
} from '../utils/errors';
import { validateLoginInput, validateTaskId } from '../utils/validators';
import { Task } from '../types';

const calculateTaskStatus = (task: Task): 'pending' | 'overdue' | 'completed' => {
    if (task.status === 'completed') {
        return 'completed';
    }

    const now = new Date();
    const dueTime = new Date(task.due_time);

    return now > dueTime ? 'overdue' : 'pending';
};

export const loginStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = validateLoginInput(req.body);

    const student = await findStudentByEmail(email);
    if (!student) {
        throw new AuthenticationError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, student.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
    }

    const token = createToken({ id: student.id, email: student.email, role: 'student' });

    res.json({
        message: 'Login successful',
        token,
        student: {
            id: student.id,
            name: student.name,
            email: student.email,
            department: student.department,
        },
    });
});

export const getMyTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw new AuthenticationError('User not authenticated');
    }

    const studentId = req.user.id;
    const tasks = await getTasksByStudentId(studentId);

    const tasksWithStatus = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        due_time: task.due_time,
        status: calculateTaskStatus(task),
        created_at: task.created_at,
        updated_at: task.updated_at,
    }));

    res.json({
        message: 'Tasks retrieved successfully',
        count: tasksWithStatus.length,
        tasks: tasksWithStatus,
    });
});

export const completeTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw new AuthenticationError('User not authenticated');
    }

    const taskId = validateTaskId(req.params.id);
    const studentId = req.user.id;

    const task = await getTaskById(taskId, studentId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    if (task.status === 'completed') {
        throw new ValidationError('Task is already completed');
    }

    const updatedTask = await updateTaskStatus(taskId, studentId, 'completed');
    if (!updatedTask) {
        throw new NotFoundError('Task');
    }

    res.json({
        message: 'Task marked as completed',
        task: {
            id: updatedTask.id,
            title: updatedTask.title,
            description: updatedTask.description,
            due_time: updatedTask.due_time,
            status: updatedTask.status,
            updated_at: updatedTask.updated_at,
        },
    });
});
