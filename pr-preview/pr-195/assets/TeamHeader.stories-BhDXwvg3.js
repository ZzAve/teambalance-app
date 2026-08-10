import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator--2ZsHZ3f.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./createLucideIcon-OgrTc9lW.js";var c,l;function u(){return(u=e((()=>{o(),c=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],l=s(`settings`,c)})))()}function d({isAdmin:e}){return(0,f.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,f.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Team`}),e&&(0,f.jsx)(r,{to:`/team/settings`,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,f.jsx)(l,{size:20})})]})}var f;function p(){return(p=e((()=>{t(),u(),f=a(),d.__docgenInfo={description:`Presentational header for the /team page: the "Team" title plus, for admins only, a gear that
links to /team/settings. Prop-only (no store/query access) so both visibility states render from
props in Storybook — the container (routes/team/index.tsx) reads the role and passes isAdmin.`,methods:[],displayName:`TeamHeader`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`}}}})))()}var m,h,g,_,v;function y(){return(y=e((()=>{i(),p(),{expect:m}=__STORYBOOK_MODULE_TEST__,h={title:`widgets/team-header/TeamHeader`,component:d,decorators:[n]},g={args:{isAdmin:!0},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:`Team settings`});await m(t).toBeInTheDocument(),await m(t).toHaveAttribute(`href`,`/team/settings`)}},_={args:{isAdmin:!1},play:async({canvas:e})=>{await m(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await m(e.queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: true
  },
  play: async ({
    canvas
  }) => {
    const gear = canvas.getByRole('link', {
      name: 'Team settings'
    });
    await expect(gear).toBeInTheDocument();
    await expect(gear).toHaveAttribute('href', '/team/settings');
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: false
  },
  play: async ({
    canvas
  }) => {
    // Title still renders; the settings gear is the only admin-gated element and must be absent.
    await expect(canvas.getByRole('heading', {
      name: 'Team'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', {
      name: 'Team settings'
    })).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v=[`Admin`,`Member`]})))()}y();export{g as Admin,_ as Member,v as __namedExportsOrder,h as default};