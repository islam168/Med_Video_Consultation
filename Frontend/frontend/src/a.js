import {Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/LoginRegistration/RegistrationForm";
import UpdateDoctorCardForm from "./pages/DoctorPages/UpdateDoctorCardForm";
import DoctorProfile from "./pages/DoctorPages/DoctorProfile";
import AppointmentReport from "./pages/Appointment/AppointmentReport";
import Login from "./pages/LoginRegistration/Login";
import QualificationPage from "./pages/DoctorPages/QualificationPage";
import ProblemPage from "./pages/DoctorPages/ProblemPage";
import DoctorListPage from "./pages/DoctorPages/DoctorListPage";
import FavoritesPage from "./pages/DoctorPages/FavoritesPage";
import PasswordResetCodeForm from "./pages/LoginRegistration/PasswordResetCodeForm";
import PasswordResetForm from "./pages/LoginRegistration/PasswordResetForm";
import Meet from "./pages/Appointment/Meet";
import NotFoundPage from "./components/Error/NotFoundPage";
import React from "react";

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