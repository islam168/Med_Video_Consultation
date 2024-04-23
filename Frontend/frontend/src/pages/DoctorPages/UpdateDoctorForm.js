import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateDoctorInfoCard.css';

const UpdateDoctorForm = () => {
    const { id } = useParams();
    const [qualification, setQualification] = useState('');
    const [education, setEducation] = useState('');
    const [advancedTraining, setAdvancedTraining] = useState('');
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchDoctorCard = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/users/doctor_card/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
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
            fetchDoctorCard();
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
                    'Authorization': token
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
        return <div>Loading...</div>;
    }

    return (
        <div className="doctor-form">
            <form onSubmit={handleSubmit} className="create-doctor-card">
                <label className="doctor-card-field">
                    Квалификация:
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
                <button type="submit">Обновить</button>
            </form>
        </div>
    );
};

export default UpdateDoctorForm;
