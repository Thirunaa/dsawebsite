import React, { useState } from "react";
import { X, Key, Eye, EyeOff, Trash2, Check, Zap, Star, Info } from "lucide-react";
import { useApiKeys } from "../hooks/useApiKeys";

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI (GPT)",
    placeholder: "sk-proj-...",
    color: "#10b981",
    docsUrl: "https://platform.openai.com/api-keys",
    tiers: [
      { id: "gpt-4o-mini",  label: "GPT-4o mini",   tier: "fast", note: "Fast · Cheap" },
      { id: "gpt-5.4",      label: "GPT 5.4 High",  tier: "best", note: "Latest · Capable" },
    ],
  },
  {
    id: "claude",
    name: "Anthropic (Claude)",
    placeholder: "sk-ant-...",
    color: "#f59e0b",
    docsUrl: "https://console.anthropic.com/settings/keys",
    tiers: [
      { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5",  tier: "fast", note: "Fast · Cheap" },
      { id: "claude-opus-4-6",             label: "Claude 4.6 Opus",   tier: "best", note: "Latest · Capable" },
    ],
  },
  {
    id: "gemini",
    name: "Google (Gemini)",
    placeholder: "AIza...",
    color: "#3b82f6",
    docsUrl: "https://aistudio.google.com/app/apikey",
    tiers: [
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", tier: "fast", note: "Fast · Cheap" },
      { id: "gemini-3.1-pro-preview",   label: "Gemini 3.1 Pro",   tier: "best", note: "Latest · Capable" },
    ],
  },
];

function ProviderRow({ provider, existingKey, selectedModel, onSave, onDelete, onModelChange }) {
  const [val, setVal]   = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentTier = provider.tiers.find(t => t.id === selectedModel) || provider.tiers[0];

  const handleSave = () => {
    if (!val.trim()) return;
    onSave(provider.id, val.trim());
    setVal("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border p-4 space-y-3" style={{ background: "#0d1117" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: provider.color }} />
          <span className="text-sm font-semibold text-foreground">{provider.name}</span>
          <a href={provider.docsUrl} target="_blank" rel="noreferrer"
            className="text-muted-foreground/50 hover:text-primary transition-colors"
            title="How to get an API key">
            <Info className="h-3.5 w-3.5" />
          </a>
        </div>
        {existingKey ? (
          <div className="flex items-center gap-2">
            <span className="rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 font-mono text-xs text-green-400">Active</span>
            <button onClick={() => onDelete(provider.id)} className="rounded p-1 text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <span className="font-mono text-xs text-muted-foreground/50">Not set</span>
        )}
      </div>

      {/* Model tier selector */}
      <div className="space-y-1.5">
        <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">Model</p>
        <div className="flex gap-2">
          {provider.tiers.map((t) => {
            const active = selectedModel === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onModelChange(provider.id, t.id)}
                className="flex-1 flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-all"
                style={{
                  borderColor: active ? provider.color + "60" : "#30363d",
                  background: active ? provider.color + "12" : "transparent",
                }}
              >
                {t.tier === "fast"
                  ? <Zap className="h-3 w-3 shrink-0" style={{ color: active ? provider.color : "#6b7280" }} />
                  : <Star className="h-3 w-3 shrink-0" style={{ color: active ? provider.color : "#6b7280" }} />
                }
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium truncate" style={{ color: active ? provider.color : "#9ca3af" }}>
                    {t.label}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/50">{t.note}</p>
                </div>
                {active && <Check className="h-3 w-3 ml-auto shrink-0" style={{ color: provider.color }} />}
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/40 pl-0.5">
          Active: <span className="text-muted-foreground/70">{currentTier.label}</span>
        </p>
      </div>

      {/* Existing key display */}
      {existingKey && (
        <div className="flex items-center gap-2 rounded border border-border px-3 py-2" style={{ background: "#161b22" }}>
          <span className="font-mono text-xs text-muted-foreground flex-1">
            {show ? existingKey : existingKey.slice(0, 8) + "•".repeat(12) + existingKey.slice(-4)}
          </span>
          <button onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground">
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Key input */}
      <div className="flex gap-2">
        <input
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder={existingKey ? "Replace key..." : provider.placeholder}
          className="flex-1 rounded border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={!val.trim()}
          className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
          style={{
            background: saved ? "#22c55e20" : `${provider.color}20`,
            color: saved ? "#22c55e" : provider.color,
            border: `1px solid ${saved ? "#22c55e40" : provider.color + "40"}`,
          }}
        >
          {saved ? <Check className="h-3 w-3" /> : null}
          {saved ? "Saved" : existingKey ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function ApiKeyModal({ onClose }) {
  const { keys, models, saveKey, deleteKey, saveModel } = useApiKeys();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-xl border border-border shadow-2xl" style={{ background: "#080c14" }}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">AI Assistant — API Keys</h2>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground">
            Keys stored in your browser's localStorage only — never sent anywhere except directly to the provider's API.
            Priority order: <span className="text-foreground">Claude → GPT → Gemini</span>.
          </p>

          {PROVIDERS.map((p) => {
            const storedModel = models[p.id] || p.tiers[0].id;
            return (
              <ProviderRow
                key={p.id}
                provider={p}
                existingKey={keys[p.id]}
                selectedModel={storedModel}
                onSave={saveKey}
                onDelete={deleteKey}
                onModelChange={saveModel}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
