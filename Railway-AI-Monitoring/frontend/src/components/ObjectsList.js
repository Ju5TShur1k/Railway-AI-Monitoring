// frontend/src/components/ObjectsList.js
import React, { useState } from 'react';

const ObjectsList = ({ neuralDetections, openEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const getObjectTypeInfo = (type) => {
    const types = {
      person: { label: '👤 Человек', icon: '👤', risk: 'warning' },
      tree: { label: '🌳 Дерево', icon: '🌳', risk: 'critical' },
      obstacle: { label: '📦 Посторонний предмет', icon: '📦', risk: 'critical' },
      vehicle: { label: '🚗 Транспорт', icon: '🚗', risk: 'warning' },
      default: { label: '❓ Неизвестный объект', icon: '❓', risk: 'info' }
    };
    return types[type] || types.default;
  };

  const filteredObjects = neuralDetections.filter(obj => {
    const matchesSearch = obj.type.includes(searchTerm) || 
                          obj.description.includes(searchTerm) || 
                          obj.location.includes(searchTerm);
    const matchesRisk = filterRisk === 'all' || obj.severity === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleOpenDetail = (detection) => {
    const eventFromDetection = {
      id: detection.id,
      title: detection.description,
      time: detection.timestamp,
      camera: detection.location.split(',')[0] || 'Камера',
      zone: detection.location.split(',')[1] || 'Зона',
      status: detection.severity,
      hasPhoto: true,
      description: detection.description,
      objectType: detection.type,
      confidence: detection.confidence,
      location: detection.location
    };
    openEvent(eventFromDetection);
  };

  return (
    <div>
      <div className="filters">
        <input 
          className="filter-input" 
          placeholder="Поиск объекта: тип / ID события / локация" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
          <option value="all">Все уровни риска</option>
          <option value="critical">Критический</option>
          <option value="warning">Средний риск</option>
          <option value="info">Низкий риск</option>
        </select>
      </div>

      <div className="object-grid">
        {filteredObjects.length === 0 ? (
          <div className="empty-state">Нет объектов по выбранным фильтрам</div>
        ) : (
          filteredObjects.map(obj => {
            const typeInfo = getObjectTypeInfo(obj.type);
            return (
              <article key={obj.id} className="object-card">
                <div className="thumb" style={{ 
                  background: '#2a3a4a', 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2rem' 
                }}>
                  {typeInfo.icon}
                </div>
                <div className="object-body">
                  <div className="object-title">OBJ-{obj.id} • {typeInfo.label}</div>
                  <div className="small-note">{obj.timestamp}</div>
                  <div className="small-note" style={{ marginTop: '4px' }}>📍 {obj.location}</div>
                  <div className="tags" style={{ marginTop: '8px' }}>
                    <span className={`badge ${obj.severity}`}>
                      {obj.severity === 'critical' ? 'Высокий риск' : obj.severity === 'warning' ? 'Средний риск' : 'Низкий риск'}
                    </span>
                    <span className="badge info">
                      Уверенность: {Math.round(obj.confidence * 100)}%
                    </span>
                  </div>
                  <button 
                    className="btn danger mt8" 
                    style={{ marginTop: '12px' }}
                    onClick={() => handleOpenDetail(obj)}
                  >
                    Подробнее
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ObjectsList;