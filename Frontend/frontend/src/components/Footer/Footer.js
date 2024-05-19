/* Update the Footer component */

import React from "react";
import "./Footer.css"; // Make sure to import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/">Главная страница</a>
                        <a href="/meet">Расписание приемов</a>
                    </div>
                    <div className="footer-info">
                        <p>&copy; 2024 MedClose</p>
                        <p>Все права защищены</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
