import React, { useState } from 'react';
import { X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('priority-score');

  if (!isOpen) return null;

  const sections = [
    { id: 'priority-score', title: 'Priority Score' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'priority-score':
        return (
          <div className="help-content">
            <h2>О методике Priority Score (Rice Scoring)</h2>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div style={{
                background: '#f1f5f9',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Priority Score = Value × Reach × Budget Impact × Confidence
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Параметры оценки:</h3>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: '#2563eb', marginBottom: '8px' }}>Value (1-5) — влияние фичи</h4>
                <p style={{ color: '#64748b', marginLeft: '16px' }}>
                  Насколько сильно фича меняет поведение пользователей или работу системы
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: '#2563eb', marginBottom: '8px' }}>Reach (1-5) — охват пользователей</h4>
                <p style={{ color: '#64748b', marginLeft: '16px' }}>
                  Какая доля пользователей затронута
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: '#2563eb', marginBottom: '8px' }}>Budget Impact (1, 1.2, 1.5, 2) — влияние на бюджет</h4>
                <p style={{ color: '#64748b', marginLeft: '16px' }}>
                  Потенциальное влияние на бюджет проекта
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: '#2563eb', marginBottom: '8px' }}>Confidence (10-100%) — уверенность в оценке</h4>
                <p style={{ color: '#64748b', marginLeft: '16px' }}>
                  Насколько мы уверены в данной задаче. Указывается только в круглых числах: 10, 20, 30 и т.д.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <h3>Интерпретация результатов:</h3>

              <table style={{
                width: '100%',
                marginTop: '16px',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #cbd5e1',
                      fontWeight: '600'
                    }}>Score</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #cbd5e1',
                      fontWeight: '600'
                    }}>Решение</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      fontWeight: '600'
                    }}>40+</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      color: '#16a34a'
                    }}>✓ Берём в работу</td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      fontWeight: '600'
                    }}>25-39</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      color: '#2563eb'
                    }}>→ Кандидат в работу (проверка effort и ограничений)</td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      fontWeight: '600'
                    }}>10-24</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      color: '#f59e0b'
                    }}>⚠ Требуется уточнение (Discovery)</td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '12px',
                      fontWeight: '600'
                    }}>0-9</td>
                    <td style={{
                      padding: '12px',
                      color: '#dc2626'
                    }}>✗ Не берём в работу / Icebox</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Боковое меню */}
        <div style={{
          width: '240px',
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            padding: '0 24px',
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b'
          }}>Справка</h3>

          <nav style={{ flex: 1 }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  textAlign: 'left',
                  border: 'none',
                  background: activeSection === section.id ? '#e0e7ff' : 'transparent',
                  color: activeSection === section.id ? '#3730a3' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeSection === section.id ? '600' : '400',
                  transition: 'all 0.2s',
                  borderLeft: activeSection === section.id ? '3px solid #4f46e5' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Контент */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Заголовок с кнопкой закрытия */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <X size={20} color="#64748b" />
            </button>
          </div>

          {/* Основной контент */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px'
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

