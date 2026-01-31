
import React, { useEffect, useState } from 'react';
import { Storage } from '../lib/store';
import { WeeklyOutcome } from '../lib/types';

export const FocusReminder: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<WeeklyOutcome | null>(null);

  useEffect(() => {
    const outcomes = Storage.getWeeklyOutcomes();
    if (outcomes.length > 0) {
      setCurrentWeek(outcomes[0]);
    }
  }, []);

  if (!currentWeek) return null;

  return (
    <div className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-8 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-6 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-zinc-600 mono uppercase tracking-tighter">Build:</span>
            <span className="text-[11px] text-zinc-300 font-medium max-w-[150px] truncate">{currentWeek.build}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-zinc-600 mono uppercase tracking-tighter">Ship:</span>
            <span className="text-[11px] text-zinc-300 font-medium max-w-[150px] truncate">{currentWeek.ship}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-zinc-600 mono uppercase tracking-tighter">Learn:</span>
            <span className="text-[11px] text-zinc-300 font-medium max-w-[150px] truncate">{currentWeek.learn}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 ml-4">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-zinc-500 mono uppercase">Active Focus</span>
        </div>
      </div>
    </div>
  );
};
