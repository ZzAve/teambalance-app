import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-DxgScssa.js";import{n as i,t as a}from"./QueryErrorState-BOmULVzb.js";function o({onRetry:e,onLogout:t}){return(0,s.jsx)(a,{title:`Couldn't load this page`,description:`Something went wrong loading the app. Please try again.`,onRetry:e,children:t&&(0,s.jsx)(r,{variant:`ghost`,onClick:t,children:`Log out`})})}var s;function c(){return(c=e((()=>{n(),i(),s=t(),o.__docgenInfo={description:`The router's last-resort error fallback (caching plan Phase 1), rendered by the router's
\`defaultErrorComponent\` when a route still throws after the one-shot chunk-reload guard has run —
e.g. the fresh shell also failed to load a chunk. Reuses the shared QueryErrorState shell so a
load failure is never a blank frame; Retry reloads to re-fetch the shell. Because this renders
*instead of* RootLayout, \`/account\`'s Log out can't reach it — so it carries its own (ADR-0027 §3).`,methods:[],displayName:`RouteErrorFallback`,props:{onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Recover — typically a full reload to re-fetch the shell and its current chunk hashes.`},onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Local escape hatch (ADR-0027 §3): a client-only \`clearSession()\`. Present only when a session
exists — or might; omitted once the auth probe has resolved to "no user", when there is nothing
to log out of. Rendered beside Retry.`}}}})))()}var l,u,d,f,p,m;function h(){return(h=e((()=>{c(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d={title:`shared/ui/RouteErrorFallback`,component:o,args:{onRetry:u(),onLogout:u()}},f={play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByText(`Couldn't load this page`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/retry/i})),await l(n.onRetry).toHaveBeenCalled(),await t.click(e.getByRole(`button`,{name:`Log out`})),await l(n.onLogout).toHaveBeenCalled()}},p={args:{onLogout:void 0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:/retry/i})).toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  // Prop-contract spies: prove Retry and Log out actually reach their callbacks, not merely render.
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText("Couldn't load this page")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    onLogout: undefined
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /retry/i
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Log out'
    })).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m=[`Default`,`LoggedOut`]})))()}h();export{f as Default,p as LoggedOut,m as __namedExportsOrder,d as default};