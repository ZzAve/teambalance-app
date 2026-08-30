import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-rWADIeMB.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-C7SLCUJI.js";var a,o;function s(){return(s=e((()=>{r(),a=[[`rect`,{width:`20`,height:`14`,x:`2`,y:`3`,rx:`2`,key:`48i651`}],[`line`,{x1:`8`,x2:`16`,y1:`21`,y2:`21`,key:`1svkeh`}],[`line`,{x1:`12`,x2:`12`,y1:`17`,y2:`21`,key:`vw1qmm`}]],o=i(`monitor`,a)})))()}var c,l;function u(){return(u=e((()=>{r(),c=[[`path`,{d:`M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,key:`kfwtm`}]],l=i(`moon`,c)})))()}var d,f;function p(){return(p=e((()=>{r(),d=[[`circle`,{cx:`12`,cy:`12`,r:`4`,key:`4exip2`}],[`path`,{d:`M12 2v2`,key:`tus03m`}],[`path`,{d:`M12 20v2`,key:`1lh1kg`}],[`path`,{d:`m4.93 4.93 1.41 1.41`,key:`149t6j`}],[`path`,{d:`m17.66 17.66 1.41 1.41`,key:`ptbguv`}],[`path`,{d:`M2 12h2`,key:`1t8f8n`}],[`path`,{d:`M20 12h2`,key:`1q8mjw`}],[`path`,{d:`m6.34 17.66-1.41 1.41`,key:`1m8zz5`}],[`path`,{d:`m19.07 4.93-1.41 1.41`,key:`1shlcs`}]],f=i(`sun`,d)})))()}function m({value:e,onChange:t}){let n=(0,h.useId)(),r=(0,h.useId)();return(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`h3`,{id:n,className:`text-sm font-semibold text-muted-foreground`,children:`Appearance`}),(0,g.jsx)(`p`,{className:`mt-1 text-xs text-muted-foreground`,children:`System follows your device's light or dark setting.`}),(0,g.jsx)(`div`,{role:`radiogroup`,"aria-labelledby":n,className:`mt-3 grid grid-cols-3 gap-1 rounded-xl border border-border bg-card p-1`,children:_.map(({value:n,label:i,Icon:a})=>{let o=e===n;return(0,g.jsxs)(`label`,{className:`cursor-pointer`,children:[(0,g.jsx)(`input`,{type:`radio`,name:r,value:n,checked:o,onChange:()=>t(n),className:`peer sr-only`}),(0,g.jsxs)(`span`,{className:[`flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition-colors`,`peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card`,o?`bg-blue/10 text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),children:[(0,g.jsx)(a,{size:16,"aria-hidden":`true`}),i]})]},n)})})]})}var h,g,_;function v(){return(v=e((()=>{h=t(),s(),u(),p(),g=n(),_=[{value:`system`,label:`System`,Icon:o},{value:`light`,label:`Light`,Icon:f},{value:`dark`,label:`Dark`,Icon:l}],m.__docgenInfo={description:`The appearance control (F11, #159): System / Light / Dark, prop-only.

Native radios in a labelled radiogroup rather than buttons with \`aria-pressed\`, so the group gets
arrow-key navigation, the "one of three" relationship and the checked state from the platform
instead of a hand-rolled approximation. The inputs are \`sr-only\`; the visible chip is their
sibling, which also carries the focus ring (\`peer-focus-visible\`) so keyboard focus stays visible.

\`System\` is listed first because it is the default: it is where a user who has never chosen sits,
and the option they return to when they want the OS back.`,methods:[],displayName:`ThemeToggleView`,props:{value:{required:!0,tsType:{name:`ThemePreference`},description:"The stored preference — `system` when the user has never chosen, which is the default."},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(preference: ThemePreference) => void`,signature:{arguments:[{type:{name:`ThemePreference`},name:`preference`}],return:{name:`void`}}},description:``}}}})))()}var y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{v(),y=n(),{expect:b,fn:x,within:S}=__STORYBOOK_MODULE_TEST__,C={title:`features/theme-toggle/ThemeToggleView`,component:m,args:{value:`system`,onChange:x()}},w={play:async({canvas:e})=>{await b(e.getByRole(`radio`,{name:`System`})).toBeChecked(),await b(e.getByRole(`radio`,{name:`Light`})).not.toBeChecked(),await b(e.getByRole(`radio`,{name:`Dark`})).not.toBeChecked()}},T={args:{value:`light`},play:async({canvas:e})=>{await b(e.getByRole(`radio`,{name:`Light`})).toBeChecked(),await b(e.getByRole(`radio`,{name:`System`})).not.toBeChecked()}},E={args:{value:`dark`},play:async({canvas:e})=>{await b(e.getByRole(`radio`,{name:`Dark`})).toBeChecked(),await b(e.getByRole(`radio`,{name:`System`})).not.toBeChecked()}},D={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`Dark`})),await b(n.onChange).toHaveBeenCalledWith(`dark`)}},O={args:{value:`dark`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`radio`,{name:`System`})),await b(n.onChange).toHaveBeenCalledWith(`system`)}},k={args:{value:`dark`},globals:{theme:`dark`},decorators:[e=>(0,y.jsx)(`div`,{className:`p-6`,children:(0,y.jsx)(e,{})})],play:async({canvasElement:e})=>{let t=S(e).getByRole(`radiogroup`);await b(getComputedStyle(t).backgroundColor).toBe(`rgb(29, 27, 23)`),await b(document.documentElement.classList.contains(`dark`)).toBe(!0)}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source},description:{story:"The same control under the dark token layer, opted in via the preview's `theme` global — the\nexact mechanism the toolbar switcher and the app itself use (`.dark` on the document root), not a\nstory-local wrapper. So this is a real dark-mode render, it holds Chromatic's dark baseline, and\nit fails if the global theme switcher ever stops applying the layer.",...k.parameters?.docs?.description}}},A=[`SystemSelected`,`LightSelected`,`DarkSelected`,`ChoosingDark`,`ReturningToSystem`,`Dark`]})))()}j();export{D as ChoosingDark,k as Dark,E as DarkSelected,T as LightSelected,O as ReturningToSystem,w as SystemSelected,A as __namedExportsOrder,C as default};