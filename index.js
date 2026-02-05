const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server RobloxStudio-Pg Berhasil Berjalan!');
});

app.get('/ai', (req, res) => {
    res.json({ message: "Endpoint AI aktif. Gunakan POST untuk mengirim data." });
});

app.post('/ai', express.json(), (req, res) => {
    try {
        console.log('AI Request received:', req.body);
        res.json({
            message: "AI Bridge is active",
            status: "success",
            receivedData: req.body
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});