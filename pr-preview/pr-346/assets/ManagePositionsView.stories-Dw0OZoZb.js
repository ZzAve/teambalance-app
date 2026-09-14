import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-xLdGEXpd.js";import{a as n,n as r,o as i,r as a,t as o}from"./dropdown-menu-BAINALLm.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./button-CmeF9f-4.js";import{n as u,t as d}from"./input-D5a5PVWS.js";import{a as f,i as p,n as m,o as h,r as g,s as _,t as v}from"./dialog-BhpWkU-i.js";function y(e){return e.trim().length===0?`A label is required.`:null}function b({positions:e=[],usage:t,onConfirmTargetChange:n,isLoading:r,isError:i,isSaving:a,errorCode:o,onCreate:s,onRename:c,onSetKind:u,onDelete:_}){let[b,T]=(0,C.useState)(``),[E,D]=(0,C.useState)(null),O=e=>{D(e),n?.(e)},k=y(b),A=()=>{k||(s(b.trim()),T(``))};return(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Positions`}),r&&(0,w.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),i&&(0,w.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load positions. Please try again.`}),!r&&!i&&(0,w.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,w.jsxs)(`div`,{className:`flex gap-2`,children:[(0,w.jsx)(d,{"aria-label":`New position label`,value:b,placeholder:`e.g. Setter`,onChange:e=>T(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),A())}}),(0,w.jsx)(l,{disabled:a||!!k,onClick:A,children:`Add`})]}),o===`POSITION_LABEL_TAKEN`&&(0,w.jsx)(`p`,{className:`mt-1 text-small text-red`,children:`That position already exists.`}),e.length===0?(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,w.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,w.jsx)(x,{position:e,isSaving:a,onRename:c,onSetKind:u,onRequestDelete:O},e.id))}),(0,w.jsx)(v,{open:E!==null,onOpenChange:e=>{e||O(null)},children:(0,w.jsxs)(m,{children:[(0,w.jsxs)(f,{children:[(0,w.jsx)(h,{children:`Delete position`}),(0,w.jsxs)(g,{children:[`Delete "`,E?.label,`"? This cannot be undone.`]})]}),(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:t?S(t):`Checking what uses this position…`}),(0,w.jsxs)(p,{children:[(0,w.jsx)(l,{variant:`outline`,onClick:()=>O(null),children:`Cancel`}),(0,w.jsx)(l,{variant:`destructive`,onClick:()=>{E&&_(E),O(null)},children:`Delete`})]})]})})]})]})}function x({position:e,isSaving:t,onRename:i,onSetKind:s,onRequestDelete:c}){let[u,f]=(0,C.useState)(!1),[p,m]=(0,C.useState)(e.label),h=()=>{m(e.label),f(!0)},g=()=>{m(e.label),f(!1)},_=()=>{let t=p.trim();t.length!==0&&(i(e.id,t),f(!1))};return u?(0,w.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,w.jsx)(d,{"aria-label":`Label for ${e.label}`,value:p,autoFocus:!0,onChange:e=>m(e.target.value),onKeyDown:e=>{e.key===`Enter`?(e.preventDefault(),_()):e.key===`Escape`&&(e.preventDefault(),g())},className:`min-w-0 flex-1`}),(0,w.jsx)(l,{size:`sm`,disabled:t,onClick:_,children:t?`Saving...`:`Save`}),(0,w.jsx)(l,{size:`sm`,variant:`outline`,onClick:g,children:`Cancel`})]}):(0,w.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,w.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:e.label,children:e.label}),(0,w.jsxs)(`label`,{className:`flex shrink-0 items-center gap-1.5 text-small text-muted-foreground`,children:[(0,w.jsx)(`input`,{type:`checkbox`,"aria-label":`${e.label} is staff`,className:`size-4 accent-green`,checked:e.kind===`STAFF`,disabled:t,onChange:t=>s(e.id,t.target.checked?`STAFF`:`PLAYING`)}),`Staff`]}),(0,w.jsxs)(o,{children:[(0,w.jsx)(n,{asChild:!0,children:(0,w.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.label}`,disabled:t,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,w.jsxs)(r,{align:`end`,children:[(0,w.jsx)(a,{disabled:t,onSelect:h,children:`Rename`}),(0,w.jsx)(a,{tone:`destructive`,onSelect:()=>c(e),children:`Delete…`})]})]})]})}function S(e){let t=[];return e.memberCount>0&&t.push(`${e.memberCount} ${e.memberCount===1?`member becomes`:`members become`} Unassigned`),e.eventTypeCount>0&&t.push(`it is dropped from ${e.eventTypeCount} event ${e.eventTypeCount===1?`type`:`types`}`),e.eventCount>0&&t.push(`and from ${e.eventCount} ${e.eventCount===1?`event`:`events`} with their own roster`),t.length===0?`Nothing currently uses this position.`:`${t.join(`, `)}.`}var C,w;function T(){return(T=e((()=>{C=t(),c(),u(),_(),i(),w=s(),b.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/set-kind/delete mutations live in the ManagePositions container.

