import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-CN0e_lCC.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./button-Ce3gpAJ8.js";import{n as s,t as c}from"./input-Cr3raJKB.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./dialog-CoZ8kKa7.js";function g({isLoading:e,isError:t,link:n,copied:r,justRevoked:i,isCreating:a,isRotating:s,isRevoking:m,actionError:g,onCopy:y,onCreate:b,onRotate:x,onRevoke:S}){let[C,w]=(0,_.useState)(!1);return(0,v.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Hand over as admin`}),(0,v.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,v.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),t&&(0,v.jsx)(`p`,{className:`text-small text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&i&&(0,v.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,v.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,v.jsx)(o,{type:`button`,onClick:b,disabled:a,className:`self-start`,children:a?`Creating…`:`Create new admin link`}),g&&(0,v.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&!n&&(0,v.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,v.jsx)(o,{type:`button`,onClick:b,disabled:a,className:`self-start`,children:a?`Creating…`:`Create admin handover link`}),g&&(0,v.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&n&&(0,v.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,v.jsxs)(`div`,{className:`flex gap-2`,children:[(0,v.jsx)(c,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,v.jsx)(o,{type:`button`,onClick:y,children:r?`Copied!`:`Copy`})]}),(0,v.jsxs)(`div`,{className:`flex gap-2`,children:[(0,v.jsx)(o,{type:`button`,variant:`outline`,onClick:x,disabled:s,children:s?`Rotating…`:`Rotate link`}),(0,v.jsx)(o,{type:`button`,variant:`outline`,onClick:()=>w(!0),disabled:m,children:m?`Revoking…`:`Revoke link`})]}),(0,v.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),g&&(0,v.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),(0,v.jsx)(h,{open:C,onOpenChange:w,children:(0,v.jsxs)(d,{children:[(0,v.jsxs)(l,{children:[(0,v.jsx)(f,{children:`Revoke the invite link?`}),(0,v.jsx)(p,{children:`The old link stops working and no replacement is created. It can no longer be used to become an admin of this team.`})]}),(0,v.jsxs)(u,{children:[(0,v.jsx)(o,{variant:`outline`,onClick:()=>w(!1),children:`Cancel`}),(0,v.jsx)(o,{variant:`destructive`,onClick:()=>{w(!1),S()},children:`Revoke link`})]})]})})]})}var _,v;function y(){return(y=e((()=>{_=t(),a(),s(),m(),v=n(),g.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{r(),y(),b=n(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,w=`https://app.teambalance.nl/invite/handover-token-abc`,T={title:`features/handover-admin/HandoverAdminView`,component:g,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:S(),onCreate:S(),onRotate:S(),onRevoke:S()}},E={args:{link:w},play:async({canvas:e})=>{await x(e.getByDisplayValue(w)).toBeInTheDocument(),await x(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await x(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await x(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await x(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},D={render:e=>(0,b.jsx)(i,{items:{Loading:(0,b.jsx)(g,{...e,isLoading:!0}),"Load error":(0,b.jsx)(g,{...e,isError:!0}),"No link yet":(0,b.jsx)(g,{...e}),Creating:(0,b.jsx)(g,{...e,isCreating:!0}),Copied:(0,b.jsx)(g,{...e,link:w,copied:!0}),"Just revoked":(0,b.jsx)(g,{...e,justRevoked:!0}),"Action error":(0,b.jsx)(g,{...e,link:w,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>C(e.getByRole(`region`,{name:t}));await x(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await x(t(`Loading`).queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await x(t(`Load error`).getByText(`Failed to load the admin link.`)).toBeInTheDocument(),await x(t(`No link yet`).getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await x(t(`No link yet`).getByText(/single-use link/)).toBeInTheDocument(),await x(t(`Creating`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await x(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await x(t(`Just revoked`).getByText(/The link has been revoked/)).toBeInTheDocument(),await x(t(`Just revoked`).getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument(),await x(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},O={args:{link:w},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=C(document.body);await x(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await x(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await x(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await x(n.onRevoke).not.toHaveBeenCalled()}},k={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,b.jsx)(i,{items:{"No link":(0,b.jsx)(g,{...e}),"Active link":(0,b.jsx)(g,{...e,link:w})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>C(e.getByRole(`region`,{name:t})),i=C(document.body);await t.click(r(`No link`).getByRole(`button`,{name:`Create admin handover link`})),await x(n.onCreate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await x(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await x(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await x(n.onRevoke).not.toHaveBeenCalled(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await x(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await x(n.onRevoke).not.toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await t.click(await i.findByRole(`button`,{name:`Revoke link`})),await x(n.onRevoke).toHaveBeenCalled()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Revoke link'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Revoke the invite link?')).toBeInTheDocument();
    await expect(dialog.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
    await expect(args.onRevoke).not.toHaveBeenCalled();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
    const dialog = within(document.body);
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

    // Revoking is irreversible and leaves no replacement, so it asks for confirmation first (#341)
    // — unlike rotate, which is one click because it lands on a new link right away.
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onRevoke).not.toHaveBeenCalled();

    // Cancelling leaves the link alone and closes the dialog.
    await userEvent.click(dialog.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(canvas.queryByText('Revoke the invite link?')).not.toBeInTheDocument();
    await expect(args.onRevoke).not.toHaveBeenCalled();

    // Confirming fires the revoke and closes the dialog.
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Revoke link'
    }));
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onRevoke).toHaveBeenCalled();
  }
}`,...k.parameters?.docs?.source}}},A=[`Data`,`Shells`,`RevokeConfirmOpen`,`Interactions`]})))()}j();export{E as Data,k as Interactions,O as RevokeConfirmOpen,D as Shells,A as __namedExportsOrder,T as default};