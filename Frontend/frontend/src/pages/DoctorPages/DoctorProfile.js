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
                    <img src={`http://127.0.0.1:8000${doctorData.Doctor.doctor_photo}`} alt={`${doctorData.Doctor.first_name} ${doctorData.Doctor.last_name}`} className="doctor-photo" />
                    <div className="profile-info">
                        <h1>{`${doctorData.Doctor.last_name} ${doctorData.Doctor.first_name}${doctorData.Doctor.middle_name ? ' ' + doctorData.Doctor.middle_name : ''}`}</h1>
                        <h6>Специализация: {doctorData.Doctor.qualification}</h6>
                        <h6 className="work-experience">Стаж работы: {doctorData.Doctor.work_experience}</h6>
                        <h6 className="docot-rating">Рейтинг: 4.5 {doctorData.rating} <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /></h6>
                    </div>
                </div>
                <div className="doctor-card">
                    <h2>Квалификация и образование</h2>
                    <h6>Квалификация</h6>
                    <p>{doctorData.Doctor.doctor_card.qualification}</p>
                    <h6>Образование</h6>
                    <p>{doctorData.Doctor.doctor_card.education}</p>
                    {doctorData.Doctor.doctor_card.advanced_training && (
                        <>
                            <h6>Повышение квалификации</h6>
                            <p>{doctorData.Doctor.doctor_card.advanced_training}</p>
                        </>
                    )}
                </div>
            </div>
            <div className="schedule">
                <h2>Расписание</h2>
                {typeof doctorData.DateTime.date_time === 'string' && doctorData.DateTime.date_time === 'Doctor does not have schedule' ? (
                    <p>У доктора нет доступного времени для приемов</p>
                ) : (
                    <div>
                        {doctorData.DateTime.date_time.map(item => (
                            <div key={item.date}>
                                <h3>{item.date}</h3>
                                <div className="time-buttons">
                                    {item.time.map(time => (
                                        <button key={time} className="time-button">{time}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfile;
