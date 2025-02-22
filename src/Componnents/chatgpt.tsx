import React, { useState } from "react";

const ChatGPT: React.FC = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3004/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to get a response from ChatGPT.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Chat with AI</h1>

        {/* Chat Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

        {/* Response */}
        {response && (
          <div className="mt-4 p-3 bg-gray-200 rounded-md">
            <strong>ChatGPT:</strong> {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPT;
