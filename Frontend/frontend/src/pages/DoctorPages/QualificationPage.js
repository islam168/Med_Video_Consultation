import React, { useState, useEffect } from 'react';
import './QualificationPage.css';

const QualificationCard = ({ qualification, onClick }) => {
    return (
        <div className="qualification-card" onClick={() => onClick(qualification.slug)}>
            <img src={qualification.image} alt={qualification.name} />
            <h3>{qualification.name}</h3>
            <p>{qualification.description}</p>
            <button>Выбрать</button>
        </div>
    );
};

const QualificationPage = () => {
    const [qualifications, setQualifications] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
                setDoctors(data);
                window.location.href = `/doctors/?qualification=${qualification.slug}`;
            })
            .catch(error => console.error('Error fetching doctors with qualification:', error));
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    const filteredQualifications = qualifications.filter(qualification =>
        qualification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qualification.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="qualification-page">
            <h1>Специалисты</h1>
            <input
                type="text"
                placeholder="Поиск по специализации"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <div className="qualification-list">
                {filteredQualifications.map(qualification => (
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
