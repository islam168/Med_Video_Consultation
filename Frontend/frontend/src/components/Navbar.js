import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../media_photo/logo-2.png"; // Replace with your logo image
import "./Navbar.css"; // Create a CSS file for navbar styles

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    return (
        <nav className={scrolled ? "navbar scrolled" : "navbar"}>
            <div className="navbar-logo">
                <Link to="/"><img src={logo} alt="Logo" /></Link>
                <Link to="/"><span className="logo-name">MedClose</span></Link>
            </div>
            <div className="navbar-links">
                <Link to="/qualifications">Подобрать специалиста</Link>
            </div>
            <div className="navbar-buttons">
                <Link to="/login">Вход</Link>
                <Link to="/registration">Регистрация</Link>
                {/* Add condition for logout button */}
            </div>
        </nav>
    );
};

export default Navbar;