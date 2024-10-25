import { useState, ChangeEvent, FormEvent } from 'react';
import { useUser } from '@clerk/clerk-react';

interface Message {
    sender: 'user' | 'AI';
    text: string;
}

export default function ChatBot() {
    const [inputText, setInputText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useUser();

    // Helper Method for streaming - updates the current AI response
    const updateLastMessage = (newText: string) => {
        setMessages(currentMessages => {
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
        setMessages(messages => [...messages, newMessage]);
        
        try {
            const url = `http://127.0.0.1:5000/api/user/chat/create/${user?.id}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: inputText })
            });
    
            if (response.body) {
                const reader = response.body.getReader();
                let partialMessage = '';
                setMessages(currentMessages => [...currentMessages, { sender: 'AI', text: ''}]);
    
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    partialMessage += new TextDecoder("utf-8").decode(value, { stream: true });
                    updateLastMessage(partialMessage); // Dynamically updates the last message for streaming effect
                }
                // If you don't want to stream, update currentMessages at the end:
                // setMessages(currentMessages => [...currentMessages, { sender: 'AI', text: completeMessage }]);
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages(currentMessages => [...currentMessages, { sender: 'AI', text: 'Error getting response from the server.' }]);
        }

        setInputText('');
    };

    return (
        <div>
            <h2>Chatbot</h2>
            <div style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type your message here..."
                    value={inputText}
                    onChange={handleChange}
                    style={{ marginRight: '5px', width: '80%' }}
                />
                <button type="submit" style={{ width: '15%' }}>Send</button>
            </form>
        </div>
    );
}