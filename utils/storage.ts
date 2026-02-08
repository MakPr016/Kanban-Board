import { Project, Task } from '../types';

const PROJECTS_KEY = 'kanban_projects';
const TASKS_KEY = 'kanban_tasks';

const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Design Weekly', description: 'A board to keep track of design progress.', themeColor: 'pink' },
  { id: 'p2', name: 'Personal', description: 'Household chores and personal goals.', themeColor: 'blue' },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Review scope',
    description: 'Review #390.',
    status: 'todo',
    tags: ['Design'],
    dueDate: new Date().toISOString(),
    checklist: [],
    createdAt: Date.now(),
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Usability test',
    description: 'Research questions with Carina.',
    status: 'in-progress',
    tags: ['Research'],
    checklist: [],
    createdAt: Date.now(),
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Culture workshop',
    description: 'Let’s build a great team.',
    status: 'testing',
    tags: [],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    checklist: [
        { id: 'c1', text: 'Schedule time', completed: true },
        { id: 'c2', text: 'Set up a Figma board', completed: false },
        { id: 'c3', text: 'Review exercises with the team', completed: false }
    ],
    createdAt: Date.now(),
  },
  {
    id: 't4',
    projectId: 'p2',
    title: 'Take Coco to a vet',
    description: 'Regular checkup.',
    status: 'todo',
    tags: ['Pet'],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    checklist: [],
    createdAt: Date.now(),
  },
];

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(PROJECTS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const getTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_TASKS;
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};