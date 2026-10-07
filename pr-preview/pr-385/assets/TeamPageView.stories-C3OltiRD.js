import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-Cny4rIaO.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as s}from"./link-DJfM1nxN.js";import{a as c,n as l}from"./team-routes-DnyGSiIZ.js";import{n as u,t as d}from"./createLucideIcon-Dnojsx6_.js";import{n as f,t as p}from"./button-CIHuMkqC.js";import{n as m,r as h}from"./app-shell-decorator-CcMGX2xp.js";import{n as g,t as _}from"./MemberRosterView-CORiVx07.js";import{n as v,t as y}from"./ManageSubstitutesView-Bkrotn03.js";var b,x;function S(){return(S=e((()=>{u(),b=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]],x=d(`settings`,b)})))()}function C({isAdmin:e,inviteAction:t,roster:n,substitutes:r}){let i=c();return(0,w.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,w.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,w.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Team`}),e&&(0,w.jsxs)(`div`,{className:`flex items-center gap-2`,children:[t,(0,w.jsx)(s,{to:i.teamSettings,"aria-label":`Team settings`,className:`rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground`,children:(0,w.jsx)(x,{size:20})})]})]}),n,r]})}var w;function T(){return(T=e((()=>{o(),S(),l(),w=r(),C.__docgenInfo={description:`The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
the gear into /team/settings) over the roster, then the Team's Substitutes. Read-only for
everyone, admins included — managing both lives under settings.`,methods:[],displayName:`TeamPageView`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:`Only admins get the entry into /team/settings; the page itself is read-only for everyone.`},inviteAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's invite-link action, rendered in the header beside the settings gear.`},roster:{required:!0,tsType:{name:`ReactNode`},description:`The member roster — the live container in the route, the prop-only View in a story.`},substitutes:{required:!0,tsType:{name:`ReactNode`},description:`The Team's Substitutes (ADR-0033), read-only, under the roster: they are not Members.`}}}})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{f(),i(),g(),v(),h(),n(),T(),E=r(),{expect:D,within:O}=__STORYBOOK_MODULE_TEST__,k=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],A=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:k[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:k[2],onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:k[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],j=()=>{},M=(e={})=>(0,E.jsx)(_,{canManage:!1,members:A,positions:k,onRename:j,onToggleRole:j,onChangePosition:j,onRemove:j,...e}),N=(0,E.jsx)(y,{canManage:!1,substitutes:[{id:`s1`,name:`Jan de Vries`,position:{id:`p2`,label:`Libero`}},{id:`s2`,name:`Sam Bakker`,position:void 0}],positions:k,onRename:j,onChangePosition:j,onRemove:j}),P=m(`team`),F={title:`pages/team/TeamPageView`,component:C,decorators:P.decorators,parameters:P.parameters,args:{isAdmin:!0,inviteAction:(0,E.jsx)(p,{variant:`outline`,children:`Invite Link`}),roster:M(),substitutes:N}},I={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await D(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await D(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await D(e.getByRole(`link`,{name:`Team settings`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`);for(let t of[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`])await D(e.getByText(t)).toBeInTheDocument();await D(e.getByRole(`heading`,{name:`Substitutes`})).toBeInTheDocument(),await D(e.getByText(`Jan de Vries`)).toBeInTheDocument(),await D(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await D(e.queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await D(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`)}},L={render:e=>(0,E.jsx)(a,{items:{Member:(0,E.jsx)(C,{...e,isAdmin:!1,inviteAction:void 0}),Loading:(0,E.jsx)(C,{...e,roster:M({members:void 0,isLoading:!0})}),Error:(0,E.jsx)(C,{...e,roster:M({members:void 0,isError:!0})})}}),play:async({canvas:e})=>{let t=t=>O(e.getByRole(`region`,{name:t}));await D(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument(),await D(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await D(t(`Member`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await D(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await D(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument()}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R=[`Data`,`Shells`]})))()}z();export{I as Data,L as Shells,R as __namedExportsOrder,F as default};