Same quiet-row shape as the member roster (issue #341, variant B): label as text with a pencil to
rename it, the Staff checkbox inline since it's the common edit, and a single overflow (⋯) menu
carrying the destructive delete.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},usage:{required:!1,tsType:{name:`PositionUsage`},description:'What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while\nit is still loading — the dialog says so rather than implying "nothing".'},onConfirmTargetChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(position: Position | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`Position | null`,elements:[{name:`Position`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Told which position the delete dialog is asking about, so the container can fetch its usage.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onSetKind:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, kind: PositionKind) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`PositionKind`},name:`kind`}],return:{name:`void`}}},description:`Reclassifies a position as played or staffed (#281). Applies at once — no Save to press.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{T(),{expect:E,fn:D,within:O}=__STORYBOOK_MODULE_TEST__,k=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],A=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],j={title:`features/manage-positions/ManagePositionsView`,component:b,args:{positions:k,onCreate:D(),onRename:D(),onSetKind:D(),onDelete:D()}},M={args:{isLoading:!0},play:async({canvas:e})=>{await E(e.getByText(`Loading…`)).toBeInTheDocument(),await E(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},N={args:{isError:!0},play:async({canvas:e})=>{await E(e.getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await E(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},P={args:{positions:[]},play:async({canvas:e})=>{await E(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await E(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},F={play:async({canvas:e})=>{await E(e.getByText(`Setter`)).toBeInTheDocument(),await E(e.getByText(`Libero`)).toBeInTheDocument(),await E(e.queryByLabelText(`Label for Setter`)).not.toBeInTheDocument(),await E(e.getAllByLabelText(/^Actions for /)).toHaveLength(2),await E(e.queryByRole(`button`,{name:`Delete`})).not.toBeInTheDocument()}},I={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await E(e.getByLabelText(`Setter is staff`)).not.toBeChecked(),await E(e.getByLabelText(`Libero is staff`)).not.toBeChecked()}},L={args:{positions:A},play:async({canvas:e})=>{await E(e.getByLabelText(`Trainer is staff`)).toBeChecked(),await E(e.getByLabelText(`Setter is staff`)).not.toBeChecked()}},R={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Setter is staff`)),await E(n.onSetKind).toHaveBeenCalledWith(`p1`,`STAFF`)}},z={parameters:{chromatic:{disableSnapshot:!0}},args:{positions:A},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Trainer is staff`)),await E(n.onSetKind).toHaveBeenCalledWith(`p3`,`PLAYING`)}},B={parameters:{chromatic:{disableSnapshot:!0}},args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await E(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},V={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Setter`)),await t.click(await O(document.body).findByRole(`menuitem`,{name:`Rename`}));let r=e.getByLabelText(`Label for Setter`);await E(r).toHaveValue(`Setter`),await t.clear(r),await t.type(r,`Middle Blocker{Enter}`),await E(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`)}},H={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Setter`)),await t.click(await O(document.body).findByRole(`menuitem`,{name:`Rename`}));let r=e.getByLabelText(`Label for Setter`);await t.type(r,` extra{Escape}`),await E(e.queryByLabelText(`Label for Setter`)).not.toBeInTheDocument(),await E(e.getByText(`Setter`)).toBeInTheDocument(),await E(n.onRename).not.toHaveBeenCalled()}},U={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Setter`));let n=await O(document.body).findByRole(`menuitem`,{name:`Delete…`});await E(n).toBeInTheDocument(),await E(n).toHaveAttribute(`data-tone`,`destructive`)}},W={parameters:{chromatic:{disableSnapshot:!0}},args:{usage:{eventTypeCount:2,eventCount:1,memberCount:3}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Setter`));let r=O(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Delete…`})),await E(n.onDelete).not.toHaveBeenCalled();let i=O(document.body);await E(await i.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await E(i.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await E(i.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Delete`})),await E(n.onDelete).toHaveBeenCalledWith(k[0])}},G={args:{usage:{eventTypeCount:2,eventCount:1,memberCount:3}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Setter`));let r=O(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Delete…`}));let i=O(document.body);await E(await i.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await E(i.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await E(i.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await E(i.getByRole(`button`,{name:`Delete`})).toBeEnabled(),await E(i.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await E(n.onDelete).not.toHaveBeenCalled()}},K={args:{usage:{eventTypeCount:0,eventCount:0,memberCount:0}},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Setter`));let n=O(document.body);await t.click(await n.findByRole(`menuitem`,{name:`Delete…`}));let r=O(document.body);await E(await r.findByText(`Nothing currently uses this position.`)).toBeInTheDocument()}},q={args:{usage:void 0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Setter`));let n=O(document.body);await t.click(await n.findByRole(`menuitem`,{name:`Delete…`}));let r=O(document.body);await E(await r.findByText(`Checking what uses this position…`)).toBeInTheDocument(),await E(r.queryByText(/Nothing currently uses/)).not.toBeInTheDocument()}},J={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await E(e.getByText(`That position already exists.`)).toBeInTheDocument()}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    // The form is suppressed while the query is in flight — no add control yet.
    await expect(canvas.queryByRole('button', {
      name: 'Add'
    })).not.toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load positions. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Add'
    })).not.toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    positions: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No positions yet. Add one above.')).toBeInTheDocument();
    // Add is disabled until a non-empty label is typed.
    await expect(canvas.getByRole('button', {
      name: 'Add'
    })).toBeDisabled();
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Labels render as plain text (with a pencil to rename) — not an always-open input.
    await expect(canvas.getByText('Setter')).toBeInTheDocument();
    await expect(canvas.getByText('Libero')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Label for Setter')).not.toBeInTheDocument();
    // One overflow-menu trigger per row, no inline Delete buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
    await expect(canvas.queryByRole('button', {
      name: 'Delete'
    })).not.toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked();
    await expect(canvas.getByLabelText('Libero is staff')).not.toBeChecked();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    positions: WITH_STAFF
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Trainer is staff')).toBeChecked();
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByLabelText('Setter is staff'));
    await expect(args.onSetKind).toHaveBeenCalledWith('p1', 'STAFF');
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    positions: WITH_STAFF
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Trainer is staff'));
    await expect(args.onSetKind).toHaveBeenCalledWith('p3', 'PLAYING');
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Empty — the field clears with \`positions: []\`, settling to the Empty picture
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    positions: []
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.type(canvas.getByLabelText('New position label'), 'Middle Blocker');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Add'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker');
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Label for Setter');
    await expect(field).toHaveValue('Setter');
    await userEvent.clear(field);
    await userEvent.type(field, 'Middle Blocker{Enter}');
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker');
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Label for Setter');
    await userEvent.type(field, ' extra{Escape}');
    await expect(canvas.queryByLabelText('Label for Setter')).not.toBeInTheDocument();
    await expect(canvas.getByText('Setter')).toBeInTheDocument();
    await expect(args.onRename).not.toHaveBeenCalled();
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    const deleteItem = await menu.findByRole('menuitem', {
      name: 'Delete…'
    });
    await expect(deleteItem).toBeInTheDocument();
    await expect(deleteItem).toHaveAttribute('data-tone', 'destructive');
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of WithItems — the confirm dialog closes on confirm and settles back to the
  // items picture; the open-dialog frames keep their own baselines below (#263, ADR-0027 §2) —
  // three of them now, because #219 gives the dialog three states rather than one.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    usage: {
      eventTypeCount: 2,
      eventCount: 1,
      memberCount: 3
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Delete…'
    }));
    await expect(args.onDelete).not.toHaveBeenCalled();
    const dialog = within(document.body);
    // The dialog names what the delete will actually touch (#219) rather than warning in the
    // abstract — a warning, not a veto: the Delete button is still live.
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument();
    await expect(dialog.getByText(/dropped from 2 event types/)).toBeInTheDocument();
    await expect(dialog.getByText(/from 1 event with their own roster/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Delete'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0]);
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    usage: {
      eventTypeCount: 2,
      eventCount: 1,
      memberCount: 3
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Delete…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument();
    await expect(dialog.getByText(/dropped from 2 event types/)).toBeInTheDocument();
    await expect(dialog.getByText(/from 1 event with their own roster/)).toBeInTheDocument();
    // Deliberately not confirmed: a warning is not a veto, so the Delete button stays live and
    // nothing has fired yet.
    await expect(dialog.getByRole('button', {
      name: 'Delete'
    })).toBeEnabled();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
    await expect(args.onDelete).not.toHaveBeenCalled();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    usage: {
      eventTypeCount: 0,
      eventCount: 0,
      memberCount: 0
    }
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Delete…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Nothing currently uses this position.')).toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    usage: undefined
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Delete…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Checking what uses this position…')).toBeInTheDocument();
    await expect(dialog.queryByText(/Nothing currently uses/)).not.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y=[`Loading`,`ErrorState`,`Empty`,`WithItems`,`StaffToggleOff`,`WithStaffPosition`,`MarkPositionStaff`,`MarkPositionPlaying`,`CreatePosition`,`RenamePosition`,`RenameCancelledWithEscape`,`MenuOpen`,`DeleteConfirm`,`DeleteConfirmUsageCounts`,`DeleteConfirmUnused`,`DeleteConfirmUsageLoading`,`LabelTaken`]})))()}X();export{B as CreatePosition,W as DeleteConfirm,K as DeleteConfirmUnused,G as DeleteConfirmUsageCounts,q as DeleteConfirmUsageLoading,P as Empty,N as ErrorState,J as LabelTaken,M as Loading,z as MarkPositionPlaying,R as MarkPositionStaff,U as MenuOpen,H as RenameCancelledWithEscape,V as RenamePosition,I as StaffToggleOff,F as WithItems,L as WithStaffPosition,Y as __namedExportsOrder,j as default};