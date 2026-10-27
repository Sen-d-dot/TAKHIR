import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // Pastikan path instance axios Anda sudah sesuai

export default function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Mengirim data ke backend
            const response = await API.post('/auth/login', { username, password });

            if (response.data && response.data.success) {
                localStorage.setItem('isAdmin', 'true');
                if (setIsAuthenticated) setIsAuthenticated(true);
                navigate('/admin');
            }
        } catch (err) {
            console.error("Gagal login:", err);
            const errorMsg = err.response?.data?.message || 'Username atau password salah!';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                    <p className="text-xs text-gray-500 mt-1">Silakan masuk untuk mengelola data perusahaan</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Masukkan username"
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Masukkan password"
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg transition text-sm tracking-wider uppercase cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}