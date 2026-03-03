import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { tasksAPI, taskGroupsAPI } from '../services/api';

const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    assignee: '',
    value: '',
    reach: '',
    budget_impact: '',
    confidence: '',
    is_important: '',
    is_urgent: '',
    group_id: '',
  });

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    loadGroups();
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        link: task.link || '',
        assignee: task.assignee || '',
        value: task.value || '',
        reach: task.reach || '',
        budget_impact: task.budget_impact || '',
        confidence: task.confidence || '',
        is_important: task.is_important !== undefined ? task.is_important : '',
        is_urgent: task.is_urgent !== undefined ? task.is_urgent : '',
        group_id: task.group_id || '',
      });
    }
  }, [task]);

  const loadGroups = async () => {
    try {
      const response = await taskGroupsAPI.getAll();
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка загрузки групп:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        value: formData.value ? parseInt(formData.value) : null,
        reach: formData.reach ? parseInt(formData.reach) : null,
        budget_impact: formData.budget_impact ? parseFloat(formData.budget_impact) : null,
        confidence: formData.confidence ? parseInt(formData.confidence) : null,
        is_important: formData.is_important !== '' ? parseInt(formData.is_important) : null,
        is_urgent: formData.is_urgent !== '' ? parseInt(formData.is_urgent) : null,
        group_id: formData.group_id || null,
      };

      if (task) {
        await tasksAPI.update(task.id, dataToSend);
      } else {
        await tasksAPI.create(dataToSend);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
      alert('Ошибка при сохранении задачи');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Редактировать задачу' : 'Новая задача'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ссылка на задачу</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Исполнитель</label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Группа</label>
              <select name="group_id" value={formData.group_id} onChange={handleChange}>
                <option value="">Без группы</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>

          <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#475569' }}>
            Rice Scoring (опционально)
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label>Value (1-5)</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>

            <div className="form-group">
              <label>Reach (1-5)</label>
              <input
                type="number"
                name="reach"
                value={formData.reach}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget Impact</label>
              <select name="budget_impact" value={formData.budget_impact} onChange={handleChange}>
                <option value="">Не указано</option>
                <option value="1">1.0</option>
                <option value="1.2">1.2</option>
                <option value="1.5">1.5</option>
                <option value="2">2.0</option>
              </select>
            </div>

            <div className="form-group">
              <label>Confidence (%)</label>
              <select name="confidence" value={formData.confidence} onChange={handleChange}>
                <option value="">Не указано</option>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => (
                  <option key={val} value={val}>{val}%</option>
                ))}
              </select>
            </div>
          </div>

          <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#475569' }}>
            Матрица Эйзенхауэра (опционально)
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label>Важно?</label>
              <select name="is_important" value={formData.is_important} onChange={handleChange}>
                <option value="">Не указано</option>
                <option value="1">Да</option>
                <option value="0">Нет</option>
              </select>
            </div>

            <div className="form-group">
              <label>Срочно?</label>
              <select name="is_urgent" value={formData.is_urgent} onChange={handleChange}>
                <option value="">Не указано</option>
                <option value="1">Да</option>
                <option value="0">Нет</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

