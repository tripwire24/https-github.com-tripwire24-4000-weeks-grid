
export type MilestoneType = 'age' | 'week' | 'date';

export interface Milestone {
  id?: string;
  name: string;
  type: MilestoneType;
  value?: number;
  date?: string;
}

export interface CalculatedMetrics {
    weeksLived: number;
    weeksRemaining: number;
    percentageComplete: number;
    currentWeekIndex: number;
    isFutureDob: boolean;
    isBeyondExpectancy: boolean;
    milestoneWeeks: Map<number, Milestone>;
    daysToNextBirthday: number;
}
