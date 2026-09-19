import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-C_TN_pfM.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-Dl2Q85HQ.js";import{n as a,t as o}from"./input-gL0AIawY.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-Dz7f1Hmj.js";function m({isLoading:e,isError:t,link:n,copied:r,justRevoked:a,isCreating:f,isRotating:m,isRevoking:_,actionError:v,onCopy:y,onCreate:b,onRotate:x,onRevoke:S}){let[C,w]=(0,h.useState)(!1);return(0,g.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Hand over as admin`}),(0,g.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),t&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&a&&(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,g.jsx)(i,{type:`button`,onClick:b,disabled:f,className:`self-start`,children:f?`Creating…`:`Create new admin link`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!a&&!n&&(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsx)(i,{type:`button`,onClick:b,disabled:f,className:`self-start`,children:f?`Creating…`:`Create admin handover link`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!a&&n&&(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsxs)(`div`,{className:`flex gap-2`,children:[(0,g.jsx)(o,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,g.jsx)(i,{type:`button`,onClick:y,children:r?`Copied!`:`Copy`})]}),(0,g.jsxs)(`div`,{className:`flex gap-2`,children:[(0,g.jsx)(i,{type:`button`,variant:`outline`,onClick:x,disabled:m,children:m?`Rotating…`:`Rotate link`}),(0,g.jsx)(i,{type:`button`,variant:`outline`,onClick:()=>w(!0),disabled:_,children:_?`Revoking…`:`Revoke link`})]}),(0,g.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}),(0,g.jsx)(p,{open:C,onOpenChange:w,children:(0,g.jsxs)(l,{children:[(0,g.jsxs)(s,{children:[(0,g.jsx)(u,{children:`Revoke the invite link?`}),(0,g.jsx)(d,{children:`The old link stops working and no replacement is created. It can no longer be used to become an admin of this team.`})]}),(0,g.jsxs)(c,{children:[(0,g.jsx)(i,{variant:`outline`,onClick:()=>w(!1),children:`Cancel`}),(0,g.jsx)(i,{variant:`destructive`,onClick:()=>{w(!1),S()},children:`Revoke link`})]})]})})]})}var h,g;function _(){return(_=e((()=>{h=t(),r(),a(),f(),g=n(),m.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{_(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=`https://app.teambalance.nl/invite/handover-token-abc`,S={title:`features/handover-admin/HandoverAdminView`,component:m,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:y(),onCreate:y(),onRotate:y(),onRevoke:y()}},C={args:{isLoading:!0},play:async({canvas:e})=>{await v(e.getByText(`Loading…`)).toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument()}},w={args:{isError:!0},play:async({canvas:e})=>{await v(e.getByText(`Failed to load the admin link.`)).toBeInTheDocument()}},T={play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await v(e.getByText(/single-use link/)).toBeInTheDocument()}},E={args:{isCreating:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Creating…`})).toBeDisabled()}},D={args:{link:x},play:async({canvas:e})=>{await v(e.getByDisplayValue(x)).toBeInTheDocument(),await v(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},O={args:{link:x,copied:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Copied!`})).toBeInTheDocument()}},k={args:{justRevoked:!0},play:async({canvas:e})=>{await v(e.getByText(/The link has been revoked/)).toBeInTheDocument(),await v(e.getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument()}},A={args:{link:x,actionError:!0},play:async({canvas:e})=>{await v(e.getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},j={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Create admin handover link`})),await v(n.onCreate).toHaveBeenCalled()}},M={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Rotate link`})),await v(n.onRotate).toHaveBeenCalled()}},N={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`})),await v(n.onRevoke).not.toHaveBeenCalled();let r=b(document.body);await t.click(await r.findByRole(`button`,{name:`Revoke link`})),await v(n.onRevoke).toHaveBeenCalled()}},P={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await v(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await v(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await v(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await v(n.onRevoke).not.toHaveBeenCalled()}},F={parameters:{chromatic:{disableSnapshot:!0}},args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await t.click(await r.findByRole(`button`,{name:`Cancel`})),await v(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await v(n.onRevoke).not.toHaveBeenCalled()}},I={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Copy`})),await v(n.onCopy).toHaveBeenCalled()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Create admin handover link'
    })).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Failed to load the admin link.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Create admin handover link'
    })).toBeInTheDocument();
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(canvas.getByText(/single-use link/)).toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    isCreating: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Creating…'
    })).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    copied: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Copied!'
    })).toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    justRevoked: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/The link has been revoked/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create new admin link'
    })).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    actionError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create admin handover link'
    }));
    await expect(args.onCreate).toHaveBeenCalled();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Rotate link'
    }));
    await expect(args.onRotate).toHaveBeenCalled();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
    await expect(args.onRevoke).not.toHaveBeenCalled();
    const dialog = within(document.body);
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onRevoke).toHaveBeenCalled();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Cancel'
    }));
    await expect(canvas.queryByText('Revoke the invite link?')).not.toBeInTheDocument();
    await expect(args.onRevoke).not.toHaveBeenCalled();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Copy'
    }));
    await expect(args.onCopy).toHaveBeenCalled();
  }
}`,...I.parameters?.docs?.source}}},L=[`Loading`,`LoadError`,`NoLinkYet`,`Creating`,`LinkMinted`,`Copied`,`JustRevoked`,`ActionError`,`CreateContract`,`RotateContract`,`RevokeContract`,`RevokeConfirmOpen`,`RevokeConfirmCancelled`,`CopyContract`]})))()}R();export{A as ActionError,O as Copied,I as CopyContract,j as CreateContract,E as Creating,k as JustRevoked,D as LinkMinted,w as LoadError,C as Loading,T as NoLinkYet,F as RevokeConfirmCancelled,P as RevokeConfirmOpen,N as RevokeContract,M as RotateContract,L as __namedExportsOrder,S as default};