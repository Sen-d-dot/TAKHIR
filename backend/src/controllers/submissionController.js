const db = require('../config/db');

// 1. Ambil Semua Usulan (Untuk Admin Dashboard)
exports.getSubmissions = async (req, res) => {
    try {
        const query = `
            SELECT s.*, cat.name as category_name
            FROM submissions s
            LEFT JOIN categories cat ON s.category_id = cat.id
            ORDER BY s.id DESC
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Kirim Usulan Baru (Sistem Fallback Multiprogresif Lengkap)
exports.createSubmission = async (req, res) => {
    try {
        const { user_name, user_email, company_name, category_id, website, description } = req.body;
        const maps_link = req.body.gmaps || req.body.location || req.body.link_gmaps || req.body.link_maps || '';

        try {
            const queryLocation = `
                INSERT INTO submissions (user_name, user_email, company_name, category_id, location, website, description, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            `;
            await db.query(queryLocation, [user_name, user_email, company_name, category_id, maps_link, website, description]);
            return res.status(201).json({ success: true, message: 'Usulan berhasil dikirim!' });
        } catch (err1) {
            try {
                const queryGmaps = `
                    INSERT INTO submissions (user_name, user_email, company_name, category_id, gmaps, website, description, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                `;
                await db.query(queryGmaps, [user_name, user_email, company_name, category_id, maps_link, website, description]);
                return res.status(201).json({ success: true, message: 'Usulan berhasil dikirim!' });
            } catch (err2) {
                try {
                    const queryLinkGmaps = `
                        INSERT INTO submissions (user_name, user_email, company_name, category_id, link_gmaps, website, description, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                    `;
                    await db.query(queryLinkGmaps, [user_name, user_email, company_name, category_id, maps_link, website, description]);
                    return res.status(201).json({ success: true, message: 'Usulan berhasil dikirim!' });
                } catch (err3) {
                    try {
                        const queryLinkMaps = `
                            INSERT INTO submissions (user_name, user_email, company_name, category_id, link_maps, website, description, status)
                            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                        `;
                        await db.query(queryLinkMaps, [user_name, user_email, company_name, category_id, maps_link, website, description]);
                        return res.status(201).json({ success: true, message: 'Usulan berhasil dikirim!' });
                    } catch (err4) {
                        const queryGoogleMaps = `
                            INSERT INTO submissions (user_name, user_email, company_name, category_id, google_maps, website, description, status)
                            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                        `;
                        await db.query(queryGoogleMaps, [user_name, user_email, company_name, category_id, maps_link, website, description]);
                        return res.status(201).json({ success: true, message: 'Usulan berhasil dikirim!' });
                    }
                }
            }
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, mysqlError: err.sqlMessage });
    }
};

// 3. Setujui Usulan (Approve)
exports.approveSubmission = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const { id } = req.params;

        const [subRows] = await connection.query('SELECT * FROM submissions WHERE id = ?', [id]);
        if (!subRows || subRows.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Usulan tidak ditemukan' });
        }

        const sub = subRows[0];
        const maps_link = sub.gmaps || sub.location || sub.link_gmaps || sub.link_maps || sub.google_maps || '';

        const insertQuery = `
            INSERT INTO companies (name, category_id, description, website, location)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(insertQuery, [sub.company_name, sub.category_id, sub.description, sub.website, maps_link]);

        await connection.query("UPDATE submissions SET status = 'approved' WHERE id = ?", [id]);

        await connection.commit();
        connection.release();
        res.json({ success: true, message: 'Usulan berhasil disetujui dan masuk ke beranda!' });
    } catch (err) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Tolak Usulan (Reject) - Diperbaiki untuk mengambil baris pertama query mysql secara aman
exports.rejectSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE submissions SET status = 'rejected' WHERE id = ?";
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Data usulan tidak ditemukan.' });
        }
        res.json({ success: true, message: 'Usulan berhasil ditolak.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, mysqlError: err.sqlMessage });
    }
};

// 5. Hapus Usulan yang Ditolak (Delete Submission)
exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM submissions WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usulan berhasil dihapus dari database' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
