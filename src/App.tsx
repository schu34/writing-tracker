import { useState } from 'react';
import './App.css';
import { useWritingData } from './hooks/useWritingData';
import GoalForm from './components/GoalForm';
import DailyEntryForm from './components/DailyEntryForm';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  const { goals, entries, addGoal, addEntry, calculateStats } = useWritingData();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const handleGoalSubmit = (goalData: Parameters<typeof addGoal>[0]) => {
    const newGoalId = addGoal(goalData);
    setActiveGoalId(newGoalId);
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
            </div>

            {activeGoal && stats && (
              <div className="dashboard-layout">
                <ProgressDashboard
                  goal={activeGoal}
                  entries={activeEntries}
                  stats={stats}
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