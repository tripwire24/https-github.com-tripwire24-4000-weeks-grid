
export type ThemeKey = 'classic' | 'tron' | 'gelato' | 'frog' | 'lobster' | 'corn' | 'matrix';

export interface Theme {
    label: string;
    colors: {
        '--bg-page': string;
        '--bg-card': string;
        '--text-main': string;
        '--text-muted': string;
        '--week-past': string;
        '--week-present': string;
        '--week-future': string;
        '--accent': string;
        '--accent-hover': string;
        '--milestone-dot': string;
        '--border-color': string;
    };
    font: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
    classic: {
        label: 'Classic',
        colors: {
            '--bg-page': '#f9fafb', // gray-50
            '--bg-card': '#ffffff', // white
            '--text-main': '#111827', // gray-900
            '--text-muted': '#4b5563', // gray-600
            '--week-past': '#1e293b', // slate-800
            '--week-present': '#6366f1', // indigo-500
            '--week-future': '#e5e7eb', // gray-200
            '--accent': '#4f46e5', // indigo-600
            '--accent-hover': '#4338ca', // indigo-700
            '--milestone-dot': '#fbbf24', // amber-400
            '--border-color': '#e5e7eb', // gray-200
        },
        font: 'ui-sans-serif, system-ui, sans-serif'
    },
    tron: {
        label: 'Tron',
        colors: {
            '--bg-page': '#0f172a', // slate-900
            '--bg-card': '#1e293b', // slate-800
            '--text-main': '#22d3ee', // cyan-400
            '--text-muted': '#94a3b8', // slate-400
            '--week-past': '#0e7490', // cyan-700
            '--week-present': '#d946ef', // fuchsia-500
            '--week-future': '#334155', // slate-700
            '--accent': '#22d3ee', // cyan-400
            '--accent-hover': '#06b6d4', // cyan-500
            '--milestone-dot': '#facc15', // yellow-400
            '--border-color': '#334155', // slate-700
        },
        font: '"Courier New", Courier, monospace'
    },
    gelato: {
        label: 'Gelato',
        colors: {
            '--bg-page': '#fff1f2', // rose-50
            '--bg-card': '#ffffff', // white
            '--text-main': '#881337', // rose-900
            '--text-muted': '#9f1239', // rose-700
            '--week-past': '#fbcfe8', // pink-200
            '--week-present': '#f472b6', // pink-400
            '--week-future': '#fff0f5', // lavender blush
            '--accent': '#f43f5e', // rose-500
            '--accent-hover': '#e11d48', // rose-600
            '--milestone-dot': '#34d399', // emerald-400
            '--border-color': '#fecdd3', // rose-200
        },
        font: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    },
    frog: {
        label: 'Frog',
        colors: {
            '--bg-page': '#f0fdf4', // green-50
            '--bg-card': '#ffffff',
            '--text-main': '#14532d', // green-900
            '--text-muted': '#15803d', // green-700
            '--week-past': '#86efac', // green-300
            '--week-present': '#22c55e', // green-500
            '--week-future': '#dcfce7', // green-100
            '--accent': '#16a34a', // green-600
            '--accent-hover': '#15803d', // green-700
            '--milestone-dot': '#1e293b', // slate-800
            '--border-color': '#bbf7d0', // green-200
        },
        font: 'ui-rounded, "Varela Round", sans-serif'
    },
    lobster: {
        label: 'Lobster',
        colors: {
            '--bg-page': '#fff7ed', // orange-50
            '--bg-card': '#ffffff',
            '--text-main': '#7c2d12', // orange-900
            '--text-muted': '#c2410c', // orange-700
            '--week-past': '#fdba74', // orange-300
            '--week-present': '#dc2626', // red-600
            '--week-future': '#ffedd5', // orange-100
            '--accent': '#ea580c', // orange-600
            '--accent-hover': '#c2410c', // orange-700
            '--milestone-dot': '#000000', 
            '--border-color': '#fed7aa', // orange-200
        },
        font: 'Georgia, Cambria, "Times New Roman", Times, serif'
    },
    corn: {
        label: 'Corn',
        colors: {
            '--bg-page': '#fefce8', // yellow-50
            '--bg-card': '#ffffff',
            '--text-main': '#713f12', // yellow-900
            '--text-muted': '#854d0e', // yellow-700
            '--week-past': '#fde047', // yellow-300
            '--week-present': '#eab308', // yellow-500
            '--week-future': '#fef9c3', // yellow-100
            '--accent': '#ca8a04', // yellow-600
            '--accent-hover': '#a16207', // yellow-700
            '--milestone-dot': '#16a34a', // green-600 (husk color)
            '--border-color': '#fef08a', // yellow-200
        },
        font: 'Verdana, Geneva, sans-serif'
    },
    matrix: {
        label: 'Matrix',
        colors: {
            '--bg-page': '#000000',
            '--bg-card': '#111111',
            '--text-main': '#22c55e', // green-500
            '--text-muted': '#15803d', // green-700
            '--week-past': '#064e3b', // green-900
            '--week-present': '#bbf7d0', // green-200
            '--week-future': '#022c22', // green-950
            '--accent': '#4ade80', // green-400
            '--accent-hover': '#22c55e', // green-500
            '--milestone-dot': '#ffffff',
            '--border-color': '#14532d', // green-800
        },
        font: '"Courier New", Courier, monospace'
    }
};
