
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Milestone } from '../types';

interface TooltipData {
    weekIndex: number;
    x: number;
    y: number;
    age: { years: number, weeks: number };
    milestone?: Milestone;
}

const getWeekDateRange = (weekIndex: number, dob: Date): string => {
    const startDate = new Date(dob);
    startDate.setDate(startDate.getDate() + weekIndex * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const formatDate = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const Tooltip: React.FC<{ data: TooltipData; dob: Date; gridRef: React.RefObject<HTMLDivElement> }> = ({ data, dob, gridRef }) => {
    if (!gridRef.current) return null;
    
    const range = getWeekDateRange(data.weekIndex, dob);
    
    const style: React.CSSProperties = {
        position: 'fixed',
        left: `${data.x}px`,
        top: `${data.y}px`,
        transform: 'translate(-50%, -120%)',
        pointerEvents: 'none',
        zIndex: 100,
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderColor: 'var(--border-color)',
        transition: 'left 0.1s ease-out, top 0.1s ease-out, opacity 0.2s ease-in-out',
    };
    
    return (
        <div style={style} className="text-sm rounded-lg py-3 px-4 shadow-2xl border theme-card border-[var(--border-color)] min-w-[180px] animate-fade-in">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -110%) scale(0.95); }
                    to { opacity: 1; transform: translate(-50%, -120%) scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
             {data.milestone && (
                <div className="mb-2 pb-2 border-b border-[var(--border-color)]">
                     <span className="font-bold text-[var(--accent)] block text-base">{data.milestone.name}</span>
                     {data.milestone.type === 'date' && <span className="text-xs theme-text-muted">{data.milestone.date}</span>}
                </div>
            )}
            <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-bold">Week {data.weekIndex + 1}</span>
                <span className="text-xs theme-text-muted font-mono bg-[var(--bg-page)] px-1.5 py-0.5 rounded">
                    {data.age.years}y {data.age.weeks}w
                </span>
            </div>
            <p className="text-xs theme-text-muted mt-1">{range}</p>
        </div>
    );
};

const WeekSquare: React.FC<{
    status: 'past' | 'present' | 'future';
    isMilestone: boolean;
    isHighlighted: boolean;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
    onClick: () => void;
}> = React.memo(({ status, isMilestone, isHighlighted, onMouseEnter, onClick }) => {
    let classes = "w-full h-full rounded-[1px] sm:rounded-[2px] transition-all duration-300 relative ";
    let milestoneDotClasses = "absolute inset-0 flex items-center justify-center text-[var(--milestone-dot)] transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)";
    
    switch (status) {
        case 'past':
            classes += "theme-week-past hover:opacity-80";
            break;
        case 'present':
            classes += "theme-week-present ring-2 ring-offset-1 ring-offset-[var(--bg-card)] ring-[var(--week-present)] animate-pulse z-10";
            milestoneDotClasses = "absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)";
            break;
        case 'future':
            classes += "theme-week-future hover:brightness-95 hover:scale-110 z-0 hover:z-10";
            break;
    }

    // Ensure milestone squares pop to the top when hovered or highlighted
    if (isMilestone) {
        classes += " group-hover:z-20";
    }

    if (isHighlighted) {
        classes += " ring-4 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-card)] z-30 scale-150 shadow-lg";
    }

    return (
        <div className="aspect-square p-[1px] group cursor-pointer" onMouseEnter={onMouseEnter} onClick={onClick}>
             <div className={classes}>
                {isMilestone && (
                    <div className={`${milestoneDotClasses} group-hover:scale-125 ${isHighlighted ? 'scale-125' : ''}`}>
                       <svg className="w-full h-full animate-milestone-pop" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
});
WeekSquare.displayName = 'WeekSquare';

interface LifeGridProps {
    totalWeeks: number;
    weeksLived: number;
    currentWeekIndex: number;
    milestoneWeeks: Map<number, Milestone>;
    zoom: number;
    dob: Date | null;
    onWeekClick?: (weekIndex: number) => void;
}

export const LifeGrid: React.FC<LifeGridProps> = ({ totalWeeks, weeksLived, currentWeekIndex, milestoneWeeks, zoom, dob, onWeekClick }) => {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [highlightedMilestone, setHighlightedMilestone] = useState<Milestone | null>(null);
    const gridRef = React.useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<number | null>(null);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, weekIndex: number) => {
        if (!dob) return;
        
        // Cancel any pending hide
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        const years = Math.floor(weekIndex / 52);
        const weeks = weekIndex % 52;
        const milestone = milestoneWeeks.get(weekIndex);

        setTooltip({ 
            weekIndex, 
            x: e.clientX, 
            y: e.clientY,
            age: { years, weeks },
            milestone
        });
    }, [dob, milestoneWeeks]);

    const handleMouseLeave = useCallback(() => {
        // Debounce hiding to prevent flickering when moving between cells
        hoverTimeoutRef.current = window.setTimeout(() => {
            setTooltip(null);
        }, 100);
    }, []);

    const toggleMilestoneHighlight = (milestone: Milestone) => {
        if (highlightedMilestone && highlightedMilestone.name === milestone.name) {
            setHighlightedMilestone(null);
        } else {
            setHighlightedMilestone(milestone);
        }
    };

    // Create array of weeks
    const weeks = [];
    for (let i = 0; i < totalWeeks; i++) {
        const status = i < weeksLived ? 'past' : (i === currentWeekIndex ? 'present' : 'future');
        const milestone = milestoneWeeks.get(i);
        const isMilestone = !!milestone;
        // Highlight if this week's milestone matches the currently selected one
        const isHighlighted = !!(highlightedMilestone && milestone && milestone.name === highlightedMilestone.name);
        
        weeks.push(
            <WeekSquare
                key={i}
                status={status}
                isMilestone={isMilestone}
                isHighlighted={isHighlighted}
                onMouseEnter={(e) => handleMouseEnter(e, i)}
                onClick={() => onWeekClick?.(i)}
            />
        );
    }

    return (
        <div className="relative w-full my-6" onMouseLeave={handleMouseLeave}>
             <style>{`
                @keyframes milestonePop {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-milestone-pop {
                    animation: milestonePop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
                }
            `}</style>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                {/* Y-Axis Labels */}
                <div className="hidden sm:flex flex-col text-right text-xs theme-text-muted pt-1 select-none w-8 flex-shrink-0 h-full overflow-hidden relative">
                    <div className="absolute top-0 right-0">0</div>
                    <div className="absolute top-[10%] right-0">8</div>
                    <div className="absolute top-[20%] right-0">16</div>
                    <div className="absolute top-[30%] right-0">24</div>
                    <div className="absolute top-[40%] right-0">32</div>
                    <div className="absolute top-[50%] right-0">40</div>
                    <div className="absolute top-[60%] right-0">48</div>
                    <div className="absolute top-[70%] right-0">56</div>
                    <div className="absolute top-[80%] right-0">64</div>
                    <div className="absolute top-[90%] right-0">72</div>
                </div>

                {/* The Grid */}
                <div className="flex-grow overflow-x-hidden relative">
                     {/* Dim overlay when a milestone is highlighted */}
                     {highlightedMilestone && (
                         <div className="absolute inset-0 z-10 bg-[var(--bg-card)] bg-opacity-30 backdrop-blur-[1px] transition-all pointer-events-none"></div>
                     )}
                     <div
                        ref={gridRef}
                        className="grid transition-transform duration-300 origin-top-left"
                        style={{
                            // 52 columns represents 1 year per row (approx)
                            gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
                            transform: `scale(${zoom})`,
                            width: `${(100 / zoom)}%`
                        }}
                    >
                        {weeks}
                    </div>
                </div>
            </div>

            {tooltip && dob && <Tooltip data={tooltip} dob={dob} gridRef={gridRef}/>}
            
             {milestoneWeeks.size > 0 && (
                <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-sm font-semibold theme-text-muted mb-3">Milestones (Click to locate):</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                        {Array.from(milestoneWeeks.values())
                            .reduce<Milestone[]>((unique, item) => {
                                return unique.find(u => u.name === item.name) ? unique : [...unique, item];
                            }, [])
                            .map((m: Milestone) => {
                                const isHighlighted = highlightedMilestone?.name === m.name;
                                return (
                                    <button 
                                        key={m.id || m.name} 
                                        onClick={() => toggleMilestoneHighlight(m)}
                                        className={`flex items-center gap-2 p-1 rounded transition-all ${isHighlighted ? 'bg-[var(--week-future)] ring-2 ring-[var(--accent)]' : 'hover:bg-gray-100'}`}
                                    >
                                        <div className="relative w-3 h-3">
                                            <div className={`absolute inset-0 rounded-sm ${m.value && m.value > (currentWeekIndex/52) ? 'theme-week-future' : 'theme-week-past'}`}></div>
                                            <svg className={`absolute inset-0 w-full h-full text-[var(--milestone-dot)] animate-milestone-pop`} fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                        </div>
                                        <span className={`theme-text-muted ${isHighlighted ? 'font-bold text-[var(--text-main)]' : ''}`}>{m.name}</span>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};
