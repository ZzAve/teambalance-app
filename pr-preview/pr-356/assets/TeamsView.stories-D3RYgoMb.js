import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./createLucideIcon-DCysqpK6.js";import{n as o,t as s}from"./check-DMpwveZr.js";import{n as c,t as l}from"./circle-plus-DMHVuVrq.js";import{n as u,t as d}from"./users-DpTraak_.js";import{n as f,t as p}from"./SectionLabel-B5oFQ-GJ.js";var m,h;function g(){return(g=e((()=>{i(),m=[[`path`,{d:`M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,key:`qn84l0`}],[`path`,{d:`M13 5v2`,key:`dyzc3o`}],[`path`,{d:`M13 17v2`,key:`1ont0d`}],[`path`,{d:`M13 11v2`,key:`1wjjxi`}]],h=a(`ticket`,m)})))()}function _({teams:e,activeTeam:t,onSelect:n,onJoin:r,onCreate:i}){return(0,v.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,v.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Teams`}),(0,v.jsxs)(`section`,{className:`mt-6`,children:[(0,v.jsx)(p,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Your teams`}),(0,v.jsx)(`ul`,{className:`flex flex-col gap-2`,children:e.map(e=>{let r=e.id===t?.id;return(0,v.jsx)(`li`,{children:(0,v.jsxs)(`button`,{type:`button`,onClick:()=>n(e.slug),"aria-current":r?`true`:void 0,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,v.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,v.jsx)(d,{size:18})}),(0,v.jsxs)(`span`,{className:`min-w-0`,children:[(0,v.jsx)(`span`,{className:`block truncate text-small font-semibold`,children:e.name}),(0,v.jsxs)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:[`/`,e.slug]})]}),r&&(0,v.jsxs)(`span`,{className:`ml-auto flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:[(0,v.jsx)(s,{size:13}),`Active`]})]})},e.id)})})]}),(0,v.jsxs)(`section`,{className:`mt-8 border-t border-border pt-6`,children:[(0,v.jsx)(p,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Join or create`}),(0,v.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,v.jsxs)(`button`,{type:`button`,onClick:r,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,v.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,v.jsx)(h,{size:18})}),(0,v.jsxs)(`span`,{className:`min-w-0`,children:[(0,v.jsx)(`span`,{className:`block text-small font-semibold`,children:`Join with an invite link`}),(0,v.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`Someone shared a join link with you`})]})]}),(0,v.jsxs)(`button`,{type:`button`,onClick:i,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,v.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,v.jsx)(l,{size:18})}),(0,v.jsxs)(`span`,{className:`min-w-0`,children:[(0,v.jsx)(`span`,{className:`block text-small font-semibold`,children:`Create a team`}),(0,v.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`You'll need a creation code`})]})]})]})]})]})}var v;function y(){return(y=e((()=>{o(),c(),g(),u(),f(),v=t(),_.__docgenInfo={description:`The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
Beside switching between your teams it offers the two ways to gain another — join with an invite
link, or create a team — mirroring the teamless \`/onboarding\` hub for a member who already has one.

Prop-only and presentational; the route container owns the navigation each callback performs.`,methods:[],displayName:`TeamsView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`Every Team the caller is a Member of. May be a single team.`},activeTeam:{required:!0,tsType:{name:`union`,raw:`TeamRef | null`,elements:[{name:`TeamRef`},{name:`null`}]},description:`The Team currently active, or null when none is — marks the Active row.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:"Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch (ADR-0023)."},onJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the invite-link join flow.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the create-team flow.`}}}})))()}var b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{n(),y(),b=t(),{expect:x,fn:S,userEvent:C,within:w}=__STORYBOOK_MODULE_TEST__,T={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},E={id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`},D={title:`features/switch-team/TeamsView`,component:_,args:{teams:[T],activeTeam:T,onSelect:S(),onJoin:S(),onCreate:S()}},O={play:async({canvas:e})=>{await x(e.getByRole(`heading`,{name:`Teams`})).toBeInTheDocument(),await x(e.getByRole(`heading`,{name:`Your teams`})).toBeInTheDocument(),await x(e.getByRole(`heading`,{name:`Join or create`})).toBeInTheDocument(),await x(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await x(e.getByText(`Active`)).toBeInTheDocument(),await x(e.getByText(`Join with an invite link`)).toBeInTheDocument(),await x(e.getByText(`Create a team`)).toBeInTheDocument()}},k={render:e=>(0,b.jsx)(r,{items:{"Multiple teams":(0,b.jsx)(_,{...e,teams:[T,E],activeTeam:T})}}),play:async({canvas:e})=>{let t=w(e.getByRole(`region`,{name:`Multiple teams`}));await x(t.getAllByText(`Active`)).toHaveLength(1),await x(t.getByText(`Tovo Heren 5`)).toBeInTheDocument()}},A={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,b.jsx)(r,{items:{Single:(0,b.jsx)(_,{...e}),Multiple:(0,b.jsx)(_,{...e,teams:[T,E],activeTeam:T})}}),play:async({canvas:e,args:t})=>{let n=t=>w(e.getByRole(`region`,{name:t}));await C.click(n(`Single`).getByText(`Join with an invite link`)),await x(t.onJoin).toHaveBeenCalled(),await C.click(n(`Single`).getByText(`Create a team`)),await x(t.onCreate).toHaveBeenCalled(),await C.click(n(`Multiple`).getByText(`Tovo Heren 5`)),await x(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`Data`,`Shells`,`Interactions`]})))()}M();export{O as Data,A as Interactions,k as Shells,j as __namedExportsOrder,D as default};