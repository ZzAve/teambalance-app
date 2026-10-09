import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-BICbsIep.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-DUXBP51x.js";import{n as o,t as s}from"./AttendanceToggle-B9TjnsuB.js";async function c(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await u(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{i(),n(),o(),l=r(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p={attending:{value:`ATTENDING`},maybe:{value:`MAYBE`},absent:{value:`ABSENT`},notResponded:{value:`NOT_RESPONDED`},disabled:{value:`ATTENDING`,disabled:!0}},m={title:`features/attendance-toggle/AttendanceToggle`,component:s,args:{onToggle:d()},parameters:{chromatic:{modes:t}}},h={args:{value:`ATTENDING`},render:e=>(0,l.jsx)(a,{columns:`grid-cols-1`,items:Object.fromEntries(Object.entries(p).map(([t,n])=>[t,(0,l.jsx)(`div`,{"data-testid":`variant-${t}`,children:(0,l.jsx)(s,{...e,...n})})]))}),play:async({canvas:e})=>{let t=t=>f(e.getByTestId(`variant-${t}`));await c(t(`attending`),`Going`),await c(t(`maybe`),`Maybe`),await c(t(`absent`),`Can't go`),await c(t(`notResponded`),``);for(let e of[`Going`,`Maybe`,`Can't go`])await u(t(`disabled`).getByRole(`button`,{name:e})).toBeDisabled()}},g={parameters:{chromatic:{disableSnapshot:!0}},args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Going`})),await u(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  // Unused by render below — every variant supplies its own \`value\` — but required to satisfy the
  // story's prop contract (\`value\` is required on AttendanceToggle).
  args: {
    value: 'ATTENDING'
  },
  render: args => <Stack columns="grid-cols-1" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`}>
            <AttendanceToggle {...args} {...props} />
          </div>]))} />,
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Gallery`,`Interactions`]})))()}v();export{h as Gallery,g as Interactions,_ as __namedExportsOrder,m as default};