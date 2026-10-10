import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BoMkVL3I.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-C84Y_rVh.js";import{n as s,t as c}from"./input-BI1qvwwD.js";import{n as l,t as u}from"./ConfirmDialog-DhDlEZGe.js";import{n as d,t as f}from"./FormError-B3b4LG7B.js";function p({isLoading:e,isError:t,link:n,copied:r,copyFailed:i,justRevoked:a,isCreating:s,isRotating:l,isRevoking:d,actionError:p,onCopy:g,onCreate:_,onRotate:v,onRevoke:y}){let[b,x]=(0,m.useState)(!1);return(0,h.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Hand over as admin`}),(0,h.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,h.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),t&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&a&&(0,h.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,h.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,h.jsx)(o,{type:`button`,onClick:_,disabled:s,className:`self-start`,children:s?`Creating…`:`Create new admin link`}),p&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!a&&!n&&(0,h.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,h.jsx)(o,{type:`button`,onClick:_,disabled:s,className:`self-start`,children:s?`Creating…`:`Create admin handover link`}),p&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!a&&n&&(0,h.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,h.jsxs)(`div`,{className:`flex gap-2`,children:[(0,h.jsx)(c,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,h.jsx)(o,{type:`button`,onClick:g,children:r?`Copied!`:`Copy`})]}),i&&(0,h.jsx)(f,{children:`Couldn't copy automatically. Copy the link from the field above.`}),(0,h.jsxs)(`div`,{className:`flex gap-2`,children:[(0,h.jsx)(o,{type:`button`,variant:`outline`,onClick:v,disabled:l,children:l?`Rotating…`:`Rotate link`}),(0,h.jsx)(o,{type:`button`,variant:`outline`,onClick:()=>x(!0),disabled:d,children:d?`Revoking…`:`Revoke link`})]}),(0,h.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),p&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),(0,h.jsx)(u,{open:b,title:`Revoke the invite link?`,description:`The old link stops working and no replacement is created. It can no longer be used to become an admin of this team.`,confirmLabel:`Revoke link`,onConfirm:()=>{x(!1),y()},onCancel:()=>x(!1)})]})}var m,h;function g(){return(g=e((()=>{m=t(),a(),s(),d(),l(),h=n(),p.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},copyFailed:{required:!1,tsType:{name:`boolean`},description:`The browser refused the clipboard write; the link is still in the field to copy by hand.`},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{r(),g(),_=n(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=`https://app.teambalance.nl/invite/handover-token-abc`,S={title:`features/handover-admin/HandoverAdminView`,component:p,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:y(),onCreate:y(),onRotate:y(),onRevoke:y()}},C={args:{link:x},play:async({canvas:e})=>{await v(e.getByDisplayValue(x)).toBeInTheDocument(),await v(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},w={render:e=>(0,_.jsx)(i,{items:{Loading:(0,_.jsx)(p,{...e,isLoading:!0}),"Load error":(0,_.jsx)(p,{...e,isError:!0}),"No link yet":(0,_.jsx)(p,{...e}),Creating:(0,_.jsx)(p,{...e,isCreating:!0}),Copied:(0,_.jsx)(p,{...e,link:x,copied:!0}),"Copy refused":(0,_.jsx)(p,{...e,link:x,copyFailed:!0}),"Just revoked":(0,_.jsx)(p,{...e,justRevoked:!0}),"Action error":(0,_.jsx)(p,{...e,link:x,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>b(e.getByRole(`region`,{name:t}));await v(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await v(t(`Loading`).queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await v(t(`Load error`).getByText(`Failed to load the admin link.`)).toBeInTheDocument(),await v(t(`No link yet`).getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await v(t(`No link yet`).getByText(/single-use link/)).toBeInTheDocument(),await v(t(`Creating`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await v(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await v(t(`Copy refused`).getByRole(`alert`)).toHaveTextContent(`Couldn't copy automatically. Copy the link from the field above.`),await v(t(`Copied`).queryByRole(`alert`)).not.toBeInTheDocument(),await v(t(`Just revoked`).getByText(/The link has been revoked/)).toBeInTheDocument(),await v(t(`Just revoked`).getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument(),await v(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},T={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await v(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await v(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await v(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await v(n.onRevoke).not.toHaveBeenCalled()}},E={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,_.jsx)(i,{items:{"No link":(0,_.jsx)(p,{...e}),"Active link":(0,_.jsx)(p,{...e,link:x})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>b(e.getByRole(`region`,{name:t})),i=b(document.body);await t.click(r(`No link`).getByRole(`button`,{name:`Create admin handover link`})),await v(n.onCreate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await v(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await v(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await v(n.onRevoke).not.toHaveBeenCalled(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await v(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await v(n.onRevoke).not.toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await t.click(await i.findByRole(`button`,{name:`Revoke link`})),await v(n.onRevoke).toHaveBeenCalled()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <HandoverAdminView {...args} isLoading />,
    'Load error': <HandoverAdminView {...args} isError />,
    'No link yet': <HandoverAdminView {...args} />,
    Creating: <HandoverAdminView {...args} isCreating />,
    Copied: <HandoverAdminView {...args} link={LINK} copied />,
    'Copy refused': <HandoverAdminView {...args} link={LINK} copyFailed />,
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
    // The browser refused the clipboard write: say so, and point at the link field beside the button.
    await expect(region('Copy refused').getByRole('alert')).toHaveTextContent("Couldn't copy automatically. Copy the link from the field above.");
    await expect(region('Copied').queryByRole('alert')).not.toBeInTheDocument();
    await expect(region('Just revoked').getByText(/The link has been revoked/)).toBeInTheDocument();
    await expect(region('Just revoked').getByRole('button', {
      name: 'Create new admin link'
    })).toBeInTheDocument();
    await expect(region('Action error').getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D=[`Data`,`Shells`,`RevokeConfirmOpen`,`Interactions`]})))()}O();export{C as Data,E as Interactions,T as RevokeConfirmOpen,w as Shells,D as __namedExportsOrder,S as default};