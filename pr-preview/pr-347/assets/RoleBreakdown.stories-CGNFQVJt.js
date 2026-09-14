import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./RoleBreakdown-DzPq8mLr.js";var i,a,o,s,c,l,u;function d(){return(d=e((()=>{n(),i=t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={populated:{breakdown:[{role:`Setter`,attending:2},{role:`Outside Hitter`,attending:3},{role:`Libero`,attending:1}]},empty:{breakdown:[]},withUnassigned:{breakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1},{role:`Unassigned`,attending:3}]}},c={title:`entities/event/RoleBreakdown`,component:r},l={args:s.populated,render:()=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-start gap-4`,children:Object.entries(s).map(([e,t])=>(0,i.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,i.jsx)(r,{...t})},e))}),play:async({canvas:e})=>{let t=t=>o(e.getByTestId(`variant-${t}`));await a(t(`populated`).getByText(`2 Setter`)).toBeInTheDocument(),await a(t(`populated`).getByText(`3 Outside Hitter`)).toBeInTheDocument(),await a(t(`populated`).getByText(`1 Libero`)).toBeInTheDocument(),await a(e.getByTestId(`variant-empty`)).toBeEmptyDOMElement(),await a(t(`withUnassigned`).getByText(`2 Setter`)).toBeInTheDocument(),await a(t(`withUnassigned`).getByText(`3 Unassigned`)).toBeInTheDocument()}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.populated,
  render: () => <div className="flex flex-wrap items-start gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <RoleBreakdown {...props} />
        </div>)}
    </div>,
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
}`,...l.parameters?.docs?.source}}},u=[`Gallery`]})))()}d();export{l as Gallery,u as __namedExportsOrder,c as default};