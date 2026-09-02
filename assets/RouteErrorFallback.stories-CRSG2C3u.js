import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./QueryErrorState-zgAYFkqD.js";function i({onRetry:e}){return(0,a.jsx)(r,{title:`Couldn't load this page`,description:`Something went wrong loading the app. Please try again.`,onRetry:e})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`The router's last-resort error fallback (caching plan Phase 1), rendered by the router's
\`defaultErrorComponent\` when a route still throws after the one-shot chunk-reload guard has run —
e.g. the fresh shell also failed to load a chunk. Reuses the shared QueryErrorState shell so a
load failure is never a blank frame; Retry reloads to re-fetch the shell.`,methods:[],displayName:`RouteErrorFallback`,props:{onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Recover — typically a full reload to re-fetch the shell and its current chunk hashes.`}}}})))()}var s,c,l,u,d;function f(){return(f=e((()=>{o(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`shared/ui/RouteErrorFallback`,component:i,args:{onRetry:c()}},u={play:async({canvas:e,userEvent:t,args:n})=>{await s(e.getByText(`Couldn't load this page`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/retry/i})),await s(n.onRetry).toHaveBeenCalled()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  // Prop-contract spy: proves Retry actually reaches onRetry, not merely that the shell renders.
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
  }
}`,...u.parameters?.docs?.source}}},d=[`Default`]})))()}f();export{u as Default,d as __namedExportsOrder,l as default};