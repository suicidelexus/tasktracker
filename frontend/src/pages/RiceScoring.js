import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, MessageSquare, AlignJustify, AlignLeft } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import TaskModal from '../components/TaskModal';
import ExcelFilter from '../components/ExcelFilter';
import CommentsPanel from '../components/CommentsPanel';

const RiceScoring = () => {
  const [draftTasks, setDraftTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringTask, setTransferringTask] = useState(null);
  const [commentsTask, setCommentsTask] = useState(null);
  const [density, setDensity] = useState(() => localStorage.getItem('tableDensity') || 'comfortable');

  // Фильтры
  const [filters, setFilters] = useState({
    title: '',
    value: [],
    reach: [],
    budget_impact: [],
    confidence: [],
    rice_category: []
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getRiceScoring({ is_draft: true });
      // Сортируем по Score от большего к меньшему
      const sorted = response.data.sort((a, b) => b.rice_score - a.rice_score);
      setDraftTasks(sorted);
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
    // Задача должна исчезнуть из списка сразу
    setDraftTasks(prevTasks => prevTasks.filter(t => t.id !== transferringTask.id));
  };

  const getRiceBadgeClass = (category) => {
    if (category === 'В работу') return 'badge-success';
    if (category === 'Кандидат') return 'badge-info';
    if (category === 'Требуется уточнение') return 'badge-warning';
    return 'badge-danger';
  };

  // Применение фильтров
  const getFilteredTasks = () => {
    return draftTasks.filter(task => {
      // Фильтр по названию (поиск)
      if (filters.title && !task.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      // Фильтр по Value
      if (filters.value.length > 0 && !filters.value.includes(task.value)) {
        return false;
      }

      // Фильтр по Reach
      if (filters.reach.length > 0 && !filters.reach.includes(task.reach)) {
        return false;
      }

      // Фильтр по Budget Impact
      if (filters.budget_impact.length > 0 && !filters.budget_impact.includes(task.budget_impact)) {
        return false;
      }

      // Фильтр по Confidence
      if (filters.confidence.length > 0 && !filters.confidence.includes(task.confidence)) {
        return false;
      }

      // Фильтр по категории Score
      if (filters.rice_category.length > 0 && !filters.rice_category.includes(task.rice_category)) {
        return false;
      }

      return true;
    });
  };

  // Получение уникальных значений для фильтров
  const getUniqueValues = (field) => {
    const values = draftTasks.map(task => task[field]);
    return [...new Set(values)].sort((a, b) => {
      if (typeof a === 'number') return b - a;
      return String(a).localeCompare(String(b));
    });
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      value: [],
      reach: [],
      budget_impact: [],
      confidence: [],
      rice_category: []
    });
  };

  const hasActiveFilters = () => {
    return filters.title !== '' ||
           Object.keys(filters).some(key => key !== 'title' && filters[key].length > 0);
  };

  const changeDensity = (value) => {
    setDensity(value);
    localStorage.setItem('tableDensity', value);
  };


  const filteredTasks = getFilteredTasks();

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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {hasActiveFilters() && (
            <button
              className="btn btn-secondary"
              onClick={clearFilters}
              style={{ fontSize: '14px' }}
            >
              Сбросить фильтры
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => setShowDraftModal(true)}
          >
            <Plus size={18} />
            Создать черновик задачи
          </button>
        </div>
      </div>

      <div className="content-area">
        {draftTasks.length === 0 ? (
          <div className="empty-state">
            <h3>Нет черновиков для оценки</h3>
            <p>Создайте черновик задачи для предварительной оценки по Priority Score</p>
          </div>
        ) : (
          <>
            <div className="tasks-table">
              {/* Density toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '8px 16px', borderBottom: '1px solid #e2e8f0', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '6px' }}>Вид:</span>
                <button
                  onClick={() => changeDensity('comfortable')}
                  style={{
                    padding: '4px 8px', border: '1px solid', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                    background: density === 'comfortable' ? '#eff6ff' : 'white',
                    borderColor: density === 'comfortable' ? '#3b82f6' : '#e2e8f0',
                    color: density === 'comfortable' ? '#3b82f6' : '#64748b',
                    fontWeight: density === 'comfortable' ? 600 : 400
                  }}
                >
                  <AlignJustify size={13} /> Comfortable
                </button>
                <button
                  onClick={() => changeDensity('compact')}
                  style={{
                    padding: '4px 8px', border: '1px solid', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                    background: density === 'compact' ? '#eff6ff' : 'white',
                    borderColor: density === 'compact' ? '#3b82f6' : '#e2e8f0',
                    color: density === 'compact' ? '#3b82f6' : '#64748b',
                    fontWeight: density === 'compact' ? 600 : 400
                  }}
                >
                  <AlignLeft size={13} /> Compact
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th className={`sticky-th density-${density}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Название
                        <ExcelFilter field="title" label="Название" isSearch={true} searchValue={filters.title} onSearchChange={(value) => setFilters(prev => ({ ...prev, title: value }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Value
                        <ExcelFilter field="value" label="Value" values={getUniqueValues('value')} selectedValues={filters.value} onChange={(values) => setFilters(prev => ({ ...prev, value: values }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Reach
                        <ExcelFilter field="reach" label="Reach" values={getUniqueValues('reach')} selectedValues={filters.reach} onChange={(values) => setFilters(prev => ({ ...prev, reach: values }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Budget
                        <ExcelFilter field="budget_impact" label="Budget Impact" values={getUniqueValues('budget_impact')} selectedValues={filters.budget_impact} onChange={(values) => setFilters(prev => ({ ...prev, budget_impact: values }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Confidence
                        <ExcelFilter field="confidence" label="Confidence" values={getUniqueValues('confidence')} selectedValues={filters.confidence} onChange={(values) => setFilters(prev => ({ ...prev, confidence: values }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ textAlign: 'center' }}>Score</th>
                    <th className={`sticky-th density-${density}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Решение
                        <ExcelFilter field="rice_category" label="Решение" values={getUniqueValues('rice_category')} selectedValues={filters.rice_category} onChange={(values) => setFilters(prev => ({ ...prev, rice_category: values }))} />
                      </div>
                    </th>
                    <th className={`sticky-th density-${density}`} style={{ width: '140px' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id}>
                      <td className={`density-td-${density}`}><span style={{ fontWeight: 500, color: '#1e293b' }}>{task.title}</span></td>
                      <td className={`density-td-${density}`} style={{ textAlign: 'center', color: '#475569' }}>{task.value}</td>
                      <td className={`density-td-${density}`} style={{ textAlign: 'center', color: '#475569' }}>{task.reach}</td>
                      <td className={`density-td-${density}`} style={{ textAlign: 'center', color: '#475569' }}>{task.budget_impact}</td>
                      <td className={`density-td-${density}`} style={{ textAlign: 'center', color: '#475569' }}>{task.confidence}%</td>
                      <td className={`density-td-${density}`} style={{ textAlign: 'center' }}>
                        <strong style={{ fontSize: '15px', color: '#1e293b' }}>{task.rice_score.toFixed(1)}</strong>
                      </td>
                      <td className={`density-td-${density}`}>
                        <span className={`badge ${getRiceBadgeClass(task.rice_category)}`}>{task.rice_category}</span>
                      </td>
                      <td className={`density-td-${density}`}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-secondary btn-small" onClick={() => setCommentsTask(task)} title="Комментарии">
                            <MessageSquare size={14} />
                          </button>
                          <button className="btn btn-primary btn-small" onClick={() => handleTransferToAll(task)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowRight size={14} />
                            Перенести
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && draftTasks.length > 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Нет задач, соответствующих фильтрам
              </div>
            )}
          </>
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

      <CommentsPanel
        task={commentsTask}
        onClose={() => setCommentsTask(null)}
      />
    </>
  );
};

export default RiceScoring;


