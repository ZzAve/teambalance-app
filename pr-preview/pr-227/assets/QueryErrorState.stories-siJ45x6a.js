import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-ZP1D925K.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./triangle-alert-BJxiKV4T.js";import{n as c,t as l}from"./button-zcc5DqH9.js";function u({title:e,description:t,onRetry:n,retryLabel:r=`Retry`,children:i}){return(0,d.jsxs)(`div`,{role:`alert`,className:`mt-10 flex flex-col items-center gap-4 text-center`,children:[(0,d.jsx)(`div`,{className:`flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500`,children:(0,d.jsx)(s,{size:22})}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`font-display text-lg font-semibold`,children:e}),t&&(0,d.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:t})]}),(0,d.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,d.jsx)(l,{onClick:n,children:r}),i]})]})}var d;function f(){return(f=e((()=>{o(),c(),d=a(),u.__docgenInfo={description:`The shell shown when a query fails to load — distinct from an empty state, so a real failure
never reads as "there's nothing here". Always offers a Retry that re-runs the query; callers pass
any secondary action (a Back link, say) as children.`,methods:[],displayName:`QueryErrorState`,props:{title:{required:!0,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`string`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},retryLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Retry'`,computed:!1}},children:{required:!1,tsType:{name:`ReactNode`},description:`Extra actions rendered beside Retry — e.g. a Back link.`}}}})))()}var p,m,h,g,_,v,y;function b(){return(b=e((()=>{t(),i(),c(),f(),p=a(),{expect:m,fn:h}=__STORYBOOK_MODULE_TEST__,g={title:`shared/ui/QueryErrorState`,component:u,decorators:[n]},_={args:{title:`Couldn't load this event`,description:`Something went wrong on our end.`,onRetry:h()},play:async({canvas:e,userEvent:t,args:n})=>{await m(e.getByText(`Couldn't load this event`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/retry/i})),await m(n.onRetry).toHaveBeenCalled()}},v={args:{title:`Couldn't load this event`,onRetry:h(),children:(0,p.jsx)(l,{asChild:!0,variant:`ghost`,children:(0,p.jsx)(r,{to:`/`,children:`Back to events`})})},play:async({canvas:e})=>{await m(e.getByRole(`button`,{name:/retry/i})).toBeInTheDocument(),await m(e.getByRole(`link`,{name:/back to events/i})).toBeInTheDocument()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Default`,`WithBackAction`]})))()}b();export{_ as Default,v as WithBackAction,y as __namedExportsOrder,g as default};