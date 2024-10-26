// src/App.js
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import InputForm from "./input-form";
import ChatBot from "./chatbot";
import Title from "./title"; // Import the Title component
import './styles.css'; // Ensure you import your styles

export default function App() {
    const [showInputForm, setShowInputForm] = useState(false);
    const [showChatBot, setShowChatBot] = useState(false);
    const [isStarted, setIsStarted] = useState(false); // State to track if the user has clicked "Get Started"
    const [titleOpacity, setTitleOpacity] = useState(1); // State to control title opacity

    const toggleInputForm = () => {
        setShowInputForm((prev) => !prev);
        setShowChatBot(false);
    };

    const toggleChatBot = () => {
        setShowChatBot((prev) => !prev);
        setShowInputForm(false);
    };

    // Function to go back to main page
    const handleBack = () => {
        setShowInputForm(false);
        setShowChatBot(false);
        setIsStarted(false); // Reset to main page
        setTitleOpacity(1); // Reset title opacity
    };

    const handleGetStarted = () => {
        // Fade out title
        setTitleOpacity(0);
        // After the fade-out, set isStarted to true
        setTimeout(() => {
            setIsStarted(true);
        }, 500); // Match the timeout duration with your CSS transition duration
    };

    return (
      <>
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

            {!isStarted && (
                <div className="button-container">
                    <button className="toggle-button" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
            )}

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

            {showInputForm && <InputForm onBack={handleBack} />}
            {showChatBot && <ChatBot />}
        </div>
      </>
    );
}
