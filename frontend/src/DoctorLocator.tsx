// DoctorLocator.tsx
import React, { useState, ChangeEvent, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './styles.css';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 37.7749, // Default to San Francisco
  lng: -122.4194,
};

export default function DoctorLocator() {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState<number>(defaultCenter.lat);
  const [longitude, setLongitude] = useState<number>(defaultCenter.lng);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  const onDragEnd = useCallback(() => {
    if (mapRef) {
      const newCenter = mapRef.getCenter();
      if (newCenter && typeof newCenter.lat === 'function' && typeof newCenter.lng === 'function') {
          const lat = newCenter.lat();
          const lng = newCenter.lng();
          if (!isNaN(lat) && !isNaN(lng)) {
              setLatitude(lat);
              setLongitude(lng);
              setMapCenter({ lat, lng });
          }
      }
    }
}, [mapRef]);

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

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = `http://127.0.0.1:5000/api/user/doctors`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textQuery: searchTerm,
          lat: latitude,
          lng: longitude,
        }),
      });
      const data = await response.json();
  
      // Use navigate to change route and send places data to the new component
      navigate('/doctor-locations', { state: { places: data.places } });
    } catch (error) {
      console.error('Failed to fetch places:', error);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        {/* Back Arrow SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
          <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
        </svg>
      </button>

      <h2>Doctor Locator</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter medical professional type"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <button type="submit">Search</button>
      </form>

      {/* Input Fields for Latitude and Longitude */}
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

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={mapCenter}
        onLoad={onMapLoad}
        onDragEnd={onDragEnd}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
    </div>
  );
}
