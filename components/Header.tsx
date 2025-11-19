import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Your Life in Weeks</h1>
            <p className="mt-2 text-md sm:text-lg max-w-2xl mx-auto theme-text-muted">
                Each square is a week of your life. The past is filled, the present glows, and the future awaits.
            </p>
        </header>
    );
};