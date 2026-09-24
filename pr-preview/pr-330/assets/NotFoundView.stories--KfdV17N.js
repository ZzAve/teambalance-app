import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./link-DGdRUlmH.js";import{n as o,t as s}from"./router-decorator-CQxXEzr2.js";import{n as c,t as l}from"./button-Djr1cczI.js";function u({onLogout:e}){return(0,d.jsxs)(`div`,{className:`mx-auto mt-16 max-w-sm text-center`,children:[(0,d.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Page not found`}),(0,d.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:`We couldn't find that page. It may have moved, or the link may be out of date.`}),(0,d.jsxs)(`div`,{className:`mt-6 flex items-center justify-center gap-2`,children:[(0,d.jsx)(l,{asChild:!0,children:(0,d.jsx)(a,{to:`/`,children:`Go home`})}),e&&(0,d.jsx)(l,{variant:`ghost`,onClick:e,children:`Log out`})]})]})}var d;function f(){return(f=e((()=>{i(),c(),d=t(),u.__docgenInfo={description:"The router's `defaultNotFoundComponent` (ADR-0027 §3): a real not-found screen for an unknown URL.\nIt renders *instead of* RootLayout, so `/account`'s Log out can't reach it — hence a local escape\nhatch beside \"Go home\". Prop-only; the container reads the session and passes `onLogout`.",methods:[],displayName:`NotFoundView`,props:{onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:'Local escape hatch (ADR-0027 §3): a client-only `clearSession()`. Present only when a session\nexists — or might; omitted once the auth probe has resolved to "no user".'}}}})))()}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{s(),n(),f(),p=t(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`shared/ui/NotFoundView`,component:u,decorators:[o],args:{onLogout:h()}},v={render:e=>(0,p.jsx)(r,{items:{Default:(0,p.jsx)(u,{...e}),LoggedOut:(0,p.jsx)(u,{...e,onLogout:void 0})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await m(t(`Default`).getByText(`Page not found`)).toBeInTheDocument(),await m(t(`Default`).getByRole(`link`,{name:`Go home`})).toHaveAttribute(`href`,`/`),await m(t(`LoggedOut`).getByRole(`link`,{name:`Go home`})).toBeInTheDocument(),await m(t(`LoggedOut`).queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},y={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Log out`})),await m(n.onLogout).toHaveBeenCalled()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Default: <NotFoundView {...args} />,
    // No session: "Go home" stands alone, no escape hatch.
    LoggedOut: <NotFoundView {...args} onLogout={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Default').getByText('Page not found')).toBeInTheDocument();
    await expect(region('Default').getByRole('link', {
      name: 'Go home'
    })).toHaveAttribute('href', '/');
    await expect(region('LoggedOut').getByRole('link', {
      name: 'Go home'
    })).toBeInTheDocument();
    await expect(region('LoggedOut').queryByRole('button', {
      name: 'Log out'
    })).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...y.parameters?.docs?.source}}},b=[`Gallery`,`Interactions`]})))()}x();export{v as Gallery,y as Interactions,b as __namedExportsOrder,_ as default};