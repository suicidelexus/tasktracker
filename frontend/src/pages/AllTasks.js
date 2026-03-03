import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FolderPlus } from 'lucide-react';
import { tasksAPI, taskGroupsAPI } from '../services/api';
import TaskModal from '../components/TaskModal';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedGroup]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, groupsResponse] = await Promise.all([
        tasksAPI.getAll(selectedGroup ? { group_id: selectedGroup } : {}),
        taskGroupsAPI.getAll()
      ]);
      setTasks(tasksResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Удалить задачу?')) {
      try {
        await tasksAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await taskGroupsAPI.create({ name: newGroupName, description: '' });
      setNewGroupName('');
      setShowGroupModal(false);
      loadData();
    } catch (error) {
      console.error('Ошибка создания группы:', error);
      alert('Ошибка при создании группы');
    }
  };

  const getRiceBadge = (task) => {
    if (!task.rice_score) return null;

    let className = 'badge ';
    if (task.rice_category === 'В работу') className += 'badge-success';
    else if (task.rice_category === 'Кандидат') className += 'badge-info';
    else if (task.rice_category === 'Требуется уточнение') className += 'badge-warning';
    else className += 'badge-danger';

    return (
      <span className={className}>
        {task.rice_category} ({task.rice_score.toFixed(1)})
      </span>
    );
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
        <h2>Все задачи</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowGroupModal(true)}>
            <FolderPlus size={18} />
            Создать группу
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
          >
            <Plus size={18} />
            Новая задача
          </button>
        </div>
      </div>

      <div className="content-area">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', fontWeight: '500' }}>Фильтр по группе:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">Все группы</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>Нет задач</h3>
            <p>Создайте первую задачу, нажав на кнопку "Новая задача"</p>
          </div>
        ) : (
          <div className="tasks-table">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Исполнитель</th>
                  <th>Группа</th>
                  <th>Rice Score</th>
                  <th>Эйзенхауэр</th>
                  <th style={{ width: '100px' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      {task.description && (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                          {task.description.substring(0, 100)}
                          {task.description.length > 100 && '...'}
                        </div>
                      )}
                      {task.link && (
                        <div style={{ marginTop: '4px' }}>
                          <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', color: '#3b82f6' }}
                          >
                            Открыть ссылку
                          </a>
                        </div>
                      )}
                    </td>
                    <td>{task.assignee || '-'}</td>
                    <td>{task.group?.name || '-'}</td>
                    <td>{getRiceBadge(task) || '-'}</td>
                    <td>{task.eisenhower_quadrant || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleEditTask(task)}
                          title="Редактировать"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Удалить"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={loadData}
        />
      )}

      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Создать группу</h3>
              <button className="close-btn" onClick={() => setShowGroupModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Название группы *</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGroupModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllTasks;

