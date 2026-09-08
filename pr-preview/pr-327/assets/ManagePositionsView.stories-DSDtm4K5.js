import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-StyIOmYf.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-nOYVF7IV.js";import{n as a,t as o}from"./input-BVd2bvI3.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-BkK5cRT-.js";function m(e){return e.trim().length===0?`A label is required.`:null}function h({positions:e=[],usage:t,onConfirmTargetChange:n,isLoading:r,isError:a,isSaving:f,errorCode:h,onCreate:b,onRename:x,onSetKind:S,onDelete:C}){let[w,T]=(0,v.useState)(``),[E,D]=(0,v.useState)(null),O=e=>{D(e),n?.(e)},k=m(w),A=()=>{k||(b(w.trim()),T(``))};return(0,y.jsxs)(`div`,{children:[(0,y.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Positions`}),r&&(0,y.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),a&&(0,y.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load positions. Please try again.`}),!r&&!a&&(0,y.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,y.jsxs)(`div`,{className:`flex gap-2`,children:[(0,y.jsx)(o,{"aria-label":`New position label`,value:w,placeholder:`e.g. Setter`,onChange:e=>T(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),A())}}),(0,y.jsx)(i,{disabled:f||!!k,onClick:A,children:`Add`})]}),h===`POSITION_LABEL_TAKEN`&&(0,y.jsx)(`p`,{className:`mt-1 text-sm text-red`,children:`That position already exists.`}),e.length===0?(0,y.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,y.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,y.jsx)(g,{position:e,isSaving:f,onRename:x,onSetKind:S,onRequestDelete:O},e.id))}),(0,y.jsx)(p,{open:E!==null,onOpenChange:e=>{e||O(null)},children:(0,y.jsxs)(l,{children:[(0,y.jsxs)(s,{children:[(0,y.jsx)(u,{children:`Delete position`}),(0,y.jsxs)(d,{children:[`Delete "`,E?.label,`"? This cannot be undone.`]})]}),(0,y.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:t?_(t):`Checking what uses this position…`}),(0,y.jsxs)(c,{children:[(0,y.jsx)(i,{variant:`outline`,onClick:()=>O(null),children:`Cancel`}),(0,y.jsx)(i,{variant:`destructive`,onClick:()=>{E&&C(E),O(null)},children:`Delete`})]})]})})]})]})}function g({position:e,isSaving:t,onRename:n,onSetKind:r,onRequestDelete:a}){let[s,c]=(0,v.useState)(e.label),l=s.trim().length>0&&s.trim()!==e.label;return(0,y.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,y.jsx)(o,{"aria-label":`Label for ${e.label}`,value:s,onChange:e=>c(e.target.value),className:`w-48`}),l&&(0,y.jsx)(i,{size:`sm`,disabled:t,onClick:()=>n(e.id,s.trim()),children:`Save`}),(0,y.jsxs)(`label`,{className:`flex items-center gap-1.5 text-sm text-muted-foreground`,children:[(0,y.jsx)(`input`,{type:`checkbox`,"aria-label":`${e.label} is staff`,className:`size-4 accent-green`,checked:e.kind===`STAFF`,disabled:t,onChange:t=>r(e.id,t.target.checked?`STAFF`:`PLAYING`)}),`Staff`]}),(0,y.jsx)(i,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>a(e),children:`Delete`})]})}function _(e){let t=[];return e.memberCount>0&&t.push(`${e.memberCount} ${e.memberCount===1?`member becomes`:`members become`} Unassigned`),e.eventTypeCount>0&&t.push(`it is dropped from ${e.eventTypeCount} event ${e.eventTypeCount===1?`type`:`types`}`),e.eventCount>0&&t.push(`and from ${e.eventCount} ${e.eventCount===1?`event`:`events`} with their own roster`),t.length===0?`Nothing currently uses this position.`:`${t.join(`, `)}.`}var v,y;function b(){return(b=e((()=>{v=t(),r(),a(),f(),y=n(),h.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/set-kind/delete mutations live in the ManagePositions container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},usage:{required:!1,tsType:{name:`PositionUsage`},description:'What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while\nit is still loading — the dialog says so rather than implying "nothing".'},onConfirmTargetChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(position: Position | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`Position | null`,elements:[{name:`Position`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Told which position the delete dialog is asking about, so the container can fetch its usage.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onSetKind:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, kind: PositionKind) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`PositionKind`},name:`kind`}],return:{name:`void`}}},description:`Reclassifies a position as played or staffed (#281). Applies at once — no Save to press.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{b(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,w=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],T=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p3`,label:`Trainer`,kind:`STAFF`}],E={title:`features/manage-positions/ManagePositionsView`,component:h,args:{positions:w,onCreate:S(),onRename:S(),onSetKind:S(),onDelete:S()}},D={args:{isLoading:!0},play:async({canvas:e})=>{await x(e.getByText(`Loading…`)).toBeInTheDocument(),await x(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},O={args:{isError:!0},play:async({canvas:e})=>{await x(e.getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await x(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},k={args:{positions:[]},play:async({canvas:e})=>{await x(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await x(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},A={play:async({canvas:e})=>{await x(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await x(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await x(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2)}},j={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await x(e.getByLabelText(`Setter is staff`)).not.toBeChecked(),await x(e.getByLabelText(`Libero is staff`)).not.toBeChecked()}},M={args:{positions:T},play:async({canvas:e})=>{await x(e.getByLabelText(`Trainer is staff`)).toBeChecked(),await x(e.getByLabelText(`Setter is staff`)).not.toBeChecked()}},N={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Setter is staff`)),await x(n.onSetKind).toHaveBeenCalledWith(`p1`,`STAFF`)}},P={parameters:{chromatic:{disableSnapshot:!0}},args:{positions:T},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Trainer is staff`)),await x(n.onSetKind).toHaveBeenCalledWith(`p3`,`PLAYING`)}},F={parameters:{chromatic:{disableSnapshot:!0}},args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await x(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},I={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Label for Setter`);await t.clear(r),await t.type(r,`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Save`})),await x(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`)}},L={parameters:{chromatic:{disableSnapshot:!0}},args:{usage:{eventTypeCount:2,eventCount:1,memberCount:3}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=C(document.body);await x(await r.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await x(r.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await x(r.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Delete`})),await x(n.onDelete).toHaveBeenCalledWith(w[0])}},R={args:{usage:{eventTypeCount:2,eventCount:1,memberCount:3}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=C(document.body);await x(await r.findByText(/3 members become Unassigned/)).toBeInTheDocument(),await x(r.getByText(/dropped from 2 event types/)).toBeInTheDocument(),await x(r.getByText(/from 1 event with their own roster/)).toBeInTheDocument(),await x(r.getByRole(`button`,{name:`Delete`})).toBeEnabled(),await x(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await x(n.onDelete).not.toHaveBeenCalled()}},z={args:{usage:{eventTypeCount:0,eventCount:0,memberCount:0}},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let n=C(document.body);await x(await n.findByText(`Nothing currently uses this position.`)).toBeInTheDocument()}},B={args:{usage:void 0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let n=C(document.body);await x(await n.findByText(`Checking what uses this position…`)).toBeInTheDocument(),await x(n.queryByText(/Nothing currently uses/)).not.toBeInTheDocument()}},V={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await x(e.getByText(`That position already exists.`)).toBeInTheDocument()}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter');
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero');
    await expect(canvas.getAllByRole('button', {
      name: 'Delete'
    })).toHaveLength(2);
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    positions: WITH_STAFF
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Trainer is staff')).toBeChecked();
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // The per-row Save button only appears once the label is edited to a new, non-empty value.
    const field = canvas.getByLabelText('Label for Setter');
    await userEvent.clear(field);
    await userEvent.type(field, 'Middle Blocker');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker');
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText('Nothing currently uses this position.')).toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    usage: undefined
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText('Checking what uses this position…')).toBeInTheDocument();
    await expect(dialog.queryByText(/Nothing currently uses/)).not.toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H=[`Loading`,`ErrorState`,`Empty`,`WithItems`,`StaffToggleOff`,`WithStaffPosition`,`MarkPositionStaff`,`MarkPositionPlaying`,`CreatePosition`,`RenamePosition`,`DeleteConfirm`,`DeleteConfirmUsageCounts`,`DeleteConfirmUnused`,`DeleteConfirmUsageLoading`,`LabelTaken`]})))()}U();export{F as CreatePosition,L as DeleteConfirm,z as DeleteConfirmUnused,R as DeleteConfirmUsageCounts,B as DeleteConfirmUsageLoading,k as Empty,O as ErrorState,V as LabelTaken,D as Loading,P as MarkPositionPlaying,N as MarkPositionStaff,I as RenamePosition,j as StaffToggleOff,A as WithItems,M as WithStaffPosition,H as __namedExportsOrder,E as default};