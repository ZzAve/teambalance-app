import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./ReferenceChips-f87FMjFr.js";var i,a,o,s,c,l,u;function d(){return(d=e((()=>{n(),i=t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={none:{references:[]},oneTitled:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`}]},hostFallbackWhenTitleBlank:{references:[{title:void 0,url:`https://dwf.volleybal.nl/match/42`}]},overflowCollapsesToPlusN:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/a`},{title:`Match form`,url:`https://dwf.volleybal.nl/b`},{title:`Route`,url:`https://maps.example.com/c`},{title:`Roster`,url:`https://roster.example.com/d`}]}},c={title:`entities/event/ReferenceChips`,component:r},l={args:s.oneTitled,render:()=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-start gap-4`,children:Object.entries(s).map(([e,t])=>(0,i.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,i.jsx)(r,{...t})},e))}),play:async({canvas:e})=>{let t=t=>o(e.getByTestId(`variant-${t}`));await a(t(`none`).queryByRole(`link`)).not.toBeInTheDocument();let n=t(`oneTitled`).getByRole(`link`,{name:/Nevobo/});await a(n).toHaveAttribute(`href`,`https://api.nevobo.nl/permalink/wedstrijd/2018133`),await a(n).toHaveAttribute(`target`,`_blank`),await a(n).toHaveAttribute(`rel`,`noopener noreferrer`),await a(t(`hostFallbackWhenTitleBlank`).getByRole(`link`,{name:/dwf\.volleybal\.nl/})).toBeInTheDocument(),await a(t(`overflowCollapsesToPlusN`).getAllByRole(`link`)).toHaveLength(2),await a(t(`overflowCollapsesToPlusN`).getByText(`+2`)).toBeInTheDocument()}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.oneTitled,
  render: () => <div className="flex flex-wrap items-start gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <ReferenceChips {...props} />
        </div>)}
    </div>,
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
}`,...l.parameters?.docs?.source}}},u=[`Gallery`]})))()}d();export{l as Gallery,u as __namedExportsOrder,c as default};