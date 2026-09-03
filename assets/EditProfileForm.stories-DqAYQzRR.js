import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./EditProfileForm-ClOVBA9G.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),{expect:r,fn:i,within:a}=__STORYBOOK_MODULE_TEST__,o=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],s={title:`features/edit-profile/EditProfileForm`,component:n,args:{currentName:`Ada Lovelace`,positions:[],currentPositionId:null,isSaving:!1,onSubmit:i()}},c={play:async({canvas:e})=>{await r(e.getByLabelText(`Display name`)).toHaveValue(`Ada Lovelace`),await r(e.queryByLabelText(`Position`)).not.toBeInTheDocument(),await r(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},l={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`Display name`);await t.clear(n),await t.type(n,`Grace Hopper`),await r(n).toHaveValue(`Grace Hopper`),await r(e.getByRole(`button`,{name:`Save`})).toBeEnabled()}},u={args:{isSaving:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Saving...`});await r(t).toBeInTheDocument(),await r(t).toBeDisabled()}},d={args:{errorCode:`NAME_TAKEN`},play:async({canvas:e})=>{await r(e.getByText(`That display name is already taken.`)).toBeInTheDocument()}},f={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let i=e.getByLabelText(`Display name`);await t.clear(i),await t.type(i,`Grace Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await r(n.onSubmit).toHaveBeenCalledWith(`Grace Hopper`,null)}},p={args:{positions:o,currentPositionId:null},play:async({canvas:e,userEvent:t,args:n})=>{await r(e.getByLabelText(`Position`)).toBeInTheDocument(),await r(e.getByRole(`button`,{name:`Save`})).toBeDisabled(),await t.click(e.getByLabelText(`Position`)),await t.click(await a(document.body).findByRole(`option`,{name:`Libero`}));let i=e.getByRole(`button`,{name:`Save`});await r(i).toBeEnabled(),await t.click(i),await r(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p2`)}},m={args:{positions:o,currentPositionId:`p1`},play:async({canvas:e,userEvent:t,args:n})=>{await r(a(e.getByLabelText(`Position`)).getByText(`Setter`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save`})),await r(n.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p1`)}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — typing a name leaves the form structurally identical to Default
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'NAME_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That display name is already taken.')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Default — onSubmit fires; the post-play frame is the Default layout
  // (ADR-0027 §2).
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
    const input = canvas.getByLabelText('Display name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Grace Hopper');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper', null);
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Editing`,`Saving`,`NameTakenError`,`SavedSuccess`,`PositionRequired`,`PositionPreselected`]})))()}g();export{c as Default,l as Editing,d as NameTakenError,m as PositionPreselected,p as PositionRequired,f as SavedSuccess,u as Saving,h as __namedExportsOrder,s as default};