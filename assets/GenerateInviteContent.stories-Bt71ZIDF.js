import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyS7Yi9.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-BNHeYByf.js";import{n as a,t as o}from"./input-DR4rLi4i.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-D6E64Zuo.js";function m({isLoading:e,isError:t,link:n,copied:r,justExpired:a,isGenerating:f,isRotating:m,isExpiring:_,actionError:v,onCopy:y,onGenerate:b,onRotate:x,onExpire:S}){let[C,w]=(0,h.useState)(!1);return e?(0,g.jsx)(`p`,{className:`text-muted-foreground`,children:`Loading...`}):t?(0,g.jsx)(`p`,{className:`text-destructive`,children:`Failed to load the invite link.`}):a?(0,g.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`The link has been revoked. New joiners can no longer use it.`}),(0,g.jsx)(i,{type:`button`,onClick:b,disabled:f,children:f?`Generating...`:`Generate new link`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}):n?(0,g.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,g.jsxs)(`div`,{className:`flex gap-2`,children:[(0,g.jsx)(o,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,g.jsx)(i,{type:`button`,onClick:y,children:r?`Copied!`:`Copy`})]}),(0,g.jsxs)(`div`,{className:`flex gap-2`,children:[(0,g.jsx)(i,{type:`button`,variant:`outline`,onClick:x,disabled:m,children:m?`Rotating...`:`Rotate link`}),(0,g.jsx)(i,{type:`button`,variant:`outline`,onClick:()=>w(!0),disabled:_,children:_?`Revoking...`:`Revoke link`})]}),(0,g.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`Rotating replaces this link with a new one. Revoking removes it without a replacement. Either way the old link stops working.`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`}),(0,g.jsx)(p,{open:C,onOpenChange:w,children:(0,g.jsxs)(l,{children:[(0,g.jsxs)(s,{children:[(0,g.jsx)(u,{children:`Revoke the invite link?`}),(0,g.jsx)(d,{children:`The old link stops working and no replacement is created. Anyone who hasn't already joined with it will need a new link.`})]}),(0,g.jsxs)(c,{children:[(0,g.jsx)(i,{variant:`outline`,onClick:()=>w(!1),children:`Cancel`}),(0,g.jsx)(i,{variant:`destructive`,onClick:()=>{w(!1),S()},children:`Revoke link`})]})]})})]}):(0,g.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This team doesn't have an invite link yet.`}),(0,g.jsx)(i,{type:`button`,onClick:b,disabled:f,children:f?`Generating...`:`Generate link`}),v&&(0,g.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]})}var h,g;function _(){return(_=e((()=>{h=t(),r(),a(),f(),g=n(),m.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The outer Dialog chrome (trigger +
header) stays in the container; this component owns only its own local confirm-revoke dialog.

The no-link state is what the dialog shows instead of silently minting on open: generating is now
something the admin asks for, not a side effect of looking (ADR-0025).

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`GenerateInviteContent`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current invite link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justExpired:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after an expire, to confirm the link is gone before offering a new one.`},isGenerating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{_(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=`https://app.teambalance.nl/invite/abc123`,S={title:`features/generate-invite/GenerateInviteContent`,component:m,args:{isLoading:!1,isError:!1,link:null,copied:!1,justExpired:!1,isGenerating:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:y(),onGenerate:y(),onRotate:y(),onExpire:y()}},C={args:{isLoading:!0},play:async({canvas:e})=>{await v(e.getByText(`Loading...`)).toBeInTheDocument()}},w={args:{isError:!0},play:async({canvas:e})=>{await v(e.getByText(`Failed to load the invite link.`)).toBeInTheDocument()}},T={play:async({canvas:e,userEvent:t,args:n})=>{await v(e.getByText(`This team doesn't have an invite link yet.`)).toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Generate link`})),await v(n.onGenerate).toHaveBeenCalled()}},E={args:{isGenerating:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Generating...`})).toBeDisabled()}},D={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await v(e.getByDisplayValue(x)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Copy`})),await v(n.onCopy).toHaveBeenCalled()}},O={args:{link:x,copied:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Copied!`})).toBeInTheDocument()}},k={parameters:{chromatic:{disableSnapshot:!0}},args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Rotate link`})),await v(n.onRotate).toHaveBeenCalled()}},A={parameters:{chromatic:{disableSnapshot:!0}},args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`})),await v(n.onExpire).not.toHaveBeenCalled();let r=b(document.body);await t.click(await r.findByRole(`button`,{name:`Revoke link`})),await v(n.onExpire).toHaveBeenCalled()}},j={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await v(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await v(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await v(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await v(n.onExpire).not.toHaveBeenCalled()}},M={parameters:{chromatic:{disableSnapshot:!0}},args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await t.click(await r.findByRole(`button`,{name:`Cancel`})),await v(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await v(n.onExpire).not.toHaveBeenCalled()}},N={args:{link:x,isRotating:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Rotating...`})).toBeDisabled()}},P={args:{link:x,isExpiring:!0},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Revoking...`})).toBeDisabled()}},F={args:{justExpired:!0},play:async({canvas:e,userEvent:t,args:n})=>{await v(e.getByText(`The link has been revoked. New joiners can no longer use it.`)).toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Generate new link`})),await v(n.onGenerate).toHaveBeenCalled()}},I={args:{link:x,actionError:!0},play:async({canvas:e})=>{await v(e.getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Failed to load the invite link.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText("This team doesn't have an invite link yet.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Copy'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenCalled();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    isGenerating: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Generating...'
    })).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Copy'
    }));
    await expect(args.onCopy).toHaveBeenCalled();
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
  // Behavioural twin of ActiveLink — onRotate fires while the active-link picture is unchanged
  // (ADR-0027 §2).
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
      name: 'Rotate link'
    }));
    await expect(args.onRotate).toHaveBeenCalled();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of ActiveLink — onExpire fires while the active-link picture is unchanged
  // (ADR-0027 §2).
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
    await expect(args.onExpire).not.toHaveBeenCalled();
    const dialog = within(document.body);
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onExpire).toHaveBeenCalled();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
    await expect(args.onExpire).not.toHaveBeenCalled();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
    await expect(args.onExpire).not.toHaveBeenCalled();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    isRotating: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Rotating...'
    })).toBeDisabled();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    isExpiring: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Revoking...'
    })).toBeDisabled();
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    justExpired: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('The link has been revoked. New joiners can no longer use it.')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Copy'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Generate new link'
    }));
    await expect(args.onGenerate).toHaveBeenCalled();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    actionError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...I.parameters?.docs?.source}}},L=[`Loading`,`Error`,`NoLink`,`Generating`,`ActiveLink`,`Copied`,`RotateLink`,`RevokeLink`,`RevokeConfirmOpen`,`RevokeConfirmCancelled`,`Rotating`,`Revoking`,`JustExpired`,`ActionError`]})))()}R();export{I as ActionError,D as ActiveLink,O as Copied,w as Error,E as Generating,F as JustExpired,C as Loading,T as NoLink,M as RevokeConfirmCancelled,j as RevokeConfirmOpen,A as RevokeLink,P as Revoking,k as RotateLink,N as Rotating,L as __namedExportsOrder,S as default};