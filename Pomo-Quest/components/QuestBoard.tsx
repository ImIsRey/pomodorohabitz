import React, { useState } from 'react';
import { Quest, GameAction } from '../types';
import { generateQuest } from '../services/geminiService';
import CoinIcon from './icons/CoinIcon';
import QuestIcon from './icons/QuestIcon';
import SparklesIcon from './icons/SparklesIcon';

interface QuestBoardProps {
  quests: Quest[];
  dispatch: React.Dispatch<GameAction>;
  coins: number;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests, dispatch, coins }) => {
  const [isLoading, setIsLoading] = useState(false);
  const QUEST_COST = 10;

  const handleGenerateQuest = async () => {
    if (isLoading || coins < QUEST_COST) {
      return;
    }
    
    dispatch({ type: 'CHARGE_FOR_QUEST' });
    setIsLoading(true);

    try {
      const { text, reward } = await generateQuest();
      dispatch({
        type: 'ADD_QUEST',
        payload: { id: Date.now(), text, reward },
      });
    } catch (error) {
      console.error("Failed to generate quest:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCompleteQuest = (id: number) => {
    dispatch({ type: 'COMPLETE_QUEST', payload: id });
  };

  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col transition-colors">
      <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400 flex items-center">
        <QuestIcon className="h-6 w-6 mr-2" />
        <span>Daily Quests</span>
      </h2>
      
      <div className="mb-4">
        <button
          onClick={handleGenerateQuest}
          disabled={isLoading || coins < QUEST_COST}
          className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-purple-600 flex items-center justify-center transition-all"
        >
          {isLoading ? (
            <>
              <SparklesIcon className="h-5 w-5 mr-2 animate-pulse" />
              Generating...
            </>
          ) : (
            <span className="flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              <span>Generate New Quest</span>
              <span className="flex items-center font-bold ml-2">
                  ({QUEST_COST}
                  <CoinIcon className="h-4 w-4 ml-1 text-yellow-300"/>)
              </span>
            </span>
          )}
        </button>
      </div>

      <ul className="overflow-y-auto space-y-2 max-h-96">
        {quests.map(quest => (
          <li key={quest.id} className="bg-amber-50 dark:bg-gray-700 p-3 rounded-md list-none animate-fade-in">
            <div className="flex justify-between items-center gap-4">
              <p className="flex-grow text-stone-700 dark:text-gray-300">{quest.text}</p>
              <div className="flex items-center flex-shrink-0">
                <span className="flex items-center font-bold text-yellow-600 dark:text-yellow-400 mr-4">
                    <CoinIcon className="h-5 w-5 mr-1"/>
                    {quest.reward}
                </span>
                <button
                  onClick={() => handleCompleteQuest(quest.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-3 rounded-md transition-transform transform hover:scale-105"
                >
                  Done
                </button>
              </div>
            </div>
          </li>
        ))}
        {quests.length === 0 && !isLoading && (
            <div className="text-center text-stone-500 p-4">
                No quests available. Generate one to get started!
            </div>
        )}
      </ul>
    </div>
  );
};

export default QuestBoard;