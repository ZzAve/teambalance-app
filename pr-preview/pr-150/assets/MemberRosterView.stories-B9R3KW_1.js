import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-MJ8FevkI.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{i,n as a,r as o,t as s}from"./input-n3IZEKWy.js";import{n as c,t as l}from"./PositionPicker-DVrrFDP6.js";import{a as u,i as d,n as f,o as p,r as m,s as h,t as g}from"./dialog-BW8YWmAF.js";function _(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}var v=e((()=>{}));function y({members:e=[],positions:t,isLoading:n,isError:r,savingUserId:i,errorMessage:a,onRename:s,onToggleRole:c,onChangePosition:l,onRemove:h}){let[v,y]=(0,x.useState)(null);return(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Members`}),n&&(0,S.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,S.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load members. Please try again.`}),!n&&!r&&(0,S.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,S.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red-50 px-3 py-2 text-sm text-red-600`,children:a}),(0,S.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(n=>(0,S.jsx)(b,{member:n,positions:t,lastAdmin:_(e,n.userId),isSaving:i===n.userId,onRename:s,onToggleRole:c,onChangePosition:l,onRequestRemove:y},n.userId))}),(0,S.jsx)(g,{open:v!==null,onOpenChange:e=>{e||y(null)},children:(0,S.jsxs)(f,{children:[(0,S.jsxs)(u,{children:[(0,S.jsx)(p,{children:`Remove member`}),(0,S.jsxs)(m,{children:[`Remove `,v?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,S.jsxs)(d,{children:[(0,S.jsx)(o,{variant:`outline`,onClick:()=>y(null),children:`Cancel`}),(0,S.jsx)(o,{variant:`destructive`,onClick:()=>{v&&h(v),y(null)},children:`Remove`})]})]})})]})]})}function b({member:e,positions:t,lastAdmin:n,isSaving:r,onRename:i,onToggleRole:a,onChangePosition:c,onRequestRemove:u}){let[d,f]=(0,x.useState)(e.displayName),p=e.role===`ADMIN`,m=d.trim().length>0&&d.trim()!==e.displayName,h=n?`This is the last admin — the team must keep at least one.`:void 0;return(0,S.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,S.jsx)(s,{"aria-label":`Display name for ${e.displayName}`,value:d,onChange:e=>f(e.target.value),className:`w-40`}),m&&(0,S.jsx)(o,{size:`sm`,disabled:r,onClick:()=>i(e.userId,d.trim()),children:r?`Saving...`:`Save`}),t.length>0?(0,S.jsx)(`div`,{className:`w-44`,children:(0,S.jsx)(l,{"aria-label":`Position for ${e.displayName}`,positions:t,value:e.position?.id??null,includeUnassigned:!0,disabled:r,onChange:t=>c(e,t)})}):(0,S.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),(0,S.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,p?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role}),(0,S.jsx)(o,{variant:`outline`,size:`sm`,disabled:r,title:p?h:void 0,onClick:()=>a(e),children:p?`Make member`:`Make admin`}),(0,S.jsx)(o,{variant:`destructive`,size:`sm`,disabled:r,title:h,onClick:()=>u(e),children:`Remove`})]})}var x,S,C=e((()=>{x=t(n(),1),c(),i(),a(),h(),v(),S=r(),y.__docgenInfo={description:`Presentational admin roster — the complete section, heading and all. Owns only local view state
(per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
MemberRoster container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!1,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The members query is in flight — render the loading shell instead of the roster.`},isError:{required:!1,tsType:{name:`boolean`},description:`The members query failed — render the error shell instead of the roster.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})),w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;e((()=>{C(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],O=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:D[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:D[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],k={title:`features/manage-members/MemberRosterView`,component:y,args:{members:O,positions:D,onRename:T(),onToggleRole:T(),onChangePosition:T(),onRemove:T()}},A={args:{isLoading:!0},play:async({canvas:e})=>{await w(e.getByText(`Loading…`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},j={args:{isError:!0},play:async({canvas:e})=>{await w(e.getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},M={play:async({canvas:e})=>{await w(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await w(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await w(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await w(E(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await w(E(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},N={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=E(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await w(n.onChangePosition).toHaveBeenCalledWith(O[1],`p2`)}},P={args:{positions:[]},play:async({canvas:e})=>{await w(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await w(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},F={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=E(document.body);await w(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await w(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},I={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name for Grace Hopper`);await t.clear(r),await t.type(r,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await w(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`)}},L={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Make member`})[0]),await w(n.onToggleRole).toHaveBeenCalledWith(O[0])}},R={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[0]);let r=E(document.body);await w(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await w(n.onRemove).toHaveBeenCalledWith(O[0])}},z={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await w(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B=[`Loading`,`ErrorState`,`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`RenameMember`,`ToggleRole`,`RemoveMember`,`LastAdminRefused`]}))();export{N as ChangePosition,M as Default,j as ErrorState,z as LastAdminRefused,A as Loading,P as NoPositionsDefined,F as RemoveConfirmOpen,R as RemoveMember,I as RenameMember,L as ToggleRole,B as __namedExportsOrder,k as default};