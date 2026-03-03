import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AllTasks from './pages/AllTasks';
import RiceScoring from './pages/RiceScoring';
import EisenhowerMatrix from './pages/EisenhowerMatrix';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<AllTasks />} />
            <Route path="/analytics/rice" element={<RiceScoring />} />
            <Route path="/analytics/eisenhower" element={<EisenhowerMatrix />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

