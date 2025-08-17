import React, { useState } from 'react';
import { Todo, GameAction } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import { TODO_REWARD_THRESHOLDS } from '../constants';
import CogIcon from './icons/CogIcon';

interface TodoListProps {
  todos: Todo[];
  dispatch: React.Dispatch<GameAction>;
  todosCompletedForReward: number;
  todoRewardThreshold: number;
}

const TodoText = ({ text, completed }: { text: string; completed: boolean }) => {
  return (
    <span className={`${completed ? 'todo-completed' : ''}`} aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="strikethrough-char"
          style={{ transitionDelay: `${index * 30}ms` }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const TodoList: React.FC<TodoListProps> = ({ todos, dispatch, todosCompletedForReward, todoRewardThreshold }) => {
  const [newTodo, setNewTodo] = useState('');
  const progressPercentage = (todosCompletedForReward / todoRewardThreshold) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch({ type: 'ADD_TODO', payload: newTodo.trim() });
      setNewTodo('');
    }
  };

  const handleThresholdChange = () => {
    const currentIndex = TODO_REWARD_THRESHOLDS.indexOf(todoRewardThreshold);
    const nextIndex = (currentIndex + 1) % TODO_REWARD_THRESHOLDS.length;
    const newThreshold = TODO_REWARD_THRESHOLDS[nextIndex];
    dispatch({ type: 'SET_TODO_REWARD_THRESHOLD', payload: newThreshold });
  };

  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-colors">
      <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400">To-Do List</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-bold text-stone-600 dark:text-stone-300 font-pixel">The Progress</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">{todosCompletedForReward} / {todoRewardThreshold}</span>
            <button
                onClick={handleThresholdChange}
                className="p-1 rounded-full text-stone-500 dark:text-stone-400 hover:bg-amber-200 dark:hover:bg-gray-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                aria-label="Change to-do reward goal"
              >
                <CogIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full bg-amber-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            aria-label={`Progress: ${todosCompletedForReward} out of ${todoRewardThreshold}`}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-amber-50 dark:bg-gray-700 border-2 border-amber-200 dark:border-gray-600 rounded-l-md p-2 focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 dark:text-gray-100"
        />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-r-md">
          <PlusIcon className="h-6 w-6" />
        </button>
      </form>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-amber-50 dark:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <div className="flex items-center flex-grow min-w-0">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-600'
                    : 'border-gray-400 dark:border-gray-500 hover:border-emerald-500'
                }`}
                aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
              >
                {todo.completed && <CheckIcon className="w-3 h-3 text-white" />}
              </button>
              <span
                onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                className="ml-2 cursor-pointer truncate"
              >
                <TodoText text={todo.text} completed={todo.completed} />
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE_TODO', payload: todo.id })}
              className="text-stone-500 dark:text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center text-stone-500 p-3">No tasks yet. Add one to get started!</li>
        )}
      </ul>
    </div>
  );
};

export default TodoList;