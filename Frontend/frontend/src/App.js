// import logo from './logo.svg';
import "./App.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/RegistrationForm";
import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Goals from "./pages/Goals";


function App() {
    return (
        <BrowserRouter>
            <Routes>
            {/*  <Route path="/home" element={<Home />} />*/}
              <Route path="/registration/" element={<Register />} />
            {/*  <Route path="/goals" element={<Goals />} />*/}
            {/*  <Route path="/successful_registration" element={<SuccessfulRegistration />} />*/}
              <Route path="/login/" element={<Login />} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;
