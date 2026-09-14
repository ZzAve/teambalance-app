import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-exsfVg0I.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-CKd6OPi-.js";import{n as a,t as o}from"./button-BcU7NJ34.js";import{n as s,t as c}from"./input-CsEbFyMd.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-BfGu6ZFh.js";function g(e){return e.trim().length===0?`A label is required.`:null}function _({positions:e=[],usage:t,onConfirmTargetChange:n,isLoading:r,isError:i,isSaving:a,errorCode:s,onCreate:m,onRename:_,onSetKind:S,onDelete:C}){let[w,T]=(0,b.useState)(``),[E,D]=(0,b.useState)(null),O=e=>{D(e),n?.(e)},k=g(w),A=()=>{k||(m(w.trim()),T(``))};return(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Positions`}),r&&(0,x.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),i&&(0,x.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load positions. Please try again.`}),!r&&!i&&(0,x.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,x.jsxs)(`div`,{className:`flex gap-2`,children:[(0,x.jsx)(c,{"aria-label":`New position label`,value:w,placeholder:`e.g. Setter`,onChange:e=>T(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),A())}}),(0,x.jsx)(o,{disabled:a||!!k,onClick:A,children:`Add`})]}),s===`POSITION_LABEL_TAKEN`&&(0,x.jsx)(`p`,{className:`mt-1 text-sm text-red`,children:`That position already exists.`}),e.length===0?(0,x.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,x.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,x.jsx)(v,{position:e,isSaving:a,onRename:_,onSetKind:S,onRequestDelete:O},e.id))}),(0,x.jsx)(h,{open:E!==null,onOpenChange:e=>{e||O(null)},children:(0,x.jsxs)(d,{children:[(0,x.jsxs)(l,{children:[(0,x.jsx)(f,{children:`Delete position`}),(0,x.jsxs)(p,{children:[`Delete "`,E?.label,`"? This cannot be undone.`]})]}),(0,x.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:t?y(t):`Checking what uses this position…`}),(0,x.jsxs)(u,{children:[(0,x.jsx)(o,{variant:`outline`,onClick:()=>O(null),children:`Cancel`}),(0,x.jsx)(o,{variant:`destructive`,onClick:()=>{E&&C(E),O(null)},children:`Delete`})]})]})})]})]})}function v({position:e,isSaving:t,onRename:n,onSetKind:r,onRequestDelete:i}){let[a,s]=(0,b.useState)(e.label),l=a.trim().length>0&&a.trim()!==e.label;return(0,x.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,x.jsx)(c,{"aria-label":`Label for ${e.label}`,value:a,onChange:e=>s(e.target.value),className:`w-48`}),l&&(0,x.jsx)(o,{size:`sm`,disabled:t,onClick:()=>n(e.id,a.trim()),children:`Save`}),(0,x.jsxs)(`label`,{className:`flex items-center gap-1.5 text-sm text-muted-foreground`,children:[(0,x.jsx)(`input`,{type:`checkbox`,"aria-label":`${e.label} is staff`,className:`size-4 accent-green`,checked:e.kind===`STAFF`,disabled:t,onChange:t=>r(e.id,t.target.checked?`STAFF`:`PLAYING`)}),`Staff`]}),(0,x.jsx)(o,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>i(e),children:`Delete`})]})}function y(e){let t=[];return e.memberCount>0&&t.push(`${e.memberCount} ${e.memberCount===1?`member becomes`:`members become`} Unassigned`),e.eventTypeCount>0&&t.push(`it is dropped from ${e.eventTypeCount} event ${e.eventTypeCount===1?`type`:`types`}`),e.eventCount>0&&t.push(`and from ${e.eventCount} ${e.eventCount===1?`event`:`events`} with their own roster`),t.length===0?`Nothing currently uses this position.`:`${t.join(`, `)}.`}var b,x;function S(){return(S=e((()=>{b=t(),a(),s(),m(),x=n(),_.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/set-kind/delete mutations live in the ManagePositions container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},usage:{required:!1,tsType:{name:`PositionUsage`},description:'What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while\nit is still loading — the dialog says so rather than implying "nothing".'},onConfirmTargetChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(position: Position | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`Position | null`,elements:[{name:`Position`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Told which position the delete dialog is asking about, so the container can fetch its usage.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onSetKind:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, kind: PositionKind) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`PositionKind`},name:`kind`}],return:{name:`void`}}},description:`Reclassifies a position as played or staffed (#281). Applies at once — no Save to press.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var C,w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),S(),C=n(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],O=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],k={eventTypeCount:2,eventCount:1,memberCount:3},A={title:`features/manage-positions/ManagePositionsView`,component:_,args:{positions:D,onCreate:T(),onRename:T(),onSetKind:T(),onDelete:T()}},j={play:async({canvas:e})=>{await w(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await w(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await w(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2),await w(e.getByLabelText(`Setter is staff`)).not.toBeChecked(),await w(e.getByLabelText(`Libero is staff`)).not.toBeChecked()}},M={render:e=>(0,C.jsx)(i,{items:{Loading:(0,C.jsx)(_,{...e,isLoading:!0}),Error:(0,C.jsx)(_,{...e,isError:!0}),Empty:(0,C.jsx)(_,{...e,positions:[]}),"With a staff position":(0,C.jsx)(_,{...e,positions:O}),"Label taken":(0,C.jsx)(_,{...e,errorCode:`POSITION_LABEL_TAKEN`})}}),play:async({canvas:e})=>{let t=t=>E(e.getByRole(`region`,{name:t}));await w(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await w(t(`Loading`).queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument(),await w(t(`Error`).getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await w(t(`Error`).queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument(),await w(t(`Empty`).getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await w(t(`Empty`).getByRole(`button`,{name:`Add`})).toBeDisabled(),await w(t(`With a staff position`).getByLabelText(`Trainer is staff`)).toBeChecked(),await w(t(`With a staff position`).getByLabelText(`Setter is staff`)).not.toBeChecked(),await w(t(`Label taken`).getByText(`That position already exists.`)).toBeInTheDocument()}},N={args:{usage:k},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=E(document.body);await w(await r.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await w(r.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await w(r.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await w(r.getByRole(`button`,{name:`Delete`})).toBeEnabled(),await w(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await w(n.onDelete).not.toHaveBeenCalled()}},P={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,C.jsx)(i,{items:{Positions:(0,C.jsx)(_,{...e,usage:k}),Staff:(0,C.jsx)(_,{...e,positions:O}),Empty:(0,C.jsx)(_,{...e,positions:[]}),Unused:(0,C.jsx)(_,{...e,usage:{eventTypeCount:0,eventCount:0,memberCount:0}}),"Usage loading":(0,C.jsx)(_,{...e,usage:void 0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>E(e.getByRole(`region`,{name:t})),i=E(document.body);await t.click(r(`Positions`).getByLabelText(`Setter is staff`)),await w(n.onSetKind).toHaveBeenLastCalledWith(`p1`,`STAFF`),await t.click(r(`Staff`).getByLabelText(`Trainer is staff`)),await w(n.onSetKind).toHaveBeenLastCalledWith(`p3`,`PLAYING`),await t.type(r(`Empty`).getByLabelText(`New position label`),`Middle Blocker`),await t.click(r(`Empty`).getByRole(`button`,{name:`Add`})),await w(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`);let a=r(`Positions`).getByLabelText(`Label for Setter`);await t.clear(a),await t.type(a,`Middle Blocker`),await t.click(r(`Positions`).getByRole(`button`,{name:`Save`})),await w(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`),await t.click(r(`Positions`).getAllByRole(`button`,{name:`Delete`})[0]),await w(await i.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Delete`})),await w(n.onDelete).toHaveBeenCalledWith(D[0]),await t.click(r(`Unused`).getAllByRole(`button`,{name:`Delete`})[0]),await w(await i.findByText(`Nothing currently uses this position.`)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await t.click(r(`Usage loading`).getAllByRole(`button`,{name:`Delete`})[0]),await w(await i.findByText(`Checking what uses this position…`)).toBeInTheDocument(),await w(i.queryByText(/Nothing currently uses/)).not.toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`}))}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter');
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero');
    await expect(canvas.getAllByRole('button', {
      name: 'Delete'
    })).toHaveLength(2);
    // The staff toggle's resting state (#281): a team that has marked nothing sees every box clear,
    // so the distinction costs an existing admin no attention until they want it.
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked();
    await expect(canvas.getByLabelText('Libero is staff')).not.toBeChecked();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    usage: USAGE
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
    const dialog = within(document.body);
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
    const dialog = within(document.body);

    // The gesture is the flip itself — no Save to press, unlike the label beside it.
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

    // The per-row Save button only appears once the label is edited to a new, non-empty value.
    const field = region('Positions').getByLabelText('Label for Setter');
    await userEvent.clear(field);
    await userEvent.type(field, 'Middle Blocker');
    await userEvent.click(region('Positions').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker');

    // Confirming the blast-radius dialog fires the delete and closes it.
    await userEvent.click(region('Positions').getAllByRole('button', {
      name: 'Delete'
    })[0]);
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Delete'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0]);

    // A position nothing uses reads as a clean removal rather than a list of three zeroes.
    await userEvent.click(region('Unused').getAllByRole('button', {
      name: 'Delete'
    })[0]);
    await expect(await dialog.findByText('Nothing currently uses this position.')).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Cancel'
    }));

    // The usage query is admin-only and fires when the dialog opens, so there is a moment with no
    // answer yet. It must not read as "nothing uses this".
    await userEvent.click(region('Usage loading').getAllByRole('button', {
      name: 'Delete'
    })[0]);
    await expect(await dialog.findByText('Checking what uses this position…')).toBeInTheDocument();
    await expect(dialog.queryByText(/Nothing currently uses/)).not.toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Cancel'
    }));
  }
}`,...P.parameters?.docs?.source}}},F=[`Data`,`Shells`,`DeleteConfirmOpen`,`Interactions`]})))()}I();export{j as Data,N as DeleteConfirmOpen,P as Interactions,M as Shells,F as __namedExportsOrder,A as default};