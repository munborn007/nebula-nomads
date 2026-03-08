'use client';
/**
 * Metaverse state — UI overlay visibility, active zone, chat, etc.
 * Extend with multiplayer sync (Colyseus/Socket.io) later.
 */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ZoneId = 'hub' | 'mint' | 'battle' | 'staking' | 'social' | null;

export type MetaverseState = {
  zone: ZoneId;
  hudVisible: boolean;
  chatOpen: boolean;
  minimapVisible: boolean;
  ownedCount: number;
  stakedCount: number;
};

const defaultState: MetaverseState = {
  zone: 'hub',
  hudVisible: true,
  chatOpen: false,
  minimapVisible: true,
  ownedCount: 0,
  stakedCount: 0,
};

type MetaverseContextValue = MetaverseState & {
  setZone: (z: ZoneId) => void;
  setHudVisible: (v: boolean) => void;
  setChatOpen: (v: boolean) => void;
  setMinimapVisible: (v: boolean) => void;
  setOwnedCount: (n: number) => void;
  setStakedCount: (n: number) => void;
};

const MetaverseContext = createContext<MetaverseContextValue | null>(null);

export function MetaverseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MetaverseState>(defaultState);

  const setZone = useCallback((zone: ZoneId) => setState((s) => ({ ...s, zone })), []);
  const setHudVisible = useCallback((hudVisible: boolean) => setState((s) => ({ ...s, hudVisible })), []);
  const setChatOpen = useCallback((chatOpen: boolean) => setState((s) => ({ ...s, chatOpen })), []);
  const setMinimapVisible = useCallback((minimapVisible: boolean) => setState((s) => ({ ...s, minimapVisible })), []);
  const setOwnedCount = useCallback((ownedCount: number) => setState((s) => ({ ...s, ownedCount })), []);
  const setStakedCount = useCallback((stakedCount: number) => setState((s) => ({ ...s, stakedCount })), []);

  const value: MetaverseContextValue = {
    ...state,
    setZone,
    setHudVisible,
    setChatOpen,
    setMinimapVisible,
    setOwnedCount,
    setStakedCount,
  };

  return React.createElement(MetaverseContext.Provider, { value }, children);
}

export function useMetaverse() {
  const ctx = useContext(MetaverseContext);
  if (!ctx) throw new Error('useMetaverse must be used inside MetaverseProvider');
  return ctx;
}
