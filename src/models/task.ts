import db from '../config/database';
import { Task } from '../types';
import { DatabaseError } from '../utils/errors';

export const createTask = async (
    studentId: number,
    title: string,
    description: string,
    dueTime: Date
): Promise<Task> => {
    return await db.one(
        'INSERT INTO tasks (student_id, title, description, due_time) VALUES ($1, $2, $3, $4) RETURNING *',
        [studentId, title, description, dueTime]
    );
};

export const getTasksByStudentId = async (studentId: number): Promise<Task[]> => {
    try {
        return await db.manyOrNone(
            'SELECT * FROM tasks WHERE student_id = $1 ORDER BY due_time ASC',
            [studentId]
        );
    } catch (error) {
        console.error('Database error in getTasksByStudentId:', error);
        throw new DatabaseError('Failed to retrieve tasks');
    }
};

export const getAllTasks = async (): Promise<Task[]> => {
    try {
        return await db.manyOrNone(
            `SELECT t.*, s.name as student_name, s.email as student_email 
             FROM tasks t 
             JOIN students s ON t.student_id = s.id 
             ORDER BY t.created_at DESC`
        );
    } catch (error) {
        console.error('Database error in getAllTasks:', error);
        throw new DatabaseError('Failed to retrieve tasks');
    }
};

export const updateTaskStatus = async (
    taskId: number,
    studentId: number,
    status: string
): Promise<Task | null> => {
    return await db.oneOrNone(
        'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND student_id = $3 RETURNING *',
        [status, taskId, studentId]
    );
};

export const getTaskById = async (taskId: number, studentId: number): Promise<Task | null> => {
    return await db.oneOrNone(
        'SELECT * FROM tasks WHERE id = $1 AND student_id = $2',
        [taskId, studentId]
    );
};
