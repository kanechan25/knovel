import { PrismaClient, TaskStatus } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const hashedPassword = await bcrypt.hash('knovel123@', 12);

  // Create employers
  const employer1 = await prisma.user.create({
    data: {
      username: 'employer1',
      password: hashedPassword,
      role: 'EMPLOYER',
    },
  });

  const employer2 = await prisma.user.create({
    data: {
      username: 'employer2',
      password: hashedPassword,
      role: 'EMPLOYER',
    },
  });

  // Create employees
  const employee1 = await prisma.user.create({
    data: {
      username: 'employee1',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  const employee2 = await prisma.user.create({
    data: {
      username: 'employee2',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  const employee3 = await prisma.user.create({
    data: {
      username: 'employee3',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  // Create sample tasks
  const tasks = [
    {
      title: 'Implement user authentication',
      description: 'Set up JWT-based authentication system with role-based access control',
      status: TaskStatus.COMPLETED,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Design database schema',
      description: 'Create comprehensive database schema for the task management system',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Create React components',
      description: 'Build reusable React components for the frontend application',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee2.id,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Write API documentation',
      description: 'Document all API endpoints with examples and response formats',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee3.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer2.id,
      assignedToId: employee2.id,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Performance optimization',
      description: 'Optimize application performance and reduce loading times',
      status: TaskStatus.COMPLETED,
      createdById: employer2.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Security audit',
      description: 'Conduct comprehensive security audit of the application',
      status: TaskStatus.PENDING,
      createdById: employer2.id,
      assignedToId: employee3.id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    },
  ];

  await prisma.task.createMany({
    data: tasks,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
