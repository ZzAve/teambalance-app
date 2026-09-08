import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,r as n}from"./event-fixtures-GLq-GGnS.js";import{a as r,o as i,s as a}from"./roster-view-jxUVV2ru.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";function s({roster:e}){let t=a(e).filter(e=>e.pips.length>0),n=t.length>0;if(!n&&!e.trackRoster)return null;let r=t.reduce((e,t)=>e+t.pips.length,0),o=n?r:e.totalTarget,s=n?r-e.openSlots:e.totalAttending,d=o!=null&&s>=o,f=o==null?`${s} going`:`${s}/${o} ${n?`spots`:`going`}`,p=o==null||o===0?null:Math.min(100,Math.round(s/o*100)),m=i(e);return(0,c.jsxs)(`div`,{className:`border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3`,children:[(0,c.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3 ${p==null&&!n?``:`mb-2`}`,children:[(0,c.jsx)(`span`,{className:`text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground`,children:`Roster`}),(0,c.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[(0,c.jsx)(`span`,{className:`font-display text-sm font-bold tabular-nums ${d?`text-green-dark`:`text-foreground`}`,children:f}),m&&(0,c.jsxs)(`span`,{className:`text-xs font-semibold ${u[m.tone]}`,children:[`· `,m.text]})]})]}),p!=null&&(0,c.jsx)(`div`,{"data-slot":`roster-track`,className:`h-1.5 overflow-hidden rounded-full bg-muted ${n?`mb-2.5`:``}`,children:(0,c.jsx)(`div`,{className:`h-full rounded-full bg-green transition-[width] duration-300 ease-out`,style:{width:`${p}%`}})}),n&&(0,c.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:t.map(e=>(0,c.jsxs)(`span`,{className:`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${l[e.tone??`short`]}`,children:[e.label,` `,e.countLabel]},e.id))})]})}var c,l,u;function d(){return(d=e((()=>{r(),c=o(),l={covered:`bg-green/10 text-green-dark`,short:`bg-gold/15 text-gold-dark`,critical:`bg-red/10 text-red`},u={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},s.__docgenInfo={description:`A compact, always-visible roster overview: how full the squad is, a progress track, and a chip per
targeted position coloured by its tone. Meant to be pinned above the attendee list so completeness
stays one glance away however far you scroll a large squad — the thing a flat list loses.

Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
status: the chips come from \`rosterRows\`, the headline chip from \`rosterChip\`, and the counts are
server-owned (#219).

Three shapes, because a roster can be targeted in two different ways or not at all (#271 (6)):

  - **Positions targeted** — the fraction counts *slots*, and each position gets a chip.
  - **A headcount target only** — the fraction counts *people* against \`totalTarget\`. No chips:
    nothing is targeted per position, so there is nothing to list.
  - **A tally** — tracking on, nothing targeted. The plain count, and deliberately **no progress
    track**: a bar with no denominator would assert exactly the judgement \`rosterChip\` withholds
    for this state.

Only a roster with tracking switched off renders nothing — a social is not a roster event, and the
route falls back to the role breakdown. The two headcount shapes were missing until this page
caught up with the card: the card said "4 more needed", you tapped through, and the number was gone.`,methods:[],displayName:`RosterBar`,props:{roster:{required:!0,tsType:{name:`EventRoster`},description:``}}}})))()}var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),d(),f=o(),{expect:p}=__STORYBOOK_MODULE_TEST__,m={title:`entities/event/RosterBar`,component:s,args:{roster:t()},decorators:[e=>(0,f.jsx)(`div`,{className:`max-w-md`,children:(0,f.jsx)(e,{})})]},h={play:async({canvas:e})=>{await p(e.getByText(/4\/5 spots/)).toBeInTheDocument(),await p(e.getByText(/1 spot open/)).toBeInTheDocument(),await p(e.getByText(/Middle 1\/2/)).toBeInTheDocument()}},g={args:{roster:t({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-middle`,label:`Middle`,required:2,attending:0}],state:`CRITICAL`})},play:async({canvas:e})=>{await p(e.getByText(/2 spots open/)).toBeInTheDocument(),await p(e.getByText(/Middle 0\/2/)).toBeInTheDocument()}},_={args:{roster:t({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-libero`,label:`Libero`,required:1,attending:1}],state:`LINEUP_SET`})},play:async({canvas:e})=>{await p(e.getByText(/3\/3 spots/)).toBeInTheDocument(),await p(e.getByText(/Lineup set/)).toBeInTheDocument()}},v={args:{roster:t({positions:[],totalTarget:12,totalAttending:8,openSlots:4,state:`HEADCOUNT_SHORT`})},play:async({canvas:e})=>{await p(e.getByText(/8\/12 going/)).toBeInTheDocument(),await p(e.getByText(/4 more needed/)).toBeInTheDocument()}},y={args:{roster:t({positions:[],totalTarget:12,totalAttending:12,openSlots:0,state:`HEADCOUNT_FULL`})},play:async({canvas:e})=>{await p(e.getByText(/12\/12 going/)).toBeInTheDocument(),await p(e.getByText(/Full/)).toBeInTheDocument()}},b={args:{roster:t({positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`TALLY_ONLY`})},play:async({canvas:e,canvasElement:t})=>{await p(e.getByText(/8 going/)).toBeInTheDocument(),await p(e.queryByText(/\//)).not.toBeInTheDocument(),await p(t.querySelector(`[data-slot="roster-track"]`)).toBeNull()}},x={args:{roster:t({trackRoster:!1,positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`OFF`})},play:async({canvasElement:e})=>{await p(e.querySelector(`div`)?.textContent??``).toBe(``)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/4\\/5 spots/)).toBeInTheDocument();
    await expect(canvas.getByText(/1 spot open/)).toBeInTheDocument();
    await expect(canvas.getByText(/Middle 1\\/2/)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2
      }, {
        id: 'pos-middle',
        label: 'Middle',
        required: 2,
        attending: 0
      }],
      state: 'CRITICAL'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/2 spots open/)).toBeInTheDocument();
    await expect(canvas.getByText(/Middle 0\\/2/)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2
      }, {
        id: 'pos-libero',
        label: 'Libero',
        required: 1,
        attending: 1
      }],
      state: 'LINEUP_SET'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/3\\/3 spots/)).toBeInTheDocument();
    await expect(canvas.getByText(/Lineup set/)).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: 12,
      totalAttending: 8,
      openSlots: 4,
      state: 'HEADCOUNT_SHORT'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/8\\/12 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/4 more needed/)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: 12,
      totalAttending: 12,
      openSlots: 0,
      state: 'HEADCOUNT_FULL'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/12\\/12 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/Full/)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: undefined,
      totalAttending: 8,
      openSlots: 0,
      state: 'TALLY_ONLY'
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    await expect(canvas.getByText(/8 going/)).toBeInTheDocument();
    await expect(canvas.queryByText(/\\//)).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-slot="roster-track"]')).toBeNull();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      trackRoster: false,
      positions: [],
      totalTarget: undefined,
      totalAttending: 8,
      openSlots: 0,
      state: 'OFF'
    })
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelector('div')?.textContent ?? '').toBe('');
  }
}`,...x.parameters?.docs?.source}}},S=[`OneSpotOpen`,`Critical`,`LineupSet`,`HeadcountTarget`,`HeadcountFull`,`TallyOnly`,`TrackingOff`]})))()}C();export{g as Critical,y as HeadcountFull,v as HeadcountTarget,_ as LineupSet,h as OneSpotOpen,b as TallyOnly,x as TrackingOff,S as __namedExportsOrder,m as default};