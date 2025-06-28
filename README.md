# 🚀 Task Management Application

## ✨ Features

### 👔 For Employers

- **Create & Assign Tasks**: Create detailed tasks with descriptions, due dates, and assign them to specific employees
- **Task Management**: Full CRUD operations on your created tasks
- **Employee Overview**: View comprehensive employee performance dashboards
- **Advanced Filtering**: Filter tasks by assignee, status, and sort by multiple criteria
- **Team Analytics**: Real-time completion rates and task statistics
- **Employee Summary**: Detailed insights into each employee's task performance with visual progress indicators

### 👨‍💻 For Employees

- **Personal Dashboard**: View all personally assigned tasks in a clean interface
- **Task Status Updates**: Update task status (Pending → In Progress → Completed)
- **Task Details**: Access complete task information including descriptions and due dates
- **Progress Tracking**: Monitor personal task completion rates and performance

### 🔐 Security & Authentication

- **JWT-Based Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Strict permissions based on user roles
- **Password Security**: Bcrypt hashing for secure password storage
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Secure cross-origin resource sharing

## 🛠 Technology Stack

### Backend (Node.js/Express)

- **Runtime**: Node.js 18+ with Express.js 5.x
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL 16 with Prisma ORM 6.x
- **Authentication**: JWT + bcryptjs for password hashing
- **Validation**: Zod schemas with express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston with custom transport configurations
- **Middleware**: Custom auth, error handling, and validation middleware

### Frontend (React/Vite)

- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite 6.x with fast HMR
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 3.x with custom design system
- **State Management**: Zustand with persistence middleware
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify
- **Date Handling**: Day.js for efficient date operations
- **UI Components**: Custom reusable components with accessibility

### DevOps & Infrastructure

- **Orchestration**: Docker Compose with health checks
- **Web Server**: Nginx with optimized configuration
- **Security**: Non-root containers, security headers
- **Monitoring**: Built-in health checks and logging
- **Deployment**: Production-ready Docker setup with automated scripts

## 🚀 Quick Start

### Prerequisites

- **Docker** 20.0+ and **Docker Compose** 2.0+
- **Node.js** 18+ (for local development)
- **PostgreSQL** 16+ (for local development)

### Option 1: Docker Deployment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kanechan25/knovel
   cd knovel
   ```

2. **Deploy with one command**:

   ```bash
   # Using the automated script
   ./deploy.sh

   # Or manually
   docker-compose up --build -d
   ```

3. **Access the application**:

   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Database**: psql postgresql://kane:password@localhost:5432/mydb

### Option 2: Local Development

#### Backend Setup

```bash
cd apps/backend
npm install
cp .env.example .env

npm run db:generate
npm run db:migrate
npm run db:seed

npm run dev
```

#### Frontend Setup

```bash
cd apps/frontend
npm install
cp .env.example .env

npm run dev
```

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://kane:password@localhost:5432/mydb?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET="your_super_secret_jwt_key_here"
FRONTEND_URL="http://localhost:5173" or "http://localhost:3000"
```

#### Frontend (.env)

```env
VITE_API_URL="http://localhost:5000"
```

## 🔐 Demo Credentials

The application comes pre-seeded with demo accounts:

| Role         | Username    | Password     | Description                        |
| ------------ | ----------- | ------------ | ---------------------------------- |
| **Employer** | `employer1` | `knovel123@` | Can create and manage tasks        |
| **Employer** | `employer2` | `knovel123@` | Can create and manage tasks        |
| **Employee** | `employee1` | `knovel123@` | Can view and update assigned tasks |
| **Employee** | `employee2` | `knovel123@` | Can view and update assigned tasks |
| **Employee** | `employee3` | `knovel123@` | Can view and update assigned tasks |

## 🔌 API Endpoints

### Authentication

- `POST /auth/signup` - Register new user with role selection
- `POST /auth/signin` - Authenticate user and return JWT token

### Tasks

- `GET /tasks` - Get tasks (filtered by user role and permissions)
- `POST /tasks` - Create new task (Employer only)
- `GET /tasks/:id` - Get specific task details
- `PUT /tasks/:id` - Update task (role-based permissions)
- `DELETE /tasks/:id` - Delete task (Creator only)
- `GET /tasks/employees` - Get employees list (Employer only)

### System

- `GET /health` - Health check endpoint with system info
