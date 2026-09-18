import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{r as i,t as a}from"./app-column-decorator-I0ctpr7k.js";import{r as o,s,t as c}from"./event-fixtures-CuRrQuRB.js";import{n as l,t as u}from"./AttendeeList-D8B8Pawd.js";var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{o(),n(),i(),l(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),g=[h(`u-set1`,`Sanne`,`Setter`),h(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),h(`u-lib`,`Lars`,`Libero`),h(`u-mid1`,`Milan`,`Middle`),h(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),h(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],_={title:`widgets/attendee-list/AttendeeList`,component:u,args:{attendees:g,roster:s(),onRespond:p()},decorators:[e=>(0,d.jsx)(`div`,{className:`overflow-hidden rounded-lg border border-border/40 bg-card`,children:(0,d.jsx)(e,{})}),...a.decorators],parameters:a.parameters},v={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await f(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await f(e.getByText(`2/2`)).toBeInTheDocument(),await f(e.getByText(`1/2`)).toBeInTheDocument();let t=e.getAllByRole(`heading`).map(e=>e.textContent);f(t.at(-1)).toContain(`Unassigned`),await f(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await f(e.queryByRole(`group`)).not.toBeInTheDocument()}},y={render:e=>(0,d.jsx)(r,{items:{"Flat when no positions":(0,d.jsx)(u,{...e,roster:c,attendees:[h(`u-a`,`Sanne`,`Unassigned`),h(`u-b`,`Lars`,`Unassigned`)]}),Empty:(0,d.jsx)(u,{...e,attendees:[],roster:c}),"Your row":(0,d.jsx)(u,{...e,currentUserId:`u-set1`}),Attribution:(0,d.jsx)(u,{...e,roster:c,attendees:[h(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),h(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),h(`u-tim`,`Tim de Vries`,`Unassigned`)]}),ReadOnly:(0,d.jsx)(u,{...e,onRespond:void 0})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Flat when no positions`).queryByRole(`heading`)).not.toBeInTheDocument(),await f(t(`Flat when no positions`).getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await f(t(`Empty`).getByText(`No one`)).toBeInTheDocument(),await f(t(`Your row`).getByText(`You`)).toBeInTheDocument(),f(t(`Your row`).getAllByText(`You`)).toHaveLength(1),await f(t(`Attribution`).getByText(`set by Tim de Vries`)).toBeInTheDocument(),await f(t(`Attribution`).queryByText(/set by Me/)).not.toBeInTheDocument(),await f(t(`ReadOnly`).getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await f(t(`ReadOnly`).getByText(`Sanne`)).toBeInTheDocument(),await f(t(`ReadOnly`).getByText(`Awaiting`)).toBeInTheDocument(),await f(t(`ReadOnly`).queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await f(t(`ReadOnly`).queryByRole(`button`)).not.toBeInTheDocument()}},b={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,d.jsx)(r,{items:{"Target member":(0,d.jsx)(u,{...e,attendees:[h(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]}),"Viewer among teammates":(0,d.jsx)(u,{...e,currentUserId:`u-set1`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>m(e.getByRole(`region`,{name:t}));await t.click(r(`Target member`).getByRole(`button`,{name:/Change Bob's answer/}));let i=m(r(`Target member`).getByRole(`group`,{name:`Bob's answer`}));await t.click(i.getByRole(`button`,{name:`Can't go`})),await f(n.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Change Sofia's answer/})),await f(r(`Viewer among teammates`).getByText(/Changing/)).toBeInTheDocument(),await f(m(r(`Viewer among teammates`).getByRole(`group`,{name:`Sofia's answer`})).getByText(`Sofia`)).toBeInTheDocument(),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Change Sanne's answer/})),await f(r(`Viewer among teammates`).queryByText(/Changing/)).not.toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`Data`,`Shells`,`Interactions`]})))()}S();export{v as Data,b as Interactions,y as Shells,x as __namedExportsOrder,_ as default};