import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{n as i,t as a}from"./button-CmXzxiAJ.js";import{n as o,t as s}from"./QueryErrorState-BU5n1ImL.js";function c({onRetry:e,onLogout:t}){return(0,l.jsx)(s,{title:`Couldn't load this page`,description:`Something went wrong loading the app. Please try again.`,onRetry:e,children:t&&(0,l.jsx)(a,{variant:`ghost`,onClick:t,children:`Log out`})})}var l;function u(){return(u=e((()=>{i(),o(),l=t(),c.__docgenInfo={description:`The router's last-resort error fallback (caching plan Phase 1), rendered by the router's
\`defaultErrorComponent\` when a route still throws after the one-shot chunk-reload guard has run —
e.g. the fresh shell also failed to load a chunk. Reuses the shared QueryErrorState shell so a
load failure is never a blank frame; Retry reloads to re-fetch the shell. Because this renders
*instead of* RootLayout, \`/account\`'s Log out can't reach it — so it carries its own (ADR-0027 §3).`,methods:[],displayName:`RouteErrorFallback`,props:{onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Recover — typically a full reload to re-fetch the shell and its current chunk hashes.`},onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Local escape hatch (ADR-0027 §3): a client-only \`clearSession()\`. Present only when a session
exists — or might; omitted once the auth probe has resolved to "no user", when there is nothing
to log out of. Rendered beside Retry.`}}}})))()}var d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),u(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h={title:`shared/ui/RouteErrorFallback`,component:c,args:{onRetry:p(),onLogout:p()}},g={render:e=>(0,d.jsx)(r,{items:{Default:(0,d.jsx)(c,{...e}),LoggedOut:(0,d.jsx)(c,{...e,onLogout:void 0})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Default`).getByText(`Couldn't load this page`)).toBeInTheDocument(),await f(t(`LoggedOut`).getByRole(`button`,{name:/retry/i})).toBeInTheDocument(),await f(t(`LoggedOut`).queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},_={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/retry/i})),await f(n.onRetry).toHaveBeenCalled(),await t.click(e.getByRole(`button`,{name:`Log out`})),await f(n.onLogout).toHaveBeenCalled()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Default: <RouteErrorFallback {...args} />,
    // No session (the auth probe resolved to no user): Retry stands alone, no escape hatch.
    LoggedOut: <RouteErrorFallback {...args} onLogout={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Default').getByText("Couldn't load this page")).toBeInTheDocument();
    await expect(region('LoggedOut').getByRole('button', {
      name: /retry/i
    })).toBeInTheDocument();
    await expect(region('LoggedOut').queryByRole('button', {
      name: 'Log out'
    })).not.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  // Prop-contract spies: prove Retry and Log out actually reach their callbacks, not merely render.
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
      name: /retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,..._.parameters?.docs?.source}}},v=[`Gallery`,`Interactions`]})))()}y();export{g as Gallery,_ as Interactions,v as __namedExportsOrder,h as default};