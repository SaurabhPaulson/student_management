import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthPayload } from '../types';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

const extractToken = (authHeader: string | undefined): string => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Access token required');
    }
    return authHeader.substring(7);
};

export const authenticateAdmin = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = verifyToken(token);

        if (decoded.role !== 'admin') {
            throw new AuthorizationError('Admin access required');
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
            next(error);
        } else {
            next(new AuthenticationError('Invalid or expired token'));
        }
    }
};

export const authenticateStudent = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = verifyToken(token);

        if (decoded.role !== 'student') {
            throw new AuthorizationError('Student access required');
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
            next(error);
        } else {
            next(new AuthenticationError('Invalid or expired token'));
        }
    }
};
