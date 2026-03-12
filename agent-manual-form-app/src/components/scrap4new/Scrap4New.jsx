import React from 'react';
import { useNavigate } from 'react-router-dom';

function Scrap4New() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
            style={{ backgroundColor: '#f7623b' }}
        >
            <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
                <h1
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ color: '#f7623b' }}
                >
                    Scrap4New
                </h1>
                <p className="text-gray-400 text-base sm:text-lg mb-8">
                    Scrap submission details coming soon.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#f7623b' }}
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );
}

export default Scrap4New;