import React, { useState } from 'react';
import axios from 'axios';
import './PasswordResetCode.css';

const PasswordResetCodeForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/password_reset_code/', { email });
            if (response.status === 201) {
                setSuccess('Reset code has been sent to your email');
                window.location.href = '/password_reset';
            } else {
                setError(response.data || 'Что-то пошло не так');
            }
        } catch (err) {
            setError('Произошла ошибка. Пожалуйста попобуйте позже или введите другой email');
        }
    };

    return (
        <div className="password-reset-container">
            <form onSubmit={handleSubmit} className="password-reset-form">
                <h2 className="password-reset-title">Сброс пароля</h2>
                <div className="password-reset-group">
                    <label htmlFor="email" className="password-reset-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="password-reset-input"
                    />
                </div>
                {error && <div className="password-reset-alert password-reset-alert-danger">{error}</div>}
                {success && <div className="password-reset-alert password-reset-alert-success">{success}</div>}
                <button type="submit" className="password-reset-button">Отправить</button>
            </form>
        </div>
    );
};

export default PasswordResetCodeForm;
