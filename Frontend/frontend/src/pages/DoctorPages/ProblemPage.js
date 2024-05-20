import React, { useState, useEffect } from 'react';
import './ProblemPage.css';

const ProblemCard = ({ problem, onClick }) => {
    return (
        <div className="problem-card" onClick={() => onClick(problem.slug)}>
            <img src={problem.image} alt={problem.name} />
            <h3>{problem.name}</h3>
            <button>Выбрать</button>
        </div>
    );
};

const ProblemPage = () => {
    const [problems, setProblems] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/problems/')
            .then(response => response.json())
            .then(data => {
                console.log('Received data:', data);
                setProblems(data); // Установка данных в состояние компонента
            })            .catch(error => console.error('Error fetching problems:', error));
    }, []);

    const handleCardClick = problem => {
        fetch(`http://127.0.0.1:8000/api/users/doctors/?problem=${problem.slug}`)
            .then(response => response.json())
            .then(data => {
                setDoctors(data); // Update the list of doctors
                window.location.href = `/doctors/?problem=${problem.slug}`;
            })
            .catch(error => console.error('Error fetching doctors with problem:', error));
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    const filteredProblems = problems.filter(problem =>
        problem.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="problem-page">
            <h1>Проблемы</h1>
            <input
                type="text"
                placeholder="Поиск по проблеме"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <div className="problem-list">
                {filteredProblems.map(problem => (
                    <ProblemCard
                        key={problem.slug}
                        problem={problem}
                        onClick={() => handleCardClick(problem)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProblemPage;
