// app/api/webhook/route.js

let messages = [];  // In-memory store of incoming messages

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Webhook verification by Meta
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new Response(challenge, { status: 200 });
  }

  // If no verification parameters, return stored messages for frontend
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const body = await request.json();
  console.log('Received webhook event:', JSON.stringify(body, null, 2));

  // Extract incoming WhatsApp messages from webhook payload
  if (body.entry && Array.isArray(body.entry)) {
    body.entry.forEach(entry => {
      if (entry.changes && Array.isArray(entry.changes)) {
        entry.changes.forEach(change => {
          if (change.value && change.value.messages) {
            messages.push(...change.value.messages);
          }
        });
      }
    });
  }

  return new Response('EVENT_RECEIVED', { status: 200 });
}

