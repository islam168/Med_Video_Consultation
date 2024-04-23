import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/LoginRegistration/RegistrationForm";
import Login from "./pages/LoginRegistration/Login";
import CreateDoctorInfoCard from "./pages/DoctorPages/CreateDoctorInfoCard";
import UpdateDoctorForm from "./pages/DoctorPages/UpdateDoctorForm";
import DoctorProfile from "./pages/DoctorPages/DoctorProfile";
import QualificationPage from "./pages/DoctorPages/QualificationPage";
import DoctorListPage from "./pages/DoctorPages/DoctorListPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import NotFoundPage from "./components/Error/NotFoundPage";
import Meet from "./pages/VideoCall/Meet";

function App() {
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        const onLocationChange = () => {
            setPathname(window.location.pathname);
        };

        onLocationChange();
        window.addEventListener('popstate', onLocationChange);

        return () => {
            window.removeEventListener('popstate', onLocationChange);
        };
    }, []);

    return (
        <BrowserRouter>
            <div className="app-container">
                {pathname !== "/meet" && <Navbar />}
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/registration" element={<Register />} />
                        <Route path="/create_doctor_info_card" element={<CreateDoctorInfoCard />} />
                        <Route path="/update_doctor_card/:id" element={<UpdateDoctorForm />} />
                        <Route path="/doctor/:id" element={<DoctorProfile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/qualifications" element={<QualificationPage />} />
                        <Route path="/doctors" element={<DoctorListPage />} />
                        <Route path="/meet" element={<Meet />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                {pathname !== "/meet" && <Footer />}
            </div>
        </BrowserRouter>
    );
}

export default App;
