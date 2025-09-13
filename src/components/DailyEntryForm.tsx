import { useState } from 'react';
import { DailyEntry } from '../types';

interface DailyEntryFormProps {
  goalId: string;
  onSubmit: (entry: Omit<DailyEntry, 'id'>) => void;
}

export default function DailyEntryForm({ goalId, onSubmit }: DailyEntryFormProps) {
  const [wordCount, setWordCount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordCount) return;

    onSubmit({
      date: new Date(date),
      wordCount: parseInt(wordCount),
      goalId,
    });

    setWordCount('');
  };

  return (
    <form onSubmit={handleSubmit} className="daily-entry-form">
      <h3>Update Word Count</h3>
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="words">Total Word Count:</label>
        <input
          type="number"
          id="words"
          value={wordCount}
          onChange={(e) => setWordCount(e.target.value)}
          placeholder="25750"
          min="0"
          required
        />
        <small style={{ opacity: 0.7, fontSize: '0.9em', marginTop: '0.25rem', display: 'block' }}>
          Enter your current total word count for this project
        </small>
      </div>
      <button type="submit">Update Progress</button>
    </form>
  );
}