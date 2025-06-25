import { PrismaClient, TaskStatus } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

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
      description:
        'Set up JWT-based authentication system with role-based access control',
      status: TaskStatus.COMPLETED,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date('2024-01-15'),
    },
    {
      title: 'Design database schema',
      description:
        'Create comprehensive database schema for the task management system',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date('2024-01-20'),
    },
    {
      title: 'Create React components',
      description:
        'Build reusable React components for the frontend application',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee2.id,
      dueDate: new Date('2024-01-25'),
    },
    {
      title: 'Write API documentation',
      description:
        'Document all API endpoints with examples and response formats',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee3.id,
      dueDate: new Date('2024-01-30'),
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer2.id,
      assignedToId: employee2.id,
      dueDate: new Date('2024-02-05'),
    },
    {
      title: 'Performance optimization',
      description: 'Optimize application performance and reduce loading times',
      status: TaskStatus.COMPLETED,
      createdById: employer2.id,
      assignedToId: employee1.id,
      dueDate: new Date('2024-01-10'),
    },
    {
      title: 'Security audit',
      description: 'Conduct comprehensive security audit of the application',
      status: TaskStatus.PENDING,
      createdById: employer2.id,
      assignedToId: employee3.id,
      dueDate: new Date('2024-02-10'),
    },
  ];

  await prisma.task.createMany({
    data: tasks,
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`👥 Created ${await prisma.user.count()} users`);
  console.log(`📋 Created ${await prisma.task.count()} tasks`);
  console.log('');
  console.log('Sample credentials:');
  console.log('Employers: employer1, employer2 (password: password123)');
  console.log(
    'Employees: employee1, employee2, employee3 (password: password123)'
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
