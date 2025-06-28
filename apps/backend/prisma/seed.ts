import { PrismaClient, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('knovel123@', 12);

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

  const tasks = [
    {
      title: 'Programming & languages',
      description: 'TypeScript, JavaScript, SQL, GraphQL, C#, VB.NET, HTML, CSS/SCSS',
      status: TaskStatus.COMPLETED,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Libraries & Frameworks',
      description:
        'React, Next.js, Node.js,NestJS, Express.js, Tailwind CSS, Shadcn UI, Zustand, Prisma, Docker, Git, Figma',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'AI & Agent',
      description: 'OpenAI API, Ollama, Langchain, elizaOS, pgvector, streaming UI, AI UI integration',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee2.id,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Hands-on with frontend',
      description:
        'architecture, performance tuning, AI agent integration, and team mentoring — across both startup and enterprise-scale codebases focused on scalability, component reuse, and long-term maintainability',
      status: TaskStatus.PENDING,
      createdById: employer1.id,
      assignedToId: employee3.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'working with backend systems',
      description:
        'Node.js, Express.js and NestJS (RESTful API, GraphQL), including API design, data handling, and backend integration that supports frontend features at scale',
      status: TaskStatus.IN_PROGRESS,
      createdById: employer2.id,
      assignedToId: employee2.id,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Performance optimization',
      description:
        'Reduced re-render and average page load time by 30% via caching, tree shaking, code-splitting, lazy loading, and aggressive render improvement',
      status: TaskStatus.COMPLETED,
      createdById: employer2.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Direct experience integrating',
      description:
        'AI agents and LLM APIs (OpenAI, Langchain) into real-world production apps, including automated UX flows, streaming prompts, and real-time UI feedback',
      status: TaskStatus.PENDING,
      createdById: employer2.id,
      assignedToId: employee3.id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Impact Highlights',
      description:
        'Optimized rendering and prompt latency for near-instant feedback using React + Suspense + streaming API integration',
      status: TaskStatus.COMPLETED,
      createdById: employer1.id,
      assignedToId: employee1.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Outstanding Outcomes',
      description:
        'Optimized performance across projects: improved TTI by ~30%, reduced JS bundle size by ~25%, and achieved CLS <0.1',
      status: TaskStatus.COMPLETED,
      createdById: employer1.id,
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
