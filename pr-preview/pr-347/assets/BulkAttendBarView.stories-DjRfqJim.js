import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{a as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./BulkAttendBarView-B20veZhI.js";var c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{a(),n(),o(),c=t(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f=(e,t,n)=>({typeId:e,typeName:t,events:Array.from({length:n},(t,n)=>i({id:`${e}-${n}`}))}),p={title:`features/bulk-attend/BulkAttendBarView`,component:s,args:{groups:[f(`et-training`,`Training`,12),f(`et-match`,`Match`,3)],onAttend:u()}},m={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Attend 12 trainings`})).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Attend 3 matches`})).toBeInTheDocument()}},h={render:e=>(0,c.jsx)(r,{items:{Hidden:(0,c.jsx)(s,{...e,groups:[]}),"Single type":(0,c.jsx)(s,{...e,groups:[f(`et-training`,`Training`,8)]}),"Many types":(0,c.jsx)(s,{...e,groups:[f(`et-training`,`Training`,9),f(`et-match`,`Match`,4),f(`et-social`,`Social`,2),f(`et-tournament`,`Tournament`,1)]}),"One type pending":(0,c.jsx)(s,{...e,pendingTypeId:`et-training`})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t}));await l(t(`Hidden`).queryByRole(`button`)).not.toBeInTheDocument(),await l(t(`Single type`).getByRole(`button`,{name:`Attend 8 trainings`})).toBeInTheDocument(),await l(t(`Single type`).getAllByRole(`button`)).toHaveLength(1),await l(t(`Many types`).getAllByRole(`button`)).toHaveLength(4),await l(t(`Many types`).getByRole(`button`,{name:`Attend 1 tournament`})).toBeInTheDocument(),await l(t(`One type pending`).getByRole(`button`,{name:`Attend 12 trainings`})).toBeDisabled(),await l(t(`One type pending`).getByRole(`button`,{name:`Attend 3 matches`})).toBeEnabled()}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:`Attend 3 matches`})),await l(t.onAttend).toHaveBeenCalledWith(`et-match`)}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 12 trainings'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Attend 3 matches'
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Nothing left to fill anywhere: the row disappears rather than leaving an empty band.
    Hidden: <BulkAttendBarView {...args} groups={[]} />,
    // The common case for a team that mostly trains: exactly one button, already named.
    'Single type': <BulkAttendBarView {...args} groups={[group('et-training', 'Training', 8)]} />,
    // Several types wrap onto another line instead of sliding off the edge of a phone.
    'Many types': <BulkAttendBarView {...args} groups={[group('et-training', 'Training', 9), group('et-match', 'Match', 4), group('et-social', 'Social', 2), group('et-tournament', 'Tournament', 1)]} />,
    // Only the type whose batch is in flight goes disabled; the others stay tappable.
    'One type pending': <BulkAttendBarView {...args} pendingTypeId="et-training" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Hidden').queryByRole('button')).not.toBeInTheDocument();
    await expect(region('Single type').getByRole('button', {
      name: 'Attend 8 trainings'
    })).toBeInTheDocument();
    await expect(region('Single type').getAllByRole('button')).toHaveLength(1);
    await expect(region('Many types').getAllByRole('button')).toHaveLength(4);
    // Singular noun on the one-event group.
    await expect(region('Many types').getByRole('button', {
      name: 'Attend 1 tournament'
    })).toBeInTheDocument();
    await expect(region('One type pending').getByRole('button', {
      name: 'Attend 12 trainings'
    })).toBeDisabled();
    await expect(region('One type pending').getByRole('button', {
      name: 'Attend 3 matches'
    })).toBeEnabled();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Attend 3 matches'
    }));
    await expect(args.onAttend).toHaveBeenCalledWith('et-match');
  }
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`Interactions`]})))()}v();export{m as Data,g as Interactions,h as Shells,_ as __namedExportsOrder,p as default};