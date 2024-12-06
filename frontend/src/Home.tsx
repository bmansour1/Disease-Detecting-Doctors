// Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use navigate hook
import Title from './title';
import './styles.css';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const navigate = useNavigate(); // Initialize navigate

  const handleGetStarted = () => {
    setTitleOpacity(0);
    setTimeout(() => {
      setIsStarted(true);
      navigate('/selection'); // Redirect to selection page
    }, 500); // Match the CSS transition duration
  };

  return (
    <>
      <div
        style={{
          opacity: titleOpacity,
          transition: 'opacity 0.5s ease-in-out',
          textAlign: 'center',
        }}
      >
        <Title />
      </div>
      {!isStarted && (
        <div className="button-container">
          <button className="toggle-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      )}
    </>
  );
}
