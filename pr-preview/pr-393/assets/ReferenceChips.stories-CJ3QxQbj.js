import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./ReferenceChips-DiAY-vmO.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={none:{references:[]},oneTitled:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`}]},hostFallbackWhenTitleBlank:{references:[{title:void 0,url:`https://dwf.volleybal.nl/match/42`}]},overflowCollapsesToPlusN:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/a`},{title:`Match form`,url:`https://dwf.volleybal.nl/b`},{title:`Route`,url:`https://maps.example.com/c`},{title:`Roster`,url:`https://roster.example.com/d`}]}},u={title:`entities/event/ReferenceChips`,component:a},d={args:l.oneTitled,render:()=>(0,o.jsx)(r,{columns:`grid-cols-1`,items:Object.fromEntries(Object.entries(l).map(([e,t])=>[e,(0,o.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,o.jsx)(a,{...t})})]))}),play:async({canvas:e})=>{let t=t=>c(e.getByTestId(`variant-${t}`));await s(t(`none`).queryByRole(`link`)).not.toBeInTheDocument();let n=t(`oneTitled`).getByRole(`link`,{name:/Nevobo/});await s(n).toHaveAttribute(`href`,`https://api.nevobo.nl/permalink/wedstrijd/2018133`),await s(n).toHaveAttribute(`target`,`_blank`),await s(n).toHaveAttribute(`rel`,`noopener noreferrer`),await s(t(`hostFallbackWhenTitleBlank`).getByRole(`link`,{name:/dwf\.volleybal\.nl/})).toBeInTheDocument(),await s(t(`overflowCollapsesToPlusN`).getAllByRole(`link`)).toHaveLength(2),await s(t(`overflowCollapsesToPlusN`).getByText(`+2`)).toBeInTheDocument()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.oneTitled,
  render: () => <Stack columns="grid-cols-1" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`}>
            <ReferenceChips {...props} />
          </div>]))} />,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('none').queryByRole('link')).not.toBeInTheDocument();
    const link = variant('oneTitled').getByRole('link', {
      name: /Nevobo/
    });
    await expect(link).toHaveAttribute('href', 'https://api.nevobo.nl/permalink/wedstrijd/2018133');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // No title → the host stands in as the label.
    await expect(variant('hostFallbackWhenTitleBlank').getByRole('link', {
      name: /dwf\\.volleybal\\.nl/
    })).toBeInTheDocument();

    // Two chips visible, the remaining two collapsed into "+2".
    await expect(variant('overflowCollapsesToPlusN').getAllByRole('link')).toHaveLength(2);
    await expect(variant('overflowCollapsesToPlusN').getByText('+2')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f=[`Gallery`]})))()}p();export{d as Gallery,f as __namedExportsOrder,u as default};