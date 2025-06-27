import { useMemo } from 'react';
import { useTaskStore } from '../stores/task.store';
import type { SummaryData } from '../types';

export const useSummary = (): SummaryData => {
  const { tasks } = useTaskStore();

  const employeeSummary = useMemo(() => {
    const employeeMap = new Map();

    tasks.forEach((task) => {
      if (task.assignedTo) {
        const employeeId = task.assignedTo.id;
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            username: task.assignedTo.username,
            totalTasks: 0,
            completedTasks: 0,
          });
        }

        const employee = employeeMap.get(employeeId);
        employee.totalTasks++;
        if (task.status === 'COMPLETED') {
          employee.completedTasks++;
        }
      }
    });

    const employeeSummary = Array.from(employeeMap.values()).map(
      (employee) => ({
        ...employee,
        completionRate:
          employee.totalTasks > 0
            ? Math.round(
                (employee.completedTasks / employee.totalTasks) * 100 * 100
              ) / 100
            : 0,
      })
    );
    return employeeSummary;
  }, [tasks]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === 'COMPLETED'
    ).length;
    const inProgress = tasks.filter(
      (task) => task.status === 'IN_PROGRESS'
    ).length;
    const pending = tasks.filter((task) => task.status === 'PENDING').length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate,
    };
  }, [tasks]);

  return {
    employeeSummary,
    taskStats,
    totalEmployees: employeeSummary.length,
  };
};
