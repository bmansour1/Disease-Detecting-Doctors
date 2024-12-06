// SelectionPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function SelectionPage() {
  return (
    <div className="selection-container">
        <div className="selection-text">
            <h1>Select an Option</h1>
        </div>
        <Link to="/input-form">
            <button className="selection-button">Add/Edit Biometrics</button>
        </Link>
        <Link to="/chatbot">
            <button className="selection-button">Start Chat</button>
        </Link>
        <Link to="/doctor-locator">
            <button className="selection-button">Doctor Locator</button>
        </Link>
        <Link to="/past-diagnoses">
            <button className="selection-button">Past Diagnoses</button>
        </Link>
        <Link to="/diagnosis">
            <button className="toggle-button">Generate Diagnosis</button>
        </Link>
    </div>
  );
}
