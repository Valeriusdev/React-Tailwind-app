import React, { useState } from "react";
import { chatGroq } from "../services/groqClient";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const resText = await chatGroq(input.trim());
      setAnswer(resText || "(No response)");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="mb-4 px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-3 mb-4 w-full">
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setAnswer("");
              setError("");
            }}
            disabled={loading}
            className="bg-gray-500 flex-1 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
        {error && (
          <div className="w-full mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3">
            {error}
          </div>
        )}
        {answer && !error && (
          <div className="w-full whitespace-pre-wrap text-sm text-gray-800 bg-green-100 border border-green-300 rounded p-4">
            {answer}
          </div>
        )}
        {!answer && !error && !loading && (
          <div className="w-full text-xs text-gray-400 text-center">
            Enter a prompt and press Send.
          </div>
        )}
      </div>
    </div>
  );
}
