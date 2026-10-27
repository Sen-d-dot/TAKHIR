const pool = require('../config/db');

// Ambil semua perusahaan
exports.getCompanies = async (req, res) => {
    try {
        let query = `
      SELECT c.*, cat.name as category_name 
      FROM companies c 
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;
        let queryParams = [];

        // Filter berdasarkan kategori
        if (req.query.category) {
            query += ` AND c.category_id = ?`;
            queryParams.push(req.query.category);
        }

        // Filter pencarian
        if (req.query.search) {
            query += ` AND c.name LIKE ?`;
            queryParams.push(`%${req.query.search}%`);
        }

        query += ` ORDER BY c.created_at DESC`;

        const [rows] = await pool.query(query, queryParams);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("ERROR DETAIL GET COMPANIES:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//perusahaan baru
exports.createCompany = async (req, res) => {
    try {
        const { category_id, name, description, website, location } = req.body;

        const [result] = await pool.query(
            `INSERT INTO companies (category_id, name, description, website, location) VALUES (?, ?, ?, ?, ?)`,
            [category_id, name, description, website, location]
        );

        res.status(201).json({
            success: true,
            message: 'Perusahaan berhasil ditambahkan',
            companyId: result.insertId
        });
    } catch (error) {
        console.error("ERROR DETAIL CREATE COMPANY:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Menghapus perusahaan
exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM companies WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan.' });
        }

        res.status(200).json({ success: true, message: 'Perusahaan berhasil dihapus dari direktori.' });
    } catch (error) {
        console.error("Gagal menghapus perusahaan:", error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};