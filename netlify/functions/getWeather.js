import axios from "axios";

export async function handler(event, context) {
  const city = event.queryStringParameters.city || "London";
  const OPENWEATHER_API_KEY = "9bbb8f31a9a1858055b6e1c2b2ba284e";

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(apiUrl);
    const weather = response.data;

    return {
      statusCode: 200,
      body: JSON.stringify({
        city: weather.name,
        temp: weather.main.temp,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed,
        pressure: weather.main.pressure,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch weather data." }),
    };
  }
}
