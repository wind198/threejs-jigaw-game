type Kind='loading'|'error'|'not-found';
const piece='M0 0H18C10 -16 38 -16 30 0H48V18C64 10 64 38 48 30V48H30C38 32 10 32 18 48H0V30C16 38 16 10 0 18Z';
/** The illustration itself communicates the state, independently of the label or color. */
export function StatusGraphic({kind}:{kind:Kind}){
 return <svg className="status-graphic" viewBox="0 0 180 148" aria-hidden="true" focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
  {kind==='loading'?<>
    <circle cx="90" cy="76" r="66" fill="#e5edda"/>
    <rect x="35" y="39" width="108" height="96" rx="9" fill="#af8059"/>
    <rect x="41" y="45" width="96" height="84" rx="4" fill="#faf5e8"/>
    <path d="M89 45V129M41 87H137" stroke="#cfb99a" strokeWidth="2" strokeDasharray="4 4"/>
    <path d={piece} transform="translate(43 47) scale(.88)" fill="#78a584" stroke="#426c50" strokeWidth="2"/>
    <path d={piece} transform="translate(43 87) scale(.88)" fill="#e9bc64" stroke="#a67b35" strokeWidth="2"/>
    <path d={piece} transform="translate(91 87) scale(.88)" fill="#92b7cb" stroke="#50788b" strokeWidth="2"/>
    <g className="status-assembling-piece"><path d={piece} transform="translate(91 47) scale(.88)" fill="#df987c" stroke="#a45b41" strokeWidth="2"/></g>
    <path d="M151 38v17m-6-6 6 6 6-6" stroke="#426c50" strokeWidth="3"/>
  </>:kind==='error'?<>
    <circle cx="90" cy="76" r="66" fill="#f3e0c9"/>
    <path d={piece} transform="translate(19 43) rotate(-12 24 24) scale(1.15)" fill="#df987c" stroke="#a45b41" strokeWidth="2.5"/>
    <path d={piece} transform="translate(109 40) rotate(14 24 24) scale(1.05)" fill="#92b7cb" stroke="#50788b" strokeWidth="2.5"/>
    <path d="M79 35l-8 12m29-12 7 12" stroke="#a45b41" strokeWidth="4"/>
    <circle cx="90" cy="103" r="31" fill="#faf5e8" stroke="#a45b41" strokeWidth="4"/>
    <path d="M90 85v21" stroke="#a45b41" strokeWidth="7"/>
    <circle cx="90" cy="116" r="3.8" fill="#a45b41"/>
  </>:<>
    <circle cx="90" cy="76" r="66" fill="#e3e9ef"/>
    <rect x="22" y="32" width="104" height="96" rx="9" fill="#af8059"/>
    <rect x="28" y="38" width="92" height="84" rx="4" fill="#faf5e8"/>
    <path d={piece} transform="translate(30 40) scale(.88)" fill="#78a584" stroke="#426c50" strokeWidth="2"/>
    <path d={piece} transform="translate(30 80) scale(.88)" fill="#e9bc64" stroke="#a67b35" strokeWidth="2"/>
    <path d={piece} transform="translate(76 80) scale(.88)" fill="#92b7cb" stroke="#50788b" strokeWidth="2"/>
    <path d={piece} transform="translate(76 40) scale(.88)" stroke="#8c9a9f" strokeWidth="2.6" strokeDasharray="4 4"/>
    <path d="M139 104l21 22" stroke="#426c50" strokeWidth="13"/>
    <circle cx="121" cy="85" r="29" fill="#faf5e8" fillOpacity=".92" stroke="#426c50" strokeWidth="5"/>
    <path d="M112 76c0-12 22-12 22 0 0 7-13 8-13 16" stroke="#426c50" strokeWidth="4"/>
    <circle cx="121" cy="102" r="2.8" fill="#426c50"/>
  </>}
 </svg>;
}
