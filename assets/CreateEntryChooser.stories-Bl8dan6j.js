import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./CreateEntryChooser-cGtMvL6n.js";var r,i,a,o,s;function c(){return(c=e((()=>{t(),{expect:r,fn:i}=__STORYBOOK_MODULE_TEST__,a={title:`widgets/create-event/CreateEntryChooser`,component:n,args:{onSingle:i(),onRecurring:i()}},o={play:async({canvas:e,userEvent:t,args:n})=>{await r(e.getByText(`Single event`)).toBeInTheDocument(),await r(e.getByText(`Recurring series`)).toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await r(n.onSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await r(n.onRecurring).toHaveBeenCalled()}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('Single event')).toBeInTheDocument();
    await expect(canvas.getByText('Recurring series')).toBeInTheDocument();
    await userEvent.click(canvas.getByText('Single event'));
    await expect(args.onSingle).toHaveBeenCalled();
    await userEvent.click(canvas.getByText('Recurring series'));
    await expect(args.onRecurring).toHaveBeenCalled();
  }
}`,...o.parameters?.docs?.source}}},s=[`Default`]})))()}c();export{o as Default,s as __namedExportsOrder,a as default};