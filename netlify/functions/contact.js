export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("[CONTACT FORM]", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Submission received!" }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request data" }),
      headers: { "Content-Type": "application/json" }
    };
  }
}
