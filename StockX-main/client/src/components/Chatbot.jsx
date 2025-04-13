import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const guideRef = useRef(null);  // Fix for ref issue

    // Function to send user message and fetch chatbot response
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat
        setInput(''); // Clear input field
        setIsTyping(true); // Show typing indicator

        try {
            const response = await axios.post('http://127.0.0.1:5000/chat', { message: input });
            const botMessage = { role: 'bot', content: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot's response to chat
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { role: 'bot', content: "I couldn't fetch a response. Please try again." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]); // Add error message
        } finally {
            setIsTyping(false); // Hide typing indicator
        }
    };

    // Handle Enter key press to send message
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage(); // Trigger sendMessage on Enter key press
        }
    };

    // Close chat window if user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guideRef.current && !guideRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            {/* Chatbot Icon */}
            <div
                className="select-none fixed flex items-center justify-center bottom-4 right-4 lg:bottom-6 lg:right-6 overflow-hidden w-12 h-12 lg:w-16 lg:h-16 cursor-pointer rounded-full bg-mlsa-sky-blue p-3 border-2 border-mlsa-sky-blue z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6 lg:w-8 lg:h-8 text-mlsa-bg" />
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    ref={guideRef} // Fix for ref issue
                    className="fixed bottom-5 right-4 lg:right-4 w-[330px] h-[520px] z-[60] bg-mlsa-bg border-2 border-mlsa-sky-blue shadow-lg rounded-lg overflow-hidden"
                >
                    <div className="bg-blue-theme text-black bg-mlsa-sky-blue font-bold py-2 px-4 flex items-center justify-between">
                        <p>StockAI</p>
                        <XMarkIcon
                            className="w-6 h-6 font-bold text-blue-theme p-[2px] bg-background-theme rounded-full cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                    <div className="flex flex-col h-full">
                        {/* Messages Area */}
                        <div className="flex-[0.9] overflow-hidden overflow-y-auto p-4 text-white">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-mlsa-sky-blue text-black' : 'border-2 border-mlsa-sky-blue text-white'
                                            }`}
                                    >
                                        <strong>{msg.role === 'user' ? 'You' : 'StockAI'}:</strong> {msg.content}
                                    </div>
                                </div>
                            ))}
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start text-black">
                                    <div className="p-2 rounded-lg border-2 border-mlsa-sky-blue text-white">
                                        StockAI is typing...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Field */}
                        <div className="bg-gray-800 p-2 flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress} // Listen for Enter key
                                placeholder="Type your message"
                                className="flex-1 p-2 border border-gray-300 rounded mr-2"
                            />
                            <PaperAirplaneIcon
                                className="w-8 h-8 text-mlsa-sky-blue cursor-pointer"
                                onClick={sendMessage}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;