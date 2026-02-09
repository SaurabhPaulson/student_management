import db from '../config/database';
import { Admin } from '../types';

export const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await db.oneOrNone('SELECT * FROM admins WHERE email = $1', [email]);
};

export const createAdmin = async (email: string, password: string): Promise<Admin> => {
    return await db.one(
        'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *',
        [email, password]
    );
};
