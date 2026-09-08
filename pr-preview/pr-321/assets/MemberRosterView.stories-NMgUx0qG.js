import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Bm8Em6Hf.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-60v0M0cu.js";import{n as a,t as o}from"./input-BZ0ahZR6.js";import{n as s,t as c}from"./PositionPicker-DkbMPMaM.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-CXi4oS3w.js";import{n as g,t as _}from"./avatar-vgaxelzA.js";function v(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}function y({members:e=[],canManage:t,positions:n,isLoading:r,isError:a,savingUserId:o,errorMessage:s,onRename:c,onToggleRole:m,onChangePosition:g,onRemove:_}){let[y,C]=(0,x.useState)(null);return(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Members`}),r&&(0,S.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),a&&(0,S.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load members. Please try again.`}),!r&&!a&&(0,S.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[s&&(0,S.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red/10 px-3 py-2 text-sm text-red`,children:s}),e.length===0?(0,S.jsx)(`p`,{className:`rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground`,children:t?`No members yet. Share an invite link to bring people in.`:`No members yet.`}):(0,S.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,S.jsx)(b,{member:r,canManage:t,positions:n,lastAdmin:v(e,r.userId),isSaving:o===r.userId,onRename:c,onToggleRole:m,onChangePosition:g,onRequestRemove:C},r.userId))}),(0,S.jsx)(h,{open:y!==null,onOpenChange:e=>{e||C(null)},children:(0,S.jsxs)(d,{children:[(0,S.jsxs)(l,{children:[(0,S.jsx)(f,{children:`Remove member`}),(0,S.jsxs)(p,{children:[`Remove `,y?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,S.jsxs)(u,{children:[(0,S.jsx)(i,{variant:`outline`,onClick:()=>C(null),children:`Cancel`}),(0,S.jsx)(i,{variant:`destructive`,onClick:()=>{y&&_(y),C(null)},children:`Remove`})]})]})})]})]})}function b({member:e,canManage:t,positions:n,lastAdmin:r,isSaving:a,onRename:s,onToggleRole:l,onChangePosition:u,onRequestRemove:d}){let[f,p]=(0,x.useState)(e.displayName),m=e.role===`ADMIN`,h=f.trim().length>0&&f.trim()!==e.displayName,g=r?`This is the last admin — the team must keep at least one.`:void 0,v=(0,S.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,m?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role});return t?(0,S.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,S.jsx)(_,{userId:e.userId,name:e.displayName}),(0,S.jsx)(o,{"aria-label":`Display name for ${e.displayName}`,value:f,onChange:e=>p(e.target.value),className:`w-40`}),h&&(0,S.jsx)(i,{size:`sm`,disabled:a,onClick:()=>s(e.userId,f.trim()),children:a?`Saving...`:`Save`}),n.length>0?(0,S.jsx)(`div`,{className:`w-44`,children:(0,S.jsx)(c,{"aria-label":`Position for ${e.displayName}`,positions:n,value:e.position?.id??null,includeUnassigned:!0,disabled:a,onChange:t=>u(e,t)})}):(0,S.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),v,(0,S.jsx)(i,{variant:`outline`,size:`sm`,disabled:a,title:m?g:void 0,onClick:()=>l(e),children:m?`Make member`:`Make admin`}),(0,S.jsx)(i,{variant:`destructive`,size:`sm`,disabled:a,title:g,onClick:()=>d(e),children:`Remove`})]}):(0,S.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,S.jsx)(_,{userId:e.userId,name:e.displayName}),(0,S.jsx)(`span`,{className:`w-40 font-medium`,children:e.displayName}),(0,S.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),v]})}var x,S;function C(){return(C=e((()=>{x=t(),s(),g(),r(),a(),m(),S=n(),y.__docgenInfo={description:`Presentational admin roster — the complete section, heading and all. Owns only local view state
(per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
MemberRoster container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!1,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``,defaultValue:{value:`[]`,computed:!1}},canManage:{required:!0,tsType:{name:`boolean`},description:"Admin capability. `true` renders the full per-row controls (rename, role toggle, position\npicker, remove); `false` renders read-only rows — every authenticated member sees the roster,\nonly admins can edit it."},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The members query is in flight — render the loading shell instead of the roster.`},isError:{required:!1,tsType:{name:`boolean`},description:`The members query failed — render the error shell instead of the roster.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{C(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],O=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:D[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:D[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],k={title:`features/manage-members/MemberRosterView`,component:y,args:{canManage:!0,members:O,positions:D,onRename:T(),onToggleRole:T(),onChangePosition:T(),onRemove:T()}},A={args:{isLoading:!0},play:async({canvas:e})=>{await w(e.getByText(`Loading…`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},j={args:{isError:!0},play:async({canvas:e})=>{await w(e.getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},M={play:async({canvas:e})=>{await w(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await w(e.getByText(`GH`)).toBeInTheDocument(),await w(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await w(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await w(E(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await w(E(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},N={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=E(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await w(n.onChangePosition).toHaveBeenCalledWith(O[1],`p2`)}},P={args:{positions:[]},play:async({canvas:e})=>{await w(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await w(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},F={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=E(document.body);await w(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await w(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},I={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name for Grace Hopper`);await t.clear(r),await t.type(r,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await w(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`)}},L={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Make member`})[0]),await w(n.onToggleRole).toHaveBeenCalledWith(O[0])}},R={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[0]);let r=E(document.body);await w(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await w(n.onRemove).toHaveBeenCalledWith(O[0])}},z={args:{canManage:!1},play:async({canvas:e})=>{await w(e.getByText(`AL`)).toBeInTheDocument(),await w(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await w(e.getByText(`Libero`)).toBeInTheDocument(),await w(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await w(e.queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await w(e.getAllByText(`ADMIN`)).toHaveLength(2),await w(e.getAllByText(`USER`)).toHaveLength(2),await w(e.queryByRole(`button`,{name:`Save`})).not.toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},B={args:{members:[]},play:async({canvas:e})=>{await w(e.getByText(`No members yet. Share an invite link to bring people in.`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},V={args:{members:[],canManage:!1},play:async({canvas:e})=>{await w(e.getByText(`No members yet.`)).toBeInTheDocument(),await w(e.queryByText(`No members yet. Share an invite link to bring people in.`)).not.toBeInTheDocument()}},H={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await w(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load members. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace');
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument();
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — the controlled select closes back to the roster picture
  // (ADR-0027 §2).
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
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'));
    const listbox = within(document.body);
    await userEvent.click(await listbox.findByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2');
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const field = canvas.getByLabelText('Display name for Grace Hopper');
    await userEvent.clear(field);
    await userEvent.type(field, 'Grace M. Hopper');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper');
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — onToggleRole fires while the roster picture is unchanged
  // (ADR-0027 §2).
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Make member'
    })[0]);
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — the confirm dialog closes on confirm and settles back to the
  // roster picture; RemoveConfirmOpen holds the open-dialog baseline (ADR-0027 §2).
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Remove'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    canManage: false
  },
  play: async ({
    canvas
  }) => {
    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(canvas.getByText('AL')).toBeInTheDocument();
    // Names and positions are plain text — no rename input, no position picker.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(canvas.getByText('Libero')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument();
    // The role/admin badge stays visible to everyone.
    await expect(canvas.getAllByText('ADMIN')).toHaveLength(2);
    await expect(canvas.getAllByText('USER')).toHaveLength(2);
    // None of the admin actions render.
    await expect(canvas.queryByRole('button', {
      name: 'Save'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Make member'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Make admin'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    members: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No members yet. Share an invite link to bring people in.')).toBeInTheDocument();
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    members: [],
    canManage: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No members yet.')).toBeInTheDocument();
    await expect(canvas.queryByText('No members yet. Share an invite link to bring people in.')).not.toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U=[`Loading`,`ErrorState`,`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`RenameMember`,`ToggleRole`,`RemoveMember`,`ReadOnly`,`EmptyManaged`,`EmptyReadOnly`,`LastAdminRefused`]})))()}W();export{N as ChangePosition,M as Default,B as EmptyManaged,V as EmptyReadOnly,j as ErrorState,H as LastAdminRefused,A as Loading,P as NoPositionsDefined,z as ReadOnly,F as RemoveConfirmOpen,R as RemoveMember,I as RenameMember,L as ToggleRole,U as __namedExportsOrder,k as default};