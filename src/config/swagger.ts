import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Management System API',
            version: '1.0.0',
            description: 'A comprehensive API for managing students and tasks with role-based authentication',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from login endpoint',
                },
            },
            schemas: {
                Admin: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', example: 'admin@example.com' },
                    },
                },
                Student: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        department: { type: 'string', example: 'Computer Science' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        student_id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Complete Assignment 1' },
                        description: { type: 'string', example: 'Finish the math assignment' },
                        due_time: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59Z' },
                        status: { type: 'string', enum: ['pending', 'overdue', 'completed'], example: 'pending' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Error message' },
                    },
                },
            },
        },
        tags: [
            { name: 'Admin', description: 'Admin authentication and management endpoints' },
            { name: 'Student', description: 'Student authentication and task endpoints' },
        ],
        paths: {
            '/api/admin/login': {
                post: {
                    tags: ['Admin'],
                    summary: 'Admin login',
                    description: 'Authenticate admin and receive JWT token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'admin@example.com' },
                                        password: { type: 'string', example: 'admin123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Login successful' },
                                            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                            admin: { $ref: '#/components/schemas/Admin' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        401: {
                            description: 'Invalid credentials',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/admin/students/create': {
                post: {
                    tags: ['Admin'],
                    summary: 'Create new student',
                    description: 'Add a new student to the system (Admin only)',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'department', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'John Doe' },
                                        email: { type: 'string', example: 'john@example.com' },
                                        department: { type: 'string', example: 'Computer Science' },
                                        password: { type: 'string', example: 'student123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Student created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Student created successfully' },
                                            student: { $ref: '#/components/schemas/Student' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        409: {
                            description: 'Email already exists',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/admin/students/list': {
                get: {
                    tags: ['Admin'],
                    summary: 'List all students',
                    description: 'Get all students in the system (Admin only)',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Students retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Students retrieved successfully' },
                                            count: { type: 'integer', example: 10 },
                                            students: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Student' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/admin/tasks/create': {
                post: {
                    tags: ['Admin'],
                    summary: 'Assign task to student',
                    description: 'Create and assign a new task to a student (Admin only)',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['student_id', 'title', 'due_time'],
                                    properties: {
                                        student_id: { type: 'integer', example: 1 },
                                        title: { type: 'string', example: 'Complete Assignment 1' },
                                        description: { type: 'string', example: 'Finish the math assignment' },
                                        due_time: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59Z' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Task assigned successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Task assigned successfully' },
                                            task: { $ref: '#/components/schemas/Task' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        404: {
                            description: 'Student not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/admin/tasks/list': {
                get: {
                    tags: ['Admin'],
                    summary: 'List all tasks',
                    description: 'Get all tasks in the system (Admin only)',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Tasks retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Tasks retrieved successfully' },
                                            count: { type: 'integer', example: 15 },
                                            tasks: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Task' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/student/login': {
                post: {
                    tags: ['Student'],
                    summary: 'Student login',
                    description: 'Authenticate student and receive JWT token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'john@example.com' },
                                        password: { type: 'string', example: 'student123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Login successful' },
                                            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                            student: { $ref: '#/components/schemas/Student' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        401: {
                            description: 'Invalid credentials',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/student/tasks/list': {
                get: {
                    tags: ['Student'],
                    summary: 'Get my tasks',
                    description: 'Get all tasks assigned to the authenticated student with calculated status',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Tasks retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Tasks retrieved successfully' },
                                            count: { type: 'integer', example: 5 },
                                            tasks: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Task' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/api/student/tasks/{id}': {
                patch: {
                    tags: ['Student'],
                    summary: 'Complete task',
                    description: 'Mark a task as completed',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Task ID',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Task marked as completed',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Task marked as completed' },
                                            task: { $ref: '#/components/schemas/Task' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request or task already completed',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        404: {
                            description: 'Task not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
