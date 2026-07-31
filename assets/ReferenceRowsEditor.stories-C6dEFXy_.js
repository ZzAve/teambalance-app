import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BXclvPvy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{n as i,t as a}from"./ReferenceRowsEditor-BATJLo6x.js";function o({initial:e=[],onChange:t}){let[n,r]=(0,s.useState)(e);return(0,c.jsx)(a,{rows:n,onChange:e=>{t?.(e),r(e)}})}var s,c,l,u,d,f,p,m,h;e((()=>{s=t(n(),1),i(),c=r(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d={title:`entities/event/ReferenceRowsEditor`,component:o,args:{onChange:u()}},f={play:async({canvas:e,userEvent:t})=>{await l(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await l(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await l(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},p={args:{initial:[{title:`Nevobo`,url:`https://nevobo.nl`}]},play:async({canvas:e})=>{await l(e.getByLabelText(`Link 1 label`)).toHaveValue(`Nevobo`),await l(e.getByLabelText(`Link 1 URL`)).toHaveValue(`https://nevobo.nl`)}},m={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Add link/})),await l(n.onChange).toHaveBeenCalledWith([{title:``,url:``}]),await t.type(e.getByLabelText(`Link 1 URL`),`https://nevobo.nl`),await l(n.onChange).toHaveBeenLastCalledWith([{title:``,url:`https://nevobo.nl`}])}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h=[`AddAndRemove`,`Prefilled`,`ReportsEdits`]}))();export{f as AddAndRemove,p as Prefilled,m as ReportsEdits,h as __namedExportsOrder,d as default};