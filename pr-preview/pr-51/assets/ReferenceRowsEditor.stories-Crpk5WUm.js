import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-btLskBPn.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{n as i,t as a}from"./ReferenceRowsEditor-Ds03HcQG.js";function o({initial:e=[]}){let[t,n]=(0,s.useState)(e);return(0,c.jsx)(a,{rows:t,onChange:n})}var s,c,l,u,d,f,p;e((()=>{s=t(n(),1),i(),c=r(),{expect:l}=__STORYBOOK_MODULE_TEST__,u={title:`entities/event/ReferenceRowsEditor`,component:o},d={play:async({canvas:e,userEvent:t})=>{await l(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await l(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await l(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},f={args:{initial:[{title:`Nevobo`,url:`https://nevobo.nl`}]},play:async({canvas:e})=>{await l(e.getByLabelText(`Link 1 label`)).toHaveValue(`Nevobo`),await l(e.getByLabelText(`Link 1 URL`)).toHaveValue(`https://nevobo.nl`)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.queryByLabelText('Link 1 URL')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 label')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 2 URL')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Remove link 1'
    }));
    await expect(canvas.queryByLabelText('Link 2 URL')).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    initial: [{
      title: 'Nevobo',
      url: 'https://nevobo.nl'
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Link 1 label')).toHaveValue('Nevobo');
    await expect(canvas.getByLabelText('Link 1 URL')).toHaveValue('https://nevobo.nl');
  }
}`,...f.parameters?.docs?.source}}},p=[`AddAndRemove`,`Prefilled`]}))();export{d as AddAndRemove,f as Prefilled,p as __namedExportsOrder,u as default};