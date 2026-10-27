-- 1. Tabel Admin/Users
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL, -- Disimpan dalam bentuk hash (bcrypt)
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Kategori
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            slug VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabel Perusahaan (Daftar Utama)
CREATE TABLE companies (
                           id SERIAL PRIMARY KEY,
                           category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                           name VARCHAR(150) NOT NULL,
                           description TEXT,
                           website VARCHAR(255),
                           location VARCHAR(150),
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Submissions (Rekomendasi dari User)
CREATE TABLE submissions (
                             id SERIAL PRIMARY KEY,
                             user_name VARCHAR(100) NOT NULL,
                             user_email VARCHAR(100) NOT NULL,
                             company_name VARCHAR(150) NOT NULL,
                             category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                             description TEXT,
                             website VARCHAR(255),
                             status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Masukkan Data Contoh Kategori (Sesuai kolom DDL: name & slug)
INSERT INTO categories (name, slug) VALUES
                                        ('Teknologi', 'teknologi'),
                                        ('Kuliner & F&B', 'kuliner-fnb'),
                                        ('Keuangan & Fintech', 'keuangan-fintech');

-- 6. Masukkan Data Contoh Perusahaan (Sesuai kolom DDL: category_id, name, description, website, location)
INSERT INTO companies (category_id, name, description, website, location) VALUES
                                                                              (1, 'Tech Innovators Indonesia', 'Penyedia solusi cloud computing dan enterprise software.', 'https://example.com', 'Jakarta'),
                                                                              (2, 'Kopi Nusantara Jaya', 'Jaringan kedai kopi lokal dengan cita rasa biji kopi pilihan.', 'https://example.com', 'Bandung'),
                                                                              (3, 'Dompet Kilat Fintech', 'Layanan pembayaran digital cepat dan aman untuk UMKM.', 'https://example.com', 'Surabaya');