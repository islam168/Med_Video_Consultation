import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Appointment.css';
import ConfirmationPopup from "../../pages/DoctorPages/ConfirmationPopup"; // Импортируем компонент подтверждения

function Appointment({ handleJoinMeeting }) {
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [userName, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [appointmentIdToCancel, setAppointmentIdToCancel] = useState(null);

    const showCancelConfirmation = (appointmentId) => {
        setShowConfirmation(true);
        setAppointmentIdToCancel(appointmentId);
    };

    const hideCancelConfirmation = () => {
        setShowConfirmation(false);
        setAppointmentIdToCancel(null);
    };

    const handleCancelAppointment = async (appointmentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/delete_appointment/${appointmentId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data)
                if (data === 'Cancellation of appointment at least one hour before') {
                    setErrorMessage('Запись на прием можно отменить минимум за час до его начала');
                } else {
                    throw new Error("Failed to cancel appointment");
                }
            } else {
                setFutureAppointments(prevAppointments =>
                    prevAppointments.filter(appointment => appointment.id !== appointmentId)
                );
                setErrorMessage("");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            setErrorMessage("Произошла ошибка при отмене приема");
        } finally {
            hideCancelConfirmation(); // Добавляем вызов функции hideCancelConfirmation после завершения обработки отмены
        }
    }

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
                setUserName(data.UserName);

                if (data.FutureAppointments) {
                    const formattedFutureAppointments = data.FutureAppointments.map(appointment => ({
                        ...appointment,
                        entity: appointment.doctor ? 'doctor' : 'patient'
                    }));
                    setFutureAppointments(formattedFutureAppointments);
                }

                if (data.PastAppointments) {
                    const formattedPastAppointments = data.PastAppointments.map(appointment => ({
                        ...appointment,
                        entity: appointment.doctor ? 'doctor' : 'patient'
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
        <div>
            <div className="appointment-container">
                <h1 className="appointment-title">Приемы</h1>

                {futureAppointments.length > 0 ? (
                    <>
                        <h2 className="appointment-title">Предстоящие приемы</h2>
                        <ul className="appointment-list">
                            {futureAppointments.map(appointment => (
                                <li key={appointment.id} className="appointment-item">
                                    <div className="appointment-info">
                                        {appointment.entity === 'doctor' ? (
                                            <span>Доктор: <Link to={`/doctor/${appointment.doctor_id}`}>
                                            {appointment.doctor}
                                        </Link></span>
                                        ) : (
                                            `Пациент: ${appointment.patient}`
                                        )}
                                    </div>
                                    <div className="appointment-info">Дата: {appointment.date}</div>
                                    <div className="appointment-info">Время: {appointment.time}</div>
                                    <button
                                        className="appointment-button"
                                        onClick={() => handleJoinMeeting(appointment.url, userName)}
                                    >
                                        Войти
                                    </button>
                                    <button
                                        className="appointment-button cancel-button"
                                        onClick={() => showCancelConfirmation(appointment.id)}
                                    >
                                        Отменить
                                    </button>
                                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p></p>
                )}

                {pastAppointments.length > 0 ? (
                    <>
                        <h2 className="appointment-title">Прошедшие приемы</h2>
                        <ul className="appointment-list">
                            {pastAppointments.map(appointment => (
                                <li key={appointment.id} className="appointment-item">
                                    <div className="appointment-info">
                                        {appointment.entity === 'doctor' ? (
                                            <span>Доктор: <Link to={`/doctor/${appointment.doctor_id}`}>
                                            {appointment.doctor}
                                        </Link></span>
                                        ) : (
                                            `Пациент: ${appointment.patient}`
                                        )}
                                    </div>
                                    <div className="appointment-info">Дата: {appointment.date}</div>
                                    <div className="appointment-info">Время: {appointment.time}</div>
                                    {appointment.report !== null && (
                                        <>
                                            {appointment.is_published === false ? (
                                                <Link to={`/report/${appointment.report}`}>
                                                    <button className="appointment-button">Создать отчет</button>
                                                </Link>
                                            ) : (

                                                <Link to={`/report/${appointment.report}`}>
                                                    <button className="appointment-button">Просмотреть отчет</button>
                                                </Link>
                                            )}
                                        </>
                                    )}
                                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p></p>
                )}
            </div>
            {showConfirmation && (
                <ConfirmationPopup
                    message="Вы уверены, что хотите отменить этот прием?"
                    confirmAction={() => handleCancelAppointment(appointmentIdToCancel)}
                    cancelAction={hideCancelConfirmation}
                />
            )}
        </div>
    );

}

export default Appointment;
