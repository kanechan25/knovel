# 🚀 Task Management App - Docker Deployment Guide

This guide will help you deploy the Task Management fullstack application using Docker and Docker Compose.

## 🏗️ Architecture Overview

- **Frontend**: React + Vite + TailwindCSS (served by nginx)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16

## 🔌 Port Configuration & CORS Setup

### Development (without Docker)

- **Frontend**: Runs on `localhost:5173` (Vite dev server)
- **Backend**: Runs on `localhost:5000`
- **CORS**: Backend allows `localhost:5173`

### Docker Deployment

- **Frontend Container**: Runs internally on port `8080`
- **Frontend Host Access**: Mapped to `localhost:3000` (`3000:8080`)
- **Backend**: Runs on `localhost:5000` (same as dev)
- **CORS**: Backend allows `localhost:3000` (where users access the app)

The backend automatically allows multiple origins for flexibility:

- **Primary URL**: Configured via `FRONTEND_URL` (default: `localhost:5173`)
- **Auto-allowed Origins**: `localhost:5173`, `localhost:3000`, `localhost:3001`, `127.0.0.1:5173`, `127.0.0.1:3000`
- **Works for Both**: Development and Docker deployment without additional configuration

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kanechan25/knovel
cd knovel
```

### 2. Environment Configuration

Create environment files:

**Backend (.env)**:

```bash
DATABASE_URL="postgresql://kane:password@postgres:5432/mydb?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
# Note: CORS automatically allows only common ports (5173, 3000, 3001) for both dev and Docker

```

**Frontend (.env)**:

```bash

VITE_API_URL=http://localhost:5000

```

### 3. Build and Run

```bash
docker-compose up --build
docker-compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## 🔐 Default Login Credentials

The application comes with pre-seeded users:

| Role     | Username  | Password   |
| -------- | --------- | ---------- |
| Employer | employer1 | knovel123@ |
| Employer | employer2 | knovel123@ |
| Employee | employee1 | knovel123@ |
| Employee | employee2 | knovel123@ |
| Employee | employee3 | knovel123@ |

## 📊 Health Checks

All services include health checks:

```bash
docker-compose ps
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 🔄 Database Management

```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
docker-compose exec postgres psql -U user -d task_management
docker-compose exec postgres pg_dump -U user task_management > backup.sql
docker-compose exec -T postgres psql -U user task_management < backup.sql
```
