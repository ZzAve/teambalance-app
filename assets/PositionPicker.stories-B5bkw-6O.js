import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./PositionPicker-jFf6dhpK.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),{expect:r,fn:i,within:a}=__STORYBOOK_MODULE_TEST__,o={title:`entities/position/PositionPicker`,component:n,args:{positions:[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`},{id:`p3`,label:`Outside Hitter`}],value:null,onChange:i()}},s={args:{positions:[]},play:async({canvas:e})=>{await r(e.getByText(`Select a position`)).toBeInTheDocument()}},c={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`combobox`));let i=a(document.body);await r(await i.findByRole(`option`,{name:`Setter`})).toBeInTheDocument(),await t.click(i.getByRole(`option`,{name:`Libero`})),await r(n.onChange).toHaveBeenCalledWith(`p2`)}},l={args:{value:`p3`},play:async({canvas:e})=>{await r(a(e.getByRole(`combobox`)).getByText(`Outside Hitter`)).toBeInTheDocument()}},u={args:{includeUnassigned:!0,value:`p1`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`combobox`));let i=a(document.body);await t.click(await i.findByRole(`option`,{name:`Unassigned`})),await r(n.onChange).toHaveBeenCalledWith(null)}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    positions: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Select a position')).toBeInTheDocument();
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of NoPositions — the controlled select closes, settling to the placeholder
  // trigger picture (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    const listbox = within(document.body);
    await expect(await listbox.findByRole('option', {
      name: 'Setter'
    })).toBeInTheDocument();
    await userEvent.click(listbox.getByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChange).toHaveBeenCalledWith('p2');
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'p3'
  },
  play: async ({
    canvas
  }) => {
    await expect(within(canvas.getByRole('combobox')).getByText('Outside Hitter')).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    includeUnassigned: true,
    value: 'p1'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    const listbox = within(document.body);
    await userEvent.click(await listbox.findByRole('option', {
      name: 'Unassigned'
    }));
    await expect(args.onChange).toHaveBeenCalledWith(null);
  }
}`,...u.parameters?.docs?.source}}},d=[`NoPositions`,`HasPositions`,`Preselected`,`WithUnassigned`]})))()}f();export{c as HasPositions,s as NoPositions,l as Preselected,u as WithUnassigned,d as __namedExportsOrder,o as default};