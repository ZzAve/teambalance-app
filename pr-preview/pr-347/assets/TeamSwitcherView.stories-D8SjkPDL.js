import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./TeamSwitcherView-CaVoOwri.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),o=t(),{expect:s,fn:c,userEvent:l,within:u}=__STORYBOOK_MODULE_TEST__,d={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},f={title:`features/switch-team/TeamSwitcherView`,component:a,args:{teams:[d,{id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`}],activeTeam:d,onSelect:c()}},p={play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:/Current team: Setpoint VT/});await s(t).toBeInTheDocument(),await s(e.queryByRole(`listbox`)).not.toBeInTheDocument()}},m={render:e=>(0,o.jsx)(r,{items:{"Single team":(0,o.jsx)(a,{...e,teams:[d]}),"No active team":(0,o.jsx)(a,{...e,activeTeam:null})}}),play:async({canvas:e})=>{let t=t=>u(e.getByRole(`region`,{name:t}));await s(t(`Single team`).getByText(`Setpoint VT`)).toBeInTheDocument(),await s(t(`Single team`).queryByRole(`button`)).not.toBeInTheDocument(),await s(t(`No active team`).queryByText(`Setpoint VT`)).not.toBeInTheDocument()}},h={play:async({canvas:e})=>{await l.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await s(e.getByRole(`listbox`,{name:`Your teams`})).toBeInTheDocument(),await s(e.getByRole(`option`,{name:/Setpoint VT/})).toHaveAttribute(`aria-selected`,`true`),await s(e.getByRole(`option`,{name:/Tovo Heren 5/})).toHaveAttribute(`aria-selected`,`false`)}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await l.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await l.click(e.getByRole(`option`,{name:/Setpoint VT/})),await s(t.onSelect).not.toHaveBeenCalled(),await s(e.queryByRole(`listbox`)).not.toBeInTheDocument(),await l.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await l.click(e.getByRole(`option`,{name:/Tovo Heren 5/})),await s(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const trigger = canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    });
    await expect(trigger).toBeInTheDocument();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    'Single team': <TeamSwitcherView {...args} teams={[SETPOINT]} />,
    'No active team': <TeamSwitcherView {...args} activeTeam={null} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Single team').getByText('Setpoint VT')).toBeInTheDocument();
    await expect(region('Single team').queryByRole('button')).not.toBeInTheDocument();
    await expect(region('No active team').queryByText('Setpoint VT')).not.toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await expect(canvas.getByRole('listbox', {
      name: 'Your teams'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('option', {
      name: /Setpoint VT/
    })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', {
      name: /Tovo Heren 5/
    })).toHaveAttribute('aria-selected', 'false');
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    // Re-picking the current Team is not a switch, and must not fire one.
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(canvas.getByRole('option', {
      name: /Setpoint VT/
    }));
    await expect(args.onSelect).not.toHaveBeenCalled();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();

    // The slug, not the id: it is what the team-scoped URL carries, and opening that URL is the
    // switch.
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(canvas.getByRole('option', {
      name: /Tovo Heren 5/
    }));
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5');
  }
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`MenuOpen`,`Interactions`]})))()}v();export{p as Data,g as Interactions,h as MenuOpen,m as Shells,_ as __namedExportsOrder,f as default};