import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./users-i_MJNLzk.js";function i({teams:e,onSelect:t}){return(0,a.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,a.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Which team?`}),(0,a.jsx)(`p`,{className:`mt-2 text-sm text-muted-foreground`,children:`You play in more than one. Pick where you want to be — you can switch any time from the header.`}),(0,a.jsx)(`ul`,{className:`mt-6 flex flex-col gap-2`,children:e.map(e=>(0,a.jsx)(`li`,{children:(0,a.jsxs)(`button`,{type:`button`,onClick:()=>t(e.slug),className:`flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5`,children:[(0,a.jsx)(`span`,{className:`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue`,children:(0,a.jsx)(r,{size:18})}),(0,a.jsxs)(`span`,{className:`min-w-0`,children:[(0,a.jsx)(`span`,{className:`block truncate text-sm font-semibold`,children:e.name}),(0,a.jsxs)(`span`,{className:`block truncate text-xs text-muted-foreground`,children:[`/`,e.slug]})]})]})},e.id))})]})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`"Which Team?" — what a Member of several Teams sees when none is active. No "remember my choice"
control on purpose: picking a Team *is* the switch, and every switch is remembered (ADR-0023 §3).`,methods:[],displayName:`SelectTeamView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`At least two, or the caller would not be here.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:``}}}})))()}var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{o(),{expect:s,fn:c,userEvent:l}=__STORYBOOK_MODULE_TEST__,u=[{id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},{id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`}],d={title:`features/switch-team/SelectTeamView`,component:i,args:{teams:u,onSelect:c()}},f={play:async({canvas:e})=>{await s(e.getByRole(`heading`,{name:`Which team?`})).toBeInTheDocument(),await s(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await s(e.getByText(`Tovo Heren 5`)).toBeInTheDocument(),await s(e.getByText(`/setpoint-vt`)).toBeInTheDocument()}},p={args:{teams:[...u,{id:`t3`,name:`Tovo Dames 2`,slug:`tovo-dames-2`},{id:`t4`,name:`Utrecht Mixed`,slug:`utrecht-mixed`}]},play:async({canvas:e})=>{await s(e.getAllByRole(`button`)).toHaveLength(4)}},m={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await l.click(e.getByText(`Tovo Heren 5`)),await s(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Which team?'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument();
    await expect(canvas.getByText('Tovo Heren 5')).toBeInTheDocument();
    await expect(canvas.getByText('/setpoint-vt')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    teams: [...TEAMS, {
      id: 't3',
      name: 'Tovo Dames 2',
      slug: 'tovo-dames-2'
    }, {
      id: 't4',
      name: 'Utrecht Mixed',
      slug: 'utrecht-mixed'
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of TwoTeams — onSelect fires with the slug; the two-team list is unchanged
  // (ADR-0027 §2).
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
}`,...m.parameters?.docs?.source}}},h=[`TwoTeams`,`ManyTeams`,`ChoosingHandsUpTheSlug`]})))()}g();export{m as ChoosingHandsUpTheSlug,p as ManyTeams,f as TwoTeams,h as __namedExportsOrder,d as default};