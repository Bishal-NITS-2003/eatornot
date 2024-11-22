"use client";

import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import MainDash from "../components/MainDash";
import './styles.css';



const Dashboard = () => {
 
  const [userDiseases, setUserDiseases] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  
  
  const [capturedImage, setCapturedImage] = useState(null);


  
  return (

    <div className="dashboardContainer">
      {/* Hamburger Menu (Mobile/Tablet only) */}
      <button
        className="hamburgerButton"
        onClick={() => setIsSidebarOpen(true)}
      >
        {/* Hamburger Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="hamburgerIcon"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? 'sidebarOpen' : ''}`}
      >
        <ProfileCard setUserDiseases={setUserDiseases} closeSidebar={() => setIsSidebarOpen(false)}/>
      </div>

      {/* Main Dashboard */}
      <div
        className={`mainDash ${isSidebarOpen ? 'mainDashWithSidebar' : ''}`}
      >
        <MainDash userDiseases={userDiseases}  isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  
  );
};

export default Dashboard;
