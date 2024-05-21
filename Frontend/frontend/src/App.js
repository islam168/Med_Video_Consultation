import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/LoginRegistration/RegistrationForm";
import Login from "./pages/LoginRegistration/Login";
import CreateDoctorInfoCard from "./pages/DoctorPages/CreateDoctorInfoCard";
import UpdateDoctorForm from "./pages/DoctorPages/UpdateDoctorForm";
import DoctorProfile from "./pages/DoctorPages/DoctorProfile";
import QualificationPage from "./pages/DoctorPages/QualificationPage";
import ProblemPage from "./pages/DoctorPages/ProblemPage";
import DoctorListPage from "./pages/DoctorPages/DoctorListPage";
import FavoritesPage from "./pages/DoctorPages/FavoritesPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import NotFoundPage from "./components/Error/NotFoundPage";
import Meet from "./pages/Appointment/Meet";

function App() {
    const [showNavFooter, setShowNavFooter] = useState(true);

    const updateNavFooterVisibility = (show) => {
        setShowNavFooter(show);
    };

    return (
        <BrowserRouter>
            <div className="app-container">
                {showNavFooter && <Navbar />}
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/registration" element={<Register />} />
                        <Route path="/create_doctor_info_card" element={<CreateDoctorInfoCard />} />
                        <Route path="/update_doctor_card/:id" element={<UpdateDoctorForm />} />
                        <Route path="/doctor/:id" element={<DoctorProfile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/qualifications" element={<QualificationPage />} />
                        <Route path="/problems" element={<ProblemPage />} />
                        <Route path="/doctors" element={<DoctorListPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/meet" element={<Meet updateNavFooterVisibility={updateNavFooterVisibility} />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                {showNavFooter && <Footer />}
            </div>
        </BrowserRouter>
    );
}

export default App;
