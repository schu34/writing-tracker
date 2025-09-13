import { useState, useEffect } from 'react';
import { WritingGoal, DailyEntry, WritingStats } from '../types';

const STORAGE_KEYS = {
  GOALS: 'writingTracker_goals',
  ENTRIES: 'writingTracker_entries',
};

export function useWritingData() {
  const [goals, setGoals] = useState<WritingGoal[]>([]);
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);

    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals.map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        startDate: new Date(goal.startDate || goal.createdAt),
        initialWordCount: goal.initialWordCount || 0,
        createdAt: new Date(goal.createdAt),
      })));
    }

    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      })));
    }
  }, []);

  const saveToStorage = (newGoals: WritingGoal[], newEntries: DailyEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(newGoals));
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
  };

  const addGoal = (goalData: Omit<WritingGoal, 'id' | 'createdAt'>) => {
    const newGoal: WritingGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    saveToStorage(newGoals, entries);
    return newGoal.id;
  };

  const addEntry = (entryData: Omit<DailyEntry, 'id'>) => {
    const newEntry: DailyEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    saveToStorage(goals, newEntries);
  };

  const calculateStats = (goalId: string): WritingStats => {
    const goalEntries = entries.filter(entry => entry.goalId === goalId);
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) {
      return {
        totalWords: 0,
        averageDaily: 0,
        daysRemaining: 0,
        wordsPerDayNeeded: 0,
        projectedCompletion: new Date(),
        progressPercentage: 0,
      };
    }

    // Sort entries by date to get the latest word count
    const sortedEntries = [...goalEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Current total is either the latest entry's word count or initial word count
    const totalWords = sortedEntries.length > 0 ? sortedEntries[0].wordCount : goal.initialWordCount;
    
    const today = new Date();
    const startDate = new Date(goal.startDate);
    const daysSinceStart = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate daily average based on total progress since start date
    const averageDaily = totalWords / daysSinceStart;
    const daysRemaining = Math.ceil((goal.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const remainingWords = Math.max(0, goal.targetWordCount - totalWords);
    const wordsPerDayNeeded = daysRemaining > 0 ? remainingWords / daysRemaining : 0;
    const progressPercentage = (totalWords / goal.targetWordCount) * 100;
    
    const daysToComplete = averageDaily > 0 ? remainingWords / averageDaily : Infinity;
    const projectedCompletion = new Date(today.getTime() + daysToComplete * 24 * 60 * 60 * 1000);

    return {
      totalWords,
      averageDaily,
      daysRemaining,
      wordsPerDayNeeded,
      projectedCompletion,
      progressPercentage,
    };
  };

  return {
    goals,
    entries,
    addGoal,
    addEntry,
    calculateStats,
  };
}