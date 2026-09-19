import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./PanelViewMenu-BvU_mfCg.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./modes-Bzyminl_.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{i(),t(),o=r(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`features/event-panel-view/PanelViewMenu`,component:n,args:{view:`pips`,onViewChange:c(),defaultExpanded:!1,onDefaultExpandedChange:c()},decorators:[e=>(0,o.jsx)(`div`,{className:`flex min-h-[320px] justify-end p-4`,children:(0,o.jsx)(e,{})})],parameters:{chromatic:{modes:{light:a.light,dark:a.dark}},docs:{description:{component:`The events page's view control, beside \`Filters\` in the header: which view a card's roster panel
opens onto, and whether it starts open.

It moved here from inside the panel (ADR-0030 §5, amended). Both settings are one global choice,
and a control drawn once per open card read as a per-card one however the state was actually held
— which is exactly how it was read. The stories below pin the two things that made the move worth
it: one control, and a popover that reports the choice rather than holding it.`}}}},u={play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`View options`});await s(t).toHaveAttribute(`aria-expanded`,`false`),await s(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},d={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`dialog`,{name:`View options`})).toBeInTheDocument(),await s(e.getByRole(`button`,{name:`Positions`})).toHaveAttribute(`aria-pressed`,`true`),await s(e.getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`false`)}},f={args:{view:`members`,defaultExpanded:!0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`button`,{name:`People`})).toHaveAttribute(`aria-pressed`,`true`),await s(e.getByRole(`switch`,{name:`Keep panels open`})).toHaveAttribute(`aria-checked`,`true`),await s(e.getByText(`On — every card starts open`)).toBeInTheDocument()}},p={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`button`,{name:`People`})),await s(n.onViewChange).toHaveBeenCalledWith(`members`)}},m={args:{view:`members`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`button`,{name:`Positions`})),await s(n.onViewChange).toHaveBeenCalledWith(`pips`)}},h={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await s(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0)}},g={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`View options`})),await s(e.getByRole(`dialog`)).toBeInTheDocument(),await t.keyboard(`{Escape}`),await s(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByRole('button', {
      name: 'Positions'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('switch', {
      name: 'Keep panels open'
    })).toHaveAttribute('aria-checked', 'false');
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members',
    defaultExpanded: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await expect(canvas.getByRole('button', {
      name: 'People'
    })).toHaveAttribute('aria-pressed', 'true');
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'People'
    }));
    await expect(args.onViewChange).toHaveBeenCalledWith('members');
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Positions'
    }));
    await expect(args.onViewChange).toHaveBeenCalledWith('pips');
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Closed`,`Open`,`OnTheMemberView`,`PickingAViewIsReported`,`SwitchingBackIsReported`,`KeepOpenIsReported`,`ClosesOnEscape`]})))()}v();export{u as Closed,g as ClosesOnEscape,h as KeepOpenIsReported,f as OnTheMemberView,d as Open,p as PickingAViewIsReported,m as SwitchingBackIsReported,_ as __namedExportsOrder,l as default};