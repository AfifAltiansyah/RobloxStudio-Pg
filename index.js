require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Server AI Bridge (Direct Mode) is Online');
});

app.post('/ai', async (req, res) => {
    console.log("--- Request Baru dari Roblox ---");
    
    if (!API_KEY) {
        return res.status(500).json({ success: false, error: "API Key tidak ditemukan" });
    }

    const { prompt, message } = req.body;
    const input = prompt || message;

    if (!input) {
        return res.status(400).json({ success: false, error: "Prompt kosong" });
    }

    // Kita akan coba v1beta karena lebih fleksibel untuk model baru
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        console.log("Memanggil Gemini API secara langsung via Fetch...");
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ 
                success: false, 
                error: data.error ? data.error.message : "Gagal memanggil API" 
            });
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const answer = data.candidates[0].content.parts[0].text;
            console.log("Berhasil mendapatkan jawaban.");
            res.status(200).json({ success: true, answer: answer });
        } else {
            console.error("Format respon tidak sesuai:", data);
            res.status(500).json({ success: false, error: "Format respon AI tidak dikenal" });
        }

    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Key terdeteksi: ${API_KEY ? "YA" : "TIDAK"}`);
});