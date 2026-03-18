import React, { useState, useEffect } from 'react';
import { X, Trash2, Send } from 'lucide-react';
import { commentsAPI } from '../services/api';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const CommentsPanel = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) loadComments();
  }, [task]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await commentsAPI.getAll(task.id);
      setComments(res.data);
    } catch (err) {
      console.error('Ошибка загрузки комментариев:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const res = await commentsAPI.create(task.id, trimmed);
      setComments(prev => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Ошибка добавления комментария:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Ошибка удаления комментария:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAdd();
  };

  if (!task) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1100
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '360px',
        background: 'white',
        zIndex: 1101,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e2e8f0',
        animation: 'slideInRight 0.2s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Комментарии
            </p>
            <h3 style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', flexShrink: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>Загрузка...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
              Комментариев пока нет
            </p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {formatDate(comment.created_at)}
                  </span>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    title="Удалить комментарий"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать комментарий... (Ctrl+Enter для отправки)"
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#334155',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '8px',
              background: text.trim() ? '#3b82f6' : '#e2e8f0',
              color: text.trim() ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: text.trim() ? 'pointer' : 'default',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <Send size={14} />
            Отправить
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CommentsPanel;

