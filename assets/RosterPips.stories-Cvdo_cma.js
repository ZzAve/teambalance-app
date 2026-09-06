import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,r as n}from"./event-fixtures-GLq-GGnS.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./RosterPips-B91zRMJ7.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),i(),o=r(),{expect:s}=__STORYBOOK_MODULE_TEST__,c=(e,t,n)=>({id:`pos-${e.toLowerCase()}`,label:e,required:t,attending:n}),l={title:`entities/event/RosterPips`,component:a,decorators:[e=>(0,o.jsx)(`div`,{className:`max-w-xs rounded-xl border border-border bg-card p-3.5`,children:(0,o.jsx)(e,{})})]},u={args:{roster:t({state:`LINEUP_SET`,openSlots:0,totalAttending:5,positions:[c(`Setter`,2,2),c(`Libero`,1,1),c(`Middle`,2,2)]})},play:async({canvas:e})=>{await s(e.getByText(`3 of 3 covered`)).toBeInTheDocument(),await s(e.getAllByText(`2/2`)).toHaveLength(2),await s(e.getByText(`1/1`)).toBeInTheDocument(),await s(e.queryByText(/the one to chase/)).not.toBeInTheDocument()}},d={args:{roster:t({state:`SPOTS_OPEN`,totalAttending:3,positions:[c(`Setter`,2,1),c(`Libero`,1,1),c(`Middle`,2,1)]})},play:async({canvas:e})=>{await s(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await s(e.queryByText(/the one to chase/)).not.toBeInTheDocument()}},f={args:{roster:t({state:`CRITICAL`,totalAttending:3,positions:[c(`Setter`,2,2),c(`Libero`,1,0),c(`Middle`,2,1)]})},play:async({canvas:e})=>{await s(e.getByText(/still has no one/)).toBeInTheDocument(),await s(e.getByText(`Libero`,{selector:`b`})).toBeInTheDocument(),await s(e.getByText(`0/1`)).toBeInTheDocument()}},p={args:{roster:t({state:`CRITICAL`,totalAttending:2,positions:[c(`Setter`,2,2),c(`Libero`,1,0),c(`Middle`,2,0)]})},play:async({canvas:e})=>{await s(e.getByText(`Libero and Middle`,{selector:`b`})).toBeInTheDocument(),await s(e.getByText(/still have no one/)).toBeInTheDocument(),await s(e.queryByText(/the one to chase/)).not.toBeInTheDocument()}},m={args:{roster:t({state:`CRITICAL`,totalAttending:0,positions:[c(`Diagonaal`,2,0),c(`Libero`,1,0),c(`Midden`,3,0),c(`Passer/Loper`,2,0),c(`Spelverdeler`,2,0),c(`Trainer/Coach`,1,0)]})},play:async({canvas:e})=>{await s(e.getByText(`6 positions`,{selector:`b`})).toBeInTheDocument(),await s(e.getByText(/still have no one/)).toBeInTheDocument(),await s(e.queryByText(/the one to chase/)).not.toBeInTheDocument(),await s(e.queryByText(`Diagonaal`,{selector:`b`})).not.toBeInTheDocument(),await s(e.getByText(`0 of 6 covered`)).toBeInTheDocument()}},h={args:{roster:t({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,positions:[c(`Setter`,void 0,4),c(`Middle`,void 0,2)]})},play:async({canvas:e})=>{await s(e.queryByText(/covered/)).not.toBeInTheDocument(),await s(e.getByText(`4`)).toBeInTheDocument(),await s(e.getByText(`6/10 going`)).toBeInTheDocument()}},g={args:{roster:t({state:`CRITICAL`,openSlots:1,totalAttending:5,positions:[c(`Setter`,2,5),c(`Libero`,1,0)]})},play:async({canvas:e})=>{await s(e.getByText(`+3`)).toBeInTheDocument(),await s(e.getByText(`5/2`)).toBeInTheDocument(),await s(e.getByText(/still has no one/)).toBeInTheDocument()}},_={args:{roster:t({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,unassignedAttending:6,positions:[]})},play:async({canvas:e})=>{await s(e.queryByText(`Nobody has answered yet.`)).not.toBeInTheDocument(),await s(e.getByText(`6 going haven't set a position`)).toBeInTheDocument(),await s(e.getByText(`6/10 going`)).toBeInTheDocument()}},v={args:{roster:t({state:`TALLY_ONLY`,openSlots:0,totalTarget:void 0,totalAttending:0,positions:[]})},play:async({canvas:e})=>{await s(e.getByText(`Nobody has answered yet.`)).toBeInTheDocument()}},y={args:{roster:t({state:`SPOTS_OPEN`,openSlots:5,totalAttending:7,positions:[c(`Squad`,12,7)]})},play:async({canvas:e})=>{await s(e.getByText(`7/12`)).toBeInTheDocument()}},b={args:{roster:t({state:`SPOTS_OPEN`,totalAttending:6,unassignedAttending:3,positions:[c(`Setter`,2,1),c(`Libero`,1,1),c(`Middle`,2,1)]})},play:async({canvas:e})=>{await s(e.getByText(`3 going haven't set a position`)).toBeInTheDocument(),await s(e.getByText(`1 of 3 covered`)).toBeInTheDocument()}},x={args:{roster:t({state:`SPOTS_OPEN`,openSlots:1,totalTarget:12,totalAttending:7,positions:[c(`Setter`,2,1),c(`Libero`,1,1)]})},play:async({canvas:e})=>{await s(e.getByText(`1 of 2 covered`)).toBeInTheDocument(),await s(e.getByText(`7/12 going`)).toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'LINEUP_SET',
      openSlots: 0,
      totalAttending: 5,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 2)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument();
    await expect(canvas.getAllByText('2/2')).toHaveLength(2);
    await expect(canvas.getByText('1/1')).toBeInTheDocument();
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      totalAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
    // Short, but nobody is missing entirely — so no callout.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 3,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
    await expect(canvas.getByText('Libero', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(canvas.getByText('0/1')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 2,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 0)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Libero and Middle', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(canvas.getByText(/still have no one/)).toBeInTheDocument();
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 0,
      positions: [pos('Diagonaal', 2, 0), pos('Libero', 1, 0), pos('Midden', 3, 0), pos('Passer/Loper', 2, 0), pos('Spelverdeler', 2, 0), pos('Trainer/Coach', 1, 0)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('6 positions', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(canvas.getByText(/still have no one/)).toBeInTheDocument();
    // No position is singled out, and none is called "the one".
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();
    await expect(canvas.queryByText('Diagonaal', {
      selector: 'b'
    })).not.toBeInTheDocument();
    await expect(canvas.getByText('0 of 6 covered')).toBeInTheDocument();
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
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument();
    await expect(canvas.getByText('4')).toBeInTheDocument();
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      totalAttending: 6,
      unassignedAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("3 going haven't set a position")).toBeInTheDocument();
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText('1 of 2 covered')).toBeInTheDocument();
    await expect(canvas.getByText('7/12 going')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S=[`LineupSet`,`SpotsOpen`,`Critical`,`TwoEmptyPositions`,`NothingAnsweredYet`,`HeadcountOnly`,`WithSurplus`,`AllAttendeesUnassigned`,`NobodyAttending`,`WithManySlots`,`WithUnassigned`,`BothAxes`]})))()}C();export{_ as AllAttendeesUnassigned,x as BothAxes,f as Critical,h as HeadcountOnly,u as LineupSet,v as NobodyAttending,m as NothingAnsweredYet,d as SpotsOpen,p as TwoEmptyPositions,y as WithManySlots,g as WithSurplus,b as WithUnassigned,S as __namedExportsOrder,l as default};