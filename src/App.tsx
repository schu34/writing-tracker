import { useState, useEffect } from 'react';
import './App.css';
import { useWritingData } from './hooks/useWritingData';
import GoalForm from './components/GoalForm';
import DailyEntryForm from './components/DailyEntryForm';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  const { goals, entries, addGoal, addEntry, calculateStats, deleteGoal, deleteEntry } = useWritingData();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  // Auto-select most recently updated goal if goals exist and no goal is currently selected
  useEffect(() => {
    if (goals.length > 0 && !activeGoalId) {
      // Find the goal with the most recent entry, or fall back to most recently created goal
      const goalWithRecentEntry = goals.map(goal => {
        const goalEntries = entries.filter(entry => entry.goalId === goal.id);
        const mostRecentEntry = goalEntries.length > 0 
          ? goalEntries.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
          : null;
        
        return {
          goal,
          lastUpdated: mostRecentEntry ? mostRecentEntry.date : goal.createdAt
        };
      }).sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())[0];
      
      setActiveGoalId(goalWithRecentEntry.goal.id);
    }
  }, [goals, entries, activeGoalId]);

  const handleGoalSubmit = (goalData: Parameters<typeof addGoal>[0]) => {
    const newGoalId = addGoal(goalData);
    setActiveGoalId(newGoalId);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (!goalToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${goalToDelete.title}"? This will also delete all associated progress entries. This action cannot be undone.`
    );

    if (confirmed) {
      deleteGoal(goalId);
      
      // If we deleted the active goal, clear the selection
      if (activeGoalId === goalId) {
        setActiveGoalId(null);
      }
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    const entryToDelete = entries.find(e => e.id === entryId);
    if (!entryToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the progress entry from ${entryToDelete.date.toLocaleDateString()}? This action cannot be undone.`
    );

    if (confirmed) {
      deleteEntry(entryId);
    }
  };

  const activeGoal = goals.find(goal => goal.id === activeGoalId);
  const activeEntries = entries.filter(entry => entry.goalId === activeGoalId);
  const stats = activeGoalId ? calculateStats(activeGoalId) : null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Writing Tracker</h1>
        <p>Track your writing progress and meet your deadlines</p>
      </header>

      <main className="App-main">
        {goals.length === 0 || !activeGoalId ? (
          <GoalForm onSubmit={handleGoalSubmit} />
        ) : (
          <div className="dashboard-container">
            <div className="goal-selector">
              <label htmlFor="goal-select">Active Goal:</label>
              <select
                id="goal-select"
                value={activeGoalId}
                onChange={(e) => setActiveGoalId(e.target.value)}
              >
                {goals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
              <button onClick={() => setActiveGoalId(null)} className="new-goal-btn">
                New Goal
              </button>
              {activeGoalId && (
                <button 
                  onClick={() => handleDeleteGoal(activeGoalId)} 
                  className="delete-goal-btn"
                  title="Delete this goal"
                >
                  🗑️
                </button>
              )}
            </div>

            {activeGoal && stats && (
              <div className="dashboard-layout">
                <ProgressDashboard
                  goal={activeGoal}
                  entries={activeEntries}
                  stats={stats}
                  onDeleteEntry={handleDeleteEntry}
                />
                <DailyEntryForm
                  goalId={activeGoalId}
                  onSubmit={addEntry}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;