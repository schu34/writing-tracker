# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a writing tracker web application built with React and TypeScript. The app helps writers meet their deadlines by:
- Setting word count goals
- Tracking daily word counts
- Calculating writing averages
- Visualizing progress
- Projecting completion dates based on current writing rate

## Development Commands

Since this is a new project, standard React/TypeScript commands will apply once initialized:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Architecture Notes

The application should follow these core patterns:

### Data Structure
- User goals: word count targets and deadlines
- Daily entries: date and word count written
- Calculations: running averages, progress percentages, projected completion dates

### Key Components
- Goal setting interface
- Daily word count entry form
- Progress visualization (charts/graphs)
- Statistics dashboard showing averages and projections

### State Management
Consider using React Context or a state management library for:
- Current writing goals
- Daily word count entries
- Calculated statistics and projections

### Data Persistence
Plan for local storage or database integration to persist user data across sessions.