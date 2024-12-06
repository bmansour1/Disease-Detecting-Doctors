import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import './styles.css';

interface Diagnosis {
    timestamp: string;
    biometrics: {
        gender: string;
        race: string;
        age: string;
        height: string;
        weight: string;
        bloodPressure: string;
        allergies: string;
        symptoms: string;
    };
    diagnosis: string;
    recommendations: string;
}

export default function PastDiagnoses() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiagnoses = async () => {
            try {
                const url = `http://127.0.0.1:5000/api/user/diagnosis-list/get/${user?.id}`;
                const response = await axios.get(url);
                setDiagnoses(response.data);
            } catch (err) {
                console.error('Error fetching diagnoses:', err);
                setError('Failed to fetch past diagnoses.');
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnoses();
    }, [user?.id]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="diagnoses-container">
            {/* Back Button */}
            <button className="back-button" onClick={handleBack}>
                {/* Back Arrow SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
                    <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
                </svg>
            </button>

            <h2 className="diagnoses-header">Past Diagnoses</h2>

            {loading && <p>Loading your past diagnoses...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && diagnoses.length === 0 && <p>No past diagnoses found.</p>}
            {!loading && !error && diagnoses.length > 0 && (
                <div className="diagnoses-list">
                    {diagnoses.map((diag, index) => (
                        <div key={index} className="diagnosis-card">
                            <h3>Diagnosis #{index + 1}</h3>
                            <p><strong>Timestamp:</strong> {new Date(diag.timestamp).toLocaleString()}</p>
                            <h4>Biometrics:</h4>
                            <ul>
                                <li><strong>Gender:</strong> {diag.biometrics.gender}</li>
                                <li><strong>Race:</strong> {diag.biometrics.race}</li>
                                <li><strong>Age:</strong> {diag.biometrics.age}</li>
                                <li><strong>Height:</strong> {diag.biometrics.height}</li>
                                <li><strong>Weight:</strong> {diag.biometrics.weight}</li>
                                <li><strong>Blood Pressure:</strong> {diag.biometrics.bloodPressure}</li>
                                <li><strong>Allergies:</strong> {diag.biometrics.allergies}</li>
                                <li><strong>Symptoms:</strong> {diag.biometrics.symptoms}</li>
                            </ul>
                            <h4>Diagnosis:</h4>
                            <ReactMarkdown>{diag.diagnosis}</ReactMarkdown>
                            <h4>Recommendations:</h4>
                            <ReactMarkdown>{diag.recommendations}</ReactMarkdown>
                            <p className="disclaimer">
                                Please do not blindly trust the information from our web app and consult a medical professional.
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}