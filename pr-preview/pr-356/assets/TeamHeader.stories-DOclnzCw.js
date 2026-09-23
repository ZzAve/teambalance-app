import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-D4FUF-yi.js";import{n as o,t as s}from"./TeamHeader-3T86B58K.js";import{n as c,t as l}from"./button-BkXpgCJ0.js";var u,d,f,p,m,h,g;function _(){return(_=e((()=>{a(),n(),c(),o(),u=t(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={title:`widgets/team-header/TeamHeader`,component:s,decorators:[i],parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}}},m=(0,u.jsx)(l,{variant:`outline`,children:`Invite Link`}),h={parameters:{chromatic:{disableSnapshot:!0}},args:{isAdmin:!0},render:()=>(0,u.jsx)(r,{items:{Admin:(0,u.jsx)(s,{isAdmin:!0,actions:m}),Member:(0,u.jsx)(s,{isAdmin:!1,actions:m})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t})),n=t(`Admin`).getByRole(`link`,{name:`Team settings`});await d(n).toBeInTheDocument(),await d(n).toHaveAttribute(`href`,`/t/setpoint-vt/team/settings`),await d(t(`Admin`).getByRole(`button`,{name:`Invite Link`})).toBeInTheDocument(),await d(t(`Member`).getByRole(`heading`,{name:`Team`})).toBeInTheDocument(),await d(t(`Member`).queryByRole(`link`,{name:`Team settings`})).not.toBeInTheDocument(),await d(t(`Member`).queryByRole(`button`,{name:`Invite Link`})).not.toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // isAdmin is required on TeamHeader; unused by render below — each Stack instance sets its own.
  args: {
    isAdmin: true
  },
  render: () => <Stack items={{
    Admin: <TeamHeader isAdmin actions={inviteAction} />,
    Member: <TeamHeader isAdmin={false} actions={inviteAction} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const gear = region('Admin').getByRole('link', {
      name: 'Team settings'
    });
    await expect(gear).toBeInTheDocument();
    await expect(gear).toHaveAttribute('href', '/t/setpoint-vt/team/settings');
    // The admin actions slot (invite link) renders alongside the gear.
    await expect(region('Admin').getByRole('button', {
      name: 'Invite Link'
    })).toBeInTheDocument();

    // Title still renders; the gear and the admin actions are the only admin-gated elements and
    // must both be absent — a non-admin never sees the invite link even when one is passed.
    await expect(region('Member').getByRole('heading', {
      name: 'Team'
    })).toBeInTheDocument();
    await expect(region('Member').queryByRole('link', {
      name: 'Team settings'
    })).not.toBeInTheDocument();
    await expect(region('Member').queryByRole('button', {
      name: 'Invite Link'
    })).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Gallery`]})))()}_();export{h as Gallery,g as __namedExportsOrder,p as default};