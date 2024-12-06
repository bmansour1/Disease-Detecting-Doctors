// SelectionPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function SelectionPage() {
  return (
    <>
        <div className="selection-header">
            <h1>Select an Option</h1>
        </div>
        <div className="button-container">
            <Link to="input-form">
                <button className="toggle-button">Add/Edit Biometrics</button>
            </Link>
            <Link to="chatbot">
                <button className="toggle-button">Start Chat</button>
            </Link>
            <Link to="diagnosis">
                <button className="toggle-button">Generate Diagnosis</button>
            </Link>
            <Link to="past-diagnoses">
                <button className="toggle-button">Past Diagnoses</button>
            </Link>
            <Link to="doctor-locator">
                <button className="toggle-button">Doctor Locator</button>
            </Link>
        </div>
    </>
  );
}