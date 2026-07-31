import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-BQGF7wv-.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{i,n as a,r as o,t as s}from"./input-BGX2Mu-C.js";import{n as c,t as l}from"./PositionPicker-B6F6PC5t.js";import{a as u,i as d,n as f,o as p,r as m,s as h,t as g}from"./dialog-VaQ9pT0r.js";function _(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}var v=e((()=>{}));function y({members:e,positions:t,savingUserId:n,errorMessage:r,onRename:i,onToggleRole:a,onChangePosition:s,onRemove:c}){let[l,h]=(0,x.useState)(null);return(0,S.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[r&&(0,S.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red-50 px-3 py-2 text-sm text-red-600`,children:r}),(0,S.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,S.jsx)(b,{member:r,positions:t,lastAdmin:_(e,r.userId),isSaving:n===r.userId,onRename:i,onToggleRole:a,onChangePosition:s,onRequestRemove:h},r.userId))}),(0,S.jsx)(g,{open:l!==null,onOpenChange:e=>{e||h(null)},children:(0,S.jsxs)(f,{children:[(0,S.jsxs)(u,{children:[(0,S.jsx)(p,{children:`Remove member`}),(0,S.jsxs)(m,{children:[`Remove `,l?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,S.jsxs)(d,{children:[(0,S.jsx)(o,{variant:`outline`,onClick:()=>h(null),children:`Cancel`}),(0,S.jsx)(o,{variant:`destructive`,onClick:()=>{l&&c(l),h(null)},children:`Remove`})]})]})})]})}function b({member:e,positions:t,lastAdmin:n,isSaving:r,onRename:i,onToggleRole:a,onChangePosition:c,onRequestRemove:u}){let[d,f]=(0,x.useState)(e.displayName),p=e.role===`ADMIN`,m=d.trim().length>0&&d.trim()!==e.displayName,h=n?`This is the last admin — the team must keep at least one.`:void 0;return(0,S.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,S.jsx)(s,{"aria-label":`Display name for ${e.displayName}`,value:d,onChange:e=>f(e.target.value),className:`w-40`}),m&&(0,S.jsx)(o,{size:`sm`,disabled:r,onClick:()=>i(e.userId,d.trim()),children:r?`Saving...`:`Save`}),t.length>0?(0,S.jsx)(`div`,{className:`w-44`,children:(0,S.jsx)(l,{"aria-label":`Position for ${e.displayName}`,positions:t,value:e.position?.id??null,includeUnassigned:!0,disabled:r,onChange:t=>c(e,t)})}):(0,S.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),(0,S.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,p?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role}),(0,S.jsx)(o,{variant:`outline`,size:`sm`,disabled:r,title:p?h:void 0,onClick:()=>a(e),children:p?`Make member`:`Make admin`}),(0,S.jsx)(o,{variant:`destructive`,size:`sm`,disabled:r,title:h,onClick:()=>u(e),children:`Remove`})]})}var x,S,C=e((()=>{x=t(n(),1),c(),i(),a(),h(),v(),S=r(),y.__docgenInfo={description:`Presentational admin roster. Owns only local view state (per-row name edits + the remove-confirm
dialog target); the queries and mutations live in the MemberRoster container. Props-only, so
every state (roster, confirm dialog open, last-admin refusal) renders as a story.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!0,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})),w,T,E,D,O,k,A,j,M,N,P,F;e((()=>{C(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],O=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:D[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:D[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],k={title:`features/manage-members/MemberRosterView`,component:y,args:{members:O,positions:D,onRename:T(),onToggleRole:T(),onChangePosition:T(),onRemove:T()}},A={play:async({canvas:e})=>{await w(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await w(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await w(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await w(E(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await w(E(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},j={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=E(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await w(n.onChangePosition).toHaveBeenCalledWith(O[1],`p2`)}},M={args:{positions:[]},play:async({canvas:e})=>{await w(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await w(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},N={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=E(document.body);await w(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await w(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},P={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await w(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace');
    // Two admins can be demoted, two users can be promoted.
    await expect(canvas.getAllByRole('button', {
      name: 'Make member'
    })).toHaveLength(2);
    await expect(canvas.getAllByRole('button', {
      name: 'Make admin'
    })).toHaveLength(2);
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument();
    await expect(within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'));
    const listbox = within(document.body);
    await userEvent.click(await listbox.findByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2');
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    positions: []
  },
  play: async ({
    canvas
  }) => {
    // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
    await expect(canvas.queryByLabelText('Position for Ada Lovelace')).not.toBeInTheDocument();
    await expect(canvas.getAllByText('Unassigned').length).toBeGreaterThan(0);
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    // Alan Turing is the third row; his Remove button opens the confirm dialog (a portal).
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Remove'
    })[2]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    members: [{
      userId: 'u1',
      displayName: 'Ada Lovelace',
      role: 'ADMIN',
      position: undefined,
      onboarded: true
    }, {
      userId: 'u3',
      displayName: 'Alan Turing',
      role: 'USER',
      position: undefined,
      onboarded: true
    }],
    errorMessage: 'A team must keep at least one admin.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('A team must keep at least one admin.');
  }
}`,...P.parameters?.docs?.source}}},F=[`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`LastAdminRefused`]}))();export{j as ChangePosition,A as Default,P as LastAdminRefused,M as NoPositionsDefined,N as RemoveConfirmOpen,F as __namedExportsOrder,k as default};