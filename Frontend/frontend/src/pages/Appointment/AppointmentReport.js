import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем FontAwesomeIcon
import { faUser, faUserMd, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons'; // Импортируем нужные иконки
import './AppointmentReport.css';
import { jwtDecode } from "jwt-decode";

function AppointmentReport() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);
    const [isPatient, setIsPatient] = useState(false);
    const [updatedText, setUpdatedText] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            setIsPatient(decodedToken.is_patient);

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/users/report/${id}/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('Patient does not have access rights to the page');
                    } else if (response.status === 404) {
                        throw new Error('Report does not exist');
                    } else {
                        throw new Error('Failed to fetch report');
                    }
                }

                const data = await response.json();
                setReport(data);
                setUpdatedText(data.text);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchReport();
    }, [id]);

    const sendReport = async (updatedData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/report/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to send report');
            }

            console.log('Report sent successfully');
            navigate('/meet');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const modifiedData = {
            ...report,
            text: updatedText,
        };
        await sendReport(modifiedData);
    };

    const handleTextChange = (event) => {
        setUpdatedText(event.target.value);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!report) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="report-container">
            <h1 className="report-title">Отчет</h1>
            <div className="report-content">
                <div className="info">
                    <span className="info-block">
                        <p><FontAwesomeIcon icon={faUser} style={{ color: '#068466' }}/> <strong>Пациент:</strong> {report.appointment.patient}</p>
                        <p><FontAwesomeIcon icon={faUserMd} style={{ color: '#068466' }}/> <strong>Доктор:</strong> {report.appointment.doctor}</p>
                    </span>
                    <span className="info-block">
                        <span className="date-time">
                            <p><FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#068466' }} /> <strong>Дата:</strong> {report.appointment.date} </p>
                            <p><FontAwesomeIcon icon={faClock} style={{ color: '#068466' }} /> <strong>Время:</strong> {report.appointment.time}</p>
                        </span>
                    </span>
                </div>

                <div className="conclusion">
                    <p className="conclusion" id="text"><strong>Заключение</strong></p>
                    {!isPatient ? (
                        <form onSubmit={handleFormSubmit} className="update-form">
                            <textarea
                                value={updatedText}
                                onChange={handleTextChange}
                                className="editable-text"
                            />
                            <button type="submit">
                                {report.status ? 'Обновить отчёт' : 'Отправить отчёт'}
                            </button>                        </form>
                    ) : (
                        <p className="text">{report.text}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppointmentReport;
