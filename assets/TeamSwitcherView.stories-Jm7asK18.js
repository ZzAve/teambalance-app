import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-S0c8oIbM.js";import{n,t as r}from"./createLucideIcon-CdHO65mg.js";import{n as i,t as a}from"./check-DhtU_wgD.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";var s,c;function l(){return(l=e((()=>{n(),s=[[`path`,{d:`m7 15 5 5 5-5`,key:`1hf1tw`}],[`path`,{d:`m7 9 5-5 5 5`,key:`sgt6xg`}]],c=r(`chevrons-up-down`,s)})))()}function u({teams:e,activeTeam:t,onSelect:n}){let[r,i]=(0,d.useState)(!1);return t?e.length<2?(0,f.jsxs)(`div`,{className:`flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue`,children:[(0,f.jsx)(`span`,{className:`h-1.5 w-1.5 rounded-full bg-green`}),t.name]}):(0,f.jsxs)(`div`,{className:`relative`,children:[(0,f.jsxs)(`button`,{type:`button`,"aria-haspopup":`listbox`,"aria-expanded":r,"aria-label":`Current team: ${t.name}. Switch team`,onClick:()=>i(e=>!e),className:`flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue transition-colors hover:bg-blue/15`,children:[(0,f.jsx)(`span`,{className:`h-1.5 w-1.5 rounded-full bg-green`}),t.name,(0,f.jsx)(c,{size:13})]}),r&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`button`,{type:`button`,"aria-hidden":`true`,tabIndex:-1,className:`fixed inset-0 z-40 cursor-default`,onClick:()=>i(!1)}),(0,f.jsx)(`ul`,{role:`listbox`,"aria-label":`Your teams`,className:`absolute right-0 z-50 mt-2 min-w-56 overflow-hidden rounded-2xl border border-border/60 bg-card py-1 shadow-lg`,children:e.map(e=>{let r=e.id===t.id;return(0,f.jsx)(`li`,{children:(0,f.jsxs)(`button`,{type:`button`,role:`option`,"aria-selected":r,onClick:()=>{i(!1),r||n(e.slug)},className:[`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors`,r?`font-semibold text-blue`:`text-foreground hover:bg-blue/8`].join(` `),children:[e.name,r&&(0,f.jsx)(a,{size:15,className:`shrink-0`})]})},e.id)})})]})]}):null}var d,f;function p(){return(p=e((()=>{d=t(),i(),l(),f=o(),u.__docgenInfo={description:`Always **names the current Team** (ADR-0023 §3) — not decoration: with one kind of switch, opening
a teammate's link re-homes your default, and seeing which Team you are in is what makes that a
one-tap correction rather than a mystery.

A single-Team caller gets the name without a menu; there is nothing to switch to.`,methods:[],displayName:`TeamSwitcherView`,props:{teams:{required:!0,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:`Every Team the caller is a Member of.`},activeTeam:{required:!0,tsType:{name:`union`,raw:`TeamRef | null`,elements:[{name:`TeamRef`},{name:`null`}]},description:`The Team this screen is scoped to, or null when none is active yet.`},onSelect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(slug: string) => void`,signature:{arguments:[{type:{name:`string`},name:`slug`}],return:{name:`void`}}},description:"Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch."}}}})))()}var m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{p(),{expect:m,fn:h,userEvent:g}=__STORYBOOK_MODULE_TEST__,_={id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`},v={title:`features/switch-team/TeamSwitcherView`,component:u,args:{teams:[_,{id:`t2`,name:`Tovo Heren 5`,slug:`tovo-heren-5`}],activeTeam:_,onSelect:h()}},y={args:{teams:[_]},play:async({canvas:e})=>{await m(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await m(e.queryByRole(`button`)).not.toBeInTheDocument()}},b={play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:/Current team: Setpoint VT/});await m(t).toBeInTheDocument(),await m(e.queryByRole(`listbox`)).not.toBeInTheDocument()}},x={play:async({canvas:e})=>{await g.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await m(e.getByRole(`listbox`,{name:`Your teams`})).toBeInTheDocument(),await m(e.getByRole(`option`,{name:/Setpoint VT/})).toHaveAttribute(`aria-selected`,`true`),await m(e.getByRole(`option`,{name:/Tovo Heren 5/})).toHaveAttribute(`aria-selected`,`false`)}},S={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await g.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await g.click(e.getByRole(`option`,{name:/Tovo Heren 5/})),await m(t.onSelect).toHaveBeenCalledWith(`tovo-heren-5`)}},C={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{await g.click(e.getByRole(`button`,{name:/Current team: Setpoint VT/})),await g.click(e.getByRole(`option`,{name:/Setpoint VT/})),await m(t.onSelect).not.toHaveBeenCalled(),await m(e.queryByRole(`listbox`)).not.toBeInTheDocument()}},w={args:{activeTeam:null},play:async({canvas:e})=>{await m(e.queryByText(`Setpoint VT`)).not.toBeInTheDocument()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    teams: [SETPOINT]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const trigger = canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    });
    await expect(trigger).toBeInTheDocument();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await expect(canvas.getByRole('listbox', {
      name: 'Your teams'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('option', {
      name: /Setpoint VT/
    })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', {
      name: /Tovo Heren 5/
    })).toHaveAttribute('aria-selected', 'false');
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of SeveralTeams — the menu closes after the pick, settling to the trigger-closed
  // picture (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(canvas.getByRole('option', {
      name: /Tovo Heren 5/
    }));
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5');
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of SeveralTeams — the menu closes with no switch, settling to the trigger-closed
  // picture (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Current team: Setpoint VT/
    }));
    await userEvent.click(canvas.getByRole('option', {
      name: /Setpoint VT/
    }));
    await expect(args.onSelect).not.toHaveBeenCalled();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    activeTeam: null
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByText('Setpoint VT')).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T=[`SingleTeam`,`SeveralTeams`,`MenuOpen`,`SwitchesToTheOtherTeam`,`PickingTheActiveTeamDoesNothing`,`NoActiveTeam`]})))()}E();export{x as MenuOpen,w as NoActiveTeam,C as PickingTheActiveTeamDoesNothing,b as SeveralTeams,y as SingleTeam,S as SwitchesToTheOtherTeam,T as __namedExportsOrder,v as default};