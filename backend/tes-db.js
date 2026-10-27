const db = require('./src/config/db');

async function testKoneksi() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS hasil');
        console.log('✅ Koneksi ke MySQL VPS Hostinger BERHASIL!');
        console.log('Hasil pengujian query:', rows[0].hasil);
        process.exit(0);
    } catch (error) {
        console.error('❌ Koneksi GAGAL. Terjadi error:', error.message);
        process.exit(1);
    }
}

testKoneksi();