import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./button-BcU7NJ34.js";import{n as o,t as s}from"./input-CsEbFyMd.js";function c({isLoading:e,isError:t,link:n,copied:r,justExpired:i,isGenerating:o,isRotating:c,isExpiring:u,actionError:d,onCopy:f,onGenerate:p,onRotate:m,onExpire:h}){return e?(0,l.jsx)(`p`,{className:`text-muted-foreground`,children:`Loading...`}):t?(0,l.jsx)(`p`,{className:`text-destructive`,children:`Failed to load the invite link.`}):i?(0,l.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`The link has been revoked. New joiners can no longer use it.`}),(0,l.jsx)(a,{type:`button`,onClick:p,disabled:o,children:o?`Generating...`:`Generate new link`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}):n?(0,l.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,l.jsxs)(`div`,{className:`flex gap-2`,children:[(0,l.jsx)(s,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,l.jsx)(a,{type:`button`,onClick:f,children:r?`Copied!`:`Copy`})]}),(0,l.jsxs)(`div`,{className:`flex gap-2`,children:[(0,l.jsx)(a,{type:`button`,variant:`outline`,onClick:m,disabled:c,children:c?`Rotating...`:`Rotate link`}),(0,l.jsx)(a,{type:`button`,variant:`destructive`,onClick:h,disabled:u,children:u?`Revoking...`:`Revoke link`})]}),(0,l.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Rotating replaces this link with a new one. Revoking removes it without a replacement. Either way the old link stops working.`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}):(0,l.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`This team doesn't have an invite link yet.`}),(0,l.jsx)(a,{type:`button`,onClick:p,disabled:o,children:o?`Generating...`:`Generate link`}),d&&(0,l.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]})}var l;function u(){return(u=e((()=>{i(),o(),l=t(),c.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The Dialog chrome (trigger + header)
stays in the container, so this stays free of Radix context.

The no-link state is what the dialog shows instead of silently minting on open: generating is now
something the admin asks for, not a side effect of looking (ADR-0025).`,methods:[],displayName:`GenerateInviteContent`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current invite link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justExpired:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after an expire, to confirm the link is gone before offering a new one.`},isGenerating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),u(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h=`https://app.teambalance.nl/invite/abc123`,g={title:`features/generate-invite/GenerateInviteContent`,component:c,args:{isLoading:!1,isError:!1,link:null,copied:!1,justExpired:!1,isGenerating:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:p(),onGenerate:p(),onRotate:p(),onExpire:p()}},_={args:{link:h},play:async({canvas:e})=>{await f(e.getByDisplayValue(h)).toBeInTheDocument()}},v={render:e=>(0,d.jsx)(r,{items:{Loading:(0,d.jsx)(c,{...e,isLoading:!0}),Error:(0,d.jsx)(c,{...e,isError:!0}),"No link":(0,d.jsx)(c,{...e}),Generating:(0,d.jsx)(c,{...e,isGenerating:!0}),Copied:(0,d.jsx)(c,{...e,link:h,copied:!0}),Rotating:(0,d.jsx)(c,{...e,link:h,isRotating:!0}),Revoking:(0,d.jsx)(c,{...e,link:h,isExpiring:!0}),"Just expired":(0,d.jsx)(c,{...e,justExpired:!0}),"Action error":(0,d.jsx)(c,{...e,link:h,actionError:!0})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Loading`).getByText(`Loading...`)).toBeInTheDocument(),await f(t(`Error`).getByText(`Failed to load the invite link.`)).toBeInTheDocument(),await f(t(`No link`).getByText(`This team doesn't have an invite link yet.`)).toBeInTheDocument(),await f(t(`No link`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await f(t(`Generating`).getByRole(`button`,{name:`Generating...`})).toBeDisabled(),await f(t(`Copied`).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument(),await f(t(`Rotating`).getByRole(`button`,{name:`Rotating...`})).toBeDisabled(),await f(t(`Revoking`).getByRole(`button`,{name:`Revoking...`})).toBeDisabled(),await f(t(`Just expired`).getByText(`The link has been revoked. New joiners can no longer use it.`)).toBeInTheDocument(),await f(t(`Just expired`).queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await f(t(`Action error`).getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},y={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,d.jsx)(r,{items:{"Active link":(0,d.jsx)(c,{...e,link:h}),"No link":(0,d.jsx)(c,{...e}),"Just expired":(0,d.jsx)(c,{...e,justExpired:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>m(e.getByRole(`region`,{name:t}));await t.click(r(`Active link`).getByRole(`button`,{name:`Copy`})),await f(n.onCopy).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Rotate link`})),await f(n.onRotate).toHaveBeenCalled(),await t.click(r(`Active link`).getByRole(`button`,{name:`Revoke link`})),await f(n.onExpire).toHaveBeenCalled(),await t.click(r(`No link`).getByRole(`button`,{name:`Generate link`})),await f(n.onGenerate).toHaveBeenCalledTimes(1),await t.click(r(`Just expired`).getByRole(`button`,{name:`Generate new link`})),await f(n.onGenerate).toHaveBeenCalledTimes(2)}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Data`,`Shells`,`Interactions`]})))()}x();export{_ as Data,y as Interactions,v as Shells,b as __namedExportsOrder,g as default};