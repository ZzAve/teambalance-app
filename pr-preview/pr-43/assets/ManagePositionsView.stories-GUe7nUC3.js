import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-7ra-rxTo.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{i as r,n as i,r as a,t as o}from"./input-DSfQ-uEk.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-CcZSRYSQ.js";function m(e){return e.trim().length===0?`A label is required.`:null}function h({positions:e,isSaving:t,errorCode:n,onCreate:r,onRename:i,onDelete:f}){let[h,y]=(0,_.useState)(``),[b,x]=(0,_.useState)(null),S=m(h),C=()=>{S||(r(h.trim()),y(``))};return(0,v.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsxs)(`div`,{className:`flex gap-2`,children:[(0,v.jsx)(o,{"aria-label":`New position label`,value:h,placeholder:`e.g. Setter`,onChange:e=>y(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),C())}}),(0,v.jsx)(a,{disabled:t||!!S,onClick:C,children:`Add`})]}),n===`POSITION_LABEL_TAKEN`&&(0,v.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:`That position already exists.`})]}),e.length===0?(0,v.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No positions yet. Add one above.`}):(0,v.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,v.jsx)(g,{position:e,isSaving:t,onRename:i,onRequestDelete:x},e.id))}),(0,v.jsx)(p,{open:b!==null,onOpenChange:e=>{e||x(null)},children:(0,v.jsxs)(l,{children:[(0,v.jsxs)(s,{children:[(0,v.jsx)(u,{children:`Delete position`}),(0,v.jsxs)(d,{children:[`Delete "`,b?.label,`"? Members with this position will become Unassigned.`]})]}),(0,v.jsxs)(c,{children:[(0,v.jsx)(a,{variant:`outline`,onClick:()=>x(null),children:`Cancel`}),(0,v.jsx)(a,{variant:`destructive`,onClick:()=>{b&&f(b),x(null)},children:`Delete`})]})]})})]})}function g({position:e,isSaving:t,onRename:n,onRequestDelete:r}){let[i,s]=(0,_.useState)(e.label),c=i.trim().length>0&&i.trim()!==e.label;return(0,v.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,v.jsx)(o,{"aria-label":`Label for ${e.label}`,value:i,onChange:e=>s(e.target.value),className:`w-48`}),c&&(0,v.jsx)(a,{size:`sm`,disabled:t,onClick:()=>n(e.id,i.trim()),children:`Save`}),(0,v.jsx)(a,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:t,onClick:()=>r(e),children:`Delete`})]})}var _,v;function y(){return(y=e((()=>{_=t(),r(),i(),f(),v=n(),h.__docgenInfo={description:`Presentational positions-management UI. Owns only local view state (the new-label field, per-row
edits, the delete-confirm dialog target); the query and the create/rename/delete mutations live in
the ManagePositions container. Props-only, so every state (empty / with items / delete-confirm /
label-taken) renders as a story.`,methods:[],displayName:`ManagePositionsView`,props:{positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onRename:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, label: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`label`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: Position) => void`,signature:{arguments:[{type:{name:`Position`},name:`position`}],return:{name:`void`}}},description:``}}}})))()}var b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{y(),{expect:b,fn:x,within:S}=__STORYBOOK_MODULE_TEST__,C=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],w={title:`features/manage-positions/ManagePositionsView`,component:h,args:{positions:C,onCreate:x(),onRename:x(),onDelete:x()}},T={args:{positions:[]},play:async({canvas:e})=>{await b(e.getByText(`No positions yet. Add one above.`)).toBeInTheDocument(),await b(e.getByRole(`button`,{name:`Add`})).toBeDisabled()}},E={play:async({canvas:e})=>{await b(e.getByLabelText(`Label for Setter`)).toHaveValue(`Setter`),await b(e.getByLabelText(`Label for Libero`)).toHaveValue(`Libero`),await b(e.getAllByRole(`button`,{name:`Delete`})).toHaveLength(2)}},D={args:{positions:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`New position label`),`Middle Blocker`),await t.click(e.getByRole(`button`,{name:`Add`})),await b(n.onCreate).toHaveBeenCalledWith(`Middle Blocker`)}},O={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Delete`})[0]);let r=S(document.body);await b(await r.findByText(/Members with this position will become Unassigned/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Delete`})),await b(n.onDelete).toHaveBeenCalledWith(C[0])}},k={args:{errorCode:`POSITION_LABEL_TAKEN`},play:async({canvas:e})=>{await b(e.getByText(`That position already exists.`)).toBeInTheDocument()}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter');
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero');
    await expect(canvas.getAllByRole('button', {
      name: 'Delete'
    })).toHaveLength(2);
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'POSITION_LABEL_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A=[`Empty`,`WithItems`,`CreatePosition`,`DeleteConfirm`,`LabelTaken`]})))()}j();export{D as CreatePosition,O as DeleteConfirm,T as Empty,k as LabelTaken,E as WithItems,A as __namedExportsOrder,w as default};