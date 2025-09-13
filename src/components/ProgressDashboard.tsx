import { WritingGoal, DailyEntry, WritingStats } from '../types';

interface ProgressDashboardProps {
  goal: WritingGoal;
  entries: DailyEntry[];
  stats: WritingStats;
}

export default function ProgressDashboard({ goal, entries, stats }: ProgressDashboardProps) {
  // Calculate daily progress for recent entries
  const calculateDailyProgress = () => {
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    const dailyProgress: Array<{ date: Date; totalWords: number; dailyWords: number }> = [];
    
    sortedEntries.forEach((entry, index) => {
      const previousTotal = index === 0 ? goal.initialWordCount : sortedEntries[index - 1].wordCount;
      const dailyWords = entry.wordCount - previousTotal;
      
      dailyProgress.push({
        date: entry.date,
        totalWords: entry.wordCount,
        dailyWords: Math.max(0, dailyWords) // Ensure non-negative
      });
    });
    
    return dailyProgress;
  };

  const recentProgress = calculateDailyProgress().slice(-5).reverse();

  return (
    <div className="progress-dashboard">
      <h2>{goal.title}</h2>
      <div className="goal-info">
        <p>Target: {goal.targetWordCount.toLocaleString()} words</p>
        <p>Started: {goal.startDate.toLocaleDateString()}</p>
        <p>Deadline: {goal.deadline.toLocaleDateString()}</p>
        {goal.initialWordCount > 0 && (
          <p>Starting word count: {goal.initialWordCount.toLocaleString()}</p>
        )}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.min(stats.progressPercentage, 100)}%` }}
        ></div>
        <span className="progress-text">
          {stats.progressPercentage.toFixed(1)}% Complete
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Words</h3>
          <p>{stats.totalWords.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Daily Average</h3>
          <p>{stats.averageDaily.toFixed(0)} words</p>
        </div>
        <div className="stat-card">
          <h3>Days Remaining</h3>
          <p>{stats.daysRemaining}</p>
        </div>
        <div className="stat-card">
          <h3>Words/Day Needed</h3>
          <p>{stats.wordsPerDayNeeded.toFixed(0)}</p>
        </div>
        <div className="stat-card">
          <h3>Projected Finish</h3>
          <p className={`projected-date ${stats.projectedCompletion.getTime() <= goal.deadline.getTime() ? 'on-track' : 'behind-schedule'}`}>
            {stats.projectedCompletion.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="recent-entries">
        <h3>Recent Progress</h3>
        {recentProgress.length > 0 ? (
          recentProgress.map((progress, index) => (
            <div key={`${progress.date.getTime()}-${index}`} className="entry-item">
              <span>{progress.date.toLocaleDateString()}</span>
              <div className="progress-details">
                <span className="daily-words">+{progress.dailyWords.toLocaleString()} words</span>
                <span className="total-words">({progress.totalWords.toLocaleString()} total)</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.7, fontStyle: 'italic' }}>No entries yet. Start logging your progress!</p>
        )}
      </div>
    </div>
  );
}