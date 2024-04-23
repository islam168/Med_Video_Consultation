import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImage from './404.png';
import './NotFoundPage.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img src={NotFoundImage} alt="404 Not Found" className="not-found-image" />
            <h1>Ошибка</h1>
            <h2>Страница не найдена</h2>
        </div>
    );
};


export default NotFound;
