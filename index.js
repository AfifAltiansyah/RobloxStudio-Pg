const express = require('express');
const app = express();

// Railway sangat sensitif dengan PORT. Kita pastikan mengambil dari env atau default 8080.
const PORT = process.env.PORT || process.env.port || 8080;

app.use(express.json());

// Endpoint sederhana untuk Health Check
app.get('/', (req, res) => {
    res.status(200).send('SERVER_OK');
});

app.get('/ai', (req, res) => {
    res.status(200).json({ status: "ok", endpoint: "/ai" });
});

app.post('/ai', (req, res) => {
    console.log('Request received at /ai');
    res.json({ success: true, data: req.body });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Server is LIVE on port ${PORT}`);
});

// Menangani error jika port sibuk atau masalah lain
server.on('error', (err) => {
    console.error('Server Error:', err);
});