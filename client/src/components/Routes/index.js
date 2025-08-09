import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/home";
import Trending from "../../pages/Trending";
import Profil from "../../pages/Profil";
import Navbar from "../Navbar";

const index = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default index;