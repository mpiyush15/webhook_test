"use client";

import { useEffect, useState } from "react";

export default function WebhookView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outgoingMsg, setOutgoingMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/webhook");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Get latest sender's phone number
  const latestSender = messages.length ? messages[messages.length - 1].from : null;

  async function handleSend() {
    if (!outgoingMsg.trim() || !latestSender) return;
    setSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: latestSender, text: outgoingMsg.trim() }),
      });

      if (res.ok) {
        setStatus("Message sent!");
        setOutgoingMsg("");
      } else {
        const errorText = await res.text();
        setStatus("Failed to send: " + errorText);
      }
    } catch (error) {
      setStatus("Error sending message");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p>Loading messages...</p>;
  if (!messages.length) return <p>No incoming messages yet.</p>;

  return (
    <div>
      <h2>Incoming WhatsApp Messages</h2>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
        >
          <p><strong>From:</strong> {msg.from ?? '[Unknown sender]'}</p>
          <p><strong>Text:</strong> {msg.text?.body ?? '[No text]'}</p>
          <p>
            <small>
              <strong>Timestamp:</strong>{' '}
              {msg.timestamp
                ? new Date(parseInt(msg.timestamp) * 1000).toLocaleString()
                : '[No timestamp]'}
            </small>
          </p>
        </div>
      ))}

      <hr />

      <h3>Send a Message</h3>
      <textarea
        rows={3}
        value={outgoingMsg}
        onChange={(e) => setOutgoingMsg(e.target.value)}
        placeholder={latestSender ? `Send message to ${latestSender}` : 'No recipient available'}
        disabled={!latestSender || sending}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleSend} disabled={!outgoingMsg.trim() || sending || !latestSender}>
        {sending ? "Sending..." : "Send"}
      </button>
      <p>{status}</p>
    </div>
  );
}
