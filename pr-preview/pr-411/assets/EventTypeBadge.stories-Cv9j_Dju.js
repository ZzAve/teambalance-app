import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./EventTypeBadge-C7AGEe8W.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={withColor:{type:{id:`et-1`,name:`Match`,color:`#3b82f6`}},withoutColor:{type:{id:`et-2`,name:`Social`,color:void 0}}},u={title:`entities/event/EventTypeBadge`,component:a},d={args:l.withColor,render:()=>(0,o.jsx)(r,{columns:`grid-cols-2`,items:Object.fromEntries(Object.entries(l).map(([e,t])=>[e,(0,o.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,o.jsx)(a,{...t})})]))}),play:async({canvas:e})=>{let t=t=>c(e.getByTestId(`variant-${t}`));await s(t(`withColor`).getByText(`Match`)).toBeInTheDocument(),await s(t(`withoutColor`).getByText(`Social`)).toBeInTheDocument()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.withColor,
  render: () => <Stack columns="grid-cols-2" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`}>
            <EventTypeBadge {...props} />
          </div>]))} />,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('withColor').getByText('Match')).toBeInTheDocument();
    await expect(variant('withoutColor').getByText('Social')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f=[`Gallery`]})))()}p();export{d as Gallery,f as __namedExportsOrder,u as default};