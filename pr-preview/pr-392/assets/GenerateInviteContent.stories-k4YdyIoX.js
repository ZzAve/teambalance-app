import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BE_MQ6CC.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-DWtWi-SA.js";import{n as s,t as c}from"./input-CVOdPSQW.js";import{n as l,t as u}from"./ConfirmDialog-0Y1AHGJQ.js";import{n as d,t as f}from"./FormError-B3b4LG7B.js";function p({isLoading:e,isError:t,link:n,copied:r,copyFailed:i,justExpired:a,isGenerating:s,isRotating:l,isExpiring:d,actionError:p,onCopy:g,onGenerate:_,onRotate:v,onExpire:y}){let[b,x]=(0,m.useState)(!1);return e?(0,h.jsx)(`p`,{className:`text-muted-foreground`,children:`Loading...`}):t?(0,h.jsx)(`p`,{className:`text-destructive`,children:`Failed to load the invite link.`}):a||!n?(0,h.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,h.jsx)(`p`,{className:`text-small text-muted-foreground`,children:a?`The link has been revoked. New joiners can no longer use it.`:`This team doesn't have an invite link yet.`}),(0,h.jsx)(o,{type:`button`,onClick:_,disabled:s,children:s?`Generating...`:a?`Generate new link`:`Generate link`}),p&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}):(0,h.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,h.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,h.jsxs)(`div`,{className:`flex gap-2`,children:[(0,h.jsx)(c,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,h.jsx)(o,{type:`button`,onClick:g,children:r?`Copied!`:`Copy`})]}),i&&(0,h.jsx)(f,{children:`Couldn't copy automatically. Copy the link from the field above.`}),(0,h.jsxs)(`div`,{className:`flex gap-2`,children:[(0,h.jsx)(o,{type:`button`,variant:`outline`,onClick:v,disabled:l,children:l?`Rotating...`:`Rotate link`}),(0,h.jsx)(o,{type:`button`,variant:`outline`,onClick:()=>x(!0),disabled:d,children:d?`Revoking...`:`Revoke link`})]}),(0,h.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`Rotating replaces this link with a new one. Revoking removes it without a replacement. Either way the old link stops working.`}),p&&(0,h.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`}),(0,h.jsx)(u,{open:b,title:`Revoke the invite link?`,description:`The old link stops working and no replacement is created. Anyone who hasn't already joined with it will need a new link.`,confirmLabel:`Revoke link`,onConfirm:()=>{x(!1),y()},onCancel:()=>x(!1)})]})}var m,h;function g(){return(g=e((()=>{m=t(),a(),s(),d(),l(),h=n(),p.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The outer Dialog chrome (trigger +
header) stays in the container; this component owns only its own local confirm-revoke dialog.

