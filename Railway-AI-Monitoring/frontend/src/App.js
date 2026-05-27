// Импорт React (обязательно для JSX)
import React from 'react';
// Импорт нашего компонента загрузки изображений
import ImageUpload from './components/ImageUpload';
// Импорт стилей для корневого компонента
import './App.css';

/**
 * Корневой компонент приложения
 * Именно он отображается первым при запуске React
 */
function App() {
  return (
    <div className="App">
      {/* Рендерим компонент загрузки изображений */}
      <ImageUpload />
    </div>
  );
}

// Экспортируем компонент App для использования в index.js
export default App;