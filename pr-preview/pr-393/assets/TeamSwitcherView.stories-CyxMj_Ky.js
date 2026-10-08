import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./TeamSwitcherView-8erS3uQx.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),o=t(),{expect:s,fn:c,userEvent:l,waitFor:u,within:d}=__STORYBOOK_MODULE_TEST__,f={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},p={title:`features/switch-team/TeamSwitcherView`,component:a,args:{teams:[f,{id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`}],activeTeam:f,onSelect:c()}},m={play:async({canvas:e})=>{let t=e.getByRole(`combobox`,{name:/Current team: Setpoint VT/});await s(t).toBeInTheDocument(),await s(d(document.body).queryByRole(`listbox`)).not.toBeInTheDocument()}},h={render:e=>(0,o.jsx)(r,{items:{"Single team":(0,o.jsx)(a,{...e,teams:[f]}),"No active team":(0,o.jsx)(a,{...e,activeTeam:null})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t}));await s(t(`Single team`).getByText(`Setpoint VT`)).toBeInTheDocument(),await s(t(`Single team`).queryByRole(`button`)).not.toBeInTheDocument(),await s(t(`No active team`).queryByText(`Setpoint VT`)).not.toBeInTheDocument()}},g={decorators:[e=>(0,o.jsx)(`div`,{className:`flex justify-end`,children:(0,o.jsx)(e,{})})],play:async({canvas:e})=>{await l.click(e.getByRole(`combobox`,{name:/Current team: Setpoint VT/}));let t=d(document.body);await s(await t.findByRole(`listbox`)).toBeInTheDocument(),await s(t.getByRole(`option`,{name:/Setpoint VT/})).toHaveAttribute(`aria-selected`,`true`),await s(t.getByRole(`option`,{name:/Tovo Heren 5/})).toHaveAttribute(`aria-selected`,`false`)}},_={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{let n=d(document.body);await l.click(e.getByRole(`combobox`,{name:/Current team: Setpoint VT/})),await l.click(await n.findByRole(`option`,{name:/Setpoint VT/})),await s(t.onSelect).not.toHaveBeenCalled(),await u(()=>s(n.queryByRole(`listbox`)).not.toBeInTheDocument()),await l.click(e.getByRole(`combobox`,{name:/Current team: Setpoint VT/})),await l.click(await n.findByRole(`option`,{name:/Tovo Heren 5/})),await s(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const trigger = canvas.getByRole('combobox', {
      name: /Current team: Setpoint VT/
    });
    await expect(trigger).toBeInTheDocument();
    await expect(within(document.body).queryByRole('listbox')).not.toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  // The menu is \`absolute right-0\` against a wrapper that is only as wide as the trigger — on the
  // real page that trigger sits in the shell header, near the right edge, so the menu opens leftward
  // into room that's there. Bare, the trigger sits flush at the canvas's left edge, so the menu's
  // right-aligned edge lands off-canvas. This decorator puts the trigger where the page always does
  // (same fix as EventFiltersView:Open).
  decorators: [Story => <div className="flex justify-end">
        <Story />
      </div>],
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('combobox', {
      name: /Current team: Setpoint VT/
    }));
    const menu = within(document.body);
    await expect(await menu.findByRole('listbox')).toBeInTheDocument();
    await expect(menu.getByRole('option', {
      name: /Setpoint VT/
    })).toHaveAttribute('aria-selected', 'true');
    await expect(menu.getByRole('option', {
      name: /Tovo Heren 5/
    })).toHaveAttribute('aria-selected', 'false');
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    const menu = within(document.body);

    // Re-picking the current Team is not a switch, and must not fire one.
    await userEvent.click(canvas.getByRole('combobox', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(await menu.findByRole('option', {
      name: /Setpoint VT/
    }));
    await expect(args.onSelect).not.toHaveBeenCalled();
    await waitFor(() => expect(menu.queryByRole('listbox')).not.toBeInTheDocument());

    // The slug, not the id: it is what the team-scoped URL carries, and opening that URL is the
    // switch.
    await userEvent.click(canvas.getByRole('combobox', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(await menu.findByRole('option', {
      name: /Tovo Heren 5/
    }));
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5');
  }
}`,..._.parameters?.docs?.source}}},v=[`Data`,`Shells`,`MenuOpen`,`Interactions`]})))()}y();export{m as Data,_ as Interactions,g as MenuOpen,h as Shells,v as __namedExportsOrder,p as default};