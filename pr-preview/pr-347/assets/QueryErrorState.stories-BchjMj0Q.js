import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{n as i,t as a}from"./link-BPakRylG.js";import{n as o,t as s}from"./router-decorator-DQHXi5me.js";import{n as c,t as l}from"./button-CmXzxiAJ.js";import{n as u,t as d}from"./QueryErrorState-BU5n1ImL.js";var f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{i(),s(),n(),c(),u(),f=t(),{expect:p,fn:m,within:h}=__STORYBOOK_MODULE_TEST__,g={title:`shared/ui/QueryErrorState`,component:d,decorators:[o]},_={args:{title:`Couldn't load this event`,onRetry:m()},render:()=>(0,f.jsx)(r,{items:{Default:(0,f.jsx)(d,{title:`Couldn't load this event`,description:`Something went wrong on our end.`,onRetry:m()}),WithBackAction:(0,f.jsx)(d,{title:`Couldn't load this event`,onRetry:m(),children:(0,f.jsx)(l,{asChild:!0,variant:`ghost`,children:(0,f.jsx)(a,{to:`/`,children:`Back to events`})})})}}),play:async({canvas:e})=>{let t=t=>h(e.getByRole(`region`,{name:t}));await p(t(`Default`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await p(t(`WithBackAction`).getByRole(`button`,{name:/retry/i})).toBeInTheDocument(),await p(t(`WithBackAction`).getByRole(`link`,{name:/back to events/i})).toBeInTheDocument()}},v={parameters:{chromatic:{disableSnapshot:!0}},args:{title:`Couldn't load this event`,description:`Something went wrong on our end.`,onRetry:m()},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/retry/i})),await p(n.onRetry).toHaveBeenCalled()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  // Unused by render below — Stack supplies each instance's own props — but required to satisfy
  // the story's prop contract (title/onRetry are required on QueryErrorState).
  args: {
    title: "Couldn't load this event",
    onRetry: fn()
  },
  render: () => <Stack items={{
    Default: <QueryErrorState title="Couldn't load this event" description="Something went wrong on our end." onRetry={fn()} />,
    WithBackAction: <QueryErrorState title="Couldn't load this event" onRetry={fn()}>
            <Button asChild variant="ghost">
              <Link to="/">Back to events</Link>
            </Button>
          </QueryErrorState>
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Default').getByText("Couldn't load this event")).toBeInTheDocument();
    await expect(region('WithBackAction').getByRole('button', {
      name: /retry/i
    })).toBeInTheDocument();
    await expect(region('WithBackAction').getByRole('link', {
      name: /back to events/i
    })).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
    await userEvent.click(canvas.getByRole('button', {
      name: /retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...v.parameters?.docs?.source}}},y=[`Gallery`,`Interactions`]})))()}b();export{_ as Gallery,v as Interactions,y as __namedExportsOrder,g as default};