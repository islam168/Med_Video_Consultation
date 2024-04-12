import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegistrationForm.css'; // Подключение CSS-файла для дополнительных стилей
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Registration = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // If token exists, navigate to success page
            navigate('/');
        }
    }, [navigate]);

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Введите корректный адрес электронной почты');
            return;
        }

        const data = {
            first_name: first_name,
            last_name: last_name,
            middle_name: middle_name,
            email: email,
            birthdate: birthdate,
            password: password,
        };

        axios
            .post('http://127.0.0.1:8000/api/users/registration/', data)
            .then((response) => {
                console.log(response.data);
                setFirstName('');
                setLastName('');
                setMiddleName('');
                setEmail('');
                setBirthdate('');
                setPassword('');
                navigate('/successful_registration');
            })
            .catch((error) => {
                console.error(error);
                if (error.response.data.email) {
                    // Обработка сообщения об ошибке, если адрес электронной почты уже существует
                    setErrorMessage('Пользователь с данной почтой уже существует');
                }
            });

    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="background">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit} className="transparent-bg">
                            <div className="title-wrapper">
                                <h2 className="welcome-text">Добро пожаловать в <span className="goal-getter">MedClose</span></h2>

                            </div>
                            <div className="form-group left-align-label">
                                <label htmlFor="first_name" >
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group left-align-label">
                                <label htmlFor="last_name">
                                    Фамилия
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group left-align-label" >
                                <label htmlFor="middle_name">
                                    Отчетво
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={middle_name}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                />
                            </div>
                            <div className="form-group left-align-label">
                                <label htmlFor="email">
                                    Электронная почта
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group left-align-label">
                                <label htmlFor="birthdate">
                                    Дата рождения:
                                </label>
                                <input
                                    type="date"
                                    id="birthdate"
                                    value={birthdate}
                                    onChange={(event) => setBirthdate(event.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group password-field left-align-label">
                                <label htmlFor="password">
                                    Пароль
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                                </div>
                            </div>
                            <button type="submit" className="registration-btn">
                                Зарегистрироваться
                            </button>
                            {errorMessage && <p className="mt-3 text-danger text-blue">{errorMessage}</p>}
                            <div className="login-btn">
                                Уже есть аккаунт? Тогда войдите
                                <Link to="/login/" className="text-button">Уже есть аккаунт? Тогда войдите</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
