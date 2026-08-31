import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-yIwnkEr-.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{i as o,t as s}from"./team-routes-BiDaCUgh.js";import{n as c,t as l}from"./createLucideIcon-DkjCIzFW.js";import{n as u,t as d}from"./button-BW-FMbLq.js";var f,p;function m(){return(m=e((()=>{c(),f=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],p=l(`settings`,f)})))()}function h({isAdmin:e,actions:t}){let n=o();return(0,g.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,g.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Team`}),e&&(0,g.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,g.jsx)(r,{to:n.teamSettings,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,g.jsx)(p,{size:20})})]})]})}var g;function _(){return(_=e((()=>{t(),m(),s(),g=a(),h.__docgenInfo={description:`Presentational header for the /team page: the "Team" title plus, for admins only, an actions
area (invite link + gear into /team/settings). Prop-only (no store/query access) so both
visibility states render from props in Storybook — the container (routes/team/index.tsx) reads
the role and supplies isAdmin and the admin actions.`,methods:[],displayName:`TeamHeader`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},actions:{required:!1,tsType:{name:`ReactNode`},description:`Admin-only actions rendered to the left of the settings gear (e.g. the invite-link dialog).
Passed in by the container so this stays prop-only/network-free — never rendered for non-admins.`}}}})))()}var v,y,b,x,S,C,w;function T(){return(T=e((()=>{i(),u(),_(),v=a(),{expect:y}=__STORYBOOK_MODULE_TEST__,b={title:`widgets/team-header/TeamHeader`,component:h,decorators:[n],parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}}},x=(0,v.jsx)(d,{variant:`outline`,children:`Invite Link`}),S={args:{isAdmin:!0,actions:x},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:`Team settings`});await y(t).toBeInTheDocument(),await y(t).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`),await y(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument()}},C={args:{isAdmin:!1,actions:x},play:async({canvas:e})=>{await y(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await y(e.queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await y(e.queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument()}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: true,
    actions: inviteAction
  },
  play: async ({
    canvas
  }) => {
    const gear = canvas.getByRole('link', {
      name: 'Team settings'
    });
    await expect(gear).toBeInTheDocument();
    await expect(gear).toHaveAttribute('href', '/t/setpoint-vt/team/settings');
    // The admin actions slot (invite link) renders alongside the gear.
    await expect(canvas.getByRole('button', {
      name: 'Invite Link'
    })).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: false,
    actions: inviteAction
  },
  play: async ({
    canvas
  }) => {
    // Title still renders; the gear and the admin actions are the only admin-gated elements and
    // must both be absent — a non-admin never sees the invite link even when one is passed.
    await expect(canvas.getByRole('heading', {
      name: 'Team'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', {
      name: 'Team settings'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Invite Link'
    })).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Admin`,`Member`]})))()}T();export{S as Admin,C as Member,w as __namedExportsOrder,b as default};