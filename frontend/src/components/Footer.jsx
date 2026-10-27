import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full text-white py-12 px-6 mt-16 border-t border-blue-900/80 bg-blue-950 relative overflow-hidden shadow-inner">
            
            <div className="absolute inset-0 opacity-25 bg-radial-gradient(circle_at_25%_25%,_#1e40af_0%,_transparent_60%),radial-gradient(circle_at_75%_75%,_#1e3a8a_0%,_transparent_55%) pointer-events-none"></div>
            <div className="absolute inset-0 opacity-15 bg-linear-gradient(30deg,#3b82f6_1px,transparent_1px),linear-gradient(-30deg,#3b82f6_1px,transparent_1px) bg-size:3rem_3rem pointer-events-none"></div>

            <div className="max-w-1000px mx-auto text-center space-y-3 relative z-10">
                <p className="text-xs md:text-sm font-semibold tracking-wider text-blue-100 uppercase">
                    Cimahi Company Directories - Created By Husein
                </p>
                
                <div className="w-16 h-0.5 bg-blue-500/60 mx-auto rounded-full my-2"></div>

                <p className="text-xs md:text-sm text-gray-300">
                    &copy; 2026 Company Directory Web Application. All rights reserved.
                </p>
                
                <p className="text-xs text-blue-300 font-medium pt-1">
                    Email: .......@gmail.com <span className="mx-2 text-gray-500">|</span> WhatsApp: +62 000-0000-000
                </p>
            </div>
        </footer>
    );
}