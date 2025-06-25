# Task Management Fullstack Application

A comprehensive **Task Management System** with role-based access control, built with modern technologies and designed for two user types: `Employer` and `Employee`.

## 🚀 Features

### 👔 Employer Features

- **Create and Assign Tasks**: Create tasks and assign them to specific employees
- **View All Tasks**: Access to all tasks with advanced filtering and sorting
- **Filter by Assignee**: View tasks assigned to specific employees
- **Filter by Status**: Filter tasks by status (Pending, In Progress, Completed)
- **Sort Options**: Sort by creation date, due date, or status
- **Employee Summary**: Dashboard showing employee task statistics and completion rates

### 👨‍💻 Employee Features

- **View Assigned Tasks**: Access only to personally assigned tasks
- **Update Task Status**: Change task status (Pending → In Progress → Completed)
- **Task Details**: View task descriptions, due dates, and other details

## 🛠 Technology Stack

### Backend

- **Language**: TypeScript
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

### Frontend

- **Language**: TypeScript
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS + Material UI (MUI)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React-toastify
- **Date Handling**: Day.js

### DevOps & Tools

- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint + Prettier (both frontend & backend)
- **Database Migrations**: Prisma
- **Environment**: Development and Production configurations

## 📁 Project Structure

```
knovel/
├── apps/
│   ├── backend/                 # Node.js/Express API
│   │   ├── src/
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── middleware/      # Auth & validation middleware
│   │   │   ├── routes/         # API routes
│   │   │   ├── services/       # Business logic
│   │   │   ├── types/          # TypeScript definitions
│   │   │   └── index.ts        # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Database seed data
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/               # React/Vite app
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── stores/         # Zustand stores
│       │   ├── services/       # API services
│       │   ├── types/          # TypeScript definitions
│       │   └── App.tsx         # Main app component
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
│
├── docker-compose.yml          # Full-stack orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **PostgreSQL** (for local development)

### Option 1: Docker Compose (Recommended)

1. **Clone and navigate to the project**:

   ```bash
   git clone <repository-url>
   cd knovel
   ```

2. **Start the full application**:

   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Database**: localhost:5432

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd apps/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp env.template .env
   # Edit .env with your database credentials
   ```

4. **Set up database**:

   ```bash
   # Start PostgreSQL (ensure it's running)
   # Create database: task_management

   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd apps/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000

## 🔐 Authentication

### Demo Credentials

The application comes with pre-seeded demo accounts:

**Employers:**

- Username: `employer1` | Password: `password123`
- Username: `employer2` | Password: `password123`

**Employees:**

- Username: `employee1` | Password: `password123`
- Username: `employee2` | Password: `password123`
- Username: `employee3` | Password: `password123`

### API Endpoints

#### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Authenticate user
- `POST /auth/signout` - Sign out (client-side)

#### Tasks

- `GET /tasks` - Get tasks (filtered by role)
- `POST /tasks` - Create task (Employer only)
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (Employer only)
- `GET /tasks/employees` - Get employees list (Employer only)
- `GET /tasks/summary` - Get employee summary (Employer only)

## 📊 Database Schema

### Users Table

- `id` - Unique identifier
- `username` - Unique username
- `password` - Hashed password
- `role` - EMPLOYER | EMPLOYEE
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Tasks Table

- `id` - Unique identifier
- `title` - Task title
- `description` - Task description (optional)
- `status` - PENDING | IN_PROGRESS | COMPLETED
- `dueDate` - Due date (optional)
- `createdById` - Reference to creator (User)
- `assignedToId` - Reference to assignee (User, optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## 🧪 Development

### Code Quality

**Backend:**

```bash
cd apps/backend
npm run lint        # Check linting
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier
```

**Frontend:**

```bash
cd apps/frontend
npm run lint        # Check linting
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier
```

### Database Operations

```bash
cd apps/backend

# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# View database in Prisma Studio
npm run db:studio

# Reset database (caution!)
npm run db:reset

# Seed database with sample data
npm run db:seed
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Remove all containers and volumes
docker-compose down -v
```

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://user:password@localhost:5432/task_management?schema=public
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000
```

## 🚦 Testing the Application

1. **Start the application** using Docker Compose or local development
2. **Access the frontend** at http://localhost:3000 (Docker) or http://localhost:5173 (local)
3. **Sign in** with demo credentials
4. **Test Employer features**:
   - Create new tasks
   - Assign tasks to employees
   - View employee summary
   - Filter and sort tasks
5. **Test Employee features**:
   - View assigned tasks
   - Update task status
   - Check task details

## 📈 Features Implemented

✅ **Authentication & Authorization**

- JWT-based authentication
- Role-based access control
- Secure password hashing

✅ **Task Management**

- CRUD operations for tasks
- Task assignment system
- Status tracking

✅ **Filtering & Sorting**

- Filter by assignee
- Filter by status
- Sort by date and status

✅ **Employee Management**

- Employee task summary
- Completion rate tracking
- Performance metrics

✅ **Security & Best Practices**

- Input validation
- Rate limiting
- CORS protection
- Error handling

✅ **Code Quality**

- TypeScript throughout
- ESLint + Prettier
- Consistent code style

✅ **Deployment Ready**

- Docker containerization
- Production configurations
- Environment management

## 🛣 Roadmap

Potential future enhancements:

- [ ] Real-time notifications
- [ ] File attachments for tasks
- [ ] Task comments and collaboration
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Task templates
- [ ] Time tracking
- [ ] Calendar integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using modern web technologies**
