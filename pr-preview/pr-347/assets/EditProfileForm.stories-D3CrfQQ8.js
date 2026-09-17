import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./EditProfileForm-OlYaB5nP.js";var o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],d={title:`features/edit-profile/EditProfileForm`,component:a,args:{currentName:`Ada Lovelace`,positions:[],currentPositionId:null,isSaving:!1,onSubmit:c()}},f={play:async({canvas:e})=>{await s(e.getByLabelText(`Display name`)).toHaveValue(`Ada Lovelace`),await s(e.queryByLabelText(`Position`)).not.toBeInTheDocument(),await s(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},p={render:e=>(0,o.jsx)(r,{items:{Saving:(0,o.jsx)(a,{...e,isSaving:!0}),"Name taken":(0,o.jsx)(a,{...e,errorCode:`NAME_TAKEN`}),"Position required":(0,o.jsx)(a,{...e,positions:u,currentPositionId:null}),"Position preselected":(0,o.jsx)(a,{...e,positions:u,currentPositionId:`p1`})}}),play:async({canvas:e})=>{let t=t=>l(e.getByRole(`region`,{name:t})),n=t(`Saving`).getByRole(`button`,{name:`Saving...`});await s(n).toBeInTheDocument(),await s(n).toBeDisabled(),await s(t(`Name taken`).getByText(`That display name is already taken.`)).toBeInTheDocument(),await s(t(`Position required`).getByLabelText(`Position`)).toBeInTheDocument(),await s(t(`Position required`).getByRole(`button`,{name:`Save`})).toBeDisabled(),await s(l(t(`Position preselected`).getByLabelText(`Position`)).getByText(`Setter`)).toBeInTheDocument()}},m={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,o.jsx)(r,{items:{Default:(0,o.jsx)(a,{...e}),"Position required":(0,o.jsx)(a,{...e,positions:u,currentPositionId:null}),"Position preselected":(0,o.jsx)(a,{...e,positions:u,currentPositionId:`p1`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>l(e.getByRole(`region`,{name:t})),i=r(`Default`).getByLabelText(`Display name`);await t.clear(i),await t.type(i,`Grace Hopper`),await s(i).toHaveValue(`Grace Hopper`),await s(r(`Default`).getByRole(`button`,{name:`Save`})).toBeEnabled(),await t.click(r(`Default`).getByRole(`button`,{name:`Save`})),await s(n.onSubmit).toHaveBeenCalledWith(`Grace Hopper`,null),await t.click(r(`Position required`).getByLabelText(`Position`)),await t.click(await l(document.body).findByRole(`option`,{name:`Libero`}));let a=r(`Position required`).getByRole(`button`,{name:`Save`});await s(a).toBeEnabled(),await t.click(a),await s(n.onSubmit).toHaveBeenLastCalledWith(`Ada Lovelace`,`p2`),await t.click(r(`Position preselected`).getByRole(`button`,{name:`Save`})),await s(n.onSubmit).toHaveBeenLastCalledWith(`Ada Lovelace`,`p1`)}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Saving: <EditProfileForm {...args} isSaving />,
    'Name taken': <EditProfileForm {...args} errorCode="NAME_TAKEN" />,
    // Required-when-available: the team defines positions but this member has none yet, so the
    // picker shows and Save stays disabled until one is picked.
    'Position required': <EditProfileForm {...args} positions={POSITIONS} currentPositionId={null} />,
    // A member with an existing position: the picker is preselected.
    'Position preselected': <EditProfileForm {...args} positions={POSITIONS} currentPositionId="p1" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const save = region('Saving').getByRole('button', {
      name: 'Saving...'
    });
    await expect(save).toBeInTheDocument();
    await expect(save).toBeDisabled();
    await expect(region('Name taken').getByText('That display name is already taken.')).toBeInTheDocument();
    await expect(region('Position required').getByLabelText('Position')).toBeInTheDocument();
    await expect(region('Position required').getByRole('button', {
      name: 'Save'
    })).toBeDisabled();
    await expect(within(region('Position preselected').getByLabelText('Position')).getByText('Setter')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <EditProfileForm {...args} />,
    'Position required': <EditProfileForm {...args} positions={POSITIONS} currentPositionId={null} />,
    'Position preselected': <EditProfileForm {...args} positions={POSITIONS} currentPositionId="p1" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Editing leaves the form structurally identical to Data — the field value and Save's enabled
    // state are the only visible change.
    const nameField = region('Default').getByLabelText('Display name');
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Grace Hopper');
    await expect(nameField).toHaveValue('Grace Hopper');
    await expect(region('Default').getByRole('button', {
      name: 'Save'
    })).toBeEnabled();
    await userEvent.click(region('Default').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper', null);
    await userEvent.click(region('Position required').getByLabelText('Position'));
    await userEvent.click(await within(document.body).findByRole('option', {
      name: 'Libero'
    }));
    const requiredSave = region('Position required').getByRole('button', {
      name: 'Save'
    });
    await expect(requiredSave).toBeEnabled();
    await userEvent.click(requiredSave);
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p2');

    // Preselected: submitting carries the id already chosen, with no picker interaction needed.
    await userEvent.click(region('Position preselected').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p1');
  }
}`,...m.parameters?.docs?.source}}},h=[`Data`,`Shells`,`Interactions`]})))()}g();export{f as Data,m as Interactions,p as Shells,h as __namedExportsOrder,d as default};