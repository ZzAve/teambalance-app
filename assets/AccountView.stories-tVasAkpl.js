import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{n}from"./iframe-zeEvxunR.js";import{i as r,n as i,r as a,t as o}from"./router-decorator-B1VOlsPQ.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./createLucideIcon-tdkmLD--.js";import{n as ee,t as u}from"./chevron-right-CNaEb2RW.js";import{n as te,t as d}from"./ThemeToggleView-Bm2pDyx3.js";import{n as ne,t as re}from"./users-DoXSjR8R.js";import{n as ie,t as ae}from"./EditProfileForm-Da0HGe7P.js";var f,p;function m(){return(m=t((()=>{c(),f=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]],p=l(`key-round`,f)})))()}var h,g;function _(){return(_=t((()=>{c(),h=[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]],g=l(`log-out`,h)})))()}var oe,se;function ce(){return(ce=t((()=>{c(),oe=[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]],se=l(`mail`,oe)})))()}var le,ue;function de(){return(de=t((()=>{c(),le=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]],ue=l(`shield-check`,le)})))()}var v,fe;function pe(){return(pe=t((()=>{v=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},fe=(e=>e?v(e):v)})))()}function me(e,t=he){let n=y.useSyncExternalStore(e.subscribe,y.useCallback(()=>t(e.getState()),[e,t]),y.useCallback(()=>t(e.getInitialState()),[e,t]));return y.useDebugValue(n),n}var y,he,b,ge;function _e(){return(_e=t((()=>{y=e(n(),1),pe(),he=e=>e,b=e=>{let t=fe(e),n=e=>me(t,e);return Object.assign(n,t),n},ge=(e=>e?b(e):b)})))()}function ve(e){return typeof e==`string`&&w.includes(e)}function ye(e){try{let t=e?.getItem(S);return ve(t)?t:`system`}catch{return`system`}}function be(e,t){try{t?.setItem(S,e)}catch{}}function x(e,t){return e===`system`?t?`dark`:`light`:e}var S,C,w;function T(){return(T=t((()=>{S=`tb-theme`,C=`(prefers-color-scheme: dark)`,w=[`system`,`light`,`dark`]})))()}function E(){return typeof window>`u`||typeof window.matchMedia!=`function`?!1:window.matchMedia(C).matches}function D(){try{return typeof window>`u`?null:window.localStorage}catch{return null}}var O,k;function A(){return(A=t((()=>{n(),_e(),T(),O=ye(D()),k=ge((e,t)=>({preference:O,resolved:x(O,E()),setPreference:t=>{be(t,D()),e({preference:t,resolved:x(t,E())})},syncSystemPreference:()=>e({resolved:x(t().preference,E())})}))})))()}function j(){let e=k(e=>e.preference),t=k(e=>e.setPreference);return(0,M.jsx)(d,{value:e,onChange:t})}var M;function N(){return(N=t((()=>{A(),te(),M=s(),j.__docgenInfo={description:"Thin container for the appearance control: reads the preference from the theme store and writes\nthe user's choice straight back. There is no network and no local state, so everything worth\nasserting lives in ThemeToggleView's story; the DOM effects belong to `useThemeSync` in the root\nlayout, which is the single writer of the `.dark` class and the theme-color meta.",methods:[],displayName:`ThemeToggle`}})))()}function P({children:e}){return(0,F.jsx)(`h3`,{className:`mb-2 px-1 text-sm font-semibold text-muted-foreground`,children:e})}function xe({sections:e,email:t,activeTeamName:n,member:r,positions:i=[],isMemberLoading:o,isMemberError:s,isSaving:c,memberErrorCode:l,onSubmitProfile:ee,onLogout:te}){let d=t=>e.includes(t);return(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Account`}),(0,F.jsxs)(`div`,{className:`mt-6 space-y-6`,children:[d(`email`)&&(0,F.jsxs)(`section`,{children:[(0,F.jsx)(P,{children:`Account`}),(0,F.jsx)(`div`,{className:I,children:(0,F.jsxs)(`div`,{className:L,children:[(0,F.jsx)(se,{size:18,strokeWidth:1.9,className:z,"aria-hidden":`true`}),(0,F.jsx)(`span`,{className:`font-medium`,children:`Email`}),(0,F.jsx)(`span`,{className:`ml-auto min-w-0 truncate text-muted-foreground`,title:t,children:t})]})})]}),d(`displayName`)&&(0,F.jsxs)(`section`,{children:[(0,F.jsx)(P,{children:`Profile`}),(0,F.jsxs)(`div`,{className:`${I} p-4`,children:[o&&(0,F.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Loading…`}),s&&(0,F.jsx)(`p`,{className:`text-sm text-red`,children:`Couldn't load your profile. Please try again.`}),!o&&!s&&r&&(0,F.jsx)(ae,{currentName:r.displayName,positions:i,currentPositionId:r.position?.id??null,isSaving:!!c,errorCode:l,onSubmit:(e,t)=>ee?.(e,t)})]})]}),d(`teams`)&&(0,F.jsxs)(`section`,{children:[(0,F.jsx)(P,{children:`Teams`}),(0,F.jsx)(`div`,{className:I,children:(0,F.jsxs)(a,{to:`/select-team`,className:R,children:[(0,F.jsx)(re,{size:18,strokeWidth:1.9,className:z,"aria-hidden":`true`}),n?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:n}),(0,F.jsx)(`span`,{className:`ml-auto rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green`,children:`Active`})]}):(0,F.jsx)(`span`,{className:`font-medium text-muted-foreground`,children:`Join or create a team`}),(0,F.jsx)(u,{size:16,className:`${n?`ml-3`:`ml-auto`} shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})})]}),d(`appearance`)&&(0,F.jsx)(`section`,{children:(0,F.jsx)(j,{})}),d(`platformAdmin`)&&(0,F.jsxs)(`section`,{children:[(0,F.jsx)(P,{children:`Platform admin`}),(0,F.jsx)(`div`,{className:I,children:(0,F.jsxs)(`div`,{className:`divide-y divide-border`,children:[(0,F.jsxs)(a,{to:`/admin/teams`,className:R,children:[(0,F.jsx)(ue,{size:18,strokeWidth:1.9,className:z,"aria-hidden":`true`}),(0,F.jsx)(`span`,{className:`font-medium`,children:`Teams console`}),(0,F.jsx)(u,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]}),(0,F.jsxs)(a,{to:`/admin/creation-codes`,className:R,children:[(0,F.jsx)(p,{size:18,strokeWidth:1.9,className:z,"aria-hidden":`true`}),(0,F.jsx)(`span`,{className:`font-medium`,children:`Creation codes`}),(0,F.jsx)(u,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})]})})]}),(0,F.jsx)(`div`,{className:I,children:(0,F.jsxs)(`button`,{type:`button`,onClick:te,className:`${R} font-semibold text-red hover:bg-red/5`,children:[(0,F.jsx)(g,{size:18,strokeWidth:1.9,className:`shrink-0 text-red`,"aria-hidden":`true`}),`Log out`]})})]})]})}var F,I,L,R,z;function Se(){return(Se=t((()=>{r(),ee(),m(),_(),ce(),de(),ne(),ie(),N(),F=s(),I=`overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]`,L=`flex items-center gap-3 px-4 py-3 text-sm`,R=`${L} w-full text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50`,z=`shrink-0 text-muted-foreground`,xe.__docgenInfo={description:`The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
reads the session and the member profile; this renders the sections it is handed as a grouped
settings list of cards, following the concept prototype: iconed rows, right-aligned muted values,
an Active badge on the team, and Log out as its own red row.

**Log out is rendered unconditionally**, in its own trailing card outside every other section —
including the profile loading/error shells — because it acts on the session, not on any data that
might still be loading. A failed member fetch can never hide it. That invariant is the whole point
of the ADR, and every story asserts it.`,methods:[],displayName:`AccountView`,props:{sections:{required:!0,tsType:{name:`Array`,elements:[{name:`union`,raw:`| 'email'
| 'displayName'
| 'position'
| 'appearance'
| 'teams'
| 'platformAdmin'
| 'logout'`,elements:[{name:`literal`,value:`'email'`},{name:`literal`,value:`'displayName'`},{name:`literal`,value:`'position'`},{name:`literal`,value:`'appearance'`},{name:`literal`,value:`'teams'`},{name:`literal`,value:`'platformAdmin'`},{name:`literal`,value:`'logout'`}]}],raw:`AccountSection[]`},description:`The visible sections for this session, from {@link accountSections}. Drives which rows render.`},email:{required:!0,tsType:{name:`string`},description:``},activeTeamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Active Team's name, or null when there is none (teamless).`},member:{required:!1,tsType:{name:`union`,raw:`Member | null`,elements:[{name:`Member`},{name:`null`}]},description:`The current member — only present (and only fetched) when there is an Active Team.`},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The Active Team's position vocabulary; empty hides the position picker.`,defaultValue:{value:`[]`,computed:!1}},isMemberLoading:{required:!1,tsType:{name:`boolean`},description:`The member-profile query is in flight. Shows the profile shell — Log out stays rendered.`},isMemberError:{required:!1,tsType:{name:`boolean`},description:`The member-profile query failed. Shows the error shell — Log out stays rendered.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},memberErrorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update mutation (e.g. NAME_TAKEN), shown inline.`},onSubmitProfile:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onLogout:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var B,V,H,U,W,G,Ce,K,q,J,Y,X,Z,Q,we;function $(){return($=t((()=>{o(),Se(),{expect:B,fn:V}=__STORYBOOK_MODULE_TEST__,H=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],U={userId:`u1`,displayName:`Alex`,role:`MEMBER`,position:{id:`p1`,label:`Setter`},onboarded:!0},W=[`email`,`displayName`,`position`,`appearance`,`teams`,`logout`],G=[`email`,`appearance`,`teams`,`logout`],Ce={title:`features/account/AccountView`,component:xe,decorators:[i],args:{email:`alex@example.com`,onLogout:V(),onSubmitProfile:V()}},K={args:{sections:G},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.queryByLabelText(`Display name`)).not.toBeInTheDocument(),await B(e.getByText(`Join or create a team`)).toBeInTheDocument()}},q={args:{sections:W,member:U,positions:H,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.getByLabelText(`Display name`)).toHaveValue(`Alex`),await B(e.getByText(`Setpoint VT`)).toBeInTheDocument()}},J={args:{sections:W,member:U,positions:H,activeTeamName:`Tovo Heren`},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.getByText(`Tovo Heren`)).toBeInTheDocument()}},Y={args:{sections:[`email`,`appearance`,`teams`,`platformAdmin`,`logout`]},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.getByRole(`link`,{name:`Teams console`})).toHaveAttribute(`href`,`/admin/teams`),await B(e.getByRole(`link`,{name:`Creation codes`})).toHaveAttribute(`href`,`/admin/creation-codes`)}},X={args:{sections:W,isMemberLoading:!0,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.getByText(`Loading…`)).toBeInTheDocument(),await B(e.queryByLabelText(`Display name`)).not.toBeInTheDocument()}},Z={args:{sections:W,isMemberError:!0,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await B(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await B(e.getByText(`Couldn't load your profile. Please try again.`)).toBeInTheDocument(),await B(e.queryByLabelText(`Display name`)).not.toBeInTheDocument()}},Q={args:{sections:G},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Log out`})),await B(n.onLogout).toHaveBeenCalled()}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    sections: TEAMLESS
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    // No profile form and no team named when teamless.
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument();
    await expect(canvas.getByText('Join or create a team')).toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    sections: WITH_TEAM,
    member: MEMBER,
    positions: POSITIONS,
    activeTeamName: 'Setpoint VT'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Alex');
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    sections: WITH_TEAM,
    member: MEMBER,
    positions: POSITIONS,
    activeTeamName: 'Tovo Heren'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Tovo Heren')).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    sections: ['email', 'appearance', 'teams', 'platformAdmin', 'logout']
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Teams console'
    })).toHaveAttribute('href', '/admin/teams');
    await expect(canvas.getByRole('link', {
      name: 'Creation codes'
    })).toHaveAttribute('href', '/admin/creation-codes');
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    sections: WITH_TEAM,
    isMemberLoading: true,
    activeTeamName: 'Setpoint VT'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    sections: WITH_TEAM,
    isMemberError: true,
    activeTeamName: 'Setpoint VT'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    sections: TEAMLESS
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...Q.parameters?.docs?.source}}},we=[`Teamless`,`SingleTeam`,`MultiTeam`,`Admin`,`Loading`,`ErrorState`,`LoggingOut`]})))()}$();export{Y as Admin,Z as ErrorState,X as Loading,Q as LoggingOut,J as MultiTeam,q as SingleTeam,K as Teamless,we as __namedExportsOrder,Ce as default};