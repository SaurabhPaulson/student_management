import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

interface ErrorResponse {
    error: string;
    statusCode: number;
    timestamp: string;
    path?: string;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const timestamp = new Date().toISOString();

    if (err instanceof AppError) {
        const errorResponse: ErrorResponse = {
            error: err.message,
            statusCode: err.statusCode,
            timestamp,
            path: req.path,
        };

        if (!err.isOperational) {
            console.error('Non-operational error:', {
                message: err.message,
                stack: err.stack,
                timestamp,
            });
        }

        res.status(err.statusCode).json(errorResponse);
        return;
    }

    console.error('Unexpected error:', {
        message: err.message,
        stack: err.stack,
        timestamp,
    });

    const errorResponse: ErrorResponse = {
        error: 'Internal server error',
        statusCode: 500,
        timestamp,
    };

    res.status(500).json(errorResponse);
};

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
