import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{r as i,s as a,t as o}from"./event-fixtures-CuRrQuRB.js";import{n as s,t as c}from"./AttendeeList-IO1lIQjm.js";var l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{i(),n(),s(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),m=[p(`u-set1`,`Sanne`,`Setter`),p(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),p(`u-lib`,`Lars`,`Libero`),p(`u-mid1`,`Milan`,`Middle`),p(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),p(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],h={title:`widgets/attendee-list/AttendeeList`,component:c,args:{attendees:m,roster:a(),onRespond:d()},decorators:[e=>(0,l.jsx)(`div`,{className:`max-w-md overflow-hidden rounded-2xl border border-border/40 bg-card`,children:(0,l.jsx)(e,{})})]},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await u(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await u(e.getByText(`2/2`)).toBeInTheDocument(),await u(e.getByText(`1/2`)).toBeInTheDocument();let t=e.getAllByRole(`heading`).map(e=>e.textContent);u(t.at(-1)).toContain(`Unassigned`),await u(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await u(e.queryByRole(`group`)).not.toBeInTheDocument()}},_={render:e=>(0,l.jsx)(r,{items:{"Flat when no positions":(0,l.jsx)(c,{...e,roster:o,attendees:[p(`u-a`,`Sanne`,`Unassigned`),p(`u-b`,`Lars`,`Unassigned`)]}),Empty:(0,l.jsx)(c,{...e,attendees:[],roster:o}),"Your row":(0,l.jsx)(c,{...e,currentUserId:`u-set1`}),Attribution:(0,l.jsx)(c,{...e,roster:o,attendees:[p(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),p(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),p(`u-tim`,`Tim de Vries`,`Unassigned`)]}),ReadOnly:(0,l.jsx)(c,{...e,onRespond:void 0})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Flat when no positions`).queryByRole(`heading`)).not.toBeInTheDocument(),await u(t(`Flat when no positions`).getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await u(t(`Empty`).getByText(`No one`)).toBeInTheDocument(),await u(t(`Your row`).getByText(`You`)).toBeInTheDocument(),u(t(`Your row`).getAllByText(`You`)).toHaveLength(1),await u(t(`Attribution`).getByText(`set by Tim de Vries`)).toBeInTheDocument(),await u(t(`Attribution`).queryByText(/set by Me/)).not.toBeInTheDocument(),await u(t(`ReadOnly`).getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await u(t(`ReadOnly`).getByText(`Sanne`)).toBeInTheDocument(),await u(t(`ReadOnly`).getByText(`Awaiting`)).toBeInTheDocument(),await u(t(`ReadOnly`).queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await u(t(`ReadOnly`).queryByRole(`button`)).not.toBeInTheDocument()}},v={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,l.jsx)(r,{items:{"Target member":(0,l.jsx)(c,{...e,attendees:[p(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]}),"Viewer among teammates":(0,l.jsx)(c,{...e,currentUserId:`u-set1`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>f(e.getByRole(`region`,{name:t}));await t.click(r(`Target member`).getByRole(`button`,{name:/Change Bob's answer/}));let i=f(r(`Target member`).getByRole(`group`,{name:`Bob's answer`}));await t.click(i.getByRole(`button`,{name:`Can't go`})),await u(n.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Change Sofia's answer/})),await u(r(`Viewer among teammates`).getByText(/Changing/)).toBeInTheDocument(),await u(f(r(`Viewer among teammates`).getByRole(`group`,{name:`Sofia's answer`})).getByText(`Sofia`)).toBeInTheDocument(),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Change Sanne's answer/})),await u(r(`Viewer among teammates`).queryByText(/Changing/)).not.toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    // Every position with someone gets a heading and the roster's own fraction beside it.
    await expect(canvas.getByRole('heading', {
      name: 'Setter'
    })).toBeInTheDocument();
    await expect(canvas.getByText('2/2')).toBeInTheDocument();
    await expect(canvas.getByText('1/2')).toBeInTheDocument(); // Middle, one short
    const headings = canvas.getAllByRole('heading').map(h => h.textContent);
    expect(headings.at(-1)).toContain('Unassigned');
    // Rows are collapsed: each is a disclosure trigger, and no answer control is on screen yet.
    await expect(canvas.getByRole('button', {
      name: /Change Sanne's answer/
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('group')).not.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    'Flat when no positions': <AttendeeList {...args} roster={NO_ROSTER} attendees={[att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')]} />,
    Empty: <AttendeeList {...args} attendees={[]} roster={NO_ROSTER} />,
    'Your row': <AttendeeList {...args} currentUserId="u-set1" />,
    Attribution: <AttendeeList {...args} roster={NO_ROSTER} attendees={[att('u-bob', 'Bob', 'Unassigned', {
      changedBy: 'u-tim'
    }), att('u-me', 'Me', 'Unassigned', {
      changedBy: 'u-me'
    }), att('u-tim', 'Tim de Vries', 'Unassigned')]} />,
    // Without \`onRespond\` the same list is a read-out, not a control: every member still named,
    // tinted and pilled, but nothing to open. That is how the events-list card renders it, which
    // is what keeps editing a teammate's attendance on detail-page rows only (#271 ⑫, #326).
    ReadOnly: <AttendeeList {...args} onRespond={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Flat when no positions').queryByRole('heading')).not.toBeInTheDocument();
    await expect(region('Flat when no positions').getByRole('button', {
      name: /Change Sanne's answer/
    })).toBeInTheDocument();
    await expect(region('Empty').getByText('No one')).toBeInTheDocument();
    await expect(region('Your row').getByText('You')).toBeInTheDocument();
    expect(region('Your row').getAllByText('You')).toHaveLength(1);

    // A row a teammate changed names them...
    await expect(region('Attribution').getByText('set by Tim de Vries')).toBeInTheDocument();
    // ...and a row set by its own member says nothing — the negative is the whole design.
    await expect(region('Attribution').queryByText(/set by Me/)).not.toBeInTheDocument();

    // The list itself is unchanged — same groups, same names, same answers.
    await expect(region('ReadOnly').getByRole('heading', {
      name: 'Setter'
    })).toBeInTheDocument();
    await expect(region('ReadOnly').getByText('Sanne')).toBeInTheDocument();
    await expect(region('ReadOnly').getByText('Awaiting')).toBeInTheDocument();
    // But no row is a disclosure, so there is no route to anyone's answer control.
    await expect(region('ReadOnly').queryByRole('button', {
      name: /Change .*'s answer/
    })).not.toBeInTheDocument();
    await expect(region('ReadOnly').queryByRole('button')).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Target member': <AttendeeList {...args} attendees={[att('u-bob', 'Bob', 'Setter', {
      state: 'ATTENDING'
    })]} />,
    // The viewer is Sanne.
    'Viewer among teammates': <AttendeeList {...args} currentUserId="u-set1" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Expand Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await userEvent.click(region('Target member').getByRole('button', {
      name: /Change Bob's answer/
    }));
    const control = within(region('Target member').getByRole('group', {
      name: "Bob's answer"
    }));
    await userEvent.click(control.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT');

    // Opening a teammate's control announces whose answer you're about to change.
    await userEvent.click(region('Viewer among teammates').getByRole('button', {
      name: /Change Sofia's answer/
    }));
    await expect(region('Viewer among teammates').getByText(/Changing/)).toBeInTheDocument();
    await expect(within(region('Viewer among teammates').getByRole('group', {
      name: "Sofia's answer"
    })).getByText('Sofia')).toBeInTheDocument();
    // The viewer's own row gets no such notice — it isn't a cross-member change.
    await userEvent.click(region('Viewer among teammates').getByRole('button', {
      name: /Change Sanne's answer/
    }));
    await expect(region('Viewer among teammates').queryByText(/Changing/)).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y=[`Data`,`Shells`,`Interactions`]})))()}b();export{g as Data,v as Interactions,_ as Shells,y as __namedExportsOrder,h as default};