import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AVAILABLE_ICONS = [
  '📋', '📊', '🚀', '💼', '🎯', '⚡', '🔥', '💡',
  '🤖', '📱', '💻', '🌟', '🎨', '🔧', '📈', '🏆',
  '✨', '🎪', '🎭', '🎬', '📚', '🔔', '📌', '🏃'
];

const ProjectModal = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📋'
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        icon: project.icon || '📋'
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (icon) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project ? 'Редактировать проект' : 'Новый проект'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Название проекта"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание проекта (необязательно)"
            />
          </div>

          <div className="form-group">
            <label>Иконка</label>
            <div className="icon-selector">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {project ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

