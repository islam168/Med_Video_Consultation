import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import './DoctorListPage.css';

const DoctorListCard = ({ doctor, onClick }) => {
    return (
        <div className="doctor-list-card" onClick={() => onClick(doctor.id)}>
            <div className="doctor-photo-container">
                <img className="doctor-photo-list" src={doctor.doctor_photo} alt={`${doctor.last_name} ${doctor.first_name}`} />
            </div>
            <div className="doctor-list-info">
                <h3>{`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}</h3>
                {doctor.average_rating !== null ? (
                    <p className="average-rating">
                        Рейтинг: {doctor.average_rating} <FontAwesomeIcon icon={faHeartPulse} style={{ color: 'red' }} />
                    </p>
                ) : (
                    <p className="no-rating">У данного доктора нет рейтинга</p>
                )}
                <p className="work-experience">Стаж: {doctor.work_experience}</p>
            </div>
        </div>
    );
};

const DoctorListPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorsData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const qualificationSlug = searchParams.get('qualification');
                const problemSlug = searchParams.get('problem');
                let apiUrl = 'http://127.0.0.1:8000/api/users/doctors/?';

                if (qualificationSlug) {
                    apiUrl += `qualification=${qualificationSlug}`;
                } else if (problemSlug) {
                    apiUrl += `problem=${problemSlug}`;
                }

                const response = await fetch(apiUrl);
                const data = await response.json();
                setDoctors(data);
                setIsLoading(false); // Data fetching complete, set isLoading to false
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setIsLoading(false); // Set isLoading to false in case of error
            }
        };

        fetchDoctorsData();
    }, []);

    const handleCardClick = id => {
        window.location.href = `/doctor/${id}/`;
    };

    return (
        <div className="doctor-list-page">
            {isLoading ? (
                <h1>Загрузка...</h1>
            ) : doctors.length > 0 ? (
                <>
                    <h1 className="qualification-list-name">{doctors[0].qualification}</h1>
                    <div className="doctor-list">
                        {doctors.map(doctor => (
                            <DoctorListCard
                                key={doctor.id}
                                doctor={doctor}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <h1>Нет доступных докторов на данный момент</h1>
            )}
        </div>
    );
};

export default DoctorListPage;
