
export type ThemeKey = 'burkeman';

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
    burkeman: {
        label: 'Four Thousand Weeks',
        colors: {
            '--bg-page': '#f0f9ff', // Sky 50 - Airy background
            '--bg-card': '#ffffff', // White - Clean
            '--text-main': '#0c4a6e', // Sky 900 - Deep text
            '--text-muted': '#0369a1', // Sky 700 - Muted text
            '--week-past': '#0ea5e9', // Sky 500 - Vibrant Blue (Water/Sky)
            '--week-present': '#facc15', // Yellow 400 - "Time Management" Yellow
            '--week-future': '#e0f2fe', // Sky 100 - Faint future
            '--accent': '#0284c7', // Sky 600
            '--accent-hover': '#0369a1', // Sky 700
            '--milestone-dot': '#1e293b', // Slate 800 - Dark "Mountain" color for contrast
            '--border-color': '#bae6fd', // Sky 200
        },
        font: 'ui-sans-serif, system-ui, sans-serif'
    }
};
