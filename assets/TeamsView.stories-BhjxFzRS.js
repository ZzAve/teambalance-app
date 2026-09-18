import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./createLucideIcon-DP10yG82.js";import{n as r,t as i}from"./check-D9n0bwR-.js";import{n as a,t as o}from"./circle-plus-CPxHytoJ.js";import{n as s,t as c}from"./users-Ca3AxGoD.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./SectionLabel-B5oFQ-GJ.js";var f,p;function m(){return(m=e((()=>{t(),f=[[`path`,{d:`M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,key:`qn84l0`}],[`path`,{d:`M13 5v2`,key:`dyzc3o`}],[`path`,{d:`M13 17v2`,key:`1ont0d`}],[`path`,{d:`M13 11v2`,key:`1wjjxi`}]],p=n(`ticket`,f)})))()}function h({teams:e,activeTeam:t,onSelect:n,onJoin:r,onCreate:a}){return(0,g.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,g.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Teams`}),(0,g.jsxs)(`section`,{className:`mt-6`,children:[(0,g.jsx)(d,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Your teams`}),(0,g.jsx)(`ul`,{className:`flex flex-col gap-2`,children:e.map(e=>{let r=e.id===t?.id;return(0,g.jsx)(`li`,{children:(0,g.jsxs)(`button`,{type:`button`,onClick:()=>n(e.slug),"aria-current":r?`true`:void 0,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,g.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,g.jsx)(c,{size:18})}),(0,g.jsxs)(`span`,{className:`min-w-0`,children:[(0,g.jsx)(`span`,{className:`block truncate text-small font-semibold`,children:e.name}),(0,g.jsxs)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:[`/`,e.slug]})]}),r&&(0,g.jsxs)(`span`,{className:`ml-auto flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:[(0,g.jsx)(i,{size:13}),`Active`]})]})},e.id)})})]}),(0,g.jsxs)(`section`,{className:`mt-8 border-t border-border pt-6`,children:[(0,g.jsx)(d,{as:`h2`,className:`mb-2 px-1 text-small`,children:`Join or create`}),(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsxs)(`button`,{type:`button`,onClick:r,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,g.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,g.jsx)(p,{size:18})}),(0,g.jsxs)(`span`,{className:`min-w-0`,children:[(0,g.jsx)(`span`,{className:`block text-small font-semibold`,children:`Join with an invite link`}),(0,g.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`Someone shared a join link with you`})]})]}),(0,g.jsxs)(`button`,{type:`button`,onClick:a,className:`flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,g.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,g.jsx)(o,{size:18})}),(0,g.jsxs)(`span`,{className:`min-w-0`,children:[(0,g.jsx)(`span`,{className:`block text-small font-semibold`,children:`Create a team`}),(0,g.jsx)(`span`,{className:`block truncate text-caption text-muted-foreground`,children:`You'll need a creation code`})]})]})]})]})]})}var g;function _(){return(_=e((()=>{r(),a(),m(),s(),u(),g=l(),h.__docgenInfo={description:`The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
Beside switching between your teams it offers the two ways to gain another — join with an invite
link, or create a team — mirroring the teamless \`/onboarding\` hub for a member who already has one.

Prop-only and presentational; the route container owns the navigation each callback performs.`,methods:[],displayName:`TeamsView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`Every Team the caller is a Member of. May be a single team.`},activeTeam:{required:!0,tsType:{name:`union`,raw:`TeamRef | null`,elements:[{name:`TeamRef`},{name:`null`}]},description:`The Team currently active, or null when none is — marks the Active row.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:"Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch (ADR-0023)."},onJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the invite-link join flow.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the create-team flow.`}}}})))()}var v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{_(),{expect:v,fn:y,userEvent:b}=__STORYBOOK_MODULE_TEST__,x={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},S={id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`},C={title:`features/switch-team/TeamsView`,component:h,args:{teams:[x],activeTeam:x,onSelect:y(),onJoin:y(),onCreate:y()}},w={play:async({canvas:e})=>{await v(e.getByRole(`heading`,{name:`Teams`})).toBeInTheDocument(),await v(e.getByRole(`heading`,{name:`Your teams`})).toBeInTheDocument(),await v(e.getByRole(`heading`,{name:`Join or create`})).toBeInTheDocument(),await v(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await v(e.getByText(`Active`)).toBeInTheDocument(),await v(e.getByText(`Join with an invite link`)).toBeInTheDocument(),await v(e.getByText(`Create a team`)).toBeInTheDocument()}},T={args:{teams:[x,S],activeTeam:x},play:async({canvas:e})=>{await v(e.getAllByText(`Active`)).toHaveLength(1),await v(e.getByText(`Tovo Heren 5`)).toBeInTheDocument()}},E={args:{teams:[x,S],activeTeam:x},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await b.click(e.getByText(`Tovo Heren 5`)),await v(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},D={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await b.click(e.getByText(`Join with an invite link`)),await v(t.onJoin).toHaveBeenCalled()}},O={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await b.click(e.getByText(`Create a team`)),await v(t.onCreate).toHaveBeenCalled()}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    teams: [SETPOINT, TOVO],
    activeTeam: SETPOINT
  },
  play: async ({
    canvas
  }) => {
    // Only the active team carries the badge.
    await expect(canvas.getAllByText('Active')).toHaveLength(1);
    await expect(canvas.getByText('Tovo Heren 5')).toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    teams: [SETPOINT, TOVO],
    activeTeam: SETPOINT
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    await userEvent.click(canvas.getByText('Tovo Heren 5'));
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5');
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    await userEvent.click(canvas.getByText('Join with an invite link'));
    await expect(args.onJoin).toHaveBeenCalled();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    await userEvent.click(canvas.getByText('Create a team'));
    await expect(args.onCreate).toHaveBeenCalled();
  }
}`,...O.parameters?.docs?.source}}},k=[`SingleTeam`,`MultipleTeams`,`SelectingATeam`,`JoiningWithAnInvite`,`CreatingATeam`]})))()}A();export{O as CreatingATeam,D as JoiningWithAnInvite,T as MultipleTeams,E as SelectingATeam,w as SingleTeam,k as __namedExportsOrder,C as default};