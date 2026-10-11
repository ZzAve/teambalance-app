import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./RoleBreakdown-QN_vWfAD.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={populated:{breakdown:[{role:`Setter`,attending:2},{role:`Outside Hitter`,attending:3},{role:`Libero`,attending:1}]},empty:{breakdown:[]},withUnassigned:{breakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1},{role:`Unassigned`,attending:3}]}},u={title:`entities/event/RoleBreakdown`,component:a},d={args:l.populated,render:()=>(0,o.jsx)(r,{columns:`grid-cols-1`,items:Object.fromEntries(Object.entries(l).map(([e,t])=>[e,(0,o.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,o.jsx)(a,{...t})})]))}),play:async({canvas:e})=>{let t=t=>c(e.getByTestId(`variant-${t}`));await s(t(`populated`).getByText(`2 Setter`)).toBeInTheDocument(),await s(t(`populated`).getByText(`3 Outside Hitter`)).toBeInTheDocument(),await s(t(`populated`).getByText(`1 Libero`)).toBeInTheDocument(),await s(e.getByTestId(`variant-empty`)).toBeEmptyDOMElement(),await s(t(`withUnassigned`).getByText(`2 Setter`)).toBeInTheDocument(),await s(t(`withUnassigned`).getByText(`3 Unassigned`)).toBeInTheDocument()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.populated,
  render: () => <Stack columns="grid-cols-1" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`}>
            <RoleBreakdown {...props} />
          </div>]))} />,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('populated').getByText('2 Setter')).toBeInTheDocument();
    await expect(variant('populated').getByText('3 Outside Hitter')).toBeInTheDocument();
    await expect(variant('populated').getByText('1 Libero')).toBeInTheDocument();

    // Nothing to break down -> the component renders nothing at all.
    await expect(canvas.getByTestId('variant-empty')).toBeEmptyDOMElement();
    await expect(variant('withUnassigned').getByText('2 Setter')).toBeInTheDocument();
    await expect(variant('withUnassigned').getByText('3 Unassigned')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f=[`Gallery`]})))()}p();export{d as Gallery,f as __namedExportsOrder,u as default};