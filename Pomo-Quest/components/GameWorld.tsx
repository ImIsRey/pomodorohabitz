import React from 'react';

interface GameWorldProps {
  landPlots: number;
  houseLevel: number;
}

const TOTAL_PLOTS = 25; // 5x5 grid

const House: React.FC<{ level: number }> = ({ level }) => {
    if (level === 0) return null;
    
    const baseClasses = 'absolute inset-0 flex items-center justify-center pixelated';
    
    switch (level) {
        case 1: // Foundation
            return <div className={baseClasses}><div className="w-10 h-2 bg-gray-600 border-2 border-black"></div></div>;
        case 2: // Framing
            return <div className={baseClasses}><div className="w-10 h-10 border-4 border-yellow-700"></div></div>;
        case 3: // Complete
            return <div className={baseClasses}><div className="w-12 h-12 bg-red-700 border-2 border-black flex flex-col items-center"><div style={{width: 0, height: 0, borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderBottom: '12px solid #4a2c2a'}}></div><div className="w-4 h-6 bg-blue-300 mt-2"></div></div></div>
        default:
            return null;
    }
}

const GameWorld: React.FC<GameWorldProps> = ({ landPlots, houseLevel }) => {
  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg h-full flex flex-col transition-colors">
      <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400">Your Land</h2>
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-5 gap-1 bg-green-900 p-2 rounded-md aspect-square max-w-sm w-full">
          {Array.from({ length: TOTAL_PLOTS }).map((_, index) => {
            const isOwned = index < landPlots;
            const isCenterPlot = index === 12; // Center plot for the house
            return (
              <div
                key={index}
                className={`w-full h-full aspect-square border-2 ${
                  isOwned 
                    ? 'bg-green-600 border-green-700' 
                    : 'bg-gray-700 border-gray-800'
                } transition-colors relative`}
              >
                {isOwned && isCenterPlot && <House level={houseLevel} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameWorld;