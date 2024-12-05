// Home.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Title from './title';
import './styles.css';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [titleOpacity, setTitleOpacity] = useState(1);

  const handleGetStarted = () => {
    // Fade out title
    setTitleOpacity(0);
    // After fade-out, set isStarted to true
    setTimeout(() => {
      setIsStarted(true);
    }, 500); // Match the CSS transition duration
  };

  return (
    <>
      {/* Title with fade-out effect */}
      <div
        style={{
          opacity: titleOpacity,
          transition: 'opacity 0.5s ease-in-out',
          textAlign: 'center'
        }}
      >
        <Title />
      </div>

      {/* Show "Get Started" button only if not started */}
      {!isStarted && (
        <div className="button-container">
          <button className="toggle-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      {isStarted && (
        <div className="button-container">
          <Link to="/input-form">
            <button className="toggle-button">Add/Edit Biometrics</button>
          </Link>
          <Link to="/chatbot">
            <button className="toggle-button">Start Chat</button>
          </Link>
          <Link to="/doctor-locator">
            <button className="toggle-button">Doctor Locator</button>
          </Link>
          <Link to="/past-diagnoses">
            <button className="toggle-button">Past Diagnoses</button>
          </Link>
        </div>
      )}
    </>
  );
}
