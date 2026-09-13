import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{r as t,s as n,t as r}from"./event-fixtures-CuRrQuRB.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./AttendeeList-1diDHQRa.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{t(),a(),s=i(),{expect:c,fn:l,within:u}=__STORYBOOK_MODULE_TEST__,d=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),f=[d(`u-set1`,`Sanne`,`Setter`),d(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),d(`u-lib`,`Lars`,`Libero`),d(`u-mid1`,`Milan`,`Middle`),d(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),d(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],p={title:`widgets/attendee-list/AttendeeList`,component:o,args:{attendees:f,roster:n(),onRespond:l()},decorators:[e=>(0,s.jsx)(`div`,{className:`max-w-md overflow-hidden rounded-2xl border border-border/40 bg-card`,children:(0,s.jsx)(e,{})})]},m={play:async({canvas:e})=>{await c(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await c(e.getByText(`2/2`)).toBeInTheDocument(),await c(e.getByText(`1/2`)).toBeInTheDocument();let t=e.getAllByRole(`heading`).map(e=>e.textContent);c(t.at(-1)).toContain(`Unassigned`),await c(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await c(e.queryByRole(`group`)).not.toBeInTheDocument()}},h={args:{roster:r,attendees:[d(`u-a`,`Sanne`,`Unassigned`),d(`u-b`,`Lars`,`Unassigned`)]},play:async({canvas:e})=>{await c(e.queryByRole(`heading`)).not.toBeInTheDocument(),await c(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument()}},g={args:{attendees:[],roster:r},play:async({canvas:e})=>{await c(e.getByText(`No one`)).toBeInTheDocument()}},_={args:{currentUserId:`u-set1`},play:async({canvas:e})=>{await c(e.getByText(`You`)).toBeInTheDocument(),c(e.getAllByText(`You`)).toHaveLength(1)}},v={args:{roster:r,attendees:[d(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),d(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),d(`u-tim`,`Tim de Vries`,`Unassigned`)]},play:async({canvas:e})=>{await c(e.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await c(e.queryByText(/set by Me/)).not.toBeInTheDocument()}},y={args:{attendees:[d(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]},play:async({canvas:e,args:t})=>{await e.getByRole(`button`,{name:/Change Bob's answer/}).click(),await u(e.getByRole(`group`,{name:`Bob's answer`})).getByRole(`button`,{name:`Can't go`}).click(),await c(t.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`)}},b={args:{currentUserId:`u-set1`},play:async({canvas:e})=>{await e.getByRole(`button`,{name:/Change Sofia's answer/}).click(),await c(e.getByText(/Changing/)).toBeInTheDocument(),await c(u(e.getByRole(`group`,{name:`Sofia's answer`})).getByText(`Sofia`)).toBeInTheDocument(),await e.getByRole(`button`,{name:/Change Sanne's answer/}).click(),await c(e.queryByText(/Changing/)).not.toBeInTheDocument()}},x={args:{onRespond:void 0},play:async({canvas:e})=>{await c(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await c(e.getByText(`Sanne`)).toBeInTheDocument(),await c(e.getByText(`Awaiting`)).toBeInTheDocument(),await c(e.queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await c(e.queryByRole(`button`)).not.toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER,
    attendees: [att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Change Sanne's answer/
    })).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [],
    roster: NO_ROSTER
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No one')).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('You')).toBeInTheDocument();
    expect(canvas.getAllByText('You')).toHaveLength(1);
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER,
    attendees: [att('u-bob', 'Bob', 'Unassigned', {
      changedBy: 'u-tim'
    }), att('u-me', 'Me', 'Unassigned', {
      changedBy: 'u-me'
    }), att('u-tim', 'Tim de Vries', 'Unassigned')]
  },
  play: async ({
    canvas
  }) => {
    // A row a teammate changed names them...
    await expect(canvas.getByText('set by Tim de Vries')).toBeInTheDocument();
    // ...and a row set by its own member says nothing — the negative is the whole design.
    await expect(canvas.queryByText(/set by Me/)).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [att('u-bob', 'Bob', 'Setter', {
      state: 'ATTENDING'
    })]
  },
  play: async ({
    canvas,
    args
  }) => {
    // Expand Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await canvas.getByRole('button', {
      name: /Change Bob's answer/
    }).click();
    const control = within(canvas.getByRole('group', {
      name: "Bob's answer"
    }));
    await control.getByRole('button', {
      name: "Can't go"
    }).click();
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT');
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  // the viewer is Sanne
  play: async ({
    canvas
  }) => {
    // Opening a teammate's control announces whose answer you're about to change.
    await canvas.getByRole('button', {
      name: /Change Sofia's answer/
    }).click();
    await expect(canvas.getByText(/Changing/)).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', {
      name: "Sofia's answer"
    })).getByText('Sofia')).toBeInTheDocument();
    // The viewer's own row gets no such notice — it isn't a cross-member change.
    await canvas.getByRole('button', {
      name: /Change Sanne's answer/
    }).click();
    await expect(canvas.queryByText(/Changing/)).not.toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    onRespond: undefined
  },
  play: async ({
    canvas
  }) => {
    // The list itself is unchanged — same groups, same names, same answers.
    await expect(canvas.getByRole('heading', {
      name: 'Setter'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Sanne')).toBeInTheDocument();
    await expect(canvas.getByText('Awaiting')).toBeInTheDocument();
    // But no row is a disclosure, so there is no route to anyone's answer control.
    await expect(canvas.queryByRole('button', {
      name: /Change .*'s answer/
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S=[`GroupedByPosition`,`FlatWhenNoPositions`,`Empty`,`YourRow`,`Attribution`,`EditingTargetsThatMember`,`ChangingATeammateShowsNotice`,`ReadOnly`]})))()}C();export{v as Attribution,b as ChangingATeammateShowsNotice,y as EditingTargetsThatMember,g as Empty,h as FlatWhenNoPositions,m as GroupedByPosition,x as ReadOnly,_ as YourRow,S as __namedExportsOrder,p as default};