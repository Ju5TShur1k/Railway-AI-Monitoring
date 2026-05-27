// frontend/src/components/ImageUpload.js
import React, { useState } from 'react';
import { uploadImage } from '../services/api';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage('');
      setAnalysisResult(null);
    } else {
      setMessage('Пожалуйста, выберите изображение');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Выберите файл для загрузки');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await uploadImage(selectedFile);
      
      setMessage('✅ Файл успешно загружен и проанализирован!');
      
      if (response.analysis) {
        setAnalysisResult(response.analysis);
      }
      
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setMessage('');
        setAnalysisResult(null);
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('❌ Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const getObjectTypeLabel = (type) => {
    const types = {
      person: '👤 Человек',
      tree: '🌳 Дерево',
      obstacle: '📦 Посторонний предмет',
      vehicle: '🚗 Транспорт'
    };
    return types[type] || '❓ Неизвестный объект';
  };

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-label">Загрузка изображений</div>
          <div className="kpi-value" style={{ fontSize: '1rem' }}>JPG, PNG, GIF</div>
          <div className="kpi-hint">Максимальный размер: 10MB</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Анализ нейросетью</div>
          <div className="kpi-value" style={{ fontSize: '1rem' }}>YOLOv8</div>
          <div className="kpi-hint">Детекция объектов на путях</div>
        </div>
      </div>
      
      <div className="section-card" style={{ textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          id="file-input" 
          style={{ display: 'none' }} 
        />
        <label htmlFor="file-input" className="btn" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '16px' }}>
          📁 Выбрать изображение
        </label>
        
        {preview && (
          <div style={{ marginTop: '16px' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '300px', borderRadius: '16px' }} />
            <div className="section-subtitle" style={{ marginTop: '8px' }}>{selectedFile?.name}</div>
          </div>
        )}
        
        <button 
          className="btn danger" 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading} 
          style={{ marginTop: '16px' }}
        >
          {uploading ? '⏳ Загрузка и анализ...' : '📤 Загрузить и проанализировать'}
        </button>
        
        {message && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            borderRadius: '12px', 
            background: message.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.includes('✅') ? '#34d399' : '#f87171'
          }}>
            {message}
          </div>
        )}
        
        {analysisResult && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#1a2332', borderRadius: '16px', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '12px' }}>🔍 Результат анализа нейросети:</h4>
            <div style={{ marginBottom: '8px' }}>
              <span className="small-note">Обнаружено:</span>
              <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{getObjectTypeLabel(analysisResult.objectType)}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span className="small-note">Уверенность:</span>
              <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#10b981' }}>{Math.round(analysisResult.confidence * 100)}%</span>
            </div>
            <div>
              <span className={`badge ${analysisResult.severity}`}>
                {analysisResult.severity === 'critical' ? 'Критично' : 'Требует внимания'}
              </span>
            </div>
            <div className="subtle" style={{ marginTop: '8px' }}>{analysisResult.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;