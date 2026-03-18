import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, Download, ChevronDown, ExternalLink, X as XIcon } from 'lucide-react';
import { tasksAPI, projectsAPI } from '../services/api';
import TaskModal from '../components/TaskModal';
import ExcelFilter from '../components/ExcelFilter';
import axios from 'axios';

const AllTasks = ({ projectId = null, showCompleted = false, hideHeader = false }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    search: '',
    assignee: [],
    priority: [],
    project_id: [],
    rice_category: []
  });

  const [uniqueAssignees, setUniqueAssignees] = useState([]);

  useEffect(() => {
    loadData();
  }, [projectId, showCompleted, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        is_completed: showCompleted,
        is_draft: false
      };
      if (projectId) params.project_id = projectId;
      if (filters.search) params.search = filters.search;
      if (filters.assignee.length > 0) params.assignee = filters.assignee[0]; // Backend поддерживает один assignee
      if (filters.priority.length > 0) params.priority = filters.priority.join(',');
      if (filters.project_id.length > 0 && !projectId) params.project_id = filters.project_id[0];

      const [tasksResponse, projectsResponse] = await Promise.all([
        tasksAPI.getAll(params),
        projectsAPI.getAll()
      ]);

      let filteredTasks = tasksResponse.data;

      // Дополнительная клиентская фильтрация
      if (filters.assignee.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          filters.assignee.includes(task.assignee)
        );
      }

      if (filters.project_id.length > 0 && !projectId) {
        filteredTasks = filteredTasks.filter(task =>
          filters.project_id.includes(task.project_id)
        );
      }

      if (filters.rice_category.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          filters.rice_category.includes(task.rice_category)
        );
      }

      setTasks(filteredTasks);
      setProjects(projectsResponse.data);
      const assignees = [...new Set(tasksResponse.data.map(t => t.assignee).filter(Boolean))];
      setUniqueAssignees(assignees);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async (task) => {
    try {
      await tasksAPI.update(task.id, { is_completed: !task.is_completed });
      loadData();
    } catch (error) {
      console.error('Ошибка обновления статуса задачи:', error);
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

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/excel/template', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowDropdown(false);
    } catch (error) {
      console.error('Ошибка скачивания шаблона:', error);
      alert('Ошибка при скачивании шаблона');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      const response = await axios.post('http://localhost:8080/api/tasks/excel/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Успешно импортировано ${response.data.count} задач(и)`);
      loadData();
      setShowDropdown(false);
    } catch (error) {
      console.error('Ошибка импорта:', error);
      const errorMessage = error.response?.data?.detail || 'Ошибка при импорте файла';
      alert(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const priorityColors = {
      'Low': { bg: '#e0f2fe', text: '#0369a1', icon: '🟢' },
      'Medium': { bg: '#fef3c7', text: '#d97706', icon: '🟡' },
      'High': { bg: '#fed7aa', text: '#ea580c', icon: '🟠' },
      'Highest': { bg: '#fecaca', text: '#dc2626', icon: '🔴' }
    };
    const style = priorityColors[priority];
    if (!style) return null;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '500',
        backgroundColor: style.bg,
        color: style.text
      }}>
        {style.icon} {priority}
      </span>
    );
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


  const clearFilters = () => {
    setFilters({
      search: '',
      assignee: [],
      priority: [],
      project_id: [],
      rice_category: []
    });
  };

  const hasActiveFilters = () => {
    return filters.search !== '' ||
           Object.keys(filters).some(key => key !== 'search' && filters[key].length > 0);
  };

  // Получение уникальных значений для фильтров
  const getUniqueValues = (field) => {
    const allTasks = tasks; // Используем текущие задачи
    const values = allTasks.map(task => {
      if (field === 'project_id' && task.project) {
        return task.project.name;
      }
      return task[field];
    }).filter(v => v !== null && v !== undefined && v !== '');
    return [...new Set(values)].sort();
  };

  const getProjectNameById = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
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
      {!hideHeader && (
        <div className="header">
          <h2>{showCompleted ? 'Завершенные задачи' : projectId ? 'Проект' : 'Все задачи'}</h2>
          {!showCompleted && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                className="btn btn-primary"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                Новая задача
                <ChevronDown size={16} />
              </button>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e2e8f0',
                  minWidth: '220px',
                  zIndex: 1000
                }}>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskModal(true);
                      setShowDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#334155',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus size={16} />
                    Создать вручную
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#334155',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Download size={16} />
                    Скачать шаблон Excel
                  </button>
                  <label
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: uploading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: uploading ? '#94a3b8' : '#334155',
                      borderRadius: '0 0 8px 8px'
                    }}
                    onMouseEnter={(e) => !uploading && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Upload size={16} />
                    {uploading ? 'Загрузка...' : 'Загрузить из Excel'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      <div className="content-area">

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>Нет задач</h3>
            <p>{showCompleted ? 'Нет завершенных задач' : 'Создайте первую задачу'}</p>
          </div>
        ) : (
          <div className="tasks-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Название
                      <ExcelFilter
                        field="search"
                        label="Название"
                        isSearch={true}
                        searchValue={filters.search}
                        onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                      />
                    </div>
                  </th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Исполнитель
                      <ExcelFilter
                        field="assignee"
                        label="Исполнитель"
                        values={getUniqueValues('assignee')}
                        selectedValues={filters.assignee}
                        onChange={(values) => setFilters(prev => ({ ...prev, assignee: values }))}
                      />
                    </div>
                  </th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Приоритет
                      <ExcelFilter
                        field="priority"
                        label="Приоритет"
                        values={['Low', 'Medium', 'High', 'Highest']}
                        selectedValues={filters.priority}
                        onChange={(values) => setFilters(prev => ({ ...prev, priority: values }))}
                      />
                    </div>
                  </th>
                  {!projectId && (
                    <th>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Проект
                        <ExcelFilter
                          field="project_id"
                          label="Проект"
                          values={projects.map(p => p.name)}
                          selectedValues={filters.project_id.map(id => {
                            const project = projects.find(p => p.id === id);
                            return project ? project.name : '';
                          }).filter(Boolean)}
                          onChange={(names) => {
                            const ids = names.map(name => projects.find(p => p.name === name)?.id).filter(Boolean);
                            setFilters(prev => ({ ...prev, project_id: ids }));
                          }}
                        />
                      </div>
                    </th>
                  )}
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Priority Score
                      <ExcelFilter
                        field="rice_category"
                        label="Priority Score"
                        values={['В работу', 'Кандидат', 'Требуется уточнение', 'Не берём']}
                        selectedValues={filters.rice_category}
                        onChange={(values) => setFilters(prev => ({ ...prev, rice_category: values }))}
                      />
                    </div>
                  </th>
                  <th style={{ width: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      Действия
                      {hasActiveFilters() && (
                        <button
                          onClick={clearFilters}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '4px',
                            fontWeight: '500'
                          }}
                          title="Сбросить все фильтры"
                        >
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} style={{ opacity: task.is_completed ? 0.6 : 1 }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => handleToggleCompleted(task)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        title={task.is_completed ? 'Вернуть в работу' : 'Отметить выполненной'}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                          {task.title}
                        </strong>
                        {task.link && (
                          <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#3b82f6', display: 'inline-flex' }}
                            title="Открыть ссылку"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>{task.assignee || '-'}</td>
                    <td>{getPriorityBadge(task.priority || task.auto_priority) || '-'}</td>
                    {!projectId && (
                      <td>
                        {task.project ? (
                          <span>
                            {task.project.icon && `${task.project.icon} `}
                            {task.project.name}
                          </span>
                        ) : '-'}
                      </td>
                    )}
                    <td>{getRiceBadge(task) || '-'}</td>
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
                          <XIcon size={14} />
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
    </>
  );
};

export default AllTasks;

