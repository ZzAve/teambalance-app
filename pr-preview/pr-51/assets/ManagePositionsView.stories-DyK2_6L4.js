import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-btLskBPn.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{i,n as a,r as o,t as s}from"./input-BotE4w4X.js";import{a as c,i as l,n as u,o as d,r as f,s as p,t as m}from"./dialog-D9zQOQNL.js";function h(e){return e.trim().length===0?`A label is required.`:null}var g=e((()=>{}));function _({positions:e,isSaving:t,errorCode:n,onCreate:r,onRename:i,onDelete:a}){let[p,g]=(0,y.useState)(``),[_,x]=(0,y.useState)(null),S=h(p),C=()=>{S||(r(p.trim()),g(``))};return(0,b.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{className:`flex gap-2`,children:[(0,b.jsx)(s,{"aria-label":`New position label`,value:p,placeholder:`e.g. Setter`,onChange:e=>g(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),C())}}),(0,b.jsx)(o,{disabled:t||!!S,onClick:C,children:`Add`})]}),n===`POSITION_LABEL_TAKEN`&&(0,b.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:`That position already exists.`})]}),e.length===0?(0,b.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,b.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,b.jsx)(v,{position:e,isSaving:t,onRename:i,onRequestDelete:x},e.id))}),(0,b.jsx)(m,{open:_!==null,onOpenChange:e=>{e||x(null)},children:(0,b.jsxs)(u,{children:[(0,b.jsxs)(c,{children:[(0,b.jsx)(d,{children:`Delete position`}),(0,b.jsxs)(f,{children:[`Delete "`,_?.label,`"? Members with this position will become Unassigned.`]})]}),(0,b.jsxs)(l,{children:[(0,b.jsx)(o,{variant:`outline`,onClick:()=>x(null),children:`Cancel`}),(0,b.jsx)(o,{variant:`destructive`,onClick:()=>{_&&a(_),x(null)},children:`Delete`})]})]})})]})}function v({position:e,isSaving:t,onRename:n,onRequestDelete:r}){let[i,a]=(0,y.useState)(e.label),c=i.trim().length>0&&i.trim()!==e.label;return(0,b.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,b.jsx)(s,{"aria-label":`Label for ${e.label}`,value:i,onChange:e=>a(e.target.value),className:`w-48`}),c&&(0,b.jsx)(o,{size:`sm`,disabled:t,onClick:()=>n(e.id,i.trim()),children:`Save`}),(0,b.jsx)(o,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>r(e),children:`Delete`})]})}var y,b,x=e((()=>{y=t(n(),1),i(),a(),p(),g(),b=r(),_.__docgenInfo={description:`Presentational positions-management UI. Owns only local view state (the new-label field, per-row
edits, the delete-confirm dialog target); the query and the create/rename/delete mutations live in
the ManagePositions container. Props-only, so every state (empty / with items / delete-confirm /
label-taken) renders as a story.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})),S,C,w,T,E,D,O,k,A,j,M;e((()=>{x(),{expect:S,fn:C,within:w}=__STORYBOOK_MODULE_TEST__,T=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],E={title:`features/manage-positions/ManagePositionsView`,component:_,args:{positions:T,onCreate:C(),onRename:C(),onDelete:C()}},D={args:{positions:[]},play:async({canvas:e})=>{await S(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await S(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},O={play:async({canvas:e})=>{await S(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await S(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await S(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2)}},k={args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await S(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},A={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=w(document.body);await S(await r.findByText(/Members with this position will become Unassigned/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Delete`})),await S(n.onDelete).toHaveBeenCalledWith(T[0])}},j={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await S(e.getByText(`That position already exists.`)).toBeInTheDocument()}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M=[`Empty`,`WithItems`,`CreatePosition`,`DeleteConfirm`,`LabelTaken`]}))();export{k as CreatePosition,A as DeleteConfirm,D as Empty,j as LabelTaken,O as WithItems,M as __namedExportsOrder,E as default};