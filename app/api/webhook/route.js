// app/api/webhook/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Your secret verification token

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new Response(challenge, { status: 200 });
  }
  return new Response('Verification failed', { status: 403 });
}

export async function POST(request) {
  const body = await request.json();
  console.log('Received webhook event:', JSON.stringify(body, null, 2));

  // Add your webhook event processing logic here

  return new Response('EVENT_RECEIVED', { status: 200 });
}
