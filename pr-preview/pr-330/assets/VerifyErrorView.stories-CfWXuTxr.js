import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./link-EeWZbyzp.js";import{n as o,t as s}from"./router-decorator-CakS7x0S.js";import{n as c,t as l}from"./button-Ce3gpAJ8.js";function u({message:e,onLogout:t}){return(0,d.jsxs)(`div`,{className:`mx-auto mt-16 max-w-sm text-center`,children:[(0,d.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Link expired`}),(0,d.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:e}),(0,d.jsxs)(`div`,{className:`mt-6 flex items-center justify-center gap-4`,children:[(0,d.jsx)(a,{to:`/login`,className:`text-small font-medium text-blue`,children:`Back to login`}),t&&(0,d.jsx)(l,{variant:`ghost`,onClick:t,children:`Log out`})]})]})}var d;function f(){return(f=e((()=>{i(),c(),d=t(),u.__docgenInfo={description:'The `/auth/verify` error state, rendered *instead of* RootLayout (ADR-0027 §3). "Back to login" is\nalways offered; the escape hatch is added when a session exists — most importantly the\n"authenticated but stranded, no team" invite-accept-failure edge, where a client-only logout is the\nonly way out. Prop-only; the container reads the session and passes `onLogout`.',methods:[],displayName:`VerifyErrorView`,props:{message:{required:!0,tsType:{name:`string`},description:`The failure copy — a missing/expired magic link, or the invite-accept-failure message.`},onLogout:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Local escape hatch (ADR-0027 §3): a client-only \`clearSession()\`. Present when a session exists —
or might (e.g. the "authenticated but stranded" invite-accept-failure); omitted once the auth
probe has resolved to "no user".`}}}})))()}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{s(),n(),f(),p=t(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`shared/ui/VerifyErrorView`,component:u,decorators:[o],args:{onLogout:h()}},v={args:{message:``},render:e=>(0,p.jsx)(r,{items:{Stranded:(0,p.jsx)(u,{...e,message:`Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.`}),LoggedOut:(0,p.jsx)(u,{...e,message:`This link has expired or already been used. Request a new one.`,onLogout:void 0})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await m(t(`Stranded`).getByRole(`link`,{name:`Back to login`})).toHaveAttribute(`href`,`/login`),await m(t(`LoggedOut`).getByRole(`link`,{name:`Back to login`})).toBeInTheDocument(),await m(t(`LoggedOut`).queryByRole(`button`,{name:`Log out`})).not.toBeInTheDocument()}},y={parameters:{chromatic:{disableSnapshot:!0}},args:{message:`Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Log out`})),await m(n.onLogout).toHaveBeenCalled()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  // message is required on VerifyErrorView; each Stack instance below sets its own.
  args: {
    message: ''
  },
  render: args => <Stack items={{
    // Authenticated but stranded (invite-accept-failure): both "Back to login" and the escape
    // hatch show.
    Stranded: <VerifyErrorView {...args} message="Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation." />,
    // No session (an expired/used magic link never signed anyone in): "Back to login" only, no
    // hatch.
    LoggedOut: <VerifyErrorView {...args} message="This link has expired or already been used. Request a new one." onLogout={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Stranded').getByRole('link', {
      name: 'Back to login'
    })).toHaveAttribute('href', '/login');
    await expect(region('LoggedOut').getByRole('link', {
      name: 'Back to login'
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
  args: {
    message: 'Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.'
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