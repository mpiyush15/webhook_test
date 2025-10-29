"use client";

import { useState } from "react";

export default function SendMessageButton({ to, onSent }) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function sendMessage() {
    if (!text.trim()) return;
    setSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text: text.trim() }),
      });

      if (res.ok) {
        setStatus("Message sent!");
        setText("");
        setShowInput(false);
        if (onSent) onSent();
      } else {
        const err = await res.text();
        setStatus("Failed to send: " + err);
      }
    } catch (error) {
      setStatus("Error sending message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ marginTop: "10px" }}>
      {!showInput && (
        <button onClick={() => setShowInput(true)}>Reply</button>
      )}
      {showInput && (
        <>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your reply..."
            style={{ width: "100%", marginTop: "5px" }}
            disabled={sending}
          />
          <button onClick={sendMessage} disabled={sending || !text.trim()}>
            {sending ? "Sending..." : "Send"}
          </button>
          <button onClick={() => setShowInput(false)} disabled={sending} style={{ marginLeft: "5px" }}>
            Cancel
          </button>
          {status && <p>{status}</p>}
        </>
      )}
    </div>
  );
}
