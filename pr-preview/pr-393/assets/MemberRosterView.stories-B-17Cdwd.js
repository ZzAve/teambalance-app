import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./router-decorator-DXwy1l1a.js";import{n as o,t as s}from"./MemberRosterView-GcQf6hrk.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),a(),o(),c=t(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],p=[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:f[0],onboarded:!0,shirtNumber:12},{userId:`u2`,displayName:`Grace Hopper`,role:`ADMIN`,position:void 0,onboarded:!0,shirtNumber:void 0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:f[1],onboarded:!0,shirtNumber:1},{userId:`u4`,displayName:`Katherine Johnson`,role:`USER`,position:void 0,onboarded:!0,shirtNumber:112}],m=[`Christopher Vandenbroucke-Janssen`,`Anastasia Konstantinopoulos`,`Bartholomew Fitzwilliam-Harrington`,`Guadalupe Hernández-Villanueva`,`Maximilian Oosterhuis-van der Berg`],h=Array.from({length:15},(e,t)=>({userId:`m${t}`,displayName:m[t%m.length]+(t>=m.length?` ${t}`:``),role:t===0?`ADMIN`:`USER`,position:f[t%f.length],onboarded:!0,shirtNumber:void 0})),g={title:`features/manage-members/MemberRosterView`,component:s,decorators:[i],parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}},args:{canManage:!0,members:p,positions:f,onRename:u(),onToggleRole:u(),onChangePosition:u(),onRemove:u()}},_={play:async({canvas:e})=>{await l(e.getByText(`Ada Lovelace`)).toBeInTheDocument(),await l(e.queryByLabelText(`Display name for Ada Lovelace`)).not.toBeInTheDocument(),await l(e.getByText(`GH`)).toBeInTheDocument(),await l(e.getAllByText(`Admin`)).toHaveLength(2),await l(e.queryByText(`Member`)).not.toBeInTheDocument(),await l(e.queryByText(`USER`)).not.toBeInTheDocument(),await l(e.getAllByLabelText(/^Actions for /)).toHaveLength(4),await l(e.queryByRole(`button`,{name:`Make member`})).not.toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Make admin`})).not.toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Remove`})).not.toBeInTheDocument(),await l(d(e.getByLabelText(`Position for Ada Lovelace`)).getByText(`Setter`)).toBeInTheDocument(),await l(d(e.getByLabelText(`Position for Grace Hopper`)).getByText(`Unassigned`)).toBeInTheDocument()}},v={render:e=>(0,c.jsx)(r,{items:{Loading:(0,c.jsx)(s,{...e,isLoading:!0}),Error:(0,c.jsx)(s,{...e,isError:!0}),"No positions":(0,c.jsx)(s,{...e,positions:[]}),"Read only":(0,c.jsx)(s,{...e,canManage:!1}),"Empty (admin)":(0,c.jsx)(s,{...e,members:[]}),"Empty (read-only)":(0,c.jsx)(s,{...e,members:[],canManage:!1}),"Last admin refused":(0,c.jsx)(s,{...e,members:[{userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:void 0,onboarded:!0,shirtNumber:void 0},{userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,onboarded:!0,shirtNumber:void 0}],errorMessage:`A team must keep at least one admin.`}),"Long roster, long names":(0,c.jsx)(s,{...e,members:h})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t}));await l(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await l(t(`Loading`).queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await l(t(`Error`).getByText(`Couldn't load members. Please try again.`)).toBeInTheDocument(),await l(t(`Error`).queryByLabelText(`Actions for Ada Lovelace`)).not.toBeInTheDocument(),await l(t(`No positions`).queryByLabelText(`Position for Ada Lovelace`)).not.toBeInTheDocument(),await l(t(`No positions`).getAllByText(`Unassigned`).length).toBeGreaterThan(0);let n=t(`Read only`).getAllByRole(`link`);await l(n.map(e=>e.getAttribute(`aria-label`))).toEqual([`Alan Turing`,`Ada Lovelace`,`Katherine Johnson`,`Grace Hopper`]),await l(t(`Read only`).getByRole(`link`,{name:`Ada Lovelace`})).toHaveAttribute(`href`,`/t/setpoint-vt/team/u1`),await l(t(`Read only`).getByLabelText(`Shirt number 112`)).toBeInTheDocument(),await l(t(`Read only`).getByText(`AL`)).toBeInTheDocument(),await l(t(`Read only`).queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await l(t(`Read only`).queryByLabelText(`Position for Alan Turing`)).not.toBeInTheDocument(),await l(t(`Empty (admin)`).getByText(`No members yet. Share an invite link to bring people in.`)).toBeInTheDocument(),await l(t(`Empty (admin)`).queryByLabelText(/^Actions for /)).not.toBeInTheDocument(),await l(t(`Empty (read-only)`).getByText(`No members yet.`)).toBeInTheDocument(),await l(t(`Empty (read-only)`).queryByText(`No members yet. Share an invite link to bring people in.`)).not.toBeInTheDocument(),await l(t(`Last admin refused`).getByRole(`alert`)).toHaveTextContent(`A team must keep at least one admin.`);let r=t(`Long roster, long names`);await l(r.getAllByLabelText(/^Actions for /)).toHaveLength(15);let i=r.getByText(m[0]);await l(i).toHaveAttribute(`title`,m[0]),await l(i.className).toContain(`truncate`)}},y={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=d(document.body);await t.click(await n.findByRole(`menuitem`,{name:`Remove…`}));let r=d(document.body);await l(await r.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument(),await l(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},b={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Alan Turing`));let n=d(document.body);await l(await n.findByRole(`menuitem`,{name:`Make admin`})).toBeInTheDocument();let r=n.getByRole(`menuitem`,{name:`Remove…`});await l(r).toBeInTheDocument(),await l(r).toHaveAttribute(`data-tone`,`destructive`)}},x={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=d(document.body);await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`}));let i=e.getByLabelText(`Display name for Grace Hopper`);await t.type(i,` extra{Escape}`),await l(e.queryByLabelText(`Display name for Grace Hopper`)).not.toBeInTheDocument(),await l(e.getByText(`Grace Hopper`)).toBeInTheDocument(),await l(n.onRename).not.toHaveBeenCalled(),await t.click(e.getByLabelText(`Position for Grace Hopper`)),await t.click(await r.findByRole(`option`,{name:`Libero`})),await l(n.onChangePosition).toHaveBeenCalledWith(p[1],`p2`),await t.click(e.getByLabelText(`Actions for Grace Hopper`)),await t.click(await r.findByRole(`menuitem`,{name:`Rename`}));let a=e.getByLabelText(`Display name for Grace Hopper`);await l(a).toHaveValue(`Grace Hopper`),await t.clear(a),await t.type(a,`Grace M. Hopper`),await t.click(e.getByRole(`button`,{name:`Save`})),await l(n.onRename).toHaveBeenCalledWith(`u2`,`Grace M. Hopper`),await t.click(e.getByLabelText(`Actions for Ada Lovelace`)),await t.click(await r.findByRole(`menuitem`,{name:`Make member`})),await l(n.onToggleRole).toHaveBeenCalledWith(p[0]),await t.click(e.getByLabelText(`Actions for Ada Lovelace`)),await t.click(await r.findByRole(`menuitem`,{name:`Remove…`})),await l(n.onRemove).not.toHaveBeenCalled(),await l(await r.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Remove`})),await l(n.onRemove).toHaveBeenCalledWith(p[0])}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MemberRosterView {...args} isLoading />,
    Error: <MemberRosterView {...args} isError />,
    // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
    'No positions': <MemberRosterView {...args} positions={[]} />,
    // The member-facing (canManage: false) roster (ADR-0038): a grid of faces with the Shirt
    // Number, ordered by number, each a link to that member's page. None of the admin controls
    // (rename, position picker, overflow menu) render.
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
      onboarded: true,
      shirtNumber: undefined
    }, {
      userId: 'u3',
      displayName: 'Alan Turing',
      role: 'USER',
      position: undefined,
      onboarded: true,
      shirtNumber: undefined
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

    // Faces ordered by Shirt Number, members without one last.
    const faces = region('Read only').getAllByRole('link');
    await expect(faces.map(a => a.getAttribute('aria-label'))).toEqual(['Alan Turing', 'Ada Lovelace', 'Katherine Johnson', 'Grace Hopper']);
    await expect(region('Read only').getByRole('link', {
      name: 'Ada Lovelace'
    })).toHaveAttribute('href', '/t/setpoint-vt/team/u1');
    await expect(region('Read only').getByLabelText('Shirt number 112')).toBeInTheDocument();
    // The shared avatar (colour circle + initials) carries the face.
    await expect(region('Read only').getByText('AL')).toBeInTheDocument();
    await expect(region('Read only').queryByLabelText(/^Actions for /)).not.toBeInTheDocument();
    await expect(region('Read only').queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument();
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S=[`Data`,`Shells`,`RemoveConfirmOpen`,`MenuOpen`,`Interactions`]})))()}C();export{_ as Data,x as Interactions,b as MenuOpen,y as RemoveConfirmOpen,v as Shells,S as __namedExportsOrder,g as default};