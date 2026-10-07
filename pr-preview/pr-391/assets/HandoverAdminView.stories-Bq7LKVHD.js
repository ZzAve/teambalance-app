import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-C7_stQln.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-se-XzOJk.js";import{n as s,t as c}from"./input-BSACwFqh.js";import{n as l,t as u}from"./ConfirmDialog-Dj7hoSwt.js";function d({isLoading:e,isError:t,link:n,copied:r,justRevoked:i,isCreating:a,isRotating:s,isRevoking:l,actionError:d,onCopy:m,onCreate:h,onRotate:g,onRevoke:_}){let[v,y]=(0,f.useState)(!1);return(0,p.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Hand over as admin`}),(0,p.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,p.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),t&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&i&&(0,p.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,p.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,p.jsx)(o,{type:`button`,onClick:h,disabled:a,className:`self-start`,children:a?`Creating…`:`Create new admin link`}),d&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&!n&&(0,p.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,p.jsx)(o,{type:`button`,onClick:h,disabled:a,className:`self-start`,children:a?`Creating…`:`Create admin handover link`}),d&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!i&&n&&(0,p.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,p.jsxs)(`div`,{className:`flex gap-2`,children:[(0,p.jsx)(c,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,p.jsx)(o,{type:`button`,onClick:m,children:r?`Copied!`:`Copy`})]}),(0,p.jsxs)(`div`,{className:`flex gap-2`,children:[(0,p.jsx)(o,{type:`button`,variant:`outline`,onClick:g,disabled:s,children:s?`Rotating…`:`Rotate link`}),(0,p.jsx)(o,{type:`button`,variant:`outline`,onClick:()=>y(!0),disabled:l,children:l?`Revoking…`:`Revoke link`})]}),(0,p.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),d&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),(0,p.jsx)(u,{open:v,title:`Revoke the invite link?`,description:`The old link stops working and no replacement is created. It can no longer be used to become an admin of this team.`,confirmLabel:`Revoke link`,onConfirm:()=>{y(!1),_()},onCancel:()=>y(!1)})]})}var f,p;function m(){return(m=e((()=>{f=t(),a(),s(),l(),p=n(),d.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),m(),h=n(),{expect:g,fn:_,within:v}=__STORYBOOK_MODULE_TEST__,y=`https://app.teambalance.nl/invite/handover-token-abc`,b={title:`features/handover-admin/HandoverAdminView`,component:d,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:_(),onCreate:_(),onRotate:_(),onRevoke:_()}},x={args:{link:y},play:async({canvas:e})=>{await g(e.getByDisplayValue(y)).toBeInTheDocument(),await g(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await g(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await g(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await g(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},S={render:e=>(0,h.jsx)(i,{items:{Loading:(0,h.jsx)(d,{...e,isLoading:!0}),"Load error":(0,h.jsx)(d,{...e,isError:!0}),"No link yet":(0,h.jsx)(d,{...e}),Creating:(0,h.jsx)(d,{...e,isCreating:!0}),Copied:(0,h.jsx)(d,{...e,link:y,copied:!0}),"Just revoked":(0,h.jsx)(d,{...e,justRevoked:!0}),"Action error":(0,h.jsx)(d,{...e,link:y,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>v(e.getByRole(`region`,{name:t}));await g(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await g(t(`Loading`).queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await g(t(`Load error`).getByText(`Failed to load the admin link.`)).toBeInTheDocument(),await g(t(`No link yet`).getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await g(t(`No link yet`).getByText(/single-use link/)).toBeInTheDocument(),await g(t(`Creating`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await g(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await g(t(`Just revoked`).getByText(/The link has been revoked/)).toBeInTheDocument(),await g(t(`Just revoked`).getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument(),await g(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},C={args:{link:y},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=v(document.body);await g(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await g(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await g(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await g(n.onRevoke).not.toHaveBeenCalled()}},w={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,h.jsx)(i,{items:{"No link":(0,h.jsx)(d,{...e}),"Active link":(0,h.jsx)(d,{...e,link:y})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>v(e.getByRole(`region`,{name:t})),i=v(document.body);await t.click(r(`No link`).getByRole(`button`,{name:`Create admin handover link`})),await g(n.onCreate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await g(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await g(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await g(n.onRevoke).not.toHaveBeenCalled(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await g(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await g(n.onRevoke).not.toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await t.click(await i.findByRole(`button`,{name:`Revoke link`})),await g(n.onRevoke).toHaveBeenCalled()}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Data`,`Shells`,`RevokeConfirmOpen`,`Interactions`]})))()}E();export{x as Data,w as Interactions,C as RevokeConfirmOpen,S as Shells,T as __namedExportsOrder,b as default};