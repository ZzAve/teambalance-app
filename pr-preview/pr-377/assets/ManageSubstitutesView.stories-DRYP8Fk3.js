import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./ManageSubstitutesView-Dvpfqa_z.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],d=[{id:`s1`,name:`Jan de Vries`,position:{id:`p2`,label:`Libero`}},{id:`s2`,name:`Sam Bakker`,position:void 0}],f={title:`features/manage-substitutes/ManageSubstitutesView`,component:a,args:{canManage:!0,substitutes:d,positions:u,onConfirmTargetChange:c(),onRename:c(),onChangePosition:c(),onRemove:c()}},p={play:async({canvas:e})=>{await s(e.getByRole(`heading`,{name:`Substitutes`})).toBeInTheDocument(),await s(e.getByText(`Jan de Vries`)).toBeInTheDocument(),await s(e.queryByLabelText(`Name for Jan de Vries`)).not.toBeInTheDocument(),await s(e.getAllByLabelText(/^Actions for /)).toHaveLength(2),await s(l(e.getByLabelText(`Position for Jan de Vries`)).getByText(`Libero`)).toBeInTheDocument(),await s(l(e.getByLabelText(`Position for Sam Bakker`)).getByText(`Unassigned`)).toBeInTheDocument()}},m={render:e=>(0,o.jsx)(r,{items:{Loading:(0,o.jsx)(a,{...e,substitutes:void 0,isLoading:!0}),Error:(0,o.jsx)(a,{...e,substitutes:void 0,isError:!0}),"Empty (admin)":(0,o.jsx)(a,{...e,substitutes:[]}),"Empty (read-only)":(0,o.jsx)(a,{...e,substitutes:[],canManage:!1}),"Read only":(0,o.jsx)(a,{...e,canManage:!1}),"No positions":(0,o.jsx)(a,{...e,positions:[]}),"Name taken":(0,o.jsx)(a,{...e,errorMessage:`Sam Bakker is already on the list.`}),Renaming:(0,o.jsx)(a,{...e})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>l(e.getByRole(`region`,{name:t}));await s(n(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await s(n(`Loading`).queryByText(`Jan de Vries`)).not.toBeInTheDocument(),await s(n(`Error`).getByText(`Couldn't load substitutes. Please try again.`)).toBeInTheDocument(),await s(n(`Empty (admin)`).getByText(`No substitutes yet. Members add them when calling someone in for an event.`)).toBeInTheDocument(),await s(n(`Empty (read-only)`).getByText(`No substitutes yet.`)).toBeInTheDocument(),await s(n(`Read only`).getByText(`Jan de Vries`)).toBeInTheDocument(),await s(n(`Read only`).getByText(`Libero`)).toBeInTheDocument(),await s(n(`Read only`).queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await s(n(`Read only`).queryByLabelText(/^Position for /)).not.toBeInTheDocument(),await s(n(`No positions`).queryByLabelText(/^Position for /)).not.toBeInTheDocument(),await s(n(`No positions`).getByText(`Unassigned`)).toBeInTheDocument(),await s(n(`Name taken`).getByRole(`alert`)).toHaveTextContent(`Sam Bakker is already on the list.`),await t.click(n(`Renaming`).getByLabelText(`Actions for Jan de Vries`)),await t.click(await l(document.body).findByRole(`menuitem`,{name:`Rename`})),await s(n(`Renaming`).getByLabelText(`Name for Jan de Vries`)).toHaveValue(`Jan de Vries`),await s(n(`Renaming`).getByRole(`button`,{name:`Save`})).toBeInTheDocument()}},h={args:{eventCount:4},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Jan de Vries`)),await t.click(await l(document.body).findByRole(`menuitem`,{name:`Remove…`}));let n=l(await l(document.body).findByRole(`dialog`));await s(n.getByText(`Jan de Vries is on 4 events.`)).toBeInTheDocument(),await s(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},g={parameters:{chromatic:{disableSnapshot:!0}},args:{eventCount:4},play:async({canvas:e,userEvent:t,args:n})=>{let r=l(document.body);await t.click(e.getByLabelText(`Actions for Jan de Vries`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`})),await t.type(e.getByLabelText(`Name for Jan de Vries`),` extra{Escape}`),await s(e.queryByLabelText(`Name for Jan de Vries`)).not.toBeInTheDocument(),await s(n.onRename).not.toHaveBeenCalled(),await t.click(e.getByLabelText(`Actions for Jan de Vries`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`}));let i=e.getByLabelText(`Name for Jan de Vries`);await s(i).toHaveValue(`Jan de Vries`),await t.clear(i),await t.type(i,`  Jan Visser  `),await t.click(e.getByRole(`button`,{name:`Save`})),await s(n.onRename).toHaveBeenCalledWith(d[0],`Jan Visser`),await t.click(e.getByLabelText(`Position for Sam Bakker`)),await t.click(await r.findByRole(`option`,{name:`Setter`})),await s(n.onChangePosition).toHaveBeenCalledWith(d[1],`p1`),await t.click(e.getByLabelText(`Position for Jan de Vries`)),await t.click(await r.findByRole(`option`,{name:`Unassigned`})),await s(n.onChangePosition).toHaveBeenCalledWith(d[0],null),await t.click(e.getByLabelText(`Actions for Jan de Vries`)),await t.click(await r.findByRole(`menuitem`,{name:`Remove…`})),await s(n.onConfirmTargetChange).toHaveBeenCalledWith(d[0]);let a=l(await r.findByRole(`dialog`));await s(a.getByText(`Jan de Vries is on 4 events.`)).toBeInTheDocument(),await s(a.getByText(`Jan de Vries will disappear from every event they were added to, including past ones. This can't be undone.`)).toBeInTheDocument(),await s(n.onRemove).not.toHaveBeenCalled(),await t.click(a.getByRole(`button`,{name:`Remove`})),await s(n.onRemove).toHaveBeenCalledWith(d[0]),await s(n.onConfirmTargetChange).toHaveBeenLastCalledWith(null)}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Substitutes'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Jan de Vries')).toBeInTheDocument();
    // The rename field only appears once Rename is picked from the row's menu.
    await expect(canvas.queryByLabelText('Name for Jan de Vries')).not.toBeInTheDocument();
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
    // The Position picker is inline, as on the Member roster: the common edit.
    await expect(within(canvas.getByLabelText('Position for Jan de Vries')).getByText('Libero')).toBeInTheDocument();
    await expect(within(canvas.getByLabelText('Position for Sam Bakker')).getByText('Unassigned')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <ManageSubstitutesView {...args} substitutes={undefined} isLoading />,
    Error: <ManageSubstitutesView {...args} substitutes={undefined} isError />,
    'Empty (admin)': <ManageSubstitutesView {...args} substitutes={[]} />,
    'Empty (read-only)': <ManageSubstitutesView {...args} substitutes={[]} canManage={false} />,
    // Everyone sees the list on /team; only Admins can change it.
    'Read only': <ManageSubstitutesView {...args} canManage={false} />,
    // With no Positions in the team, rows fall back to a plain Unassigned label (no picker).
    'No positions': <ManageSubstitutesView {...args} positions={[]} />,
    'Name taken': <ManageSubstitutesView {...args} errorMessage="Sam Bakker is already on the list." />,
    // Rename picked from the row's menu: the name becomes a field. Opened by the play and left open.
    Renaming: <ManageSubstitutesView {...args} />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByText('Jan de Vries')).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load substitutes. Please try again.")).toBeInTheDocument();
    await expect(region('Empty (admin)').getByText('No substitutes yet. Members add them when calling someone in for an event.')).toBeInTheDocument();
    await expect(region('Empty (read-only)').getByText('No substitutes yet.')).toBeInTheDocument();
    await expect(region('Read only').getByText('Jan de Vries')).toBeInTheDocument();
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument();
    await expect(region('Read only').queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
    await expect(region('Read only').queryByLabelText(/^Position for /)).not.toBeInTheDocument();
    await expect(region('No positions').queryByLabelText(/^Position for /)).not.toBeInTheDocument();
    await expect(region('No positions').getByText('Unassigned')).toBeInTheDocument();
    await expect(region('Name taken').getByRole('alert')).toHaveTextContent('Sam Bakker is already on the list.');
    await userEvent.click(region('Renaming').getByLabelText('Actions for Jan de Vries'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Rename'
    }));
    await expect(region('Renaming').getByLabelText('Name for Jan de Vries')).toHaveValue('Jan de Vries');
    await expect(region('Renaming').getByRole('button', {
      name: 'Save'
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    eventCount: 4
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Remove…'
    }));
    const dialog = within(await within(document.body).findByRole('dialog'));
    await expect(dialog.getByText('Jan de Vries is on 4 events.')).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    eventCount: 4
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const portal = within(document.body);

    // Escape backs out of a rename without saving.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    await userEvent.type(canvas.getByLabelText('Name for Jan de Vries'), ' extra{Escape}');
    await expect(canvas.queryByLabelText('Name for Jan de Vries')).not.toBeInTheDocument();
    await expect(args.onRename).not.toHaveBeenCalled();

    // Rename: the field starts at the current name and saves the trimmed new one.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Name for Jan de Vries');
    await expect(field).toHaveValue('Jan de Vries');
    await userEvent.clear(field);
    await userEvent.type(field, '  Jan Visser  ');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith(SUBSTITUTES[0], 'Jan Visser');

    // Change Position: set one, and clear one back to Unassigned.
    await userEvent.click(canvas.getByLabelText('Position for Sam Bakker'));
    await userEvent.click(await portal.findByRole('option', {
      name: 'Setter'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(SUBSTITUTES[1], 'p1');
    await userEvent.click(canvas.getByLabelText('Position for Jan de Vries'));
    await userEvent.click(await portal.findByRole('option', {
      name: 'Unassigned'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(SUBSTITUTES[0], null);

    // Remove: the dialog asks the container for the count, warns about past Events, and only the
    // confirm click removes.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Remove…'
    }));
    await expect(args.onConfirmTargetChange).toHaveBeenCalledWith(SUBSTITUTES[0]);
    const dialog = within(await portal.findByRole('dialog'));
    await expect(dialog.getByText('Jan de Vries is on 4 events.')).toBeInTheDocument();
    await expect(dialog.getByText("Jan de Vries will disappear from every event they were added to, including past ones. This can't be undone.")).toBeInTheDocument();
    await expect(args.onRemove).not.toHaveBeenCalled();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemove).toHaveBeenCalledWith(SUBSTITUTES[0]);
    await expect(args.onConfirmTargetChange).toHaveBeenLastCalledWith(null);
  }
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`RemoveConfirmOpen`,`Interactions`]})))()}v();export{p as Data,g as Interactions,h as RemoveConfirmOpen,m as Shells,_ as __namedExportsOrder,f as default};