import React from "react";
import "./Popup.css"; // Create a CSS file for popup styles

const Popup = ({ message, confirmAction, cancelAction }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <p>{message}</p>
                <div className="popup-buttons">
                    <button className="popup-confirm" onClick={confirmAction}>Выйти</button>
                    <button className="popup-cancel" onClick={cancelAction}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
