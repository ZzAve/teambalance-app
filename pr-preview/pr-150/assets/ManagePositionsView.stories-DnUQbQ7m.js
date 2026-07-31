import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-MJ8FevkI.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{i,n as a,r as o,t as s}from"./input-n3IZEKWy.js";import{a as c,i as l,n as u,o as d,r as f,s as p,t as m}from"./dialog-BW8YWmAF.js";function h(e){return e.trim().length===0?`A label is required.`:null}var g=e((()=>{}));function _({positions:e=[],isLoading:t,isError:n,isSaving:r,errorCode:i,onCreate:a,onRename:p,onDelete:g}){let[_,x]=(0,y.useState)(``),[S,C]=(0,y.useState)(null),w=h(_),T=()=>{w||(a(_.trim()),x(``))};return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Positions`}),t&&(0,b.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,b.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load positions. Please try again.`}),!t&&!n&&(0,b.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,b.jsxs)(`div`,{className:`flex gap-2`,children:[(0,b.jsx)(s,{"aria-label":`New position label`,value:_,placeholder:`e.g. Setter`,onChange:e=>x(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),T())}}),(0,b.jsx)(o,{disabled:r||!!w,onClick:T,children:`Add`})]}),i===`POSITION_LABEL_TAKEN`&&(0,b.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:`That position already exists.`}),e.length===0?(0,b.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,b.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,b.jsx)(v,{position:e,isSaving:r,onRename:p,onRequestDelete:C},e.id))}),(0,b.jsx)(m,{open:S!==null,onOpenChange:e=>{e||C(null)},children:(0,b.jsxs)(u,{children:[(0,b.jsxs)(c,{children:[(0,b.jsx)(d,{children:`Delete position`}),(0,b.jsxs)(f,{children:[`Delete "`,S?.label,`"? Members with this position will become Unassigned.`]})]}),(0,b.jsxs)(l,{children:[(0,b.jsx)(o,{variant:`outline`,onClick:()=>C(null),children:`Cancel`}),(0,b.jsx)(o,{variant:`destructive`,onClick:()=>{S&&g(S),C(null)},children:`Delete`})]})]})})]})]})}function v({position:e,isSaving:t,onRename:n,onRequestDelete:r}){let[i,a]=(0,y.useState)(e.label),c=i.trim().length>0&&i.trim()!==e.label;return(0,b.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,b.jsx)(s,{"aria-label":`Label for ${e.label}`,value:i,onChange:e=>a(e.target.value),className:`w-48`}),c&&(0,b.jsx)(o,{size:`sm`,disabled:t,onClick:()=>n(e.id,i.trim()),children:`Save`}),(0,b.jsx)(o,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>r(e),children:`Delete`})]})}var y,b,x=e((()=>{y=t(n(),1),i(),a(),p(),g(),b=r(),_.__docgenInfo={description:`Presentational positions-management UI — the complete section, heading and all. Owns only local
view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
the create/rename/delete mutations live in the ManagePositions container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
renders purely from props as a story, with no network. See ADR-0017.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:`The positions query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The positions query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})),S,C,w,T,E,D,O,k,A,j,M,N,P,F;e((()=>{x(),{expect:S,fn:C,within:w}=__STORYBOOK_MODULE_TEST__,T=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],E={title:`features/manage-positions/ManagePositionsView`,component:_,args:{positions:T,onCreate:C(),onRename:C(),onDelete:C()}},D={args:{isLoading:!0},play:async({canvas:e})=>{await S(e.getByText(`Loading…`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},O={args:{isError:!0},play:async({canvas:e})=>{await S(e.getByText(`Couldn't load positions. Please try again.`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Add`})).not.toBeInTheDocument()}},k={args:{positions:[]},play:async({canvas:e})=>{await S(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await S(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},A={play:async({canvas:e})=>{await S(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await S(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await S(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2)}},j={args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await S(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},M={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Label for Setter`);await t.clear(r),await t.type(r,`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Save`})),await S(n.onRename).toHaveBeenCalledWith(`p1`,`Middle Blocker`)}},N={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=w(document.body);await S(await r.findByText(/Members with this position will become Unassigned/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Delete`})),await S(n.onDelete).toHaveBeenCalledWith(T[0])}},P={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await S(e.getByText(`That position already exists.`)).toBeInTheDocument()}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...P.parameters?.docs?.source}}},F=[`Loading`,`ErrorState`,`Empty`,`WithItems`,`CreatePosition`,`RenamePosition`,`DeleteConfirm`,`LabelTaken`]}))();export{j as CreatePosition,N as DeleteConfirm,k as Empty,O as ErrorState,P as LabelTaken,D as Loading,M as RenamePosition,A as WithItems,F as __namedExportsOrder,E as default};