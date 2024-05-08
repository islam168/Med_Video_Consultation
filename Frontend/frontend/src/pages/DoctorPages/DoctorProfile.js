import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DoctorProfile.css';
import ConfirmationPopup from './ConfirmationPopup'; // Импортируйте компонент модального окна подтверждения
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";

const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // Добавьте состояние для отображения модального окна
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
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

    const createAppointment = async (doctorId, date, time) => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        if (!token || !userId) {
            console.error('User token or id not found in local storage', userId);
            return;
        }

        const requestData = {
            doctor: doctorId,
            patient: parseInt(userId),
            date: date,
            time: time
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/create_appointment/', requestData, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log('Appointment created successfully:', response.data);
            // Обновление страницы после успешного создания запроса
            window.location.reload();
        } catch (error) {
            console.error('Error creating appointment:', error);
            // Добавьте здесь логику для отображения ошибки пользователю
        }
    };

    const handleConfirmation = (date, time) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setShowConfirmation(true); // Показать модальное окно при нажатии на кнопку
    };
    const confirmAppointment = () => {
        createAppointment(doctorData.Doctor.id, selectedDate, selectedTime);
        setShowConfirmation(false); // Скрыть модальное окно после подтверждения
    };

    const cancelAppointment = () => {
        setShowConfirmation(false); // Скрыть модальное окно при отмене
    };

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
                                        <button key={time} className="time-button" onClick={() => handleConfirmation(item.date, time)}>{time}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showConfirmation && (
                <ConfirmationPopup
                    message={`Вы уверены, что хотите записаться к врачу на ${selectedDate} в ${selectedTime}?`}
                    confirmAction={confirmAppointment}
                    cancelAction={cancelAppointment}
                />
            )}
        </div>
    );
};

export default DoctorProfile;
