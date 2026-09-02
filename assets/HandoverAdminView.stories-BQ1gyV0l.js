import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-DJOl91aY.js";import{n as i,t as a}from"./input-Cdcfw0_t.js";function o({isLoading:e,isError:t,link:n,copied:i,justRevoked:o,isCreating:c,isRotating:l,isRevoking:u,actionError:d,onCopy:f,onCreate:p,onRotate:m,onRevoke:h}){return(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Hand over as admin`}),(0,s.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Create a single-use link that makes the first person who opens it an admin of this team. Send it to one person — anyone who opens it becomes an admin, and it stops working once used.`})]}),e&&(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Loading…`}),t&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Failed to load the admin link.`}),!e&&!t&&o&&(0,s.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`The link has been revoked. It can no longer make anyone an admin.`}),(0,s.jsx)(r,{type:`button`,onClick:p,disabled:c,className:`self-start`,children:c?`Creating…`:`Create new admin link`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!o&&!n&&(0,s.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,s.jsx)(r,{type:`button`,onClick:p,disabled:c,className:`self-start`,children:c?`Creating…`:`Create admin handover link`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}),!e&&!t&&!o&&n&&(0,s.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(a,{"aria-label":`Admin handover link`,readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,s.jsx)(r,{type:`button`,onClick:f,children:i?`Copied!`:`Copy`})]}),(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(r,{type:`button`,variant:`outline`,onClick:m,disabled:l,children:l?`Rotating…`:`Rotate link`}),(0,s.jsx)(r,{type:`button`,variant:`destructive`,onClick:h,disabled:u,children:u?`Revoking…`:`Revoke link`})]}),(0,s.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`This link grants admin and can be used once. Rotating replaces it with a new one; revoking removes it. Either way the old link stops working.`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]})]})}var s;function c(){return(c=e((()=>{n(),i(),s=t(),o.__docgenInfo={description:`Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).

The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
but this link grants **Admin** and is spent on first accept, so the copy has to say both.`,methods:[],displayName:`HandoverAdminView`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read is in flight.`},isError:{required:!0,tsType:{name:`boolean`},description:`The active-admin-link read failed.`},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current single-use admin handover link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justRevoked:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after a revoke, to confirm the link is gone before offering a new one.`},isCreating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isRevoking:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{c(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d=`https://app.teambalance.nl/invite/handover-token-abc`,f={title:`features/handover-admin/HandoverAdminView`,component:o,args:{isLoading:!1,isError:!1,link:null,copied:!1,justRevoked:!1,isCreating:!1,isRotating:!1,isRevoking:!1,actionError:!1,onCopy:u(),onCreate:u(),onRotate:u(),onRevoke:u()}},p={args:{isLoading:!0},play:async({canvas:e})=>{await l(e.getByText(`Loading…`)).toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument()}},m={args:{isError:!0},play:async({canvas:e})=>{await l(e.getByText(`Failed to load the admin link.`)).toBeInTheDocument()}},h={play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Create admin handover link`})).toBeInTheDocument(),await l(e.getByText(/single-use link/)).toBeInTheDocument()}},g={args:{isCreating:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Creating…`})).toBeDisabled()}},_={args:{link:d},play:async({canvas:e})=>{await l(e.getByDisplayValue(d)).toBeInTheDocument(),await l(e.getByText(/grants admin and can be used once/)).toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Create admin handover link`})).not.toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Revoke link`})).toBeInTheDocument()}},v={args:{link:d,copied:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Copied!`})).toBeInTheDocument()}},y={args:{justRevoked:!0},play:async({canvas:e})=>{await l(e.getByText(/The link has been revoked/)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Create new admin link`})).toBeInTheDocument()}},b={args:{link:d,actionError:!0},play:async({canvas:e})=>{await l(e.getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},x={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Create admin handover link`})),await l(n.onCreate).toHaveBeenCalled()}},S={args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Rotate link`})),await l(n.onRotate).toHaveBeenCalled()}},C={args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`})),await l(n.onRevoke).toHaveBeenCalled()}},w={args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Copy`})),await l(n.onCopy).toHaveBeenCalled()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Failed to load the admin link.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Create admin handover link'
    })).toBeInTheDocument();
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(canvas.getByText(/single-use link/)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    actionError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
    await expect(args.onRevoke).toHaveBeenCalled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Loading`,`LoadError`,`NoLinkYet`,`Creating`,`LinkMinted`,`Copied`,`JustRevoked`,`ActionError`,`CreateContract`,`RotateContract`,`RevokeContract`,`CopyContract`]})))()}E();export{b as ActionError,v as Copied,w as CopyContract,x as CreateContract,g as Creating,y as JustRevoked,_ as LinkMinted,m as LoadError,p as Loading,h as NoLinkYet,C as RevokeContract,S as RotateContract,T as __namedExportsOrder,f as default};