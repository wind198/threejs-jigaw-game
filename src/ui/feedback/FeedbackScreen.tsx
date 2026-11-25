import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { FeedbackMascot, type FeedbackKind } from './FeedbackMascot';

const copy = {
  loading: { title: 'Getting ready!', description: 'Your puzzle is waking up.' },
  error: { title: 'Oopsie!', description: 'Our puzzle needs a little help.' },
  'not-found': { title: 'A missing piece!', description: "We couldn't find this puzzle." },
};

export function FeedbackScreen({ kind, embedded = false, onRetry, animate = true }: {
  kind: FeedbackKind; embedded?: boolean; onRetry?: () => void; animate?: boolean;
}) {
  const loading = kind === 'loading';
  const Heading = embedded ? 'h2' : 'h1';
  const Wrapper = embedded ? 'div' : 'main';
  return <Wrapper className={'feedback-screen'+(embedded?' feedback-screen--embedded':'')} data-animate={animate}>
    <div className="feedback-content">
      <FeedbackMascot kind={kind}/>
      <div role={loading?'status':kind==='error'?'alert':undefined} aria-live={loading?'polite':undefined}>
        <Heading>{copy[kind].title}</Heading>
        <p>{copy[kind].description}</p>
      </div>
      {loading ? <div className="feedback-dots" aria-hidden="true"><span/><span/><span/></div> :
        <div className="feedback-actions">
          {kind==='error' && onRetry && <button type="button" className="story-button story-button--primary" onClick={onRetry}><RefreshCw aria-hidden/>Try again</button>}
          <Link className={'story-button story-button--'+(kind==='error'&&onRetry?'secondary':'primary')} href="/puzzles/"><ArrowLeft aria-hidden/>{kind==='not-found'?'Find a puzzle':'Back to puzzles'}</Link>
        </div>}
    </div>
  </Wrapper>;
}
