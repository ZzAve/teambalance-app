import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r,r as i}from"./iframe-BE_MQ6CC.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./stack-DUXBP51x.js";import{n as ee,t as c}from"./link-fAjgDtdO.js";import{n as te,t as l}from"./router-decorator-OffvaXRF.js";import{r as ne,t as u}from"./app-column-decorator-BpHDaQeJ.js";import{n as d,t as f}from"./createLucideIcon-DxqVH5b8.js";import{n as p,t as m}from"./chevron-right-CUO12cGu.js";import{n as h,t as re}from"./ThemeToggleView-BPjgGI0Q.js";import{n as ie,t as ae}from"./users-CsyBiHmk.js";import{n as oe,t as g}from"./button-DWtWi-SA.js";import{n as se,t as _}from"./SectionLabel-_vzOhMMA.js";import{n as v,r as y}from"./app-shell-decorator-Crjq_T_q.js";import{n as ce,t as b}from"./photos-CPkbaXnZ.js";import{n as le,t as ue}from"./EditProfileForm-DEP_FI_R.js";import{n as de,t as fe}from"./PhotoPicker-VzdrP2yM.js";import{n as pe,t as me}from"./avatar-BGk5DVVI.js";import{n as he,t as ge}from"./ConfirmDialog-0Y1AHGJQ.js";var _e,ve;function ye(){return(ye=t((()=>{d(),_e=[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]],ve=f(`key-round`,_e)})))()}var be,xe;function Se(){return(Se=t((()=>{d(),be=[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]],xe=f(`log-out`,be)})))()}var x,S;function C(){return(C=t((()=>{d(),x=[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]],S=f(`mail`,x)})))()}var w,T;function E(){return(E=t((()=>{d(),w=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]],T=f(`shield-check`,w)})))()}var D,O;function k(){return(k=t((()=>{D=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},O=(e=>e?D(e):D)})))()}function Ce(e,t=j){let n=A.useSyncExternalStore(e.subscribe,A.useCallback(()=>t(e.getState()),[e,t]),A.useCallback(()=>t(e.getInitialState()),[e,t]));return A.useDebugValue(n),n}var A,j,M,we;function Te(){return(Te=t((()=>{A=e(n(),1),k(),j=e=>e,M=e=>{let t=O(e),n=e=>Ce(t,e);return Object.assign(n,t),n},we=(e=>e?M(e):M)})))()}function Ee(){try{return typeof window>`u`?null:window.localStorage}catch{return null}}function De(){return(De=t((()=>{})))()}function Oe(e){return typeof e==`string`&&F.includes(e)}function ke(e){try{let t=e?.getItem(P);return Oe(t)?t:`system`}catch{return`system`}}function Ae(e,t){try{t?.setItem(P,e)}catch{}}function N(e,t){return e===`system`?t?`dark`:`light`:e}var P,je,F;function Me(){return(Me=t((()=>{P=`tb-theme`,je=`(prefers-color-scheme: dark)`,F=[`system`,`light`,`dark`]})))()}function I(){return typeof window>`u`||typeof window.matchMedia!=`function`?!1:window.matchMedia(je).matches}var L,R;function Ne(){return(Ne=t((()=>{n(),Te(),De(),Me(),L=ke(Ee()),R=we((e,t)=>({preference:L,resolved:N(L,I()),setPreference:t=>{Ae(t,Ee()),e({preference:t,resolved:N(t,I())})},syncSystemPreference:()=>e({resolved:N(t().preference,I())})}))})))()}function Pe(){let e=R(e=>e.preference),t=R(e=>e.setPreference);return(0,Fe.jsx)(re,{value:e,onChange:t})}var Fe;function Ie(){return(Ie=t((()=>{Ne(),h(),Fe=a(),Pe.__docgenInfo={description:"Thin container for the appearance control: reads the preference from the theme store and writes\nthe user's choice straight back. There is no network and no local state, so everything worth\nasserting lives in ThemeToggleView's story; the DOM effects belong to `useThemeSync` in the root\nlayout, which is the single writer of the `.dark` class and the theme-color meta.",methods:[],displayName:`ThemeToggle`}})))()}function z({sections:e,userId:t,displayName:n,email:r,personalPhotoVersion:i,isPhotoSaving:a,photoErrorMessage:o,copyPhotoTeamName:s,onUploadPersonalPhoto:ee,onRemovePersonalPhoto:te,onCopyPhotoToTeam:l,onDismissCopyPhoto:ne,activeTeamName:u,member:d,positions:f=[],isMemberLoading:p,isMemberError:h,isSaving:re,memberErrorCode:ie,onSubmitProfile:oe,onLogout:se}){let v=t=>e.includes(t),[y,b]=(0,Le.useState)(!1);return(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Account`}),(0,B.jsxs)(`div`,{className:`mt-6 space-y-6`,children:[v(`email`)&&(0,B.jsxs)(`section`,{children:[(0,B.jsx)(_,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Account`}),(0,B.jsx)(`div`,{className:V,children:(0,B.jsxs)(`div`,{className:H,children:[(0,B.jsx)(S,{size:18,strokeWidth:1.9,className:W,"aria-hidden":`true`}),(0,B.jsx)(`span`,{className:`font-medium`,children:`Email`}),(0,B.jsx)(`span`,{className:`ml-auto min-w-0 truncate text-muted-foreground`,title:r,children:r})]})})]}),v(`photo`)&&(0,B.jsxs)(`section`,{children:[(0,B.jsx)(_,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Personal photo`}),(0,B.jsxs)(`div`,{className:`${V} p-4`,children:[(0,B.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,B.jsx)(me,{userId:t,name:n,size:`md`,photoUrl:i?ce(i):void 0}),(0,B.jsxs)(`div`,{className:`flex min-w-0 flex-col gap-2`,children:[(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Only you see this photo. A team shows the photo you choose for that team.`}),(0,B.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,B.jsx)(fe,{label:i?`Change photo`:`Upload photo`,disabled:a,onPicked:e=>ee?.(e)}),i&&(0,B.jsx)(g,{variant:`outline`,size:`sm`,disabled:a,onClick:()=>b(!0),children:`Remove photo`})]})]})]}),o&&(0,B.jsx)(`p`,{className:`mt-3 text-small text-red`,children:o}),(0,B.jsx)(ge,{open:y,title:`Remove photo`,description:`Your teams keep the photos they already use.`,confirmLabel:`Remove`,onConfirm:()=>{b(!1),te?.()},onCancel:()=>b(!1)}),s&&(0,B.jsxs)(`div`,{className:`mt-4 rounded-md bg-muted p-3`,children:[(0,B.jsxs)(`p`,{className:`text-small`,children:[`Use this photo in `,s,` too?`]}),(0,B.jsxs)(`div`,{className:`mt-2 flex gap-2`,children:[(0,B.jsxs)(g,{size:`sm`,disabled:a,onClick:l,children:[`Use in `,s]}),(0,B.jsx)(g,{size:`sm`,variant:`ghost`,onClick:ne,children:`Not now`})]})]})]})]}),v(`displayName`)&&(0,B.jsxs)(`section`,{children:[(0,B.jsx)(_,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Profile`}),(0,B.jsxs)(`div`,{className:`${V} p-4`,children:[p&&(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),h&&(0,B.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load your profile. Please try again.`}),!p&&!h&&d&&(0,B.jsx)(ue,{currentName:d.displayName,positions:f,currentPositionId:d.position?.id??null,isSaving:!!re,errorCode:ie,onSubmit:(e,t)=>oe?.(e,t)})]})]}),v(`teams`)&&(0,B.jsxs)(`section`,{children:[(0,B.jsx)(_,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Teams`}),(0,B.jsx)(`div`,{className:V,children:(0,B.jsxs)(c,{to:`/select-team`,className:U,children:[(0,B.jsx)(ae,{size:18,strokeWidth:1.9,className:W,"aria-hidden":`true`}),u?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:u}),(0,B.jsx)(`span`,{className:`ml-auto rounded-full bg-green/10 px-2 py-0.5 text-caption font-semibold text-green`,children:`Active`})]}):(0,B.jsx)(`span`,{className:`font-medium text-muted-foreground`,children:`Join or create a team`}),(0,B.jsx)(m,{size:16,className:`${u?`ml-3`:`ml-auto`} shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})})]}),v(`appearance`)&&(0,B.jsx)(`section`,{children:(0,B.jsx)(Pe,{})}),v(`platformAdmin`)&&(0,B.jsxs)(`section`,{children:[(0,B.jsx)(_,{as:`h3`,className:`mb-2 px-1 text-small`,children:`Platform admin`}),(0,B.jsx)(`div`,{className:V,children:(0,B.jsxs)(`div`,{className:`divide-y divide-border`,children:[(0,B.jsxs)(c,{to:`/admin/teams`,className:U,children:[(0,B.jsx)(T,{size:18,strokeWidth:1.9,className:W,"aria-hidden":`true`}),(0,B.jsx)(`span`,{className:`font-medium`,children:`Teams console`}),(0,B.jsx)(m,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]}),(0,B.jsxs)(c,{to:`/admin/creation-codes`,className:U,children:[(0,B.jsx)(ve,{size:18,strokeWidth:1.9,className:W,"aria-hidden":`true`}),(0,B.jsx)(`span`,{className:`font-medium`,children:`Creation codes`}),(0,B.jsx)(m,{size:16,className:`ml-auto shrink-0 text-muted-foreground/60`,"aria-hidden":`true`})]})]})})]}),(0,B.jsx)(`div`,{className:V,children:(0,B.jsxs)(`button`,{type:`button`,onClick:se,className:`${U} font-semibold text-red hover:bg-red/5`,children:[(0,B.jsx)(xe,{size:18,strokeWidth:1.9,className:`shrink-0 text-red`,"aria-hidden":`true`}),`Log out`]})})]})]})}var Le,B,V,H,U,W;function Re(){return(Re=t((()=>{Le=n(),ee(),p(),ye(),Se(),C(),E(),ie(),b(),le(),de(),Ie(),pe(),oe(),he(),se(),B=a(),V=`overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]`,H=`flex items-center gap-3 px-4 py-3 text-small`,U=`${H} w-full text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50`,W=`shrink-0 text-muted-foreground`,z.__docgenInfo={description:`The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
reads the session and the member profile; this renders the sections it is handed as a grouped
settings list of cards, following the concept prototype: iconed rows, right-aligned muted values,
an Active badge on the team, and Log out as its own red row.

**Log out is rendered unconditionally**, in its own trailing card outside every other section —
including the profile loading/error shells — because it acts on the session, not on any data that
might still be loading. A failed member fetch can never hide it. That invariant is the whole point
of the ADR, and every story asserts it.`,methods:[],displayName:`AccountView`,props:{sections:{required:!0,tsType:{name:`Array`,elements:[{name:`union`,raw:`| 'email'
| 'photo'
| 'displayName'
| 'position'
| 'appearance'
| 'teams'
| 'platformAdmin'
| 'logout'`,elements:[{name:`literal`,value:`'email'`},{name:`literal`,value:`'photo'`},{name:`literal`,value:`'displayName'`},{name:`literal`,value:`'position'`},{name:`literal`,value:`'appearance'`},{name:`literal`,value:`'teams'`},{name:`literal`,value:`'platformAdmin'`},{name:`literal`,value:`'logout'`}]}],raw:`AccountSection[]`},description:`The visible sections for this session, from {@link accountSections}. Drives which rows render.`},userId:{required:!0,tsType:{name:`string`},description:``},displayName:{required:!0,tsType:{name:`string`},description:`The platform name, for the initials when there is no Personal Photo.`},email:{required:!0,tsType:{name:`string`},description:``},personalPhotoVersion:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The caller's own Personal Photo (ADR-0038); null when they have none.`},isPhotoSaving:{required:!1,tsType:{name:`boolean`},description:``},photoErrorMessage:{required:!1,tsType:{name:`string`},description:``},copyPhotoTeamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Set right after a Personal Photo upload while the Active Team has no Team Photo: the one moment
the tab offers to copy it into that Team (ADR-0038). Null hides the offer.`},onUploadPersonalPhoto:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(photo: Blob) => void`,signature:{arguments:[{type:{name:`Blob`},name:`photo`}],return:{name:`void`}}},description:``},onRemovePersonalPhoto:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCopyPhotoToTeam:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onDismissCopyPhoto:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},activeTeamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Active Team's name, or null when there is none (teamless).`},member:{required:!1,tsType:{name:`union`,raw:`Member | null`,elements:[{name:`Member`},{name:`null`}]},description:`The current member — only present (and only fetched) when there is an Active Team.`},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The Active Team's position vocabulary; empty hides the position picker.`,defaultValue:{value:`[]`,computed:!1}},isMemberLoading:{required:!1,tsType:{name:`boolean`},description:`The member-profile query is in flight. Shows the profile shell — Log out stays rendered.`},isMemberError:{required:!1,tsType:{name:`boolean`},description:`The member-profile query failed. Shows the error shell — Log out stays rendered.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},memberErrorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update mutation (e.g. NAME_TAKEN), shown inline.`},onSubmitProfile:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onLogout:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var G,K,q,J,Y,ze,Be,Ve,He,Ue,X,We,Z,Q,$,Ge;function Ke(){return(Ke=t((()=>{o(),ne(),l(),y(),i(),Re(),G=a(),{expect:K,fn:q,screen:J,within:Y}=__STORYBOOK_MODULE_TEST__,ze=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],Be={userId:`u1`,displayName:`Alex`,role:`MEMBER`,position:{id:`p1`,label:`Setter`},onboarded:!0,shirtNumber:void 0,photoVersion:void 0},Ve=[`email`,`photo`,`displayName`,`position`,`appearance`,`teams`,`logout`],He=[`email`,`photo`,`appearance`,`teams`,`logout`],Ue=[`email`,`photo`,`appearance`,`teams`,`platformAdmin`,`logout`],X=v(`account`),We={title:`features/account/AccountView`,component:z,parameters:X.parameters,args:{userId:`u1`,displayName:`Alex`,email:`alex@example.com`,sections:Ve,member:Be,positions:ze,activeTeamName:`Setpoint VT`,onLogout:q(),onSubmitProfile:q(),onUploadPersonalPhoto:q(),onRemovePersonalPhoto:q(),onCopyPhotoToTeam:q(),onDismissCopyPhoto:q()}},Z={decorators:X.decorators,parameters:{chromatic:{modes:r}},play:async({canvas:e})=>{await K(e.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(e.getByLabelText(`Display name`)).toHaveValue(`Alex`),await K(e.getAllByText(`Setpoint VT`)).toHaveLength(2),await K(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`)}},Q={decorators:[...u.decorators,te],render:e=>(0,G.jsx)(s,{items:{Teamless:(0,G.jsx)(z,{...e,sections:He,member:null,positions:[],activeTeamName:null}),"Multi-team":(0,G.jsx)(z,{...e,activeTeamName:`Tovo Heren`}),"Platform admin":(0,G.jsx)(z,{...e,sections:Ue,member:null,activeTeamName:null}),Loading:(0,G.jsx)(z,{...e,member:null,isMemberLoading:!0}),Error:(0,G.jsx)(z,{...e,member:null,isMemberError:!0}),"Photo copy offer":(0,G.jsx)(z,{...e,personalPhotoVersion:`v1`,copyPhotoTeamName:`Setpoint VT`}),"Photo upload failed":(0,G.jsx)(z,{...e,photoErrorMessage:`That photo is too large. Please pick another one.`})}}),play:async({canvas:e})=>{let t=t=>Y(e.getByRole(`region`,{name:t})),n=t(`Teamless`);await K(n.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(n.queryByLabelText(`Display name`)).not.toBeInTheDocument(),await K(n.getByText(`Join or create a team`)).toBeInTheDocument(),await K(t(`Multi-team`).getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(t(`Multi-team`).getByText(`Tovo Heren`)).toBeInTheDocument();let r=t(`Platform admin`);await K(r.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(r.getByRole(`link`,{name:`Teams console`})).toHaveAttribute(`href`,`/admin/teams`),await K(r.getByRole(`link`,{name:`Creation codes`})).toHaveAttribute(`href`,`/admin/creation-codes`);let i=t(`Loading`);await K(i.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(i.getByText(`Loading…`)).toBeInTheDocument(),await K(i.queryByLabelText(`Display name`)).not.toBeInTheDocument();let a=t(`Error`);await K(a.getByRole(`button`,{name:`Log out`})).toBeInTheDocument(),await K(a.getByText(`Couldn't load your profile. Please try again.`)).toBeInTheDocument(),await K(a.queryByLabelText(`Display name`)).not.toBeInTheDocument(),await K(n.getByRole(`button`,{name:`Upload photo`})).toBeInTheDocument(),await K(n.queryByRole(`button`,{name:`Remove photo`})).not.toBeInTheDocument();let o=t(`Photo copy offer`);await K(o.getByText(`Use this photo in Setpoint VT too?`)).toBeInTheDocument(),await K(o.getByRole(`button`,{name:`Change photo`})).toBeInTheDocument(),await K(o.getByRole(`button`,{name:`Remove photo`})).toBeInTheDocument(),await K(t(`Photo upload failed`).getByText(`That photo is too large. Please pick another one.`)).toBeInTheDocument(),await K(t(`Photo upload failed`).queryByText(/Use this photo in/)).not.toBeInTheDocument()}},$={decorators:X.decorators,parameters:{chromatic:{disableSnapshot:!0}},args:{personalPhotoVersion:`v1`,copyPhotoTeamName:`Setpoint VT`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Use in Setpoint VT`})),await K(n.onCopyPhotoToTeam).toHaveBeenCalledOnce(),await t.click(e.getByRole(`button`,{name:`Not now`})),await K(n.onDismissCopyPhoto).toHaveBeenCalledOnce(),await t.click(e.getByRole(`button`,{name:`Remove photo`})),await t.click(Y(await J.findByRole(`dialog`)).getByRole(`button`,{name:`Cancel`})),await K(n.onRemovePersonalPhoto).not.toHaveBeenCalled(),await t.click(e.getByRole(`button`,{name:`Remove photo`})),await t.click(Y(await J.findByRole(`dialog`)).getByRole(`button`,{name:`Remove`})),await K(n.onRemovePersonalPhoto).toHaveBeenCalledOnce();let r=e.getByLabelText(`Display name`);await t.clear(r),await t.type(r,`Alex B`),await t.click(e.getByRole(`button`,{name:`Save`})),await K(n.onSubmitProfile).toHaveBeenCalledWith(`Alex B`,`p1`),await t.click(e.getByRole(`button`,{name:`Log out`})),await K(n.onLogout).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
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
  decorators: [...appColumn.decorators, withRouter],
  render: args => <Stack items={{
    Teamless: <AccountView {...args} sections={TEAMLESS} member={null} positions={[]} activeTeamName={null} />,
    'Multi-team': <AccountView {...args} activeTeamName="Tovo Heren" />,
    'Platform admin': <AccountView {...args} sections={ADMIN} member={null} activeTeamName={null} />,
    Loading: <AccountView {...args} member={null} isMemberLoading />,
    Error: <AccountView {...args} member={null} isMemberError />,
    // Just uploaded a Personal Photo while this Team has no Team Photo. (No network in stories,
    // so the photo falls back to initials.)
    'Photo copy offer': <AccountView {...args} personalPhotoVersion="v1" copyPhotoTeamName="Setpoint VT" />,
    'Photo upload failed': <AccountView {...args} photoErrorMessage="That photo is too large. Please pick another one." />
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

    // The Personal Photo is the person's, so it is offered without a team too.
    await expect(teamless.getByRole('button', {
      name: 'Upload photo'
    })).toBeInTheDocument();
    await expect(teamless.queryByRole('button', {
      name: 'Remove photo'
    })).not.toBeInTheDocument();
    const offer = region('Photo copy offer');
    await expect(offer.getByText('Use this photo in Setpoint VT too?')).toBeInTheDocument();
    await expect(offer.getByRole('button', {
      name: 'Change photo'
    })).toBeInTheDocument();
    await expect(offer.getByRole('button', {
      name: 'Remove photo'
    })).toBeInTheDocument();
    await expect(region('Photo upload failed').getByText('That photo is too large. Please pick another one.')).toBeInTheDocument();
    await expect(region('Photo upload failed').queryByText(/Use this photo in/)).not.toBeInTheDocument();
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    personalPhotoVersion: 'v1',
    copyPhotoTeamName: 'Setpoint VT'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Use in Setpoint VT'
    }));
    await expect(args.onCopyPhotoToTeam).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Not now'
    }));
    await expect(args.onDismissCopyPhoto).toHaveBeenCalledOnce();
    // Removing asks first; Cancel leaves the photo alone.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Remove photo'
    }));
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onRemovePersonalPhoto).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Remove photo'
    }));
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemovePersonalPhoto).toHaveBeenCalledOnce();

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
}`,...$.parameters?.docs?.source}}},Ge=[`Data`,`Shells`,`Interactions`]})))()}Ke();export{Z as Data,$ as Interactions,Q as Shells,Ge as __namedExportsOrder,We as default};