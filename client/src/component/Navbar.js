'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const router = useRouter();

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigateTo('/')}>Restaurant</div>
      <div className="navbar-links">
        <button className="nav-link" onClick={() => navigateTo('/home')}>Home</button>
        <button className="nav-link" onClick={() => navigateTo('/menu')}>Menu</button>
        <button className="nav-link" onClick={() => navigateTo('/about')}>About Us</button>
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search dishes..." />
      </div>
      <div className="navbar-profile" onClick={togglePopup}>
        <img src="https://via.placeholder.com/40" alt="Profile" className="profile-avatar" />
        {isPopupVisible && (
          <div className="profile-popup">
            <button className="popup-item" onClick={() => navigateTo('/login')}>Login</button>
            <button className="popup-item">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
