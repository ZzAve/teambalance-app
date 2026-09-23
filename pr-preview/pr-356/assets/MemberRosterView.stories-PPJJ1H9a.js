import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./MemberRosterView-CxDx-3f5.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),i(),o=t(),{expect:s,fn:c,within:l}=__STORYBOOK_MODULE_TEST__,u=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],d=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:u[0],onboarded:!0},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:u[1],onboarded:!0},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0}],f=[`Christopher Vandenbroucke-Janssen`,`Anastasia Konstantinopoulos`,`Bartholomew Fitzwilliam-Harrington`,`Guadalupe Hernández-Villanueva`,`Maximilian Oosterhuis-van der Berg`],p=Array.from({length:15},(e,t)=>({userId:`m${t}`,displayName:f[t%f.length]+(t>=f.length?` ${t}`:``),role:t===0?`ADMIN`:`USER`,position:u[t%u.length],onboarded:!0})),m={title:`features/manage-members/MemberRosterView`,component:a,args:{canManage:!0,members:d,positions:u,onRename:c(),onToggleRole:c(),onChangePosition:c(),onRemove:c()}},h={play:async({canvas:e})=>{await s(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await s(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await s(e.getByText(`GH`)).toBeInTheDocument(),await s(e.getAllByText(`Admin`)).toHaveLength(2),await s(e.queryByText(`Member`)).not.toBeInTheDocument(),await s(e.queryByText(`USER`)).not.toBeInTheDocument(),await s(e.getAllByLabelText(/^Actions for /)).toHaveLength(4),await s(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await s(e.queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await s(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await s(l(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await s(l(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},g={render:e=>(0,o.jsx)(r,{items:{Loading:(0,o.jsx)(a,{...e,isLoading:!0}),Error:(0,o.jsx)(a,{...e,isError:!0}),"No positions":(0,o.jsx)(a,{...e,positions:[]}),"Read only":(0,o.jsx)(a,{...e,canManage:!1}),"Empty (admin)":(0,o.jsx)(a,{...e,members:[]}),"Empty (read-only)":(0,o.jsx)(a,{...e,members:[],canManage:!1}),"Last admin refused":(0,o.jsx)(a,{...e,members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0}],errorMessage:`A team must keep at least one admin.`}),"Long roster, long names":(0,o.jsx)(a,{...e,members:p})}}),play:async({canvas:e})=>{let t=t=>l(e.getByRole(`region`,{name:t}));await s(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await s(t(`Loading`).queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`Error`).getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await s(t(`Error`).queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`No positions`).queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`No positions`).getAllByText(`Unassigned`).length).toBeGreaterThan(0),await s(t(`Read only`).getByText(`AL`)).toBeInTheDocument(),await s(t(`Read only`).getByText(`Ada Lovelace`)).toBeInTheDocument(),await s(t(`Read only`).getByText(`Libero`)).toBeInTheDocument(),await s(t(`Read only`).queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await s(t(`Read only`).queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await s(t(`Read only`).getAllByText(`Admin`)).toHaveLength(2),await s(t(`Read only`).getAllByText(`Member`)).toHaveLength(2),await s(t(`Read only`).queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await s(t(`Empty (admin)`).getByText(`No members yet. Share an invite link to bring people in.`)).toBeInTheDocument(),await s(t(`Empty (admin)`).queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await s(t(`Empty (read-only)`).getByText(`No members yet.`)).toBeInTheDocument(),await s(t(`Empty (read-only)`).queryByText(`No members yet. Share an invite link to bring people in.`)).not.toBeInTheDocument(),await s(t(`Last admin refused`).getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`);let n=t(`Long roster, long names`);await s(n.getAllByLabelText(/^Actions for /)).toHaveLength(15);let r=n.getByText(f[0]);await s(r).toHaveAttribute(`title`,f[0]),await s(r.className).toContain(`truncate`)}},_={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=l(document.body);await t.click(await n.findByRole(`menuitem`,{name:`Remove…`}));let r=l(document.body);await s(await r.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await s(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},v={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=l(document.body);await s(await n.findByRole(`menuitem`,{name:`Make admin`})).toBeInTheDocument();let r=n.getByRole(`menuitem`,{name:`Remove…`});await s(r).toBeInTheDocument(),await s(r).toHaveAttribute(`data-tone`,`destructive`)}},y={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=l(document.body);await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`}));let i=e.getByLabelText(`Display name for Grace Hopper`);await t.type(i,` extra{Escape}`),await s(e.queryByLabelText(`Display name for Grace Hopper`)).not.toBeInTheDocument(),await s(e.getByText(`Grace Hopper`)).toBeInTheDocument(),await s(n.onRename).not.toHaveBeenCalled(),await t.click(e.getByLabelText(`Position for Grace Hopper`)),await t.click(await r.findByRole(`option`,{name:`Libero`})),await s(n.onChangePosition).toHaveBeenCalledWith(d[1],`p2`),await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`}));let a=e.getByLabelText(`Display name for Grace Hopper`);await s(a).toHaveValue(`Grace Hopper`),await t.clear(a),await t.type(a,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await s(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`),await t.click(e.getByLabelText(`Actions for Ada Lovelace`)),await t.click(await r.findByRole(`menuitem`,{name:`Make member`})),await s(n.onToggleRole).toHaveBeenCalledWith(d[0]),await t.click(e.getByLabelText(`Actions for Ada Lovelace`)),await t.click(await r.findByRole(`menuitem`,{name:`Remove…`})),await s(n.onRemove).not.toHaveBeenCalled(),await s(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await s(n.onRemove).toHaveBeenCalledWith(d[0])}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Names render as plain text (Rename in the ⋯ menu reveals an inline field) — not an
    // always-open input.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument();
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument();
    // Only admins carry the Admin badge — there is no Member badge for the rest.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2);
    await expect(canvas.queryByText('Member')).not.toBeInTheDocument();
    await expect(canvas.queryByText('USER')).not.toBeInTheDocument();
    // Every row has one overflow menu trigger and no inline promote/demote/remove buttons — those
    // rarer actions moved into the menu (#341).
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(4);
    await expect(canvas.queryByRole('button', {
      name: 'Make member'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Make admin'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Remove'
    })).not.toBeInTheDocument();
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument();
    await expect(within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MemberRosterView {...args} isLoading />,
    Error: <MemberRosterView {...args} isError />,
    // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
    'No positions': <MemberRosterView {...args} positions={[]} />,
    // The member-facing (canManage: false) roster: every authenticated member sees the roster
    // read-only. Names and positions render as plain text, the role/admin badge is shown to
    // everyone, and none of the admin controls (rename, position picker, overflow menu) render.
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
    }]} errorMessage="A team must keep at least one admin." />,
    // Fifteen rows, five real-world long names repeated (#341): the row shape (name truncates,
    // picker keeps its width, the menu trigger stays put) holds up past the four-member fixture.
    'Long roster, long names': <MemberRosterView {...args} members={MANY_MEMBERS} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(region('Loading').queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load members. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('No positions').queryByLabelText('Position for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('No positions').getAllByText('Unassigned').length).toBeGreaterThan(0);

    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(region('Read only').getByText('AL')).toBeInTheDocument();
    // Names and positions are plain text — no rename control, no position picker.
    await expect(region('Read only').getByText('Ada Lovelace')).toBeInTheDocument();
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument();
    await expect(region('Read only').queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument();
    await expect(region('Read only').queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument();
    // The role/admin badge stays visible to everyone, sentence case ("Admin"/"Member" — no more
    // "ADMIN"/"USER").
    await expect(region('Read only').getAllByText('Admin')).toHaveLength(2);
    await expect(region('Read only').getAllByText('Member')).toHaveLength(2);
    // None of the admin actions render — no overflow menu at all on a read-only row.
    await expect(region('Read only').queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
    await expect(region('Empty (admin)').getByText('No members yet. Share an invite link to bring people in.')).toBeInTheDocument();
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(region('Empty (admin)').queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
    await expect(region('Empty (read-only)').getByText('No members yet.')).toBeInTheDocument();
    await expect(region('Empty (read-only)').queryByText('No members yet. Share an invite link to bring people in.')).not.toBeInTheDocument();
    await expect(region('Last admin refused').getByRole('alert')).toHaveTextContent('A team must keep at least one admin.');
    const longRoster = region('Long roster, long names');
    await expect(longRoster.getAllByLabelText(/^Actions for /)).toHaveLength(15);
    const firstRow = longRoster.getByText(LONG_NAMES[0]);
    await expect(firstRow).toHaveAttribute('title', LONG_NAMES[0]);
    // truncate + min-w-0 keep the long name from wrapping the row onto a second line.
    await expect(firstRow.className).toContain('truncate');
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    // Alan Turing is the third row; opening his ⋯ menu and choosing Remove… opens the confirm
    // dialog (a portal).
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Remove…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'));
    const menu = within(document.body);
    await expect(await menu.findByRole('menuitem', {
      name: 'Make admin'
    })).toBeInTheDocument();
    const removeItem = menu.getByRole('menuitem', {
      name: 'Remove…'
    });
    await expect(removeItem).toBeInTheDocument();
    await expect(removeItem).toHaveAttribute('data-tone', 'destructive');
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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

    // Escape backs out of a rename without calling onRename: Rename in the ⋯ menu swaps the name
    // for an inline field, and Escape cancels it and puts the row back exactly where it was. Asserted
    // first, before onRename is ever called for real below.
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    const cancelledField = canvas.getByLabelText('Display name for Grace Hopper');
    await userEvent.type(cancelledField, ' extra{Escape}');
    await expect(canvas.queryByLabelText('Display name for Grace Hopper')).not.toBeInTheDocument();
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument();
    await expect(args.onRename).not.toHaveBeenCalled();

    // Prop-contract: changing a row's position reuses the position picker; picking Libero for
    // Grace Hopper fires onChangePosition with her member and the chosen position id.
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'));
    await userEvent.click(await portal.findByRole('option', {
      name: 'Libero'
    }));
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2');

    // Prop-contract: Rename in the ⋯ menu swaps the name for an inline input, pre-filled with the
    // current name; clicking Save fires onRename with the member's id and the trimmed new name —
    // proving the rename wiring survives a dependency bump.
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Rename'
    }));
    const field = canvas.getByLabelText('Display name for Grace Hopper');
    await expect(field).toHaveValue('Grace Hopper');
    await userEvent.clear(field);
    await userEvent.type(field, 'Grace M. Hopper');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper');

    // Prop-contract: the overflow menu's "Make member"/"Make admin" reuses the update mutation —
    // opening the first admin's (Ada's) menu and picking it fires onToggleRole with that member.
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Make member'
    }));
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0]);

    // Prop-contract: "Remove…" in the menu opens the confirm dialog (a portal); nothing fires before
    // the confirm click, and confirming there fires onRemove with the member. The row buttons go
    // aria-hidden while the modal is open, so the dialog's Remove is unambiguous.
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Remove…'
    }));
    await expect(args.onRemove).not.toHaveBeenCalled();
    await expect(await portal.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0]);
  }
}`,...y.parameters?.docs?.source}}},b=[`Data`,`Shells`,`RemoveConfirmOpen`,`MenuOpen`,`Interactions`]})))()}x();export{h as Data,y as Interactions,v as MenuOpen,_ as RemoveConfirmOpen,g as Shells,b as __namedExportsOrder,m as default};