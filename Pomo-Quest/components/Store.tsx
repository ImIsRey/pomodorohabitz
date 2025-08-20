import React, { useState } from 'react';
import { GameState, GameAction, Company } from '../types';
import { COMPANIES } from '../constants';
import { getInvestmentNews } from '../services/geminiService';
import CoinIcon from './icons/CoinIcon';
import ChartBarIcon from './icons/ChartBarIcon';

interface StoreProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const Store: React.FC<StoreProps> = ({ state, dispatch }) => {
  const [loadingInvestment, setLoadingInvestment] = useState<string | null>(null);
  const [investmentNews, setInvestmentNews] = useState<{title: string, content: string} | null>(null);

  const canAfford = (cost: number) => state.coins >= cost;

  const handleInvest = async (company: Company) => {
    if (canAfford(company.cost) && !loadingInvestment) {
      setLoadingInvestment(company.id);
      dispatch({ type: 'INVEST', payload: { companyId: company.id, cost: company.cost } });
      const news = await getInvestmentNews(company);
      setInvestmentNews({title: `News on ${company.name}`, content: news});
      setLoadingInvestment(null);
    }
  };

  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col transition-colors">
       {investmentNews && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setInvestmentNews(null)}>
            <div className="bg-amber-50 dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full shadow-2xl border border-emerald-500" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold font-pixel text-emerald-600 dark:text-emerald-400 mb-4">{investmentNews.title}</h3>
                <p className="text-stone-700 dark:text-gray-300">{investmentNews.content}</p>
                <button onClick={() => setInvestmentNews(null)} className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md">Close</button>
            </div>
        </div>
       )}

      <div className="flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2" />
            <span>Investments</span>
        </h2>
        <ul className="space-y-2 mb-6">
          {COMPANIES.map(company => (
            <li key={company.id} className="bg-amber-50 dark:bg-gray-700 p-3 rounded-md">
              <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <p className="text-sm text-stone-500 dark:text-gray-400">Shares: {state.investments[company.id] || 0}</p>
                  </div>
                  <button onClick={() => handleInvest(company)} disabled={!canAfford(company.cost) || !!loadingInvestment} className="bg-purple-500 text-white font-bold py-1 px-3 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-purple-600 flex items-center">
                      {loadingInvestment === company.id ? 'Investing...' : <>
                          <CoinIcon className="h-5 w-5 mr-1 text-yellow-300"/>{company.cost}
                      </>}
                  </button>
              </div>
              <p className="text-xs text-stone-500 dark:text-gray-400 mt-2">{company.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Store;