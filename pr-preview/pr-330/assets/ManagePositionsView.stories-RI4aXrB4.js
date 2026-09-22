import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-CN0e_lCC.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{a,n as o,o as s,r as c,t as l}from"./dropdown-menu-B2_YHdW3.js";import{n as u,t as d}from"./button-Ce3gpAJ8.js";import{n as f,t as p}from"./input-Cr3raJKB.js";import{a as m,i as h,n as g,o as _,r as v,s as y,t as b}from"./dialog-CoZ8kKa7.js";function x(e){return e.trim().length===0?`A label is required.`:null}function S({positions:e=[],usage:t,onConfirmTargetChange:n,isLoading:r,isError:i,isSaving:a,errorCode:o,onCreate:s,onRename:c,onSetKind:l,onDelete:u}){let[f,y]=(0,T.useState)(``),[S,D]=(0,T.useState)(null),O=e=>{D(e),n?.(e)},k=x(f),A=()=>{k||(s(f.trim()),y(``))};return(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Positions`}),r&&(0,E.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),i&&(0,E.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load positions. Please try again.`}),!r&&!i&&(0,E.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,E.jsxs)(`div`,{className:`flex gap-2`,children:[(0,E.jsx)(p,{"aria-label":`New position label`,value:f,placeholder:`e.g. Setter`,onChange:e=>y(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),A())}}),(0,E.jsx)(d,{disabled:a||!!k,onClick:A,children:`Add`})]}),o===`POSITION_LABEL_TAKEN`&&(0,E.jsx)(`p`,{className:`mt-1 text-small text-red`,children:`That position already exists.`}),e.length===0?(0,E.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,E.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,E.jsx)(C,{position:e,isSaving:a,onRename:c,onSetKind:l,onRequestDelete:O},e.id))}),(0,E.jsx)(b,{open:S!==null,onOpenChange:e=>{e||O(null)},children:(0,E.jsxs)(g,{children:[(0,E.jsxs)(m,{children:[(0,E.jsx)(_,{children:`Delete position`}),(0,E.jsxs)(v,{children:[`Delete "`,S?.label,`"? This cannot be undone.`]})]}),(0,E.jsx)(`p`,{className:`text-small text-muted-foreground`,children:t?w(t):`Checking what uses this position…`}),(0,E.jsxs)(h,{children:[(0,E.jsx)(d,{variant:`outline`,onClick:()=>O(null),children:`Cancel`}),(0,E.jsx)(d,{variant:`destructive`,onClick:()=>{S&&u(S),O(null)},children:`Delete`})]})]})})]})]})}function C({position:e,isSaving:t,onRename:n,onSetKind:r,onRequestDelete:i}){let[s,u]=(0,T.useState)(!1),[f,m]=(0,T.useState)(e.label),h=()=>{m(e.label),u(!0)},g=()=>{m(e.label),u(!1)},_=()=>{let t=f.trim();t.length!==0&&(n(e.id,t),u(!1))};return s?(0,E.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,E.jsx)(p,{"aria-label":`Label for ${e.label}`,value:f,autoFocus:!0,onChange:e=>m(e.target.value),onKeyDown:e=>{e.key===`Enter`?(e.preventDefault(),_()):e.key===`Escape`&&(e.preventDefault(),g())},className:`min-w-0 flex-1`}),(0,E.jsx)(d,{size:`sm`,disabled:t,onClick:_,children:t?`Saving...`:`Save`}),(0,E.jsx)(d,{size:`sm`,variant:`outline`,onClick:g,children:`Cancel`})]}):(0,E.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,E.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:e.label,children:e.label}),(0,E.jsxs)(`label`,{className:`flex shrink-0 items-center gap-1.5 text-small text-muted-foreground`,children:[(0,E.jsx)(`input`,{type:`checkbox`,"aria-label":`${e.label} is staff`,className:`size-4 accent-green`,checked:e.kind===`STAFF`,disabled:t,onChange:t=>r(e.id,t.target.checked?`STAFF`:`PLAYING`)}),`Staff`]}),(0,E.jsxs)(l,{children:[(0,E.jsx)(a,{asChild:!0,children:(0,E.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.label}`,disabled:t,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,E.jsxs)(o,{align:`end`,children:[(0,E.jsx)(c,{disabled:t,onSelect:h,children:`Rename`}),(0,E.jsx)(c,{tone:`destructive`,onSelect:()=>i(e),children:`Delete…`})]})]})]})}function w(e){let t=[];return e.memberCount>0&&t.push(`${e.memberCount} ${e.memberCount===1?`member becomes`:`members become`} Unassigned`),e.eventTypeCount>0&&t.push(`it is dropped from ${e.eventTypeCount} event ${e.eventTypeCount===1?`type`:`types`}`),e.eventCount>0&&t.push(`and from ${e.eventCount} ${e.eventCount===1?`event`:`events`} with their own roster`),t.length===0?`Nothing currently uses this position.`:`${t.join(`, `)}.`}var T,E;function D(){return(D=e((()=>{T=t(),u(),f(),y(),s(),E=n(),S.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/set-kind/delete mutations live in the ManagePositions container.

Same quiet-row shape as the member roster (issue #341, variant B): label as text with a pencil to
rename it, the Staff checkbox inline since it's the common edit, and a single overflow (⋯) menu
carrying the destructive delete.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},usage:{required:!1,tsType:{name:`PositionUsage`},description:'What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while\nit is still loading — the dialog says so rather than implying "nothing".'},onConfirmTargetChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(position: Position | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`Position | null`,elements:[{name:`Position`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Told which position the delete dialog is asking about, so the container can fetch its usage.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onSetKind:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, kind: PositionKind) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`PositionKind`},name:`kind`}],return:{name:`void`}}},description:`Reclassifies a position as played or staffed (#281). Applies at once — no Save to press.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{r(),D(),O=n(),{expect:k,fn:A,within:j}=__STORYBOOK_MODULE_TEST__,M=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],N=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],P={eventTypeCount:2,eventCount:1,memberCount:3},F={title:`features/manage-positions/ManagePositionsView`,component:S,args:{positions:M,onCreate:A(),onRename:A(),onSetKind:A(),onDelete:A()}},I={play:async({canvas:e})=>{await k(e.getByText(`Setter`)).toBeInTheDocument(),await k(e.getByText(`Libero`)).toBeInTheDocument(),await k(e.queryByLabelText(`Label for Setter`)).not.toBeInTheDocument(),await k(e.getAllByLabelText(/^Actions for /)).toHaveLength(2),await k(e.queryByRole(`button`,{name:`Delete`})).not.toBeInTheDocument(),await k(e.getByLabelText(`Setter is staff`)).not.toBeChecked(),await k(e.getByLabelText(`Libero is staff`)).not.toBeChecked()}},L={render:e=>(0,O.jsx)(i,{items:{Loading:(0,O.jsx)(S,{...e,isLoading:!0}),Error:(0,O.jsx)(S,{...e,isError:!0}),Empty:(0,O.jsx)(S,{...e,positions:[]}),"With a staff position":(0,O.jsx)(S,{...e,positions:N}),"Label taken":(0,O.jsx)(S,{...e,errorCode:`POSITION_LABEL_TAKEN`})}}),play:async({canvas:e})=>{let t=t=>j(e.getByRole(`region`,{name:t}));await k(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await k(t(`Loading`).queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument(),await k(t(`Error`).getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await k(t(`Error`).queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument(),await k(t(`Empty`).getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await k(t(`Empty`).getByRole(`button`,{name:`Add`})).toBeDisabled(),await k(t(`With a staff position`).getByLabelText(`Trainer is staff`)).toBeChecked(),await k(t(`With a staff position`).getByLabelText(`Setter is staff`)).not.toBeChecked(),await k(t(`Label taken`).getByText(`That position already exists.`)).toBeInTheDocument()}},R={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Setter`));let n=j(document.body),r=await n.findByRole(`menuitem`,{name:`Delete…`});await k(n.getByRole(`menuitem`,{name:`Rename`})).toBeInTheDocument(),await k(r).toHaveAttribute(`data-tone`,`destructive`)}},z={args:{usage:P},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Setter`));let r=j(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Delete…`})),await k(await r.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await k(r.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await k(r.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await k(r.getByRole(`button`,{name:`Delete`})).toBeEnabled(),await k(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await k(n.onDelete).not.toHaveBeenCalled()}},B={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,O.jsx)(i,{items:{Positions:(0,O.jsx)(S,{...e,usage:P}),Staff:(0,O.jsx)(S,{...e,positions:N}),Empty:(0,O.jsx)(S,{...e,positions:[]}),Unused:(0,O.jsx)(S,{...e,usage:{eventTypeCount:0,eventCount:0,memberCount:0}}),"Usage loading":(0,O.jsx)(S,{...e,usage:void 0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>j(e.getByRole(`region`,{name:t})),i=j(document.body);await t.click(r(`Positions`).getByLabelText(`Setter is staff`)),await k(n.onSetKind).toHaveBeenLastCalledWith(`p1`,`STAFF`),await t.click(r(`Staff`).getByLabelText(`Trainer is staff`)),await k(n.onSetKind).toHaveBeenLastCalledWith(`p3`,`PLAYING`),await t.type(r(`Empty`).getByLabelText(`New position label`),`Middle Blocker`),await t.click(r(`Empty`).getByRole(`button`,{name:`Add`})),await k(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`),await t.click(r(`Positions`).getByLabelText(`Actions for Libero`)),await t.click(await i.findByRole(`menuitem`,{name:`Rename`}));let a=r(`Positions`).getByLabelText(`Label for Libero`);await t.type(a,` extra{Escape}`),await k(r(`Positions`).queryByLabelText(`Label for Libero`)).not.toBeInTheDocument(),await k(r(`Positions`).getByText(`Libero`)).toBeInTheDocument(),await k(n.onRename).not.toHaveBeenCalled(),await t.click(r(`Positions`).getByLabelText(`Actions for Setter`)),await t.click(await i.findByRole(`menuitem`,{name:`Rename`}));let o=r(`Positions`).getByLabelText(`Label for Setter`);await k(o).toHaveValue(`Setter`),await t.clear(o),await t.type(o,`Middle Blocker{Enter}`),await k(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`),await t.click(r(`Positions`).getByLabelText(`Actions for Setter`)),await t.click(await i.findByRole(`menuitem`,{name:`Delete…`})),await k(await i.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Delete`})),await k(n.onDelete).toHaveBeenCalledWith(M[0]),await t.click(r(`Unused`).getByLabelText(`Actions for Setter`)),await t.click(await i.findByRole(`menuitem`,{name:`Delete…`})),await k(await i.findByText(`Nothing currently uses this position.`)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await t.click(r(`Usage loading`).getByLabelText(`Actions for Setter`)),await t.click(await i.findByRole(`menuitem`,{name:`Delete…`})),await k(await i.findByText(`Checking what uses this position…`)).toBeInTheDocument(),await k(i.queryByText(/Nothing currently uses/)).not.toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`}))}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Labels render as plain text (with rename behind the ⋯ menu) — not an always-open input.
    await expect(canvas.getByText('Setter')).toBeInTheDocument();
    await expect(canvas.getByText('Libero')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Label for Setter')).not.toBeInTheDocument();
    // One overflow-menu trigger per row, no inline Delete buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
    await expect(canvas.queryByRole('button', {
      name: 'Delete'
    })).not.toBeInTheDocument();
    // The staff toggle's resting state (#281): a team that has marked nothing sees every box clear,
    // so the distinction costs an existing admin no attention until they want it.
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked();
    await expect(canvas.getByLabelText('Libero is staff')).not.toBeChecked();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <ManagePositionsView {...args} isLoading />,
    Error: <ManagePositionsView {...args} isError />,
    Empty: <ManagePositionsView {...args} positions={[]} />,
    'With a staff position': <ManagePositionsView {...args} positions={WITH_STAFF} />,
    'Label taken': <ManagePositionsView {...args} errorCode="POSITION_LABEL_TAKEN" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    // The form is suppressed while the query is in flight — no add control yet.
    await expect(region('Loading').queryByRole('button', {
      name: 'Add'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load positions. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByRole('button', {
      name: 'Add'
    })).not.toBeInTheDocument();
    await expect(region('Empty').getByText('No positions yet. Add one above.')).toBeInTheDocument();
    // Add is disabled until a non-empty label is typed.
    await expect(region('Empty').getByRole('button', {
      name: 'Add'
    })).toBeDisabled();
    await expect(region('With a staff position').getByLabelText('Trainer is staff')).toBeChecked();
    await expect(region('With a staff position').getByLabelText('Setter is staff')).not.toBeChecked();
    await expect(region('Label taken').getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const menu = within(document.body);
    const deleteItem = await menu.findByRole('menuitem', {
      name: 'Delete…'
    });
    await expect(menu.getByRole('menuitem', {
      name: 'Rename'
    })).toBeInTheDocument();
    await expect(deleteItem).toHaveAttribute('data-tone', 'destructive');
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    usage: USAGE
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'));
    const dialog = within(document.body);
    await userEvent.click(await dialog.findByRole('menuitem', {
      name: 'Delete…'
    }));
    // The dialog names what the delete will actually touch (#219) rather than warning in the
    // abstract — a warning, not a veto: the Delete button is still live.
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Positions: <ManagePositionsView {...args} usage={USAGE} />,
    Staff: <ManagePositionsView {...args} positions={WITH_STAFF} />,
    Empty: <ManagePositionsView {...args} positions={[]} />,
    Unused: <ManagePositionsView {...args} usage={{
      eventTypeCount: 0,
      eventCount: 0,
      memberCount: 0
    }} />,
    'Usage loading': <ManagePositionsView {...args} usage={undefined} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const portal = within(document.body);

    // The gesture is the flip itself — no Save to press, unlike a rename beside it.
    await userEvent.click(region('Positions').getByLabelText('Setter is staff'));
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p1', 'STAFF');
    // Reclassifying is not one-way: an admin who marked the wrong position can put it back.
    await userEvent.click(region('Staff').getByLabelText('Trainer is staff'));
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p3', 'PLAYING');
    await userEvent.type(region('Empty').getByLabelText('New position label'), 'Middle Blocker');
    await userEvent.click(region('Empty').getByRole('button', {
      name: 'Add'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker');

    // Escape backs out of a rename without calling onRename — checked before the successful rename
    // below, since a spy's "not called" assertion must precede any step that calls it.
    await userEvent.click(region('Positions').getByLabelText('Actions for Libero'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    const liberoField = region('Positions').getByLabelText('Label for Libero');
    await userEvent.type(liberoField, ' extra{Escape}');
    await expect(region('Positions').queryByLabelText('Label for Libero')).not.toBeInTheDocument();
    await expect(region('Positions').getByText('Libero')).toBeInTheDocument();
    await expect(args.onRename).not.toHaveBeenCalled();

    // Rename lives behind the ⋯ menu and swaps the label for an inline input; Enter saves without a
    // mouse click on a Save button.
    await userEvent.click(region('Positions').getByLabelText('Actions for Setter'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = region('Positions').getByLabelText('Label for Setter');
    await expect(field).toHaveValue('Setter');
    await userEvent.clear(field);
    await userEvent.type(field, 'Middle Blocker{Enter}');
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker');

    // Confirming the blast-radius dialog fires the delete and closes it. Reached via the ⋯ menu;
    // Delete… itself carries the red destructive treatment (MenuOpen carries that baseline).
    await userEvent.click(region('Positions').getByLabelText('Actions for Setter'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Delete…'
    }));
    await expect(await portal.findByText(/3 members become Unassigned/)).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Delete'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0]);

    // A position nothing uses reads as a clean removal rather than a list of three zeroes.
    await userEvent.click(region('Unused').getByLabelText('Actions for Setter'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Delete…'
    }));
    await expect(await portal.findByText('Nothing currently uses this position.')).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Cancel'
    }));

    // The usage query is admin-only and fires when the dialog opens, so there is a moment with no
    // answer yet. It must not read as "nothing uses this".
    await userEvent.click(region('Usage loading').getByLabelText('Actions for Setter'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Delete…'
    }));
    await expect(await portal.findByText('Checking what uses this position…')).toBeInTheDocument();
    await expect(portal.queryByText(/Nothing currently uses/)).not.toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Cancel'
    }));
  }
}`,...B.parameters?.docs?.source}}},V=[`Data`,`Shells`,`MenuOpen`,`DeleteConfirmOpen`,`Interactions`]})))()}H();export{I as Data,z as DeleteConfirmOpen,B as Interactions,R as MenuOpen,L as Shells,V as __namedExportsOrder,F as default};