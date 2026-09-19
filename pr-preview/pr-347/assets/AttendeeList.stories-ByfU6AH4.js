import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{r as i,t as a}from"./app-column-decorator-0nMuVRZm.js";import{r as o,s,t as c}from"./event-fixtures-CuRrQuRB.js";import{n as l,t as u}from"./AttendeeList-BGKUqHBf.js";var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{o(),n(),i(),l(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),g=[h(`u-set1`,`Sanne`,`Setter`),h(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),h(`u-lib`,`Lars`,`Libero`),h(`u-mid1`,`Milan`,`Middle`),h(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),h(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],_={title:`widgets/attendee-list/AttendeeList`,component:u,args:{attendees:g,roster:s(),onRespond:p()},decorators:[e=>(0,d.jsx)(`div`,{className:`overflow-hidden rounded-lg border border-border/40 bg-card`,children:(0,d.jsx)(e,{})}),...a.decorators],parameters:a.parameters},v={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{let t=t=>m(e.getByRole(`heading`,{name:t}).parentElement);await f(t(`Setter`).getByText(`needs 1 more`)).toBeInTheDocument(),await f(t(`Setter`).getByText(`1/2`)).toBeInTheDocument(),await f(t(`Libero`).getByText(`covered`)).toBeInTheDocument(),await f(t(`Libero`).getByText(`1/1`)).toBeInTheDocument(),await f(t(`Middle`).getByText(`needs 1 more`)).toBeInTheDocument(),await f(t(`Middle`).getByText(`1/2`)).toBeInTheDocument();let n=e.getAllByRole(`heading`).map(e=>e.textContent);f(n.at(-1)).toContain(`Unassigned`),await f(t(`Unassigned`).queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument(),await f(e.getByRole(`button`,{name:/Sanne — Going/})).toBeInTheDocument(),await f(m(document.body).queryByRole(`dialog`)).not.toBeInTheDocument()}},y={render:e=>(0,d.jsx)(r,{items:{"Flat when no positions":(0,d.jsx)(u,{...e,roster:c,attendees:[h(`u-a`,`Sanne`,`Unassigned`),h(`u-b`,`Lars`,`Unassigned`)]}),Empty:(0,d.jsx)(u,{...e,attendees:[],roster:c}),"Your row":(0,d.jsx)(u,{...e,currentUserId:`u-set1`}),Attribution:(0,d.jsx)(u,{...e,roster:c,attendees:[h(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),h(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),h(`u-tim`,`Tim de Vries`,`Unassigned`)]}),ReadOnly:(0,d.jsx)(u,{...e,onRespond:void 0})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Flat when no positions`).queryByRole(`heading`)).not.toBeInTheDocument(),await f(t(`Flat when no positions`).getByRole(`button`,{name:/Sanne — Going/})).toBeInTheDocument(),await f(t(`Empty`).getByText(`No one`)).toBeInTheDocument(),await f(t(`Your row`).getByText(`You`)).toBeInTheDocument(),f(t(`Your row`).getAllByText(`You`)).toHaveLength(1),await f(t(`Attribution`).getByText(`set by Tim de Vries`)).toBeInTheDocument(),await f(t(`Attribution`).queryByText(/set by Me/)).not.toBeInTheDocument(),await f(t(`ReadOnly`).getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await f(t(`ReadOnly`).getByText(`Sanne`)).toBeInTheDocument(),await f(t(`ReadOnly`).getByText(`Awaiting`)).toBeInTheDocument(),await f(t(`ReadOnly`).queryByRole(`button`)).not.toBeInTheDocument()}},b={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,d.jsx)(r,{items:{"Target member":(0,d.jsx)(u,{...e,attendees:[h(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]}),"Viewer among teammates":(0,d.jsx)(u,{...e,currentUserId:`u-set1`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>m(e.getByRole(`region`,{name:t})),i=m(document.body);await t.click(r(`Target member`).getByRole(`button`,{name:/Bob — Going/}));let a=m(await i.findByRole(`dialog`));await t.click(a.getByRole(`button`,{name:`Can't go`})),await f(n.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Sofia — Maybe/}));let o=m(await i.findByRole(`dialog`));await f(o.getByText(`Sofia`)).toBeInTheDocument(),await f(o.getByText(/Setter · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.keyboard(`{Escape}`),await f(i.queryByRole(`dialog`)).not.toBeInTheDocument(),await t.click(r(`Viewer among teammates`).getByRole(`button`,{name:/Sanne \(you\) — Going/}));let s=m(await i.findByRole(`dialog`));await f(s.getByText(/Setter · currently going/)).toBeInTheDocument(),await f(s.queryByText(/answering for them/)).not.toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    const heading = (name: string) => within(canvas.getByRole('heading', {
      name
    }).parentElement!);

    // Each position's verdict leads and its fraction is demoted — the card's order, the card's words.
    // Setter's two people are one Going and one Maybe, so the fraction counts the *attending* member
    // rather than the roster's server-side 2/2: the heading can never contradict the rows beneath it.
    await expect(heading('Setter').getByText('needs 1 more')).toBeInTheDocument();
    await expect(heading('Setter').getByText('1/2')).toBeInTheDocument();
    await expect(heading('Libero').getByText('covered')).toBeInTheDocument();
    await expect(heading('Libero').getByText('1/1')).toBeInTheDocument();
    // Middle is short the same way (Milan going, Mees can't).
    await expect(heading('Middle').getByText('needs 1 more')).toBeInTheDocument();
    await expect(heading('Middle').getByText('1/2')).toBeInTheDocument();

    // Unassigned is last and carries no verdict — there is nothing for it to fall short of.
    const headings = canvas.getAllByRole('heading').map(h => h.textContent);
    expect(headings.at(-1)).toContain('Unassigned');
    await expect(heading('Unassigned').queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument();

    // Nothing is open: each row is a way into the sheet, and no answer control or dialog is on screen.
    await expect(canvas.getByRole('button', {
      name: /Sanne — Going/
    })).toBeInTheDocument();
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
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
    // tinted and pilled, but nothing to open.
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
      name: /Sanne — Going/
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
    // But no row is a control, so there is no route to anyone's answer.
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
    const body = within(document.body);

    // Open Bob's row, then set *his* answer — the write targets Bob, not the viewer. The sheet is a
    // portal, so it lands on document.body rather than inside the canvas.
    await userEvent.click(region('Target member').getByRole('button', {
      name: /Bob — Going/
    }));
    const bobSheet = within(await body.findByRole('dialog'));
    await userEvent.click(bobSheet.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT');

    // The sheet names the teammate, their position and that you are answering for them.
    await userEvent.click(region('Viewer among teammates').getByRole('button', {
      name: /Sofia — Maybe/
    }));
    const sofiaSheet = within(await body.findByRole('dialog'));
    await expect(sofiaSheet.getByText('Sofia')).toBeInTheDocument();
    await expect(sofiaSheet.getByText(/Setter · currently maybe · you are answering for them/)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();

    // The viewer's own row gets no such line — it isn't a cross-member change.
    await userEvent.click(region('Viewer among teammates').getByRole('button', {
      name: /Sanne \\(you\\) — Going/
    }));
    const sanneSheet = within(await body.findByRole('dialog'));
    await expect(sanneSheet.getByText(/Setter · currently going/)).toBeInTheDocument();
    await expect(sanneSheet.queryByText(/answering for them/)).not.toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x=[`Data`,`Shells`,`Interactions`]})))()}S();export{v as Data,b as Interactions,y as Shells,x as __namedExportsOrder,_ as default};