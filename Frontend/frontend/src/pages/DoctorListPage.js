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

    useEffect(() => {
        const fetchQualificationData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const slug = searchParams.get('qualification');
                const response = await fetch(`http://127.0.0.1:8000/api/users/qualifications/?slug=${slug}`);
                const data = await response.json();
                if (data.length > 0) {
                    setQualificationName(data[0].name);
                }
            } catch (error) {
                console.error('Error fetching qualification:', error);
            }
        };

        const fetchDoctorsData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const slug = searchParams.get('qualification');
                const response = await fetch(`http://127.0.0.1:8000/api/users/doctors/?qualification=${slug}`);
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchQualificationData();
        fetchDoctorsData();
    }, []);

    const handleCardClick = id => {
        window.location.href = `/doctor/${id}/`;
    };

    return (
        <div className="doctor-list-page">
            {/*<h1>Доктора</h1>*/}
            <h1 className="qualification-list-name">{qualificationName}</h1>
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
