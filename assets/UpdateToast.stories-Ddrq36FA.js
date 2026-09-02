import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-DJOl91aY.js";function i({show:e,onReload:t}){return e?(0,a.jsxs)(`div`,{role:`alert`,className:`fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-lg`,children:[(0,a.jsx)(`span`,{className:`text-sm`,children:`A new version is available.`}),(0,a.jsx)(r,{size:`sm`,onClick:t,children:`Reload`})]}):null}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`The update-available prompt (caching plan Phase 3), shown only in the one case SwUpdateManager
won't auto-apply: a new version landed while the user is mid-session with unsaved / in-flight
state. Presentational — hidden vs shown and the reload callback come in as props, so it stories
with no service worker. Sits above the bottom nav, clear of the home-indicator inset.`,methods:[],displayName:`UpdateToast`,props:{show:{required:!0,tsType:{name:`boolean`},description:`Whether the update-available toast is shown. Hidden renders nothing.`},onReload:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var s,c,l,u,d,f,p;function m(){return(m=e((()=>{o(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`shared/ui/UpdateToast`,component:i,args:{show:!0,onReload:c()}},d={args:{show:!1},play:async({canvasElement:e})=>{await s(l(e).queryByRole(`alert`)).not.toBeInTheDocument()}},f={play:async({canvas:e,userEvent:t,args:n})=>{await s(e.getByText(/new version is available/i)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/reload/i})),await s(n.onReload).toHaveBeenCalled()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    show: false
  },
  play: async ({
    canvasElement
  }) => {
    // Nothing to nudge yet — the toast renders nothing rather than an empty bar.
    await expect(within(canvasElement).queryByRole('alert')).not.toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  // Prop-contract spy: proves Reload actually reaches onReload, not merely that the bar renders.
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText(/new version is available/i)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /reload/i
    }));
    await expect(args.onReload).toHaveBeenCalled();
  }
}`,...f.parameters?.docs?.source}}},p=[`Hidden`,`Shown`]})))()}m();export{d as Hidden,f as Shown,p as __namedExportsOrder,u as default};