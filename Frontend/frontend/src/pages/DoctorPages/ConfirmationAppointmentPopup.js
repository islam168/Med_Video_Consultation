import React from "react";
import "./ConfirmationPopup.css";
import { useNavigate } from 'react-router-dom';

const ConfirmationAppointmentPopup = ({ message, loginAction, cancelAction }) => {
    const navigate = useNavigate(); // Хук для навигации

    const handleLogin = () => {
        if (loginAction) {
            loginAction(); // Вызов функции входа
        }
        navigate('/login'); // Переход на страницу входа
    };

    return (
        <div className="confirmation-popup">
            <div className="confirmation-popup-inner">
                <p>{message}</p>
                <div className="confirmation-popup-buttons">
                    <button className="confirmation-popup-confirm" onClick={handleLogin}>Войти</button>
                    <button className="confirmation-popup-cancel" onClick={cancelAction}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationAppointmentPopup;
