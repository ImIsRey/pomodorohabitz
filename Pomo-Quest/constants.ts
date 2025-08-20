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

export const OFFLINE_INVESTMENT_NEWS: string[] = [
    "Whispers on the digital street say {companyName} is about to unveil a game-changing product. Stock prices are buzzing!",
    "A surprise audit reveals {companyName} has been secretly stockpiling good ideas. Experts predict a surge in innovation.",
    "{companyName} just poached a top mind from a rival corporation. Big things are expected!",
    "Analysts are upgrading their ratings for {companyName} after a series of smart, strategic moves. The future looks bright!",
    "Rumor has it {companyName} is testing a revolutionary new technology. The market is holding its breath in anticipation.",
    "Leaked documents suggest {companyName} has exceeded all of its quarterly goals. Insiders are celebrating a huge success.",
    "{companyName}'s recent charity drive has won them massive public support. Their brand image has never been stronger.",
    "A bold marketing campaign from {companyName} has gone viral, capturing the attention of millions worldwide.",
    "The buzz around investors is that {companyName} is about to unveil a product that could disrupt the market as we know it.",
    "There's a growing sense of optimism as {companyName} reportedly secures a major contract, signaling strong future revenue.",
    "Market watchers are keeping a close eye on {companyName}, as rumors suggest a strategic move that could enhance its global footprint.",
    "With a 15% increase in market share, {companyName}'s growth trajectory looks promising for the next fiscal year.",
    "A recent analysis shows that {companyName}'s customer base has expanded by 40%, a clear indicator of its growing influence.",
];

export const TODO_REWARD_THRESHOLDS = [5, 10, 15];

export const OFFLINE_QUESTS: { text: string; reward: number }[] = [
  { text: "Review today's lecture notes for 15 minutes.", reward: 20 },
  { text: "Add 1 schools material on Notion's", reward: 20 },
  { text: "Read an academic article related to your field.", reward: 30 },
  { text: "Do 5 minutes of stretching.", reward: 15 },
  { text: "Spend 20 minutes learning a new skill online.", reward: 25 },
  { text: "Clean and organize your Bedroom", reward: 20 },
  { text: "Plan your study schedule for the rest of the week.", reward: 30 },
  { text: "Do a 10-minute meditation to clear your mind.", reward: 15 },
  { text: "Go for a 15-minute walk without your phone.", reward: 20 },
  { text: "Drink a full glass of water and do some stretching.", reward: 10 },
  { text: "Write down three specific goals for tomorrow.", reward: 20 },
  { text: "Tidy up your physical study space for 10 minutes.", reward: 20 },
  { text: "Complete one Pomodoro session without distractions.", reward: 25 },
  { text: "Reach out to a classmate to discuss a difficult topic.", reward: 15 },
  { text: "Summarize a textbook chapter in your own words.", reward: 35 },
  { text: "Read Headway for 15 minutes.", reward: 15 },
  { text: "Read Quran for 10 minutes", reward: 15 },
  { text: "Take 25-minute focus session.", reward: 30 },
  { text: "Challenge: Get 4 Sessions of 15 minutes.", reward: 30 },
  
];