import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

const RiceScoring = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getRiceScoring();
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiceBadgeClass = (category) => {
    if (category === 'В работу') return 'badge-success';
    if (category === 'Кандидат') return 'badge-info';
    if (category === 'Требуется уточнение') return 'badge-warning';
    return 'badge-danger';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h2>Rice Scoring</h2>
      </div>

      <div className="content-area">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>О методике Rice Scoring</h3>
          <p style={{ marginBottom: '10px', color: '#475569' }}>
            <strong>Priority Score = Value × Reach × Budget Impact × Confidence</strong>
          </p>
          <ul style={{ color: '#64748b', lineHeight: '1.6' }}>
            <li><strong>Value (1-5)</strong> — влияние фичи на поведение пользователей</li>
            <li><strong>Reach (1-5)</strong> — охват пользователей</li>
            <li><strong>Budget Impact (1, 1.2, 1.5, 2)</strong> — влияние на бюджет</li>
            <li><strong>Confidence (10-100%)</strong> — уверенность в оценке</li>
          </ul>
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #e2e8f0' }}>Score</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #e2e8f0' }}>Решение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}><strong>40+</strong></td>
                  <td style={{ padding: '8px' }}>Берём в работу</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}><strong>25-39</strong></td>
                  <td style={{ padding: '8px' }}>Кандидат в работу</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}><strong>10-24</strong></td>
                  <td style={{ padding: '8px' }}>Требуется уточнение (Discovery)</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}><strong>0-9</strong></td>
                  <td style={{ padding: '8px' }}>Не берём в работу / Icebox</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>Нет оцененных задач</h3>
            <p>Добавьте Rice Scoring параметры к задачам для их отображения здесь</p>
          </div>
        ) : (
          <div className="tasks-table">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th style={{ textAlign: 'center' }}>Value</th>
                  <th style={{ textAlign: 'center' }}>Reach</th>
                  <th style={{ textAlign: 'center' }}>Budget</th>
                  <th style={{ textAlign: 'center' }}>Confidence</th>
                  <th style={{ textAlign: 'center' }}>Score</th>
                  <th>Категория</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      {task.assignee && (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                          Исполнитель: {task.assignee}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>{task.value}</td>
                    <td style={{ textAlign: 'center' }}>{task.reach}</td>
                    <td style={{ textAlign: 'center' }}>{task.budget_impact}</td>
                    <td style={{ textAlign: 'center' }}>{task.confidence}%</td>
                    <td style={{ textAlign: 'center' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>
                        {task.rice_score.toFixed(1)}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${getRiceBadgeClass(task.rice_category)}`}>
                        {task.rice_category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default RiceScoring;

