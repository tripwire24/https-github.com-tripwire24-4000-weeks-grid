import React from 'react';

interface CountersProps {
    weeksLived: number;
    weeksRemaining: number;
    percentageComplete: number;
    daysToNextBirthday: number;
}

const CounterBlock: React.FC<{ value: string; label: string; ariaLabel: string }> = ({ value, label, ariaLabel }) => (
    <div className="text-center" role="status" aria-live="polite" aria-label={ariaLabel}>
        <p className="text-4xl md:text-5xl font-bold tracking-tighter" style={{ color: 'var(--text-main)' }}>{value}</p>
        <p className="text-sm uppercase tracking-wider theme-text-muted">{label}</p>
    </div>
);

export const Counters: React.FC<CountersProps> = ({ weeksLived, weeksRemaining, percentageComplete, daysToNextBirthday }) => {
    return (
        <div className="my-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <CounterBlock 
                    value={weeksLived.toLocaleString()} 
                    label="Weeks Lived"
                    ariaLabel={`${weeksLived.toLocaleString()} weeks lived.`}
                />
                <CounterBlock 
                    value={weeksRemaining.toLocaleString()} 
                    label="Weeks Remaining"
                    ariaLabel={`${weeksRemaining.toLocaleString()} weeks remaining.`}
                />
                <CounterBlock 
                    value={`${percentageComplete.toFixed(1)}%`}
                    label="Life Complete"
                    ariaLabel={`${percentageComplete.toFixed(1)} percent of life complete.`}
                />
                <CounterBlock 
                    value={daysToNextBirthday.toLocaleString()} 
                    label="Days to B-Day"
                    ariaLabel={`${daysToNextBirthday.toLocaleString()} days until next birthday.`}
                />
            </div>
            <p className="text-center italic mt-6 max-w-md mx-auto theme-text-muted">
                Backlog at death is guaranteed. Choose what fills the next square.
            </p>
        </div>
    );
};