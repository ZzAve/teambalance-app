import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./createLucideIcon-BDYYYRqV.js";import{n as i,t as a}from"./check-6rbBSHg5.js";import{n as o,t as s}from"./circle-plus-Toclk1pM.js";import{n as c,t as l}from"./users-CjTmhB2A.js";var u,d;function f(){return(f=e((()=>{n(),u=[[`path`,{d:`M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,key:`qn84l0`}],[`path`,{d:`M13 5v2`,key:`dyzc3o`}],[`path`,{d:`M13 17v2`,key:`1ont0d`}],[`path`,{d:`M13 11v2`,key:`1wjjxi`}]],d=r(`ticket`,u)})))()}function p({children:e}){return(0,h.jsx)(`h2`,{className:`mb-2 px-1 text-sm font-semibold text-muted-foreground`,children:e})}function m({teams:e,activeTeam:t,onSelect:n,onJoin:r,onCreate:i}){return(0,h.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,h.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Teams`}),(0,h.jsxs)(`section`,{className:`mt-6`,children:[(0,h.jsx)(p,{children:`Your teams`}),(0,h.jsx)(`ul`,{className:`flex flex-col gap-2`,children:e.map(e=>{let r=e.id===t?.id;return(0,h.jsx)(`li`,{children:(0,h.jsxs)(`button`,{type:`button`,onClick:()=>n(e.slug),"aria-current":r?`true`:void 0,className:`flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,h.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,h.jsx)(l,{size:18})}),(0,h.jsxs)(`span`,{className:`min-w-0`,children:[(0,h.jsx)(`span`,{className:`block truncate text-sm font-semibold`,children:e.name}),(0,h.jsxs)(`span`,{className:`block truncate text-xs text-muted-foreground`,children:[`/`,e.slug]})]}),r&&(0,h.jsxs)(`span`,{className:`ml-auto flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green`,children:[(0,h.jsx)(a,{size:13}),`Active`]})]})},e.id)})})]}),(0,h.jsxs)(`section`,{className:`mt-8 border-t border-border pt-6`,children:[(0,h.jsx)(p,{children:`Join or create`}),(0,h.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,h.jsxs)(`button`,{type:`button`,onClick:r,className:`flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,h.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,h.jsx)(d,{size:18})}),(0,h.jsxs)(`span`,{className:`min-w-0`,children:[(0,h.jsx)(`span`,{className:`block text-sm font-semibold`,children:`Join with an invite link`}),(0,h.jsx)(`span`,{className:`block truncate text-xs text-muted-foreground`,children:`Someone shared a join link with you`})]})]}),(0,h.jsxs)(`button`,{type:`button`,onClick:i,className:`flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,h.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,h.jsx)(s,{size:18})}),(0,h.jsxs)(`span`,{className:`min-w-0`,children:[(0,h.jsx)(`span`,{className:`block text-sm font-semibold`,children:`Create a team`}),(0,h.jsx)(`span`,{className:`block truncate text-xs text-muted-foreground`,children:`You'll need a creation code`})]})]})]})]})]})}var h;function g(){return(g=e((()=>{i(),o(),f(),c(),h=t(),m.__docgenInfo={description:`The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
Beside switching between your teams it offers the two ways to gain another — join with an invite
link, or create a team — mirroring the teamless \`/onboarding\` hub for a member who already has one.

Prop-only and presentational; the route container owns the navigation each callback performs.`,methods:[],displayName:`TeamsView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`Every Team the caller is a Member of. May be a single team.`},activeTeam:{required:!0,tsType:{name:`union`,raw:`TeamRef | null`,elements:[{name:`TeamRef`},{name:`null`}]},description:`The Team currently active, or null when none is — marks the Active row.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:"Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch (ADR-0023)."},onJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the invite-link join flow.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Entry point to the create-team flow.`}}}})))()}var _,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{g(),{expect:_,fn:v,userEvent:y}=__STORYBOOK_MODULE_TEST__,b={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},x={id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`},S={title:`features/switch-team/TeamsView`,component:m,args:{teams:[b],activeTeam:b,onSelect:v(),onJoin:v(),onCreate:v()}},C={play:async({canvas:e})=>{await _(e.getByRole(`heading`,{name:`Teams`})).toBeInTheDocument(),await _(e.getByRole(`heading`,{name:`Your teams`})).toBeInTheDocument(),await _(e.getByRole(`heading`,{name:`Join or create`})).toBeInTheDocument(),await _(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await _(e.getByText(`Active`)).toBeInTheDocument(),await _(e.getByText(`Join with an invite link`)).toBeInTheDocument(),await _(e.getByText(`Create a team`)).toBeInTheDocument()}},w={args:{teams:[b,x],activeTeam:b},play:async({canvas:e})=>{await _(e.getAllByText(`Active`)).toHaveLength(1),await _(e.getByText(`Tovo Heren 5`)).toBeInTheDocument()}},T={args:{teams:[b,x],activeTeam:b},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await y.click(e.getByText(`Tovo Heren 5`)),await _(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},E={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await y.click(e.getByText(`Join with an invite link`)),await _(t.onJoin).toHaveBeenCalled()}},D={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await y.click(e.getByText(`Create a team`)),await _(t.onCreate).toHaveBeenCalled()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByText('Create a team'));
    await expect(args.onCreate).toHaveBeenCalled();
  }
}`,...D.parameters?.docs?.source}}},O=[`SingleTeam`,`MultipleTeams`,`SelectingATeam`,`JoiningWithAnInvite`,`CreatingATeam`]})))()}k();export{D as CreatingATeam,E as JoiningWithAnInvite,w as MultipleTeams,T as SelectingATeam,C as SingleTeam,O as __namedExportsOrder,S as default};