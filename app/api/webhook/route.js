const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let messages = [];  // In-memory store for incoming + outgoing messages

async function sendWhatsAppMessage(to, text) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to,
    text: { body: text }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("Failed to send message:", await res.text());
    throw new Error("WhatsApp API send message failed");
  }

  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Meta webhook verification
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new Response(challenge, { status: 200 });
  }

  // Return stored messages to frontend
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const body = await request.json();
  console.log('Received webhook event:', JSON.stringify(body, null, 2));

  if (body.entry && Array.isArray(body.entry)) {
    for (const entry of body.entry) {
      if (entry.changes && Array.isArray(entry.changes)) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const msg of change.value.messages) {
              messages.push(msg); // Store incoming message

              // Send reply
              const from = msg.from;
              const replyText = "Thanks for your message!";

              try {
                await sendWhatsAppMessage(from, replyText);
                // Store outgoing reply message
                messages.push({
                  from: PHONE_NUMBER_ID,
                  text: { body: replyText },
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                });
              } catch (error) {
                console.error("Failed to send reply message:", error);
              }
            }
          }
        }
      }
    }
  }

  return new Response('EVENT_RECEIVED', { status: 200 });
}
