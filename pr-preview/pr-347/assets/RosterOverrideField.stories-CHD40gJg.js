import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{o as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./RosterOverrideField-D9MVeKC0.js";var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),a(),o(),c=t(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],p=i({id:`et-1`,name:`Match`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),m={title:`features/manage-event-types/RosterOverrideField`,component:s,args:{eventType:p,positions:f,onChange:u()}},h={args:{value:{trackRoster:!0,totalTarget:8,positionTargets:[{positionId:`p2`,count:1}]}},play:async({canvas:e})=>{await l(e.getByRole(`radio`,{name:`Customise`})).toBeChecked(),await l(e.getByLabelText(/People needed in total/)).toHaveValue(8),await l(e.getByLabelText(`Libero`)).toHaveValue(1),await l(e.getByLabelText(`Setter`)).toHaveValue(null)}},g={render:e=>(0,c.jsx)(r,{items:{Inheriting:(0,c.jsx)(s,{...e,value:void 0}),"Null from the wire":(0,c.jsx)(s,{...e,value:null}),"Tracking off":(0,c.jsx)(s,{...e,value:{trackRoster:!1,totalTarget:void 0,positionTargets:[]}}),"No positions yet":(0,c.jsx)(s,{...e,positions:[],value:{trackRoster:!0,totalTarget:void 0,positionTargets:[]}})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t}));await l(t(`Inheriting`).getByRole(`radio`,{name:`Inherit default`})).toBeChecked(),await l(t(`Inheriting`).getByText(/Follows Match: 2 Setter · 12 total/)).toBeInTheDocument(),await l(t(`Inheriting`).getByText(/Changing the type's default changes this event too/)).toBeInTheDocument(),await l(t(`Inheriting`).queryByRole(`switch`,{name:`Track roster`})).not.toBeInTheDocument(),await l(t(`Null from the wire`).getByRole(`radio`,{name:`Inherit default`})).toBeChecked(),await l(t(`Null from the wire`).queryByRole(`switch`,{name:`Track roster`})).not.toBeInTheDocument(),await l(t(`Tracking off`).getByRole(`switch`,{name:`Track roster`})).toHaveAttribute(`aria-checked`,`false`),await l(t(`Tracking off`).getByText(/no roster panel on the card/i)).toBeInTheDocument(),await l(t(`No positions yet`).getByText(/Add positions below to require a specific lineup/)).toBeInTheDocument()}},_={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,c.jsx)(r,{items:{Inheriting:(0,c.jsx)(s,{...e,value:void 0}),Customised:(0,c.jsx)(s,{...e,value:{trackRoster:!0,totalTarget:8,positionTargets:[]}})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>d(e.getByRole(`region`,{name:t}));await t.click(r(`Inheriting`).getByRole(`radio`,{name:`Customise`})),await l(n.onChange).toHaveBeenLastCalledWith({trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}),await t.click(r(`Customised`).getByRole(`radio`,{name:`Inherit default`})),await l(n.onChange).toHaveBeenLastCalledWith(void 0)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    value: {
      trackRoster: true,
      totalTarget: 8,
      positionTargets: [{
        positionId: 'p2',
        count: 1
      }]
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('radio', {
      name: 'Customise'
    })).toBeChecked();
    await expect(canvas.getByLabelText(/People needed in total/)).toHaveValue(8);
    await expect(canvas.getByLabelText('Libero')).toHaveValue(1);
    await expect(canvas.getByLabelText('Setter')).toHaveValue(null);
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // The default, and the one that needs explaining: inheriting is not a snapshot. It says so,
    // and names what the type currently asks for so the choice is informed.
    Inheriting: <RosterOverrideField {...args} value={undefined} />,
    // The server puts a literal \`null\` on the wire for an inheriting event, while wirespec types
    // the field as \`undefined\`. Before this was guarded, a null slipped past the \`=== undefined\`
    // check, the editor rendered as "customised", and reading \`value.trackRoster\` crashed the
    // whole edit dialog. The cast proves TypeScript says this state is impossible and the wire
    // produces it anyway.
    'Null from the wire': <RosterOverrideField {...args} value={null as unknown as undefined} />,
    // A customised event may switch tracking OFF even when its type tracks — "no panel on this
    // one occurrence" is a deliberate answer, not the absence of one.
    'Tracking off': <RosterOverrideField {...args} value={{
      trackRoster: false,
      totalTarget: undefined,
      positionTargets: []
    }} />,
    // With no positions configured, per-position targets are impossible — so the editor says why
    // rather than showing an empty list.
    'No positions yet': <RosterOverrideField {...args} positions={[]} value={{
      trackRoster: true,
      totalTarget: undefined,
      positionTargets: []
    }} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Inheriting').getByRole('radio', {
      name: 'Inherit default'
    })).toBeChecked();
    await expect(region('Inheriting').getByText(/Follows Match: 2 Setter · 12 total/)).toBeInTheDocument();
    await expect(region('Inheriting').getByText(/Changing the type's default changes this event too/)).toBeInTheDocument();
    // Nothing to edit while inheriting.
    await expect(region('Inheriting').queryByRole('switch', {
      name: 'Track roster'
    })).not.toBeInTheDocument();
    await expect(region('Null from the wire').getByRole('radio', {
      name: 'Inherit default'
    })).toBeChecked();
    await expect(region('Null from the wire').queryByRole('switch', {
      name: 'Track roster'
    })).not.toBeInTheDocument();
    await expect(region('Tracking off').getByRole('switch', {
      name: 'Track roster'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(region('Tracking off').getByText(/no roster panel on the card/i)).toBeInTheDocument();
    await expect(region('No positions yet').getByText(/Add positions below to require a specific lineup/)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Inheriting: <RosterOverrideField {...args} value={undefined} />,
    Customised: <RosterOverrideField {...args} value={{
      trackRoster: true,
      totalTarget: 8,
      positionTargets: []
    }} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Switching to Customise seeds from the type's current default, so the admin edits from where
    // the event already is rather than from an empty form.
    await userEvent.click(region('Inheriting').getByRole('radio', {
      name: 'Customise'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      trackRoster: true,
      totalTarget: 12,
      positionTargets: [{
        positionId: 'p1',
        count: 2
      }]
    });

    // Going back to Inherit clears the override outright rather than keeping a stale copy of it.
    await userEvent.click(region('Customised').getByRole('radio', {
      name: 'Inherit default'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith(undefined);
  }
}`,..._.parameters?.docs?.source}}},v=[`Data`,`Shells`,`Interactions`]})))()}y();export{h as Data,_ as Interactions,g as Shells,v as __namedExportsOrder,m as default};