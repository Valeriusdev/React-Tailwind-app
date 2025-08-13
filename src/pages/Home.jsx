import React, { useState } from "react";
import { chatGroq } from "../services/groqClient";
import { dummyData } from "../dummydata/dummydata";

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

  async function handleSendWithData() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const serialized = JSON.stringify(dummyData, null, 2);
      const prompt = `${input}\n\nContext data (JSON):\n${serialized}`;
      const resText = await chatGroq(prompt);
      setAnswer(resText || "(No response)");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50 items-center justify-center p-4">
      <div className="flex flex-row items-start justify-center gap-8">
        <div className="flex flex-col gap-5 max-h-[80vh] overflow-auto pr-2">
          {dummyData.map((item) => (
            <div
              key={item.id}
              className="bg-sky-600 text-white rounded-xl p-8 shadow-lg w-80"
            >
              <div className="font-bold text-lg mb-2 truncate">{item.name}</div>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(item.states)
                  ? item.states.map((state, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-700 px-2 py-0.5 rounded text-[10px]"
                      >
                        {state}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center w-96">
          <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="mb-3 px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3 mb-3 w-full">
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
          <button
            type="button"
            disabled={loading}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendWithData}
          >
            Send with Data
          </button>
          {error && (
            <div className="w-full mb-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3">
              {error}
            </div>
          )}
          {answer && !error && (
            <div className="w-full whitespace-pre-wrap text-gray-800 bg-green-100 border border-green-300 rounded p-4 mb-3">
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
    </div>
  );
}
