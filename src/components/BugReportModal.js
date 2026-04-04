import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { X, Bug, Image, Send, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";

// ─── EmailJS config ───────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_b188f6e";
const EMAILJS_TEMPLATE_ID = "template_vvhulhb";
const EMAILJS_PUBLIC_KEY  = "yNE3gTdj90_mvS4Uf";

const NOT_CONFIGURED = false;

// ─────────────────────────────────────────────────────────────────────────
export default function BugReportModal({ onClose }) {
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot]   = useState(null); // { file, preview, base64 }
  const [status, setStatus]           = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg]       = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMsg("Screenshot must be under 5 MB."); return; }
    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Resize to fit within 600px wide, compress to stay well under EmailJS 50KB limit
        const MAX_W = 600;
        const scale = img.width > MAX_W ? MAX_W / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.5);
        setScreenshot({ file, preview: e.target.result, base64: compressed });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const handleSubmit = async () => {
    if (description.trim().length < 10) {
      setErrorMsg("Please describe the bug in at least 10 characters.");
      return;
    }
    if (NOT_CONFIGURED) {
      setErrorMsg("EmailJS is not configured yet. See setup instructions in BugReportModal.js.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const templateParams = {
      bug_description: description.trim(),
      page_url:        window.location.href,
      user_agent:      navigator.userAgent,
      screenshot_note: screenshot ? `Screenshot attached (${screenshot.file.name})` : "No screenshot",
      // EmailJS can embed base64 images in templates via {{screenshot_data}}
      screenshot_data: screenshot?.base64 || "",
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.text || err?.message || "Failed to send. Check your EmailJS configuration.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border shadow-2xl flex flex-col"
        style={{ background: "#080c14", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "#f8717115", border: "1px solid #f8717130" }}>
              <Bug className="h-3.5 w-3.5" style={{ color: "#f87171" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Report a Bug</h2>
              <p className="text-[10px] text-muted-foreground/50 font-mono">Help us improve Hashmap</p>
            </div>
          </div>
          <button onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "#4ade8015", border: "1px solid #4ade8040" }}>
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Report sent!</p>
              <p className="text-xs text-muted-foreground mt-1">Thanks — we'll look into it soon.</p>
            </div>
            <button onClick={onClose}
              className="mt-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "#4ade80", color: "#0a0e17" }}>
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                Bug Description <span style={{ color: "#f87171" }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrorMsg(""); }}
                placeholder="What happened? What did you expect? Steps to reproduce..."
                rows={5}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none resize-none leading-relaxed"
                style={{ background: "#0d1117" }}
              />
              <p className="text-right font-mono text-[10px] text-muted-foreground/30">{description.length} chars</p>
            </div>

            {/* Screenshot */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                Screenshot <span className="text-muted-foreground/30">(optional · auto-compressed)</span>
              </label>
              {screenshot ? (
                <div className="relative rounded-lg overflow-hidden border border-border" style={{ background: "#0d1117" }}>
                  <img src={screenshot.preview} alt="Screenshot" className="w-full max-h-40 object-cover" />
                  <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="font-mono text-[10px] text-white/70 flex-1 truncate">{screenshot.file.name}</span>
                    <button onClick={() => setScreenshot(null)}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg border-2 border-dashed border-border px-4 py-6 text-center cursor-pointer transition-all hover:border-primary/40"
                  style={{ background: "#0d1117" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "#1e293b" }}>
                      <Image className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">Click to upload</span> or drag & drop
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/40">PNG · JPG · WEBP · auto-compressed for delivery</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/20 px-3 py-2.5"
                style={{ background: "#1a0808" }}>
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                <p className="text-xs font-mono" style={{ color: "#f87171" }}>{errorMsg}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button onClick={onClose}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={status === "sending"}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#4ade80", color: "#0a0e17" }}>
                {status === "sending"
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Sending...</>
                  : <><Send className="h-3.5 w-3.5" />Send Report</>}
              </button>
            </div>

            <p className="text-center font-mono text-[10px] text-muted-foreground/30">
              Sent directly to the developer via EmailJS
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
