import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, ListTodo, BarChart3, Grid2X2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: ListTodo, label: 'Все задачи', path: '/' },
  ];

  const analyticsItems = [
    { icon: BarChart3, label: 'Rice Scoring', path: '/analytics/rice' },
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
            {menuItems.map((item) => {
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
      </div>
    </div>
  );
};

export default Sidebar;

