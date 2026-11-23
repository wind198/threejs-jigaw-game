import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useGamePreferences } from '../state/preferences';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { GamePage } from './pages/GamePage';
import { ParentsPage } from './pages/ParentsPage';
import { SetupOverlay } from './components/SetupOverlay';
import './style.css';
function Site() {
  const { preferences, setPreferences } = useGamePreferences();
  return <><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/puzzles" element={<LibraryPage/>}/>
    <Route path="/play/:puzzleId" element={<GamePage preferences={preferences}/>}/>
    <Route path="/parents" element={<ParentsPage preferences={preferences} onChange={setPreferences}/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
  {!preferences.setupCompleted && <SetupOverlay onComplete={next => setPreferences(next)}/>}
  </>;
}
export function App() { return <HashRouter><Site/></HashRouter>; }
