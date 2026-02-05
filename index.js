require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Bridge Server is Running');
});

app.post('/ai', async (req, res) => {
    console.log("Request received from Roblox");
    
    if (!API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing");
        return res.status(500).json({ success: false, error: "API Key missing on server" });
    }

    const { prompt, message } = req.body;
    const input = prompt || message;

    if (!input) {
        return res.status(400).json({ success: false, error: "No prompt provided" });
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Kembali ke cara paling standar
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("Calling Google Gemini API...");
        const result = await model.generateContent(input);
        const text = result.response.text();
        
        console.log("Success! Sending response to Roblox");
        res.status(200).json({ success: true, answer: text });
    } catch (error) {
        console.error("Gemini Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
    if (!API_KEY) console.log("WARNING: GEMINI_API_KEY is not set!");
});