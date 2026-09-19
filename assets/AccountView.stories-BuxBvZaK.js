import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{n}from"./iframe-ByyS7Yi9.js";import{n as r,t as i}from"./createLucideIcon-BkXp_paf.js";import{n as a,t as o}from"./chevron-right-Dh-VtTAq.js";import{n as s,t as c}from"./ThemeToggleView-TDWo70AY.js";import{n as ee,t as te}from"./users-DvVQmdnn.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{i as ne,n as u,r as d,t as re}from"./router-decorator-CWG5swfW.js";import{n as ie,t as f}from"./SectionLabel-B5oFQ-GJ.js";import{n as ae,t as oe}from"./EditProfileForm-DxJWgx1n.js";var se,p;function ce(){return(ce=t((()=>{r(),se=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]],p=i(`key-round`,se)})))()}var le,ue;function de(){return(de=t((()=>{r(),le=[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]],ue=i(`log-out`,le)})))()}var fe,pe;function m(){return(m=t((()=>{r(),fe=[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]],pe=i(`mail`,fe)})))()}var h,g;function _(){return(_=t((()=>{r(),h=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]],g=i(`shield-check`,h)})))()}var v,me;function he(){return(he=t((()=>{v=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},me=(e=>e?v(e):v)})))()}function ge(e,t=_e){let n=y.useSyncExternalStore(e.subscribe,y.useCallback(()=>t(e.getState()),[e,t]),y.useCallback(()=>t(e.getInitialState()),[e,t]));return y.useDebugValue(n),n}var y,_e,b,ve;function x(){return(x=t((()=>{y=e(n(),1),he(),_e=e=>e,b=e=>{let t=me(e),n=e=>ge(t,e);return Object.assign(n,t),n},ve=(e=>e?b(e):b)})))()}function ye(e){return typeof e==`string`&&T.includes(e)}function be(e){try{let t=e?.getItem(C);return ye(t)?t:`system`}catch{return`system`}}function xe(e,t){try{t?.setItem(C,e)}catch{}}function S(e,t){return e===`system`?t?`dark`:`light`:e}var C,w,T;function E(){return(E=t((()=>{C=`tb-theme`,w=`(prefers-color-scheme: dark)`,T=[`system`,`light`,`dark`]})))()}function D(){return typeof window>`u`||typeof window.matchMedia!=`function`?!1:window.matchMedia(w).matches}function O(){try{return typeof window>`u`?null:window.localStorage}catch{return null}}var k,A;function j(){return(j=t((()=>{n(),x(),E(),k=be(O()),A=ve((e,t)=>({preference:k,resolved:S(k,D()),setPreference:t=>{xe(t,O()),e({preference:t,resolved:S(t,D())})},syncSystemPreference:()=>e({resolved:S(t().preference,D())})}))})))()}function M(){let e=A(e=>e.preference),t=A(e=>e.setPreference);return(0,N.jsx)(c,{value:e,onChange:t})}var N;function P(){return(P=t((()=>{j(),s(),N=l(),M.__docgenInfo={description:"Thin container for the appearance control: reads the preference from the theme store and writes\nthe user's choice straight back. There is no network and no local state, so everything worth\nasserting lives in ThemeToggleView's story; the DOM effects belong to `useThemeSync` in the root\nlayout, which is the single writer of the `.dark` class and the theme-color meta.",methods:[],displayName:`ThemeToggle`}})))()}function F({sections:e,email:t,activeTeamName:n,member:r,positions:i=[],isMemberLoading:a,isMemberError:s,isSaving:c,memberErrorCode:ee,onSubmitProfile:l,onLogout:ne}){let u=t=>e.includes(t);return(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Account`}),(0,I.jsxs)(`div`,{className:`mt-6 space-y-6`,children:[u(`email`)&&(0,I.jsxs)(`section`,{children:[(0,I.jsx)(f,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Account`}),(0,I.jsx)(`div`,{className:L,children:(0,I.jsxs)(`div`,{className:R,children:[(0,I.jsx)(pe,{size:18,strokeWidth:1.9,className:B,"aria-hidden":`true`}),(0,I.jsx)(`span`,{className:`font-medium`,children:`Email`}),(0,I.jsx)(`span`,{className:`ml-auto min-w-0 truncate text-muted-foreground`,title:t,children:t})]})})]}),u(`displayName`)&&(0,I.jsxs)(`section`,{children:[(0,I.jsx)(f,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Profile`}),(0,I.jsxs)(`div`,{className:`${L} p-4`,children:[a&&(0,I.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),s&&(0,I.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load your profile. Please try again.`}),!a&&!s&&r&&(0,I.jsx)(oe,{currentName:r.displayName,positions:i,currentPositionId:r.position?.id??null,isSaving:!!c,errorCode:ee,onSubmit:(e,t)=>l?.(e,t)})]})]}),u(`teams`)&&(0,I.jsxs)(`section`,{children:[(0,I.jsx)(f,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Teams`}),(0,I.jsx)(`div`,{className:L,children:(0,I.jsxs)(d,{to:`/select-team`,className:z,children:[(0,I.jsx)(te,{size:18,strokeWidth:1.9,className:B,"aria-hidden":`true`}),n?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:n}),(0,I.jsx)(`span`,{className:`ml-auto rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:`Active`})]}):(0,I.jsx)(`span`,{className:`font-medium text-muted-foreground`,children:`Join or create a team`}),(0,I.jsx)(o,{size:16,className:`${n?`ml-3`:`ml-auto`} shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})})]}),u(`appearance`)&&(0,I.jsx)(`section`,{children:(0,I.jsx)(M,{})}),u(`platformAdmin`)&&(0,I.jsxs)(`section`,{children:[(0,I.jsx)(f,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Platform admin`}),(0,I.jsx)(`div`,{className:L,children:(0,I.jsxs)(`div`,{className:`divide-y divide-border`,children:[(0,I.jsxs)(d,{to:`/admin/teams`,className:z,children:[(0,I.jsx)(g,{size:18,strokeWidth:1.9,className:B,"aria-hidden":`true`}),(0,I.jsx)(`span`,{className:`font-medium`,children:`Teams console`}),(0,I.jsx)(o,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]}),(0,I.jsxs)(d,{to:`/admin/creation-codes`,className:z,children:[(0,I.jsx)(p,{size:18,strokeWidth:1.9,className:B,"aria-hidden":`true`}),(0,I.jsx)(`span`,{className:`font-medium`,children:`Creation codes`}),(0,I.jsx)(o,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})]})})]}),(0,I.jsx)(`div`,{className:L,children:(0,I.jsxs)(`button`,{type:`button`,onClick:ne,className:`${z} font-semibold text-red hover:bg-red/5`,children:[(0,I.jsx)(ue,{size:18,strokeWidth:1.9,className:`shrink-0 text-red`,"aria-hidden":`true`}),`Log out`]})})]})]})}var I,L,R,z,B;function Se(){return(Se=t((()=>{ne(),a(),ce(),de(),m(),_(),ee(),ae(),P(),ie(),I=l(),L=`overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]`,R=`flex items-center gap-3 px-4 py-3 text-small`,z=`${R} w-full text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50`,B=`shrink-0 text-muted-foreground`,F.__docgenInfo={description:`The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
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
| 'logout'`,elements:[{name:`literal`,value:`'email'`},{name:`literal`,value:`'displayName'`},{name:`literal`,value:`'position'`},{name:`literal`,value:`'appearance'`},{name:`literal`,value:`'teams'`},{name:`literal`,value:`'platformAdmin'`},{name:`literal`,value:`'logout'`}]}],raw:`AccountSection[]`},description:`The visible sections for this session, from {@link accountSections}. Drives which rows render.`},email:{required:!0,tsType:{name:`string`},description:``},activeTeamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Active Team's name, or null when there is none (teamless).`},member:{required:!1,tsType:{name:`union`,raw:`Member | null`,elements:[{name:`Member`},{name:`null`}]},description:`The current member — only present (and only fetched) when there is an Active Team.`},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The Active Team's position vocabulary; empty hides the position picker.`,defaultValue:{value:`[]`,computed:!1}},isMemberLoading:{required:!1,tsType:{name:`boolean`},description:`The member-profile query is in flight. Shows the profile shell — Log out stays rendered.`},isMemberError:{required:!1,tsType:{name:`boolean`},description:`The member-profile query failed. Shows the error shell — Log out stays rendered.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},memberErrorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update mutation (e.g. NAME_TAKEN), shown inline.`},onSubmitProfile:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onLogout:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var V,H,U,W,G,K,Ce,q,J,Y,X,Z,Q,$,we;function Te(){return(Te=t((()=>{re(),Se(),{expect:V,fn:H}=__STORYBOOK_MODULE_TEST__,U=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],W={userId:`u1`,displayName:`Alex`,role:`MEMBER`,position:{id:`p1`,label:`Setter`},onboarded:!0},G=[`email`,`displayName`,`position`,`appearance`,`teams`,`logout`],K=[`email`,`appearance`,`teams`,`logout`],Ce={title:`features/account/AccountView`,component:F,decorators:[u],args:{email:`alex@example.com`,onLogout:H(),onSubmitProfile:H()}},q={args:{sections:K},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.queryByLabelText(`Display name`)).not.toBeInTheDocument(),await V(e.getByText(`Join or create a team`)).toBeInTheDocument()}},J={args:{sections:G,member:W,positions:U,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.getByLabelText(`Display name`)).toHaveValue(`Alex`),await V(e.getByText(`Setpoint VT`)).toBeInTheDocument()}},Y={args:{sections:G,member:W,positions:U,activeTeamName:`Tovo Heren`},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.getByText(`Tovo Heren`)).toBeInTheDocument()}},X={args:{sections:[`email`,`appearance`,`teams`,`platformAdmin`,`logout`]},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.getByRole(`link`,{name:`Teams console`})).toHaveAttribute(`href`,`/admin/teams`),await V(e.getByRole(`link`,{name:`Creation codes`})).toHaveAttribute(`href`,`/admin/creation-codes`)}},Z={args:{sections:G,isMemberLoading:!0,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.getByText(`Loading…`)).toBeInTheDocument(),await V(e.queryByLabelText(`Display name`)).not.toBeInTheDocument()}},Q={args:{sections:G,isMemberError:!0,activeTeamName:`Setpoint VT`},play:async({canvas:e})=>{await V(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await V(e.getByText(`Couldn't load your profile. Please try again.`)).toBeInTheDocument(),await V(e.queryByLabelText(`Display name`)).not.toBeInTheDocument()}},$={args:{sections:K},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Log out`})),await V(n.onLogout).toHaveBeenCalled()}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}},we=[`Teamless`,`SingleTeam`,`MultiTeam`,`Admin`,`Loading`,`ErrorState`,`LoggingOut`]})))()}Te();export{X as Admin,Q as ErrorState,Z as Loading,$ as LoggingOut,Y as MultiTeam,J as SingleTeam,q as Teamless,we as __namedExportsOrder,Ce as default};