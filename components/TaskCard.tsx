import React from 'react';
import { Task } from '../types';
import { Badge } from './ui/Badge';
import { Calendar, CheckSquare, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick, onDelete }) => {
  const completedChecklist = task.checklist.filter(c => c.completed).length;
  const totalChecklist = task.checklist.length;
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'complete';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative animate-in fade-in zoom-in duration-300"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800 leading-tight">{task.title}</h3>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>

      {/* Checklist Preview */}
      {task.checklist.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {task.checklist.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center text-xs text-slate-500">
              {item.completed ? (
                <CheckCircle2 size={12} className="text-slate-400 mr-2" />
              ) : (
                <Circle size={12} className="text-slate-300 mr-2" />
              )}
              <span className={item.completed ? 'line-through decoration-slate-300' : ''}>
                {item.text}
              </span>
            </div>
          ))}
          {task.checklist.length > 3 && (
            <div className="text-xs text-slate-400 pl-5">
              + {task.checklist.length - 3} more items
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {task.dueDate && (
          <Badge variant={isOverdue ? 'red' : 'pink'}>
            <Calendar size={10} className="mr-1" />
            Due {formatDate(task.dueDate)}
          </Badge>
        )}
        
        {task.tags.map(tag => (
          <Badge key={tag} variant="green">{tag}</Badge>
        ))}

        {totalChecklist > 0 && (
          <div className="flex items-center text-xs text-slate-400 ml-auto">
            <CheckSquare size={12} className="mr-1" />
            {completedChecklist}/{totalChecklist}
          </div>
        )}
      </div>
    </div>
  );
};