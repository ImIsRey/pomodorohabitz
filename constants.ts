import { PomodoroStatus, Company } from './types';

export const POMODORO_DURATIONS: { [key in PomodoroStatus]: number } = {
  [PomodoroStatus.Work]: 15 * 60, // Default work duration
  [PomodoroStatus.ShortBreak]: 5 * 60,
  [PomodoroStatus.LongBreak]: 15 * 60,
  [PomodoroStatus.Idle]: 0,
};

export const CUSTOM_DURATIONS = [5, 15, 25, 50]; // in minutes

// Maps work duration (in seconds) to break duration (in seconds)
export const BREAK_DURATIONS_MAP: { [key: number]: number } = {
    [5 * 60]: 1 * 60,
    [15 * 60]: 3 * 60,
    [25 * 60]: 5 * 60,
    [50 * 60]: 10 * 60,
};

export const LONG_BREAK_INTERVAL = 4; // A long break every 4 work sessions

export const COMPANIES: Company[] = [
  { id: 'pixel_power', name: 'Pixel Power Inc.', description: 'Invest in the future of pixelated energy solutions.', cost: 50 },
  { id: 'code_crafters', name: 'Code Crafters Guild', description: 'Artisans of high-quality digital experiences.', cost: 75 },
  { id: 'pomo_pro', name: 'PomoPro Gadgets', description: 'The leading manufacturer of productivity hardware.', cost: 100 },
];

export const TODO_REWARD_THRESHOLDS = [5, 10, 15];

export const OFFLINE_QUESTS: { text: string; reward: number }[] = [
  { text: "Organize your desktop files.", reward: 20 },
  { text: "Stretch for 5 minutes.", reward: 10 },
  { text: "Drink a glass of water.", reward: 5 },
  { text: "Write down 3 things you're grateful for.", reward: 15 },
  { text: "Read a chapter of a book.", reward: 25 },
  { text: "Plan your tasks for tomorrow.", reward: 20 },
  { text: "Do 10 push-ups or squats.", reward: 15 },
  { text: "Tidy up your workspace for 10 minutes.", reward: 20 },
  { text: "Unsubscribe from 5 email newsletters.", reward: 15 },
  { text: "Listen to one new song.", reward: 5 },
  { text: "Complete one Pomodoro work session.", reward: 25 },
];
