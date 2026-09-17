import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./button-W1GRNbO0.js";import{n as o,t as s}from"./input-DRR9bnA7.js";function c({isLoading:e,isError:t,link:n,copied:r,justRevoked:i,isCreating:o,isRotating:c,isRevoking:u,actionError:d,onCopy:f,onCreate:p,onRotate:m,onRevoke:h}){return(0,l.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Hand over as admin`}),(0,l.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Loading…`}),t&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&i&&(0,l.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,l.jsx)(a,{type:`button`,onClick:p,disabled:o,className:`self-start`,children:o?`Creating…`:`Create new admin link`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&!n&&(0,l.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,l.jsx)(a,{type:`button`,onClick:p,disabled:o,className:`self-start`,children:o?`Creating…`:`Create admin handover link`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&n&&(0,l.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,l.jsxs)(`div`,{className:`flex gap-2`,children:[(0,l.jsx)(s,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,l.jsx)(a,{type:`button`,onClick:f,children:r?`Copied!`:`Copy`})]}),(0,l.jsxs)(`div`,{className:`flex gap-2`,children:[(0,l.jsx)(a,{type:`button`,variant:`outline`,onClick:m,disabled:c,children:c?`Rotating…`:`Rotate link`}),(0,l.jsx)(a,{type:`button`,variant:`destructive`,onClick:h,disabled:u,children:u?`Revoking…`:`Revoke link`})]}),(0,l.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]})]})}var l;function u(){return(u=e((()=>{i(),o(),l=t(),c.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),u(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h=`https://app.teambalance.nl/invite/handover-token-abc`,g={title:`features/handover-admin/HandoverAdminView`,component:c,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:p(),onCreate:p(),onRotate:p(),onRevoke:p()}},_={args:{link:h},play:async({canvas:e})=>{await f(e.getByDisplayValue(h)).toBeInTheDocument(),await f(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await f(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await f(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await f(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},v={render:e=>(0,d.jsx)(r,{items:{Loading:(0,d.jsx)(c,{...e,isLoading:!0}),"Load error":(0,d.jsx)(c,{...e,isError:!0}),"No link yet":(0,d.jsx)(c,{...e}),Creating:(0,d.jsx)(c,{...e,isCreating:!0}),Copied:(0,d.jsx)(c,{...e,link:h,copied:!0}),"Just revoked":(0,d.jsx)(c,{...e,justRevoked:!0}),"Action error":(0,d.jsx)(c,{...e,link:h,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await f(t(`Loading`).queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await f(t(`Load error`).getByText(`Failed to load the admin link.`)).toBeInTheDocument(),await f(t(`No link yet`).getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await f(t(`No link yet`).getByText(/single-use link/)).toBeInTheDocument(),await f(t(`Creating`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await f(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await f(t(`Just revoked`).getByText(/The link has been revoked/)).toBeInTheDocument(),await f(t(`Just revoked`).getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument(),await f(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},y={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,d.jsx)(r,{items:{"No link":(0,d.jsx)(c,{...e}),"Active link":(0,d.jsx)(c,{...e,link:h})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>m(e.getByRole(`region`,{name:t}));await t.click(r(`No link`).getByRole(`button`,{name:`Create admin handover link`})),await f(n.onCreate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await f(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await f(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await f(n.onRevoke).toHaveBeenCalled()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument();
    await expect(canvas.getByText(/grants admin and can be used once/)).toBeInTheDocument();
    // Once a link exists, the create prompt is replaced by copy + rotate + revoke.
    await expect(canvas.queryByRole('button', {
      name: 'Create admin handover link'
    })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Rotate link'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Revoke link'
    })).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <HandoverAdminView {...args} isLoading />,
    'Load error': <HandoverAdminView {...args} isError />,
    'No link yet': <HandoverAdminView {...args} />,
    Creating: <HandoverAdminView {...args} isCreating />,
    Copied: <HandoverAdminView {...args} link={LINK} copied />,
    'Just revoked': <HandoverAdminView {...args} justRevoked />,
    'Action error': <HandoverAdminView {...args} link={LINK} actionError />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Create admin handover link'
    })).not.toBeInTheDocument();
    await expect(region('Load error').getByText('Failed to load the admin link.')).toBeInTheDocument();
    await expect(region('No link yet').getByRole('button', {
      name: 'Create admin handover link'
    })).toBeInTheDocument();
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(region('No link yet').getByText(/single-use link/)).toBeInTheDocument();
    await expect(region('Creating').getByRole('button', {
      name: 'Creating…'
    })).toBeDisabled();
    await expect(region('Copied').getByRole('button', {
      name: 'Copied!'
    })).toBeInTheDocument();
    await expect(region('Just revoked').getByText(/The link has been revoked/)).toBeInTheDocument();
    await expect(region('Just revoked').getByRole('button', {
      name: 'Create new admin link'
    })).toBeInTheDocument();
    await expect(region('Action error').getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'No link': <HandoverAdminView {...args} />,
    'Active link': <HandoverAdminView {...args} link={LINK} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('No link').getByRole('button', {
      name: 'Create admin handover link'
    }));
    await expect(args.onCreate).toHaveBeenCalled();
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Copy'
    }));
    await expect(args.onCopy).toHaveBeenCalled();
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Rotate link'
    }));
    await expect(args.onRotate).toHaveBeenCalled();
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onRevoke).toHaveBeenCalled();
  }
}`,...y.parameters?.docs?.source}}},b=[`Data`,`Shells`,`Interactions`]})))()}x();export{_ as Data,y as Interactions,v as Shells,b as __namedExportsOrder,g as default};