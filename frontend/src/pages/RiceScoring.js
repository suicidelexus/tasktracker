import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import TaskModal from '../components/TaskModal';

const RiceScoring = () => {
  const [draftTasks, setDraftTasks] = useState([]);
  const [regularTasks, setRegularTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringTask, setTransferringTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [draftsResponse, regularResponse] = await Promise.all([
        analyticsAPI.getRiceScoring({ is_draft: true }),
        analyticsAPI.getRiceScoring({ is_draft: false })
      ]);
      setDraftTasks(draftsResponse.data);
      setRegularTasks(regularResponse.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToAll = (task) => {
    setTransferringTask(task);
    setShowTransferModal(true);
  };

  const handleSaveTransfer = async () => {
    loadTasks();
  };

  const getRiceBadgeClass = (category) => {
    if (category === 'В работу') return 'badge-success';
    if (category === 'Кандидат') return 'badge-info';
    if (category === 'Требуется уточнение') return 'badge-warning';
    return 'badge-danger';
  };

  const renderTasksTable = (tasks, showTransferButton = false) => (
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
            <th>Решение</th>
            {showTransferButton && <th style={{ width: '150px' }}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td><strong>{task.title}</strong></td>
              <td style={{ textAlign: 'center' }}>{task.value}</td>
              <td style={{ textAlign: 'center' }}>{task.reach}</td>
              <td style={{ textAlign: 'center' }}>{task.budget_impact}</td>
              <td style={{ textAlign: 'center' }}>{task.confidence}%</td>
              <td style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '1.1rem' }}>{task.rice_score.toFixed(1)}</strong>
              </td>
              <td>
                <span className={`badge ${getRiceBadgeClass(task.rice_category)}`}>
                  {task.rice_category}
                </span>
              </td>
              {showTransferButton && (
                <td>
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleTransferToAll(task)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ArrowRight size={14} />
                    Перенести
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
        <h2>Priority Score</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowDraftModal(true)}
        >
          <Plus size={18} />
          Создать черновик задачи
        </button>
      </div>

      <div className="content-area">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>О методике Priority Score (Rice Scoring)</h3>
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

        {draftTasks.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#475569' }}>
              Черновики (предварительная оценка)
            </h3>
            {renderTasksTable(draftTasks, true)}
          </div>
        )}

        <h3 style={{ marginBottom: '15px', color: '#475569' }}>
          {draftTasks.length > 0 ? 'Задачи в работе' : 'Все оцененные задачи'}
        </h3>
        {regularTasks.length === 0 ? (
          <div className="empty-state">
            <h3>Нет оцененных задач</h3>
            <p>Добавьте Priority Score параметры к задачам для их отображения здесь</p>
          </div>
        ) : (
          renderTasksTable(regularTasks, false)
        )}
      </div>

      {showDraftModal && (
        <TaskModal
          onClose={() => setShowDraftModal(false)}
          onSave={() => {
            setShowDraftModal(false);
            loadTasks();
          }}
          isDraft={true}
        />
      )}

      {showTransferModal && transferringTask && (
        <TaskModal
          task={{ ...transferringTask, is_draft: false }}
          onClose={() => {
            setShowTransferModal(false);
            setTransferringTask(null);
          }}
          onSave={() => {
            setShowTransferModal(false);
            setTransferringTask(null);
            handleSaveTransfer();
          }}
          isDraft={false}
        />
      )}
    </>
  );
};

export default RiceScoring;

