import { useState } from 'react';
import API from '../services/api';

export default function ContactUs() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        whatsapp: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/contact', form);
            
            if (response.data && response.data.success) {
                alert("Pesan berhasil dikirim! Terima kasih telah menghubungi kami.");
                setForm({ name: '', email: '', whatsapp: '', message: '' });
            }
        } catch (err) {
            console.error("Gagal mengirim pesan:", err);
            const errorMsg = err.response?.data?.message || "Terjadi kesalahan pada server.";
            alert("Gagal mengirim pesan:\n" + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="w-full rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-md border border-white/30 transition-all duration-300"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-wide">Hubungi Kami</h2>
                <div className="h-1 w-12 bg-blue-950 mx-auto mt-2 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 text-center uppercase tracking-wider">Nama</label>
                        <input 
                            type="text" 
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="Nama Anda"
                            className="w-full border border-gray-300/80 rounded-xl px-4 py-3 text-sm bg-white/90 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 text-center uppercase tracking-wider">Email</label>
                        <input 
                            type="email" 
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            placeholder="email@domain.com"
                            className="w-full border border-gray-300/80 rounded-xl px-4 py-3 text-sm bg-white/90 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 text-center uppercase tracking-wider">No WhatsApp</label>
                        <input 
                            type="text" 
                            value={form.whatsapp}
                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            placeholder="08xxxxxxxxxx"
                            className="w-full border border-gray-300/80 rounded-xl px-4 py-3 text-sm bg-white/90 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 text-center uppercase tracking-wider">Pesan</label>
                    <textarea 
                        rows="4"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                        className="w-full border border-gray-300/80 rounded-xl px-4 py-3 text-sm bg-white/90 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white transition resize-none"
                    ></textarea>
                </div>

                <div className="text-center pt-3">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto bg-blue-600 hover:bg-amber-500 text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-all duration-200 text-sm tracking-wider uppercase cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                </div>
            </form>
        </div>
    );
}