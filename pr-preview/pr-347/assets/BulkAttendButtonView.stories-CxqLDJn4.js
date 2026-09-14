import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./BulkAttendButtonView-C6tYqrLm.js";var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i=t(),{expect:a,fn:o,within:s}=__STORYBOOK_MODULE_TEST__,c={hidden:{count:0},withCount:{count:3},singleEvent:{count:1},singleType:{count:4,typeName:`Training`},pending:{count:3,isPending:!0}},l={title:`features/bulk-attend/BulkAttendButtonView`,component:r,args:{count:3,onAttend:o()}},u={render:e=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-center gap-4`,children:Object.entries(c).map(([t,n])=>(0,i.jsx)(`div`,{"data-testid":`variant-${t}`,children:(0,i.jsx)(r,{...e,...n})},t))}),play:async({canvas:e})=>{let t=t=>s(e.getByTestId(`variant-${t}`));await a(t(`hidden`).queryByRole(`button`)).not.toBeInTheDocument(),await a(t(`withCount`).getByRole(`button`,{name:/Attend 3 events/})).toBeInTheDocument(),await a(t(`singleEvent`).getByRole(`button`,{name:`Attend 1 event`})).toBeInTheDocument(),await a(t(`singleType`).getByRole(`button`,{name:`Attend 4 trainings`})).toBeInTheDocument(),await a(t(`pending`).getByRole(`button`,{name:/Attend 3 events/})).toBeDisabled()}},d={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:/Attend 3 events/})),await a(t.onAttend).toHaveBeenCalled()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <BulkAttendButtonView {...args} {...props} />
        </div>)}
    </div>,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('hidden').queryByRole('button')).not.toBeInTheDocument();
    await expect(variant('withCount').getByRole('button', {
      name: /Attend 3 events/
    })).toBeInTheDocument();

    // Singular noun, so the label never reads "Attend 1 events".
    await expect(variant('singleEvent').getByRole('button', {
      name: 'Attend 1 event'
    })).toBeInTheDocument();
    await expect(variant('singleType').getByRole('button', {
      name: 'Attend 4 trainings'
    })).toBeInTheDocument();
    await expect(variant('pending').getByRole('button', {
      name: /Attend 3 events/
    })).toBeDisabled();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Attend 3 events/
    }));
    await expect(args.onAttend).toHaveBeenCalled();
  }
}`,...d.parameters?.docs?.source}}},f=[`Gallery`,`Interactions`]})))()}p();export{u as Gallery,d as Interactions,f as __namedExportsOrder,l as default};