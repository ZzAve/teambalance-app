import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CE5Op-I7.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-Cbo7_Esi.js";import{n as a,t as o}from"./input-DrBilFn3.js";import{n as s,t as c}from"./label-Dg7QUUk_.js";import{n as l,t as u}from"./PositionPicker-CXk7REPy.js";function d(e){let t=e.trim();return t.length===0?`Display name is required.`:t.length>f?`Display name must be ${f} characters or fewer.`:null}var f;function p(){return(p=e((()=>{f=100})))()}function m(e,t){return e.length===0||t?null:`Please select a position.`}function h({currentName:e,positions:t,currentPositionId:n,isSaving:r,onSubmit:a,errorCode:s}){let[l,f]=(0,g.useState)(e),[p,h]=(0,g.useState)(n),[v,y]=(0,g.useState)(!1),b=d(l),x=m(t,p),S=b??x;return(0,_.jsxs)(`form`,{onSubmit:e=>{if(e.preventDefault(),S){y(!0);return}a(l.trim(),p)},className:`flex flex-col gap-4`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(c,{htmlFor:`displayName`,children:`Display name`}),(0,_.jsx)(o,{id:`displayName`,name:`displayName`,value:l,onChange:e=>{f(e.target.value),y(!0)},"aria-invalid":v&&b?!0:void 0,placeholder:`Your name`}),v&&b&&(0,_.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:b}),s===`NAME_TAKEN`&&(0,_.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:`That display name is already taken.`})]}),t.length>0&&(0,_.jsxs)(`div`,{children:[(0,_.jsx)(c,{htmlFor:`position`,children:`Position`}),(0,_.jsx)(u,{"aria-label":`Position`,positions:t,value:p,onChange:e=>{h(e),y(!0)}}),v&&x&&(0,_.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:x})]}),(0,_.jsx)(i,{type:`submit`,disabled:r||!!S,children:r?`Saving...`:`Save`})]})}var g,_;function v(){return(v=e((()=>{g=t(),l(),r(),a(),s(),p(),_=n(),h.__docgenInfo={description:`Presentational edit-profile form. Owns only the local field + touched state; the current member
query and the update mutation live in the /profile route container. Because it takes props and
never touches the network, every state (default, editing, saving, name-taken, position) is a story.
The position picker is required-when-available: shown (and mandatory) only if the team has positions.`,methods:[],displayName:`EditProfileForm`,props:{currentName:{required:!0,tsType:{name:`string`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary. Empty → the picker is hidden and position is left untouched.`},currentPositionId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},isSaving:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},errorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator surfaced by the container (e.g. "NAME_TAKEN").`}}}})))()}var y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{v(),{expect:y,fn:b,within:x}=__STORYBOOK_MODULE_TEST__,S=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],C={title:`features/edit-profile/EditProfileForm`,component:h,args:{currentName:`Ada Lovelace`,positions:[],currentPositionId:null,isSaving:!1,onSubmit:b()}},w={play:async({canvas:e})=>{await y(e.getByLabelText(`Display name`)).toHaveValue(`Ada Lovelace`),await y(e.queryByLabelText(`Position`)).not.toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},T={play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`Display name`);await t.clear(n),await t.type(n,`Grace Hopper`),await y(n).toHaveValue(`Grace Hopper`),await y(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},E={args:{isSaving:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Saving...`});await y(t).toBeInTheDocument(),await y(t).toBeDisabled()}},D={args:{errorCode:`NAME_TAKEN`},play:async({canvas:e})=>{await y(e.getByText(`That display name is already taken.`)).toBeInTheDocument()}},O={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name`);await t.clear(r),await t.type(r,`Grace Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await y(n.onSubmit).toHaveBeenCalledWith(`Grace Hopper`,null)}},k={args:{positions:S,currentPositionId:null},play:async({canvas:e,userEvent:t,args:n})=>{await y(e.getByLabelText(`Position`)).toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Save`})).toBeDisabled(),await t.click(e.getByLabelText(`Position`)),await t.click(await x(document.body).findByRole(`option`,{name:`Libero`}));let r=e.getByRole(`button`,{name:`Save`});await y(r).toBeEnabled(),await t.click(r),await y(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p2`)}},A={args:{positions:S,currentPositionId:`p1`},play:async({canvas:e,userEvent:t,args:n})=>{await y(x(e.getByLabelText(`Position`)).getByText(`Setter`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save`})),await y(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p1`)}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Ada Lovelace');
    // No positions defined for the team → no picker is shown.
    await expect(canvas.queryByLabelText('Position')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Save'
    })).toBeEnabled();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    const input = canvas.getByLabelText('Display name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Grace Hopper');
    await expect(input).toHaveValue('Grace Hopper');
    await expect(canvas.getByRole('button', {
      name: 'Save'
    })).toBeEnabled();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    isSaving: true
  },
  play: async ({
    canvas
  }) => {
    const save = canvas.getByRole('button', {
      name: 'Saving...'
    });
    await expect(save).toBeInTheDocument();
    await expect(save).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'NAME_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That display name is already taken.')).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const input = canvas.getByLabelText('Display name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Grace Hopper');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper', null);
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    positions: POSITIONS,
    currentPositionId: null
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByLabelText('Position')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Save'
    })).toBeDisabled();
    await userEvent.click(canvas.getByLabelText('Position'));
    await userEvent.click(await within(document.body).findByRole('option', {
      name: 'Libero'
    }));
    const save = canvas.getByRole('button', {
      name: 'Save'
    });
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p2');
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    positions: POSITIONS,
    currentPositionId: 'p1'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(within(canvas.getByLabelText('Position')).getByText('Setter')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p1');
  }
}`,...A.parameters?.docs?.source}}},j=[`Default`,`Editing`,`Saving`,`NameTakenError`,`SavedSuccess`,`PositionRequired`,`PositionPreselected`]})))()}M();export{w as Default,T as Editing,D as NameTakenError,A as PositionPreselected,k as PositionRequired,O as SavedSuccess,E as Saving,j as __namedExportsOrder,C as default};