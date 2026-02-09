import express from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin';
import studentRoutes from './routes/student';
import { swaggerSpec } from './config/swagger';
import db from './config/database';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        message: 'Student Management System API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
    try {
        await db.one('SELECT 1 as result');
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
