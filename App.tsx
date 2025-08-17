import React, { useReducer, Reducer, useEffect } from 'react';
import { GameState, GameAction, Todo, Quest, PomodoroStatus, Shortcut } from './types';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import QuestBoard from './components/QuestBoard';
import Shortcuts from './components/Shortcuts';
import CoinIcon from './components/icons/CoinIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import { LONG_BREAK_INTERVAL, POMODORO_DURATIONS, BREAK_DURATIONS_MAP } from './constants';

const initialState: GameState = {
  coins: 50,
  pomodoro: {
    status: PomodoroStatus.Idle,
    sessionsCompleted: 0,
    key: 0, // Used to force-reset timer component
    duration: POMODORO_DURATIONS[PomodoroStatus.Work], // a default, e.g. 15 mins
    breakDuration: BREAK_DURATIONS_MAP[POMODORO_DURATIONS[PomodoroStatus.Work]],
  },
  todos: [],
  todosCompletedForReward: 0,
  todoRewardThreshold: 5,
  quests: [],
  shortcuts: [],
  theme: 'dark',
  investments: {},
};

const gameReducer: Reducer<GameState, GameAction> = (state, action): GameState => {
  switch (action.type) {
    case 'COMPLETE_SESSION':
      const coinsEarned = Math.floor(state.pomodoro.duration / 60);
      const breakDuration = BREAK_DURATIONS_MAP[state.pomodoro.duration] || POMODORO_DURATIONS[PomodoroStatus.ShortBreak];
      return {
        ...state,
        coins: state.coins + coinsEarned,
        pomodoro: {
          ...state.pomodoro,
          sessionsCompleted: state.pomodoro.sessionsCompleted + 1,
          breakDuration: breakDuration,
        },
      };
    case 'START_TIMER':
      return { ...state, pomodoro: { ...state.pomodoro, status: action.payload } };
    case 'RESET_POMODORO':
       return {
        ...state,
        pomodoro: {
          ...state.pomodoro,
          status: PomodoroStatus.Idle,
          key: state.pomodoro.key + 1, // Change key to remount Timer
        },
      };
    case 'SET_DURATION':
      return {
        ...state,
        pomodoro: {
          ...state.pomodoro,
          duration: action.payload,
          key: state.pomodoro.key + 1, // Reset timer with new duration
        }
      }
    case 'ADD_TODO':
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      return { ...state, todos: [...state.todos, newTodo] };
    case 'TOGGLE_TODO':
      const todoToToggle = state.todos.find((todo) => todo.id === action.payload);
      if (!todoToToggle) return state;

      let newCoins = state.coins;
      let newProgress = state.todosCompletedForReward;

      // Only increment progress when an incomplete task is marked as complete.
      if (!todoToToggle.completed) {
        newProgress++;
        if (newProgress >= state.todoRewardThreshold) {
          newCoins += 10;
          newProgress = 0; // Reset progress after reward.
        }
      }
      
      return {
        ...state,
        coins: newCoins,
        todosCompletedForReward: newProgress,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'ADD_QUEST':
      return {
        ...state,
        quests: [...state.quests, action.payload]
      };
    case 'COMPLETE_QUEST':
      const quest = state.quests.find((q) => q.id === action.payload);
      if (!quest) return state;
      return {
        ...state,
        coins: state.coins + quest.reward,
        quests: state.quests.filter((q) => q.id !== action.payload),
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };
    case 'SET_TODO_REWARD_THRESHOLD':
      return {
        ...state,
        todoRewardThreshold: action.payload,
        todosCompletedForReward: 0, // Reset progress when goal changes
      };
    case 'ADD_SHORTCUT':
      const newShortcut: Shortcut = {
        id: Date.now(),
        name: action.payload.name,
        type: action.payload.type,
        content: action.payload.content,
      };
      return { ...state, shortcuts: [...state.shortcuts, newShortcut] };
    case 'REMOVE_SHORTCUT':
      return { ...state, shortcuts: state.shortcuts.filter(s => s.id !== action.payload) };
    case 'UPDATE_SHORTCUT':
      return { ...state, shortcuts: state.shortcuts.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'INVEST':
      const { companyId, cost } = action.payload;
      if (state.coins < cost) return state;

      const currentShares = state.investments[companyId] || 0;
      return {
        ...state,
        coins: state.coins - cost,
        investments: {
          ...state.investments,
          [companyId]: currentShares + 1,
        },
      };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-bold font-pixel text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-0">
            Pomodoro Habit
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-amber-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <CoinIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              <span className="text-2xl font-bold ml-2 dark:text-white">{state.coins}</span>
            </div>
             <div className="flex items-center bg-amber-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold">Sessions</span>
                <span className="text-2xl font-bold ml-2">{`${state.pomodoro.sessionsCompleted} / ${LONG_BREAK_INTERVAL}`}</span>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
              className="p-2 rounded-full bg-amber-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {state.theme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-indigo-500" />
              )}
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <Timer 
                status={state.pomodoro.status} 
                sessionsCompleted={state.pomodoro.sessionsCompleted} 
                dispatch={dispatch} 
                timerKey={state.pomodoro.key}
                duration={state.pomodoro.duration}
                breakDuration={state.pomodoro.breakDuration}
            />
            <TodoList 
              todos={state.todos} 
              dispatch={dispatch} 
              todosCompletedForReward={state.todosCompletedForReward}
              todoRewardThreshold={state.todoRewardThreshold}
            />
            <Shortcuts shortcuts={state.shortcuts} dispatch={dispatch} />
          </div>

          <QuestBoard quests={state.quests} dispatch={dispatch} />
        </main>
      </div>
    </div>
  );
};

export default App;