import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomePage.css';

function HomePage() {
    const [problems, setProblems] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.Problems)
                setProblems(data.Problems);
                setQualifications(data.Qualification);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    const handleProblemCardClick = (item) => {
        if (item.slug) {
            fetch(`http://127.0.0.1:8000/api/users/doctors/?problem=${item.slug}`)
                .then(response => response.json())
                .then(data => {
                    setDoctors(data);
                    window.location.href = `/doctors/?problem=${item.slug}`;
                })
                .catch(error => console.error('Error fetching doctors with problem:', error));
        } else {
            // Handle other card clicks
        }
    };

    const handleQualificationCardClick = (item) => {
        if (item.slug) {
            fetch(`http://127.0.0.1:8000/api/users/doctors/?qualification=${item.slug}`)
                .then(response => response.json())
                .then(data => {
                    setDoctors(data);
                    window.location.href = `/doctors/?qualification=${item.slug}`;
                })
                .catch(error => console.error('Error fetching doctors with qualification:', error));
        } else {
            // Handle other card clicks
        }
    };

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-page">
            <header className="home-greeting">
                <h1 className="home-big-text">Добро пожаловать в</h1>
                <h1 className="home-big-text-2">MedClose</h1>
                <p className="home-small-text">Медицина без границ</p>
                <p className="home-small-text">Забота о вашем здоровье, где бы вы ни находились!</p>
            </header>
            <div className="home-box">

                <section className="home-section">
                    <h3>Что вас беспокоит?</h3>
                    <Carousel showThumbs={false} showStatus={false}
                              showIndicators={true} showArrows={true} emulateTouch={true} infiniteLoop={true}
                              centerMode={true} centerSlidePercentage={33.33} dynamicHeight={false}>
                        {problems.map((problem) => (
                            <div className="home-problem-card" key={problem.slug} onClick={() => handleProblemCardClick(problem)}>
                                <img src={`http://127.0.0.1:8000${problem.image}`} alt={problem.name}/>
                                <p>{problem.name}</p>
                            </div>
                        ))}
                    </Carousel>
                </section>

                <section className="home-section">
                    <h3>Специалисты</h3>
                    <div className="home-card-container">
                        {qualifications.map((qualification) => (
                            <div className="home-card" key={qualification.slug} onClick={() => handleQualificationCardClick(qualification)}>
                                <img src={`http://127.0.0.1:8000${qualification.image}`} alt={qualification.name}/>
                                <p>{qualification.name}</p>
                                <p className="home-card-description">{qualification.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default HomePage;
