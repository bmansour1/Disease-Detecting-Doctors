import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  const [backendData, setBackendData] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setBackendData(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          <h1>{backendData}</h1>
        </SignedIn>
      </header>
    </div>
  );
}
