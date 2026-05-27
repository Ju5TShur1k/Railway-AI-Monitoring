import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = () => 
    {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => 
        {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) 
        {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setMessage('');
        }
        else 
        {
            setMessage('Пожалуйста, выберите изображение');
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const handleUpload = async () =>
    {
        if (!selectedFile)
        {
            setMessage('Выберите файл');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('objectType', 'person');
        setUploading(true);
        setMessage('');

        try 
        {
            const response = await axios.post(
                'http://172.20.10.6:9898/api/v1/media/upload/image',
                formData
                
            );
            setMessage('✅ Файл успешно загружен на сервер!');
            console.log('Ответ сервера:', response.data);

            setTimeout(() => 
            {
                setSelectedFile(null);  
                setPreview(null);       
                setMessage('');         
            }, 2000);
        } catch (error) 
        {
            console.error('Ошибка при загрузке:', error);
            if (error.response) 
            {
                setMessage(`❌ Ошибка сервера: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) 
            {
                setMessage('❌ Сервер не отвечает. Убедитесь, что Spring Boot запущен на порту 8080');
            } else 
            {
                setMessage(`❌ Ошибка: ${error.message}`);
            }
        } finally 
        {
            setUploading(false);
        }
    };

    const handleDragOver = (event) => 
    {
        event.preventDefault(); 
    };

    const handleDrop = (event) =>
    {
        event.preventDefault();

        const file = event.dataTransfer.files[0];

        if(file && file.type.startsWith('image/')) 
        {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setMessage('');
        } else
        {
            setMessage('Пожалуйста, перетащите изображение');
        }
    };

    return( 
        <div className="upload-container">
            <h2>Загрузка изображений для ИИ</h2>

            <div
                className='upload-area'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >

            <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                id='file-input'
                className='file-input'
            />

            <label htmlFor='file-input' className='file-label'>
                📁 Выбрать изображение
            </label>

            {preview && (
                <div className='preview-container'>
                    <img
                        src={preview}
                        alt='Предпросмотр'
                        className='preview-image'
                    />
                    <p>Выбран файл: {selectedFile?.name}</p>
                    <p>Размер: {(selectedFile?.size / 1024).toFixed(2)} KB</p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className='upload-button'
            >
                {uploading ? '⏳ Загрузка...' : '📤 Загрузить на сервер'}
            </button>

            {message && (
                <p className={uploading ? 'uploading-message' : 'message'}>
                    {message}
                </p>
            )}

            <div className='hint'>
                Вы можете перетащить файл мышкой в эту область
            </div>
        </div>
    </div>
    );
};

export default ImageUpload;


