import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./PositionPicker-o9hHn9zP.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`entities/position/PositionPicker`,component:a,args:{positions:[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Outside Hitter`,kind:`PLAYING`}],value:null,onChange:c()}},d={render:e=>(0,o.jsxs)(`div`,{className:`flex flex-wrap items-center gap-4`,children:[(0,o.jsx)(`div`,{"data-testid":`variant-noPositions`,children:(0,o.jsx)(a,{...e,positions:[]})}),(0,o.jsx)(`div`,{"data-testid":`variant-preselected`,children:(0,o.jsx)(a,{...e,value:`p3`})})]}),play:async({canvas:e})=>{let t=t=>l(e.getByTestId(`variant-${t}`));await s(t(`noPositions`).getByText(`Select a position`)).toBeInTheDocument(),await s(l(t(`preselected`).getByRole(`combobox`)).getByText(`Outside Hitter`)).toBeInTheDocument()}},f={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,o.jsx)(r,{items:{"Has positions":(0,o.jsx)(a,{...e}),"With unassigned":(0,o.jsx)(a,{...e,includeUnassigned:!0,value:`p1`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>l(e.getByRole(`region`,{name:t})),i=l(document.body);await t.click(r(`Has positions`).getByRole(`combobox`)),await s(await i.findByRole(`option`,{name:`Setter`})).toBeInTheDocument(),await t.click(i.getByRole(`option`,{name:`Libero`})),await s(n.onChange).toHaveBeenLastCalledWith(`p2`),await t.click(r(`With unassigned`).getByRole(`combobox`)),await t.click(await i.findByRole(`option`,{name:`Unassigned`})),await s(n.onChange).toHaveBeenLastCalledWith(null)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-4">
      {/* No positions defined: the trigger still renders with its placeholder and no options. */}
      <div data-testid="variant-noPositions">
        <PositionPicker {...args} positions={[]} />
      </div>
      {/* A preselected value shows the current position's label in the trigger. */}
      <div data-testid="variant-preselected">
        <PositionPicker {...args} value="p3" />
      </div>
    </div>,
  play: async ({
    canvas
  }) => {
    const variant = (name: string) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('noPositions').getByText('Select a position')).toBeInTheDocument();
    await expect(within(variant('preselected').getByRole('combobox')).getByText('Outside Hitter')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Has positions': <PositionPicker {...args} />,
    'With unassigned': <PositionPicker {...args} includeUnassigned value="p1" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const listbox = within(document.body);

    // Positions available: opening the picker lists them and choosing one emits its id.
    await userEvent.click(region('Has positions').getByRole('combobox'));
    await expect(await listbox.findByRole('option', {
      name: 'Setter'
    })).toBeInTheDocument();
    await userEvent.click(listbox.getByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith('p2');

    // The roster variant offers an explicit Unassigned choice that emits null.
    await userEvent.click(region('With unassigned').getByRole('combobox'));
    await userEvent.click(await listbox.findByRole('option', {
      name: 'Unassigned'
    }));
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
  }
}`,...f.parameters?.docs?.source}}},p=[`Gallery`,`Interactions`]})))()}m();export{d as Gallery,f as Interactions,p as __namedExportsOrder,u as default};