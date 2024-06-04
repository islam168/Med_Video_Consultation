import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PasswordResetForm.css';

const PasswordResetForm = () => {
    const [code, setCode] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password1 !== password2) {
            setErrorMessage('Пароли не совпадают');
            return;
        }

        const data = {
            code: code,
            password_1: password1,
            password_2: password2,
        };

        axios
            .post('http://127.0.0.1:8000/api/users/password_reset/', data)
            .then((response) => {
                console.log(response.data);
                setCode('');
                setPassword1('');
                setPassword2('');
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage(error.response.data || 'Произошла ошибка. Попробуйте снова');
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-background">
            <div className="form-container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit} className="transparent-bg">
                            <div className="title-wrapper">
                                <h2 className="welcome-text">Сброс пароля</h2>
                            </div>
                            <div className="form-group left-align-label">
                                <label htmlFor="code">Код сброса</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group password-field left-align-label">
                                <label htmlFor="password1">Новый пароль</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        id="password1"
                                        value={password1}
                                        onChange={(e) => setPassword1(e.target.value)}
                                        required
                                    />
                                    <span className="password-toggle" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group password-field left-align-label">
                                <label htmlFor="password2">Подтвердите новый пароль</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        id="password2"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        required
                                    />
                                    <span className="password-toggle" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" className="reset-btn">Сбросить пароль</button>
                            {errorMessage && <div className="password-reset-alert password-reset-alert-danger">{errorMessage}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetForm;
