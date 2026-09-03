import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./ThemeToggleView-Hn6YBqP6.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";var i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),i=r(),{expect:a,fn:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`features/theme-toggle/ThemeToggleView`,component:n,args:{value:`system`,onChange:o()}},l={play:async({canvas:e})=>{await a(e.getByRole(`radio`,{name:`System`})).toBeChecked(),await a(e.getByRole(`radio`,{name:`Light`})).not.toBeChecked(),await a(e.getByRole(`radio`,{name:`Dark`})).not.toBeChecked()}},u={args:{value:`light`},play:async({canvas:e})=>{await a(e.getByRole(`radio`,{name:`Light`})).toBeChecked(),await a(e.getByRole(`radio`,{name:`System`})).not.toBeChecked()}},d={args:{value:`dark`},play:async({canvas:e})=>{await a(e.getByRole(`radio`,{name:`Dark`})).toBeChecked(),await a(e.getByRole(`radio`,{name:`System`})).not.toBeChecked()}},f={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`Dark`})),await a(n.onChange).toHaveBeenCalledWith(`dark`)}},p={parameters:{chromatic:{disableSnapshot:!0}},args:{value:`dark`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`System`})),await a(n.onChange).toHaveBeenCalledWith(`system`)}},m={args:{value:`dark`},globals:{theme:`dark`},decorators:[e=>(0,i.jsx)(`div`,{className:`p-6`,children:(0,i.jsx)(e,{})})],play:async({canvasElement:e})=>{let t=s(e).getByRole(`radiogroup`);await a(getComputedStyle(t).backgroundColor).toBe(`rgb(29, 27, 23)`),await a(document.documentElement.classList.contains(`dark`)).toBe(!0)}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('radio', {
      name: 'System'
    })).toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'Light'
    })).not.toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'Dark'
    })).not.toBeChecked();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'light'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('radio', {
      name: 'Light'
    })).toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'System'
    })).not.toBeChecked();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'dark'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('radio', {
      name: 'Dark'
    })).toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'System'
    })).not.toBeChecked();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of SystemSelected — the control is controlled, so the click reports to onChange
  // without moving the checked radio; the picture stays SystemSelected (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Dark'
    }));
    await expect(args.onChange).toHaveBeenCalledWith('dark');
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of DarkSelected — controlled click, so the picture stays DarkSelected
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    value: 'dark'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('radio', {
      name: 'System'
    }));
    await expect(args.onChange).toHaveBeenCalledWith('system');
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'dark'
  },
  globals: {
    theme: 'dark'
  },
  decorators: [Story => <div className="p-6">
        <Story />
      </div>],
  play: async ({
    canvasElement
  }) => {
    // Prove the layer is live rather than merely requested: the control's surface must resolve to
    // the dark card token, not the cream one.
    const surface = within(canvasElement).getByRole('radiogroup');
    await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(29, 27, 23)');
    await expect(document.documentElement.classList.contains('dark')).toBe(true);
  }
}`,...m.parameters?.docs?.source},description:{story:"The same control under the dark token layer, opted in via the preview's `theme` global — the\nexact mechanism the toolbar switcher and the app itself use (`.dark` on the document root), not a\nstory-local wrapper. So this is a real dark-mode render, it holds Chromatic's dark baseline, and\nit fails if the global theme switcher ever stops applying the layer.",...m.parameters?.docs?.description}}},h=[`SystemSelected`,`LightSelected`,`DarkSelected`,`ChoosingDark`,`ReturningToSystem`,`Dark`]})))()}g();export{f as ChoosingDark,m as Dark,d as DarkSelected,u as LightSelected,p as ReturningToSystem,l as SystemSelected,h as __namedExportsOrder,c as default};