// src/components/HealthForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

type HealthFormProps = {
  onSubmitSuccess: (response: any) => void;  // Callback to handle the server response
  onBack: () => void;  // Callback to go back to the previous screen
};

const HealthForm: React.FC<HealthFormProps> = ({ onSubmitSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    age: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    symptoms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost:5000/submit', formData)
      .then(res => onSubmitSuccess(res.data))
      .catch(err => console.error('Error submitting form:', err));
  };

  return (
    <div className="form-container">
      <h2>Health Information Form</h2>

      <form onSubmit={handleSubmit} className="health-form">
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Years"
            required
          />
        </div>

        <div className="form-group">
          <label>Height:</label>
          <div className="height-inputs">
            <input
              type="number"
              name="heightFeet"
              value={formData.heightFeet}
              onChange={handleChange}
              placeholder="Feet"
              min={0}
              required
            />
            <input
              type="number"
              name="heightInches"
              value={formData.heightInches}
              onChange={handleChange}
              placeholder="Inches"
              min={0}
              max={11}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Weight (in pounds):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight (lbs)"
            required
          />
        </div>

        <div className="form-group">
          <label>Symptoms:</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe your symptoms"
            rows={4}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>

        {/* Back button */}
        <button onClick={onBack} className="back-button">Back</button>

      </form>

      

    </div>
  );
};

export default HealthForm;
