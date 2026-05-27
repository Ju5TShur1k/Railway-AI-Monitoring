// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SectionsList from './components/SectionsList';
import SectionDetail from './components/SectionDetail';
import EventHistory from './components/EventHistory';
import ObjectsList from './components/ObjectsList';
import EventDetail from './components/EventDetail';
import EvidenceViewer from './components/EvidenceViewer';
import NeuralResults from './components/NeuralResults';
import ImageUpload from './components/ImageUpload';
import { fetchSections, fetchEvents, fetchDetections } from './services/api';
import './App.css';

function App() {
  // Состояние для текущей активной вкладки
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Состояние для выбранного участка/события (для навигации)
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Данные с сервера
  const [sections, setSections] = useState([]);
  const [events, setEvents] = useState([]);
  const [neuralDetections, setNeuralDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных с бэкенда
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Загружаем данные из API сервиса
      const [sectionsData, eventsData, detectionsData] = await Promise.all([
        fetchSections(),
        fetchEvents(),
        fetchDetections()
      ]);
      
      setSections(sectionsData);
      setEvents(eventsData);
      setNeuralDetections(detectionsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функции для навигации
  const openSection = (section) => {
    setSelectedSection(section);
    setActiveTab('sectionDetail');
  };
  
  const openEvent = (event) => {
    setSelectedEvent(event);
    setActiveTab('eventDetail');
  };

  // Рендер активной вкладки
  const renderActiveTab = () => {
    const props = {
      sections,
      events,
      neuralDetections,
      loading,
      openSection,
      openEvent,
      selectedSection,
      selectedEvent,
      setActiveTab
    };
    
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'sections':
        return <SectionsList {...props} />;
      case 'sectionDetail':
        return <SectionDetail {...props} />;
      case 'history':
        return <EventHistory {...props} />;
      case 'objects':
        return <ObjectsList {...props} />;
      case 'eventDetail':
        return <EventDetail {...props} setActiveTab={setActiveTab} />;
      case 'evidence':
        return <EvidenceViewer {...props} />;
      case 'neural':
        return <NeuralResults {...props} />;
      case 'upload':
        return <ImageUpload />;
      default:
        return <Dashboard {...props} />;
    }
  };

  // Подсчет статистики для отображения в меню
  const criticalCount = sections.filter(s => s.status === 'critical').length;
  const newEventsCount = events.filter(e => e.status === 'critical' || e.status === 'warning').length;
  const newDetectionsCount = neuralDetections.filter(d => d.severity === 'critical' || d.severity === 'warning').length;

  const getPageTitle = (tab) => {
    const titles = {
      dashboard: 'Оперативный дашборд',
      sections: 'Участки мониторинга',
      neural: 'Результаты нейросети',
      history: 'История событий',
      objects: 'Найденные объекты',
      eventDetail: 'Детали события',
      evidence: 'Доказательства',
      upload: 'Загрузка изображений'
    };
    return titles[tab] || 'Rail AI Monitoring';
  };

  return (
    <div className="app">
      {/* Боковое меню */}
      <aside className="sidebar">
        <div className="logo">
          <h2>🚆 Rail AI</h2>
          <span className="subtitle">Диспетчерская</span>
        </div>
        
        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="nav-icon">📊</span> Дашборд
          </button>
          <button className={`nav-item ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>
            <span className="nav-icon">🗺️</span> Участки
          </button>
          <button className={`nav-item ${activeTab === 'neural' ? 'active' : ''}`} onClick={() => setActiveTab('neural')}>
            <span className="nav-icon">🧠</span> Нейросеть
            {newDetectionsCount > 0 && <span className="badge-new">{newDetectionsCount}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <span className="nav-icon">📜</span> История
            {newEventsCount > 0 && <span className="badge-new">{newEventsCount}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'objects' ? 'active' : ''}`} onClick={() => setActiveTab('objects')}>
            <span className="nav-icon">📦</span> Объекты
          </button>
          <button className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
            <span className="nav-icon">📤</span> Загрузка
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👩‍💼</span>
            <div>
              <div className="user-name">Татьяна К.</div>
              <div className="user-role">Старший диспетчер</div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Основной контент */}
      <main className="main-content">
        <div className="top-bar">
          <div className="page-title">
            <h1>{getPageTitle(activeTab)}</h1>
            <div className="current-time">{new Date().toLocaleString('ru-RU')}</div>
          </div>
          <div className="status-indicators">
            <div className="status-badge critical">Критических: {criticalCount}</div>
            <div className="status-badge warning">Требуют внимания: {newEventsCount}</div>
          </div>
        </div>
        
        <div className="content-area">
          {loading ? (
            <div className="loading">Загрузка данных...</div>
          ) : (
            renderActiveTab()
          )}
        </div>
      </main>
    </div>
  );
}

export default App;