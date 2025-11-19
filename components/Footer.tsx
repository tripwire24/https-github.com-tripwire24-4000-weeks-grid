import React from 'react';

interface FooterProps {
    onShare: () => void;
    onExport: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode, icon: React.ReactNode }> = ({ onClick, children, icon }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-transparent rounded-md shadow-sm theme-btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
        {icon}
        {children}
    </button>
);

export const Footer: React.FC<FooterProps> = ({ onShare, onExport }) => {
    return (
        <footer className="w-full max-w-7xl text-center mt-6 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>What will fill your next square?</p>
            <div className="flex justify-center items-center gap-4">
                <ActionButton onClick={onShare} icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                }>
                    Share Link
                </ActionButton>
                <ActionButton onClick={onExport} icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                }>
                    Export PNG
                </ActionButton>
            </div>
        </footer>
    );
};