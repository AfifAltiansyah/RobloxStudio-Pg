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
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

        // Try different model names as fallbacks
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
        let lastError = null;
        let text = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                const currentModel = genAI.getGenerativeModel({ model: modelName });
                const result = await currentModel.generateContent(inputPrompt);
                const response = await result.response;
                text = response.text();
                if (text) break;
            } catch (err) {
                console.error(`Failed with ${modelName}:`, err.message);
                lastError = err;
            }
        }

        if (text) {
            res.status(200).json({ 
                success: true, 
                answer: text 
            });
        } else {
            throw lastError;
        }
    } catch (error) {
        console.error("All models failed. Last error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message || "Failed to process AI request" 
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
