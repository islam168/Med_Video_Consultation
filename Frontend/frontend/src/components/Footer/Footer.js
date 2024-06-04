import React from "react";
import "./Footer.css";
import {Link} from "react-router-dom"; // Make sure to import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/">Главная страница</a>
                        {localStorage.getItem('token') && <Link to="/meet">Расписание приемов</Link>}
                        {localStorage.getItem('token') && <Link to="/favorites">Избранное</Link>}
                    </div>
                    <div className="footer-links">
                        <a href="/qualifications">Подобрать доктора по специализации</a>
                        <a href="/problems">Подобрать доктора по проблеме со здоровьем</a>
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
