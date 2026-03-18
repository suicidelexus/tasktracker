import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Edit2 } from 'lucide-react';
import AllTasks from './AllTasks';
import ProjectModal from '../components/ProjectModal';
import { projectsAPI } from '../services/api';

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getById(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Удалить проект "${project.name}"? Задачи будут перенесены в "Без проекта".`)) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      navigate('/');
    } catch (error) {
      console.error('Ошибка удаления проекта:', error);
      alert('Не удалось удалить проект');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      await projectsAPI.update(projectId, projectData);
      setShowEditModal(false);
      loadProject();
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
      alert('Не удалось обновить проект');
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0 }}>
            {project?.icon && <span style={{ marginRight: '8px' }}>{project.icon}</span>}
            {project?.name || 'Проект'}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#64748b';
              }}
              title="Редактировать проект"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDeleteProject}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#64748b';
              }}
              title="Удалить проект"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <AllTasks projectId={parseInt(projectId)} hideHeader={true} key={projectId} />

      {showEditModal && project && (
        <ProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProject}
        />
      )}
    </>
  );
};

export default ProjectView;

