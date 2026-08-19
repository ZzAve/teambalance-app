import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BWXU9rxl.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-CaoGp8jB.js";import{n as a,t as o}from"./input-BRE5P0fp.js";import{n as s,t as c}from"./PositionPicker-CwsA3FjX.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-CqGvm7D7.js";function g(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return v[t%v.length]}function _(e){return e.split(` `).map(e=>e[0]).slice(0,2).join(``).toUpperCase()}var v;function y(){return(y=e((()=>{v=[`var(--color-blue)`,`var(--color-green)`,`var(--color-gold)`,`var(--color-red)`,`var(--color-purple)`,`var(--color-orange)`]})))()}function b({userId:e,name:t}){return(0,x.jsx)(`div`,{className:`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white`,style:{backgroundColor:g(e)},children:_(t)})}var x;function S(){return(S=e((()=>{y(),x=n(),b.__docgenInfo={description:`A person's avatar: a deterministic colour circle (keyed on userId) with their initials. Shared
across every listing — the event attendee list and the team roster — so one person reads the same
everywhere. Colour + initials logic lives in @shared/lib/avatar.`,methods:[],displayName:`Avatar`,props:{userId:{required:!0,tsType:{name:`string`},description:``},name:{required:!0,tsType:{name:`string`},description:``}}}})))()}function C(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}function w({members:e=[],canManage:t,positions:n,isLoading:r,isError:a,savingUserId:o,errorMessage:s,onRename:c,onToggleRole:m,onChangePosition:g,onRemove:_}){let[v,y]=(0,E.useState)(null);return(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Members`}),r&&(0,D.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),a&&(0,D.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load members. Please try again.`}),!r&&!a&&(0,D.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[s&&(0,D.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red/10 px-3 py-2 text-sm text-red`,children:s}),(0,D.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,D.jsx)(T,{member:r,canManage:t,positions:n,lastAdmin:C(e,r.userId),isSaving:o===r.userId,onRename:c,onToggleRole:m,onChangePosition:g,onRequestRemove:y},r.userId))}),(0,D.jsx)(h,{open:v!==null,onOpenChange:e=>{e||y(null)},children:(0,D.jsxs)(d,{children:[(0,D.jsxs)(l,{children:[(0,D.jsx)(f,{children:`Remove member`}),(0,D.jsxs)(p,{children:[`Remove `,v?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,D.jsxs)(u,{children:[(0,D.jsx)(i,{variant:`outline`,onClick:()=>y(null),children:`Cancel`}),(0,D.jsx)(i,{variant:`destructive`,onClick:()=>{v&&_(v),y(null)},children:`Remove`})]})]})})]})]})}function T({member:e,canManage:t,positions:n,lastAdmin:r,isSaving:a,onRename:s,onToggleRole:l,onChangePosition:u,onRequestRemove:d}){let[f,p]=(0,E.useState)(e.displayName),m=e.role===`ADMIN`,h=f.trim().length>0&&f.trim()!==e.displayName,g=r?`This is the last admin — the team must keep at least one.`:void 0,_=(0,D.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold`,m?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:e.role});return t?(0,D.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,D.jsx)(b,{userId:e.userId,name:e.displayName}),(0,D.jsx)(o,{"aria-label":`Display name for ${e.displayName}`,value:f,onChange:e=>p(e.target.value),className:`w-40`}),h&&(0,D.jsx)(i,{size:`sm`,disabled:a,onClick:()=>s(e.userId,f.trim()),children:a?`Saving...`:`Save`}),n.length>0?(0,D.jsx)(`div`,{className:`w-44`,children:(0,D.jsx)(c,{"aria-label":`Position for ${e.displayName}`,positions:n,value:e.position?.id??null,includeUnassigned:!0,disabled:a,onChange:t=>u(e,t)})}):(0,D.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),_,(0,D.jsx)(i,{variant:`outline`,size:`sm`,disabled:a,title:m?g:void 0,onClick:()=>l(e),children:m?`Make member`:`Make admin`}),(0,D.jsx)(i,{variant:`destructive`,size:`sm`,disabled:a,title:g,onClick:()=>d(e),children:`Remove`})]}):(0,D.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,D.jsx)(b,{userId:e.userId,name:e.displayName}),(0,D.jsx)(`span`,{className:`w-40 font-medium`,children:e.displayName}),(0,D.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.position?.label??`Unassigned`}),_]})}var E,D;function O(){return(O=e((()=>{E=t(),s(),S(),r(),a(),m(),D=n(),w.__docgenInfo={description:`Presentational admin roster — the complete section, heading and all. Owns only local view state
(per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
MemberRoster container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!1,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``,defaultValue:{value:`[]`,computed:!1}},canManage:{required:!0,tsType:{name:`boolean`},description:"Admin capability. `true` renders the full per-row controls (rename, role toggle, position\npicker, remove); `false` renders read-only rows — every authenticated member sees the roster,\nonly admins can edit it."},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The members query is in flight — render the loading shell instead of the roster.`},isError:{required:!1,tsType:{name:`boolean`},description:`The members query failed — render the error shell instead of the roster.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})))()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{O(),{expect:k,fn:A,within:j}=__STORYBOOK_MODULE_TEST__,M=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],N=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:M[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:M[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],P={title:`features/manage-members/MemberRosterView`,component:w,args:{canManage:!0,members:N,positions:M,onRename:A(),onToggleRole:A(),onChangePosition:A(),onRemove:A()}},F={args:{isLoading:!0},play:async({canvas:e})=>{await k(e.getByText(`Loading…`)).toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},I={args:{isError:!0},play:async({canvas:e})=>{await k(e.getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},L={play:async({canvas:e})=>{await k(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await k(e.getByText(`GH`)).toBeInTheDocument(),await k(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await k(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await k(j(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await k(j(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},R={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=j(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await k(n.onChangePosition).toHaveBeenCalledWith(N[1],`p2`)}},z={args:{positions:[]},play:async({canvas:e})=>{await k(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await k(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},B={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=j(document.body);await k(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await k(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},V={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name for Grace Hopper`);await t.clear(r),await t.type(r,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await k(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`)}},H={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Make member`})[0]),await k(n.onToggleRole).toHaveBeenCalledWith(N[0])}},U={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[0]);let r=j(document.body);await k(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await k(n.onRemove).toHaveBeenCalledWith(N[0])}},W={args:{canManage:!1},play:async({canvas:e})=>{await k(e.getByText(`AL`)).toBeInTheDocument(),await k(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await k(e.getByText(`Libero`)).toBeInTheDocument(),await k(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await k(e.queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await k(e.getAllByText(`ADMIN`)).toHaveLength(2),await k(e.getAllByText(`USER`)).toHaveLength(2),await k(e.queryByRole(`button`,{name:`Save`})).not.toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument()}},G={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await k(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K=[`Loading`,`ErrorState`,`Default`,`ChangePosition`,`NoPositionsDefined`,`RemoveConfirmOpen`,`RenameMember`,`ToggleRole`,`RemoveMember`,`ReadOnly`,`LastAdminRefused`]})))()}q();export{R as ChangePosition,L as Default,I as ErrorState,G as LastAdminRefused,F as Loading,z as NoPositionsDefined,W as ReadOnly,B as RemoveConfirmOpen,U as RemoveMember,V as RenameMember,H as ToggleRole,K as __namedExportsOrder,P as default};