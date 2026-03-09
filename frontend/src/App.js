import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AllTasks from './pages/AllTasks';
import RiceScoring from './pages/RiceScoring';
import EisenhowerMatrix from './pages/EisenhowerMatrix';
import Completed from './pages/Completed';
import ProjectView from './pages/ProjectView';
import ProjectModal from './components/ProjectModal';
import { projectsAPI } from './services/api';
import './index.css';

function App() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      await projectsAPI.create(projectData);
      setShowProjectModal(false);
      setSidebarKey(prev => prev + 1); // Перезагружаем Sidebar
      alert('Проект успешно создан!');
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      alert(`Ошибка при создании проекта: ${error.message}`);
    }
  };

  return (
    <Router>
      <div className="app">
        <Sidebar
          key={sidebarKey}
          onCreateProject={handleCreateProject}
        />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<AllTasks />} />
            <Route path="/project/:projectId" element={<ProjectView />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/analytics/rice" element={<RiceScoring />} />
            <Route path="/analytics/eisenhower" element={<EisenhowerMatrix />} />
          </Routes>
        </div>
      </div>

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onSave={handleSaveProject}
        />
      )}
    </Router>
  );
}

export default App;

