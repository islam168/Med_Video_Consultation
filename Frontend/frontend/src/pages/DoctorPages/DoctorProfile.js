import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorProfile.css';
import ConfirmationPopup from './ConfirmationPopup';
import ConfirmationAppointmentPopup from './ConfirmationAppointmentPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeartPulse, faHeart } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';


const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [reviewError, setReviewError] = useState(""); // New state for review error
    const [isFavorite, setIsFavorite] = useState(null); // New state for favorite status
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/doctor/${id}/`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setDoctorData(response.data);
                if (response.data.current_user_evaluation.length > 0) {
                    const { rate, review } = response.data.current_user_evaluation[0];
                    setRating(rate);
                    setReview(review);
                }

                setIsFavorite(response.data.favorite);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };
        fetchDoctorData();
    }, [id]);

    const handleFavoriteClick = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        try {
            let response;
            if (isFavorite) {
                response = await axios.delete(`http://127.0.0.1:8000/api/users/favorite/${userId}/`, {
                    data: { doctor: doctorData.id },
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setIsFavorite(false);
            } else {
                response = await axios.put(`http://127.0.0.1:8000/api/users/favorite/${userId}/`, { doctor: doctorData.id }, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setIsFavorite(true);
            }
            console.log('Favorite status updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const handleRatingChange = (e) => setRating(e.target.value);
    const handleReviewChange = (e) => {
        const newReview = e.target.value;
        if (newReview.length > 500) {
            setReviewError("Длина отзыва не должна превышать 500 символов");
        } else {
            setReviewError("");
        }
        setReview(newReview);
    };

    const submitEvaluation = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        if (!token || !userId) {
            console.error('User token or id not found in local storage');
            return;
        }

        if (review.length > 500) {
            setReviewError("Длина отзыва не должна превышать 500 символов");
            return;
        }

        const evaluationData = {
            doctor: doctorData.id,
            patient: parseInt(userId),
            rate: parseInt(rating),
            review: review
        };

        try {
            let response;
            if (doctorData.current_user_evaluation.length > 0) {
                // Update existing evaluation
                const evaluationId = doctorData.current_user_evaluation[0].id;
                response = await axios.put(`http://127.0.0.1:8000/api/users/evaluation/${evaluationId}/`, {
                    ...evaluationData,
                    id: evaluationId
                }, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            } else {
                // Create new evaluation
                response = await axios.post('http://127.0.0.1:8000/api/users/evaluation/', evaluationData, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            }
            console.log('Evaluation submitted successfully:', response.data);
            setDoctorData(prevData => ({
                ...prevData,
                current_user_evaluation: [response.data]
            }));
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

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
                    Authorization: `${token}`
                }
            });
            console.log('Appointment created successfully:', response.data);
            navigate('/meet');
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };
    const handleConfirmation = (date, time) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setShowConfirmation(true);
    };

    const confirmAppointment = () => {
        createAppointment(doctorData.id, selectedDate, selectedTime);
        setShowConfirmation(false);
    };

    const cancelAppointment = () => {
        setShowConfirmation(false);
    };

    if (!doctorData) {
        return <div className="loading">Loading...</div>;
    }

    const isAnonymous = !localStorage.getItem('token');

    return (
        <div className="doctor-profile">
            <div className="profile">
                <div className="profile-header">
                    <img src={doctorData.doctor_photo} alt={`${doctorData.first_name} ${doctorData.last_name}`} className="doctor-photo" />
                    <div className="profile-info">
                        <h1>{`${doctorData.last_name} ${doctorData.first_name}${doctorData.middle_name ? ' ' + doctorData.middle_name : ''}`}</h1>
                        <h6 className="specialization">Специализация: {doctorData.qualification}</h6>
                        <h6 className="work-experience">Стаж работы: {doctorData.work_experience}</h6>
                        <h6 className="doctor-rating">{doctorData.average_rating !== null ? (
                            <p className="average-rating">
                                Рейтинг: {doctorData.average_rating} <FontAwesomeIcon icon={faHeartPulse} style={{ color: 'red' }} />
                            </p>
                        ) : (
                            <p>Рейтинг: Отсуствует на данный момент</p>
                        )}</h6>
                        {/* Favorite button */}
                        {isAnonymous ? (
                            <p></p>
                        ) : (
                            <button onClick={handleFavoriteClick} className="favorite-button" data-title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
                                <FontAwesomeIcon icon={faHeart} style={{ color: isFavorite ? 'red' : 'gray' }} />
                            </button>
                        )}
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
                <h2 className="reviews">Отзывы</h2>
                <div className="evaluation-section">
                    {isAnonymous ? (
                        <h2>Вы должны войти в систему, чтобы оставить отзыв.</h2>
                    ) : (
                        <>
                            {doctorData.current_user_evaluation === "Patient does not have any appointment with this doctor" ? (
                                <>
                                    <h2>Ваш отзыв</h2>
                                    <p>Вы не можете поставить оценку данному доктору, так как вы не пользовались его услугами ранее</p>
                                </>
                            ) : (
                                <form onSubmit={submitEvaluation}>
                                    <h2>Ваш отзыв</h2>
                                    <label className="rating-label">Оценка:</label>
                                    <div className="rating-options">
                                        {[1, 2, 3, 4, 5].map(option => (
                                            <label key={option} className="rating-option">
                                                <div className="option-container">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value={option}
                                                        checked={parseInt(rating) === option}
                                                        onChange={handleRatingChange}
                                                    />
                                                    <span className="option-icon">
                                                        {option} <FontAwesomeIcon icon={faHeartPulse} style={{ color: 'red' }} />
                                                </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <label>
                                        Отзыв:
                                        <textarea value={review} onChange={handleReviewChange} />
                                    </label>
                                    {reviewError && <p className="review-error-message">{reviewError}</p>}
                                    <button type="submit">Отправить</button>
                                </form>
                            )}
                        </>
                    )}
                </div>

                <div className="all-evaluations">
                    <h2>Отзывы пациентов</h2>
                    {doctorData.evaluations.length === 0 ? (
                        <p>У этого доктора еще нет отзывов.</p>
                    ) : (
                        <ul>
                            {doctorData.evaluations.map(evaluation => (
                                <li key={evaluation.id}>
                                    <p><strong>Пользователь:</strong> {evaluation.patient}</p>
                                    <p><strong>Оценка:</strong> {evaluation.rate} <FontAwesomeIcon icon={faHeartPulse} style={{ color: 'red' }} /></p>
                                    <p><strong>Отзыв:</strong> {evaluation.review ? evaluation.review : "Отзыв отсутствует"}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="schedule">
                <h2>Расписание</h2>
                {doctorData.date_time.length === 0 ? (
                    <p>У доктора нет доступного времени для приемов</p>
                ) : (
                    <div>
                        {Array.isArray(doctorData.date_time) && doctorData.date_time.map(item => (
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

            {/* Other components */}
            {showConfirmation && (
                isAuthenticated ? (
                    <ConfirmationPopup
                        message={`Вы уверены, что хотите записаться к врачу прием на ${selectedDate} в ${selectedTime}?`}
                        confirmAction={confirmAppointment}
                        cancelAction={cancelAppointment}
                    />
                ) : (
                    <ConfirmationAppointmentPopup
                        message={`Пожалуйста, авторизуйтесь, чтобы записаться к врачу на прием`}
                        cancelAction={cancelAppointment}
                    />
                )
            )}
        </div>
    );
};

export default DoctorProfile;