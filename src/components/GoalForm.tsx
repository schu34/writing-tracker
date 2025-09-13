import { useState } from 'react';
import { WritingGoal } from '../types';

interface GoalFormProps {
  onSubmit: (goal: Omit<WritingGoal, 'id' | 'createdAt'>) => void;
}

export default function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [targetWordCount, setTargetWordCount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialWordCount, setInitialWordCount] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetWordCount || !deadline || !startDate) return;

    onSubmit({
      title,
      targetWordCount: parseInt(targetWordCount),
      deadline: new Date(deadline),
      startDate: new Date(startDate),
      initialWordCount: parseInt(initialWordCount) || 0,
    });

    setTitle('');
    setTargetWordCount('');
    setDeadline('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setInitialWordCount('0');
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <h2>Set Writing Goal</h2>
      <div className="form-group">
        <label htmlFor="title">Project Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Novel"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="wordCount">Target Word Count:</label>
        <input
          type="number"
          id="wordCount"
          value={targetWordCount}
          onChange={(e) => setTargetWordCount(e.target.value)}
          placeholder="50000"
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="initialWordCount">Current Word Count:</label>
        <input
          type="number"
          id="initialWordCount"
          value={initialWordCount}
          onChange={(e) => setInitialWordCount(e.target.value)}
          placeholder="0"
          min="0"
        />
        <small style={{ opacity: 0.7, fontSize: '0.9em', marginTop: '0.25rem', display: 'block' }}>
          If you've already started writing, enter your current word count
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={startDate || new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <button type="submit">Create Goal</button>
    </form>
  );
}