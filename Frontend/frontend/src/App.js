import "./App.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/RegistrationForm";
import Login from "./pages/Login";
import CreateDoctorInfoCard from "./pages/CreateDoctorInfoCard";
import UpdateDoctorForm from "./pages/UpdateDoctorForm";
import DoctorProfile from "./pages/DoctorProfile";
import QualificationPage from "./pages/QualificationPage";
import DoctorListPage from "./pages/DoctorListPage";
import HomePage from "./pages/HomePage";


function App() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="/registration/" element={<Register />} />
              <Route path="/create_doctor_info_card/" element={<CreateDoctorInfoCard />} />
              <Route path="/update_doctor_card/:id/" element={<UpdateDoctorForm />} />
              <Route path="/doctor/:id/" element={<DoctorProfile/>} />
              <Route path="/login/" element={<Login />} />
              <Route path="/qualifications/" element={<QualificationPage />} />
              <Route path="/doctors/" element={<DoctorListPage />} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;
