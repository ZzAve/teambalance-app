import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./PanelViewMenu-C8pVceF7.js";var o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`features/event-panel-view/PanelViewMenu`,component:a,args:{defaultExpanded:!1,onDefaultExpandedChange:c()},decorators:[e=>(0,o.jsx)(`div`,{className:`flex min-h-[320px] justify-end p-4`,children:(0,o.jsx)(e,{})})],parameters:{docs:{description:{component:`The events page's view control, beside \`Filters\` in the header: whether a card's roster panel
starts open.

It moved here from inside the panel (ADR-0030 §5, amended), because a control drawn once per open
card read as a per-card one however the state was actually held — which is exactly how it was
read. It held a second setting until the lineup panel landed: §5's pips-or-people choice retired
with the either/or it selected. The stories below pin what is left — a popover that *reports* the
choice rather than holding it, and closes the two ways Filters does.

Four stories (ADR-0032 §3): this View is rendered inside the events page composite, which owns the
closed picture, so Data is \`disableSnapshot\`. Shells catalogues the one remaining static
configuration — pixel-identical closed, since the trigger carries no state of its own — in one
frame. \`MenuOpen\` is the one extra snapshotted story: the open popover is a state the page
composite can never show. Interactions keeps every onDefaultExpandedChange spy assertion plus the
escape-close assertion.`}}}},d={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`View options`});await s(t).toHaveAttribute(`aria-expanded`,`false`),await s(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},f={render:e=>(0,o.jsx)(r,{items:{"Kept open by default":(0,o.jsx)(a,{...e,defaultExpanded:!0})}}),play:async({canvas:e})=>{let t=l(e.getByRole(`region`,{name:`Kept open by default`}));await s(t.getByRole(`button`,{name:`View options`})).toHaveAttribute(`aria-expanded`,`false`),await s(t.queryByRole(`dialog`)).not.toBeInTheDocument()}},p={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`dialog`,{name:`View options`})).toBeInTheDocument(),await s(e.getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`false`),await s(e.getByText(`Off — tap to open a card`)).toBeInTheDocument()}},m={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,o.jsx)(r,{items:{Default:(0,o.jsx)(a,{...e}),"Kept open by default":(0,o.jsx)(a,{...e,defaultExpanded:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>l(e.getByRole(`region`,{name:t}));await t.click(r(`Default`).getByRole(`button`,{name:`View options`})),await t.click(r(`Default`).getByRole(`switch`,{name:`Keep panels open`})),await s(n.onDefaultExpandedChange).toHaveBeenLastCalledWith(!0),await s(r(`Default`).getByRole(`dialog`)).toBeInTheDocument(),await t.keyboard(`{Escape}`),await s(r(`Default`).queryByRole(`dialog`)).not.toBeInTheDocument(),await t.click(r(`Kept open by default`).getByRole(`button`,{name:`View options`})),await s(r(`Kept open by default`).getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`true`),await s(r(`Kept open by default`).getByText(`On — every card starts open`)).toBeInTheDocument(),await t.click(r(`Kept open by default`).getByRole(`switch`,{name:`Keep panels open`})),await s(n.onDefaultExpandedChange).toHaveBeenLastCalledWith(!1)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    const trigger = canvas.getByRole('button', {
      name: 'View options'
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Closed, and pixel-identical to Data — the trigger carries no state of its own — but worth
    // cataloguing: the keep-open preference does not leak into the closed a11y state either.
    'Kept open by default': <PanelViewMenu {...args} defaultExpanded />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = within(canvas.getByRole('region', {
      name: 'Kept open by default'
    }));
    await expect(region.getByRole('button', {
      name: 'View options'
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(region.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await expect(canvas.getByRole('dialog', {
      name: 'View options'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', {
      name: 'Keep panels open'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(canvas.getByText('Off — tap to open a card')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <PanelViewMenu {...args} />,
    'Kept open by default': <PanelViewMenu {...args} defaultExpanded />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // The gesture is reported, not held — flipping the preference on.
    await userEvent.click(region('Default').getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(region('Default').getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(true);

    // The popover closes on Escape and on a click outside, the same two paths Filters offers — the
    // handler lives on the document because focus stays on the trigger, a sibling of the panel.
    await expect(region('Default').getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(region('Default').queryByRole('dialog')).not.toBeInTheDocument();

    // On the kept-open-by-default control: the switch reads on and the caption says so, and
    // reclassifying is not one-way — switching back off is the same report in the other direction.
    await userEvent.click(region('Kept open by default').getByRole('button', {
      name: 'View options'
    }));
    await expect(region('Kept open by default').getByRole('switch', {
      name: 'Keep panels open'
    })).toHaveAttribute('aria-checked', 'true');
    await expect(region('Kept open by default').getByText('On — every card starts open')).toBeInTheDocument();
    await userEvent.click(region('Kept open by default').getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false);
  }
}`,...m.parameters?.docs?.source}}},h=[`Data`,`Shells`,`MenuOpen`,`Interactions`]})))()}g();export{d as Data,m as Interactions,p as MenuOpen,f as Shells,h as __namedExportsOrder,u as default};