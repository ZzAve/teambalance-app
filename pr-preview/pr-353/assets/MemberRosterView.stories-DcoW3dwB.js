import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DKhfIwgc.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./dropdown-menu-BCL12R86.js";import{t as c}from"./jsx-runtime-DeHZSEgm.js";import{n as l,t as u}from"./button-DaIhpSqY.js";import{n as d,t as f}from"./input-BgsZWF84.js";import{n as p,t as ee}from"./PositionPicker-BRtLehQd.js";import{a as m,i as h,n as g,o as _,r as v,s as y,t as b}from"./dialog-CtvGNqS0.js";import{n as x,t as S}from"./avatar-Bxr0q1s8.js";function C(e,t){let n=e.filter(e=>e.role===`ADMIN`);return n.length===1&&n[0].userId===t}function w({members:e=[],canManage:t,positions:n,isLoading:r,isError:i,savingUserId:a,errorMessage:o,onRename:s,onToggleRole:c,onChangePosition:l,onRemove:d}){let[f,p]=(0,E.useState)(null);return(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Members`}),r&&(0,D.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),i&&(0,D.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load members. Please try again.`}),!r&&!i&&(0,D.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[o&&(0,D.jsx)(`p`,{role:`alert`,className:`rounded-md bg-red/10 px-3 py-2 text-small text-red`,children:o}),e.length===0?(0,D.jsx)(`p`,{className:`rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground`,children:t?`No members yet. Share an invite link to bring people in.`:`No members yet.`}):(0,D.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(r=>(0,D.jsx)(T,{member:r,canManage:t,positions:n,lastAdmin:C(e,r.userId),isSaving:a===r.userId,onRename:s,onToggleRole:c,onChangePosition:l,onRequestRemove:p},r.userId))}),(0,D.jsx)(b,{open:f!==null,onOpenChange:e=>{e||p(null)},children:(0,D.jsxs)(g,{children:[(0,D.jsxs)(m,{children:[(0,D.jsx)(_,{children:`Remove member`}),(0,D.jsxs)(v,{children:[`Remove `,f?.displayName,` from the team? They will lose access until re-invited.`]})]}),(0,D.jsxs)(h,{children:[(0,D.jsx)(u,{variant:`outline`,onClick:()=>p(null),children:`Cancel`}),(0,D.jsx)(u,{variant:`destructive`,onClick:()=>{f&&d(f),p(null)},children:`Remove`})]})]})})]})]})}function T({member:e,canManage:t,positions:a,lastAdmin:c,isSaving:l,onRename:d,onToggleRole:p,onChangePosition:m,onRequestRemove:h}){let[g,_]=(0,E.useState)(!1),[v,y]=(0,E.useState)(e.displayName),b=e.role===`ADMIN`,x=c?`This is the last admin — the team must keep at least one.`:void 0,C=()=>{y(e.displayName),_(!0)},w=()=>{y(e.displayName),_(!1)},T=()=>{let t=v.trim();t.length!==0&&(d(e.userId,t),_(!1))};if(!t){let t=(0,D.jsx)(`span`,{className:[`ml-auto rounded-full px-2 py-0.5 text-caption font-semibold`,b?`bg-blue/10 text-blue`:`bg-muted text-muted-foreground`].join(` `),children:b?`Admin`:`Member`});return(0,D.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,D.jsx)(S,{userId:e.userId,name:e.displayName}),(0,D.jsx)(`span`,{className:`w-40 font-medium`,children:e.displayName}),(0,D.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.position?.label??`Unassigned`}),t]})}return g?(0,D.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,D.jsx)(S,{userId:e.userId,name:e.displayName}),(0,D.jsx)(f,{"aria-label":`Display name for ${e.displayName}`,value:v,autoFocus:!0,onChange:e=>y(e.target.value),onKeyDown:e=>{e.key===`Enter`?(e.preventDefault(),T()):e.key===`Escape`&&(e.preventDefault(),w())},className:`min-w-0 flex-1`}),(0,D.jsx)(u,{size:`sm`,disabled:l,onClick:T,children:l?`Saving...`:`Save`}),(0,D.jsx)(u,{size:`sm`,variant:`outline`,onClick:w,children:`Cancel`})]}):(0,D.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,D.jsx)(S,{userId:e.userId,name:e.displayName}),(0,D.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:e.displayName,children:e.displayName}),a.length>0?(0,D.jsx)(`div`,{className:`w-32 shrink-0`,children:(0,D.jsx)(ee,{"aria-label":`Position for ${e.displayName}`,positions:a,value:e.position?.id??null,includeUnassigned:!0,disabled:l,onChange:t=>m(e,t)})}):(0,D.jsx)(`span`,{className:`shrink-0 text-small text-muted-foreground`,children:e.position?.label??`Unassigned`}),b&&(0,D.jsx)(`span`,{className:`shrink-0 rounded-full bg-blue/10 px-1.5 py-0.5 text-caption font-semibold text-blue`,children:`Admin`}),(0,D.jsxs)(s,{children:[(0,D.jsx)(n,{asChild:!0,children:(0,D.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.displayName}`,disabled:l,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,D.jsxs)(i,{align:`end`,children:[(0,D.jsx)(o,{disabled:l,onSelect:C,children:`Rename`}),(0,D.jsx)(o,{title:x,onSelect:()=>p(e),children:b?`Make member`:`Make admin`}),(0,D.jsx)(r,{}),(0,D.jsx)(o,{tone:`destructive`,title:x,onSelect:()=>h(e),children:`Remove…`})]})]})]})}var E,D;function O(){return(O=e((()=>{E=t(),p(),x(),l(),d(),y(),a(),D=c(),w.__docgenInfo={description:`Presentational admin roster — the complete section, heading and all. Owns only local view state
(per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
MemberRoster container.

One quiet row per member (issue #341, variant B): avatar, name as text (Rename in the menu swaps
it for an inline field), the position picker inline since it's the common edit, an Admin badge only
on admins, and a single overflow (⋯) menu carrying the rarer actions — promote/demote and the
destructive remove.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`MemberRosterView`,props:{members:{required:!1,tsType:{name:`Array`,elements:[{name:`Member`}],raw:`Member[]`},description:``,defaultValue:{value:`[]`,computed:!1}},canManage:{required:!0,tsType:{name:`boolean`},description:"Admin capability. `true` renders the full per-row controls (rename, role toggle, position\npicker, remove, via the row's overflow menu); `false` renders read-only rows — every\nauthenticated member sees the roster, only admins can edit it."},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, offered per row so an admin can (re)assign a member.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The members query is in flight — render the loading shell instead of the roster.`},isError:{required:!1,tsType:{name:`boolean`},description:`The members query failed — render the error shell instead of the roster.`},savingUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`userId currently mid-mutation — its row's actions show a pending/disabled state.`},errorMessage:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner.`},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, displayName: string) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`string`},name:`displayName`}],return:{name:`void`}}},description:``},onToggleRole:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``},onChangePosition:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member, positionId: string | null) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(member: Member) => void`,signature:{arguments:[{type:{name:`Member`},name:`member`}],return:{name:`void`}}},description:``}}}})))()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;function te(){return(te=e((()=>{O(),{expect:k,fn:A,within:j}=__STORYBOOK_MODULE_TEST__,M=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],N=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:M[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:M[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],P={title:`features/manage-members/MemberRosterView`,component:w,args:{canManage:!0,members:N,positions:M,onRename:A(),onToggleRole:A(),onChangePosition:A(),onRemove:A()}},F={args:{isLoading:!0},play:async({canvas:e})=>{await k(e.getByText(`Loading…`)).toBeInTheDocument(),await k(e.queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument()}},I={args:{isError:!0},play:async({canvas:e})=>{await k(e.getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await k(e.queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument()}},L={play:async({canvas:e})=>{await k(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await k(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await k(e.getByText(`GH`)).toBeInTheDocument(),await k(e.getAllByText(`Admin`)).toHaveLength(2),await k(e.queryByText(`Member`)).not.toBeInTheDocument(),await k(e.queryByText(`USER`)).not.toBeInTheDocument(),await k(e.getAllByLabelText(/^Actions for /)).toHaveLength(4),await k(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await k(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await k(j(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await k(j(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},R={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Position for Grace Hopper`));let r=j(document.body);await t.click(await r.findByRole(`option`,{name:`Libero`})),await k(n.onChangePosition).toHaveBeenCalledWith(N[1],`p2`)}},z={args:{positions:[]},play:async({canvas:e})=>{await k(e.queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await k(e.getAllByText(`Unassigned`).length).toBeGreaterThan(0)}},B={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await j(document.body).findByRole(`menuitem`,{name:`Rename`}));let r=e.getByLabelText(`Display name for Grace Hopper`);await k(r).toHaveValue(`Grace Hopper`),await t.clear(r),await t.type(r,`Grace M. Hopper{Enter}`),await k(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`)}},V={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await j(document.body).findByRole(`menuitem`,{name:`Rename`}));let r=e.getByLabelText(`Display name for Grace Hopper`);await t.type(r,` extra{Escape}`),await k(e.queryByLabelText(`Display name for Grace Hopper`)).not.toBeInTheDocument(),await k(e.getByText(`Grace Hopper`)).toBeInTheDocument(),await k(n.onRename).not.toHaveBeenCalled()}},H={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Ada Lovelace`));let r=j(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Make member`})),await k(n.onToggleRole).toHaveBeenCalledWith(N[0])}},U={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=j(document.body);await k(await n.findByRole(`menuitem`,{name:`Make admin`})).toBeInTheDocument();let r=n.getByRole(`menuitem`,{name:`Remove…`});await k(r).toBeInTheDocument(),await k(r).toHaveAttribute(`data-tone`,`destructive`)}},W={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Ada Lovelace`));let r=j(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Remove…`})),await k(n.onRemove).not.toHaveBeenCalled();let i=j(document.body);await k(await i.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Remove`})),await k(n.onRemove).toHaveBeenCalledWith(N[0])}},G={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=j(document.body);await t.click(await n.findByRole(`menuitem`,{name:`Remove…`}));let r=j(document.body);await k(await r.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await k(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},K={args:{canManage:!1},play:async({canvas:e})=>{await k(e.getByText(`AL`)).toBeInTheDocument(),await k(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await k(e.getByText(`Libero`)).toBeInTheDocument(),await k(e.queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await k(e.queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await k(e.getAllByText(`Admin`)).toHaveLength(2),await k(e.getAllByText(`Member`)).toHaveLength(2),await k(e.queryByLabelText(/^Actions for /)).not.toBeInTheDocument()}},q={args:{members:[]},play:async({canvas:e})=>{await k(e.getByText(`No members yet. Share an invite link to bring people in.`)).toBeInTheDocument(),await k(e.queryByLabelText(/^Actions for /)).not.toBeInTheDocument()}},J={args:{members:[],canManage:!1},play:async({canvas:e})=>{await k(e.getByText(`No members yet.`)).toBeInTheDocument(),await k(e.queryByText(`No members yet. Share an invite link to bring people in.`)).not.toBeInTheDocument()}},Y={args:{members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`},play:async({canvas:e})=>{await k(e.getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},X=[`Christopher Vandenbroucke-Janssen`,`Anastasia Konstantinopoulos`,`Bartholomew Fitzwilliam-Harrington`,`Guadalupe Hernández-Villanueva`,`Maximilian Oosterhuis-van der Berg`],Z=Array.from({length:15},(e,t)=>({userId:`m${t}`,displayName:X[t%X.length]+(t>=X.length?` ${t}`:``),role:t===0?`ADMIN`:`USER`,position:M[t%M.length],onboarded:!0})),Q={args:{members:Z},parameters:{viewport:{defaultViewport:`mobile1`}},play:async({canvas:e})=>{await k(e.getAllByLabelText(/^Actions for /)).toHaveLength(15);let t=e.getByText(X[0]);await k(t).toHaveAttribute(`title`,X[0]),await k(t.className).toContain(`truncate`)}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load members. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Names render as plain text (with a pencil to rename) — not an always-open input.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument();
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument();
    // Only admins carry the Admin badge — there is no Member badge for the rest.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2);
    await expect(canvas.queryByText('Member')).not.toBeInTheDocument();
    await expect(canvas.queryByText('USER')).not.toBeInTheDocument();
    // Every row has one overflow menu trigger and no inline promote/demote/remove buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(4);
    await expect(canvas.queryByRole('button', {
      name: 'Make member'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument();
    await expect(within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned')).toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Display name for Grace Hopper');
    await expect(field).toHaveValue('Grace Hopper');
    await userEvent.clear(field);
    await userEvent.type(field, 'Grace M. Hopper{Enter}');
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper');
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Display name for Grace Hopper');
    await userEvent.type(field, ' extra{Escape}');
    await expect(canvas.queryByLabelText('Display name for Grace Hopper')).not.toBeInTheDocument();
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument();
    await expect(args.onRename).not.toHaveBeenCalled();
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Make member'
    }));
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'));
    const menu = within(document.body);
    await expect(await menu.findByRole('menuitem', {
      name: 'Make admin'
    })).toBeInTheDocument();
    const removeItem = menu.getByRole('menuitem', {
      name: 'Remove…'
    });
    await expect(removeItem).toBeInTheDocument();
    await expect(removeItem).toHaveAttribute('data-tone', 'destructive');
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — the confirm dialog closes on confirm and settles back to the
  // roster picture (ADR-0027 §2).
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
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Remove…'
    }));
    await expect(args.onRemove).not.toHaveBeenCalled();
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Remove…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    canManage: false
  },
  play: async ({
    canvas
  }) => {
    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(canvas.getByText('AL')).toBeInTheDocument();
    // Names and positions are plain text — no rename control, no position picker.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(canvas.getByText('Libero')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument();
    // The role/admin badge stays visible to everyone.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2);
    await expect(canvas.getAllByText('Member')).toHaveLength(2);
    // None of the admin actions render.
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    members: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No members yet. Share an invite link to bring people in.')).toBeInTheDocument();
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    members: MANY_MEMBERS
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(15);
    const firstRow = canvas.getByText(LONG_NAMES[0]);
    await expect(firstRow).toHaveAttribute('title', LONG_NAMES[0]);
    // truncate + min-w-0 keep the long name from wrapping the row onto a second line.
    await expect(firstRow.className).toContain('truncate');
  }
}`,...Q.parameters?.docs?.source}}},$=[`Loading`,`ErrorState`,`Default`,`ChangePosition`,`NoPositionsDefined`,`RenameMember`,`RenameCancelledWithEscape`,`ToggleRole`,`MenuOpen`,`RemoveMember`,`RemoveConfirmOpen`,`ReadOnly`,`EmptyManaged`,`EmptyReadOnly`,`LastAdminRefused`,`LongRosterWithLongNames`]})))()}te();export{R as ChangePosition,L as Default,q as EmptyManaged,J as EmptyReadOnly,I as ErrorState,Y as LastAdminRefused,F as Loading,Q as LongRosterWithLongNames,U as MenuOpen,z as NoPositionsDefined,K as ReadOnly,G as RemoveConfirmOpen,W as RemoveMember,V as RenameCancelledWithEscape,B as RenameMember,H as ToggleRole,$ as __namedExportsOrder,P as default};