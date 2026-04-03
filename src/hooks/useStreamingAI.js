import { useState, useRef, useCallback } from "react";
import { getStoredKeys, getModelForProvider } from "./useApiKeys";

export function useStreamingAI() {
  const [response, setResponse]     = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError]           = useState(null);
  const abortRef                    = useRef(null);

  const abort = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
  }, []);

  const stream = useCallback(async (userPrompt, systemPrompt = "You are a helpful coding assistant.") => {
    const keys = getStoredKeys();
    const provider = keys.claude ? "claude" : keys.openai ? "openai" : keys.gemini ? "gemini" : null;

    if (!provider) {
      setError("No API key configured. Click the key icon in the top right to add one.");
      return;
    }

    setResponse("");
    setError(null);
    setIsStreaming(true);
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const model = getModelForProvider(provider);
      if (provider === "claude") {
        await streamClaude(keys.claude, model, systemPrompt, userPrompt, setResponse, signal);
      } else if (provider === "openai") {
        await streamOpenAI(keys.openai, model, systemPrompt, userPrompt, setResponse, signal);
      } else if (provider === "gemini") {
        await streamGemini(keys.gemini, model, systemPrompt, userPrompt, setResponse, signal);
      }
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { response, isStreaming, error, stream, abort, setResponse };
}

// ─── Claude ───────────────────────────────────────────────────────────────
async function streamClaude(apiKey, model, system, userPrompt, setResponse, signal) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      stream: true,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const obj = JSON.parse(json);
        const text = obj.delta?.text || "";
        if (text) setResponse((p) => p + text);
      } catch {}
    }
  }
}

// ─── OpenAI ───────────────────────────────────────────────────────────────
async function streamOpenAI(apiKey, model, system, userPrompt, setResponse, signal) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: true,
      ...(model === "gpt-5.4" ? { reasoning_effort: "high" } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const obj = JSON.parse(json);
        const text = obj.choices?.[0]?.delta?.content || "";
        if (text) setResponse((p) => p + text);
      } catch {}
    }
  }
}

// ─── Gemini ───────────────────────────────────────────────────────────────
async function streamGemini(apiKey, model, system, userPrompt, setResponse, signal) {
  const fullPrompt = `${system}\n\n${userPrompt}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      }),
      signal,
    }
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      try {
        const obj = JSON.parse(json);
        const text = obj.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) setResponse((p) => p + text);
      } catch {}
    }
  }
}
