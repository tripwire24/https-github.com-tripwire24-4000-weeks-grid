import React, { useState } from 'react';

interface DobModalProps {
    onSubmit: (dob: string) => void;
}

export const DobModal: React.FC<DobModalProps> = ({ onSubmit }) => {
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date) {
            onSubmit(date);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
            <div className="theme-card p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4 transform transition-all">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Welcome</h2>
                <p className="mb-6 theme-text-muted">Enter your date of birth to visualize your life in weeks.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border rounded-lg text-lg focus:ring-2 focus:ring-[var(--accent)] bg-[var(--bg-page)] text-[var(--text-main)] border-[var(--border-color)]"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg font-bold shadow-md transition-transform transform active:scale-95 theme-btn-primary"
                    >
                        Start My Grid
                    </button>
                </form>
            </div>
        </div>
    );
};