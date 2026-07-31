import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-7ra-rxTo.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{i as r,n as i,r as a,t as o}from"./input-DSfQ-uEk.js";import{n as s,t as c}from"./PositionPicker-B6Ee9jzd.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-CcZSRYSQ.js";function g(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}function _({members:e,positions:t,savingUserId:n,errorMessage:r,onRename:i,onToggleRole:o,onChangePosition:s,onRemove:c}){let[m,_]=(0,y.useState)(null);return(0,b.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[r&&(0,b.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red-50 px-3 py-2 text-sm text-red-600`,children:r}),(0,b.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,b.jsx)(v,{member:r,positions:t,lastAdmin:g(e,r.userId),isSaving:n===r.userId,onRename:i,onToggleRole:o,onChangePosition:s,onRequestRemove:_},r.userId))}),(0,b.jsx)(h,{open:m!==null,onOpenChange:e=>{e||_(null)},children:(0,b.jsxs)(d,{children:[(0,b.jsxs)(l,{children:[(0,b.jsx)(f,{children:`Remove member`}),(0,b.jsxs)(p,{children:[`Remove `,m?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,b.jsxs)(u,{children:[(0,b.jsx)(a,{variant:`outline`,onClick:()=>_(null),children:`Cancel`}),(0,b.jsx)(a,{variant:`destructive`,onClick:()=>{m&&c(m),_(null)},children:`Remove`})]})]})})]})}function v({member:e,positions:t,lastAdmin:n,isSaving:r,onRename:i,onToggleRole:s,onChangePosition:l,onRequestRemove:u}){let[d,f]=(0,y.useState)(e.displayName),p=e.role===`ADMIN`,m=d.trim().length>0&&d.trim()!==e.displayName,h=n?`This is the last admin — the team must keep at least one.`:void 0;return(0,b.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,b.jsx)(o,{"aria-label":`Display name for ${e.displayName}`,value:d,onChange:e=>f(e.target.value),className:`w-40`}),m&&(0,b.jsx)(a,{size:`sm`,disabled:r,onClick:()=>i(e.userId,d.trim()),children:r?`Saving...`:`Save`}),t.length>0?(0,b.jsx)(`div`,{className:`w-44`,children:(0,b.jsx)(c,{"aria-label":`Position for ${e.displayName}`,positions:t,value:e.position?.id??null,includeUnassigned:!0,disabled:r,onChange:t=>l(e,t)})}):(0,b.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),(0,b.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,p?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role}),(0,b.jsx)(a,{variant:`outline`,size:`sm`,disabled:r,title:p?h:void 0,onClick:()=>s(e),children:p?`Make member`:`Make admin`}),(0,b.jsx)(a,{variant:`destructive`,size:`sm`,disabled:r,title:h,onClick:()=>u(e),children:`Remove`})]})}var y,b;function x(){return(x=e((()=>{y=t(),s(),r(),i(),m(),b=n(),_.__docgenInfo={description:`Presentational admin roster. Owns only local view state (per-row name edits + the remove-confirm
dialog target); the queries and mutations live in the MemberRoster container. Props-only, so
every state (roster, confirm dialog open, last-admin refusal) renders as a story.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!0,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})))()}var S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{x(),{expect:S,fn:C,within:w}=__STORYBOOK_MODULE_TEST__,T=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],E=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:T[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:T[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],D={title:`features/manage-members/MemberRosterView`,component:_,args:{members:E,positions:T,onRename:C(),onToggleRole:C(),onChangePosition:C(),onRemove:C()}},O={play:async({canvas:e})=>{await S(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await S(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await S(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await S(w(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await S(w(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},k={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=w(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await S(n.onChangePosition).toHaveBeenCalledWith(E[1],`p2`)}},A={args:{positions:[]},play:async({canvas:e})=>{await S(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await S(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},j={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=w(document.body);await S(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await S(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},M={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await S(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N=[`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`LastAdminRefused`]})))()}P();export{k as ChangePosition,O as Default,M as LastAdminRefused,A as NoPositionsDefined,j as RemoveConfirmOpen,N as __namedExportsOrder,D as default};