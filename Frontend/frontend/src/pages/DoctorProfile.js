import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DoctorProfile.css'; // Import CSS file for styles

const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/doctor/${id}/`);
                setDoctorData(response.data);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };
        fetchDoctorData();
    }, [id]);

    if (!doctorData) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="doctor-profile">
            <h1>{`${doctorData.first_name} ${doctorData.last_name}${doctorData.middle_name ? ' ' + doctorData.middle_name : ''}`}</h1>
            <h6>{doctorData.qualification}</h6>
            <div className="doctor-card">
                <p>Стаж: {doctorData.card.doctor_work_experience}</p>
                <p>Квалификация: {doctorData.card.qualification}</p>
                <p>Образования: {doctorData.card.education}</p>
                {doctorData.card.advanced_training && <p> Повышение квалификации: {doctorData.card.advanced_training}</p>}
                <img src={`http://127.0.0.1:8000/media/${doctorData.card.doctor_photo}`} alt="Doctor" />
            </div>
        </div>
    );
};

export default DoctorProfile;
