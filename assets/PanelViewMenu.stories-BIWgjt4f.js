import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./PanelViewMenu-D0sNcKaD.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./modes-Bzyminl_.js";var o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{i(),t(),o=r(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`features/event-panel-view/PanelViewMenu`,component:n,args:{defaultExpanded:!1,onDefaultExpandedChange:c()},decorators:[e=>(0,o.jsx)(`div`,{className:`flex min-h-[320px] justify-end p-4`,children:(0,o.jsx)(e,{})})],parameters:{chromatic:{modes:{light:a.light,dark:a.dark}},docs:{description:{component:`The events page's view control, beside \`Filters\` in the header: whether a card's roster panel
starts open.

It moved here from inside the panel (ADR-0030 §5, amended), because a control drawn once per open
card read as a per-card one however the state was actually held — which is exactly how it was
read. It held a second setting until the lineup panel landed: §5's pips-or-people choice retired
with the either/or it selected. The stories below pin what is left — a popover that *reports* the
choice rather than holding it, and closes the two ways Filters does.`}}}},u={play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`View options`});await s(t).toHaveAttribute(`aria-expanded`,`false`),await s(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},d={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`dialog`,{name:`View options`})).toBeInTheDocument(),await s(e.getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`false`),await s(e.getByText(`Off — tap to open a card`)).toBeInTheDocument()}},f={args:{defaultExpanded:!0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`true`),await s(e.getByText(`On — every card starts open`)).toBeInTheDocument()}},p={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await s(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0)}},m={args:{defaultExpanded:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await s(n.onDefaultExpandedChange).toHaveBeenCalledWith(!1)}},h={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`dialog`)).toBeInTheDocument(),await t.keyboard(`{Escape}`),await s(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const trigger = canvas.getByRole('button', {
      name: 'View options'
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await expect(canvas.getByRole('switch', {
      name: 'Keep panels open'
    })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText('On — every card starts open')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(false);
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Closed`,`Open`,`KeptOpen`,`KeepOpenIsReported`,`SwitchingBackIsReported`,`ClosesOnEscape`]})))()}_();export{u as Closed,h as ClosesOnEscape,p as KeepOpenIsReported,f as KeptOpen,d as Open,m as SwitchingBackIsReported,g as __namedExportsOrder,l as default};