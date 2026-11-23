'use client';
import { useGamePreferences } from '../../state/preferences';
import { ParentsPage } from '../pages/ParentsPage';
export function ParentsEntry() {
  const { preferences, setPreferences } = useGamePreferences();
  return <ParentsPage preferences={preferences} onChange={setPreferences}/>;
}
