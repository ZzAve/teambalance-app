import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n}from"./event-fixtures-lW1LLQhc.js";import{n as r,t as i}from"./RosterOverrideField-CR92nNqT.js";var a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),r(),{expect:a,fn:o}=__STORYBOOK_MODULE_TEST__,s=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],c=t({id:`et-1`,name:`Match`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),l={title:`features/manage-event-types/RosterOverrideField`,component:i,args:{eventType:c,positions:s,onChange:o()}},u={args:{value:void 0},play:async({canvas:e})=>{await a(e.getByRole(`radio`,{name:`Inherit default`})).toBeChecked(),await a(e.getByText(/Follows Match: 2 Setter · 12 total/)).toBeInTheDocument(),await a(e.getByText(/Changing the type's default changes this event too/)).toBeInTheDocument(),await a(e.queryByRole(`switch`,{name:`Track roster`})).not.toBeInTheDocument()}},d={args:{value:void 0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`Customise`})),await a(n.onChange).toHaveBeenCalledWith({trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]})}},f={args:{value:{trackRoster:!0,totalTarget:8,positionTargets:[{positionId:`p2`,count:1}]}},play:async({canvas:e})=>{await a(e.getByRole(`radio`,{name:`Customise`})).toBeChecked(),await a(e.getByLabelText(/People needed in total/)).toHaveValue(8),await a(e.getByLabelText(`Libero`)).toHaveValue(1),await a(e.getByLabelText(`Setter`)).toHaveValue(null)}},p={args:{value:{trackRoster:!0,totalTarget:8,positionTargets:[]}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`Inherit default`})),await a(n.onChange).toHaveBeenCalledWith(void 0)}},m={args:{value:{trackRoster:!1,totalTarget:void 0,positionTargets:[]}},play:async({canvas:e})=>{await a(e.getByRole(`switch`,{name:`Track roster`})).toHaveAttribute(`aria-checked`,`false`),await a(e.getByText(/no roster panel on the card/i)).toBeInTheDocument()}},h={args:{positions:[],value:{trackRoster:!0,totalTarget:void 0,positionTargets:[]}},play:async({canvas:e})=>{await a(e.getByText(/Add positions below to require a specific lineup/)).toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: undefined
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('radio', {
      name: 'Inherit default'
    })).toBeChecked();
    await expect(canvas.getByText(/Follows Match: 2 Setter · 12 total/)).toBeInTheDocument();
    await expect(canvas.getByText(/Changing the type's default changes this event too/)).toBeInTheDocument();
    // Nothing to edit while inheriting.
    await expect(canvas.queryByRole('switch', {
      name: 'Track roster'
    })).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: undefined
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Customise'
    }));
    await expect(args.onChange).toHaveBeenCalledWith({
      trackRoster: true,
      totalTarget: 12,
      positionTargets: [{
        positionId: 'p1',
        count: 2
      }]
    });
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    value: {
      trackRoster: true,
      totalTarget: 8,
      positionTargets: []
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Inherit default'
    }));
    await expect(args.onChange).toHaveBeenCalledWith(undefined);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: {
      trackRoster: false,
      totalTarget: undefined,
      positionTargets: []
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('switch', {
      name: 'Track roster'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(canvas.getByText(/no roster panel on the card/i)).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    positions: [],
    value: {
      trackRoster: true,
      totalTarget: undefined,
      positionTargets: []
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/Add positions below to require a specific lineup/)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Inheriting`,`CustomiseSeedsFromTheTypeDefault`,`Customised`,`BackToInheriting`,`CustomisedTrackingOff`,`NoPositionsYet`]})))()}_();export{p as BackToInheriting,d as CustomiseSeedsFromTheTypeDefault,f as Customised,m as CustomisedTrackingOff,u as Inheriting,h as NoPositionsYet,g as __namedExportsOrder,l as default};