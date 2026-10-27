import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/Logo.png'; 

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 px-6 py-3 shadow-md ${
            isScrolled
                ? 'bg-white/70 backdrop-blur-md text-blue-900 shadow-sm border-b border-gray-200'
                : 'bg-blue-900 text-white'
        }`}>
            <div className="max-w-1000px mx-auto flex justify-between items-center">
                
                
                <Link to="/" className="flex items-center gap-2 relative h-12 w-32 md:w-40">
                    <img 
                        src={logoImage} 
                        alt="Cimahi Company Directory Logo" 
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-16 md:h-20 w-auto object-contain transition-all duration-300 z-20 ${
                            isScrolled ? 'brightness-90 contrast-125' : 'brightness-110'
                        }`}
                    />
                </Link>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`focus:outline-none p-2 rounded transition cursor-pointer ${
                        isScrolled ? 'hover:bg-gray-200/50' : 'hover:bg-blue-900'
                    }`}
                    aria-label="Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            
            {isOpen && (
                <div className={`absolute top-full right-6 w-48 shadow-xl border py-3 px-4 flex flex-col rounded-lg ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md border-gray-200 text-gray-800'
                        : 'bg-blue-950/95 backdrop-blur-md border-blue-900 text-white'
                }`}>
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="font-medium py-1 transition text-sm hover:opacity-75"
                    >
                        Beranda
                    </Link>
                    <Link
                        to="/suggest"
                        onClick={() => setIsOpen(false)}
                        className="font-medium py-1 transition text-sm hover:opacity-75"
                    >
                        Usulkan Perusahaan
                    </Link>
                </div>
            )}
        </nav>
    );
}