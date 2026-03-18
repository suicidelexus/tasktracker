import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Filter, X } from 'lucide-react';

const ExcelFilter = ({
  field,
  label,
  values = [],
  selectedValues = [],
  onChange,
  isSearch = false,
  searchValue = '',
  onSearchChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const filterRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем клики вне кнопки И выпадающего окна
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX
        });
      }
    };

    const handleScroll = () => {
      updatePosition();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);

      // Вычисляем начальную позицию
      updatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    onChange(values);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const isActive = isSearch ? searchValue !== '' : selectedValues.length > 0;
  const hasPartialSelection = selectedValues.length > 0 && selectedValues.length < values.length;

  return (
    <div ref={filterRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          color: isActive ? '#2563eb' : '#64748b',
          transition: 'color 0.2s'
        }}
        title={`Фильтр: ${label}`}
      >
        <Filter size={14} fill={isActive ? '#2563eb' : 'none'} />
      </button>

      {isOpen && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px',
            minWidth: '220px',
            maxWidth: '300px',
            zIndex: 10000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
              {label}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {isSearch ? (
            /* Поиск */
            <input
              type="text"
              placeholder={`Поиск...`}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
              autoFocus
            />
          ) : (
            /* Чекбоксы */
            <>
              {/* Кнопки управления */}
              {values.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={handleSelectAll}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      background: 'white',
                      cursor: 'pointer',
                      color: '#475569',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Выбрать все
                  </button>
                  <button
                    onClick={handleClearAll}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      background: 'white',
                      cursor: 'pointer',
                      color: '#475569',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Очистить
                  </button>
                </div>
              )}

              {/* Список значений */}
              <div style={{
                maxHeight: '250px',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                {values.length === 0 ? (
                  <div style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '14px'
                  }}>
                    Нет значений
                  </div>
                ) : (
                  values.map((value, index) => {
                    const isChecked = selectedValues.includes(value);
                    const displayValue = value === null || value === '' ? '(Пусто)' : String(value);

                    return (
                      <label
                        key={`${field}-${index}-${value}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '14px',
                          transition: 'background 0.2s',
                          marginBottom: '2px',
                          background: isChecked ? '#eff6ff' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isChecked) e.target.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isChecked) e.target.style.background = 'transparent';
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(value)}
                          style={{
                            marginRight: '10px',
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <span style={{
                          color: isChecked ? '#2563eb' : '#475569',
                          fontWeight: isChecked ? '500' : '400',
                          wordBreak: 'break-word'
                        }}>
                          {displayValue}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExcelFilter;

