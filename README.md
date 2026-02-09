# Student Management System API

A production-ready REST API built with Express.js, TypeScript, and PostgreSQL for managing students and tasks with role-based authentication.

## Features

- **Admin Panel**: Complete student and task management
- **Student Interface**: View and manage assigned tasks
- **JWT Authentication**: Secure token-based authentication
- **Automatic Status Calculation**: Tasks automatically marked as pending, overdue, or completed
- **Interactive API Documentation**: Swagger UI for testing endpoints
- **Type-Safe**: Full TypeScript implementation
- **PostgreSQL Database**: Reliable relational database

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with pg-promise
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI 3.0
- **Environment Variables**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "Student Management System"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

### 4. Set up database

Create the database and tables using the provided SQL script:

```bash
psql -U postgres -f database/init.sql
```

Or manually:

```sql
CREATE DATABASE student_management;
\c student_management;
```

Then run the table creation commands from `database/init.sql`.

### 5. Build the project

```bash
npm run build
```

### 6. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/login` | Admin login | No |
| POST | `/api/admin/students/create` | Create new student | Yes (Admin) |
| GET | `/api/admin/students/list` | List all students | Yes (Admin) |
| POST | `/api/admin/tasks/create` | Assign task to student | Yes (Admin) |
| GET | `/api/admin/tasks/list` | List all tasks | Yes (Admin) |

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/student/login` | Student login | No |
| GET | `/api/student/tasks/list` | Get assigned tasks | Yes (Student) |
| PATCH | `/api/student/tasks/:id` | Mark task as completed | Yes (Student) |

## API Usage Examples

### Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@example.com"
  }
}
```

### Create Student (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/students/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science",
    "password": "student123"
  }'
```

**Response:**
```json
{
  "message": "Student created successfully",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Assign Task (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/tasks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "student_id": 1,
    "title": "Complete Assignment 1",
    "description": "Finish the math assignment",
    "due_time": "2024-12-31T23:59:59Z"
  }'
```

**Response:**
```json
{
  "message": "Task assigned successfully",
  "task": {
    "id": 1,
    "student_id": 1,
    "title": "Complete Assignment 1",
    "description": "Finish the math assignment",
    "due_time": "2024-12-31T23:59:59.000Z",
    "status": "pending",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
}
```

### Student Login

```bash
curl -X POST http://localhost:3000/api/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "student123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  }
}
```

### Get My Tasks (Student)

```bash
curl -X GET http://localhost:3000/api/student/tasks/list \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

**Response:**
```json
{
  "message": "Tasks retrieved successfully",
  "count": 2,
  "tasks": [
    {
      "id": 1,
      "title": "Complete Assignment 1",
      "description": "Finish the math assignment",
      "due_time": "2024-12-31T23:59:59.000Z",
      "status": "pending",
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": 2,
      "title": "Submit Project",
      "description": "Final year project submission",
      "due_time": "2024-01-10T23:59:59.000Z",
      "status": "overdue",
      "created_at": "2024-01-05T09:00:00.000Z",
      "updated_at": "2024-01-05T09:00:00.000Z"
    }
  ]
}
```

### Complete Task (Student)

```bash
curl -X PATCH http://localhost:3000/api/student/tasks/1 \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

**Response:**
```json
{
  "message": "Task marked as completed",
  "task": {
    "id": 1,
    "title": "Complete Assignment 1",
    "description": "Finish the math assignment",
    "due_time": "2024-12-31T23:59:59.000Z",
    "status": "completed",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

## Task Status Logic

Tasks have three possible statuses:

- **pending**: Task is not yet due and not completed
- **overdue**: Task is past the due time and not completed
- **completed**: Student has marked the task as completed

The status is automatically calculated based on the current time and due_time when retrieving tasks.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | student_management |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | your_password |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| JWT_EXPIRES_IN | JWT expiration time | 24h |

## Project Structure

```
Student Management System/
├── src/
│   ├── config/
│   │   ├── database.ts          # PostgreSQL connection
│   │   └── swagger.ts           # API documentation config
│   ├── controllers/
│   │   ├── adminController.ts   # Admin business logic
│   │   └── studentController.ts # Student business logic
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication
│   ├── models/
│   │   ├── admin.ts             # Admin database queries
│   │   ├── student.ts           # Student database queries
│   │   └── task.ts              # Task database queries
│   ├── routes/
│   │   ├── admin.ts             # Admin route definitions
│   │   └── student.ts           # Student route definitions
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   └── password.ts          # Password hashing utilities
│   └── app.ts                   # Main application entry
├── database/
│   └── init.sql                 # Database initialization
├── dist/                        # Compiled JavaScript
├── .env                         # Environment variables (not in repo)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Authentication**: Token-based authentication with configurable expiration
- **Role-Based Access**: Separate authentication for admin and student roles
- **SQL Injection Protection**: Parameterized queries throughout
- **Input Validation**: Request validation on all endpoints

## Default Admin Credentials

**Email**: admin@example.com  
**Password**: admin123

> **Note**: Change the default admin password in production by updating the hashed password in `database/init.sql` or creating a new admin via direct database insertion.

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
