require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const companyRoutes = require('./routes/companyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

app.use('/api/companies', companyRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/categories', categoryRoutes);

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.status(200).json({ 
            success: true, 
            message: "Login berhasil!",
            user: { username: 'admin' }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: "Username atau password salah!" 
        });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, whatsapp, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Nama, email, dan pesan wajib diisi!" 
            });
        }

        const db = require('./config/db');
        await db.query(
            "INSERT INTO contacts (name, email, whatsapp, message) VALUES (?, ?, ?, ?)",
            [name, email, whatsapp || '', message]
        );

        res.status(200).json({ 
            success: true, 
            message: "Pesan berhasil dikirim!" 
        });
    } catch (err) {
        console.error("Gagal simpan pesan ke database:", err);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan pada server database." 
        });
    }
});

app.get('/api/contact', async (req, res) => {
    try {
        const db = require('./config/db');
        const [rows] = await db.query("SELECT * FROM contacts WHERE created_at >= NOW() - INTERVAL 15 DAY ORDER BY created_at DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("Gagal ambil data contact:", err);
        res.status(500).json({ success: false, message: "Gagal memuat pesan." });
    }
});

app.delete('/api/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = require('./config/db');
        await db.query("DELETE FROM contacts WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Pesan berhasil dihapus." });
    } catch (err) {
        console.error("Gagal hapus pesan:", err);
        res.status(500).json({ success: false, message: "Gagal menghapus pesan." });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'API Company Directory Berjalan dengan Baik!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});