import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import InputForm from "./input-form";
import ChatBot from "./chatbot";

export default function App() {

  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          <InputForm />
          <ChatBot />
        </SignedIn>
      </header>
    </div>
  );
}
