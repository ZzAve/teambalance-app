import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-IbdrM012.js";import{o as n,r,t as i}from"./event-fixtures-GLq-GGnS.js";import{n as a,t as o}from"./EventAnswerRow-CYiI0xwb.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";function c(e){let[t,n]=(0,l.useState)(`NOT_RESPONDED`);return(0,u.jsx)(o,{...e,myState:t,onRespond:t=>{e.onRespond(t),n(t)}})}var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{l=t(),r(),a(),u=s(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`entities/event/EventAnswerRow`,component:o,args:{roster:n(),myState:`NOT_RESPONDED`,onRespond:f()},decorators:[e=>(0,u.jsx)(`div`,{className:`max-w-md rounded-xl border border-border bg-card p-3.5`,children:(0,u.jsx)(e,{})})]},m={play:async({canvas:e})=>{await d(e.getByText(`Respond`)).toBeInTheDocument(),await d(e.getByText(`1 spot open`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.queryByText(`Positions`)).not.toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Change your answer/})).toBeInTheDocument(),await d(e.getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument()}},h={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await d(e.getByText(`You're in`)).toBeInTheDocument()}},g={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Change your answer/})),await d(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await d(e.queryByText(`Positions`)).not.toBeInTheDocument()}},_={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Show lineup/})),await d(e.getByText(`Positions`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument()}},v={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Show lineup/})),await t.click(e.getByRole(`button`,{name:/Change your answer/}));let n=e.getByRole(`button`,{name:/^Going$/}),r=e.getByText(`Positions`);await d(n).toBeInTheDocument(),await d(r).toBeInTheDocument(),await d(n.getBoundingClientRect().top).toBeLessThan(r.getBoundingClientRect().top)}},y={args:{defaultAttnOpen:!0,myState:`ATTENDING`},play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByRole(`button`,{name:/^Going$/})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:/^Maybe$/})),await d(n.onRespond).toHaveBeenCalledWith(`MAYBE`)}},b={args:{defaultAttnOpen:!0,defaultRosterOpen:!0},render:e=>(0,u.jsx)(c,{...e}),play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByText(`Respond`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/^Going$/})),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.getByText(`You're in`)).toBeInTheDocument(),await d(e.getByText(`Positions`)).toBeInTheDocument(),await d(n.onRespond).toHaveBeenCalledWith(`ATTENDING`)}},x={args:{defaultAttnOpen:!0,myState:`ATTENDING`,pending:!0},play:async({canvas:e})=>{await d(e.getByText(`1 spot open`)).toHaveAttribute(`aria-busy`,`true`),await d(e.getByRole(`button`,{name:/^Going$/})).toBeDisabled()}},S={args:{roster:{...i,totalAttending:8}},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(`8 going`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/Show lineup/})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Change your answer/})),await d(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument()}},C={args:{roster:n({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},play:async({canvas:e,userEvent:t})=>{await d(e.getByText(`5 going`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await d(e.getByText(`Positions`)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
    // Neither panel is open until asked.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
    // Both sides are their own trigger.
    await expect(canvas.getByRole('button', {
      name: /Change your answer/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    // The pips are shown…
    await expect(canvas.getByText('Positions')).toBeInTheDocument();
    // …and the answer control stays closed.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
    const positions = canvas.getByText('Positions');
    await expect(going).toBeInTheDocument();
    await expect(positions).toBeInTheDocument();
    // Attendance renders above the roster panel regardless of which was opened first.
    await expect(going.getBoundingClientRect().top).toBeLessThan(positions.getBoundingClientRect().top);
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText('Positions')).toBeInTheDocument();
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING');
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    roster: {
      ...NO_ROSTER,
      totalAttending: 8
    }
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText('Positions')).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Unanswered`,`Attending`,`OpenAttendanceOnly`,`OpenRosterOnly`,`BothOpenAttendanceOnTop`,`AnswerIsReported`,`CollapseOnPick`,`Pending`,`HeadcountFallbackOff`,`HeadcountFallbackTallyOnly`]})))()}T();export{y as AnswerIsReported,h as Attending,v as BothOpenAttendanceOnTop,b as CollapseOnPick,S as HeadcountFallbackOff,C as HeadcountFallbackTallyOnly,g as OpenAttendanceOnly,_ as OpenRosterOnly,x as Pending,m as Unanswered,w as __namedExportsOrder,p as default};