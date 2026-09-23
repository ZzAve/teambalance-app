import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-BiajjKFy.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./AttendanceToggle-DdsSF8B5.js";async function o(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await c(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),s=r(),{expect:c,fn:l,within:u}=__STORYBOOK_MODULE_TEST__,d={attending:{value:`ATTENDING`},maybe:{value:`MAYBE`},absent:{value:`ABSENT`},notResponded:{value:`NOT_RESPONDED`},disabled:{value:`ATTENDING`,disabled:!0}},f={title:`features/attendance-toggle/AttendanceToggle`,component:a,args:{onToggle:l()},parameters:{chromatic:{modes:t}}},p={args:{value:`ATTENDING`},render:e=>(0,s.jsx)(`div`,{className:`flex flex-wrap items-start gap-6`,children:Object.entries(d).map(([t,n])=>(0,s.jsx)(`div`,{"data-testid":`variant-${t}`,children:(0,s.jsx)(a,{...e,...n})},t))}),play:async({canvas:e})=>{let t=t=>u(e.getByTestId(`variant-${t}`));await o(t(`attending`),`Going`),await o(t(`maybe`),`Maybe`),await o(t(`absent`),`Can't go`),await o(t(`notResponded`),``);for(let e of[`Going`,`Maybe`,`Can't go`])await c(t(`disabled`).getByRole(`button`,{name:e})).toBeDisabled()}},m={parameters:{chromatic:{disableSnapshot:!0}},args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Going`})),await c(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  // Unused by render below — every variant supplies its own \`value\` — but required to satisfy the
  // story's prop contract (\`value\` is required on AttendanceToggle).
  args: {
    value: 'ATTENDING'
  },
  render: args => <div className="flex flex-wrap items-start gap-6">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <AttendanceToggle {...args} {...props} />
        </div>)}
    </div>,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expectPressed(variant('attending'), 'Going');
    await expectPressed(variant('maybe'), 'Maybe');
    await expectPressed(variant('absent'), "Can't go");
    // No option matches NOT_RESPONDED → none is pressed.
    await expectPressed(variant('notResponded'), '');
    for (const name of ['Going', 'Maybe', "Can't go"]) {
      await expect(variant('disabled').getByRole('button', {
        name
      })).toBeDisabled();
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    value: 'NOT_RESPONDED'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Clicking an option reports its value to the container.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onToggle).toHaveBeenCalledWith('ATTENDING');
  }
}`,...m.parameters?.docs?.source}}},h=[`Gallery`,`Interactions`]})))()}g();export{p as Gallery,m as Interactions,h as __namedExportsOrder,f as default};