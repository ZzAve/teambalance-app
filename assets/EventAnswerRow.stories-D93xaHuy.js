import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyS7Yi9.js";import{r as n,s as r,t as i}from"./event-fixtures-CuRrQuRB.js";import{n as a,t as o}from"./EventAnswerRow-C8stIi0c.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";function c(e){let[t,n]=(0,l.useState)(`NOT_RESPONDED`);return(0,u.jsx)(o,{...e,myState:t,onRespond:t=>{e.onRespond(t),n(t)}})}var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{l=t(),n(),a(),u=s(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p=(0,u.jsx)(`p`,{children:`Setter · Sanne, Sofia`}),m=`Setter · Sanne, Sofia`,h={title:`entities/event/EventAnswerRow`,component:o,args:{roster:r(),myState:`NOT_RESPONDED`,onRespond:f(),rosterPanel:p},decorators:[e=>(0,u.jsx)(`div`,{className:`max-w-md rounded-md border border-border bg-card p-3.5`,children:(0,u.jsx)(e,{})})]},g={play:async({canvas:e})=>{await d(e.getByText(`Respond`)).toBeInTheDocument(),await d(e.getByText(`1 spot open`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.queryByText(m)).not.toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Change your answer/})).toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument()}},_={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await d(e.getByText(`You're in`)).toBeInTheDocument()}},v={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Change your answer/})),await d(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await d(e.queryByText(m)).not.toBeInTheDocument()}},y={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Show lineup/})),await d(e.getByText(m)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument()}},b={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Show lineup/})),await t.click(e.getByRole(`button`,{name:/Change your answer/}));let n=e.getByRole(`button`,{name:/^Going$/}),r=e.getByText(m);await d(n).toBeInTheDocument(),await d(r).toBeInTheDocument(),await d(n.getBoundingClientRect().top).toBeLessThan(r.getBoundingClientRect().top)}},x={args:{myState:`ABSENT`,setBy:`Tim de Vries`},play:async({canvas:e})=>{await d(e.getByText(`Tim de Vries said you're out`)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Change your answer/})).toBeInTheDocument()}},S={args:{myState:`ATTENDING`,setBy:`a teammate`},play:async({canvas:e})=>{await d(e.getByText(`a teammate said you're in`)).toBeInTheDocument()}},C={args:{myState:`ATTENDING`,setBy:`Sophie van Dijk-van der Bergh`},decorators:[e=>(0,u.jsx)(`div`,{className:`w-[300px] rounded-lg border border-border bg-card p-3.5`,children:(0,u.jsx)(e,{})})],play:async({canvas:e})=>{await d(e.getByText(/said you're in/)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument()}},w={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await d(e.getByText(`You're in`)).toBeInTheDocument(),await d(e.queryByText(/ said /)).not.toBeInTheDocument()}},T={args:{defaultAttnOpen:!0,myState:`ATTENDING`},play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByRole(`button`,{name:/^Going$/})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:/^Maybe$/})),await d(n.onRespond).toHaveBeenCalledWith(`MAYBE`)}},E={args:{defaultAttnOpen:!0,defaultRosterOpen:!0},render:e=>(0,u.jsx)(c,{...e}),play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByText(`Respond`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/^Going$/})),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.getByText(`You're in`)).toBeInTheDocument(),await d(e.getByText(m)).toBeInTheDocument(),await d(n.onRespond).toHaveBeenCalledWith(`ATTENDING`)}},D={args:{defaultAttnOpen:!0,myState:`ATTENDING`,pending:!0},play:async({canvas:e})=>{await d(e.getByText(`1 spot open`)).toHaveAttribute(`aria-busy`,`true`),await d(e.getByRole(`button`,{name:/^Going$/})).toBeDisabled()}},O={args:{roster:r({...i,totalAttending:8}),rosterPanel:null},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(`8 going`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/Show lineup/})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Change your answer/})),await d(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument()}},k={args:{roster:r({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(`5 going`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await d(e.getByText(m)).toBeInTheDocument()}},A={args:{defaultRosterOpen:!1},play:async({canvas:e})=>{await d(e.queryByText(m)).not.toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument()}},j={args:{defaultRosterOpen:!0},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(m)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Hide lineup/})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Hide lineup/})),await d(e.queryByText(m)).not.toBeInTheDocument()}},M={args:{roster:r({...i,totalAttending:8}),rosterPanel:(0,u.jsx)(`p`,{children:`Sanne, Sofia, Lars`})},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(`8 going`)).toBeInTheDocument();let n=e.getByRole(`button`,{name:/Show who's coming/});await t.click(n),await d(e.getByText(`Sanne, Sofia, Lars`)).toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
    // Neither panel is open until asked.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(canvas.queryByText(PANEL_TEXT)).not.toBeInTheDocument();
    // Both sides are their own trigger.
    await expect(canvas.getByRole('button', {
      name: /Change your answer/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Change your answer/
    }));
    // The three-way control is shown…
    await expect(canvas.getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
    // …and the roster panel stays closed.
    await expect(canvas.queryByText(PANEL_TEXT)).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    // The pips are shown…
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
    // …and the answer control stays closed.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Change your answer/
    }));
    const going = canvas.getByRole('button', {
      name: /^Going$/
    });
    const positions = canvas.getByText(PANEL_TEXT);
    await expect(going).toBeInTheDocument();
    await expect(positions).toBeInTheDocument();
    // Attendance renders above the roster panel regardless of which was opened first.
    await expect(going.getBoundingClientRect().top).toBeLessThan(positions.getBoundingClientRect().top);
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ABSENT',
    setBy: 'Tim de Vries'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Tim de Vries said you're out")).toBeInTheDocument();
    // Still your answer and still yours to change: the pill is the same trigger it always was.
    await expect(canvas.getByRole('button', {
      name: /Change your answer/
    })).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING',
    setBy: 'a teammate'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("a teammate said you're in")).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING',
    setBy: 'Sophie van Dijk-van der Bergh'
  },
  decorators: [Story => <div className="w-[300px] rounded-lg border border-border bg-card p-3.5">
        <Story />
      </div>],
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/said you're in/)).toBeInTheDocument();
    // The verdict on the right survives — the row never wraps or scrolls.
    await expect(canvas.getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
    await expect(canvas.queryByText(/ said /)).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    defaultAttnOpen: true,
    myState: 'ATTENDING'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByRole('button', {
      name: /^Going$/
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', {
      name: /^Maybe$/
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('MAYBE');
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    defaultAttnOpen: true,
    defaultRosterOpen: true
  },
  render: args => <CollapseOnPickHarness {...args} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /^Going$/
    }));

    // Attendance panel collapsed…
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    // …the pill flipped optimistically…
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
    // …the roster panel stayed open…
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING');
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    defaultAttnOpen: true,
    myState: 'ATTENDING',
    pending: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 spot open')).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('button', {
      name: /^Going$/
    })).toBeDisabled();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      ...NO_ROSTER,
      totalAttending: 8
    }),
    rosterPanel: null
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: /Show lineup/
    })).not.toBeInTheDocument();
    // Answering still works.
    await userEvent.click(canvas.getByRole('button', {
      name: /Change your answer/
    }));
    await expect(canvas.getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalAttending: 5,
      positions: []
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('5 going')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    defaultRosterOpen: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByText(PANEL_TEXT)).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    defaultRosterOpen: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Hide lineup/
    })).toBeInTheDocument();
    // Still a disclosure, not a permanently open panel.
    await userEvent.click(canvas.getByRole('button', {
      name: /Hide lineup/
    }));
    await expect(canvas.queryByText(PANEL_TEXT)).not.toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      ...NO_ROSTER,
      totalAttending: 8
    }),
    rosterPanel: <p>Sanne, Sofia, Lars</p>
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument();
    // A social has no positions, so the trigger names what it actually opens.
    const trigger = canvas.getByRole('button', {
      name: /Show who's coming/
    });
    await userEvent.click(trigger);
    await expect(canvas.getByText('Sanne, Sofia, Lars')).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N=[`Unanswered`,`Attending`,`OpenAttendanceOnly`,`OpenRosterOnly`,`BothOpenAttendanceOnTop`,`SetByTeammate`,`SetByUnnamedTeammate`,`SetByLongName`,`SelfSetSaysNothing`,`AnswerIsReported`,`CollapseOnPick`,`Pending`,`HeadcountFallbackOff`,`HeadcountFallbackTallyOnly`,`RosterCollapsedByDefault`,`RosterExpandedByDefault`,`SocialExpands`]})))()}P();export{T as AnswerIsReported,_ as Attending,b as BothOpenAttendanceOnTop,E as CollapseOnPick,O as HeadcountFallbackOff,k as HeadcountFallbackTallyOnly,v as OpenAttendanceOnly,y as OpenRosterOnly,D as Pending,A as RosterCollapsedByDefault,j as RosterExpandedByDefault,w as SelfSetSaysNothing,C as SetByLongName,x as SetByTeammate,S as SetByUnnamedTeammate,M as SocialExpands,g as Unanswered,N as __namedExportsOrder,h as default};