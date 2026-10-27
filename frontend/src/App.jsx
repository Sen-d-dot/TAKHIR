import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import SuggestionForm from './pages/SuggestionForm';
import Login from './pages/Login';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAdmin') === 'true'
    );

    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-blue-950 text-gray-900">
                <Navbar />
                <main className="flex-grow flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/suggest" element={<SuggestionForm />} />
                        <Route 
                            path="/login" 
                            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                isAuthenticated ? (
                                    <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            } 
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}