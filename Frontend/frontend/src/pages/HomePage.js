import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePage.css'; // Import your custom CSS file

function HomePage() {
    const [problems, setProblems] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setProblems(data.Problems);
                setQualifications(data.Qualification);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const slickSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="home-page">
            <h1>Онлайн консультация</h1>

            <h2>Проблемы</h2>
            <Slider {...slickSettings} className="home-slider">
                {problems.map((problem) => (
                    <div key={problem.slug} className="home-card">
                        <img src={`http://127.0.0.1:8000${problem.image}`} alt={problem.name} className="home-photo" />
                        <p>{problem.name}</p>
                        <button onClick={() => (window.location.href = `/doctors/?qualification=${problem.slug}`)}>Learn More</button>
                    </div>
                ))}
            </Slider>

            <h2>Квалификация врачей</h2>
            <div className="home-qualifications">
                {qualifications.map((qualification) => (
                    <div key={qualification.slug} className="home-card">
                        <img src={`http://127.0.0.1:8000${qualification.image}`} alt={qualification.name} className="home-photo" />
                        <p>{qualification.name}</p>
                        <button onClick={() => (window.location.href = `/doctors/?qualification=${qualification.slug}`)}>Find Doctors</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
