import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateDoctorInfoCard.css';

const DoctorForm = () => {
    const [qualification, setQualification] = useState('');
    const [education, setEducation] = useState('');
    const [advancedTraining, setAdvancedTraining] = useState('');
    const [doctorId, setDoctorId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.user_id) {
                setDoctorId(decodedToken.user_id);
            } else {
                console.error('User ID not found in token:', decodedToken);
            }
        } else {
            console.error('Token not found in localStorage');
        }
    }, []);

    const decodeToken = (token) => {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Invalid token format:', token);
            return null;
        }

        const payloadBase64 = tokenParts[1];
        try {
            const payloadJson = atob(payloadBase64);
            return JSON.parse(payloadJson);
        } catch (error) {
            console.error('Error decoding token payload:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const data = {
            doctor_id: doctorId,
            qualification,
            education
            // advanced_training is optional and will be empty if not provided
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/create_doctor_card/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Handle success
                console.log('Doctor card created successfully');
                navigate('/');
            } else {
                // Handle error
                console.error('Failed to create doctor card');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="doctor-form">
            <form onSubmit={handleSubmit} className="create-doctor-card">
                <label className="doctor-card-field">
                    Квалификаия:
                    <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Образование:
                    <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Повышение квалификации:
                    <input
                        type="text"
                        value={advancedTraining}
                        onChange={(e) => setAdvancedTraining(e.target.value)}
                    />
                </label>
                <button type="submit">Создать</button>
            </form>
        </div>
    );
};

export default DoctorForm;