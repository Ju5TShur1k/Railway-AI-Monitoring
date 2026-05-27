// frontend/src/services/api.js

// ВРЕМЕННЫЕ МОК-ДАННЫЕ (пока нет реального API)
// Позже вы просто замените эти функции на реальные API вызовы

const MOCK_SECTIONS = [
  { id: 1, name: 'Крюково — А-12', code: 'SEC-147', status: 'critical', lastEvent: '09:42', newEvents: 5, objects: 4, description: 'Посторонний объект у пути' },
  { id: 2, name: 'Подольск — Ветка B-3', code: 'SEC-083', status: 'warning', lastEvent: '09:28', newEvents: 3, objects: 6, description: 'Человек в зоне габарита' },
  { id: 3, name: 'Тула — Парк сортировки', code: 'SEC-211', status: 'success', lastEvent: '08:05', newEvents: 0, objects: 1, description: 'Проверка завершена' },
  { id: 4, name: 'Внуково — Горка 2', code: 'SEC-059', status: 'info', lastEvent: '08:49', newEvents: 2, objects: 2, description: 'Обнаружен посторонний предмет' },
];

const MOCK_EVENTS = [
  { id: 9921, title: 'Посторонний объект у пути', time: '15.04.2026 09:42:17', camera: 'Камера 14', zone: 'Зона 2', status: 'critical', sectionId: 1, hasPhoto: true, description: 'Нейросеть обнаружила неподвижный предмет в габарите пути.', objectType: 'obstacle', confidence: 0.94 },
  { id: 9913, title: 'Человек в зоне габарита', time: '15.04.2026 08:56:22', camera: 'Камера 11', zone: 'Путь 3', status: 'warning', sectionId: 2, hasPhoto: true, description: 'Нейросеть зафиксировала человека в запретной зоне.', objectType: 'person', confidence: 0.87 },
  { id: 9908, title: 'Поваленное дерево на рельсах', time: '15.04.2026 07:22:05', camera: 'Камера 8', zone: 'Перегон 5', status: 'critical', sectionId: 4, hasPhoto: true, description: 'Нейросеть обнаружила дерево, перекрывающее путь.', objectType: 'tree', confidence: 0.91 },
];

const MOCK_DETECTIONS = [
  { id: 1, type: 'obstacle', confidence: 0.94, timestamp: '15.04.2026 09:42:17', location: 'Крюково — А-12, Путь №2', severity: 'critical', description: 'Посторонний предмет (сумка) на рельсах' },
  { id: 2, type: 'person', confidence: 0.87, timestamp: '15.04.2026 09:28:05', location: 'Подольск — B-3, перегон 7', severity: 'warning', description: 'Человек в 2 метрах от путей' },
  { id: 3, type: 'tree', confidence: 0.91, timestamp: '15.04.2026 07:22:05', location: 'Внуково — Горка 2, перегон 5', severity: 'critical', description: 'Поваленное дерево на рельсах' },
];

// Функции API (сейчас возвращают мок-данные)
export const fetchSections = async () => {
  // TODO: Заменить на реальный запрос
  // const response = await axios.get('http://localhost:8080/api/sections');
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SECTIONS), 500); // Имитация задержки сети
  });
};

export const fetchEvents = async () => {
  // TODO: Заменить на реальный запрос
  // const response = await axios.get('http://localhost:8080/api/events');
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_EVENTS), 500);
  });
};

export const fetchDetections = async () => {
  // TODO: Заменить на реальный запрос
  // const response = await axios.get('http://localhost:8080/api/detections');
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DETECTIONS), 500);
  });
};

export const uploadImage = async (file) => {
  // TODO: Заменить на реальный запрос
  // const formData = new FormData();
  // formData.append('image', file);
  // const response = await axios.post('http://localhost:8080/api/upload', formData);
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Файл успешно загружен',
        analysis: {
          objectType: 'obstacle',
          confidence: 0.89,
          severity: 'warning',
          description: 'Обнаружен посторонний объект на путях'
        }
      });
    }, 1500);
  });
};