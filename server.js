// --- Server Setup ---
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// IMPORTANT: Replace this with your actual OpenWeatherMap API Key
const OPENWEATHER_API_KEY = '9bbb8f31a9a1858055b6e1c2b2ba284e'; 

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ✅ Explicit root route (fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// --- Endpoint 1: API Proxy for Weather Data (GET request) ---
// This endpoint is the target for k6 testing on external API interaction
app.get('/api/weather', async (req, res) => {
    const city = req.query.city || 'London';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    console.log(`[API] Fetching weather for: ${city}`);
   
    try {
        // Fetch data from OpenWeatherMap
        const response = await axios.get(apiUrl);
        // Respond with only the necessary data
        res.json({
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            pressure: response.data.main.pressure 
        });
    } catch (error) {
        console.error('Weather API Error:', error.response ? error.response.data : error.message);
        // Use 503 if the external API is failing, or 404 if city not found
        const statusCode = error.response && error.response.status === 404 ? 404 : 500;
        res.status(statusCode).json({ error: 'Could not fetch weather data. Check city name or API status.' });
    }
});

// --- Endpoint 2: Form Submission (POST request) ---
// This endpoint is the target for k6 testing on POST submission logic
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // In a real application, you would save this data to a database.
    console.log(`[FORM SUBMISSION] New Contact Form Received:`);
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Message: ${message}`);

    // Simulate successful processing
    // Redirect to the homepage after submission to avoid re-submission on refresh
    res.redirect('/?submission=success');
});

// --- Fallback route for unmatched requests ---
// Helps avoid "Cannot GET /" when navigating client-side routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicPath, 'index.html'));
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Serving static files from: ${publicPath}`);
    console.log(`Static Pages: / and /contact.html`);
    console.log(`API Endpoint: /api/weather?city=YourCity`);
    console.log(`Form Endpoint (POST): /submit-contact`);
});
