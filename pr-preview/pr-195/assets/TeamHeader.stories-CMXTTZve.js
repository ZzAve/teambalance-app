import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-CuwUyLMP.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./createLucideIcon-CwUadTUd.js";var c,l;function u(){return(u=e((()=>{o(),c=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],l=s(`settings`,c)})))()}function d({isAdmin:e,actions:t}){return(0,f.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,f.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Team`}),e&&(0,f.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,f.jsx)(r,{to:`/team/settings`,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,f.jsx)(l,{size:20})})]})]})}var f;function p(){return(p=e((()=>{t(),u(),f=a(),d.__docgenInfo={description:`Presentational header for the /team page: the "Team" title plus, for admins only, an actions
area (invite link + gear into /team/settings). Prop-only (no store/query access) so both
visibility states render from props in Storybook — the container (routes/team/index.tsx) reads
the role and supplies isAdmin and the admin actions.`,methods:[],displayName:`TeamHeader`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},actions:{required:!1,tsType:{name:`ReactNode`},description:`Admin-only actions rendered to the left of the settings gear (e.g. the invite-link dialog).
Passed in by the container so this stays prop-only/network-free — never rendered for non-admins.`}}}})))()}var m,h,g,_,v,y,b;function x(){return(x=e((()=>{i(),p(),m=a(),{expect:h}=__STORYBOOK_MODULE_TEST__,g={title:`widgets/team-header/TeamHeader`,component:d,decorators:[n]},_=(0,m.jsx)(`button`,{type:`button`,children:`Invite Link`}),v={args:{isAdmin:!0,actions:_},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:`Team settings`});await h(t).toBeInTheDocument(),await h(t).toHaveAttribute(`href`,`/team/settings`),await h(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument()}},y={args:{isAdmin:!1,actions:_},play:async({canvas:e})=>{await h(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await h(e.queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await h(e.queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Admin`,`Member`]})))()}x();export{v as Admin,y as Member,b as __namedExportsOrder,g as default};