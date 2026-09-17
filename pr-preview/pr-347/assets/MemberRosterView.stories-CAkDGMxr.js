import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./MemberRosterView-BNpeHLFX.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],d=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:u[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:u[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],f={title:`features/manage-members/MemberRosterView`,component:a,args:{canManage:!0,members:d,positions:u,onRename:c(),onToggleRole:c(),onChangePosition:c(),onRemove:c()}},p={play:async({canvas:e})=>{await s(e.getByLabelText(`Display name for Ada Lovelace`)).toHaveValue(`Ada Lovelace`),await s(e.getByText(`GH`)).toBeInTheDocument(),await s(e.getAllByRole(`button`,{name:`Make member`})).toHaveLength(2),await s(e.getAllByRole(`button`,{name:`Make admin`})).toHaveLength(2),await s(l(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await s(l(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},m={render:e=>(0,o.jsx)(r,{items:{Loading:(0,o.jsx)(a,{...e,isLoading:!0}),Error:(0,o.jsx)(a,{...e,isError:!0}),"No positions":(0,o.jsx)(a,{...e,positions:[]}),"Read only":(0,o.jsx)(a,{...e,canManage:!1}),"Empty (admin)":(0,o.jsx)(a,{...e,members:[]}),"Empty (read-only)":(0,o.jsx)(a,{...e,members:[],canManage:!1}),"Last admin refused":(0,o.jsx)(a,{...e,members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`})}}),play:async({canvas:e})=>{let t=t=>l(e.getByRole(`region`,{name:t}));await s(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await s(t(`Loading`).queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await s(t(`Error`).getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await s(t(`Error`).queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await s(t(`No positions`).queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`No positions`).getAllByText(`Unassigned`).length).toBeGreaterThan(0),await s(t(`Read only`).getByText(`AL`)).toBeInTheDocument(),await s(t(`Read only`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await s(t(`Read only`).getByText(`Libero`)).toBeInTheDocument(),await s(t(`Read only`).queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`Read only`).queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await s(t(`Read only`).getAllByText(`ADMIN`)).toHaveLength(2),await s(t(`Read only`).getAllByText(`USER`)).toHaveLength(2),await s(t(`Read only`).queryByRole(`button`,{name:`Save`})).not.toBeInTheDocument(),await s(t(`Read only`).queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await s(t(`Read only`).queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await s(t(`Read only`).queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await s(t(`Empty (admin)`).getByText(`No members yet. Share an invite link to bring people in.`)).toBeInTheDocument(),await s(t(`Empty (admin)`).queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await s(t(`Empty (read-only)`).getByText(`No members yet.`)).toBeInTheDocument(),await s(t(`Empty (read-only)`).queryByText(`No members yet. Share an invite link to bring people in.`)).not.toBeInTheDocument(),await s(t(`Last admin refused`).getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`)}},h={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Remove`})[2]);let n=l(document.body);await s(await n.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await s(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=l(document.body);await t.click(e.getByLabelText(`Position for Grace Hopper`)),await t.click(await r.findByRole(`option`,{name:`Libero`})),await s(n.onChangePosition).toHaveBeenCalledWith(d[1],`p2`);let i=e.getByLabelText(`Display name for Grace Hopper`);await t.clear(i),await t.type(i,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await s(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`),await t.click(e.getAllByRole(`button`,{name:`Make member`})[0]),await s(n.onToggleRole).toHaveBeenCalledWith(d[0]),await t.click(e.getAllByRole(`button`,{name:`Remove`})[0]),await s(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await s(n.onRemove).toHaveBeenCalledWith(d[0])}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace');
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument();
    // Two admins can be demoted, two users can be promoted.
    await expect(canvas.getAllByRole('button', {
      name: 'Make member'
    })).toHaveLength(2);
    await expect(canvas.getAllByRole('button', {
      name: 'Make admin'
    })).toHaveLength(2);
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument();
    await expect(within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MemberRosterView {...args} isLoading />,
    Error: <MemberRosterView {...args} isError />,
    // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
    'No positions': <MemberRosterView {...args} positions={[]} />,
    // The member-facing (canManage: false) roster: every authenticated member sees the roster
    // read-only. Names and positions render as plain text, the role/admin badge is shown to
    // everyone, and none of the admin controls (rename input, position picker, promote/demote,
    // remove) are present.
    'Read only': <MemberRosterView {...args} canManage={false} />,
    // A team a Platform Admin created memberless and is preparing under act-as, before its first
    // Admin accepts the handover link (ADR-0024 §5). The admin view points at the invite link
    // rather than showing an empty box.
    'Empty (admin)': <MemberRosterView {...args} members={[]} />,
    // The same zero-member team as a plain viewer would see it: just that the roster is empty,
    // with no invite prompt (they can't act on it).
    'Empty (read-only)': <MemberRosterView {...args} members={[]} canManage={false} />,
    'Last admin refused': <MemberRosterView {...args} members={[{
      userId: 'u1',
      displayName: 'Ada Lovelace',
      role: 'ADMIN',
      position: undefined,
      onboarded: true
    }, {
      userId: 'u3',
      displayName: 'Alan Turing',
      role: 'USER',
      position: undefined,
      onboarded: true
    }]} errorMessage="A team must keep at least one admin." />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(region('Loading').queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load members. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    await expect(region('No positions').queryByLabelText('Position for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('No positions').getAllByText('Unassigned').length).toBeGreaterThan(0);

    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(region('Read only').getByText('AL')).toBeInTheDocument();
    // Names and positions are plain text — no rename input, no position picker.
    await expect(region('Read only').getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument();
    await expect(region('Read only').queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('Read only').queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument();
    // The role/admin badge stays visible to everyone.
    await expect(region('Read only').getAllByText('ADMIN')).toHaveLength(2);
    await expect(region('Read only').getAllByText('USER')).toHaveLength(2);
    // None of the admin actions render.
    await expect(region('Read only').queryByRole('button', {
      name: 'Save'
    })).not.toBeInTheDocument();
    await expect(region('Read only').queryByRole('button', {
      name: 'Make member'
    })).not.toBeInTheDocument();
    await expect(region('Read only').queryByRole('button', {
      name: 'Make admin'
    })).not.toBeInTheDocument();
    await expect(region('Read only').queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    await expect(region('Empty (admin)').getByText('No members yet. Share an invite link to bring people in.')).toBeInTheDocument();
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(region('Empty (admin)').queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    await expect(region('Empty (read-only)').getByText('No members yet.')).toBeInTheDocument();
    await expect(region('Empty (read-only)').queryByText('No members yet. Share an invite link to bring people in.')).not.toBeInTheDocument();
    await expect(region('Last admin refused').getByRole('alert')).toHaveTextContent('A team must keep at least one admin.');
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    // Alan Turing is the third row; his Remove button opens the confirm dialog (a portal).
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Remove'
    })[2]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument();
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
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const portal = within(document.body);

    // Prop-contract: changing a row's position reuses the position picker; picking Libero for
    // Grace Hopper fires onChangePosition with her member and the chosen position id.
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'));
    await userEvent.click(await portal.findByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2');

    // Prop-contract: editing a row's name surfaces its Save button; clicking it fires onRename with
    // the member's id and the trimmed new name — proving the rename wiring survives a dependency
    // bump.
    const field = canvas.getByLabelText('Display name for Grace Hopper');
    await userEvent.clear(field);
    await userEvent.type(field, 'Grace M. Hopper');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper');

    // Prop-contract: promoting/demoting reuses the update mutation — the first "Make member" (the
    // first admin, Ada) fires onToggleRole with that member.
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Make member'
    })[0]);
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0]);

    // Prop-contract: a row Remove opens the confirm dialog (a portal); confirming there fires
    // onRemove with the member. The row buttons go aria-hidden while the modal is open, so the
    // dialog's Remove is unambiguous.
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Remove'
    })[0]);
    await expect(await portal.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`RemoveConfirmOpen`,`Interactions`]})))()}v();export{p as Data,g as Interactions,h as RemoveConfirmOpen,m as Shells,_ as __namedExportsOrder,f as default};