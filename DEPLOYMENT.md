# Deployment Guide - Render

This guide will help you deploy the Student Management System API to Render.

## Prerequisites

- GitHub account with your code pushed
- Render account (free tier available at https://render.com)
- PostgreSQL database (Render provides free PostgreSQL)

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Student Management System API"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `student-management-db`
   - **Database**: `student_management`
   - **User**: Auto-generated
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **Create Database**
5. Wait for database to be ready
6. Copy the **Internal Database URL** (starts with `postgresql://`)

## Step 3: Initialize Database Schema

1. In your Render PostgreSQL database, click **Connect**
2. Use **PSQL Command** or connect via external client
3. Run the SQL from `database/init.sql`:

```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Default admin (password: admin123)
INSERT INTO admins (email, password) VALUES 
('admin@example.com', '$2b$10$XqHlz8Z8Y9Z9Z9Z9Z9Z9ZuL8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K');
```

## Step 4: Deploy Web Service on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `student-management-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Step 5: Configure Environment Variables

In your Render Web Service, go to **Environment** and add:

```
PORT=3000
DB_HOST=<from Internal Database URL>
DB_PORT=5432
DB_NAME=student_management
DB_USER=<from Internal Database URL>
DB_PASSWORD=<from Internal Database URL>
JWT_SECRET=<generate-random-secret-key>
JWT_EXPIRES_IN=24h
```

**To extract database credentials from Internal URL**:
```
postgresql://user:password@host:5432/database
```
- DB_USER = user
- DB_PASSWORD = password
- DB_HOST = host
- DB_NAME = database

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Deploy

1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://student-management-api.onrender.com`

## Step 7: Update Swagger Config (Optional)

Update `src/config/swagger.ts` to include your Render URL:

```typescript
servers: [
    {
        url: 'http://localhost:3000',
        description: 'Development server',
    },
    {
        url: 'https://student-management-api.onrender.com',
        description: 'Production server',
    },
],
```

## Step 8: Test Your Deployment

1. Visit: `https://your-app.onrender.com/api-docs`
2. Test admin login:
   - Email: `admin@example.com`
   - Password: `admin123`

## Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Database limited to 1GB storage
- Great for testing and portfolios

### Security Recommendations for Production
1. Change default admin password immediately
2. Use strong JWT_SECRET (not from .env.example)
3. Enable CORS only for trusted domains
4. Consider upgrading to paid tier for production use

## Troubleshooting

### Build Fails
- Check Node version in `package.json` engines field
- Verify all dependencies in `package.json`

### Database Connection Fails
- Verify environment variables match database credentials
- Use **Internal Database URL** (not External)
- Check database is in same region as web service

### App Crashes on Start
- Check logs in Render dashboard
- Verify database tables are created
- Ensure PORT environment variable is set

## Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Check database: Render Dashboard → Your Database → Metrics

## Updating Your Deployment

```bash
git add .
git commit -m "Update message"
git push origin main
```

Render will automatically redeploy on every push to main branch.

## Custom Domain (Optional)

In Render Dashboard:
1. Go to your Web Service → Settings
2. Click **Add Custom Domain**
3. Follow instructions to configure DNS

---

**Your API is now live! 🚀**

Share your Swagger docs: `https://your-app.onrender.com/api-docs`
