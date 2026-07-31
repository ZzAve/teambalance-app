import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-7ra-rxTo.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./ReferenceRowsEditor-CyebicYv.js";function a({initial:e=[]}){let[t,n]=(0,o.useState)(e);return(0,s.jsx)(i,{rows:t,onChange:n})}var o,s,c,l,u,d,f;function p(){return(p=e((()=>{o=t(),r(),s=n(),{expect:c}=__STORYBOOK_MODULE_TEST__,l={title:`entities/event/ReferenceRowsEditor`,component:a},u={play:async({canvas:e,userEvent:t})=>{await c(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await c(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await c(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await c(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await c(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await c(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},d={args:{initial:[{title:`Nevobo`,url:`https://nevobo.nl`}]},play:async({canvas:e})=>{await c(e.getByLabelText(`Link 1 label`)).toHaveValue(`Nevobo`),await c(e.getByLabelText(`Link 1 URL`)).toHaveValue(`https://nevobo.nl`)}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f=[`AddAndRemove`,`Prefilled`]})))()}p();export{u as AddAndRemove,d as Prefilled,f as __namedExportsOrder,l as default};