// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import HealthForm from './InputForm';  // Import the new HealthForm component

// Define a type for the response object
type ServerResponse = {
  age: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  symptoms: string;
};

export default function App() {
  const [backendData, setBackendData] = useState('');
  
  // Set response state as ServerResponse or null (initially null before form submission)
  const [response, setResponse] = useState<ServerResponse | null>(null);
  
  // Manage whether the form should be shown or not
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setBackendData(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleFormSubmitSuccess = (data: ServerResponse) => {
    setResponse(data);  // Save the server's response after form submission
    setShowForm(false); // Optionally, hide the form after successful submission
  };

  return (
    <div>
      <header>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          
          <h1>{backendData}</h1>

          {/* Button to show the form */}
          {!showForm && (
            <div>
              <button onClick={() => setShowForm(true)}>
                Input Health Information
              </button>
            </div>
          )}

          {/* Health Information Form - Render only if showForm is true */}
          {showForm && (
            <HealthForm
              onSubmitSuccess={handleFormSubmitSuccess}
              onBack={() => setShowForm(false)}
            />
          )}

          {/* Display the server response */}
          {response && (
            <div style={{ marginTop: '20px' }}>
              <h3>Response from Server:</h3>
              <p>Age: {response.age}</p>
              <p>Height Feet: {response.heightFeet}</p>
              <p>Height Inches: {response.heightInches}</p>
              <p>Weight: {response.weight}</p>
              <p>Symptoms: {response.symptoms}</p>
            </div>
          )}
        </SignedIn>
      </header>
    </div>
  );
}
