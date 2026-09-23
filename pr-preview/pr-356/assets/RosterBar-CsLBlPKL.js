import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,n as r,r as i}from"./roster-view-DD_aJHJx.js";import{n as a,t as o}from"./SectionLabel-B5oFQ-GJ.js";function s({roster:e}){let t=n(e).filter(e=>e.pips.length>0),r=t.length>0;if(!r&&!e.trackRoster)return null;let a=t.reduce((e,t)=>e+t.pips.length,0),s=r?a:e.totalTarget,u=r?a-e.openSlots:e.playingAttending,d=s!=null&&u>=s,f=e.staffAttending>0?` +${e.staffAttending} staff`:``,p=(s==null?`${u} going`:`${u}/${s} ${r?`spots`:`going`}`)+f,m=s==null||s===0?null:Math.min(100,Math.round(u/s*100)),h=i(e);return(0,c.jsxs)(`div`,{className:`px-4 py-3`,children:[(0,c.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3 ${m==null?``:`mb-2`}`,children:[(0,c.jsx)(o,{as:`span`,children:`Roster`}),(0,c.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[(0,c.jsx)(`span`,{className:`font-display text-small font-bold tabular-nums ${d?`text-green-dark`:`text-foreground`}`,children:p}),h&&(0,c.jsxs)(`span`,{className:`text-caption font-semibold ${l[h.tone]}`,children:[`· `,h.text]})]})]}),m!=null&&(0,c.jsx)(`div`,{"data-slot":`roster-track`,className:`h-1.5 overflow-hidden rounded-full bg-muted`,children:(0,c.jsx)(`div`,{className:`h-full rounded-full bg-green transition-[width] duration-300 ease-out`,style:{width:`${m}%`}})})]})}var c,l;function u(){return(u=e((()=>{a(),r(),c=t(),l={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},s.__docgenInfo={description:`A compact roster overview: how full the squad is, a progress track, and a chip per targeted
position coloured by its tone. Sits high on the event detail page so completeness reads at a
glance — the thing a flat list loses. Chrome-free: the caller supplies the surrounding card.

Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
status: the headline chip comes from \`rosterChip\` and the counts are server-owned (#219).

**It states the event-level verdict only.** It used to also print a chip per position, which the
attendee list below then repeated as a fraction beside every heading — the same fact twice, three
blocks apart. The per-position verdict now lives with the people it describes; what stays here is
the thing no single position can tell you.

Three shapes, because a roster can be targeted in two different ways or not at all (#271 (6)):

  - **Positions targeted** — the fraction counts *slots*, and each position gets a chip.
  - **A headcount target only** — the fraction counts *playing people* against \`totalTarget\`. No
    chips: nothing is targeted per position, so there is nothing to list.
  - **A tally** — tracking on, nothing targeted. The plain count, and deliberately **no progress
    track**: a bar with no denominator would assert exactly the judgement \`rosterChip\` withholds
    for this state.

Only a roster with tracking switched off renders nothing — a social is not a roster event, and the
route falls back to the role breakdown. The two headcount shapes were missing until this page
caught up with the card: the card said "4 more needed", you tapped through, and the number was gone.`,methods:[],displayName:`RosterBar`,props:{roster:{required:!0,tsType:{name:`EventRoster`},description:``}}}})))()}export{u as n,s as t};