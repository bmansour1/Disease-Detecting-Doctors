import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import InputForm from "./input-form";
import ChatBot from "./chatbot";
import Title from "./title";
import './styles.css';

export default function App() {
    const [showInputForm, setShowInputForm] = useState(false);
    const [showChatBot, setShowChatBot] = useState(false);
    const [isStarted, setIsStarted] = useState(false); // Track if "Get Started" has been clicked
    const [titleOpacity, setTitleOpacity] = useState(1); // Control title opacity

    const toggleInputForm = () => {
        setShowInputForm((prev) => !prev);
        setShowChatBot(false);
    };

    const toggleChatBot = () => {
        setShowChatBot((prev) => !prev);
        setShowInputForm(false);
    };

    // Updated back function
    const handleBack = () => {
        setShowInputForm(false);
        setShowChatBot(false);
    };

    const handleGetStarted = () => {
        // Fade out title
        setTitleOpacity(0);
        // After fade-out, set isStarted to true
        setTimeout(() => {
            setIsStarted(true);
        }, 500); // Match the CSS transition duration
    };

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

          {/* Title with fade-out effect */}
          <div style={{ opacity: titleOpacity, transition: 'opacity 0.5s ease-in-out', textAlign: 'center' }}>
              <Title />
          </div>

          {/* Show "Get Started" button only if not started */}
          {!isStarted && (
              <div className="button-container">
                  <button className="toggle-button" onClick={handleGetStarted}>
                      Get Started
                  </button>
              </div>
          )}

          {/* Toggle buttons for InputForm and ChatBot */}
          {isStarted && !showInputForm && !showChatBot && (
              <div className="button-container">
                  <button className="toggle-button" onClick={toggleInputForm}>
                      {showInputForm ? 'Close Form' : 'Add/Edit Biometrics'}
                  </button>
                  <button className="toggle-button" onClick={toggleChatBot}>
                      {showChatBot ? 'Close Chat' : 'Start Chat'}
                  </button>
              </div>
          )}

          {/* InputForm and ChatBot with back button */}
          {showInputForm && <InputForm onBack={handleBack} />}
          {showChatBot && <ChatBot onBack={handleBack} />}
      </div>
    );
}
