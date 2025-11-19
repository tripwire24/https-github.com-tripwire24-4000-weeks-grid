
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-8 flex flex-col items-center gap-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Your Life in Weeks</h1>
                <p className="mt-2 text-md sm:text-lg max-w-2xl mx-auto theme-text-muted">
                    Each square is a week of your life. The past is filled, the present glows, and the future awaits.
                </p>
            </div>

            <div className="flex flex-col items-center gap-3 animate-fade-in">
                 <style>{`
                    @keyframes fadeInImage {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fadeInImage 0.8s ease-out forwards;
                    }
                `}</style>
                <a 
                    href="https://www.amazon.com/Four-Thousand-Weeks-Management-Mortals/dp/0374159122" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group relative"
                >
                    <img 
                        src="/book-cover.jpg" 
                        alt="Four Thousand Weeks by Oliver Burkeman" 
                        className="w-32 sm:w-36 rounded shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                        onError={(e) => {
                            // Fallback if local image isn't found yet
                            e.currentTarget.src = "https://m.media-amazon.com/images/I/8125+5E4wLL._SL1500_.jpg";
                        }}
                    />
                </a>
                <p className="text-sm italic max-w-sm theme-text-muted leading-relaxed">
                    Based on Oliver Burkeman's "Four Thousand Weeks" — a guide to embracing your limits and finding meaning in a finite life.
                </p>
            </div>
        </header>
    );
};
