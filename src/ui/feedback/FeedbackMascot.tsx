export type FeedbackKind = 'error' | 'not-found';

export function FeedbackMascot({kind}: {kind: FeedbackKind}) {
  const error=kind==='error';
  const color=error?'#e8b17e':'#a1bed3';
  return <svg className="feedback-mascot" viewBox="0 0 280 200" aria-hidden="true" focusable="false">
    <ellipse cx="140" cy="177" rx="93" ry="11" fill="#af8059" opacity=".15"/>
    <g className="feedback-sparkles" fill="#e9bc64">
      <path d="M32 27l5 12 12 5-12 5-5 12-5-12-12-5 12-5z"/>
      <path d="M241 15l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/>
      <circle cx="255" cy="111" r="5" fill="#aca0c7"/>
      <circle cx="24" cy="133" r="4" fill="#d99982"/>
    </g>
    <g className="feedback-character">
      <g transform="translate(64 61) rotate(-8 63 54)">
        <path d="M0 0H42C30-30 77-30 65 0H119V39C89 26 89 78 119 65V119H76C89 90 35 90 48 119H0V78C29 90 29 38 0 51Z" fill={color} stroke="#526b56" strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="40" cy="46" r="4.5" fill="#29483b"/>
        <circle cx="75" cy="46" r="4.5" fill="#29483b"/>
        <ellipse cx="27" cy="61" rx="9" ry="5" fill="#e29b8a"/>
        <ellipse cx="88" cy="61" rx="9" ry="5" fill="#e29b8a"/>
        {error?<path d="M48 70Q58 59 68 70M34 34L43 37M72 37L81 34" stroke="#29483b" strokeWidth="3" strokeLinecap="round" fill="none"/>:<ellipse cx="58" cy="66" rx="6" ry="8" fill="#29483b"/>}
      </g>
      {error?<g transform="translate(208 45)"><path d="M0 0Q24 25 4 34Q-14 27 0 0Z" fill="#a1bed3"/><path d="M-13 45L-23 55M15 44L25 55" stroke="#af8059" strokeWidth="3" strokeLinecap="round"/></g>:<g transform="rotate(-30 207 113)"><rect x="201" y="134" width="14" height="42" rx="7" fill="#af8059"/><circle cx="208" cy="109" r="30" fill="#e6f1ee" fillOpacity=".8" stroke="#af8059" strokeWidth="8"/><path d="M190 108Q192 94 205 92" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/></g>}
    </g>
  </svg>;
}
