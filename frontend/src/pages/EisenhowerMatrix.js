import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

const EisenhowerMatrix = () => {
  const [matrix, setMatrix] = useState({
    important_urgent: [],
    important_not_urgent: [],
    not_important_urgent: [],
    not_important_not_urgent: []
  });
  const [loading, setLoading] = useState(true);

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

  const TaskItem = ({ task }) => (
    <div className="task-item">
      <h4>{task.title}</h4>
      {task.assignee && <p>Исполнитель: {task.assignee}</p>}
      {task.group && <p>Группа: {task.group.name}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const hasAnyTasks = Object.values(matrix).some(quadrant => quadrant.length > 0);

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
            Это позволяет эффективно распределять время и ресурсы.
          </p>
        </div>

        {!hasAnyTasks ? (
          <div className="empty-state">
            <h3>Нет задач в матрице</h3>
            <p>Добавьте параметры важности и срочности к задачам для их отображения здесь</p>
          </div>
        ) : (
          <div className="eisenhower-matrix">
            <div className="matrix-quadrant important-urgent">
              <h3>🔴 Важно и срочно</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Делать немедленно
              </p>
              {matrix.important_urgent.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Нет задач</p>
              ) : (
                matrix.important_urgent.map(task => <TaskItem key={task.id} task={task} />)
              )}
            </div>

            <div className="matrix-quadrant important-not-urgent">
              <h3>🔵 Важно, не срочно</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Планировать и делать
              </p>
              {matrix.important_not_urgent.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Нет задач</p>
              ) : (
                matrix.important_not_urgent.map(task => <TaskItem key={task.id} task={task} />)
              )}
            </div>

            <div className="matrix-quadrant not-important-urgent">
              <h3>🟡 Не важно, срочно</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Делегировать
              </p>
              {matrix.not_important_urgent.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Нет задач</p>
              ) : (
                matrix.not_important_urgent.map(task => <TaskItem key={task.id} task={task} />)
              )}
            </div>

            <div className="matrix-quadrant not-important-not-urgent">
              <h3>⚪ Не важно, не срочно</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Удалить или отложить
              </p>
              {matrix.not_important_not_urgent.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Нет задач</p>
              ) : (
                matrix.not_important_not_urgent.map(task => <TaskItem key={task.id} task={task} />)
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EisenhowerMatrix;

