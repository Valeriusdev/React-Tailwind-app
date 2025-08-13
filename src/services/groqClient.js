// Simple Groq API client
// Expects VITE_GROQ_API_KEY to be defined in your environment (.env)

export async function chatGroq(prompt, { signal } = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing VITE_GROQ_API_KEY. Define it in a .env file at project root."
    );
  }
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a concise helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}
