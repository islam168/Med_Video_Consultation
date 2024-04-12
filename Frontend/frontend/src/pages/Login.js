import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegistrationForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
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

    // Axios interceptor to add token to every request
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
                email,
                password
            });

            // Assuming your server returns a JWT token upon successful login
            const token = response.data.access;

            // Store the token in localStorage
            localStorage.setItem('token', `Bearer ${token}`);

            // Redirect to successful login page
            navigate('/');
        } catch (error) {
            console.error(error);
            setErrorMessage('Неправильные учетные данные. Пожалуйста, попробуйте снова.');
        }
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
                                Войти
                            </button>
                            {errorMessage && <p className="mt-3 text-danger text-blue">{errorMessage}</p>}
                            <div className="login-btn">
                                Нет аккаунта? <Link to="/registration" className="text-button">Зарегистрируйтесь</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
