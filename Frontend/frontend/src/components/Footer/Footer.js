/* Update the Footer component */

import React from "react";
import "./Footer.css"; // Make sure to import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                    </div>
                    <div className="footer-info">
                        <p>&copy; 2024 MedClose. Все права защищены.</p>
                        <p>Address: 123 Main St, City, Country</p>
                        <p>Email: info@example.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
