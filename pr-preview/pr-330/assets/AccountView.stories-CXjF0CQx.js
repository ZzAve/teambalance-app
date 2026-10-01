import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r,r as i}from"./iframe-Cm8AJftX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as ee}from"./stack-D87d-8jv.js";import{n as s,t as c}from"./link-4Te0ecXa.js";import{n as l,t as u}from"./createLucideIcon-It2k_8pt.js";import{n as d,t as f}from"./chevron-right-DTOCVv5p.js";import{n as te,t as ne}from"./ThemeToggleView-0dkEuqNh.js";import{n as re,t as ie}from"./users-D6_iO0b4.js";import{n as ae,t as p}from"./SectionLabel-B5oFQ-GJ.js";import{n as oe,r as se}from"./app-shell-decorator-BtfmzATm.js";import{n as ce,t as le}from"./EditProfileForm-BwsTYAVW.js";var m,h;function g(){return(g=t((()=>{l(),m=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]],h=u(`key-round`,m)})))()}var _,v;function y(){return(y=t((()=>{l(),_=[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]],v=u(`log-out`,_)})))()}var b,x;function ue(){return(ue=t((()=>{l(),b=[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]],x=u(`mail`,b)})))()}var de,fe;function pe(){return(pe=t((()=>{l(),de=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]],fe=u(`shield-check`,de)})))()}var S,C;function w(){return(w=t((()=>{S=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},C=(e=>e?S(e):S)})))()}function me(e,t=E){let n=T.useSyncExternalStore(e.subscribe,T.useCallback(()=>t(e.getState()),[e,t]),T.useCallback(()=>t(e.getInitialState()),[e,t]));return T.useDebugValue(n),n}var T,E,D,O;function k(){return(k=t((()=>{T=e(n(),1),w(),E=e=>e,D=e=>{let t=C(e),n=e=>me(t,e);return Object.assign(n,t),n},O=(e=>e?D(e):D)})))()}function he(e){return typeof e==`string`&&N.includes(e)}function ge(e){try{let t=e?.getItem(j);return he(t)?t:`system`}catch{return`system`}}function _e(e,t){try{t?.setItem(j,e)}catch{}}function A(e,t){return e===`system`?t?`dark`:`light`:e}var j,M,N;function P(){return(P=t((()=>{j=`tb-theme`,M=`(prefers-color-scheme: dark)`,N=[`system`,`light`,`dark`]})))()}function F(){return typeof window>`u`||typeof window.matchMedia!=`function`?!1:window.matchMedia(M).matches}function I(){try{return typeof window>`u`?null:window.localStorage}catch{return null}}var L,R;function z(){return(z=t((()=>{n(),k(),P(),L=ge(I()),R=O((e,t)=>({preference:L,resolved:A(L,F()),setPreference:t=>{_e(t,I()),e({preference:t,resolved:A(t,F())})},syncSystemPreference:()=>e({resolved:A(t().preference,F())})}))})))()}function B(){let e=R(e=>e.preference),t=R(e=>e.setPreference);return(0,ve.jsx)(ne,{value:e,onChange:t})}var ve;function ye(){return(ye=t((()=>{z(),te(),ve=a(),B.__docgenInfo={description:"Thin container for the appearance control: reads the preference from the theme store and writes\nthe user's choice straight back. There is no network and no local state, so everything worth\nasserting lives in ThemeToggleView's story; the DOM effects belong to `useThemeSync` in the root\nlayout, which is the single writer of the `.dark` class and the theme-color meta.",methods:[],displayName:`ThemeToggle`}})))()}function V({sections:e,email:t,activeTeamName:n,member:r,positions:i=[],isMemberLoading:a,isMemberError:o,isSaving:ee,memberErrorCode:s,onSubmitProfile:l,onLogout:u}){let d=t=>e.includes(t);return(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Account`}),(0,H.jsxs)(`div`,{className:`mt-6 space-y-6`,children:[d(`email`)&&(0,H.jsxs)(`section`,{children:[(0,H.jsx)(p,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Account`}),(0,H.jsx)(`div`,{className:U,children:(0,H.jsxs)(`div`,{className:W,children:[(0,H.jsx)(x,{size:18,strokeWidth:1.9,className:K,"aria-hidden":`true`}),(0,H.jsx)(`span`,{className:`font-medium`,children:`Email`}),(0,H.jsx)(`span`,{className:`ml-auto min-w-0 truncate text-muted-foreground`,title:t,children:t})]})})]}),d(`displayName`)&&(0,H.jsxs)(`section`,{children:[(0,H.jsx)(p,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Profile`}),(0,H.jsxs)(`div`,{className:`${U} p-4`,children:[a&&(0,H.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),o&&(0,H.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load your profile. Please try again.`}),!a&&!o&&r&&(0,H.jsx)(le,{currentName:r.displayName,positions:i,currentPositionId:r.position?.id??null,isSaving:!!ee,errorCode:s,onSubmit:(e,t)=>l?.(e,t)})]})]}),d(`teams`)&&(0,H.jsxs)(`section`,{children:[(0,H.jsx)(p,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Teams`}),(0,H.jsx)(`div`,{className:U,children:(0,H.jsxs)(c,{to:`/select-team`,className:G,children:[(0,H.jsx)(ie,{size:18,strokeWidth:1.9,className:K,"aria-hidden":`true`}),n?(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:n}),(0,H.jsx)(`span`,{className:`ml-auto rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:`Active`})]}):(0,H.jsx)(`span`,{className:`font-medium text-muted-foreground`,children:`Join or create a team`}),(0,H.jsx)(f,{size:16,className:`${n?`ml-3`:`ml-auto`} shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})})]}),d(`appearance`)&&(0,H.jsx)(`section`,{children:(0,H.jsx)(B,{})}),d(`platformAdmin`)&&(0,H.jsxs)(`section`,{children:[(0,H.jsx)(p,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Platform admin`}),(0,H.jsx)(`div`,{className:U,children:(0,H.jsxs)(`div`,{className:`divide-y divide-border`,children:[(0,H.jsxs)(c,{to:`/admin/teams`,className:G,children:[(0,H.jsx)(fe,{size:18,strokeWidth:1.9,className:K,"aria-hidden":`true`}),(0,H.jsx)(`span`,{className:`font-medium`,children:`Teams console`}),(0,H.jsx)(f,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]}),(0,H.jsxs)(c,{to:`/admin/creation-codes`,className:G,children:[(0,H.jsx)(h,{size:18,strokeWidth:1.9,className:K,"aria-hidden":`true`}),(0,H.jsx)(`span`,{className:`font-medium`,children:`Creation codes`}),(0,H.jsx)(f,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})]})})]}),(0,H.jsx)(`div`,{className:U,children:(0,H.jsxs)(`button`,{type:`button`,onClick:u,className:`${G} font-semibold text-red hover:bg-red/5`,children:[(0,H.jsx)(v,{size:18,strokeWidth:1.9,className:`shrink-0 text-red`,"aria-hidden":`true`}),`Log out`]})})]})]})}var H,U,W,G,K;function be(){return(be=t((()=>{s(),d(),g(),y(),ue(),pe(),re(),ce(),ye(),ae(),H=a(),U=`overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]`,W=`flex items-center gap-3 px-4 py-3 text-small`,G=`${W} w-full text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50`,K=`shrink-0 text-muted-foreground`,V.__docgenInfo={description:`The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
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
| 'logout'`,elements:[{name:`literal`,value:`'email'`},{name:`literal`,value:`'displayName'`},{name:`literal`,value:`'position'`},{name:`literal`,value:`'appearance'`},{name:`literal`,value:`'teams'`},{name:`literal`,value:`'platformAdmin'`},{name:`literal`,value:`'logout'`}]}],raw:`AccountSection[]`},description:`The visible sections for this session, from {@link accountSections}. Drives which rows render.`},email:{required:!0,tsType:{name:`string`},description:``},activeTeamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Active Team's name, or null when there is none (teamless).`},member:{required:!1,tsType:{name:`union`,raw:`Member | null`,elements:[{name:`Member`},{name:`null`}]},description:`The current member — only present (and only fetched) when there is an Active Team.`},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The Active Team's position vocabulary; empty hides the position picker.`,defaultValue:{value:`[]`,computed:!1}},isMemberLoading:{required:!1,tsType:{name:`boolean`},description:`The member-profile query is in flight. Shows the profile shell — Log out stays rendered.`},isMemberError:{required:!1,tsType:{name:`boolean`},description:`The member-profile query failed. Shows the error shell — Log out stays rendered.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},memberErrorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update mutation (e.g. NAME_TAKEN), shown inline.`},onSubmitProfile:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onLogout:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var q,J,Y,xe,Se,Ce,we,Te,Ee,X,De,Z,Q,$,Oe;function ke(){return(ke=t((()=>{o(),se(),i(),be(),q=a(),{expect:J,fn:Y,within:xe}=__STORYBOOK_MODULE_TEST__,Se=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],Ce={userId:`u1`,displayName:`Alex`,role:`MEMBER`,position:{id:`p1`,label:`Setter`},onboarded:!0},we=[`email`,`displayName`,`position`,`appearance`,`teams`,`logout`],Te=[`email`,`appearance`,`teams`,`logout`],Ee=[`email`,`appearance`,`teams`,`platformAdmin`,`logout`],X=oe(`account`),De={title:`features/account/AccountView`,component:V,decorators:X.decorators,parameters:X.parameters,args:{email:`alex@example.com`,sections:we,member:Ce,positions:Se,activeTeamName:`Setpoint VT`,onLogout:Y(),onSubmitProfile:Y()}},Z={parameters:{chromatic:{modes:r}},play:async({canvas:e})=>{await J(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(e.getByLabelText(`Display name`)).toHaveValue(`Alex`),await J(e.getAllByText(`Setpoint VT`)).toHaveLength(2),await J(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`)}},Q={render:e=>(0,q.jsx)(ee,{items:{Teamless:(0,q.jsx)(V,{...e,sections:Te,member:null,positions:[],activeTeamName:null}),"Multi-team":(0,q.jsx)(V,{...e,activeTeamName:`Tovo Heren`}),"Platform admin":(0,q.jsx)(V,{...e,sections:Ee,member:null,activeTeamName:null}),Loading:(0,q.jsx)(V,{...e,member:null,isMemberLoading:!0}),Error:(0,q.jsx)(V,{...e,member:null,isMemberError:!0})}}),play:async({canvas:e})=>{let t=t=>xe(e.getByRole(`region`,{name:t})),n=t(`Teamless`);await J(n.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(n.queryByLabelText(`Display name`)).not.toBeInTheDocument(),await J(n.getByText(`Join or create a team`)).toBeInTheDocument(),await J(t(`Multi-team`).getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(t(`Multi-team`).getByText(`Tovo Heren`)).toBeInTheDocument();let r=t(`Platform admin`);await J(r.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(r.getByRole(`link`,{name:`Teams console`})).toHaveAttribute(`href`,`/admin/teams`),await J(r.getByRole(`link`,{name:`Creation codes`})).toHaveAttribute(`href`,`/admin/creation-codes`);let i=t(`Loading`);await J(i.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(i.getByText(`Loading…`)).toBeInTheDocument(),await J(i.queryByLabelText(`Display name`)).not.toBeInTheDocument();let a=t(`Error`);await J(a.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await J(a.getByText(`Couldn't load your profile. Please try again.`)).toBeInTheDocument(),await J(a.queryByLabelText(`Display name`)).not.toBeInTheDocument()}},$={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name`);await t.clear(r),await t.type(r,`Alex B`),await t.click(e.getByRole(`button`,{name:`Save`})),await J(n.onSubmitProfile).toHaveBeenCalledWith(`Alex B`,`p1`),await t.click(e.getByRole(`button`,{name:`Log out`})),await J(n.onLogout).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Alex');
    // Named once in the Teams section and once in the shell's header.
    await expect(canvas.getAllByText('Setpoint VT')).toHaveLength(2);
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Teamless: <AccountView {...args} sections={TEAMLESS} member={null} positions={[]} activeTeamName={null} />,
    'Multi-team': <AccountView {...args} activeTeamName="Tovo Heren" />,
    'Platform admin': <AccountView {...args} sections={ADMIN} member={null} activeTeamName={null} />,
    Loading: <AccountView {...args} member={null} isMemberLoading />,
    Error: <AccountView {...args} member={null} isMemberError />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const teamless = region('Teamless');
    await expect(teamless.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    // No profile form and no team named when teamless.
    await expect(teamless.queryByLabelText('Display name')).not.toBeInTheDocument();
    await expect(teamless.getByText('Join or create a team')).toBeInTheDocument();
    await expect(region('Multi-team').getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(region('Multi-team').getByText('Tovo Heren')).toBeInTheDocument();
    const admin = region('Platform admin');
    await expect(admin.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(admin.getByRole('link', {
      name: 'Teams console'
    })).toHaveAttribute('href', '/admin/teams');
    await expect(admin.getByRole('link', {
      name: 'Creation codes'
    })).toHaveAttribute('href', '/admin/creation-codes');

    // The member-profile query is in flight: the profile section shows its loading shell, but Log
    // out (which acts on the session, not the profile) still renders.
    const loading = region('Loading');
    await expect(loading.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(loading.getByText('Loading…')).toBeInTheDocument();
    await expect(loading.queryByLabelText('Display name')).not.toBeInTheDocument();

    // The member-profile query failed: the profile section shows its error shell — Log out is still
    // reachable, so a broken member fetch never strands the user.
    const error = region('Error');
    await expect(error.getByRole('button', {
      name: 'Log out'
    })).toBeInTheDocument();
    await expect(error.getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument();
    await expect(error.queryByLabelText('Display name')).not.toBeInTheDocument();
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Saving the profile hands the name and the position up.
    const name = canvas.getByLabelText('Display name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Alex B');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmitProfile).toHaveBeenCalledWith('Alex B', 'p1');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Log out'
    }));
    await expect(args.onLogout).toHaveBeenCalled();
  }
}`,...$.parameters?.docs?.source}}},Oe=[`Data`,`Shells`,`Interactions`]})))()}ke();export{Z as Data,$ as Interactions,Q as Shells,Oe as __namedExportsOrder,De as default};