import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import './styles.css';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 29.651634,
  lng: -82.324829,
};

export default function DoctorLocator() {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState<number>(defaultCenter.lat);
  const [longitude, setLongitude] = useState<number>(defaultCenter.lng);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLatitude(value);
      setMapCenter({ lat: value, lng: longitude });
    }
  };

  const handleLongitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLongitude(value);
      setMapCenter({ lat: latitude, lng: value });
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      setLatitude(lat);
      setLongitude(lng);
      setMapCenter({ lat, lng });
    }
  };

  const fetchDoctors = async () => {
    try {
      setError(null);
      const response = await axios.post('http://127.0.0.1:5000/api/user/doctors', {
        textQuery: "Find doctors within the given parameters",
        latitude,
        longitude,
      });

      if (response.data && Array.isArray(response.data.places)) {
        const parsedDoctors = response.data.places.map((place: any) => ({
          name: place.displayName?.text || 'Unknown Name',
          address: place.formattedAddress || 'Unknown Address',
        }));
        setDoctors(parsedDoctors);
      } else {
        setDoctors([]);
        setError('Unexpected response format from backend.');
      }
    } catch (err) {
      console.error('Error fetching doctor data:', err);
      setError('Failed to fetch doctor data.');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="doctor-locator-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
        </svg>
      </button>

      <h2>Doctor Locator</h2>

      <div className="coordinates-input-container">
        <div className="form-field">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={latitude}
            onChange={handleLatitudeChange}
            step="any"
            placeholder="Enter latitude"
          />
        </div>
        <div className="form-field">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={longitude}
            onChange={handleLongitudeChange}
            step="any"
            placeholder="Enter longitude"
          />
        </div>
      </div>

      <button className="submit-button" onClick={fetchDoctors}>
        Find Doctors
      </button>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={mapCenter}
        onClick={handleMapClick} // Add onClick handler
      >
        <Marker position={mapCenter} />
      </GoogleMap>

      <div className="doctor-list">
        {error && <p className="error">{error}</p>}
        {doctors.length > 0 ? (
          <ul>
            {doctors.map((doctor, index) => (
              <li key={index}>
                <strong>{doctor.name}</strong>
                <br />
                {doctor.address}
              </li>
            ))}
          </ul>
        ) : (
          !error && <p>No doctors found in this area.</p>
        )}
      </div>
    </div>
  );
}
