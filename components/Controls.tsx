
import React, { useState } from 'react';
import { MIN_WEEKS, MAX_WEEKS } from '../constants';
import type { Milestone } from '../types';

interface ControlsProps {
    dob: string;
    onDobChange: (dob: string) => void;
    lifeExpectancy: number;
    onLifeExpectancyChange: (weeks: number) => void;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    showMilestones: boolean;
    onShowMilestonesChange: (show: boolean) => void;
    onReset: () => void;
    customMilestones: Milestone[];
    onAddMilestone: (m: Milestone) => void;
    onRemoveMilestone: (id: string) => void;
}

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1 theme-text-muted">{children}</label>
);

export const Controls: React.FC<ControlsProps> = ({
    dob,
    onDobChange,
    lifeExpectancy,
    onLifeExpectancyChange,
    zoom,
    onZoomChange,
    showMilestones,
    onShowMilestonesChange,
    onReset,
    customMilestones,
    onAddMilestone,
    onRemoveMilestone,
}) => {
    const lifeExpectancyYears = (lifeExpectancy / 52.1775).toFixed(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newMilestoneName, setNewMilestoneName] = useState('');
    const [newMilestoneDate, setNewMilestoneDate] = useState('');

    // Calculate today's date for max attribute
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMilestoneName && newMilestoneDate) {
            onAddMilestone({
                id: Date.now().toString(),
                name: newMilestoneName,
                type: 'date',
                date: newMilestoneDate
            });
            setNewMilestoneName('');
            setNewMilestoneDate('');
        }
    };

    const inputClass = "w-full p-2 border rounded-md shadow-sm focus:ring-2 bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-[var(--accent)]";
    const btnSecondary = "px-3 py-2 text-sm font-medium rounded-md shadow-sm border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:brightness-95 focus:outline-none";

    return (
        <div className="border rounded-lg mb-6 overflow-hidden" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 items-end">
                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <input
                        type="date"
                        id="dob"
                        value={dob}
                        max={maxDate}
                        onChange={(e) => onDobChange(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <Label htmlFor="lifeExpectancy">Life Expectancy ({lifeExpectancyYears} yrs)</Label>
                    <input
                        type="range"
                        id="lifeExpectancy"
                        min={MIN_WEEKS}
                        max={MAX_WEEKS}
                        step="52"
                        value={lifeExpectancy}
                        onChange={(e) => onLifeExpectancyChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex items-center justify-between col-span-2 md:col-span-3 lg:col-span-3 gap-4">
                    <div className="flex-1">
                        <Label htmlFor="zoom">Zoom ({zoom.toFixed(2)}x)</Label>
                        <input
                            type="range"
                            id="zoom"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
                
                 <div className="flex items-center gap-2 col-span-2 md:col-span-3 lg:col-span-5 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                     <div className="flex items-center gap-2 mr-4">
                         <input
                            type="checkbox"
                            id="milestones"
                            checked={showMilestones}
                            onChange={(e) => onShowMilestonesChange(e.target.checked)}
                            className="h-4 w-4 rounded"
                            style={{ accentColor: 'var(--accent)' }}
                        />
                        <Label htmlFor="milestones">Show Events</Label>
                    </div>
                     <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`px-3 py-2 text-sm font-medium rounded-md shadow-sm border border-[var(--border-color)] bg-[var(--bg-card)] theme-accent hover:brightness-95 focus:outline-none`}
                        >
                            {isExpanded ? 'Hide Custom' : 'Add Custom'}
                        </button>
                        <button
                            onClick={onReset}
                            className={btnSecondary}
                        >
                            Reset
                        </button>
                     </div>
                </div>
            </div>

            {/* Custom Milestones Section */}
            {isExpanded && (
                <div className="p-4 border-t" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <h3 className="text-sm font-semibold theme-text-muted mb-3">Custom Milestones</h3>
                    
                    {/* Add Form */}
                    <form onSubmit={handleAddSubmit} className="flex flex-wrap gap-3 mb-4 items-end">
                        <div className="flex-grow min-w-[150px]">
                            <Label htmlFor="m-name">Event Name</Label>
                            <input 
                                type="text" 
                                id="m-name"
                                placeholder="e.g., Graduation, Moved City"
                                value={newMilestoneName}
                                onChange={e => setNewMilestoneName(e.target.value)}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div className="min-w-[150px]">
                             <Label htmlFor="m-date">Date</Label>
                             <input 
                                type="date" 
                                id="m-date"
                                value={newMilestoneDate}
                                onChange={e => setNewMilestoneDate(e.target.value)}
                                className={inputClass}
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="theme-btn-primary px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            Add Event
                        </button>
                    </form>

                    {/* List */}
                    {customMilestones.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {customMilestones.map((m) => (
                                <li key={m.id} className="flex items-center justify-between p-2 rounded border text-sm"
                                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
                                    <span className="font-medium" style={{ color: 'var(--text-main)' }}>
                                        {m.date && <span className="font-mono mr-2 text-xs theme-text-muted">{m.date}</span>}
                                        {m.name}
                                    </span>
                                    <button 
                                        onClick={() => m.id && onRemoveMilestone(m.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs italic theme-text-muted">No custom events added yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};
