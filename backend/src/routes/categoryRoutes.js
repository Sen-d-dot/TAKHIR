const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("ERROR DETAIL DI CATEGORY ROUTES:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;