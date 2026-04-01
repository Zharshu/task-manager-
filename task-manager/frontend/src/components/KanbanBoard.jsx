import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMNS = [
  {
    id: 'todo',
    label: 'To Do',
    accent: 'bg-slate-400',
    headerCls: 'text-slate-600 dark:text-slate-400',
    countCls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    dropActiveCls: 'bg-slate-50/80 dark:bg-slate-800/40',
    borderCls: 'border-slate-200 dark:border-slate-700/60',
    dotColor: '#94a3b8',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    accent: 'bg-amber-400',
    headerCls: 'text-amber-700 dark:text-amber-400',
    countCls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dropActiveCls: 'bg-amber-50/60 dark:bg-amber-500/5',
    borderCls: 'border-amber-200/70 dark:border-amber-700/30',
    dotColor: '#f59e0b',
  },
  {
    id: 'completed',
    label: 'Completed',
    accent: 'bg-emerald-400',
    headerCls: 'text-emerald-700 dark:text-emerald-400',
    countCls: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dropActiveCls: 'bg-emerald-50/60 dark:bg-emerald-500/5',
    borderCls: 'border-emerald-200/70 dark:border-emerald-700/30',
    dotColor: '#22c55e',
  },
];

const KanbanBoard = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const handleDragEnd = ({ draggableId, destination }) => {
    if (!destination) return;
    const task = tasks.find((t) => t._id === draggableId);
    if (task && task.status !== destination.droppableId) {
      onStatusChange(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full max-w-full" style={{ gap: '24px' }}>
        {COLUMNS.map((col, colIdx) => (
          <div
            key={col.id}
            className={`slide-in delay-${colIdx + 1} flex flex-col border ${col.borderCls} bg-slate-50/40 dark:bg-slate-900/40 shadow-sm overflow-hidden`}
            style={{ borderRadius: '20px' }}
          >
            {/* Accent line */}
            <div className={`h-1.5 w-full ${col.accent} opacity-90`} />

            {/* Column header */}
            <div 
              className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 bg-transparent relative z-10 w-full overflow-visible"
              style={{ padding: '16px 24px' }}
            >
              <div className="flex items-center" style={{ gap: '12px' }}>
                <span className="rounded-full shrink-0" style={{ width: '10px', height: '10px', backgroundColor: col.dotColor }} />
                <h3 className={`font-bold uppercase ${col.headerCls}`} style={{ fontSize: '13px', letterSpacing: '0.05em' }}>{col.label}</h3>
              </div>
              <span 
                className={`flex shrink-0 items-center justify-center rounded-full font-bold shadow-sm ${col.countCls} border border-slate-200/60 dark:border-slate-700/60`}
                style={{ minWidth: '32px', height: '26px', padding: '0 12px', fontSize: '12px' }}
              >
                 {grouped[col.id].length}
              </span>
            </div>

            {/* Drop zone */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 flex flex-col transition-colors duration-200 ${
                    snapshot.isDraggingOver
                      ? col.dropActiveCls
                      : 'bg-transparent'
                  } ${snapshot.isDraggingOver ? 'kanban-drop-active' : ''}`}
                  style={{ padding: '7px', gap: '7px', minHeight: '400px' }}
                >
                  {grouped[col.id].map((task, idx) => (
                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                      {(provided, snap) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snap.isDragging ? 0.8 : 1,
                            zIndex: snap.isDragging ? 50 : 1,
                          }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                            accentColor={col.dotColor}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Empty column */}
                  {grouped[col.id].length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-linear-to-b from-transparent to-slate-50/50 dark:to-slate-800/10 text-slate-400 dark:text-slate-600 min-h-[220px]">
                      <div
                        className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm"
                        style={{ borderColor: col.dotColor, opacity: 0.5, color: col.dotColor }}
                      >
                        <Plus size={20} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Empty Workspace</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
