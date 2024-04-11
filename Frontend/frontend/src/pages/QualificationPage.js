import React, { useState, useEffect } from 'react';
import './QualificationPage.css';

const QualificationCard = ({ qualification, onClick }) => {
    return (
        <div className="qualification-card" onClick={() => onClick(qualification.slug)}>
            <img src={qualification.image} alt={qualification.name} />
            <h3>{qualification.name}</h3>
            <button>Выбрать</button>
        </div>
    );
};

const QualificationPage = () => {
    const [qualifications, setQualifications] = useState([]);
    const [doctors, setDoctors] = useState([]); // Определение состояния для списка докторов

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/qualifications/')
            .then(response => response.json())
            .then(data => setQualifications(data))
            .catch(error => console.error('Error fetching qualifications:', error));
    }, []);

    const handleCardClick = qualification => {
        fetch(`http://127.0.0.1:8000/api/users/doctors/?qualification=${qualification.slug}`)
            .then(response => response.json())
            .then(data => {
                setDoctors(data); // Update the list of doctors
                window.location.href = `/doctors/?qualification=${qualification.slug}&qualificationName=${qualification.name}`;
            })
            .catch(error => console.error('Error fetching doctors with qualification:', error));
    };



    return (
        <div className="qualification-page">
            <h1>Специалисты</h1>
            <div className="qualification-list">
                {qualifications.map(qualification => (
                    <QualificationCard
                        key={qualification.slug}
                        qualification={qualification}
                        onClick={() => handleCardClick(qualification)}
                    />
                ))}
            </div>
        </div>
    );
};

export default QualificationPage;
