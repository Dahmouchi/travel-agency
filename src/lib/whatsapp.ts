const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Helper to clean phone numbers (Meta API wants digits only)
const formatPhone = (phone: string) => phone.replace(/\D/g, "");

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error(
      "WhatsApp configuration missing: WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN"
    );
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formatPhone(to),
        type: "text",
        text: { body: message },
      }),
    }
  );

  const data = await response.json();
  if (response.ok) {
    console.log("✅ WhatsApp message sent successfully:", data);
  } else {
    console.error("❌ Failed to send WhatsApp message:", data);
  }

  return { ok: response.ok, data };
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string = "en_US"
) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error("WhatsApp configuration missing");
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formatPhone(to),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      }),
    }
  );

  const data = await response.json();
  if (response.ok) {
    console.log(`✅ WhatsApp template "${templateName}" sent:`, data);
  } else {
    console.error(`❌ Failed to send WhatsApp template "${templateName}":`, data);
  }

  return { ok: response.ok, data };
}

