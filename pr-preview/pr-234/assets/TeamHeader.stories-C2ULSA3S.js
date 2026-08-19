import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-kaJo8txd.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./createLucideIcon-DoWGTTJQ.js";import{n as c,t as l}from"./button-D-h9eELt.js";var u,d;function f(){return(f=e((()=>{o(),u=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],d=s(`settings`,u)})))()}function p({isAdmin:e,actions:t}){return(0,m.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,m.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Team`}),e&&(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,m.jsx)(r,{to:`/team/settings`,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,m.jsx)(d,{size:20})})]})]})}var m;function h(){return(h=e((()=>{t(),f(),m=a(),p.__docgenInfo={description:`Presentational header for the /team page: the "Team" title plus, for admins only, an actions
area (invite link + gear into /team/settings). Prop-only (no store/query access) so both
visibility states render from props in Storybook — the container (routes/team/index.tsx) reads
the role and supplies isAdmin and the admin actions.`,methods:[],displayName:`TeamHeader`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},actions:{required:!1,tsType:{name:`ReactNode`},description:`Admin-only actions rendered to the left of the settings gear (e.g. the invite-link dialog).
Passed in by the container so this stays prop-only/network-free — never rendered for non-admins.`}}}})))()}var g,_,v,y,b,x,S;function C(){return(C=e((()=>{i(),c(),h(),g=a(),{expect:_}=__STORYBOOK_MODULE_TEST__,v={title:`widgets/team-header/TeamHeader`,component:p,decorators:[n]},y=(0,g.jsx)(l,{variant:`outline`,children:`Invite Link`}),b={args:{isAdmin:!0,actions:y},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:`Team settings`});await _(t).toBeInTheDocument(),await _(t).toHaveAttribute(`href`,`/team/settings`),await _(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument()}},x={args:{isAdmin:!1,actions:y},play:async({canvas:e})=>{await _(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await _(e.queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await _(e.queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
    await expect(gear).toHaveAttribute('href', '/team/settings');
    // The admin actions slot (invite link) renders alongside the gear.
    await expect(canvas.getByRole('button', {
      name: 'Invite Link'
    })).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S=[`Admin`,`Member`]})))()}C();export{b as Admin,x as Member,S as __namedExportsOrder,v as default};