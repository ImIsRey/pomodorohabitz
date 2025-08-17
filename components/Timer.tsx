import React, { useState, useEffect, useCallback } from 'react';
import { PomodoroStatus, GameAction } from '../types';
import { POMODORO_DURATIONS, LONG_BREAK_INTERVAL, CUSTOM_DURATIONS, BREAK_DURATIONS_MAP } from '../constants';
import { playSessionEndSound, playBreakEndSound } from './audio';

interface TimerProps {
  status: PomodoroStatus;
  sessionsCompleted: number;
  dispatch: React.Dispatch<GameAction>;
  timerKey: number;
  duration: number;
  breakDuration: number;
}

const Timer: React.FC<TimerProps> = ({ status, sessionsCompleted, dispatch, timerKey, duration, breakDuration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (status === PomodoroStatus.Work) {
      setTimeLeft(duration);
    } else if (status === PomodoroStatus.ShortBreak) {
      setTimeLeft(breakDuration);
    } else if (status === PomodoroStatus.LongBreak) {
      setTimeLeft(POMODORO_DURATIONS[status]);
    } else {
      setTimeLeft(duration);
    }
  }, [status, timerKey, duration, breakDuration]);
  
  const handleSessionEnd = useCallback(() => {
    setIsActive(false);
    if (status === PomodoroStatus.Work) {
      playSessionEndSound();
      dispatch({ type: 'COMPLETE_SESSION' });
      const nextStatus = (sessionsCompleted + 1) % LONG_BREAK_INTERVAL === 0 ? PomodoroStatus.LongBreak : PomodoroStatus.ShortBreak;
      dispatch({ type: 'START_TIMER', payload: nextStatus });
    } else {
      playBreakEndSound();
      dispatch({ type: 'START_TIMER', payload: PomodoroStatus.Work });
    }
  }, [dispatch, status, sessionsCompleted]);


  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleSessionEnd();
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  const toggleTimer = () => {
    if (status === PomodoroStatus.Idle) {
      dispatch({ type: 'START_TIMER', payload: PomodoroStatus.Work });
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    dispatch({ type: 'RESET_POMODORO' });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getStatusMessage = () => {
      switch(status) {
          case PomodoroStatus.Work: return "Time to Focus!";
          case PomodoroStatus.ShortBreak: return "Take a Short Break";
          case PomodoroStatus.LongBreak: return "Take a Long Break";
          default: return "Ready to Start?";
      }
  }
  
  const getButtonColor = () => {
      return isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600';
  }

  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg transition-colors">
      {(status === PomodoroStatus.Idle || status === PomodoroStatus.Work) && !isActive && (
        <div className="mb-4 flex justify-center space-x-2">
            {CUSTOM_DURATIONS.map(d => (
                <button
                    key={d}
                    onClick={() => dispatch({ type: 'SET_DURATION', payload: d * 60 })}
                    className={`px-4 py-1 rounded-md font-semibold transition-colors ${
                        duration === d * 60
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }`}
                >
                    {d} min
                </button>
            ))}
        </div>
      )}
      <div className="mb-4 text-xl font-semibold text-emerald-600 dark:text-emerald-400 font-pixel">{getStatusMessage()}</div>
      <div className="text-7xl font-bold font-pixel my-4 tracking-wider">{formatTime(timeLeft)}</div>
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-md text-white font-bold text-lg transition-transform transform hover:scale-105 ${getButtonColor()}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 rounded-md bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold transition-transform transform hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;