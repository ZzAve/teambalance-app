import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-D1KyW-0E.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-Cu7seX_1.js";import{n as s,t as c}from"./input-1VWR2H2d.js";import{n as l,t as u}from"./ConfirmDialog-Cp_Xl-Ab.js";function d({isLoading:e,isError:t,link:n,copied:r,justExpired:i,isGenerating:a,isRotating:s,isExpiring:l,actionError:d,onCopy:m,onGenerate:h,onRotate:g,onExpire:_}){let[v,y]=(0,f.useState)(!1);return e?(0,p.jsx)(`p`,{className:`text-muted-foreground`,children:`Loading...`}):t?(0,p.jsx)(`p`,{className:`text-destructive`,children:`Failed to load the invite link.`}):i||!n?(0,p.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,p.jsx)(`p`,{className:`text-small text-muted-foreground`,children:i?`The link has been revoked. New joiners can no longer use it.`:`This team doesn't have an invite link yet.`}),(0,p.jsx)(o,{type:`button`,onClick:h,disabled:a,children:a?`Generating...`:i?`Generate new link`:`Generate link`}),d&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`})]}):(0,p.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,p.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,p.jsxs)(`div`,{className:`flex gap-2`,children:[(0,p.jsx)(c,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,p.jsx)(o,{type:`button`,onClick:m,children:r?`Copied!`:`Copy`})]}),(0,p.jsxs)(`div`,{className:`flex gap-2`,children:[(0,p.jsx)(o,{type:`button`,variant:`outline`,onClick:g,disabled:s,children:s?`Rotating...`:`Rotate link`}),(0,p.jsx)(o,{type:`button`,variant:`outline`,onClick:()=>y(!0),disabled:l,children:l?`Revoking...`:`Revoke link`})]}),(0,p.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`Rotating replaces this link with a new one. Revoking removes it without a replacement. Either way the old link stops working.`}),d&&(0,p.jsx)(`p`,{className:`text-small text-destructive`,children:`Something went wrong. Please try again.`}),(0,p.jsx)(u,{open:v,title:`Revoke the invite link?`,description:`The old link stops working and no replacement is created. Anyone who hasn't already joined with it will need a new link.`,confirmLabel:`Revoke link`,onConfirm:()=>{y(!1),_()},onCancel:()=>y(!1)})]})}var f,p;function m(){return(m=e((()=>{f=t(),a(),s(),l(),p=n(),d.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The outer Dialog chrome (trigger +
header) stays in the container; this component owns only its own local confirm-revoke dialog.

The no-link state is what the dialog shows instead of silently minting on open: generating is now
something the admin asks for, not a side effect of looking (ADR-0025).

Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
unlike rotate which lands on a new link in the same click.`,methods:[],displayName:`GenerateInviteContent`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current invite link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justExpired:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after an expire, to confirm the link is gone before offering a new one.`},isGenerating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),m(),h=n(),{expect:g,fn:_,within:v}=__STORYBOOK_MODULE_TEST__,y=`https://app.teambalance.nl/invite/abc123`,b={title:`features/generate-invite/GenerateInviteContent`,component:d,args:{isLoading:!1,isError:!1,link:null,copied:!1,justExpired:!1,isGenerating:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:_(),onGenerate:_(),onRotate:_(),onExpire:_()}},x={args:{link:y},play:async({canvas:e})=>{await g(e.getByDisplayValue(y)).toBeInTheDocument()}},S={render:e=>(0,h.jsx)(i,{items:{Loading:(0,h.jsx)(d,{...e,isLoading:!0}),Error:(0,h.jsx)(d,{...e,isError:!0}),"No link":(0,h.jsx)(d,{...e}),Generating:(0,h.jsx)(d,{...e,isGenerating:!0}),Copied:(0,h.jsx)(d,{...e,link:y,copied:!0}),Rotating:(0,h.jsx)(d,{...e,link:y,isRotating:!0}),Revoking:(0,h.jsx)(d,{...e,link:y,isExpiring:!0}),"Just expired":(0,h.jsx)(d,{...e,justExpired:!0}),"Action error":(0,h.jsx)(d,{...e,link:y,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>v(e.getByRole(`region`,{name:t}));await g(t(`Loading`).getByText(`Loading...`)).toBeInTheDocument(),await g(t(`Error`).getByText(`Failed to load the invite link.`)).toBeInTheDocument(),await g(t(`No link`).getByText(`This team doesn't have an invite link yet.`)).toBeInTheDocument(),await g(t(`No link`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await g(t(`Generating`).getByRole(`button`,{name:`Generating...`})).toBeDisabled(),await g(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await g(t(`Rotating`).getByRole(`button`,{name:`Rotating...`})).toBeDisabled(),await g(t(`Revoking`).getByRole(`button`,{name:`Revoking...`})).toBeDisabled(),await g(t(`Just expired`).getByText(`The link has been revoked. New joiners can no longer use it.`)).toBeInTheDocument(),await g(t(`Just expired`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await g(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},C={args:{link:y},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`}));let r=v(document.body);await g(await r.findByText(`Revoke the invite link?`)).toBeInTheDocument(),await g(r.getByText(/old link stops working and no replacement is created/)).toBeInTheDocument(),await g(r.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument(),await g(n.onExpire).not.toHaveBeenCalled()}},w={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,h.jsx)(i,{items:{"Active link":(0,h.jsx)(d,{...e,link:y}),"No link":(0,h.jsx)(d,{...e}),"Just expired":(0,h.jsx)(d,{...e,justExpired:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>v(e.getByRole(`region`,{name:t})),i=v(document.body);await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await g(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await g(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await g(n.onExpire).not.toHaveBeenCalled(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await g(e.queryByText(`Revoke the invite link?`)).not.toBeInTheDocument(),await g(n.onExpire).not.toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await t.click(await i.findByRole(`button`,{name:`Revoke link`})),await g(n.onExpire).toHaveBeenCalled(),await t.click(r(`No link`).getByRole(`button`,{name:`Generate link`})),await g(n.onGenerate).toHaveBeenCalledTimes(1),await t.click(r(`Just expired`).getByRole(`button`,{name:`Generate new link`})),await g(n.onGenerate).toHaveBeenCalledTimes(2)}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <GenerateInviteContent {...args} isLoading />,
    Error: <GenerateInviteContent {...args} isError />,
    // The state that used to be impossible to reach: opening the dialog minted a link on the way
    // in, so "this team has no link" never rendered. Generating is now something the admin asks
    // for (ADR-0025).
    'No link': <GenerateInviteContent {...args} />,
    Generating: <GenerateInviteContent {...args} isGenerating />,
    Copied: <GenerateInviteContent {...args} link={LINK} copied />,
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
    await expect(args.onExpire).not.toHaveBeenCalled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Data`,`Shells`,`RevokeConfirmOpen`,`Interactions`]})))()}E();export{x as Data,w as Interactions,C as RevokeConfirmOpen,S as Shells,T as __namedExportsOrder,b as default};