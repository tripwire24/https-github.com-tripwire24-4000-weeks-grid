
import type { Milestone } from './types';

export const DEFAULT_TOTAL_WEEKS = 4000;
export const MIN_WEEKS = 3000;
export const MAX_WEEKS = 5200; // ~100 years

export const MILESTONES_CONFIG: Milestone[] = [
  { name: '18th B-day', type: 'age', value: 18 },
  { name: '30th B-day', type: 'age', value: 30 },
  { name: '40th B-day', type: 'age', value: 40 },
  { name: '50th B-day', type: 'age', value: 50 },
  { name: '65th B-day', type: 'age', value: 65 },
  { name: '1000th Week', type: 'week', value: 1000 },
  { name: '2000th Week', type: 'week', value: 2000 },
  { name: '3000th Week', type: 'week', value: 3000 },
];
