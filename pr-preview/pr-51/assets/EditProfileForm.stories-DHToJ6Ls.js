import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-btLskBPn.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{i,n as a,r as o,t as s}from"./input-BotE4w4X.js";import{n as c,t as l}from"./label-D1JBlC9w.js";import{n as u,t as d}from"./PositionPicker-CBNPP8J3.js";function f(e){let t=e.trim();return t.length===0?`Display name is required.`:t.length>p?`Display name must be ${p} characters or fewer.`:null}var p,m=e((()=>{p=100}));function h(e,t){return e.length===0||t?null:`Please select a position.`}var g=e((()=>{}));function _({currentName:e,positions:t,currentPositionId:n,isSaving:r,onSubmit:i,errorCode:a}){let[c,u]=(0,v.useState)(e),[p,m]=(0,v.useState)(n),[g,_]=(0,v.useState)(!1),b=f(c),x=h(t,p),S=b??x;return(0,y.jsxs)(`form`,{onSubmit:e=>{if(e.preventDefault(),S){_(!0);return}i(c.trim(),p)},className:`flex flex-col gap-4`,children:[(0,y.jsxs)(`div`,{children:[(0,y.jsx)(l,{htmlFor:`displayName`,children:`Display name`}),(0,y.jsx)(s,{id:`displayName`,name:`displayName`,value:c,onChange:e=>{u(e.target.value),_(!0)},"aria-invalid":g&&b?!0:void 0,placeholder:`Your name`}),g&&b&&(0,y.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:b}),a===`NAME_TAKEN`&&(0,y.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:`That display name is already taken.`})]}),t.length>0&&(0,y.jsxs)(`div`,{children:[(0,y.jsx)(l,{htmlFor:`position`,children:`Position`}),(0,y.jsx)(d,{"aria-label":`Position`,positions:t,value:p,onChange:e=>{m(e),_(!0)}}),g&&x&&(0,y.jsx)(`p`,{className:`mt-1 text-sm text-red-500`,children:x})]}),(0,y.jsx)(o,{type:`submit`,disabled:r||!!S,children:r?`Saving...`:`Save`})]})}var v,y,b=e((()=>{v=t(n(),1),u(),i(),a(),c(),m(),g(),y=r(),_.__docgenInfo={description:`Presentational edit-profile form. Owns only the local field + touched state; the current member
query and the update mutation live in the /profile route container. Because it takes props and
never touches the network, every state (default, editing, saving, name-taken, position) is a story.
The position picker is required-when-available: shown (and mandatory) only if the team has positions.`,methods:[],displayName:`EditProfileForm`,props:{currentName:{required:!0,tsType:{name:`string`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary. Empty → the picker is hidden and position is left untouched.`},currentPositionId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},isSaving:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:``},errorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator surfaced by the container (e.g. "NAME_TAKEN").`}}}})),x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{b(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,w=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],T={title:`features/edit-profile/EditProfileForm`,component:_,args:{currentName:`Ada Lovelace`,positions:[],currentPositionId:null,isSaving:!1,onSubmit:S()}},E={play:async({canvas:e})=>{await x(e.getByLabelText(`Display name`)).toHaveValue(`Ada Lovelace`),await x(e.queryByLabelText(`Position`)).not.toBeInTheDocument(),await x(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},D={play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`Display name`);await t.clear(n),await t.type(n,`Grace Hopper`),await x(n).toHaveValue(`Grace Hopper`),await x(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},O={args:{isSaving:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Saving...`});await x(t).toBeInTheDocument(),await x(t).toBeDisabled()}},k={args:{errorCode:`NAME_TAKEN`},play:async({canvas:e})=>{await x(e.getByText(`That display name is already taken.`)).toBeInTheDocument()}},A={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Display name`);await t.clear(r),await t.type(r,`Grace Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await x(n.onSubmit).toHaveBeenCalledWith(`Grace Hopper`,null)}},j={args:{positions:w,currentPositionId:null},play:async({canvas:e,userEvent:t,args:n})=>{await x(e.getByLabelText(`Position`)).toBeInTheDocument(),await x(e.getByRole(`button`,{name:`Save`})).toBeDisabled(),await t.click(e.getByLabelText(`Position`)),await t.click(await C(document.body).findByRole(`option`,{name:`Libero`}));let r=e.getByRole(`button`,{name:`Save`});await x(r).toBeEnabled(),await t.click(r),await x(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p2`)}},M={args:{positions:w,currentPositionId:`p1`},play:async({canvas:e,userEvent:t,args:n})=>{await x(C(e.getByLabelText(`Position`)).getByText(`Setter`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save`})),await x(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p1`)}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'NAME_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That display name is already taken.')).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N=[`Default`,`Editing`,`Saving`,`NameTakenError`,`SavedSuccess`,`PositionRequired`,`PositionPreselected`]}))();export{E as Default,D as Editing,k as NameTakenError,M as PositionPreselected,j as PositionRequired,A as SavedSuccess,O as Saving,N as __namedExportsOrder,T as default};