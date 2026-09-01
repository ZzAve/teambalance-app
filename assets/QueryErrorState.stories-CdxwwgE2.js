import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-oYYUHQ4-.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./button-Cu1jXv-P.js";import{n as c,t as l}from"./QueryErrorState-_WTwmUbE.js";var u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),i(),o(),c(),u=a(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`shared/ui/QueryErrorState`,component:l,decorators:[n]},m={args:{title:`Couldn't load this event`,description:`Something went wrong on our end.`,onRetry:f()},play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByText(`Couldn't load this event`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/retry/i})),await d(n.onRetry).toHaveBeenCalled()}},h={args:{title:`Couldn't load this event`,onRetry:f(),children:(0,u.jsx)(s,{asChild:!0,variant:`ghost`,children:(0,u.jsx)(r,{to:`/`,children:`Back to events`})})},play:async({canvas:e})=>{await d(e.getByRole(`button`,{name:/retry/i})).toBeInTheDocument(),await d(e.getByRole(`link`,{name:/back to events/i})).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Couldn't load this event",
    description: 'Something went wrong on our end.',
    onRetry: fn()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText("Couldn't load this event")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Couldn't load this event",
    onRetry: fn(),
    children: <Button asChild variant="ghost">
        <Link to="/">Back to events</Link>
      </Button>
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /retry/i
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: /back to events/i
    })).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Default`,`WithBackAction`]})))()}_();export{m as Default,h as WithBackAction,g as __namedExportsOrder,p as default};