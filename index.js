const express = require('express');
const app = express();

// Railway menyediakan port via process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Log setiap request yang masuk untuk mempermudah debug di Railway
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('<h1>Server Railway Aktif</h1><p>Status: Running</p>');
});

app.get('/ai', (req, res) => {
    res.status(200).json({ 
        status: "online", 
        message: "Endpoint AI siap menerima POST request" 
    });
});

app.post('/ai', (req, res) => {
    console.log('Data diterima:', req.body);
    res.status(200).json({
        success: true,
        message: "Data berhasil diterima oleh Railway",
        timestamp: new Date().toISOString()
    });
});

// Penting: Bind ke 0.0.0.0 agar bisa diakses dari luar container
app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`Server berhasil dijalankan!`);
    console.log(`Port: ${PORT}`);
    console.log(`URL: https://roblox-ai-bridge.up.railway.app`);
    console.log(`-----------------------------------------`);
});
