"use client";

import { useState } from "react";

export default function WebhookViewHistory() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchHistory() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/webhook");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={fetchHistory} disabled={loading}>
        {loading ? "Loading..." : "History"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {messages.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              <p><strong>From:</strong> {msg.from ?? '[Unknown]'}</p>
              <p><strong>Text:</strong> {msg.text?.body ?? '[No text]'}</p>
              <p><small><strong>Timestamp:</strong> {msg.timestamp ? new Date(parseInt(msg.timestamp) * 1000).toLocaleString() : '[No timestamp]'}</small></p>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  );
}
