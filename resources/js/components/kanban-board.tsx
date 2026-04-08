import { useState, useEffect, forwardRef, ReactNode, ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

export interface KanbanTask {
  id: number;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: { name: string; avatar?: string | null } | null;
  due_date?: string;
  [key: string]: any;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

export interface KanbanBoardProps {
  tasks: Record<string, KanbanTask[]>;
  columns: KanbanColumn[];
  onMove?: (taskId: number, fromStatus: string, toStatus: string) => void;
  kanbanActions?: ReactNode | ((columnId: string) => ReactNode);
  taskCard?: ComponentType<{ task: KanbanTask }>;
}

function KanbanColumnComponent({ 
  column, 
  tasks, 
  onMove,
  kanbanActions,
  TaskCard
}: { 
  column: KanbanColumn;
  tasks: KanbanTask[];
  onMove?: (taskId: number, fromStatus: string, toStatus: string) => void;
  kanbanActions?: ReactNode | ((columnId: string) => ReactNode);
  TaskCard?: ComponentType<{ task: KanbanTask }>;
}) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.taskId && onMove) {
        onMove(data.taskId, '', column.id);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  return (
    <div 
      className="flex-1 min-w-[320px] max-w-[360px] animate-in fade-in slide-in-from-right-4 duration-500"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        className={`h-full flex flex-col rounded-[2rem] border transition-all duration-500 relative group/column overflow-hidden ${
          isDragOver 
            ? 'border-foreground ring-2 ring-foreground/20 bg-foreground/5 shadow-[0_0_30px_rgba(var(--primary),0.1)]' 
            : 'border-white/5 bg-foreground/20 backdrop-blur-3xl hover:border-white/10'
        }`}
      >
        {/* Sector Glow Background */}
        <div 
            className="absolute top-0 inset-x-0 h-40 opacity-10 pointer-events-none group-hover/column:opacity-20 transition-opacity"
            style={{ backgroundImage: `linear-gradient(to bottom, ${column.color}, transparent)` }}
        />

        <div className="px-6 py-5 border-b border-white/5 bg-card/[0.01] relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: column.color, boxShadow: `0 0 12px ${column.color}` }}
              />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-background/80 group-hover/column:text-background transition-colors italic">
                {column.title}
              </h3>
              <div className="px-2 py-0.5 rounded-lg bg-card/5 border border-white/5 shadow-inner">
                <span className="text-[10px] font-black text-muted-foreground group-hover/column:text-foreground transition-colors">
                  {tasks.length}
                </span>
              </div>
            </div>
            {typeof kanbanActions === 'function' ? kanbanActions(column.id) : kanbanActions}
          </div>
        </div>
        
        <div className="p-4 flex-1 min-h-[650px] max-h-[calc(100vh-250px)] overflow-y-auto space-y-4 custom-scrollbar relative z-10">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="animate-in fade-in zoom-in-95 duration-200"
              >
                {TaskCard ? <TaskCard task={task} /> : <div className="p-4 bg-card/5 rounded-2xl border border-white/5 text-background/70 font-medium">{task.title}</div>}
              </div>
            ))}
          
          {tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-32 text-muted-foreground relative">
              <div className="w-16 h-16 rounded-[2rem] bg-card/[0.02] border border-dashed border-white/10 flex items-center justify-center mb-6 group/placeholder hover:border-foreground/50 transition-colors">
                <div 
                    className="w-2 h-2 rounded-full bg-muted animate-ping" 
                    style={{ backgroundColor: isDragOver ? 'var(--primary)' : undefined }}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover/column:opacity-60 transition-opacity">{t('Sector Vector Empty')}</p>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/column:opacity-10 pointer-events-none">
                 <span className="text-[60px] font-black uppercase tracking-tighter italic text-background -rotate-12 select-none">{t('Available')}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Tactical Scanning Line (Visible on Drag Over) */}
        {isDragOver && (
            <div 
                className="absolute left-0 right-0 h-px bg-foreground/50 z-20 shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-scan"
            />
        )}
      </div>
    </div>
  );
}

const KanbanBoard = forwardRef<any, KanbanBoardProps>(function KanbanBoard({
  tasks: initialTasks,
  columns,
  onMove,
  kanbanActions,
  taskCard: TaskCard
}, ref) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleMove = (taskId: number, fromStatus: string, toStatus: string) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      let movedTask: KanbanTask | null = null;
      
      Object.keys(newTasks).forEach(status => {
        const taskIndex = newTasks[status].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          movedTask = newTasks[status][taskIndex];
          newTasks[status] = newTasks[status].filter(task => task.id !== taskId);
        }
      });
      
      if (movedTask) {
        newTasks[toStatus] = [...(newTasks[toStatus] || []), movedTask];
      }
      
      return newTasks;
    });
    
    if (onMove) {
      onMove(taskId, fromStatus, toStatus);
    }
  };

  return (
    <div className="flex space-x-8 overflow-x-auto pb-8 custom-scrollbar pt-2 px-2">
      {columns.map((column) => (
        <KanbanColumnComponent
          key={column.id}
          column={column}
          tasks={tasks[column.id] || []}
          onMove={handleMove}
          kanbanActions={kanbanActions}
          TaskCard={TaskCard}
        />
      ))}
    </div>
  );
});

export default KanbanBoard;