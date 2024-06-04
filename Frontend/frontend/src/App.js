import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Register from "./pages/LoginRegistration/RegistrationForm";
import Login from "./pages/LoginRegistration/Login";
import UpdateDoctorCardForm from "./pages/DoctorPages/UpdateDoctorCardForm";
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
import AppointmentReport from "./pages/Appointment/AppointmentReport";
import PasswordResetCodeForm from "./pages/LoginRegistration/PasswordResetCodeForm";
import PasswordResetForm from "./pages/LoginRegistration/PasswordResetForm";
import {jwtDecode} from "jwt-decode"; // импортируем jwtDecode

// Mock function to get the user role from token
// Проверяем роль пользователя с помощью jwtDecode
const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'anonymous';

    const decodedToken = jwtDecode(token); // декодируем токен
    if (decodedToken.is_patient) return 'patient';
    return 'doctor';
};

function App() {
    const [showNavFooter, setShowNavFooter] = useState(true);
    const userRole = getUserRole();

    const updateNavFooterVisibility = (show) => {
        setShowNavFooter(show);
    };

    const userIsPatient = userRole === 'patient';
    const userIsDoctor = userRole === 'doctor';
    const userIsAnonymous = userRole === 'anonymous';

    console.log('p', userIsPatient)
    console.log('d', userIsDoctor)
    console.log('a', userIsAnonymous)

    return (
        <BrowserRouter>
            <div className="app-container">
                {showNavFooter && <Navbar />}
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/registration" element={<Register />} />
                        <Route path="/update_doctor_card/:id" element={<UpdateDoctorCardForm />} />
                        <Route path="/doctor/:id" element={<DoctorProfile />} />
                        <Route path="/report/:id" element={<AppointmentReport />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/qualifications" element={<QualificationPage />} />
                        <Route path="/problems" element={<ProblemPage />} />
                        <Route path="/doctors" element={<DoctorListPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/password_reset_code" element={<PasswordResetCodeForm />} />
                        <Route path="/password_reset" element={<PasswordResetForm />} />
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
