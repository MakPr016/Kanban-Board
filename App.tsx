import React, { useState, useEffect } from 'react';
import { COLUMNS, Project, Task, TaskStatus } from './types';
import { getProjects, saveProjects, getTasks, saveTasks } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { NewTaskModal } from './components/NewTaskModal';
import { Plus, Menu, Search } from 'lucide-react';

export default function App() {
  // Initialize state lazily from local storage to avoid sync issues
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [tasks, setTasks] = useState<Task[]>(getTasks);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Set active project on mount or when projects change if invalid
  useEffect(() => {
    if ((!activeProjectId || !projects.find(p => p.id === activeProjectId)) && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  // Persistence Effects
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const filteredTasks = tasks.filter(t => 
    t.projectId === activeProjectId && 
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCreateProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name,
      description,
      themeColor: 'blue'
    };
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? All associated tasks will be lost.")) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      // Remove tasks associated with this project
      const updatedTasks = tasks.filter(t => t.projectId !== projectId);
      setTasks(updatedTasks);

      // If we deleted the active project, the useEffect above will handle selecting a new one
      if (activeProjectId === projectId) {
        setActiveProjectId(''); 
      }
    }
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTaskId ? { ...t, status } : t
      ));
      setDraggedTaskId(null);
    }
  };

  const activeProjectTasks = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    testing: filteredTasks.filter(t => t.status === 'testing'),
    complete: filteredTasks.filter(t => t.status === 'complete'),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => { setActiveProjectId(id); setIsSidebarOpen(false); }}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
      />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}>
           <div className="bg-white h-full w-64 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
             <div className="font-bold text-xl mb-6">Kanban</div>
             {projects.map(p => (
               <button 
                 key={p.id} 
                 onClick={() => { setActiveProjectId(p.id); setIsSidebarOpen(false); }}
                 className="block w-full text-left py-2 px-4 hover:bg-slate-100 rounded mb-2"
                >
                  {p.name}
               </button>
             ))}
           </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500">
                <Menu />
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {activeProject?.name || 'My Projects'}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 max-w-2xl">
                {activeProject?.description || 'Select or create a project to get started.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
              />
            </div>
            {activeProjectId && (
                <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95"
                >
                <Plus size={18} />
                <span className="hidden sm:inline">New Task</span>
                </button>
            )}
          </div>
        </header>

        {/* Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
          <div className="flex gap-6 h-full min-w-[1000px]">
            {COLUMNS.map((col) => (
              <div 
                key={col.id} 
                className="flex-1 min-w-[280px] flex flex-col h-full rounded-2xl bg-slate-50/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${col.colorClass} ${col.textClass}`}>
                    {col.label}
                    <span className="ml-2 opacity-60 text-xs bg-white/50 px-1.5 py-0.5 rounded-full">
                      {activeProjectTasks[col.id].length}
                    </span>
                  </div>
                  {activeProjectId && (
                    <button 
                        onClick={() => { setIsTaskModalOpen(true); /* Status logic could be added here */ }} 
                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                  )}
                </div>

                <div 
                  className={`flex-1 overflow-y-auto px-2 pb-4 space-y-3 scrollbar-hide transition-colors rounded-xl ${
                    draggedTaskId ? 'bg-slate-100/50 border-2 border-dashed border-slate-200' : ''
                  }`}
                >
                  {activeProjectTasks[col.id].length === 0 ? (
                     <div className="h-24 flex items-center justify-center text-slate-300 text-sm italic border border-dashed border-slate-200 rounded-xl mt-2">
                       No tasks
                     </div>
                  ) : (
                    activeProjectTasks[col.id].map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart}
                        onClick={() => {}} 
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <NewTaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleCreateTask}
          projectId={activeProjectId}
        />
      </main>
    </div>
  );
}