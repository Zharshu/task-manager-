import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo', label: 'To Do', barColor: '#64748b', headerBg: 'var(--bg-subtle)', labelColor: '#64748b', countBg: 'rgba(100,116,139,0.15)', countColor: '#64748b' },
  { id: 'in_progress', label: 'In Progress', barColor: '#f59e0b', headerBg: 'var(--bg-subtle-amber)', labelColor: '#d97706', countBg: 'rgba(245,158,11,0.15)', countColor: '#d97706' },
  { id: 'completed', label: 'Completed', barColor: '#22c55e', headerBg: 'var(--bg-subtle-green)', labelColor: '#16a34a', countBg: 'rgba(34,197,94,0.15)', countColor: '#16a34a' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            style={{
              display: 'flex', flexDirection: 'column',
              borderRadius: '16px', border: '1.5px solid var(--border)',
              overflow: 'hidden', boxShadow: 'var(--shadow-card)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            {/* Accent top bar */}
            <div style={{ height: '4px', backgroundColor: col.barColor }} />

            {/* Column header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', backgroundColor: col.headerBg,
              borderBottom: '1px solid var(--border)',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: col.labelColor, margin: 0 }}>
                {col.label}
              </h3>
              <span style={{
                fontSize: '13px', fontWeight: 700, padding: '2px 12px',
                borderRadius: '20px', backgroundColor: col.countBg, color: col.countColor,
              }}>
                {grouped[col.id].length}
              </span>
            </div>

            {/* Drop zone */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1, padding: '16px', minHeight: '300px',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    backgroundColor: snapshot.isDraggingOver ? 'var(--bg-subtle)' : 'var(--bg-page)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {grouped[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snap) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snap.isDragging ? 0.8 : 1,
                          }}
                        >
                          <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {grouped[col.id].length === 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '100px', borderRadius: '12px', marginTop: '4px',
                      border: '2px dashed var(--border)', backgroundColor: 'transparent'
                    }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        Drop tasks here
                      </p>
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
