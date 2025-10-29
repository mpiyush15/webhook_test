const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

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
    const errorMsg = await res.text();
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function POST(request) {
  try {
    const { to, text } = await request.json();
    if (!to || !text) {
      return new Response("Missing 'to' or 'text'", { status: 400 });
    }
    const result = await sendWhatsAppMessage(to, text);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
