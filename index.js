const express = require('express');
const app = express();

// Pastikan PORT benar-benar diambil dari Railway
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Logger sederhana
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health Check Root
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Endpoint AI
app.get('/ai', (req, res) => {
    res.status(200).json({ status: "alive" });
});

app.post('/ai', (req, res) => {
    res.status(200).json({ success: true, received: req.body });
});

// Bind ke 0.0.0.0 adalah WAJIB di Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
