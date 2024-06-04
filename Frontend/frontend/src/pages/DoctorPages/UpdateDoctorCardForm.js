import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './UpdateDoctorCard.css';

const UpdateDoctorCardForm = () => {
    const { id } = useParams();
    const [qualification, setQualification] = useState('');
    const [education, setEducation] = useState('');
    const [advancedTraining, setAdvancedTraining] = useState('');
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.user_id;

        const fetchDoctorCardData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/users/doctor_card/${userID}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setQualification(data.qualification);
                    setEducation(data.education);
                    setAdvancedTraining(data.advanced_training);
                    setDoctorId(data.doctor_id);
                } else {
                    console.error('Failed to fetch doctor card');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctorCardData();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const data = {
            doctor_id: doctorId,
            qualification,
            education,
            advanced_training: advancedTraining
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/doctor_card/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Doctor card updated successfully');
                navigate('/');
            } else {
                console.error('Failed to update doctor card');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="doctor-form-container">
            <form onSubmit={handleSubmit} className="doctor-form">
                <label className="form-field">
                    Квалификация:
                    <textarea
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        required
                    />
                </label>
                <label className="form-field">
                    Образование:
                    <textarea
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        required
                    />
                </label>
                <label className="form-field">
                    Повышение квалификации:
                    <textarea
                        value={advancedTraining}
                        onChange={(e) => setAdvancedTraining(e.target.value)}
                    />
                </label>
                <button type="submit" className="submit-button">Обновить</button>
            </form>
        </div>
    );
};

export default UpdateDoctorCardForm;
