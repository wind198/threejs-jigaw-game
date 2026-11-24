'use client';
import { useIsClient } from 'usehooks-ts';
import { useGamePreferences } from '../../state/preferences';
import { SetupOverlay } from './SetupOverlay';
export function SetupGate() {
  const client = useIsClient();
  const { preferences, setPreferences } = useGamePreferences();
  if (!client || preferences.setupCompleted) return null;
  return <SetupOverlay preferences={preferences} onComplete={setPreferences}/>;
}
