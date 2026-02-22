'use client';

import { GameType } from '@/db/schema';
import React, { createContext, useContext, useMemo, useState } from 'react';

type GameTypeContextValue = {
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
};

const GameTypeContext = createContext<GameTypeContextValue | null>(null);

export function GameTypeProvider({
  initialGameType,
  children,
}: {
  initialGameType: GameType;
  children: React.ReactNode;
}) {
  const [gameType, setGameType] = useState<GameType>(initialGameType);

  const value = useMemo(() => ({ gameType, setGameType }), [gameType]);

  return (
    <GameTypeContext.Provider value={value}>
      {children}
    </GameTypeContext.Provider>
  );
}

export function useGameType() {
  const ctx = useContext(GameTypeContext);
  if (!ctx) {
    throw new Error('useGameType must be used within a GameTypeProvider');
  }
  return ctx;
}
