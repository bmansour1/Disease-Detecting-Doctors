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

export default function App() {
  return (
    <div className="app-container">
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input-form" element={<InputForm />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/doctor-locator" element={<DoctorLocator />} />
        <Route path="/past-diagnoses" element={<PastDiagnoses />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/doctor-locations" element={<DoctorLocations />} />
      </Routes>
    </div>
  );
}
