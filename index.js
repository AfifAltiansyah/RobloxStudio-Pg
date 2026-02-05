require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
// Railway secara otomatis memberikan PORT, jika tidak ada gunakan 8080
const PORT = process.env.PORT || 8080;

// Ambil API Key dan bersihkan dari spasi/newline
const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

app.use(express.json());

// Logger untuk setiap request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Endpoint Health Check (Penting untuk Railway)
app.get('/', (req, res) => {
    res.status(200).send('Server AI Bridge is Online');
});

app.post('/ai', async (req, res) => {
    console.log("Menerima request dari Roblox...");
    
    if (!API_KEY) {
        console.error("ERROR: GEMINI_API_KEY tidak ditemukan di environment variables!");
        return res.status(500).json({ 
            success: false, 
            error: "API Key belum diset di Railway" 
        });
    }

    const { prompt, message } = req.body;
    const input = prompt || message;

    if (!input) {
        return res.status(400).json({ success: false, error: "Prompt kosong" });
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // Memaksa penggunaan apiVersion 'v1' karena v1beta sering 404
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );
        
        console.log(`Meminta jawaban dari Gemini untuk: "${input.substring(0, 20)}..."`);
        
        const result = await model.generateContent(input);
        const text = result.response.text();
        
        console.log("Gemini berhasil merespon.");
        res.status(200).json({ 
            success: true, 
            answer: text 
        });
    } catch (error) {
        console.error("GEMINI ERROR:", error.message);
        
        // Memberikan detail error ke Roblox agar kita tahu masalahnya
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Error handling global
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`Server berjalan di Port: ${PORT}`);
    console.log(`Status API Key: ${API_KEY ? "TERPASANG (OK)" : "TIDAK ADA (ERROR)"}`);
    if (API_KEY) {
        console.log(`Key Prefix: ${API_KEY.substring(0, 4)}****`);
    }
    console.log(`-----------------------------------------`);
});
