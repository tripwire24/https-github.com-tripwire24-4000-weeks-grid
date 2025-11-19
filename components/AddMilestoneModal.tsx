import React, { useState, useEffect } from 'react';

interface AddMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, date: string) => void;
    initialDate: string;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ isOpen, onClose, onAdd, initialDate }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(initialDate);

    useEffect(() => {
        if (isOpen) {
            setDate(initialDate);
            setName('');
        }
    }, [isOpen, initialDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && date) {
            onAdd(name, date);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity px-4">
            <div className="theme-card w-full max-w-sm p-6 rounded-xl shadow-2xl transform transition-all scale-100 border animate-fade-in">
                 <style>{`
                    @keyframes fadeInModal {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fadeInModal 0.2s ease-out forwards;
                    }
                `}</style>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Add Event</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 theme-text-muted">Event Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded bg-[var(--bg-page)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
                            placeholder="e.g., Graduation, First Job"
                            autoFocus
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 theme-text-muted">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border rounded bg-[var(--bg-page)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded border border-[var(--border-color)] hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--text-main)' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium rounded theme-btn-primary shadow-sm transition-transform active:scale-95"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
