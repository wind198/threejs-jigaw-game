import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { DEFAULT_PREFERENCES, PIECES_PER_SIDE, type Difficulty, type Preferences } from '../../state/preferences';
import { StoryButton } from './StoryButton';
import { IllustrationIcon, type IllustrationName } from './IllustrationIcon';
const choices: { id: Difficulty; illustration: IllustrationName; label: string; note: string }[] = [
  { id: 'little', illustration: 'teddy-bear', label: 'Little', note: '4 pieces' },
  { id: 'growing', illustration: 'fox', label: 'Growing', note: '9 pieces' },
  { id: 'explorer', illustration: 'rocket', label: 'Explorer', note: '25 pieces' },
];
export function SetupOverlay({ onComplete }: { onComplete: (value: Preferences) => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_PREFERENCES.difficulty);
  const [hintsEnabled, setHints] = useState(true);
  const [soundEnabled, setSound] = useState(true);
  return <div className="modal-backdrop setup-backdrop">
    <section className="modal-card setup-card" role="dialog" aria-modal="true" aria-labelledby="setup-title">
      <span className="eyebrow"><Sparkles size={17}/> First visit only</span>
      <h2 id="setup-title">Let's get ready to play!</h2>
      <p>A grown-up can choose how challenging our puzzles should be. You can change this later in For Parents.</p>
      <div className="difficulty-options" role="group" aria-label="Puzzle size">
        {choices.map(choice => <button key={choice.id} type="button" aria-pressed={difficulty === choice.id} className={'difficulty-choice' + (difficulty === choice.id ? ' selected' : '')} onClick={() => setDifficulty(choice.id)}>
          <IllustrationIcon name={choice.illustration} size={48} decorative className="choice-illustration"/><strong>{choice.label}</strong><small>{choice.note}</small>
        </button>)}
      </div>
      <label className="toggle-row"><input type="checkbox" checked={hintsEnabled} onChange={e => setHints(e.target.checked)}/> Show friendly hints</label>
      <label className="toggle-row"><input type="checkbox" checked={soundEnabled} onChange={e => setSound(e.target.checked)}/> Play gentle sounds</label>
      <StoryButton onClick={() => onComplete({ ...DEFAULT_PREFERENCES, setupCompleted: true, difficulty, hintsEnabled, soundEnabled })}>Save & Start Playing</StoryButton>
      <small className="muted">Saved only in this browser · {PIECES_PER_SIDE[difficulty] ** 2} pieces per puzzle</small>
    </section>
  </div>;
}
