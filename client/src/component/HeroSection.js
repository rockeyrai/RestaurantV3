import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      {/* <video autoPlay muted loop className="hero-video">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <img src='testjpg.jpg' />
      <div className="hero-content">
        <h1>Welcome to Our Restaurant</h1>
        <p>Experience the best flavors in town!</p>
        <button className="cta-button">Explore Menu</button>
      </div>
    </section>
  );
}

export default HeroSection;