import db from '../config/database';
import { Student } from '../types';
import { DatabaseError } from '../utils/errors';

export const findStudentByEmail = async (email: string): Promise<Student | null> => {
    return await db.oneOrNone('SELECT * FROM students WHERE email = $1', [email]);
};

export const createStudent = async (
    name: string,
    email: string,
    department: string,
    password: string
): Promise<Student> => {
    return await db.one(
        'INSERT INTO students (name, email, department, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, department, password]
    );
};

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        return await db.manyOrNone(
            'SELECT id, name, email, department, created_at FROM students ORDER BY created_at DESC'
        );
    } catch (error) {
        console.error('Database error in getAllStudents:', error);
        throw new DatabaseError('Failed to retrieve students');
    }
};

export const getStudentById = async (id: number): Promise<Student | null> => {
    return await db.oneOrNone('SELECT * FROM students WHERE id = $1', [id]);
};
