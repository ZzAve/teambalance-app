import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-DrGLk-KV.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-DUXBP51x.js";import{n as o,t as s}from"./link-XWiCGlfE.js";import{n as c,t as l}from"./router-decorator-CgU9NAdb.js";import{a as u,n as d}from"./team-routes-Cas4jHA4.js";import{r as f,t as p}from"./app-column-decorator-iWAuU-Vc.js";import{n as m,t as h}from"./createLucideIcon-BhiTnTxz.js";import{n as g,t as _}from"./button-meOygqbM.js";import{n as v,r as y}from"./app-shell-decorator-DRu9633Q.js";import{n as b,t as x}from"./MemberRosterView-DprCt78-.js";var S,C;function w(){return(w=e((()=>{m(),S=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],C=h(`settings`,S)})))()}function T({isAdmin:e,inviteAction:t,roster:n}){let r=u();return(0,E.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,E.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,E.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Team`}),e&&(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,E.jsx)(s,{to:r.teamSettings,"aria-label":`Team settings`,className:`flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,E.jsx)(C,{size:20})})]})]}),n]})}var E;function D(){return(D=e((()=>{o(),w(),d(),E=r(),T.__docgenInfo={description:`The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
the gear into /team/settings) over the roster. Read-only for everyone, admins included — member
management lives under settings.`,methods:[],displayName:`TeamPageView`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},inviteAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's invite-link action, rendered in the header beside the settings gear.`},roster:{required:!0,tsType:{name:`ReactNode`},description:`The member roster — the live container in the route, the prop-only View in a story.`}}}})))()}var O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{g(),i(),f(),l(),b(),y(),n(),D(),O=r(),{expect:k,within:A}=__STORYBOOK_MODULE_TEST__,j=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],M=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:j[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:j[2],onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:j[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],N=()=>{},P=(e={})=>(0,O.jsx)(x,{canManage:!1,members:M,positions:j,onRename:N,onToggleRole:N,onChangePosition:N,onRemove:N,...e}),F=v(`team`),I={title:`pages/team/TeamPageView`,component:T,parameters:F.parameters,args:{isAdmin:!0,inviteAction:(0,O.jsx)(_,{variant:`outline`,children:`Invite Link`}),roster:P()}},L={decorators:F.decorators,parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await k(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await k(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await k(e.getByRole(`link`,{name:`Team settings`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`);for(let t of[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`])await k(e.getByText(t)).toBeInTheDocument();await k(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await k(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`)}},R={decorators:[...p.decorators,c],render:e=>(0,O.jsx)(a,{items:{Member:(0,O.jsx)(T,{...e,isAdmin:!1,inviteAction:void 0}),Loading:(0,O.jsx)(T,{...e,roster:P({members:void 0,isLoading:!0})}),Error:(0,O.jsx)(T,{...e,roster:P({members:void 0,isError:!0})})}}),play:async({canvas:e})=>{let t=t=>A(e.getByRole(`region`,{name:t}));await k(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument(),await k(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await k(t(`Member`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await k(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await k(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument()}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  decorators: [...appColumn.decorators, withRouter],
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
}`,...R.parameters?.docs?.source}}},z=[`Data`,`Shells`]})))()}B();export{L as Data,R as Shells,z as __namedExportsOrder,I as default};