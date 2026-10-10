import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./createLucideIcon-W5OBSDQq.js";import{n as o,t as s}from"./check-DAlC-mVq.js";import{n as c,t as l}from"./circle-plus-D7sSJw0-.js";import{n as u,t as d}from"./users-AaJ435Dd.js";import{n as f,t as p}from"./SectionLabel-_vzOhMMA.js";var m,h;function g(){return(g=e((()=>{i(),m=[[`path`,{d:`M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,key:`qn84l0`}],[`path`,{d:`M13 5v2`,key:`dyzc3o`}],[`path`,{d:`M13 17v2`,key:`1ont0d`}],[`path`,{d:`M13 11v2`,key:`1wjjxi`}]],h=a(`ticket`,m)})))()}function _({icon:e,onClick:t,isCurrent:n,children:r}){return(0,y.jsxs)(`button`,{type:`button`,onClick:t,"aria-current":n?`true`:void 0,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,y.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:e}),r]})}function v({teams:e,activeTeam:t,onSelect:n,onJoin:r,onCreate:i}){return(0,y.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,y.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Teams`}),(0,y.jsxs)(`section`,{className:`mt-6`,children:[(0,y.jsx)(p,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Your teams`}),(0,y.jsx)(`ul`,{className:`flex flex-col gap-2`,children:e.map(e=>{let r=e.id===t?.id;return(0,y.jsx)(`li`,{children:(0,y.jsxs)(_,{icon:(0,y.jsx)(d,{size:18}),onClick:()=>n(e.slug),isCurrent:r,children:[(0,y.jsxs)(`span`,{className:`min-w-0`,children:[(0,y.jsx)(`span`,{className:`block truncate text-small font-semibold`,children:e.name}),(0,y.jsxs)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:[`/`,e.slug]})]}),r&&(0,y.jsxs)(`span`,{className:`ml-auto flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:[(0,y.jsx)(s,{size:13}),`Active`]})]})},e.id)})})]}),(0,y.jsxs)(`section`,{className:`mt-8 border-t border-border pt-6`,children:[(0,y.jsx)(p,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Join or create`}),(0,y.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,y.jsx)(_,{icon:(0,y.jsx)(h,{size:18}),onClick:r,children:(0,y.jsxs)(`span`,{className:`min-w-0`,children:[(0,y.jsx)(`span`,{className:`block text-small font-semibold`,children:`Join with an invite link`}),(0,y.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`Someone shared a join link with you`})]})}),(0,y.jsx)(_,{icon:(0,y.jsx)(l,{size:18}),onClick:i,children:(0,y.jsxs)(`span`,{className:`min-w-0`,children:[(0,y.jsx)(`span`,{className:`block text-small font-semibold`,children:`Create a team`}),(0,y.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`You'll need a creation code`})]})})]})]})]})}var y;function b(){return(b=e((()=>{o(),c(),g(),u(),f(),y=t(),v.__docgenInfo={description:`The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
Beside switching between your teams it offers the two ways to gain another — join with an invite
link, or create a team — mirroring the teamless \`/onboarding\` hub for a member who already has one.

Prop-only and presentational; the route container owns the navigation each callback performs.`,methods:[],displayName:`TeamsView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`Every Team the caller is a Member of. May be a single team.`},activeTeam:{required:!0,tsType:{name:`union`,raw:`TeamRef | null`,elements:[{name:`TeamRef`},{name:`null`}]},description:`The Team currently active, or null when none is — marks the Active row.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:"Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch (ADR-0023)."},onJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the invite-link join flow.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the create-team flow.`}}}})))()}var x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{n(),b(),x=t(),{expect:S,fn:C,userEvent:w,within:T}=__STORYBOOK_MODULE_TEST__,E={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},D={id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`},O={title:`features/switch-team/TeamsView`,component:v,args:{teams:[E],activeTeam:E,onSelect:C(),onJoin:C(),onCreate:C()}},k={play:async({canvas:e})=>{await S(e.getByRole(`heading`,{name:`Teams`})).toBeInTheDocument(),await S(e.getByRole(`heading`,{name:`Your teams`})).toBeInTheDocument(),await S(e.getByRole(`heading`,{name:`Join or create`})).toBeInTheDocument(),await S(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await S(e.getByText(`Active`)).toBeInTheDocument(),await S(e.getByText(`Join with an invite link`)).toBeInTheDocument(),await S(e.getByText(`Create a team`)).toBeInTheDocument()}},A={render:e=>(0,x.jsx)(r,{items:{"Multiple teams":(0,x.jsx)(v,{...e,teams:[E,D],activeTeam:E})}}),play:async({canvas:e})=>{let t=T(e.getByRole(`region`,{name:`Multiple teams`}));await S(t.getAllByText(`Active`)).toHaveLength(1),await S(t.getByText(`Tovo Heren 5`)).toBeInTheDocument()}},j={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,x.jsx)(r,{items:{Single:(0,x.jsx)(v,{...e}),Multiple:(0,x.jsx)(v,{...e,teams:[E,D],activeTeam:E})}}),play:async({canvas:e,args:t})=>{let n=t=>T(e.getByRole(`region`,{name:t}));await w.click(n(`Single`).getByText(`Join with an invite link`)),await S(t.onJoin).toHaveBeenCalled(),await w.click(n(`Single`).getByText(`Create a team`)),await S(t.onCreate).toHaveBeenCalled(),await w.click(n(`Multiple`).getByText(`Tovo Heren 5`)),await S(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Teams'
    })).toBeInTheDocument();
    // The two section headings that give the page its visual structure.
    await expect(canvas.getByRole('heading', {
      name: 'Your teams'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', {
      name: 'Join or create'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument();
    await expect(canvas.getByText('Active')).toBeInTheDocument();
    await expect(canvas.getByText('Join with an invite link')).toBeInTheDocument();
    await expect(canvas.getByText('Create a team')).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Only the active team carries the badge.
    'Multiple teams': <TeamsView {...args} teams={[SETPOINT, TOVO]} activeTeam={SETPOINT} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = within(canvas.getByRole('region', {
      name: 'Multiple teams'
    }));
    await expect(region.getAllByText('Active')).toHaveLength(1);
    await expect(region.getByText('Tovo Heren 5')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Single: <TeamsView {...args} />,
    Multiple: <TeamsView {...args} teams={[SETPOINT, TOVO]} activeTeam={SETPOINT} />
  }} />,
  play: async ({
    canvas,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Single').getByText('Join with an invite link'));
    await expect(args.onJoin).toHaveBeenCalled();
    await userEvent.click(region('Single').getByText('Create a team'));
    await expect(args.onCreate).toHaveBeenCalled();

    // Selecting a team hands the container its slug; opening \`/t/:slug\` is what performs the switch.
    await userEvent.click(region('Multiple').getByText('Tovo Heren 5'));
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5');
  }
}`,...j.parameters?.docs?.source}}},M=[`Data`,`Shells`,`Interactions`]})))()}N();export{k as Data,j as Interactions,A as Shells,M as __namedExportsOrder,O as default};