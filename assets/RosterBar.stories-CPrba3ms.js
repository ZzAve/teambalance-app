import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{r as t,s as n}from"./event-fixtures-CuRrQuRB.js";import{i as r,n as i,r as a}from"./roster-view-DD_aJHJx.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./SectionLabel-B5oFQ-GJ.js";function l({roster:e}){let t=r(e).filter(e=>e.pips.length>0),n=t.length>0;if(!n&&!e.trackRoster)return null;let i=t.reduce((e,t)=>e+t.pips.length,0),o=n?i:e.totalTarget,s=n?i-e.openSlots:e.playingAttending,l=o!=null&&s>=o,f=e.staffAttending>0?` +${e.staffAttending} staff`:``,p=(o==null?`${s} going`:`${s}/${o} ${n?`spots`:`going`}`)+f,m=o==null||o===0?null:Math.min(100,Math.round(s/o*100)),h=a(e);return(0,u.jsxs)(`div`,{className:`px-4 py-3`,children:[(0,u.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3 ${m==null?``:`mb-2`}`,children:[(0,u.jsx)(c,{as:`span`,children:`Roster`}),(0,u.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[(0,u.jsx)(`span`,{className:`font-display text-small font-bold tabular-nums ${l?`text-green-dark`:`text-foreground`}`,children:p}),h&&(0,u.jsxs)(`span`,{className:`text-caption font-semibold ${d[h.tone]}`,children:[`· `,h.text]})]})]}),m!=null&&(0,u.jsx)(`div`,{"data-slot":`roster-track`,className:`h-1.5 overflow-hidden rounded-full bg-muted`,children:(0,u.jsx)(`div`,{className:`h-full rounded-full bg-green transition-[width] duration-300 ease-out`,style:{width:`${m}%`}})})]})}var u,d;function f(){return(f=e((()=>{s(),i(),u=o(),d={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},l.__docgenInfo={description:`A compact roster overview: how full the squad is, a progress track, and a chip per targeted
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
caught up with the card: the card said "4 more needed", you tapped through, and the number was gone.`,methods:[],displayName:`RosterBar`,props:{roster:{required:!0,tsType:{name:`EventRoster`},description:``}}}})))()}var p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{t(),f(),p=o(),{expect:m}=__STORYBOOK_MODULE_TEST__,h={title:`entities/event/RosterBar`,component:l,args:{roster:n()},decorators:[e=>(0,p.jsx)(`div`,{className:`max-w-md overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,p.jsx)(e,{})})]},g={play:async({canvas:e})=>{await m(e.getByText(/4\/5 spots/)).toBeInTheDocument(),await m(e.getByText(/1 spot open/)).toBeInTheDocument(),await m(e.queryByText(/Middle/)).not.toBeInTheDocument()}},_={args:{roster:n({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:0,kind:`PLAYING`}],state:`CRITICAL`})},play:async({canvas:e})=>{await m(e.getByText(/Missing a position/)).toBeInTheDocument(),await m(e.queryByText(/Middle/)).not.toBeInTheDocument()}},v={args:{roster:n({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`}],state:`LINEUP_SET`})},play:async({canvas:e})=>{await m(e.getByText(/3\/3 spots/)).toBeInTheDocument(),await m(e.getByText(/Lineup set/)).toBeInTheDocument()}},y={args:{roster:n({positions:[],totalTarget:12,totalAttending:8,openSlots:4,state:`HEADCOUNT_SHORT`})},play:async({canvas:e})=>{await m(e.getByText(/8\/12 going/)).toBeInTheDocument(),await m(e.getByText(/4 more needed/)).toBeInTheDocument()}},b={args:{roster:n({positions:[],totalTarget:12,totalAttending:12,openSlots:0,state:`HEADCOUNT_FULL`})},play:async({canvas:e})=>{await m(e.getByText(/12\/12 going/)).toBeInTheDocument(),await m(e.getByText(/Full/)).toBeInTheDocument()}},x={args:{roster:n({positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`TALLY_ONLY`})},play:async({canvas:e,canvasElement:t})=>{await m(e.getByText(/8 going/)).toBeInTheDocument(),await m(e.queryByText(/\//)).not.toBeInTheDocument(),await m(t.querySelector(`[data-slot="roster-track"]`)).toBeNull()}},S={args:{roster:n({trackRoster:!1,positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`OFF`})},play:async({canvasElement:e})=>{await m(e.querySelector(`div`)?.textContent??``).toBe(``)}},C={args:{roster:n({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})},play:async({canvas:e})=>{await m(e.getByText(/11\/12 going \+1 staff/)).toBeInTheDocument(),await m(e.getByText(/1 more needed/)).toBeInTheDocument()}},w={args:{roster:n({state:`HEADCOUNT_FULL`,openSlots:0,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`PLAYING`}]})},play:async({canvas:e})=>{await m(e.getByText(/12\/12 going/)).toBeInTheDocument(),await m(e.getByText(/Full/)).toBeInTheDocument(),await m(e.queryByText(/staff/)).not.toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/4\\/5 spots/)).toBeInTheDocument();
    await expect(canvas.getByText(/1 spot open/)).toBeInTheDocument();
    // The bar states the event's verdict and nothing per position: naming Middle here would repeat
    // what the attendee list already says beside its own heading, three blocks further down.
    await expect(canvas.queryByText(/Middle/)).not.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2,
        kind: 'PLAYING'
      }, {
        id: 'pos-middle',
        label: 'Middle',
        required: 2,
        attending: 0,
        kind: 'PLAYING'
      }],
      state: 'CRITICAL'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/Missing a position/)).toBeInTheDocument();
    await expect(canvas.queryByText(/Middle/)).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2,
        kind: 'PLAYING'
      }, {
        id: 'pos-libero',
        label: 'Libero',
        required: 1,
        attending: 1,
        kind: 'PLAYING'
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 1,
      totalTarget: 12,
      totalAttending: 12,
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: undefined,
        attending: 11,
        kind: 'PLAYING'
      }, {
        id: 'pos-trainer',
        label: 'Trainer',
        required: undefined,
        attending: 1,
        kind: 'STAFF'
      }]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/11\\/12 going \\+1 staff/)).toBeInTheDocument();
    await expect(canvas.getByText(/1 more needed/)).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_FULL',
      openSlots: 0,
      totalTarget: 12,
      totalAttending: 12,
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: undefined,
        attending: 11,
        kind: 'PLAYING'
      }, {
        id: 'pos-trainer',
        label: 'Trainer',
        required: undefined,
        attending: 1,
        kind: 'PLAYING'
      }]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/12\\/12 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/Full/)).toBeInTheDocument();
    // No staff suffix: nobody attending holds a staff position.
    await expect(canvas.queryByText(/staff/)).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T=[`OneSpotOpen`,`Critical`,`LineupSet`,`HeadcountTarget`,`HeadcountFull`,`TallyOnly`,`TrackingOff`,`WithStaffAttending`,`WithStaffNotYetMarked`]})))()}E();export{_ as Critical,b as HeadcountFull,y as HeadcountTarget,v as LineupSet,g as OneSpotOpen,x as TallyOnly,S as TrackingOff,C as WithStaffAttending,w as WithStaffNotYetMarked,T as __namedExportsOrder,h as default};