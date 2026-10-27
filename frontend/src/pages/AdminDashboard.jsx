import { useState, useEffect } from 'react';
import API from '../services/api';

export default function AdminDashboard({ setIsAuthenticated }) {
    const [submissions, setSubmissions] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadData = async () => {
        try {
            const sub = await API.get('/submissions');
            const comp = await API.get('/companies');
            const cont = await API.get('/contact');
            
            setSubmissions(sub.data.data || sub.data || []);
            setCompanies(comp.data.data || comp.data || []);
            setContacts(cont.data.data || cont.data || []);
        } catch (err) {
            console.error("Gagal ambil data:", err);
        }
    };

// Load data 
    useEffect(() => { 
        loadData();
//Auto refresh
        const interval = setInterval(() => {
            loadData();
        }, 10000);

        return () => clearInterval(interval); 
    }, []);

    //Reset halaman ke halaman 1
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    const handleApprove = async (id) => {
        try {
            const res = await API.patch(`/submissions/${id}/approve`);
            alert(res.data.message || "Disetujui");
            loadData();
        } catch (err) { alert("Gagal menyetujui"); }
    };

    const handleReject = async (id) => {
        if (window.confirm("Tolak usulan ini?")) {
            try {
                const res = await API.patch(`/submissions/${id}/reject`);
                alert(res.data.message || "Ditolak");
                loadData();
            } catch (err) { alert("Gagal menolak"); }
        }
    };

    const handleDelete = async (id, type = 'company') => {
        const confirmMsgs = {
            submission: "Hapus data usulan ini dari database?",
            company: "Hapus perusahaan dari beranda?",
            message: "Hapus pesan masuk ini?"
        };
            
        if (window.confirm(confirmMsgs[type] || "Hapus data ini?")) {
            try {
                if (type === 'submission') {
                    await API.delete(`/submissions/${id}`);
                } else if (type === 'message') {
                    await API.delete(`/contact/${id}`);
                } else {
                    await API.delete(`/companies/${id}`);
                }
                alert("Berhasil dihapus");
                loadData();
            } catch (err) { alert("Gagal menghapus"); }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        if (setIsAuthenticated) setIsAuthenticated(false);
        window.location.href = '/login';
    };

    // Filter pesan yang usianya <= 15 hari
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const validContacts = contacts.filter(msg => new Date(msg.created_at) >= fifteenDaysAgo);

    let rawData = [];
    if (filter === 'messages') {
        rawData = validContacts;
    } else if (filter === 'all') {
        rawData = companies;
    } else {
        rawData = submissions.filter(s => s.status === filter);
    }
    
    const data = rawData.filter(item => {
        const targetName = filter === 'messages' ? item.name : (filter === 'all' ? item.name : item.company_name);
        return targetName && targetName.toLowerCase().includes(search.toLowerCase());
    });

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    return (
        <div 
            className="min-h-screen bg-blue-950 bg-cover bg-center bg-fixed py-6 px-4 md:py-10 md:px-6"
            style={{ backgroundImage: "url('/logo2.jpg')" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-lg"
                    >
                        Logout
                    </button>
                </div>

                <div 
                    className="rounded-2xl shadow-2xl p-4 md:p-6 backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            {['all', 'pending', 'approved', 'rejected', 'messages'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm capitalize transition cursor-pointer ${
                                        filter === tab ? 'bg-blue-950 text-white shadow' : 'bg-white/80 text-gray-700 hover:bg-white'
                                    }`}
                                >
                                    {tab === 'all' ? 'Semua Perusahaan' : tab === 'messages' ? `Pesan Masuk (${validContacts.length})` : tab}
                                </button>
                            ))}
                        </div>

                        <input 
                            type="text" 
                            placeholder={filter === 'messages' ? "Cari nama pengirim..." : "Cari nama perusahaan..."} 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300/80 rounded-xl px-4 py-2 text-sm bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-950 w-full md:w-64 shadow-sm"
                        />
                    </div>

                    {/* TABEL DATA */}
                    <div className="rounded-xl overflow-hidden border border-gray-200/80 bg-white/90 shadow-sm">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-gray-100/90 border-b border-gray-200 text-gray-800">
                                {filter === 'messages' ? (
                                    <tr>
                                        <th className="p-3">Waktu</th>
                                        <th className="p-3">Nama Pengirim</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">No WhatsApp</th>
                                        <th className="p-3">Pesan</th>
                                        <th className="p-3 text-center">Aksi</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="p-3">Nama Pengusul</th>
                                        <th className="p-3">Nama Perusahaan</th>
                                        <th className="p-3">Kategori</th>
                                        <th className="p-3">Bergerak di bidang</th>
                                        <th className="p-3">Gmaps</th>
                                        <th className="p-3">Website</th>
                                        <th className="p-3">Email Pengusul</th>
                                        {filter !== 'all' && <th className="p-3">Status</th>}
                                        <th className="p-3 text-center">Aksi</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-gray-200/60">
                                {currentData.length > 0 ? (
                                    currentData.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-white/60">
                                            {filter === 'messages' ? (
                                                <>
                                                    <td className="p-3 text-gray-500 text-xs">{new Date(item.created_at).toLocaleString()}</td>
                                                    <td className="p-3 font-semibold text-gray-900">{item.name}</td>
                                                    <td className="p-3 text-gray-700">{item.email}</td>
                                                    <td className="p-3 text-gray-700">{item.whatsapp || '-'}</td>
                                                    <td className="p-3 text-gray-700 max-w-xs truncate" title={item.message}>{item.message}</td>
                                                    <td className="p-3 text-center">
                                                        <button onClick={() => handleDelete(item.id, 'message')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shadow">Hapus</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="p-3 text-gray-700 font-medium">{item.user_name || '-'}</td>
                                                    <td className="p-3 font-semibold text-gray-900">{filter === 'all' ? item.name : item.company_name}</td>
                                                    <td className="p-3 text-gray-700">{item.category_name || '-'}</td>
                                                    <td className="p-3 text-gray-700">{item.description}</td>
                                                    <td className="p-3">
                                                        {item.gmaps || item.website ? <a href={item.gmaps || item.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">Maps</a> : '-'}
                                                    </td>
                                                    <td className="p-3">
                                                        {item.website ? <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">Link</a> : '-'}
                                                    </td>
                                                    <td className="p-3 text-gray-700 text-xs font-mono">{item.user_email || '-'}</td>
                                                    {filter !== 'all' && (
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase inline-block ${
                                                                item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="p-3 text-center">
                                                        {filter === 'all' ? (
                                                            <button onClick={() => handleDelete(item.id, 'company')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shadow">Hapus</button>
                                                        ) : filter === 'rejected' || filter === 'approved' ? (
                                                            <button onClick={() => handleDelete(item.id, 'submission')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shadow">Hapus</button>
                                                        ) : (
                                                            item.status === 'pending' ? (
                                                                <div className="flex justify-center gap-1.5">
                                                                    <button onClick={() => handleApprove(item.id)} className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer shadow">Setuju</button>
                                                                    <button onClick={() => handleReject(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer shadow">Tolak</button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-xs">Selesai</span>
                                                            )
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={filter === 'messages' ? 6 : (filter === 'all' ? 8 : 9)} className="text-center p-6 text-gray-600">Tidak ada data yang ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginasi */}
                    {data.length > itemsPerPage && (
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300/80">
                            <span className="text-xs text-gray-700 font-medium">
                                Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} data
                            </span>
                            <div className="flex gap-2">
                                <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentPage === 1 ? 'bg-gray-300/50 text-gray-400 cursor-not-allowed' : 'bg-blue-950 text-white cursor-pointer'}`}>Previous</button>
                                <span className="flex items-center text-xs font-bold px-2 text-gray-800">{currentPage} / {totalPages}</span>
                                <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentPage === totalPages ? 'bg-gray-300/50 text-gray-400 cursor-not-allowed' : 'bg-blue-950 text-white cursor-pointer'}`}>Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}