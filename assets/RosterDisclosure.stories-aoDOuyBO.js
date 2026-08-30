import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,n as r,t as i}from"./event-fixtures-HgN_WguE.js";import{n as a,t as o}from"./RosterDisclosure-DVei6r71.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{r(),a(),s=t(),{expect:c}=__STORYBOOK_MODULE_TEST__,l=(e,t,n)=>({id:`pos-${e.toLowerCase()}`,label:e,required:t,attending:n}),u=n({state:`LINEUP_SET`,openSlots:0,totalAttending:5,positions:[l(`Setter`,2,2),l(`Libero`,1,1),l(`Middle`,2,2)]}),d={title:`entities/event/RosterDisclosure`,component:o,args:{roster:u,defaultOpen:!0},decorators:[e=>(0,s.jsxs)(`div`,{className:`flex max-w-md flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3.5`,children:[(0,s.jsx)(`span`,{className:`rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green`,children:`✓ 5 going`}),(0,s.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`of 12`}),(0,s.jsx)(e,{})]})]},f={play:async({canvas:e})=>{await c(e.getByText(`Lineup set`)).toBeInTheDocument(),await c(e.getByText(`3 of 3 covered`)).toBeInTheDocument(),await c(e.getAllByText(`2/2`)).toHaveLength(2),await c(e.getByText(`1/1`)).toBeInTheDocument(),await c(e.queryByText(/the one to chase/)).not.toBeInTheDocument()}},p={args:{roster:n({state:`SPOTS_OPEN`,openSlots:2,totalAttending:3,positions:[l(`Setter`,2,1),l(`Libero`,1,1),l(`Middle`,2,1)]})},play:async({canvas:e})=>{await c(e.getByText(`2 spots open`)).toBeInTheDocument(),await c(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await c(e.queryByText(/the one to chase/)).not.toBeInTheDocument()}},m={args:{roster:n({state:`CRITICAL`,openSlots:2,totalAttending:3,positions:[l(`Setter`,2,2),l(`Libero`,1,0),l(`Middle`,2,1)]})},play:async({canvas:e})=>{await c(e.getByText(`2 spots open`)).toBeInTheDocument(),await c(e.getByText(/still has no one/)).toBeInTheDocument(),await c(e.getByText(`Libero`,{selector:`b`})).toBeInTheDocument(),await c(e.getByText(`0/1`)).toBeInTheDocument()}},h={args:{roster:n({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,positions:[l(`Setter`,void 0,4),l(`Middle`,void 0,2)]})},play:async({canvas:e})=>{await c(e.getByText(`4 more needed`)).toBeInTheDocument(),await c(e.queryByText(/covered/)).not.toBeInTheDocument(),await c(e.getByText(`4`)).toBeInTheDocument(),await c(e.getByText(`6/10 going`)).toBeInTheDocument()}},g={args:{roster:n({state:`HEADCOUNT_FULL`,openSlots:0,totalTarget:6,totalAttending:6,positions:[l(`Setter`,void 0,6)]})},play:async({canvas:e})=>{await c(e.getByText(`Full`)).toBeInTheDocument()}},_={args:{roster:n({state:`TALLY_ONLY`,openSlots:0,totalTarget:void 0,totalAttending:5,positions:[l(`Setter`,void 0,2),l(`Middle`,void 0,3)]})},play:async({canvas:e})=>{await c(e.getByText(`Positions`,{selector:`span.text-xs`})).toBeInTheDocument(),await c(e.queryByText(/spots open/)).not.toBeInTheDocument(),await c(e.queryByText(/covered/)).not.toBeInTheDocument(),await c(e.getByText(`3`)).toBeInTheDocument()}},v={args:{roster:i},play:async({canvas:e})=>{await c(e.queryByRole(`button`)).not.toBeInTheDocument(),await c(e.queryByText(`Positions`)).not.toBeInTheDocument()}},y={args:{roster:n({state:`CRITICAL`,openSlots:1,totalAttending:5,positions:[l(`Setter`,2,5),l(`Libero`,1,0)]})},play:async({canvas:e})=>{await c(e.getByText(`+3`)).toBeInTheDocument(),await c(e.getByText(`5/2`)).toBeInTheDocument(),await c(e.getByText(`1 spot open`)).toBeInTheDocument(),await c(e.getByText(/still has no one/)).toBeInTheDocument()}},b={args:{roster:n({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,unassignedAttending:6,positions:[]})},play:async({canvas:e})=>{await c(e.queryByText(`Nobody has answered yet.`)).not.toBeInTheDocument(),await c(e.getByText(`6 going haven't set a position`)).toBeInTheDocument(),await c(e.getByText(`6/10 going`)).toBeInTheDocument()}},x={args:{roster:n({state:`TALLY_ONLY`,openSlots:0,totalTarget:void 0,totalAttending:0,positions:[]})},play:async({canvas:e})=>{await c(e.getByText(`Nobody has answered yet.`)).toBeInTheDocument()}},S={args:{roster:n({state:`SPOTS_OPEN`,openSlots:5,totalAttending:7,positions:[l(`Squad`,12,7)]})},play:async({canvas:e})=>{await c(e.getByText(`7/12`)).toBeInTheDocument(),await c(e.getByText(`5 spots open`)).toBeInTheDocument()}},C={args:{roster:n({state:`SPOTS_OPEN`,openSlots:2,totalAttending:6,unassignedAttending:3,positions:[l(`Setter`,2,1),l(`Libero`,1,1),l(`Middle`,2,1)]})},play:async({canvas:e})=>{await c(e.getByText(`3 going haven't set a position`)).toBeInTheDocument(),await c(e.getByText(`2 spots open`)).toBeInTheDocument(),await c(e.getByText(`1 of 3 covered`)).toBeInTheDocument()}},w={args:{roster:n({state:`SPOTS_OPEN`,openSlots:1,totalTarget:12,totalAttending:7,positions:[l(`Setter`,2,1),l(`Libero`,1,1)]})},play:async({canvas:e})=>{await c(e.getByText(`1 spot open`)).toBeInTheDocument(),await c(e.getByText(`1 of 2 covered`)).toBeInTheDocument(),await c(e.getByText(`7/12 going`)).toBeInTheDocument()}},T={args:{defaultOpen:!1},play:async({canvas:e,userEvent:t})=>{let n=e.getByRole(`button`,{name:/Show positions/});await c(n).toHaveAttribute(`aria-expanded`,`false`),await c(e.getByText(`Lineup set`)).toBeInTheDocument(),await c(e.queryByText(`3 of 3 covered`)).not.toBeInTheDocument(),await t.click(n),await c(e.getByRole(`button`,{name:/Hide positions/})).toHaveAttribute(`aria-expanded`,`true`),await c(e.getByText(`3 of 3 covered`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Hide positions/})),await c(e.queryByText(`3 of 3 covered`)).not.toBeInTheDocument()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument();
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument();
    // Setter and Middle both read 2/2; Libero is the 1/1.
    await expect(canvas.getAllByText('2/2')).toHaveLength(2);
    await expect(canvas.getByText('1/1')).toBeInTheDocument();
    // Everyone is covered, so nobody is the one to chase.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 2,
      totalAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
    // Short, but nobody is missing entirely — so no callout.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      openSlots: 2,
      totalAttending: 3,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
    await expect(canvas.getByText('Libero', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(canvas.getByText('0/1')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 4,
      totalTarget: 10,
      totalAttending: 6,
      positions: [pos('Setter', undefined, 4), pos('Middle', undefined, 2)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('4 more needed')).toBeInTheDocument();
    // No position carries a target, so there is no covered fraction and no pips — plain counts only.
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument();
    await expect(canvas.getByText('4')).toBeInTheDocument();
    // With no fraction to show, the header carries the absolute headcount instead.
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_FULL',
      openSlots: 0,
      totalTarget: 6,
      totalAttending: 6,
      positions: [pos('Setter', undefined, 6)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Full')).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalTarget: undefined,
      totalAttending: 5,
      positions: [pos('Setter', undefined, 2), pos('Middle', undefined, 3)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Positions', {
      selector: 'span.text-xs'
    })).toBeInTheDocument();
    await expect(canvas.queryByText(/spots open/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument();
    await expect(canvas.getByText('3')).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      openSlots: 1,
      totalAttending: 5,
      positions: [pos('Setter', 2, 5), pos('Libero', 1, 0)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('+3')).toBeInTheDocument();
    await expect(canvas.getByText('5/2')).toBeInTheDocument();
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 4,
      totalTarget: 10,
      totalAttending: 6,
      unassignedAttending: 6,
      positions: []
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByText('Nobody has answered yet.')).not.toBeInTheDocument();
    await expect(canvas.getByText("6 going haven't set a position")).toBeInTheDocument();
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalTarget: undefined,
      totalAttending: 0,
      positions: []
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Nobody has answered yet.')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 5,
      totalAttending: 7,
      positions: [pos('Squad', 12, 7)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('7/12')).toBeInTheDocument();
    await expect(canvas.getByText('5 spots open')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      // Setter is 1 short and Middle is 1 short, so the chip reads 2 — NOT 1. The three unassigned
      // attendees cannot close either gap: nobody knows what they would play, which is the whole
      // point of this story. They raise the headcount and drive the nudge, and that is all.
      openSlots: 2,
      totalAttending: 6,
      unassignedAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("3 going haven't set a position")).toBeInTheDocument();
    // Pinned as an assertion, not left to the snapshot: the chip must report every unmet slot, and
    // the unassigned three must not be silently credited against them.
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 1,
      totalTarget: 12,
      totalAttending: 7,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
    await expect(canvas.getByText('1 of 2 covered')).toBeInTheDocument();
    await expect(canvas.getByText('7/12 going')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    const toggle = canvas.getByRole('button', {
      name: /Show positions/
    });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument();
    await expect(canvas.queryByText('3 of 3 covered')).not.toBeInTheDocument();
    await userEvent.click(toggle);
    await expect(canvas.getByRole('button', {
      name: /Hide positions/
    })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument();

    // …and back, so the affordance is a real toggle rather than a one-way reveal.
    await userEvent.click(canvas.getByRole('button', {
      name: /Hide positions/
    }));
    await expect(canvas.queryByText('3 of 3 covered')).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E=[`LineupSet`,`SpotsOpen`,`Critical`,`HeadcountOnly`,`HeadcountFull`,`TallyOnly`,`Off`,`WithSurplus`,`AllAttendeesUnassigned`,`NobodyAttending`,`WithManySlots`,`WithUnassigned`,`BothAxes`,`CollapsedByDefault`]})))()}D();export{b as AllAttendeesUnassigned,w as BothAxes,T as CollapsedByDefault,m as Critical,g as HeadcountFull,h as HeadcountOnly,f as LineupSet,x as NobodyAttending,v as Off,p as SpotsOpen,_ as TallyOnly,S as WithManySlots,y as WithSurplus,C as WithUnassigned,E as __namedExportsOrder,d as default};