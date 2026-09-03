import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,n as r,r as i,t as a}from"./router-decorator-Dxwte4QJ.js";import{n as o,t as s}from"./button-pM1YIdFp.js";function c({onLogout:e}){return(0,l.jsxs)(`div`,{className:`mx-auto mt-16 max-w-sm text-center`,children:[(0,l.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Page not found`}),(0,l.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:`We couldn't find that page. It may have moved, or the link may be out of date.`}),(0,l.jsxs)(`div`,{className:`mt-6 flex items-center justify-center gap-2`,children:[(0,l.jsx)(s,{asChild:!0,children:(0,l.jsx)(i,{to:`/`,children:`Go home`})}),e&&(0,l.jsx)(s,{variant:`ghost`,onClick:e,children:`Log out`})]})]})}var l;function u(){return(u=e((()=>{n(),o(),l=t(),c.__docgenInfo={description:"The router's `defaultNotFoundComponent` (ADR-0027 §3): a real not-found screen for an unknown URL.\nIt renders *instead of* RootLayout, so `/account`'s Log out can't reach it — hence a local escape\nhatch beside \"Go home\". Prop-only; the container reads the session and passes `onLogout`.",methods:[],displayName:`NotFoundView`,props:{onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:'Local escape hatch (ADR-0027 §3): a client-only `clearSession()`. Present only when a session\nexists — or might; omitted once the auth probe has resolved to "no user".'}}}})))()}var d,f,p,m,h,g;function _(){return(_=e((()=>{a(),u(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`shared/ui/NotFoundView`,component:c,decorators:[r],args:{onLogout:f()}},m={play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByText(`Page not found`)).toBeInTheDocument(),await d(e.getByRole(`link`,{name:`Go home`})).toHaveAttribute(`href`,`/`),await t.click(e.getByRole(`button`,{name:`Log out`})),await d(n.onLogout).toHaveBeenCalled()}},h={args:{onLogout:void 0},play:async({canvas:e})=>{await d(e.getByRole(`link`,{name:`Go home`})).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('Page not found')).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Go home'
    })).toHaveAttribute('href', '/');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    onLogout: undefined
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Go home'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Log out'
    })).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Default`,`LoggedOut`]})))()}_();export{m as Default,h as LoggedOut,g as __namedExportsOrder,p as default};