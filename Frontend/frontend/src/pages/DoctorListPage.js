import React, { useState, useEffect } from 'react';
import './DoctorListPage.css';

const DoctorListCard = ({ doctor, onClick }) => {
    return (
        <div className="doctor-list-card" onClick={() => onClick(doctor.id)}>
            <div className="doctor-photo-container">
                <img className="doctor-photo-list" src={doctor.doctor_photo} alt={`${doctor.last_name} ${doctor.first_name}`} />
            </div>
            <div className="doctor-list-info">
                <h3>{`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}</h3>
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
                const problemSlug = searchParams.get('problem'); // Get problem slug from URL
                let apiUrl = 'http://127.0.0.1:8000/api/users/doctors/?';

                if (qualificationSlug) {
                    apiUrl += `qualification=${qualificationSlug}`;
                    const qualificationName = searchParams.get('qualificationName'); // Extract qualification name from URL
                    setQualificationName(qualificationName); // Set the qualification name
                } else if (problemSlug) {
                    apiUrl += `problem=${problemSlug}`;
                    const problemName = searchParams.get('problemName'); // Extract problem name from URL
                    setProblemName(problemName); // Set the problem name
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
