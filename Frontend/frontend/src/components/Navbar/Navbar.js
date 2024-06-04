import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../media_photo/logo-2.png";
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';
import Popup from '../../pages/LoginRegistration/Popup'; // Import the Popup component
import Logout from '../../pages/LoginRegistration/Logout';
import profileIcon from '../../media_photo/profile-icon.png'; // Import a profile icon image

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
    const [showProfile, setShowProfile] = useState(false); // State to control profile visibility
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userID, setUserID] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setFirstName(decodedToken.first_name);
            setLastName(decodedToken.last_name);
            setUserID(decodedToken.user_id);
            setUserRole(decodedToken.is_patient ? 'patient' : 'doctor');
        }
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
                    {(!localStorage.getItem('token') || (localStorage.getItem('token') && userRole !== 'doctor')) && (
                        <>
                            <Link to="#" className="dropbtn" onClick={() => setShowDropdown(!showDropdown)}>Подобрать специалиста</Link>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <Link to="/qualifications">По специализации</Link>
                                    <Link to="/problems">По проблеме со здоровьем</Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {localStorage.getItem('token') && userRole !== 'anonymous' && userRole !== 'doctor' && <Link to="/meet">Расписание приемов</Link>}
                {localStorage.getItem('token') && userRole === 'patient' && <Link to="/favorites">Избранное</Link>}
                {localStorage.getItem('token') && userRole === 'doctor' && <Link to={`/`}>Расписание приемов</Link>}
                {localStorage.getItem('token') && userRole === 'doctor' && <Link to={`/update_doctor_card/${userID}`}>Редактирование инф. карты</Link>}
            </div>
            <div className="navbar-buttons">
                {localStorage.getItem('token') ? (
                    <>
                        <div
                            className="profile-container"
                            onMouseEnter={() => setShowProfile(true)}
                            onMouseLeave={() => setShowProfile(false)}
                        >
                            <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
                            {showProfile && (
                                <div className="profile-dropdown">
                                    <p className="user-name">{lastName} {firstName}</p>
                                    <button className="logout-button" onClick={handleLogout}>Выход</button>
                                </div>
                            )}
                        </div>
                    </>
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
