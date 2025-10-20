import axios from "axios";

const OPENWEATHER_API_KEY = "9bbb8f31a9a1858055b6e1c2b2ba284e";

export async function handler(event, context) {
  const city = event.queryStringParameters.city || "London";
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    return {
      statusCode: 200,
      body: JSON.stringify({
        city: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure
      }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Weather API Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch weather data." }),
      headers: { "Content-Type": "application/json" }
    };
  }
}
