# Task Management Fullstack Project Prompt

## 📌 Project Description

You are building a **fullstack Task Management System** with **role-based access control**, designed for two user types: `Employer` and `Employee`.

### The tech stack is:

1. **Frontend**: TypeScript, React (with Vite), Zustand, Axios, TailwindCSS, Material UI (MUI)
2. **Backend**: TypeScript, Node.js (Express.js), PostgreSQL, Prisma ORM
3. **Authentication**: JWT-based with role-based auth guard, and supports full auth flows

   ***

   ### Example API endpoints for signup/signin/signout:

   | Method | Endpoint        | Description                           |
   | ------ | --------------- | ------------------------------------- |
   | POST   | `/auth/signup`  | Register new user (Employer/Employee) |
   | POST   | `/auth/signin`  | Authenticate user & return token      |
   | POST   | `/auth/signout` | Client-side only (JWT delete)         |

### Project structure is a monorepo with the following folder tree:

```
knovel/
├── apps/
│   ├── backend/
│   │   ├── ... // all code backend here
│   │
│   ├── frontend/
│   │   ├── ... // all code frontend here
```

---

## 📌 Requirements

### # Requirements

Build a Task Management API with role-based access, enabling two types of users: Employer and Employee.

---

### # User Stories

#### 🧑‍💼 Employee Role:

- **View Assigned Tasks**: An Employee can only view the tasks assigned to them.
- **Task Status Update**: An Employee can update the status of their tasks (e.g., "In Progress," "Completed").

#### 🧑‍💻 Employer Role:

##### Create and Assign Tasks:

- An Employer can create tasks and assign them to specific employees.

##### View All Tasks with Filtering and Sorting:

- **Filter by Assignee**: View tasks assigned to a specific employee.
- **Filter by Status**: View tasks based on status (e.g., "Pending," "In Progress," "Completed").
- **Sort by Date**: Sort tasks by creation date or due date.
- **Sort by Status**: Sort tasks by task status to see active or completed tasks first.

##### View Employee Task Summary:

- A summary of all employees including:
  - Total number of tasks assigned.
  - Number of tasks completed by each employee.

---

## # Evaluation Criteria

- **Code Quality**: Efficient, clean, testable, and modular code using TypeScript best practices.
- **Database Management**: Proper schema design, query efficiency, and data handling for filtering and sorting.
- **Role-Based Access Control**: Implementation of authentication and role-based authorization.
- **Deployment Knowledge**: Successful Docker + Docker Compose setup with clear documentation.

---

## 📌 Additional Instructions

### # Frontend Setup

- **ESLint and Prettier**: Configure ESLint and Prettier for the frontend to ensure consistent code style and reduce errors.
  - Install ESLint and Prettier dependencies.
  - Create `.eslintrc.json` and `.prettierrc` files with appropriate configurations.
  - Set up ESLint to work with TypeScript and React.
- **State Management**: Use **Zustand** for state management in React (e.g., manage user info, tasks).
  - Create stores for user authentication and task data.
  - Ensure stores are typed with TypeScript.
- **API Calls**: Use **Axios** to make API calls to the backend, with proper error handling and TypeScript types.
  - Set up an Axios instance with base URL and interceptors for authentication tokens.
  - Define TypeScript interfaces for API request and response data.

### # Backend Setup

- **ESLint and Prettier**: Configure ESLint and Prettier for the backend to ensure consistent code style and reduce errors.
  - Install ESLint and Prettier dependencies.
  - Create `.eslintrc.json` and `.prettierrc` files with appropriate configurations.
  - Set up ESLint to work with TypeScript and Node.js.
- **Database**: Set up a local PostgreSQL database:
  - Install PostgreSQL locally.
  - Create a new database (e.g., `task_management`).
  - Configure **Prisma** to connect to the database (update `schema.prisma` and run migrations):\
    .env : DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
  - Define models for users, tasks, and any other necessary entities.
  - Implement seed data for testing purposes.
- **Authentication**: Implement JWT-based authentication:

  #### ✅ Sign Up:
  - Users can **sign up** by providing:
    - `username` (string, unique)

    - `password` (string, hashed and stored securely)

    - `role`: either `Employer` or `Employee` (selected explicitly before form submission)

  - Frontend will show a **role selection (radio or dropdown)** before the username/password fields.

  - Backend must expose a `POST /auth/signup` endpoint that:
    - Validates input

    - Hashes password (e.g., using bcrypt)

    - Saves user to database with role

    - Returns JWT token and basic profile

  #### ✅ Sign In:
  - Users sign in with `username` and `password`.

  - Backend exposes `POST /auth/signin`:
    - Validates credentials

    - Returns JWT if successful

    - On error: return 401 Unauthorized

  #### ✅ Sign Out
  - Frontend handles sign-out by clearing stored JWT (localStorage, Zustand, etc.)

  - No backend token invalidation required unless using blacklisting/refresh tokens (not required here).

  #### Role-based guard
  - Backend middleware must:
    - Verify JWT (`Authorization: Bearer <token>`)

    - Decode and attach `req.user`

    - Apply role-based guards (e.g. `checkRole('EMPLOYER')`) for protected routes

  - Validate tokens on protected routes using middleware.
  - Implement role-based access control to guard routes based on user roles (`Employer` or `Employee`).
  - Ensure that tokens are securely stored and managed on the frontend.

### # Docker and Docker Compose

- **Dockerfile**:
  - Create a `Dockerfile` for the frontend (build Vite app, serve with Nginx).
  - Create a `Dockerfile` for the backend (Node.js runtime, Prisma setup).
- **docker-compose.yml**: Create a `docker-compose.yml` file to run:
  - Frontend service.
  - Backend service.
  - PostgreSQL service (with persistent volume).
  - Ensure that environment variables are properly configured for each service.

---

## 📌 Notes

- **Error Handling**: Implement proper error handling in both frontend (e.g., toast notifications) and backend (e.g., HTTP status codes).
- **TypeScript Best Practices**: Use interfaces/types for API responses, database models, and Zustand stores.

---
