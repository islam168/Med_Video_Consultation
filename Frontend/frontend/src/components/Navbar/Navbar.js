import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../media_photo/logo-2.png";
import "./Navbar.css";
import Popup from '../../pages/LoginRegistration/Popup'; // Import the Popup component
import Logout from '../../pages/LoginRegistration/Logout';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
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

    // Обработчик события выхода
    const handleLogout = () => {
        // Show the logout confirmation popup
        setShowPopup(true);
    };

    // Подтверждение выхода
    const confirmLogout = async () => {
        try {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            if (token) {
                await Logout(token, navigate); // Передаем токен в функцию Logout
                // Close the popup after logout
                setShowPopup(false);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const cancelLogout = () => {
        // Hide the popup
        setShowPopup(false);
    };

    return (
        <nav className={scrolled ? "navbar scrolled" : "navbar"}>
            <div className="navbar-logo">
                <Link to="/"><img src={logo} alt="Logo" /></Link>
                <Link to="/"><span className="logo-name">MedClose</span></Link>
            </div>
            <div className="navbar-links">
                <div
                    className="dropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <Link to="#" className="dropbtn">Подобрать специалиста</Link>
                    {showDropdown && (
                        <div className="dropdown-content">
                            <Link to="/qualifications">По специализации</Link>
                            <Link to="/problems">По проблеме со здоровьем</Link>
                        </div>
                    )}
                </div>
                {localStorage.getItem('token') && <Link to="/meet">Расписание приемов</Link>}
                {localStorage.getItem('token') && <Link to="/favorites">Избранное</Link>}
            </div>
            <div className="navbar-buttons">
                {localStorage.getItem('token') ? (
                    <button className="logout-button" onClick={handleLogout}>Выход</button>
                ) : (
                    <>
                        <Link to="/login">Вход</Link>
                        <Link to="/registration">Регистрация</Link>
                    </>
                )}
            </div>
            {/* Render the popup if showPopup is true */}
            {showPopup && (
                <Popup
                    message="Вы уверены, что хотите выйти?"
                    confirmAction={confirmLogout}
                    cancelAction={cancelLogout}
                />
            )}
        </nav>
    );
};

export default Navbar;
