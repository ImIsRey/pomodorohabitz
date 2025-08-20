export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export enum PomodoroStatus {
  Work = 'Work',
  ShortBreak = 'ShortBreak',
  LongBreak = 'LongBreak',
  Idle = 'Idle',
}

export interface Quest {
  id: number;
  text: string;
  reward: number;
}

export interface Shortcut {
  id: number;
  name: string;
  type: 'url' | 'pdf';
  content: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export type Theme = 'light' | 'dark';

export interface GameState {
  coins: number;
  pomodoro: {
    status: PomodoroStatus;
    sessionsCompleted: number;
    key: number;
    duration: number; // in seconds
    breakDuration: number; // in seconds
  };
  todos: Todo[];
  todosCompletedForReward: number;
  todoRewardThreshold: number;
  quests: Quest[];
  shortcuts: Shortcut[];
  theme: Theme;
  investments: { [key: string]: number };
}

export type GameAction =
  | { type: 'COMPLETE_SESSION' }
  | { type: 'START_TIMER'; payload: PomodoroStatus }
  | { type: 'RESET_POMODORO' }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'REMOVE_TODO'; payload: number }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'COMPLETE_QUEST'; payload: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_TODO_REWARD_THRESHOLD'; payload: number }
  | { type: 'INVEST'; payload: { companyId: string; cost: number } }
  | { type: 'CHARGE_FOR_QUEST' }
  | { type: 'ADD_SHORTCUT'; payload: { name: string; type: 'url' | 'pdf'; content: string } }
  | { type: 'REMOVE_SHORTCUT'; payload: number }
  | { type: 'UPDATE_SHORTCUT'; payload: Shortcut };