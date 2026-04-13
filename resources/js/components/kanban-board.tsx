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
    TaskCard,
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
            className="min-w-[320px] max-w-[360px] flex-1 duration-500 animate-in fade-in slide-in-from-right-4"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div
                className={`group/column relative flex h-full flex-col overflow-hidden rounded-[2rem] border transition-all duration-500 ${
                    isDragOver
                        ? 'border-foreground bg-foreground/5 shadow-[0_0_30px_rgba(var(--primary),0.1)] ring-2 ring-foreground/20'
                        : 'border-white/5 bg-foreground/20 backdrop-blur-3xl hover:border-white/10'
                }`}
            >
                {/* Sector Glow Background */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-10 transition-opacity group-hover/column:opacity-20"
                    style={{ backgroundImage: `linear-gradient(to bottom, ${column.color}, transparent)` }}
                />

                <div className="relative z-10 border-b border-white/5 bg-card/[0.01] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-2 w-2 animate-pulse rounded-full"
                                style={{ backgroundColor: column.color, boxShadow: `0 0 12px ${column.color}` }}
                            />
                            <h3 className="text-[11px] font-black uppercase italic tracking-[0.2em] text-background/80 transition-colors group-hover/column:text-background">
                                {column.title}
                            </h3>
                            <div className="rounded-lg border border-white/5 bg-card/5 px-2 py-0.5 shadow-inner">
                                <span className="text-[10px] font-black text-muted-foreground transition-colors group-hover/column:text-foreground">
                                    {tasks.length}
                                </span>
                            </div>
                        </div>
                        {typeof kanbanActions === 'function' ? kanbanActions(column.id) : kanbanActions}
                    </div>
                </div>

                <div className="custom-scrollbar relative z-10 max-h-[calc(100vh-250px)] min-h-[650px] flex-1 space-y-4 overflow-y-auto p-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="duration-200 animate-in fade-in zoom-in-95">
                            {TaskCard ? (
                                <TaskCard task={task} />
                            ) : (
                                <div className="rounded-2xl border border-white/5 bg-card/5 p-4 font-medium text-background/70">
                                    {task.title}
                                </div>
                            )}
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <div className="relative flex h-full flex-col items-center justify-center py-32 text-muted-foreground">
                            <div className="group/placeholder mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-card/[0.02] transition-colors hover:border-foreground/50">
                                <div
                                    className="h-2 w-2 animate-ping rounded-full bg-muted"
                                    style={{ backgroundColor: isDragOver ? 'var(--primary)' : undefined }}
                                />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 transition-opacity group-hover/column:opacity-60">
                                {t('Sector Vector Empty')}
                            </p>
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover/column:opacity-10">
                                <span className="-rotate-12 select-none text-[60px] font-black uppercase italic tracking-tighter text-background">
                                    {t('Available')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tactical Scanning Line (Visible on Drag Over) */}
                {isDragOver && (
                    <div className="animate-scan absolute left-0 right-0 z-20 h-px bg-foreground/50 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}
            </div>
        </div>
    );
}

const KanbanBoard = forwardRef<any, KanbanBoardProps>(function KanbanBoard(
    { tasks: initialTasks, columns, onMove, kanbanActions, taskCard: TaskCard },
    ref
) {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleMove = (taskId: number, fromStatus: string, toStatus: string) => {
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            let movedTask: KanbanTask | null = null;

            Object.keys(newTasks).forEach((status) => {
                const taskIndex = newTasks[status].findIndex((task) => task.id === taskId);
                if (taskIndex !== -1) {
                    movedTask = newTasks[status][taskIndex];
                    newTasks[status] = newTasks[status].filter((task) => task.id !== taskId);
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
        <div className="custom-scrollbar flex space-x-8 overflow-x-auto px-2 pb-8 pt-2">
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
