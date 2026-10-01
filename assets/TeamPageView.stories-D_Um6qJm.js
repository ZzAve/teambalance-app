import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-DIDCTdCP.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as s}from"./link-DIiQ7ICe.js";import{a as c,n as l}from"./team-routes-BVmVvGUB.js";import{n as u,t as d}from"./createLucideIcon-r_445AzY.js";import{n as f,t as p}from"./button-Br_P9k9u.js";import{n as m,r as h}from"./app-shell-decorator-DP8D-cj2.js";import{n as g,t as _}from"./MemberRosterView-Be8TfwZH.js";var v,y;function b(){return(b=e((()=>{u(),v=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],y=d(`settings`,v)})))()}function x({isAdmin:e,inviteAction:t,roster:n}){let r=c();return(0,S.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,S.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,S.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Team`}),e&&(0,S.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,S.jsx)(s,{to:r.teamSettings,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,S.jsx)(y,{size:20})})]})]}),n]})}var S;function C(){return(C=e((()=>{o(),b(),l(),S=r(),x.__docgenInfo={description:`The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
the gear into /team/settings) over the roster. Read-only for everyone, admins included — member
management lives under settings.`,methods:[],displayName:`TeamPageView`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},inviteAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's invite-link action, rendered in the header beside the settings gear.`},roster:{required:!0,tsType:{name:`ReactNode`},description:`The member roster — the live container in the route, the prop-only View in a story.`}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{f(),i(),g(),h(),n(),C(),w=r(),{expect:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],O=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:D[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:D[2],onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:D[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],k=()=>{},A=(e={})=>(0,w.jsx)(_,{canManage:!1,members:O,positions:D,onRename:k,onToggleRole:k,onChangePosition:k,onRemove:k,...e}),j=m(`team`),M={title:`pages/team/TeamPageView`,component:x,decorators:j.decorators,parameters:j.parameters,args:{isAdmin:!0,inviteAction:(0,w.jsx)(p,{variant:`outline`,children:`Invite Link`}),roster:A()}},N={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await T(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await T(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await T(e.getByRole(`link`,{name:`Team settings`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`);for(let t of[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`])await T(e.getByText(t)).toBeInTheDocument();await T(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await T(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`)}},P={render:e=>(0,w.jsx)(a,{items:{Member:(0,w.jsx)(x,{...e,isAdmin:!1,inviteAction:void 0}),Loading:(0,w.jsx)(x,{...e,roster:A({members:void 0,isLoading:!0})}),Error:(0,w.jsx)(x,{...e,roster:A({members:void 0,isError:!0})})}}),play:async({canvas:e})=>{let t=t=>E(e.getByRole(`region`,{name:t}));await T(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument(),await T(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await T(t(`Member`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await T(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await T(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument()}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Team'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Invite Link'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Team settings'
    })).toHaveAttribute('href', '/t/setpoint-vt/team/settings');
    for (const name of ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }
    // Read-only for everyone, admins included: management lives under settings.
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    // The shell around it: the Team tab is the current one.
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Member: <TeamPageView {...args} isAdmin={false} inviteAction={undefined} />,
    Loading: <TeamPageView {...args} roster={roster({
      members: undefined,
      isLoading: true
    })} />,
    Error: <TeamPageView {...args} roster={roster({
      members: undefined,
      isError: true
    })} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Member').queryByRole('button', {
      name: 'Invite Link'
    })).not.toBeInTheDocument();
    await expect(region('Member').queryByRole('link', {
      name: 'Team settings'
    })).not.toBeInTheDocument();
    await expect(region('Member').getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument();
  }
}`,...P.parameters?.docs?.source}}},F=[`Data`,`Shells`]})))()}I();export{N as Data,P as Shells,F as __namedExportsOrder,M as default};