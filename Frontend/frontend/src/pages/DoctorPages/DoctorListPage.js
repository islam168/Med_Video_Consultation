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
    const [qualificationName, setQualificationName] = useState('');
    const [problemName, setProblemName] = useState('');

    useEffect(() => {
        const fetchDoctorsData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const qualificationSlug = searchParams.get('qualification');
                const problemSlug = searchParams.get('problem');
                let apiUrl = 'http://127.0.0.1:8000/api/users/doctors/?';

                if (qualificationSlug) {
                    apiUrl += `qualification=${qualificationSlug}`;
                    const qualificationName = searchParams.get('qualificationName');
                    setQualificationName(qualificationName);
                } else if (problemSlug) {
                    apiUrl += `problem=${problemSlug}`;
                    const problemName = searchParams.get('problemName');
                    setProblemName(problemName);
                }

                const response = await fetch(apiUrl);
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctorsData();
    }, []);

    const handleCardClick = id => {
        window.location.href = `/doctor/${id}/`;
    };

    return (
        <div className="doctor-list-page">
            <h1 className="qualification-list-name">{qualificationName || problemName}</h1>
            <div className="doctor-list">
                {doctors.map(doctor => (
                    <DoctorListCard
                        key={doctor.id}
                        doctor={doctor}
                        onClick={handleCardClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default DoctorListPage;
