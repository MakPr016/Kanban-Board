export type TaskStatus = 'todo' | 'in-progress' | 'testing' | 'complete';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  tags: string[];
  dueDate?: string; // ISO Date string
  checklist: { id: string; text: string; completed: boolean }[];
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon?: string; // Emoji or simple string identifier
  themeColor: 'pink' | 'purple' | 'blue' | 'green' | 'yellow';
}

export const COLUMNS: { id: TaskStatus; label: string; colorClass: string; textClass: string }[] = [
  { id: 'todo', label: 'To Do', colorClass: 'bg-pastel-gray', textClass: 'text-pastel-grayText' },
  { id: 'in-progress', label: 'In Progress', colorClass: 'bg-pastel-purple', textClass: 'text-pastel-purpleText' },
  { id: 'testing', label: 'Testing', colorClass: 'bg-pastel-yellow', textClass: 'text-pastel-yellowText' },
  { id: 'complete', label: 'Complete', colorClass: 'bg-pastel-green', textClass: 'text-pastel-greenText' },
];