import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

interface DoctorLocation {
    displayName: {
      languageCode?: string;
      text?: string;
    };
    formattedAddress?: string;
    internationalPhoneNumber?: string;
    rating?: number;
    regularOpeningHours?: {
        nextOpenTime?: string;
        openNow?: boolean;
        periods?: {
            close?: {
                day?: number;
                hour?: number;
                minute?: number;
            },
            open?: {
                day?: number;
                hour?: number;
                minute?: number;
            }
        }[];
        weekdayDescriptions?: string[];
    };
    userRatingCount?: number;
}

export default function DoctorLocations() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [locations, setLocations] = useState<DoctorLocation[]>([]);

    useEffect(() => {
        if (state?.places) {
            setLocations(state.places);
            console.log("Received places:", state.places);
        }
    }, [state]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="diagnoses-container">
            <button className="back-button" onClick={handleBack}>
                {/* SVG icon for back button */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                    <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
                </svg>
            </button>

            <h2 className="diagnoses-header">Nearby Doctors</h2>

            {locations.length === 0 ? (
                <p>No doctors found.</p>
            ) : (
                <div className="diagnoses-list">
                    {locations.map((location, index) => (
                        <div key={index} className="diagnosis-card">
                            <p><strong>Name:</strong> {location.displayName?.text ?? "Unavailable"}</p>
                            <p><strong>Address:</strong> {location.formattedAddress ?? "Unavailable"}</p>
                            <p><strong>Contact:</strong> {location.internationalPhoneNumber ?? "Unavailable"}</p>
                            {location.regularOpeningHours ? (
                                <>
                                    <p><strong>Opening Hours:</strong></p>
                                    <ul>
                                        {location.regularOpeningHours.weekdayDescriptions ? 
                                            location.regularOpeningHours.weekdayDescriptions.map((desc, id) => (
                                                <li key={id}>{desc}</li>
                                            )) : <li>No weekday descriptions available.</li>
                                        }
                                    </ul>
                                </>
                            ) : (
                                <p>No opening hours available.</p>
                            )}
                            <p><strong>Rating:</strong> {location.rating ?? "N/A"}/5 </p>
                            <p><strong>Rating Count:</strong> {location.userRatingCount ?? "No ratings"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}