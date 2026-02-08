import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  projectId: string;
  initialStatus?: TaskStatus;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  projectId,
  initialStatus = 'todo' 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string>('');
  const [checklistItems, setChecklistItems] = useState<{id: string, text: string, completed: boolean}[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (isOpen) {
        setStatus(initialStatus);
        setTitle('');
        setDescription('');
        setDueDate('');
        setTags('');
        setChecklistItems([]);
        setNewChecklistItem('');
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      projectId,
      title,
      description,
      status,
      dueDate: dueDate || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      checklist: checklistItems
    });
    onClose();
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklistItems([...checklistItems, { 
      id: Math.random().toString(36).substr(2, 9), 
      text: newChecklistItem, 
      completed: false 
    }]);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  // Light theme inputs with borders
  const inputClass = "w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm";
  const labelClass = "block text-sm font-semibold text-slate-900 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputClass}
                placeholder="What needs to be done?"
                autoFocus
                required
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`${inputClass} min-h-[100px] resize-none leading-relaxed`}
                placeholder="Add some details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Status</label>
                <div className="relative">
                  <select 
                    value={status}
                    onChange={e => setStatus(e.target.value as TaskStatus)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="complete">Complete</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Due Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input 
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Design, Research, Urgent..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Checklist</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text"
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                  placeholder="Add item..."
                  className={`${inputClass} py-2`}
                />
                <button 
                  type="button" 
                  onClick={addChecklistItem}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 rounded-lg transition-colors flex items-center justify-center min-w-[44px] border border-slate-200"
                >
                  <Plus size={20} />
                </button>
              </div>
              <ul className="space-y-2">
                {checklistItems.map(item => (
                  <li key={item.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 group">
                    <span className="text-slate-700 text-sm font-medium pl-1">{item.text}</span>
                    <button 
                      type="button" 
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-sm transition-all transform active:scale-95"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};