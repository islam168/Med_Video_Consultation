import React from "react";
import "./ConfirmationPopup.css"; // Создайте CSS файл для стилей модального окна подтверждения

const ConfirmationPopup = ({ message, confirmAction, cancelAction }) => {
    return (
        <div className="confirmation-popup">
            <div className="confirmation-popup-inner">
                <p>{message}</p>
                <div className="confirmation-popup-buttons">
                    <button className="confirmation-popup-cancel" onClick={confirmAction}>Подтвердить</button>
                    <button className="confirmation-popup-confirm" onClick={cancelAction}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
