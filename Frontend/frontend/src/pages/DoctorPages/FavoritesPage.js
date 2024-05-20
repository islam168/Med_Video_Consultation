import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Изменение импорта
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import "./FavoritesPage.css";

const DoctorCard = ({ doctor, onClick }) => {
    const baseURL = 'http://127.0.0.1:8000';
    const doctorPhotoURL = `${baseURL}${doctor.doctor_photo}`;

    return (
        <div className="favorites-card" onClick={() => onClick(doctor.id)}>
            <div className="favorites-photo-container">
                <img src={doctorPhotoURL} alt={`${doctor.last_name} ${doctor.first_name}`} className="favorites-photo" />
            </div>
            <div className="favorites-info">
                <h3>{`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}</h3>
                <p className="favorites-work-experience">Стаж работы: {doctor.work_experience}</p>
                {doctor.average_rating !== null ? (
                    <p className="average-rating">
                        Рейтинг: {doctor.average_rating} <FontAwesomeIcon icon={faHeartPulse} className="fa-heart-pulse" />
                    </p>
                ) : (
                    <p className="no-rating">У данного доктора нет рейтинга</p>
                )}
            </div>
        </div>
    );
};

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.user_id;
                if (userId) {
                    try {
                        const response = await axios.get(`http://127.0.0.1:8000/api/users/favorite/${userId}/`, {
                            headers: {
                                Authorization: `${token}`,
                            },
                        });
                        setFavorites(response.data.favorites);
                        console.log(response.data.favorites)
                    } catch (error) {
                        console.error('Error fetching favorites:', error);
                    }
                }
            }
        };

        fetchFavorites();
    }, []);

    const handleCardClick = id => {
        navigate(`/doctor/${id}`); // Используем replace для навигации
    };

    return (
        <div className="favorites-page">
            <h1 className="favorites-title">Избранное</h1>
            <div className="favorites-container">
                {favorites.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onClick={handleCardClick} />
                ))}
            </div>
        </div>
    );
};

export default FavoritePage;