import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-D-WZm2as.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-DUXBP51x.js";import{n as o,t as s}from"./link-BeUIVTlP.js";import{n as c,t as l}from"./router-decorator-Dh-Me_2c.js";import{a as u,n as d}from"./team-routes-Bij-nPWX.js";import{r as f,t as p}from"./app-column-decorator-Cd2vRJI0.js";import{n as m,t as h}from"./createLucideIcon-BfLWGXMF.js";import{n as g,t as _}from"./button-D41Fc0KU.js";import{n as v,r as y}from"./app-shell-decorator-BoLgc7Z3.js";import{n as b,t as x}from"./MemberRosterView-nd4d9ZA3.js";import{n as S,t as C}from"./ManageSubstitutesView-B8e2WCyQ.js";var w,T;function E(){return(E=e((()=>{m(),w=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],T=h(`settings`,w)})))()}function D({isAdmin:e,inviteAction:t,roster:n,substitutes:r}){let i=u();return(0,O.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,O.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Team`}),e&&(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,O.jsx)(s,{to:i.teamSettings,"aria-label":`Team settings`,className:`flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,O.jsx)(T,{size:20})})]})]}),n,r]})}var O;function k(){return(k=e((()=>{o(),E(),d(),O=r(),D.__docgenInfo={description:`The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
the gear into /team/settings) over the roster, then the Team's Substitutes. Read-only for
everyone, admins included — managing both lives under settings.`,methods:[],displayName:`TeamPageView`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},inviteAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's invite-link action, rendered in the header beside the settings gear.`},roster:{required:!0,tsType:{name:`ReactNode`},description:`The member roster — the live container in the route, the prop-only View in a story.`},substitutes:{required:!0,tsType:{name:`ReactNode`},description:`The Team's Substitutes (ADR-0033), read-only, under the roster: they are not Members.`}}}})))()}var A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{g(),i(),f(),l(),b(),S(),y(),n(),k(),A=r(),{expect:j,within:M}=__STORYBOOK_MODULE_TEST__,N=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],P=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:N[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:N[2],onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:N[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],F=()=>{},I=(e={})=>(0,A.jsx)(x,{canManage:!1,members:P,positions:N,onRename:F,onToggleRole:F,onChangePosition:F,onRemove:F,...e}),L=(0,A.jsx)(C,{canManage:!1,substitutes:[{id:`s1`,name:`Jan de Vries`,position:{id:`p2`,label:`Libero`}},{id:`s2`,name:`Sam Bakker`,position:void 0}],positions:N,onRename:F,onChangePosition:F,onRemove:F}),R=v(`team`),z={title:`pages/team/TeamPageView`,component:D,parameters:R.parameters,args:{isAdmin:!0,inviteAction:(0,A.jsx)(_,{variant:`outline`,children:`Invite Link`}),roster:I(),substitutes:L}},B={decorators:R.decorators,parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await j(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await j(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await j(e.getByRole(`link`,{name:`Team settings`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`);for(let t of[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`])await j(e.getByText(t)).toBeInTheDocument();await j(e.getByRole(`heading`,{name:`Substitutes`})).toBeInTheDocument(),await j(e.getByText(`Jan de Vries`)).toBeInTheDocument(),await j(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await j(e.queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await j(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`)}},V={decorators:[...p.decorators,c],render:e=>(0,A.jsx)(a,{items:{Member:(0,A.jsx)(D,{...e,isAdmin:!1,inviteAction:void 0}),Loading:(0,A.jsx)(D,{...e,roster:I({members:void 0,isLoading:!0})}),Error:(0,A.jsx)(D,{...e,roster:I({members:void 0,isError:!0})})}}),play:async({canvas:e})=>{let t=t=>M(e.getByRole(`region`,{name:t}));await j(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument(),await j(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await j(t(`Member`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await j(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await j(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument()}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
    // The Team's Substitutes sit under the roster: people the Team calls in, not Members (ADR-0033).
    await expect(canvas.getByRole('heading', {
      name: 'Substitutes'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Jan de Vries')).toBeInTheDocument();
    // Read-only for everyone, admins included: management lives under settings.
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
    // The shell around it: the Team tab is the current one.
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H=[`Data`,`Shells`]})))()}U();export{B as Data,V as Shells,H as __namedExportsOrder,z as default};