export async function handler(event, context) {
  const city = event.queryStringParameters.city || "Manila";
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
  try {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
