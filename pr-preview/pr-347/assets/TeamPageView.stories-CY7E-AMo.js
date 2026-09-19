import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-CN0e_lCC.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as s}from"./TeamHeader-B49OK1Pn.js";import{n as c,t as l}from"./button-Ce3gpAJ8.js";import{n as u,r as d}from"./app-shell-decorator-wFaJ9_r1.js";import{n as f,t as p}from"./MemberRosterView-CNEeAN_k.js";function m({isAdmin:e,inviteAction:t,roster:n}){return(0,h.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,h.jsx)(s,{isAdmin:e,actions:t}),n]})}var h;function g(){return(g=e((()=>{o(),h=r(),m.__docgenInfo={description:`The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
the gear into /team/settings) over the roster. Read-only for everyone, admins included — member
management lives under settings.`,methods:[],displayName:`TeamPageView`,props:{isAdmin:{required:!0,tsType:{name:`boolean`},description:``},inviteAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's invite-link action, rendered in the header beside the settings gear.`},roster:{required:!0,tsType:{name:`ReactNode`},description:`The member roster — the live container in the route, the prop-only View in a story.`}}}})))()}var _,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{c(),i(),f(),d(),n(),g(),_=r(),{expect:v,within:y}=__STORYBOOK_MODULE_TEST__,b=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],x=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:b[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:b[2],onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:b[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],S=()=>{},C=(e={})=>(0,_.jsx)(p,{canManage:!1,members:x,positions:b,onRename:S,onToggleRole:S,onChangePosition:S,onRemove:S,...e}),w=u(`team`),T={title:`pages/team/TeamPageView`,component:m,decorators:w.decorators,parameters:w.parameters,args:{isAdmin:!0,inviteAction:(0,_.jsx)(l,{variant:`outline`,children:`Invite Link`}),roster:C()}},E={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await v(e.getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await v(e.getByRole(`link`,{name:`Team settings`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`);for(let t of[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`])await v(e.getByText(t)).toBeInTheDocument();await v(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await v(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`)}},D={render:e=>(0,_.jsx)(a,{items:{Member:(0,_.jsx)(m,{...e,isAdmin:!1,inviteAction:void 0}),Loading:(0,_.jsx)(m,{...e,roster:C({members:void 0,isLoading:!0})}),Error:(0,_.jsx)(m,{...e,roster:C({members:void 0,isError:!0})})}}),play:async({canvas:e})=>{let t=t=>y(e.getByRole(`region`,{name:t}));await v(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument(),await v(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await v(t(`Member`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await v(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await v(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O=[`Data`,`Shells`]})))()}k();export{E as Data,D as Shells,O as __namedExportsOrder,T as default};