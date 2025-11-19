
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Counters } from './components/Counters';
import { LifeGrid } from './components/LifeGrid';
import { Footer } from './components/Footer';
import { DobModal } from './components/DobModal';
import { AddMilestoneModal } from './components/AddMilestoneModal';
import { MILESTONES_CONFIG } from './constants';
import { THEMES, ThemeKey } from './themes';
import type { Milestone, CalculatedMetrics } from './types';

// Utility to get today's date at midnight in the local timezone
const getToday = (): Date => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
};

// Main calculation logic
const calculateLifeMetrics = (dob: Date | null, totalWeeks: number, customMilestones: Milestone[]): CalculatedMetrics => {
    if (!dob || isNaN(dob.getTime())) {
        return {
            weeksLived: 0,
            weeksRemaining: totalWeeks,
            percentageComplete: 0,
            currentWeekIndex: -1, // No current week when DOB is not set
            isFutureDob: false,
            isBeyondExpectancy: false,
            milestoneWeeks: new Map(),
            daysToNextBirthday: 0,
        };
    }

    const today = getToday();
    const isFutureDob = dob > today;

    if (isFutureDob) {
        return {
            weeksLived: 0,
            weeksRemaining: totalWeeks,
            percentageComplete: 0,
            currentWeekIndex: 0,
            isFutureDob: true,
            isBeyondExpectancy: false,
            milestoneWeeks: new Map(),
            daysToNextBirthday: 0,
        };
    }

    const diffMillis = today.getTime() - dob.getTime();
    const weeksLived = Math.floor(diffMillis / (1000 * 60 * 60 * 24 * 7));
    const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
    const percentageComplete = totalWeeks > 0 ? Math.min(100, (weeksLived / totalWeeks) * 100) : 0;
    const currentWeekIndex = Math.min(weeksLived, totalWeeks - 1);
    const isBeyondExpectancy = weeksLived >= totalWeeks;

    const milestoneWeeks = new Map<number, Milestone>();
    const safeCustomMilestones = Array.isArray(customMilestones) ? customMilestones : [];
    const allMilestones = [...MILESTONES_CONFIG, ...safeCustomMilestones];

    allMilestones.forEach(milestone => {
        let weekIndex = -1;
        try {
            if (milestone.type === 'age' && typeof milestone.value === 'number') {
                const milestoneDate = new Date(dob);
                milestoneDate.setFullYear(dob.getFullYear() + milestone.value);
                const milestoneDiffMillis = milestoneDate.getTime() - dob.getTime();
                weekIndex = Math.floor(milestoneDiffMillis / (1000 * 60 * 60 * 24 * 7));
            } else if (milestone.type === 'week' && typeof milestone.value === 'number') {
                weekIndex = milestone.value - 1;
            } else if (milestone.type === 'date' && milestone.date) {
                const mDate = new Date(milestone.date);
                if (!isNaN(mDate.getTime())) {
                    const mDiff = mDate.getTime() - dob.getTime();
                    weekIndex = Math.floor(mDiff / (1000 * 60 * 60 * 24 * 7));
                }
            }

            if (weekIndex >= 0 && weekIndex < totalWeeks) {
                milestoneWeeks.set(weekIndex, milestone);
            }
        } catch (e) {
            console.warn("Error calculating milestone", milestone, e);
        }
    });
    
    // Next birthday calculation
    const dobMonth = dob.getMonth();
    const dobDay = dob.getDate();
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(currentYear, dobMonth, dobDay);
    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextBirthdayWeekIndex = Math.floor((nextBirthday.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 7));
    if(nextBirthdayWeekIndex >=0 && nextBirthdayWeekIndex < totalWeeks) {
        milestoneWeeks.set(nextBirthdayWeekIndex, { name: 'Next B-day', type: 'age', value: nextBirthday.getFullYear() - dob.getFullYear() });
    }

    return { weeksLived, weeksRemaining, percentageComplete, currentWeekIndex, isFutureDob, isBeyondExpectancy, milestoneWeeks, daysToNextBirthday };
};


