// ChatBot.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
  sender: 'user' | 'AI';
  text: string;
}

export default function ChatBot() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  const updateLastMessage = (newText: string) => {
    setMessages((currentMessages) => {
      const updatedMessages = [...currentMessages];
      if (updatedMessages.length === 0) return updatedMessages;

      const lastMessageIndex = updatedMessages.length - 1;
      const lastMessage = updatedMessages[lastMessageIndex];
      updatedMessages[lastMessageIndex] = { ...lastMessage, text: newText };

      return updatedMessages;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = { sender: 'user', text: inputText };
    setMessages((messages) => [...messages, newMessage]);

    try {
      const chatLogUrl = `http://127.0.0.1:5000/api/user/chat/get/${user?.id}`;
      let url: string;
      let method: 'POST' | 'PUT';

      // Check if a chat log exists for the user
      const logResponse = await axios.get(chatLogUrl);
      const { data } = logResponse;

      if (data == null) {
        url = `http://127.0.0.1:5000/api/user/chat/create/${user?.id}`;
        method = 'POST';
      } else {
        url = `http://127.0.0.1:5000/api/user/chat/add/${user?.id}`;
        method = 'PUT';
      }

      // Send the user's input to the backend
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText }),
      });

      if (response.body) {
        const reader = response.body.getReader();
        let partialMessage = '';
        setMessages((currentMessages) => [...currentMessages, { sender: 'AI', text: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          partialMessage += new TextDecoder('utf-8').decode(value, { stream: true });
          updateLastMessage(partialMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'AI', text: 'Error getting response from the server.' },
      ]);
    }

    setInputText('');
  };

  return (
    <div className="chatbot-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M19 12H5.83l5.88-5.88L10.29 5 2.29 12l8 7.29 1.42-1.42L5.83 12H19z" />
        </svg>
      </button>

      <h2 className="chatbot-title">Chatbot</h2>
      <div
        style={{
          height: '250px',
          width: '100%',
          maxWidth: '900px',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}
          >
            <strong>{msg.sender === 'user' ? 'You: ' : 'Bot: '}</strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-user-text-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={inputText}
            onChange={handleChange}
            style={{ marginRight: '5px', width: '80%' }}
            required
          />

          <button type="submit" style={{ width: '15%' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
