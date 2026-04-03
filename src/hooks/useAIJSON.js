import { getStoredKeys, getModelForProvider } from "./useApiKeys";

export async function callAI(systemPrompt, userPrompt) {
  const keys = getStoredKeys();
  const provider = keys.claude ? "claude" : keys.openai ? "openai" : keys.gemini ? "gemini" : null;
  if (!provider) throw new Error("No API key configured. Add one via the key icon.");
  const model = getModelForProvider(provider);

  if (provider === "claude") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": keys.claude,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.content[0].text;
  }

  if (provider === "openai") {
    const body = {
      model,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };
    if (model === "gpt-5.4") body.reasoning_effort = "high";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${keys.openai}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.choices[0].message.content;
  }

  if (provider === "gemini") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keys.gemini}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.candidates[0].content.parts[0].text;
  }

  throw new Error("Unknown provider");
}

export function extractJSON(text) {
  const cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) return JSON.parse(cleaned.slice(start, end + 1));
  throw new Error("No valid JSON found in AI response");
}
