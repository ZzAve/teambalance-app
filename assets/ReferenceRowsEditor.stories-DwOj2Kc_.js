import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-LQtsLFQQ.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./ReferenceRowsEditor-CrjUvF_f.js";function a({initial:e=[],onChange:t}){let[n,r]=(0,o.useState)(e);return(0,s.jsx)(i,{rows:n,onChange:e=>{t?.(e),r(e)}})}var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{o=t(),r(),s=n(),{expect:c,fn:l}=__STORYBOOK_MODULE_TEST__,u={title:`entities/event/ReferenceRowsEditor`,component:a,args:{onChange:l()}},d={play:async({canvas:e,userEvent:t})=>{await c(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await c(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await c(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await c(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await c(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await c(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},f={args:{initial:[{title:`Nevobo`,url:`https://nevobo.nl`}]},play:async({canvas:e})=>{await c(e.getByLabelText(`Link 1 label`)).toHaveValue(`Nevobo`),await c(e.getByLabelText(`Link 1 URL`)).toHaveValue(`https://nevobo.nl`)}},p={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Add link/})),await c(n.onChange).toHaveBeenCalledWith([{title:``,url:``}]),await t.type(e.getByLabelText(`Link 1 URL`),`https://nevobo.nl`),await c(n.onChange).toHaveBeenLastCalledWith([{title:``,url:`https://nevobo.nl`}])}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(args.onChange).toHaveBeenCalledWith([{
      title: '',
      url: ''
    }]);
    await userEvent.type(canvas.getByLabelText('Link 1 URL'), 'https://nevobo.nl');
    await expect(args.onChange).toHaveBeenLastCalledWith([{
      title: '',
      url: 'https://nevobo.nl'
    }]);
  }
}`,...p.parameters?.docs?.source}}},m=[`AddAndRemove`,`Prefilled`,`ReportsEdits`]})))()}h();export{d as AddAndRemove,f as Prefilled,p as ReportsEdits,m as __namedExportsOrder,u as default};