import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./EventTypeBadge-BKy9uOZw.js";var i,a,o,s,c,l,u;function d(){return(d=e((()=>{n(),i=t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={withColor:{type:{id:`et-1`,name:`Match`,color:`#3b82f6`}},withoutColor:{type:{id:`et-2`,name:`Social`,color:void 0}}},c={title:`entities/event/EventTypeBadge`,component:r},l={args:s.withColor,render:()=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-center gap-4`,children:Object.entries(s).map(([e,t])=>(0,i.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,i.jsx)(r,{...t})},e))}),play:async({canvas:e})=>{let t=t=>o(e.getByTestId(`variant-${t}`));await a(t(`withColor`).getByText(`Match`)).toBeInTheDocument(),await a(t(`withoutColor`).getByText(`Social`)).toBeInTheDocument()}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.withColor,
  render: () => <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <EventTypeBadge {...props} />
        </div>)}
    </div>,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('withColor').getByText('Match')).toBeInTheDocument();
    await expect(variant('withoutColor').getByText('Social')).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u=[`Gallery`]})))()}d();export{l as Gallery,u as __namedExportsOrder,c as default};