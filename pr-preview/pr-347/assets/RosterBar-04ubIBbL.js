import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,o as r,s as i}from"./roster-view-B1yTPTXl.js";function a({roster:e}){let t=i(e).filter(e=>e.pips.length>0),n=t.length>0;if(!n&&!e.trackRoster)return null;let a=t.reduce((e,t)=>e+t.pips.length,0),l=n?a:e.totalTarget,u=n?a-e.openSlots:e.playingAttending,d=l!=null&&u>=l,f=e.staffAttending>0?` +${e.staffAttending} staff`:``,p=(l==null?`${u} going`:`${u}/${l} ${n?`spots`:`going`}`)+f,m=l==null||l===0?null:Math.min(100,Math.round(u/l*100)),h=r(e);return(0,o.jsxs)(`div`,{className:`px-4 py-3`,children:[(0,o.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3 ${m==null&&!n?``:`mb-2`}`,children:[(0,o.jsx)(`span`,{className:`text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground`,children:`Roster`}),(0,o.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[(0,o.jsx)(`span`,{className:`font-display text-sm font-bold tabular-nums ${d?`text-green-dark`:`text-foreground`}`,children:p}),h&&(0,o.jsxs)(`span`,{className:`text-xs font-semibold ${c[h.tone]}`,children:[`· `,h.text]})]})]}),m!=null&&(0,o.jsx)(`div`,{"data-slot":`roster-track`,className:`h-1.5 overflow-hidden rounded-full bg-muted ${n?`mb-2.5`:``}`,children:(0,o.jsx)(`div`,{className:`h-full rounded-full bg-green transition-[width] duration-300 ease-out`,style:{width:`${m}%`}})}),n&&(0,o.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:t.map(e=>(0,o.jsxs)(`span`,{className:`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${s[e.tone??`short`]}`,children:[e.label,` `,e.countLabel]},e.id))})]})}var o,s,c;function l(){return(l=e((()=>{n(),o=t(),s={covered:`bg-green/10 text-green-dark`,short:`bg-gold/15 text-gold-dark`,critical:`bg-red/10 text-red`},c={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},a.__docgenInfo={description:`A compact roster overview: how full the squad is, a progress track, and a chip per targeted
position coloured by its tone. Sits high on the event detail page so completeness reads at a
glance — the thing a flat list loses. Chrome-free: the caller supplies the surrounding card.

Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
status: the chips come from \`rosterRows\`, the headline chip from \`rosterChip\`, and the counts are
server-owned (#219).

Three shapes, because a roster can be targeted in two different ways or not at all (#271 (6)):

  - **Positions targeted** — the fraction counts *slots*, and each position gets a chip.
  - **A headcount target only** — the fraction counts *playing people* against \`totalTarget\`. No
    chips: nothing is targeted per position, so there is nothing to list.
  - **A tally** — tracking on, nothing targeted. The plain count, and deliberately **no progress
    track**: a bar with no denominator would assert exactly the judgement \`rosterChip\` withholds
    for this state.

Only a roster with tracking switched off renders nothing — a social is not a roster event, and the
route falls back to the role breakdown. The two headcount shapes were missing until this page
caught up with the card: the card said "4 more needed", you tapped through, and the number was gone.`,methods:[],displayName:`RosterBar`,props:{roster:{required:!0,tsType:{name:`EventRoster`},description:``}}}})))()}export{l as n,a as t};