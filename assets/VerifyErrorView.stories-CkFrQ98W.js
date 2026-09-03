import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,n as r,r as i,t as a}from"./router-decorator-EgKV_jGV.js";import{n as o,t as s}from"./button-DzWNEKYK.js";function c({message:e,onLogout:t}){return(0,l.jsxs)(`div`,{className:`mx-auto mt-16 max-w-sm text-center`,children:[(0,l.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Link expired`}),(0,l.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:e}),(0,l.jsxs)(`div`,{className:`mt-6 flex items-center justify-center gap-4`,children:[(0,l.jsx)(i,{to:`/login`,className:`text-sm font-medium text-blue`,children:`Back to login`}),t&&(0,l.jsx)(s,{variant:`ghost`,onClick:t,children:`Log out`})]})]})}var l;function u(){return(u=e((()=>{n(),o(),l=t(),c.__docgenInfo={description:'The `/auth/verify` error state, rendered *instead of* RootLayout (ADR-0027 §3). "Back to login" is\nalways offered; the escape hatch is added when a session exists — most importantly the\n"authenticated but stranded, no team" invite-accept-failure edge, where a client-only logout is the\nonly way out. Prop-only; the container reads the session and passes `onLogout`.',methods:[],displayName:`VerifyErrorView`,props:{message:{required:!0,tsType:{name:`string`},description:`The failure copy — a missing/expired magic link, or the invite-accept-failure message.`},onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Local escape hatch (ADR-0027 §3): a client-only \`clearSession()\`. Present when a session exists —
or might (e.g. the "authenticated but stranded" invite-accept-failure); omitted once the auth
probe has resolved to "no user".`}}}})))()}var d,f,p,m,h,g;function _(){return(_=e((()=>{a(),u(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`shared/ui/VerifyErrorView`,component:c,decorators:[r],args:{onLogout:f()}},m={args:{message:`Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.`},play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByRole(`link`,{name:`Back to login`})).toHaveAttribute(`href`,`/login`),await t.click(e.getByRole(`button`,{name:`Log out`})),await d(n.onLogout).toHaveBeenCalled()}},h={args:{message:`This link has expired or already been used. Request a new one.`,onLogout:void 0},play:async({canvas:e})=>{await d(e.getByRole(`link`,{name:`Back to login`})).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Back to login'
    })).toHaveAttribute('href', '/login');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    message: 'This link has expired or already been used. Request a new one.',
    onLogout: undefined
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Back to login'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Log out'
    })).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Stranded`,`LoggedOut`]})))()}_();export{h as LoggedOut,m as Stranded,g as __namedExportsOrder,p as default};