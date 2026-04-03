import { useState, useCallback } from "react";

const STORAGE_KEY = "hashmap_api_keys";
const MODELS_KEY  = "hashmap_api_models";

const DEFAULT_MODELS = {
  openai: "gpt-4o-mini",
  claude: "claude-haiku-4-5-20251001",
  gemini: "gemini-2.0-flash",
};

export function getStoredKeys() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

export function getStoredModels() {
  try { return JSON.parse(localStorage.getItem(MODELS_KEY) || "{}"); } catch { return {}; }
}

export function getModelForProvider(providerId) {
  const stored = getStoredModels();
  return stored[providerId] || DEFAULT_MODELS[providerId];
}

export function useApiKeys() {
  const [keys, setKeys]     = useState(() => getStoredKeys());
  const [models, setModels] = useState(() => getStoredModels());

  const saveKey = useCallback((provider, value) => {
    const next = { ...getStoredKeys(), [provider]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setKeys(next);
  }, []);

  const deleteKey = useCallback((provider) => {
    const next = { ...getStoredKeys() };
    delete next[provider];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setKeys(next);
  }, []);

  const saveModel = useCallback((provider, modelId) => {
    const next = { ...getStoredModels(), [provider]: modelId };
    localStorage.setItem(MODELS_KEY, JSON.stringify(next));
    setModels(next);
  }, []);

  return { keys, models, saveKey, deleteKey, saveModel };
}