// Main App Component
const App: React.FC = () => {
    const [dob, setDob] = useState<string>('');
    const [totalWeeks, setTotalWeeks] = useState<number>(4160); // Default to 80 years (approx 52 * 80)
    const [zoom, setZoom] = useState<number>(1);
    const [showMilestones, setShowMilestones] = useState<boolean>(true);
    const [customMilestones, setCustomMilestones] = useState<Milestone[]>([]);
    const [notification, setNotification] = useState<string | null>(null);
    const [currentTheme, setCurrentTheme] = useState<ThemeKey>('classic');

    // Milestone Modal State
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [milestoneModalDate, setMilestoneModalDate] = useState('');

    const appContainerRef = useRef<HTMLDivElement>(null);

    // Load saved data
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dobParam = params.get('dob');
        const weeksParam = params.get('weeks');
        
        const savedDob = localStorage.getItem('life-grid-dob');
        const savedMilestones = localStorage.getItem('life-grid-custom-milestones');
        const savedTheme = localStorage.getItem('life-grid-theme');

        if (dobParam) {
            setDob(dobParam);
        } else if (savedDob) {
            setDob(savedDob);
        }

        if (weeksParam) setTotalWeeks(parseInt(weeksParam, 10));

        if (savedMilestones) {
            try {
                const parsed = JSON.parse(savedMilestones);
                if (Array.isArray(parsed)) {
                    // Ensure IDs exist to prevent list key errors
                    const validMilestones = parsed.map((m: any) => ({
                        ...m,
                        id: m.id || Math.random().toString(36).substr(2, 9)
                    }));
                    setCustomMilestones(validMilestones);
                }
            } catch (e) {
                console.error("Failed to parse milestones", e);
                // Optionally clear bad data
                localStorage.removeItem('life-grid-custom-milestones');
            }
        }
        
        if (savedTheme && (THEMES as any)[savedTheme]) {
            setCurrentTheme(savedTheme as ThemeKey);
        }
    }, []);

    // Save DOB to local storage
    useEffect(() => {
        if (dob) {
            localStorage.setItem('life-grid-dob', dob);
        }
    }, [dob]);

    // Save milestones to local storage
    useEffect(() => {
        localStorage.setItem('life-grid-custom-milestones', JSON.stringify(customMilestones));
    }, [customMilestones]);

    // Save theme
    useEffect(() => {
        localStorage.setItem('life-grid-theme', currentTheme);
    }, [currentTheme]);

    const dobDate = useMemo(() => {
        if (!dob) return null;
        try {
            const [year, month, day] = dob.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (isNaN(date.getTime())) return null; // Check for Invalid Date
            return date;
        } catch {
            return null;
        }
    }, [dob]);

    const metrics = useMemo(() => calculateLifeMetrics(dobDate, totalWeeks, customMilestones), [dobDate, totalWeeks, customMilestones]);

    const updateUrl = useCallback((newDob: string, newWeeks: number) => {
        const params = new URLSearchParams();
        params.set('dob', newDob);
        params.set('weeks', newWeeks.toString());
        window.history.pushState({}, '', `?${params.toString()}`);
    }, []);

    const handleDobChange = (newDob: string) => {
        setDob(newDob);
        updateUrl(newDob, totalWeeks);
    };

    const handleWeeksChange = (newWeeks: number) => {
        setTotalWeeks(newWeeks);
        updateUrl(dob, newWeeks);
    };
    
    const handleAddMilestone = (milestone: Milestone) => {
        setCustomMilestones(prev => [...prev, milestone]);
        showNotification(`Added "${milestone.name}"`);
    };

    const handleRemoveMilestone = (id: string) => {
        setCustomMilestones(prev => prev.filter(m => m.id !== id));
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleShare = useCallback(() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy link.');
        });
    }, []);

    const handleExport = useCallback(() => {
        if (appContainerRef.current && (window as any).html2canvas) {
            showNotification('Generating image...');
            (window as any).html2canvas(appContainerRef.current, {
                backgroundColor: THEMES[currentTheme]?.colors['--bg-page'] || '#ffffff',
                scale: 2, // Higher resolution
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = `life-in-weeks-${dob}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                 setNotification(null);
            }).catch((err: any) => {
                console.error("Export failed", err);
                showNotification("Export failed.");
            });
        }
    }, [dob, currentTheme]);
    
    const handleReset = () => {
        setDob('');
        setTotalWeeks(4160);
        setZoom(1);
        setShowMilestones(true);
        setCustomMilestones([]);
        setCurrentTheme('classic');
        localStorage.removeItem('life-grid-dob');
        localStorage.removeItem('life-grid-custom-milestones');
        localStorage.removeItem('life-grid-theme');
        window.history.pushState({}, '', window.location.pathname);
        showNotification('View has been reset.');
    };

    const handleGridWeekClick = useCallback((weekIndex: number) => {
        if (!dobDate) return;
        const date = new Date(dobDate);
        // Calculate approximate date for the week
        date.setDate(date.getDate() + weekIndex * 7);
        setMilestoneModalDate(date.toISOString().split('T')[0]);
        setIsMilestoneModalOpen(true);
    }, [dobDate]);

    const handleModalAdd = (name: string, date: string) => {
        handleAddMilestone({
            id: Date.now().toString(),
            name,
            type: 'date',
            date
        });
        setIsMilestoneModalOpen(false);
    };

    // Construct CSS variables style block
    const themeStyles = useMemo(() => {
        const theme = THEMES[currentTheme] || THEMES['classic'];
        // Safety fallback
        if (!theme) return '';
        const vars = Object.entries(theme.colors).map(([key, value]) => `${key}: ${value};`).join(' ');
        return `
            :root {
                ${vars}
                --font-main: ${theme.font};
            }
            body {
                background-color: var(--bg-page);
                color: var(--text-main);
                font-family: var(--font-main);
                transition: background-color 0.3s, color 0.3s;
            }
            .theme-card {
                background-color: var(--bg-card);
                color: var(--text-main);
                border-color: var(--border-color);
            }
            .theme-text-muted { color: var(--text-muted); }
            .theme-accent { color: var(--accent); }
            .theme-week-past { background-color: var(--week-past); }
            .theme-week-present { background-color: var(--week-present); }
            .theme-week-future { background-color: var(--week-future); }
            .theme-btn-primary { 
                background-color: var(--accent); 
                color: #ffffff;
            }
            .theme-btn-primary:hover { background-color: var(--accent-hover); }
            /* Custom scrollbar for custom milestones list */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        `;
    }, [currentTheme]);

    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center transition-colors duration-300"
             style={{ backgroundColor: 'var(--bg-page)', fontFamily: 'var(--font-main)' }}>
            <style>{themeStyles}</style>
            
            {!dob && <DobModal onSubmit={handleDobChange} />}

            <div ref={appContainerRef} className="w-full max-w-7xl p-4 sm:p-6 rounded-xl shadow-lg transition-colors duration-300 theme-card">
                <Header />

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentTheme(key as ThemeKey)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shadow-sm
                        ${currentTheme === key 
                          ? 'ring-2 ring-offset-2 ring-[var(--accent)] transform scale-105 opacity-100' 
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }
                      `}
                      style={{
                        backgroundColor: theme.colors['--week-past'],
                        color: theme.colors['--bg-card'],
                        borderColor: theme.colors['--border-color']
                      }}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
                
                {dob && (
                    <Controls
                        dob={dob}
                        onDobChange={handleDobChange}
                        lifeExpectancy={totalWeeks}
                        onLifeExpectancyChange={handleWeeksChange}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        showMilestones={showMilestones}
                        onShowMilestonesChange={setShowMilestones}
                        onReset={handleReset}
                        customMilestones={customMilestones}
                        onAddMilestone={handleAddMilestone}
                        onRemoveMilestone={handleRemoveMilestone}
                    />
                )}
                
                {metrics.isFutureDob ? (
                    <div className="text-center p-8 my-4 rounded-lg bg-yellow-100 text-yellow-800">
                        <p className="font-semibold">Please select a date of birth in the past.</p>
                    </div>
                ) : (
                    <>
                        {metrics.isBeyondExpectancy && (
                            <div className="text-center p-2 my-4 rounded-lg font-semibold shadow bg-indigo-100 text-indigo-800">
                                Beyond the plan! Every new week is a bonus.
                            </div>
                        )}
                        <Counters
                            weeksLived={metrics.weeksLived}
                            weeksRemaining={metrics.weeksRemaining}
                            percentageComplete={metrics.percentageComplete}
                            daysToNextBirthday={metrics.daysToNextBirthday}
                        />
                        <LifeGrid
                            totalWeeks={totalWeeks}
                            weeksLived={metrics.weeksLived}
                            currentWeekIndex={metrics.currentWeekIndex}
                            milestoneWeeks={showMilestones ? metrics.milestoneWeeks : new Map()}
                            zoom={zoom}
                            dob={dobDate}
                            onWeekClick={handleGridWeekClick}
                        />
                    </>
                )}
            </div>
            {dob && <Footer onShare={handleShare} onExport={handleExport} />}

            <AddMilestoneModal 
                isOpen={isMilestoneModalOpen} 
                onClose={() => setIsMilestoneModalOpen(false)} 
                onAdd={handleModalAdd}
                initialDate={milestoneModalDate}
            />

            {notification && (
                <div className="fixed bottom-5 right-5 theme-btn-primary py-2 px-4 rounded-lg shadow-xl animate-fade-in-out z-[120]">
                    {notification}
                </div>
            )}
            
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(10px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(10px); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default App;
