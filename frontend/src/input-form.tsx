// InputForm.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

interface Biometrics {
    gender: string;
    race: string;
    age: string;
    height: string;
    weight: string;
    bloodPressure: string;
    allergies: string;
    symptoms: string;
}

export default function InputForm() {
    const [biometrics, setBiometrics] = useState<Biometrics>({
        gender: '',
        race: '',
        age: '',
        height: '',
        weight: '',
        bloodPressure: '',
        allergies: '',
        symptoms: ''
    });
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBiometrics(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const url = `http://127.0.0.1:5000/api/user/biometrics/set/${user?.id}`;
            const response = await axios.post(url, biometrics);
            console.log('Server response:', response.data);

            // Display success message
            setSuccessMessage(response.data.message);
            
            // Optionally, navigate to PastDiagnoses page after a short delay
            // setTimeout(() => {
            //     navigate('/past-diagnoses');
            // }, 2000); // 2 seconds delay to show success message
        } catch (err) {
            console.error('Error submitting data:', err);
            setError('Failed to submit biometrics and generate diagnosis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={handleBack}>
                {/* Back Arrow SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                >
                    <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
                </svg>
            </button>
            <h2> Add/Edit Biometrics</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={biometrics.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="race">Race</label>
                        <select
                            id="race"
                            name="race"
                            value={biometrics.race}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Race</option>
                            <option value="asian">Asian</option>
                            <option value="black">Black or African American</option>
                            <option value="hispanic">Hispanic or Latino</option>
                            <option value="native-american">Native American</option>
                            <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                            <option value="white">White</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={biometrics.age}
                            placeholder="Years"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="weight">Weight</label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={biometrics.weight}
                            placeholder="Pounds"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="height">Height</label>
                        <input
                            type="text"
                            id="height"
                            name="height"
                            value={biometrics.height}
                            placeholder="Feet, Inches"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="bloodPressure">Blood Pressure</label>
                        <input
                            type="text"
                            id="bloodPressure"
                            name="bloodPressure"
                            value={biometrics.bloodPressure}
                            placeholder="Sys/Dia"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="allergies">Allergies</label>
                    <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={biometrics.allergies}
                        placeholder="Separate by comma"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="symptoms">Symptoms</label>
                    <textarea
                        id="symptoms"
                        name="symptoms"
                        onChange={handleChange}
                        value={biometrics.symptoms}
                        placeholder="Describe your symptoms"
                        rows={8}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Confirm'}
                </button>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
    }
