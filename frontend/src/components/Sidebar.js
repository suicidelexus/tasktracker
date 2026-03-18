import React, { useState, useEffect } from 'react';
import { Menu, X, ListTodo, BarChart3, Grid2X2, CheckCircle, Plus, ChevronDown, ChevronRight, FolderOpen, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const Sidebar = ({ onCreateProject, onOpenHelp }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const analyticsItems = [
    { icon: BarChart3, label: 'Priority Score', path: '/analytics/rice' },
    { icon: Grid2X2, label: 'Матрица Эйзенхауэра', path: '/analytics/eisenhower' },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isExpanded && <h1>Task Tracker</h1>}
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="section-title">Основное</div>
          <ul className="sidebar-menu">
            <li>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`} style={{ flex: 1 }}>
                  <ListTodo size={20} />
                  {isExpanded && <span>Все задачи</span>}
                </Link>
                {isExpanded && (
                  <button
                    onClick={() => {
                      setShowProjects(!showProjects);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showProjects ? 'Скрыть проекты' : 'Показать проекты'}
                  >
                    {showProjects ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>
            </li>

            {isExpanded && showProjects && (
              <>
                {projects.map((project) => (
                  <li key={project.id} style={{ paddingLeft: '20px' }}>
                    <Link
                      to={`/project/${project.id}`}
                      className={`menu-item ${location.pathname === `/project/${project.id}` ? 'active' : ''}`}
                    >
                      <span style={{ fontSize: '16px' }}>{project.icon || '📁'}</span>
                      <span>{project.name}</span>
                    </Link>
                  </li>
                ))}
                <li style={{ paddingLeft: '20px' }}>
                  <button
                    onClick={onCreateProject}
                    className="menu-item"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <Plus size={18} />
                    <span>Создать проект</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Аналитика</div>
          <ul className="sidebar-menu">
            {analyticsItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`menu-item ${isActive ? 'active' : ''}`}>
                    <Icon size={20} />
                    {isExpanded && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          <ul className="sidebar-menu">
            <li>
              <Link to="/completed" className={`menu-item ${location.pathname === '/completed' ? 'active' : ''}`}>
                <CheckCircle size={20} />
                {isExpanded && <span>Завершенные</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <ul className="sidebar-menu">
            <li>
              <button
                onClick={onOpenHelp}
                className="menu-item"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <HelpCircle size={20} />
                {isExpanded && <span>Справка</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

