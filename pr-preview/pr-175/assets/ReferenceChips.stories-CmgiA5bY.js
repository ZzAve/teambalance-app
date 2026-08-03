import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./ReferenceChips-BEBnHa4L.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`entities/event/ReferenceChips`,component:n},a={args:{references:[]},play:async({canvas:e})=>{await r(e.queryByRole(`link`)).not.toBeInTheDocument()}},o={args:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`}]},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:/Nevobo/});await r(t).toHaveAttribute(`href`,`https://api.nevobo.nl/permalink/wedstrijd/2018133`),await r(t).toHaveAttribute(`target`,`_blank`),await r(t).toHaveAttribute(`rel`,`noopener noreferrer`)}},s={args:{references:[{title:void 0,url:`https://dwf.volleybal.nl/match/42`}]},play:async({canvas:e})=>{await r(e.getByRole(`link`,{name:/dwf\.volleybal\.nl/})).toBeInTheDocument()}},c={args:{references:[{title:`Nevobo`,url:`https://api.nevobo.nl/a`},{title:`Match form`,url:`https://dwf.volleybal.nl/b`},{title:`Route`,url:`https://maps.example.com/c`},{title:`Roster`,url:`https://roster.example.com/d`}]},play:async({canvas:e})=>{await r(e.getAllByRole(`link`)).toHaveLength(2),await r(e.getByText(`+2`)).toBeInTheDocument()}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    references: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    references: [{
      title: 'Nevobo',
      url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133'
    }]
  },
  play: async ({
    canvas
  }) => {
    const link = canvas.getByRole('link', {
      name: /Nevobo/
    });
    await expect(link).toHaveAttribute('href', 'https://api.nevobo.nl/permalink/wedstrijd/2018133');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    references: [{
      title: undefined,
      url: 'https://dwf.volleybal.nl/match/42'
    }]
  },
  play: async ({
    canvas
  }) => {
    // No title → the host stands in as the label.
    await expect(canvas.getByRole('link', {
      name: /dwf\\.volleybal\\.nl/
    })).toBeInTheDocument();
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    references: [{
      title: 'Nevobo',
      url: 'https://api.nevobo.nl/a'
    }, {
      title: 'Match form',
      url: 'https://dwf.volleybal.nl/b'
    }, {
      title: 'Route',
      url: 'https://maps.example.com/c'
    }, {
      title: 'Roster',
      url: 'https://roster.example.com/d'
    }]
  },
  play: async ({
    canvas
  }) => {
    // Two chips visible, the remaining two collapsed into "+2".
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    await expect(canvas.getByText('+2')).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}},l=[`None`,`OneTitled`,`HostFallbackWhenTitleBlank`,`OverflowCollapsesToPlusN`]})))()}u();export{s as HostFallbackWhenTitleBlank,a as None,o as OneTitled,c as OverflowCollapsesToPlusN,l as __namedExportsOrder,i as default};