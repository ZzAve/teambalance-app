import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-BiajjKFy.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as s}from"./ThemeToggleView-BFe1VfSf.js";var c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{i(),n(),o(),c=r(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`features/theme-toggle/ThemeToggleView`,component:s,args:{value:`system`,onChange:u()}},p={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await l(e.getByRole(`radio`,{name:`System`})).toBeChecked(),await l(e.getByRole(`radio`,{name:`Light`})).not.toBeChecked(),await l(e.getByRole(`radio`,{name:`Dark`})).not.toBeChecked()}},m={render:e=>(0,c.jsx)(a,{items:{Light:(0,c.jsx)(s,{...e,value:`light`}),Dark:(0,c.jsx)(s,{...e,value:`dark`})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t}));await l(t(`Light`).getByRole(`radio`,{name:`Light`})).toBeChecked(),await l(t(`Light`).getByRole(`radio`,{name:`System`})).not.toBeChecked(),await l(t(`Dark`).getByRole(`radio`,{name:`Dark`})).toBeChecked(),await l(t(`Dark`).getByRole(`radio`,{name:`System`})).not.toBeChecked()}},h={parameters:{chromatic:{disableSnapshot:!0}},globals:{theme:`dark`},render:e=>(0,c.jsx)(a,{items:{"From system":(0,c.jsx)(s,{...e}),"From dark":(0,c.jsx)(s,{...e,value:`dark`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>d(e.getByRole(`region`,{name:t})),i=r(`From dark`).getByRole(`radiogroup`);await l(getComputedStyle(i).backgroundColor).toBe(`rgb(29, 27, 23)`),await l(document.documentElement.classList.contains(`dark`)).toBe(!0),await t.click(r(`From system`).getByRole(`radio`,{name:`Dark`})),await l(n.onChange).toHaveBeenLastCalledWith(`dark`),await t.click(r(`From dark`).getByRole(`radio`,{name:`System`})),await l(n.onChange).toHaveBeenLastCalledWith(`system`)}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      modes: darkMode
    }
  },
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Light: <ThemeToggleView {...args} value="light" />,
    Dark: <ThemeToggleView {...args} value="dark" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Light').getByRole('radio', {
      name: 'Light'
    })).toBeChecked();
    await expect(region('Light').getByRole('radio', {
      name: 'System'
    })).not.toBeChecked();
    await expect(region('Dark').getByRole('radio', {
      name: 'Dark'
    })).toBeChecked();
    await expect(region('Dark').getByRole('radio', {
      name: 'System'
    })).not.toBeChecked();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  globals: {
    theme: 'dark'
  },
  render: args => <Stack items={{
    'From system': <ThemeToggleView {...args} />,
    'From dark': <ThemeToggleView {...args} value="dark" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Prove the layer is live rather than merely requested: the control's surface must resolve to
    // the dark card token, not the cream one.
    const surface = region('From dark').getByRole('radiogroup');
    await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(29, 27, 23)');
    await expect(document.documentElement.classList.contains('dark')).toBe(true);
    await userEvent.click(region('From system').getByRole('radio', {
      name: 'Dark'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith('dark');

    // Reachable in the other direction too — back to the default.
    await userEvent.click(region('From dark').getByRole('radio', {
      name: 'System'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith('system');
  }
}`,...h.parameters?.docs?.source}}},g=[`Data`,`Shells`,`Interactions`]})))()}_();export{p as Data,h as Interactions,m as Shells,g as __namedExportsOrder,f as default};