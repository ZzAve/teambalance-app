import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./button-jmcBUdua.js";function o({show:e,onReload:t}){return e?(0,s.jsxs)(`div`,{role:`alert`,className:`fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-lg`,children:[(0,s.jsx)(`span`,{className:`text-small`,children:`A new version is available.`}),(0,s.jsx)(a,{size:`sm`,onClick:t,children:`Reload`})]}):null}var s;function c(){return(c=e((()=>{i(),s=t(),o.__docgenInfo={description:`The update-available prompt (caching plan Phase 3), shown only in the one case SwUpdateManager
won't auto-apply: a new version landed while the user is mid-session with unsaved / in-flight
state. Presentational — hidden vs shown and the reload callback come in as props, so it stories
with no service worker. Sits above the bottom nav, clear of the home-indicator inset.`,methods:[],displayName:`UpdateToast`,props:{show:{required:!0,tsType:{name:`boolean`},description:`Whether the update-available toast is shown. Hidden renders nothing.`},onReload:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),c(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p={title:`shared/ui/UpdateToast`,component:o,args:{show:!0,onReload:d()}},m={render:()=>(0,l.jsx)(r,{items:{Hidden:(0,l.jsx)(o,{show:!1,onReload:d()}),Shown:(0,l.jsx)(o,{show:!0,onReload:d()})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Hidden`).queryByRole(`alert`)).not.toBeInTheDocument(),await u(t(`Shown`).getByText(/new version is available/i)).toBeInTheDocument()}},h={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/reload/i})),await u(n.onReload).toHaveBeenCalled()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Stack items={{
    Hidden: <UpdateToast show={false} onReload={fn()} />,
    Shown: <UpdateToast show onReload={fn()} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Nothing to nudge yet — the toast renders nothing rather than an empty bar.
    await expect(region('Hidden').queryByRole('alert')).not.toBeInTheDocument();
    await expect(region('Shown').getByText(/new version is available/i)).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  // Prop-contract spy: proves Reload actually reaches onReload, not merely that the bar renders.
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
      name: /reload/i
    }));
    await expect(args.onReload).toHaveBeenCalled();
  }
}`,...h.parameters?.docs?.source}}},g=[`Gallery`,`Interactions`]})))()}_();export{m as Gallery,h as Interactions,g as __namedExportsOrder,p as default};