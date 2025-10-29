"use client";

import { useEffect, useState } from "react";
import WebhookViewHistory from "../components/message-invoker";
import SendMessageButton from "../components/send";

export default function WebhookView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (!messages.length) return <p>No incoming messages yet.</p>;

  return (
    <div>
      <WebhookViewHistory />
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
            <SendMessageButton to={msg.from} onSent={() => {}} />
          </p>
        </div>
      ))}
    </div>
  );
}
