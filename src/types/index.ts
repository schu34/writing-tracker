export interface WritingGoal {
  id: string;
  title: string;
  targetWordCount: number;
  deadline: Date;
  startDate: Date;
  initialWordCount: number;
  createdAt: Date;
}

export interface DailyEntry {
  id: string;
  date: Date;
  wordCount: number; // Total word count for the project on this date
  goalId: string;
}

export interface WritingStats {
  totalWords: number;
  averageDaily: number;
  daysRemaining: number;
  wordsPerDayNeeded: number;
  projectedCompletion: Date;
  progressPercentage: number;
}