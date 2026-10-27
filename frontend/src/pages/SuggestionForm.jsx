import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Submission() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        user_name: '',
        user_email: '',
        company_name: '',
        category_id: '',
        gmaps: '',
        website: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get('/categories')
            .then(res => setCategories(res.data.data || res.data))
            .catch(err => console.error("Gagal memuat kategori:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/submissions', form);
            if (response.data && response.data.success) {
                alert("Usulan perusahaan berhasil dikirim! Menunggu persetujuan admin.");
                setForm({
                    user_name: '',
                    user_email: '',
                    company_name: '',
                    category_id: '',
                    gmaps: '',
                    website: '',
                    description: ''
                });
            }
        } catch (err) {
            console.error("Gagal mengirim usulan:", err);
            alert("Terjadi kesalahan saat mengirim usulan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen bg-blue-950 bg-cover bg-center bg-fixed py-6 px-4 md:py-10 md:px-6 flex items-center justify-center"
            style={{ backgroundImage: "url('/the-historich.jpg')" }}
        >
            <div 
                className="w-full max-w-[800px] rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-md border border-white/20"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-wide">Usulkan Perusahaan</h2>
                    <p className="text-xs text-gray-600 mt-1">Masukkan data perusahaan yang ingin Anda usulkan untuk dimasukkan ke dalam direktori.</p>
                    <div className="h-1 w-12 bg-blue-950 mx-auto mt-2 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Nama Pengusul</label>
                            <input 
                                type="text" 
                                value={form.user_name}
                                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                                required
                                placeholder="Nama Anda"
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Email Pengusul</label>
                            <input 
                                type="email" 
                                value={form.user_email}
                                onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                                required
                                placeholder="email@domain.com"
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Nama Perusahaan</label>
                            <input 
                                type="text" 
                                value={form.company_name}
                                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                required
                                placeholder="PT Contoh Indonesia"
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Kategori</label>
                            <select 
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                required
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Link Gmaps</label>
                            <input 
                                type="url" 
                                value={form.gmaps}
                                onChange={(e) => setForm({ ...form, gmaps: e.target.value })}
                                placeholder="https://maps.google.com/..."
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Link Website</label>
                            <input 
                                type="url" 
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                                placeholder="https://perusahaan.com"
                                className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Bergerak di bidang / Deskripsi</label>
                        <textarea 
                            rows="3"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            placeholder="Jelaskan bidang usaha perusahaan..."
                            className="w-full border border-gray-300/80 rounded-xl px-4 py-2.5 text-sm bg-white/90 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                        ></textarea>
                    </div>

                    <div className="text-center pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition text-sm tracking-wider uppercase cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Usulan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}