The no-link state is what the dialog shows instead of silently minting on open: generating is now
something the admin asks for, not a side effect of looking (ADR-0025).

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`GenerateInviteContent`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current invite link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},copyFailed:{required:!1,tsType:{name:`boolean`},description:`The browser refused the clipboard write; the link is still in the field to copy by hand.`},justExpired:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after an expire, to confirm the link is gone before offering a new one.`},isGenerating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{r(),g(),_=n(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=`https://app.teambalance.nl/invite/abc123`,S={title:`features/generate-invite/GenerateInviteContent`,component:p,args:{isLoading:!1,isError:!1,link:null,copied:!1,justExpired:!1,isGenerating:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:y(),onGenerate:y(),onRotate:y(),onExpire:y()}},C={args:{link:x},play:async({canvas:e})=>{await v(e.getByDisplayValue(x)).toBeInTheDocument()}},w={render:e=>(0,_.jsx)(i,{items:{Loading:(0,_.jsx)(p,{...e,isLoading:!0}),Error:(0,_.jsx)(p,{...e,isError:!0}),"No link":(0,_.jsx)(p,{...e}),Generating:(0,_.jsx)(p,{...e,isGenerating:!0}),Copied:(0,_.jsx)(p,{...e,link:x,copied:!0}),"Copy refused":(0,_.jsx)(p,{...e,link:x,copyFailed:!0}),Rotating:(0,_.jsx)(p,{...e,link:x,isRotating:!0}),Revoking:(0,_.jsx)(p,{...e,link:x,isExpiring:!0}),"Just expired":(0,_.jsx)(p,{...e,justExpired:!0}),"Action error":(0,_.jsx)(p,{...e,link:x,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>b(e.getByRole(`region`,{name:t}));await v(t(`Loading`).getByText(`Loading...`)).toBeInTheDocument(),await v(t(`Error`).getByText(`Failed to load the invite link.`)).toBeInTheDocument(),await v(t(`No link`).getByText(`This team doesn't have an invite link yet.`)).toBeInTheDocument(),await v(t(`No link`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await v(t(`Generating`).getByRole(`button`,{name:`Generating...`})).toBeDisabled(),await v(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await v(t(`Copy refused`).getByRole(`alert`)).toHaveTextContent(`Couldn't copy automatically. Copy the link from the field above.`),await v(t(`Copied`).queryByRole(`alert`)).not.toBeInTheDocument(),await v(t(`Rotating`).getByRole(`button`,{name:`Rotating...`})).toBeDisabled(),await v(t(`Revoking`).getByRole(`button`,{name:`Revoking...`})).toBeDisabled(),await v(t(`Just expired`).getByText(`The link has been revoked. New joiners can no longer use it.`)).toBeInTheDocument(),await v(t(`Just expired`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await v(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},T={args:{link:x},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=b(document.body);await v(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await v(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await v(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await v(n.onExpire).not.toHaveBeenCalled()}},E={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,_.jsx)(i,{items:{"Active link":(0,_.jsx)(p,{...e,link:x}),"No link":(0,_.jsx)(p,{...e}),"Just expired":(0,_.jsx)(p,{...e,justExpired:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>b(e.getByRole(`region`,{name:t})),i=b(document.body);await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await v(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await v(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await v(n.onExpire).not.toHaveBeenCalled(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await v(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await v(n.onExpire).not.toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await t.click(await i.findByRole(`button`,{name:`Revoke link`})),await v(n.onExpire).toHaveBeenCalled(),await t.click(r(`No link`).getByRole(`button`,{name:`Generate link`})),await v(n.onGenerate).toHaveBeenCalledTimes(1),await t.click(r(`Just expired`).getByRole(`button`,{name:`Generate new link`})),await v(n.onGenerate).toHaveBeenCalledTimes(2)}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <GenerateInviteContent {...args} isLoading />,
    Error: <GenerateInviteContent {...args} isError />,
    // The state that used to be impossible to reach: opening the dialog minted a link on the way
    // in, so "this team has no link" never rendered. Generating is now something the admin asks
    // for (ADR-0025).
    'No link': <GenerateInviteContent {...args} />,
    Generating: <GenerateInviteContent {...args} isGenerating />,
    Copied: <GenerateInviteContent {...args} link={LINK} copied />,
    'Copy refused': <GenerateInviteContent {...args} link={LINK} copyFailed />,
    Rotating: <GenerateInviteContent {...args} link={LINK} isRotating />,
    Revoking: <GenerateInviteContent {...args} link={LINK} isExpiring />,
    // Confirmation after a revoke, before the admin decides whether to make a new one.
    'Just expired': <GenerateInviteContent {...args} justExpired />,
    'Action error': <GenerateInviteContent {...args} link={LINK} actionError />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading...')).toBeInTheDocument();
    await expect(region('Error').getByText('Failed to load the invite link.')).toBeInTheDocument();
    await expect(region('No link').getByText("This team doesn't have an invite link yet.")).toBeInTheDocument();
    await expect(region('No link').queryByRole('button', {
      name: 'Copy'
    })).not.toBeInTheDocument();
    await expect(region('Generating').getByRole('button', {
      name: 'Generating...'
    })).toBeDisabled();
    await expect(region('Copied').getByRole('button', {
      name: 'Copied!'
    })).toBeInTheDocument();
    // The browser refused the clipboard write: say so, and point at the link field beside the button.
    await expect(region('Copy refused').getByRole('alert')).toHaveTextContent("Couldn't copy automatically. Copy the link from the field above.");
    await expect(region('Copied').queryByRole('alert')).not.toBeInTheDocument();
    await expect(region('Rotating').getByRole('button', {
      name: 'Rotating...'
    })).toBeDisabled();
    await expect(region('Revoking').getByRole('button', {
      name: 'Revoking...'
    })).toBeDisabled();
    await expect(region('Just expired').getByText('The link has been revoked. New joiners can no longer use it.')).toBeInTheDocument();
    await expect(region('Just expired').queryByRole('button', {
      name: 'Copy'
    })).not.toBeInTheDocument();
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
    await expect(args.onExpire).not.toHaveBeenCalled();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Active link': <GenerateInviteContent {...args} link={LINK} />,
    'No link': <GenerateInviteContent {...args} />,
    'Just expired': <GenerateInviteContent {...args} justExpired />
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
    await expect(args.onExpire).not.toHaveBeenCalled();

    // Cancelling leaves the link alone and closes the dialog.
    await userEvent.click(dialog.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(canvas.queryByText('Revoke the invite link?')).not.toBeInTheDocument();
    await expect(args.onExpire).not.toHaveBeenCalled();

    // Confirming fires the revoke and closes the dialog.
    await userEvent.click(region('Active link').getByRole('button', {
      name: 'Revoke link'
    }));
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Revoke link'
    }));
    await expect(args.onExpire).toHaveBeenCalled();

    // Both no-link and just-expired route through onGenerate — a running total proves each click
    // fired its own call rather than the spy's earlier state leaking through.
    await userEvent.click(region('No link').getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenCalledTimes(1);
    await userEvent.click(region('Just expired').getByRole('button', {
      name: 'Generate new link'
    }));
    await expect(args.onGenerate).toHaveBeenCalledTimes(2);
  }
}`,...E.parameters?.docs?.source}}},D=[`Data`,`Shells`,`RevokeConfirmOpen`,`Interactions`]})))()}O();export{C as Data,E as Interactions,T as RevokeConfirmOpen,w as Shells,D as __namedExportsOrder,S as default};