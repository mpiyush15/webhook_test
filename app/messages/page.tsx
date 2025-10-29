"use client";

import { useEffect, useState } from "react";

export default function WebhookView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/webhook"); // GET request to your combined webhook route
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Optional: poll every 5 seconds for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (!messages.length) return <p>No incoming messages yet.</p>;

  return (
    
      {messages.map((msg, index) => (
  <div
    key={index}  // unique key required in React lists
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


  );
}
