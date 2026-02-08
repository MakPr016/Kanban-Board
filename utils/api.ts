import { Project, Task } from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  getTasks: async (projectId?: string): Promise<Task[]> => {
    const query = projectId ? `?projectId=${projectId}` : '';
    const res = await fetch(`${API_URL}/tasks${query}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
  }
};