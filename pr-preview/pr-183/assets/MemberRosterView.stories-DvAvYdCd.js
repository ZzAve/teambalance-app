import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CS9FsY6a.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-CDRpsyaL.js";import{n as a,t as o}from"./input-BvV3IkdQ.js";import{n as s,t as c}from"./PositionPicker-WNiBCR6G.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-lsPZlIbV.js";function g(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}function _({members:e=[],canManage:t,positions:n,isLoading:r,isError:a,savingUserId:o,errorMessage:s,onRename:c,onToggleRole:m,onChangePosition:_,onRemove:x}){let[S,C]=(0,y.useState)(null);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Members`}),r&&(0,b.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),a&&(0,b.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load members. Please try again.`}),!r&&!a&&(0,b.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[s&&(0,b.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red-50 px-3 py-2 text-sm text-red-600`,children:s}),(0,b.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,b.jsx)(v,{member:r,canManage:t,positions:n,lastAdmin:g(e,r.userId),isSaving:o===r.userId,onRename:c,onToggleRole:m,onChangePosition:_,onRequestRemove:C},r.userId))}),(0,b.jsx)(h,{open:S!==null,onOpenChange:e=>{e||C(null)},children:(0,b.jsxs)(d,{children:[(0,b.jsxs)(l,{children:[(0,b.jsx)(f,{children:`Remove member`}),(0,b.jsxs)(p,{children:[`Remove `,S?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,b.jsxs)(u,{children:[(0,b.jsx)(i,{variant:`outline`,onClick:()=>C(null),children:`Cancel`}),(0,b.jsx)(i,{variant:`destructive`,onClick:()=>{S&&x(S),C(null)},children:`Remove`})]})]})})]})]})}function v({member:e,canManage:t,positions:n,lastAdmin:r,isSaving:a,onRename:s,onToggleRole:l,onChangePosition:u,onRequestRemove:d}){let[f,p]=(0,y.useState)(e.displayName),m=e.role===`ADMIN`,h=f.trim().length>0&&f.trim()!==e.displayName,g=r?`This is the last admin — the team must keep at least one.`:void 0,_=(0,b.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,m?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role});return t?(0,b.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,b.jsx)(o,{"aria-label":`Display name for ${e.displayName}`,value:f,onChange:e=>p(e.target.value),className:`w-40`}),h&&(0,b.jsx)(i,{size:`sm`,disabled:a,onClick:()=>s(e.userId,f.trim()),children:a?`Saving...`:`Save`}),n.length>0?(0,b.jsx)(`div`,{className:`w-44`,children:(0,b.jsx)(c,{"aria-label":`Position for ${e.displayName}`,positions:n,value:e.position?.id??null,includeUnassigned:!0,disabled:a,onChange:t=>u(e,t)})}):(0,b.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),_,(0,b.jsx)(i,{variant:`outline`,size:`sm`,disabled:a,title:m?g:void 0,onClick:()=>l(e),children:m?`Make member`:`Make admin`}),(0,b.jsx)(i,{variant:`destructive`,size:`sm`,disabled:a,title:g,onClick:()=>d(e),children:`Remove`})]}):(0,b.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,b.jsx)(`span`,{className:`w-40 font-medium`,children:e.displayName}),(0,b.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),_]})}var y,b;function x(){return(x=e((()=>{y=t(),s(),r(),a(),m(),b=n(),_.__docgenInfo={description:`Presentational admin roster — the complete section, heading and all. Owns only local view state
(per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
MemberRoster container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!1,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``,defaultValue:{value:`[]`,computed:!1}},canManage:{required:!0,tsType:{name:`boolean`},description:"Admin capability. `true` renders the full per-row controls (rename, role toggle, position\npicker, remove); `false` renders read-only rows — every authenticated member sees the roster,\nonly admins can edit it."},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The members query is in flight — render the loading shell instead of the roster.`},isError:{required:!1,tsType:{name:`boolean`},description:`The members query failed — render the error shell instead of the roster.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})))()}var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{x(),{expect:S,fn:C,within:w}=__STORYBOOK_MODULE_TEST__,T=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],E=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:T[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:T[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],D={title:`features/manage-members/MemberRosterView`,component:_,args:{canManage:!0,members:E,positions:T,onRename:C(),onToggleRole:C(),onChangePosition:C(),onRemove:C()}},O={args:{isLoading:!0},play:async({canvas:e})=>{await S(e.getByText(`Loading…`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},k={args:{isError:!0},play:async({canvas:e})=>{await S(e.getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},A={play:async({canvas:e})=>{await S(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await S(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await S(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await S(w(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await S(w(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},j={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=w(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await S(n.onChangePosition).toHaveBeenCalledWith(E[1],`p2`)}},M={args:{positions:[]},play:async({canvas:e})=>{await S(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await S(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},N={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=w(document.body);await S(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await S(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},P={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name for Grace Hopper`);await t.clear(r),await t.type(r,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await S(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`)}},F={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Make member`})[0]),await S(n.onToggleRole).toHaveBeenCalledWith(E[0])}},I={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[0]);let r=w(document.body);await S(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await S(n.onRemove).toHaveBeenCalledWith(E[0])}},L={args:{canManage:!1},play:async({canvas:e})=>{await S(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await S(e.getByText(`Libero`)).toBeInTheDocument(),await S(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await S(e.queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await S(e.getAllByText(`ADMIN`)).toHaveLength(2),await S(e.getAllByText(`USER`)).toHaveLength(2),await S(e.queryByRole(`button`,{name:`Save`})).not.toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},R={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await S(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    canManage: false
  },
  play: async ({
    canvas
  }) => {
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z=[`Loading`,`ErrorState`,`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`RenameMember`,`ToggleRole`,`RemoveMember`,`ReadOnly`,`LastAdminRefused`]})))()}B();export{j as ChangePosition,A as Default,k as ErrorState,R as LastAdminRefused,O as Loading,M as NoPositionsDefined,L as ReadOnly,N as RemoveConfirmOpen,I as RemoveMember,P as RenameMember,F as ToggleRole,z as __namedExportsOrder,D as default};