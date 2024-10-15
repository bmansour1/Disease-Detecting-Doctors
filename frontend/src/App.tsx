import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// Define a type for the response object
type ServerResponse = {
  age: string;
  height: string;
  weight: string;
  bloodPressure: string;
  allergies: string;
  message: string;
};

export default function App() {
  const [backendData, setBackendData] = useState('');
  
  // Set response state as ServerResponse or null (initially null before form submission)
  const [response, setResponse] = useState<ServerResponse | null>(null);
  
  // Manage whether the form should be shown or not
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    bloodPressure: '',
    allergies: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setBackendData(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost:5000/submit', formData)
      .then(res => setResponse(res.data))  // Set the response as the server's JSON response
      .catch(err => console.error('Error submitting form:', err));
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
            <div style={{ margin: '50px' }}>
              <h2>Health Information Form</h2>

              {/* Back button */}
              <button onClick={() => setShowForm(false)}>
                Back
              </button>

              <form onSubmit={handleSubmit}>
                <div>
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Height (in cm):</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Weight (in kg):</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Blood Pressure:</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Allergies:</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit">Submit</button>
              </form>

              {/* Display the server response */}
              {response && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Response from Server:</h3>
                  <p>Age: {response.age}</p>
                  <p>Height: {response.height}</p>
                  <p>Weight: {response.weight}</p>
                  <p>Blood Pressure: {response.bloodPressure}</p>
                  <p>Allergies: {response.allergies}</p>
                  <p>{response.message}</p>
                </div>
              )}
            </div>
          )}
        </SignedIn>
      </header>
    </div>
  );
}
