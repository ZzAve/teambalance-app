import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BmKi-jTa.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-DAwrIbnS.js";import{n as a,t as o}from"./input-BVgOUDpS.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-BwV-kTOz.js";function m(e){return e.trim().length===0?`A label is required.`:null}function h({positions:e=[],isLoading:t,isError:n,isSaving:r,errorCode:a,onCreate:f,onRename:h,onDelete:y}){let[b,x]=(0,_.useState)(``),[S,C]=(0,_.useState)(null),w=m(b),T=()=>{w||(f(b.trim()),x(``))};return(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Positions`}),t&&(0,v.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,v.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load positions. Please try again.`}),!t&&!n&&(0,v.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,v.jsxs)(`div`,{className:`flex gap-2`,children:[(0,v.jsx)(o,{"aria-label":`New position label`,value:b,placeholder:`e.g. Setter`,onChange:e=>x(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),T())}}),(0,v.jsx)(i,{disabled:r||!!w,onClick:T,children:`Add`})]}),a===`POSITION_LABEL_TAKEN`&&(0,v.jsx)(`p`,{className:`mt-1 text-sm text-red`,children:`That position already exists.`}),e.length===0?(0,v.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,v.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,v.jsx)(g,{position:e,isSaving:r,onRename:h,onRequestDelete:C},e.id))}),(0,v.jsx)(p,{open:S!==null,onOpenChange:e=>{e||C(null)},children:(0,v.jsxs)(l,{children:[(0,v.jsxs)(s,{children:[(0,v.jsx)(u,{children:`Delete position`}),(0,v.jsxs)(d,{children:[`Delete "`,S?.label,`"? Members with this position will become Unassigned.`]})]}),(0,v.jsxs)(c,{children:[(0,v.jsx)(i,{variant:`outline`,onClick:()=>C(null),children:`Cancel`}),(0,v.jsx)(i,{variant:`destructive`,onClick:()=>{S&&y(S),C(null)},children:`Delete`})]})]})})]})]})}function g({position:e,isSaving:t,onRename:n,onRequestDelete:r}){let[a,s]=(0,_.useState)(e.label),c=a.trim().length>0&&a.trim()!==e.label;return(0,v.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,v.jsx)(o,{"aria-label":`Label for ${e.label}`,value:a,onChange:e=>s(e.target.value),className:`w-48`}),c&&(0,v.jsx)(i,{size:`sm`,disabled:t,onClick:()=>n(e.id,a.trim()),children:`Save`}),(0,v.jsx)(i,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>r(e),children:`Delete`})]})}var _,v;function y(){return(y=e((()=>{_=t(),r(),a(),f(),v=n(),h.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/delete mutations live in the ManagePositions container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var b,x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{y(),{expect:b,fn:x,within:S}=__STORYBOOK_MODULE_TEST__,C=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],w={title:`features/manage-positions/ManagePositionsView`,component:h,args:{positions:C,onCreate:x(),onRename:x(),onDelete:x()}},T={args:{isLoading:!0},play:async({canvas:e})=>{await b(e.getByText(`Loading…`)).toBeInTheDocument(),await b(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},E={args:{isError:!0},play:async({canvas:e})=>{await b(e.getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await b(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},D={args:{positions:[]},play:async({canvas:e})=>{await b(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await b(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},O={play:async({canvas:e})=>{await b(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await b(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await b(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2)}},k={args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await b(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},A={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Label for Setter`);await t.clear(r),await t.type(r,`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Save`})),await b(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`)}},j={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=S(document.body);await b(await r.findByText(/Members with this position will become Unassigned/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Delete`})),await b(n.onDelete).toHaveBeenCalledWith(C[0])}},M={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await b(e.getByText(`That position already exists.`)).toBeInTheDocument()}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter');
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero');
    await expect(canvas.getAllByRole('button', {
      name: 'Delete'
    })).toHaveLength(2);
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Delete'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Members with this position will become Unassigned/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Delete'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0]);
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N=[`Loading`,`ErrorState`,`Empty`,`WithItems`,`CreatePosition`,`RenamePosition`,`DeleteConfirm`,`LabelTaken`]})))()}P();export{k as CreatePosition,j as DeleteConfirm,D as Empty,E as ErrorState,M as LabelTaken,T as Loading,A as RenamePosition,O as WithItems,N as __namedExportsOrder,w as default};