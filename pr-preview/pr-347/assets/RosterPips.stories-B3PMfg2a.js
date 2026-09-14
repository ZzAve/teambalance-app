import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{r as i,s as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./RosterPips-hBeiV_XS.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{i(),n(),o(),c=t(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d=(e,t,n,r=`PLAYING`)=>({id:`pos-${e.toLowerCase()}`,label:e,required:t,attending:n,kind:r}),f=`max-w-xs rounded-xl border border-border bg-card p-3.5`,p={title:`entities/event/RosterPips`,component:s},m={args:{roster:a()},render:()=>(0,c.jsx)(r,{items:{"Lineup set":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`LINEUP_SET`,openSlots:0,totalAttending:5,positions:[d(`Setter`,2,2),d(`Libero`,1,1),d(`Middle`,2,2)]})})}),"Spots open":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`SPOTS_OPEN`,totalAttending:3,positions:[d(`Setter`,2,1),d(`Libero`,1,1),d(`Middle`,2,1)]})})}),Critical:(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`CRITICAL`,totalAttending:3,positions:[d(`Setter`,2,2),d(`Libero`,1,0),d(`Middle`,2,1)]})})}),"Two empty positions":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`CRITICAL`,totalAttending:2,positions:[d(`Setter`,2,2),d(`Libero`,1,0),d(`Middle`,2,0)]})})}),"Nothing answered yet":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`CRITICAL`,totalAttending:0,positions:[d(`Diagonaal`,2,0),d(`Libero`,1,0),d(`Midden`,3,0),d(`Passer/Loper`,2,0),d(`Spelverdeler`,2,0),d(`Trainer/Coach`,1,0)]})})}),"Headcount only":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,positions:[d(`Setter`,void 0,4),d(`Middle`,void 0,2)]})})}),"With surplus":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`CRITICAL`,openSlots:1,totalAttending:5,positions:[d(`Setter`,2,5),d(`Libero`,1,0)]})})}),"All attendees unassigned":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`HEADCOUNT_SHORT`,openSlots:4,totalTarget:10,totalAttending:6,unassignedAttending:6,positions:[]})})}),"Nobody attending":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`TALLY_ONLY`,openSlots:0,totalTarget:void 0,totalAttending:0,positions:[]})})}),"With many slots":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`SPOTS_OPEN`,openSlots:5,totalAttending:7,positions:[d(`Squad`,12,7)]})})}),"With unassigned":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`SPOTS_OPEN`,totalAttending:6,unassignedAttending:3,positions:[d(`Setter`,2,1),d(`Libero`,1,1),d(`Middle`,2,1)]})})}),"Both axes":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`SPOTS_OPEN`,openSlots:1,totalTarget:12,totalAttending:7,positions:[d(`Setter`,2,1),d(`Libero`,1,1)]})})}),"With staff attending":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[d(`Setter`,void 0,11),d(`Trainer`,void 0,1,`STAFF`)]})})}),"With staff and position targets":(0,c.jsx)(`div`,{className:f,children:(0,c.jsx)(s,{roster:a({state:`LINEUP_SET`,totalTarget:6,totalAttending:4,positions:[d(`Setter`,2,2),d(`Libero`,1,1),d(`Trainer`,void 0,1,`STAFF`)]})})})}}),play:async({canvas:e})=>{let t=t=>u(e.getByRole(`region`,{name:t}));await l(t(`Lineup set`).getByText(`3 of 3 covered`)).toBeInTheDocument(),await l(t(`Lineup set`).getAllByText(`2/2`)).toHaveLength(2),await l(t(`Lineup set`).getByText(`1/1`)).toBeInTheDocument(),await l(t(`Lineup set`).queryByText(/the one to chase/)).not.toBeInTheDocument(),await l(t(`Spots open`).getByText(`1 of 3 covered`)).toBeInTheDocument(),await l(t(`Spots open`).queryByText(/the one to chase/)).not.toBeInTheDocument(),await l(t(`Critical`).getByText(/still has no one/)).toBeInTheDocument(),await l(t(`Critical`).getByText(`Libero`,{selector:`b`})).toBeInTheDocument(),await l(t(`Critical`).getByText(`0/1`)).toBeInTheDocument(),await l(t(`Two empty positions`).getByText(`Libero and Middle`,{selector:`b`})).toBeInTheDocument(),await l(t(`Two empty positions`).getByText(/still have no one/)).toBeInTheDocument(),await l(t(`Two empty positions`).queryByText(/the one to chase/)).not.toBeInTheDocument(),await l(t(`Nothing answered yet`).getByText(`6 positions`,{selector:`b`})).toBeInTheDocument(),await l(t(`Nothing answered yet`).getByText(/still have no one/)).toBeInTheDocument(),await l(t(`Nothing answered yet`).queryByText(/the one to chase/)).not.toBeInTheDocument(),await l(t(`Nothing answered yet`).queryByText(`Diagonaal`,{selector:`b`})).not.toBeInTheDocument(),await l(t(`Nothing answered yet`).getByText(`0 of 6 covered`)).toBeInTheDocument(),await l(t(`Headcount only`).queryByText(/covered/)).not.toBeInTheDocument(),await l(t(`Headcount only`).getByText(`4`)).toBeInTheDocument(),await l(t(`Headcount only`).getByText(`6/10 going`)).toBeInTheDocument(),await l(t(`With surplus`).getByText(`+3`)).toBeInTheDocument(),await l(t(`With surplus`).getByText(`5/2`)).toBeInTheDocument(),await l(t(`With surplus`).getByText(/still has no one/)).toBeInTheDocument(),await l(t(`All attendees unassigned`).queryByText(`Nobody has answered yet.`)).not.toBeInTheDocument(),await l(t(`All attendees unassigned`).getByText(`6 going haven't set a position`)).toBeInTheDocument(),await l(t(`All attendees unassigned`).getByText(`6/10 going`)).toBeInTheDocument(),await l(t(`Nobody attending`).getByText(`Nobody has answered yet.`)).toBeInTheDocument(),await l(t(`With many slots`).getByText(`7/12`)).toBeInTheDocument(),await l(t(`With unassigned`).getByText(`3 going haven't set a position`)).toBeInTheDocument(),await l(t(`With unassigned`).getByText(`1 of 3 covered`)).toBeInTheDocument(),await l(t(`Both axes`).getByText(`1 of 2 covered`)).toBeInTheDocument(),await l(t(`Both axes`).getByText(`7/12 going`)).toBeInTheDocument(),await l(t(`With staff attending`).getByText(`11/12 going`)).toBeInTheDocument(),await l(t(`With staff attending`).getByText(`1 staff also going, not counted toward the target`)).toBeInTheDocument(),await l(t(`With staff attending`).getByText(`Trainer`)).toBeInTheDocument(),await l(t(`With staff and position targets`).getByText(`2 of 2 covered`)).toBeInTheDocument(),await l(t(`With staff and position targets`).getByText(`3/6 going`)).toBeInTheDocument(),await l(t(`With staff and position targets`).getByText(`1 staff also going, not counted toward the target`)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster()
  },
  render: () => <Stack items={{
    'Lineup set': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'LINEUP_SET',
        openSlots: 0,
        totalAttending: 5,
        positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 2)]
      })} />
          </div>,
    'Spots open': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'SPOTS_OPEN',
        totalAttending: 3,
        positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
      })} />
          </div>,
    // The red case: a position with nobody at all earns the "one to chase" callout.
    Critical: <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'CRITICAL',
        totalAttending: 3,
        positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)]
      })} />
          </div>,
    // Two empty positions are still worth naming, but "the one to chase" must not survive: a
    // definite article claiming uniqueness tells you the other one is covered.
    'Two empty positions': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'CRITICAL',
        totalAttending: 2,
        positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 0)]
      })} />
          </div>,
    // The reported case: nobody has answered, so every targeted position is empty. Naming the
    // first one claimed the other five were fine — from three up the count is the news, and the
    // rows above already list which ones.
    'Nothing answered yet': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'CRITICAL',
        totalAttending: 0,
        positions: [pos('Diagonaal', 2, 0), pos('Libero', 1, 0), pos('Midden', 3, 0), pos('Passer/Loper', 2, 0), pos('Spelverdeler', 2, 0), pos('Trainer/Coach', 1, 0)]
      })} />
          </div>,
    // No position carries a target, so there is no covered fraction and no pips — the header
    // carries the absolute headcount instead.
    'Headcount only': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'HEADCOUNT_SHORT',
        openSlots: 4,
        totalTarget: 10,
        totalAttending: 6,
        positions: [pos('Setter', undefined, 4), pos('Middle', undefined, 2)]
      })} />
          </div>,
    // Over-fill reads as covered and shows the surplus, but never pays for a gap elsewhere.
    'With surplus': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'CRITICAL',
        openSlots: 1,
        totalAttending: 5,
        positions: [pos('Setter', 2, 5), pos('Libero', 1, 0)]
      })} />
          </div>,
    // Nobody has a position yet, so the server sends no rows — but people ARE coming. "Nobody
    // has answered yet" would be a flat contradiction of the nudge right below it.
    'All attendees unassigned': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'HEADCOUNT_SHORT',
        openSlots: 4,
        totalTarget: 10,
        totalAttending: 6,
        unassignedAttending: 6,
        positions: []
      })} />
          </div>,
    // The genuinely empty event, where the copy is true.
    'Nobody attending': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'TALLY_ONLY',
        openSlots: 0,
        totalTarget: undefined,
        totalAttending: 0,
        positions: []
      })} />
          </div>,
    // A position can require up to 99 (PositionSlots.MAX). The pips wrap rather than push the
    // count off the row.
    'With many slots': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'SPOTS_OPEN',
        openSlots: 5,
        totalAttending: 7,
        positions: [pos('Squad', 12, 7)]
      })} />
          </div>,
    'With unassigned': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'SPOTS_OPEN',
        totalAttending: 6,
        unassignedAttending: 3,
        positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)]
      })} />
          </div>,
    // A headcount set alongside position targets is secondary: the header stays the covered
    // fraction and the total appears as a line beneath the rows.
    'Both axes': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'SPOTS_OPEN',
        openSlots: 1,
        totalTarget: 12,
        totalAttending: 7,
        positions: [pos('Setter', 2, 1), pos('Libero', 1, 1)]
      })} />
          </div>,
    // The reported case (#281): a training wanting 12, attended by 11 players and a coach. The
    // fraction counts the eleven, the Trainer keeps a row of their own, and the note underneath
    // accounts for the twelfth person so the two numbers do not read as an arithmetic slip.
    'With staff attending': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'HEADCOUNT_SHORT',
        openSlots: 1,
        totalTarget: 12,
        totalAttending: 12,
        positions: [pos('Setter', undefined, 11), pos('Trainer', undefined, 1, 'STAFF')]
      })} />
          </div>,
    // Staff alongside targeted positions — the panel's densest honest state, and the one where
    // all three numbers appear at once: the covered fraction owns the header (2 of 2), the
    // headcount drops to a secondary line counting players only (3/6), and the staff line
    // explains why four people are listed under a fraction that says three.
    'With staff and position targets': <div className={CARD}>
            <RosterPips roster={makeRoster({
        state: 'LINEUP_SET',
        totalTarget: 6,
        totalAttending: 4,
        positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Trainer', undefined, 1, 'STAFF')]
      })} />
          </div>
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Lineup set').getByText('3 of 3 covered')).toBeInTheDocument();
    await expect(region('Lineup set').getAllByText('2/2')).toHaveLength(2);
    await expect(region('Lineup set').getByText('1/1')).toBeInTheDocument();
    await expect(region('Lineup set').queryByText(/the one to chase/)).not.toBeInTheDocument();
    await expect(region('Spots open').getByText('1 of 3 covered')).toBeInTheDocument();
    // Short, but nobody is missing entirely — so no callout.
    await expect(region('Spots open').queryByText(/the one to chase/)).not.toBeInTheDocument();
    await expect(region('Critical').getByText(/still has no one/)).toBeInTheDocument();
    await expect(region('Critical').getByText('Libero', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(region('Critical').getByText('0/1')).toBeInTheDocument();
    await expect(region('Two empty positions').getByText('Libero and Middle', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(region('Two empty positions').getByText(/still have no one/)).toBeInTheDocument();
    await expect(region('Two empty positions').queryByText(/the one to chase/)).not.toBeInTheDocument();
    await expect(region('Nothing answered yet').getByText('6 positions', {
      selector: 'b'
    })).toBeInTheDocument();
    await expect(region('Nothing answered yet').getByText(/still have no one/)).toBeInTheDocument();
    // No position is singled out, and none is called "the one".
    await expect(region('Nothing answered yet').queryByText(/the one to chase/)).not.toBeInTheDocument();
    await expect(region('Nothing answered yet').queryByText('Diagonaal', {
      selector: 'b'
    })).not.toBeInTheDocument();
    await expect(region('Nothing answered yet').getByText('0 of 6 covered')).toBeInTheDocument();
    await expect(region('Headcount only').queryByText(/covered/)).not.toBeInTheDocument();
    await expect(region('Headcount only').getByText('4')).toBeInTheDocument();
    await expect(region('Headcount only').getByText('6/10 going')).toBeInTheDocument();
    await expect(region('With surplus').getByText('+3')).toBeInTheDocument();
    await expect(region('With surplus').getByText('5/2')).toBeInTheDocument();
    await expect(region('With surplus').getByText(/still has no one/)).toBeInTheDocument();
    await expect(region('All attendees unassigned').queryByText('Nobody has answered yet.')).not.toBeInTheDocument();
    await expect(region('All attendees unassigned').getByText("6 going haven't set a position")).toBeInTheDocument();
    await expect(region('All attendees unassigned').getByText('6/10 going')).toBeInTheDocument();
    await expect(region('Nobody attending').getByText('Nobody has answered yet.')).toBeInTheDocument();
    await expect(region('With many slots').getByText('7/12')).toBeInTheDocument();
    await expect(region('With unassigned').getByText("3 going haven't set a position")).toBeInTheDocument();
    await expect(region('With unassigned').getByText('1 of 3 covered')).toBeInTheDocument();
    await expect(region('Both axes').getByText('1 of 2 covered')).toBeInTheDocument();
    await expect(region('Both axes').getByText('7/12 going')).toBeInTheDocument();
    await expect(region('With staff attending').getByText('11/12 going')).toBeInTheDocument();
    await expect(region('With staff attending').getByText('1 staff also going, not counted toward the target')).toBeInTheDocument();
    // Excluded from the target, not hidden.
    await expect(region('With staff attending').getByText('Trainer')).toBeInTheDocument();
    await expect(region('With staff and position targets').getByText('2 of 2 covered')).toBeInTheDocument();
    await expect(region('With staff and position targets').getByText('3/6 going')).toBeInTheDocument();
    await expect(region('With staff and position targets').getByText('1 staff also going, not counted toward the target')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h=[`Gallery`]})))()}g();export{m as Gallery,h as __namedExportsOrder,p as default};