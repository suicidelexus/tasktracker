import React, { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { analyticsAPI, tasksAPI } from '../services/api';

const TaskItem = ({ task, quadrant, onDragStart, onDragEnd }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, task, quadrant)}
    onDragEnd={onDragEnd}
    style={{
      padding: '8px 12px',
      marginBottom: '6px',
      background: '#f8fafc',
      borderRadius: '6px',
      cursor: 'grab',
      transition: 'background 0.2s, border-color 0.2s',
      border: '1px solid #e2e8f0',
      userSelect: 'none'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f1f5f9';
      e.currentTarget.style.borderColor = '#cbd5e1';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#f8fafc';
      e.currentTarget.style.borderColor = '#e2e8f0';
    }}
  >
    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1e293b', pointerEvents: 'none' }}>
      {task.title}
    </h4>
  </div>
);

const QuadrantModal = ({ quadrant, title, description, tasks, onClose, onDragStart, onDragEnd }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'white', borderRadius: '12px', width: '90%',
        maxWidth: '700px', maxHeight: '80vh', display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}
    >
      <div style={{
        padding: '24px', borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>{title}</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>{description}</p>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '6px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <X size={20} color="#64748b" />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>Нет задач</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} quadrant={quadrant} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          ))
        )}
      </div>
    </div>
  </div>
);

const QuadrantBox = ({ quadrant, title, description, emoji, color, tasks, onDrop, setExpandedQuadrant, onDragStart, onDragEnd }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const displayedTasks = tasks.slice(0, 7);
  const hasMore = tasks.length > 7;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    setIsDragOver(false);
    onDrop(e, quadrant);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        minHeight: '250px',
        background: isDragOver ? '#f0f9ff' : 'white',
        border: isDragOver ? `2px dashed #3b82f6` : '1px solid #e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Цветная шапка */}
      <div style={{
        background: color,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'white' }}>{emoji} {title}</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{description}</p>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpandedQuadrant({ quadrant, title, description, tasks })}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            title="Развернуть"
          >
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Тело квадранта */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Нет задач</p>
        ) : (
          <>
            {displayedTasks.map(task => (
              <TaskItem key={task.id} task={task} quadrant={quadrant} onDragStart={onDragStart} onDragEnd={onDragEnd} />
            ))}
            {hasMore && (
              <div
                onClick={() => setExpandedQuadrant({ quadrant, title, description, tasks })}
                style={{ textAlign: 'center', padding: '8px', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginTop: '4px' }}
              >
                + ещё {tasks.length - 7} задач(и)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EisenhowerMatrix = () => {
  const [matrix, setMatrix] = useState({
    important_urgent: [],
    important_not_urgent: [],
    not_important_urgent: [],
    not_important_not_urgent: []
  });
  const [loading, setLoading] = useState(true);
  const [expandedQuadrant, setExpandedQuadrant] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadMatrix();
  }, []);

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getEisenhowerMatrix();
      setMatrix(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, task, fromQuadrant) => {
    setDraggedTask({ task, fromQuadrant });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(task.id));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDrop = async (e, toQuadrant) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.fromQuadrant === toQuadrant) {
      setDraggedTask(null);
      return;
    }

    const { task, fromQuadrant } = draggedTask;

    const quadrantMap = {
      important_urgent:         { is_important: 1, is_urgent: 1 },
      important_not_urgent:     { is_important: 1, is_urgent: 0 },
      not_important_urgent:     { is_important: 0, is_urgent: 1 },
      not_important_not_urgent: { is_important: 0, is_urgent: 0 },
    };

    const { is_important, is_urgent } = quadrantMap[toQuadrant];

    try {
      await tasksAPI.update(task.id, { is_important, is_urgent });

      setMatrix(prev => {
        const next = { ...prev };
        next[fromQuadrant] = next[fromQuadrant].filter(t => t.id !== task.id);
        next[toQuadrant] = [...next[toQuadrant], { ...task, is_important, is_urgent }];
        return next;
      });

      // Обновляем expandedQuadrant если он открыт
      setExpandedQuadrant(prev => {
        if (!prev) return null;
        if (prev.quadrant === fromQuadrant) {
          return { ...prev, tasks: prev.tasks.filter(t => t.id !== task.id) };
        }
        if (prev.quadrant === toQuadrant) {
          return { ...prev, tasks: [...prev.tasks, { ...task, is_important, is_urgent }] };
        }
        return prev;
      });
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }

    setDraggedTask(null);
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  const hasAnyTasks = Object.values(matrix).some(q => q.length > 0);

  const quadrants = [
    { quadrant: 'important_urgent',         title: 'Важно и срочно',       description: 'Делать немедленно',        emoji: '🔴', color: '#ef4444' },
    { quadrant: 'important_not_urgent',     title: 'Важно, не срочно',     description: 'Планировать и делать',     emoji: '🔵', color: '#3b82f6' },
    { quadrant: 'not_important_urgent',     title: 'Не важно, срочно',     description: 'Делегировать',             emoji: '🟡', color: '#f59e0b' },
    { quadrant: 'not_important_not_urgent', title: 'Не важно, не срочно',  description: 'Удалить или отложить',     emoji: '⚪', color: '#94a3b8' },
  ];

  return (
    <>
      <div className="header">
        <h2>Матрица Эйзенхауэра</h2>
      </div>

      <div className="content-area">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>О Матрице Эйзенхауэра</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            Матрица помогает расставить приоритеты задач по двум критериям: важность и срочность.
            Перетаскивайте задачи между квадрантами для изменения их приоритета.
          </p>
        </div>

        {!hasAnyTasks ? (
          <div className="empty-state">
            <h3>Нет задач в матрице</h3>
            <p>Добавьте параметры важности и срочности к задачам для их отображения здесь</p>
          </div>
        ) : (
          <div className="eisenhower-matrix">
            {quadrants.map(({ quadrant, title, description, emoji, color }) => (
              <QuadrantBox
                key={quadrant}
                quadrant={quadrant}
                title={title}
                description={description}
                emoji={emoji}
                color={color}
                tasks={matrix[quadrant]}
                onDrop={handleDrop}
                setExpandedQuadrant={setExpandedQuadrant}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {expandedQuadrant && (
        <QuadrantModal
          {...expandedQuadrant}
          onClose={() => setExpandedQuadrant(null)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      )}
    </>
  );
};

export default EisenhowerMatrix;

