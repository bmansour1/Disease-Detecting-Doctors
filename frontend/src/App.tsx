// App.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './styles.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import SelectionPage from './SelectionPage'; // Import the new component
import InputForm from './input-form';
import ChatBot from './chatbot';
import DoctorLocator from './DoctorLocator';
import PastDiagnoses from './PastDiagnoses';

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
        <Route path="/input-form" element={<InputForm />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/doctor-locator" element={<DoctorLocator />} />
        <Route path="/past-diagnoses" element={<PastDiagnoses />} />
      </Routes>
    </div>
  );
}
