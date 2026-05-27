import React, { useState } from 'react';

const NeuralResults = ({ neuralDetections, loading, openEvent }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // Типы объектов для фильтрации
  const objectTypes = {
    person: { label: '👤 Человек', icon: '👤', color: '#f59e0b' },
    tree: { label: '🌳 Дерево', icon: '🌳', color: '#10b981' },
    obstacle: { label: '📦 Посторонний объект', icon: '📦', color: '#ef4444' },
    vehicle: { label: '🚗 Транспорт', icon: '🚗', color: '#3b82f6' },
    default: { label: '❓ Неизвестно', icon: '❓', color: '#6b7a8f' }
  };
  
  const getObjectType = (type) => objectTypes[type] || objectTypes.default;
  
  // Фильтрация детекций
  const filteredDetections = neuralDetections.filter(det => {
    if (filterType !== 'all' && det.type !== filterType) return false;
    if (filterSeverity !== 'all' && det.severity !== filterSeverity) return false;
    return true;
  });
  
  // Статистика
  const stats = {
    total: neuralDetections.length,
    critical: neuralDetections.filter(d => d.severity === 'critical').length,
    warning: neuralDetections.filter(d => d.severity === 'warning').length,
    byType: {
      person: neuralDetections.filter(d => d.type === 'person').length,
      tree: neuralDetections.filter(d => d.type === 'tree').length,
      obstacle: neuralDetections.filter(d => d.type === 'obstacle').length,
      vehicle: neuralDetections.filter(d => d.type === 'vehicle').length,
    }
  };
  
  if (loading) {
    return <div className="loading">Загрузка данных с нейросети...</div>;
  }
  
  return (
    <div className="neural-results">
      {/* Статистика */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-label">Всего детекций</div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-hint">за последние 24 часа</div>
        </div>
        <div className="kpi-card critical">
          <div className="kpi-label">Критические</div>
          <div className="kpi-value">{stats.critical}</div>
          <div className="kpi-hint">требуют немедленной реакции</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Требуют внимания</div>
          <div className="kpi-value">{stats.warning}</div>
          <div className="kpi-hint">средний уровень риска</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Обнаруженные типы</div>
          <div className="kpi-value" style={{ fontSize: '1rem', display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span>👤 {stats.byType.person}</span>
            <span>🌳 {stats.byType.tree}</span>
            <span>📦 {stats.byType.obstacle}</span>
            <span>🚗 {stats.byType.vehicle}</span>
          </div>
        </div>
      </div>
      
      {/* Фильтры */}
      <div className="filters">
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Все типы объектов</option>
          <option value="person">👤 Человек</option>
          <option value="tree">🌳 Дерево</option>
          <option value="obstacle">📦 Посторонний объект</option>
          <option value="vehicle">🚗 Транспорт</option>
        </select>
        
        <select className="filter-select" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="all">Все уровни риска</option>
          <option value="critical">⚠️ Критический</option>
          <option value="warning">⚡ Требует внимания</option>
          <option value="info">ℹ️ Информационный</option>
        </select>
      </div>
      
      {/* Список детекций - ЗДЕСЬ ВСТАВЛЕН ИСПРАВЛЕННЫЙ КОД */}
      <div className="detections-list">
        <h3 style={{ marginBottom: '20px' }}>Результаты анализа нейросети</h3>
        
        {filteredDetections.length === 0 ? (
          <div className="empty-state">Нет детекций по выбранным фильтрам</div>
        ) : (
          filteredDetections.map(detection => {
            const typeInfo = getObjectType(detection.type);
            
            return (
              <div key={detection.id} className={`detection-card ${detection.severity}`}>
                <div className="detection-icon">{typeInfo.icon}</div>
                <div className="detection-info">
                  <div className="detection-type">
                    {typeInfo.label}
                    <span className="detection-confidence" style={{ marginLeft: '16px' }}>
                      Уверенность: <span>{Math.round(detection.confidence * 100)}%</span>
                    </span>
                  </div>
                  <div className="detection-location">📍 {detection.location}</div>
                  <div className="detection-time">🕐 {detection.timestamp}</div>
                  <div className="detection-description">
                    {detection.description}
                  </div>
                </div>
                <div className="detection-actions">
                  <div className={`badge ${detection.severity}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                    {detection.severity === 'critical' ? 'Критично' : detection.severity === 'warning' ? 'Внимание' : 'Инфо'}
                  </div>
                  <button 
                    className="btn" 
                    style={{ marginTop: '8px', width: '100%' }} 
                    onClick={() => openEvent && openEvent({ id: detection.id, title: detection.description })}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Легенда */}
      <div className="legend">
        <h4 style={{ marginBottom: '16px' }}>Что обнаруживает нейросеть:</h4>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div><span className="badge critical">Критический риск</span> — объект непосредственно на путях, требуется срочная реакция</div>
          <div><span className="badge warning">Средний риск</span> — человек или объект вблизи зоны габарита</div>
          <div><span className="badge info">Низкий риск</span> — потенциально опасная ситуация, требует наблюдения</div>
        </div>
      </div>
    </div>
  );
};

export default NeuralResults;