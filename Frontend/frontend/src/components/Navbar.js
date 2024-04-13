import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../media_photo/logo-2.png"; // Replace with your logo image
import "./Navbar.css"; // Create a CSS file for navbar styles
import Logout from './Logout'; // Import the Logout function

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
            await Logout(navigate); // Pass navigate function to navigate after logout
        } catch (error) {
            console.error('Error logging out:', error);
            // Handle error if needed
        }
    };

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
                {/* Check if user is authenticated and show appropriate links */}
                {localStorage.getItem('token') ? (
                    <button onClick={handleLogout}>Выход</button>
                ) : (
                    <>
                        <Link to="/login">Вход</Link>
                        <Link to="/registration">Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
