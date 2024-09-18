import React, { useState } from 'react';


function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
    
      setMessages([...messages, { text: input, sender: 'user' }]);

      let response = '';
      const lowerCaseInput = input.toLowerCase().trim();

      if (lowerCaseInput === 'hello') {
        response = 'Hello, welcome to Trender! How can I help you?';
      } else if (lowerCaseInput === 'what is share market?') {
        response = 'It is a marketplace where trading of shares of public listed companies is carried out daily.';
      } else if (lowerCaseInput === 'what is the use of this app') {
        response = 'It is a share market portfolio management tracker named as  Trender. Here you can create your own portfolio, add stocks of particular companies, and track their status. In simple words, it\'s the process of managing individuals investments.did you understand now?';
      } else if (lowerCaseInput === 'ok') {
        response = 'Thank you! Any queries?';
    
      }else if (lowerCaseInput === 'no') {
        response = 'Thank you, have a Trender day!!';
      } else {
        response = 'I\'m sorry, I didn\'t understand that. Can you ask something else?';
      }

      // Add chatbot response to chat
      setMessages([...messages, { text: input, sender: 'user' }, { text: response, sender: 'chatbot' }]);

      // Clear input field
      setInput('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`my-2 p-2 rounded ${message.sender === 'user' ? 'bg-blue-100 text-blue-800 text-right' : 'bg-green-100 text-green-800'}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex border-t border-gray-300">
          <input
            type="text"
            className="flex-1 p-3 border-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="p-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
