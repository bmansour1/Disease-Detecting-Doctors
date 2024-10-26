// src/Title.tsx
import React, { useEffect, useState } from 'react';
import './styles.css'; // Import styles if necessary

const Title: React.FC = () => {
    const [title, setTitle] = useState<string>("< "); // Initial state with the opening bracket
    const fullTitle: string = "         Welcome to Disease Detecting Doctors"; // The complete title text
                              // ^^^^ fixme, spaces needed to not scramble the words "welcome"
    useEffect(() => {
        let index = 0; // Start index at 0
        setTitle("< ");
        const typingEffect = setInterval(() => {
            if (index < fullTitle.length) {
                setTitle((prev) => prev + fullTitle.charAt(index)); // Append character at current index
                index++; // Move to the next index
            } else {
                clearInterval(typingEffect); // Stop the interval when done
            }
        }, 100); // Adjust typing speed here

        // Cleanup interval on unmount
        return () => clearInterval(typingEffect);
    }, [fullTitle]);

    return (
        <h1 className="title">{title} {/* Close the angle bracket after title */}
            {/* Ensure closing bracket is rendered correctly */}
            {title.endsWith(' >') ? '' : ' >'} 
        </h1>
    );
};

export default Title;
