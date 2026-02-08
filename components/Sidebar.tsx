import React, { useState } from 'react';
import { Project } from '../types';
import { Layout, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onDeleteProject: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onSelectProject, onCreateProject, onDeleteProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName, newProjectDesc);
      setNewProjectName('');
      setNewProjectDesc('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Layout size={18} />
          </div>
          Kanban
        </div>
        <p className="text-xs text-slate-400 mt-1">Personal Task Manager</p>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">My Projects</div>
        
        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`group w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                activeProjectId === project.id 
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activeProjectId === project.id ? 'bg-blue-500' : 'bg-slate-300'
                }`} />
                <span className="truncate">{project.name}</span>
              </div>
              
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {isCreating ? (
          <form onSubmit={handleCreate} className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2">
            <input
              autoFocus
              className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1 mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Short description..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsCreating(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs shadow-md">
            ME
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-slate-700 truncate">My Workspace</div>
          </div>
        </div>
      </div>
    </div>
  );
};