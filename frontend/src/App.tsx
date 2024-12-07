// App.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './styles.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import InputForm from './input-form';
import ChatBot from './chatbot';
import DoctorLocator from './DoctorLocator';
import PastDiagnoses from './PastDiagnoses';
import Diagnosis from './Diagnosis';
import DoctorLocations from './doctor-locations';
import SelectionPage from './SelectionPage';

export default function App() {
  return (
    <div className="app-container">
      <div className="signin-button">
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      </div>

      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/selection/input-form" element={<InputForm />} />
        <Route path="/selection/chatbot" element={<ChatBot />} />
        <Route path="/selection/doctor-locator" element={<DoctorLocator />} />
        <Route path="/selection/past-diagnoses" element={<PastDiagnoses />} />
        <Route path="/selection/diagnosis" element={<Diagnosis />} />
        <Route path="/selection/doctor-locator/doctor-locations" element={<DoctorLocations />} />
      </Routes>
    </div>
  );
}
