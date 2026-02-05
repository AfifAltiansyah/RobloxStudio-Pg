require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// Inisialisasi Gemini API
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is not set in environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Bridge Server is Running');
});

app.post('/ai', async (req, res) => {
    try {
        const { prompt, message } = req.body;
        const inputPrompt = prompt || message;

        if (!inputPrompt) {
            return res.status(400).json({ error: "Prompt or message is required" });
        }

        if (!API_KEY) {
            return res.status(500).json({ 
                success: false, 
                error: "GEMINI_API_KEY is missing on server" 
            });
        }

        console.log("Processing input:", inputPrompt);

        const result = await model.generateContent(inputPrompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ 
            success: true, 
            answer: text 
        });
    } catch (error) {
        console.error("Error calling Gemini:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message || "Failed to process AI request" 
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
