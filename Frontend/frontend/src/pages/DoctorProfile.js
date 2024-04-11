import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DoctorProfile.css'; // Import CSS file for styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


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
            <div className="profile">
                <div className="profile-header">
                    <img src={`${doctorData.doctor_photo}`} alt={`${doctorData.first_name} ${doctorData.last_name}`} className="doctor-photo" />
                    <div className="profile-info">
                        <h1>{`${doctorData.last_name} ${doctorData.first_name}${doctorData.middle_name ? ' ' + doctorData.middle_name : ''}`}</h1>
                        <h6>{doctorData.qualification}</h6>
                        <h6 className="work-experience">Стаж работы: {doctorData.work_experience}</h6>
                        <h6 className="docot-rating">Рейтинг: 4.5 {doctorData.rating} <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /></h6>
                    </div>
                </div>
                <div className="doctor-card">
                    <h2>Квалификация и образование</h2>
                    <h6>Квалификация</h6>
                    <p>{doctorData.doctor_card.qualification}</p>
                    <h6>Образование</h6>
                    <p>{doctorData.doctor_card.education}</p>
                    {doctorData.doctor_card.advanced_training && (
                        <>
                            <h6>Повышение квалификации</h6>
                            <p>{doctorData.doctor_card.advanced_training}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
