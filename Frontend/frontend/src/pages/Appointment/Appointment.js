import { useState, useEffect } from "react";
import './Appointment.css';

function Appointment({ handleJoinMeeting }) {
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function fetchAppointments() {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/appointment_list/", {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data = await response.json();
                setUserName(data.UserName); // Set the UserName

                // Проверяем, если записи на прием есть
                if (data.FutureAppointments) {
                    const formattedFutureAppointments = data.FutureAppointments.map(appointment => ({
                        ...appointment,
                        entity: appointment.doctor ? 'doctor' : 'patient' // Определяем тип записи
                    }));
                    setFutureAppointments(formattedFutureAppointments);
                }

                if (data.PastAppointments) {
                    const formattedPastAppointments = data.PastAppointments.map(appointment => ({
                        ...appointment,
                        entity: appointment.doctor ? 'doctor' : 'patient' // Определяем тип записи
                    }));
                    setPastAppointments(formattedPastAppointments);
                }

            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        }

        fetchAppointments();
    }, []);

    return (
        <div className="appointment-container">
            <h2 className="appointment-title">Предстоящие приемы</h2>
            <ul className="appointment-list">
                {futureAppointments.map(appointment => (
                    <li key={appointment.id} className="appointment-item">
                        <div className="appointment-info">{appointment.entity === 'doctor' ? 'Доктор' : 'Пациент'}: {appointment.entity === 'doctor' ? appointment.doctor : appointment.patient}</div>
                        <div className="appointment-info">Дата: {appointment.date}</div>
                        <div className="appointment-info">Время: {appointment.time}</div>
                        <button
                            className="appointment-button"
                            onClick={() => {
                                handleJoinMeeting(appointment.url, userName); // Pass userName instead of data.UserName
                            }}
                        >
                            Войти
                        </button>
                    </li>
                ))}
            </ul>
            <h2 className="appointment-title">Прошедшие приемы</h2>
            <ul className="appointment-list">
                {pastAppointments.map(appointment => (
                    <li key={appointment.id} className="appointment-item">
                        <div className="appointment-info">{appointment.entity === 'doctor' ? 'Доктор' : 'Пациент'}: {appointment.entity === 'doctor' ? appointment.doctor : appointment.patient}</div>
                        <div className="appointment-info">Дата: {appointment.date}</div>
                        <div className="appointment-info">Время: {appointment.time}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Appointment;
