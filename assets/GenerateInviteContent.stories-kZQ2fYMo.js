import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-pM1YIdFp.js";import{n as i,t as a}from"./input-BoqdaVRT.js";function o({isLoading:e,isError:t,link:n,copied:i,justExpired:o,isGenerating:c,isRotating:l,isExpiring:u,actionError:d,onCopy:f,onGenerate:p,onRotate:m,onExpire:h}){return e?(0,s.jsx)(`p`,{className:`text-muted-foreground`,children:`Loading...`}):t?(0,s.jsx)(`p`,{className:`text-destructive`,children:`Failed to load the invite link.`}):o?(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`The link has been revoked. New joiners can no longer use it.`}),(0,s.jsx)(r,{type:`button`,onClick:p,disabled:c,children:c?`Generating...`:`Generate new link`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}):n?(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(a,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,s.jsx)(r,{type:`button`,onClick:f,children:i?`Copied!`:`Copy`})]}),(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(r,{type:`button`,variant:`outline`,onClick:m,disabled:l,children:l?`Rotating...`:`Rotate link`}),(0,s.jsx)(r,{type:`button`,variant:`destructive`,onClick:h,disabled:u,children:u?`Revoking...`:`Revoke link`})]}),(0,s.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Rotating replaces this link with a new one. Revoking removes it without a replacement. Either way the old link stops working.`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}):(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`This team doesn't have an invite link yet.`}),(0,s.jsx)(r,{type:`button`,onClick:p,disabled:c,children:c?`Generating...`:`Generate link`}),d&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]})}var s;function c(){return(c=e((()=>{n(),i(),s=t(),o.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The Dialog chrome (trigger + header)
stays in the container, so this stays free of Radix context.

The no-link state is what the dialog shows instead of silently minting on open: generating is now
something the admin asks for, not a side effect of looking (ADR-0025).`,methods:[],displayName:`GenerateInviteContent`,props:{isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The team's current invite link, or null if it has none.`},copied:{required:!0,tsType:{name:`boolean`},description:``},justExpired:{required:!0,tsType:{name:`boolean`},description:`Set only for the moment after an expire, to confirm the link is gone before offering a new one.`},isGenerating:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{c(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d=`https://app.teambalance.nl/invite/abc123`,f={title:`features/generate-invite/GenerateInviteContent`,component:o,args:{isLoading:!1,isError:!1,link:null,copied:!1,justExpired:!1,isGenerating:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:u(),onGenerate:u(),onRotate:u(),onExpire:u()}},p={args:{isLoading:!0},play:async({canvas:e})=>{await l(e.getByText(`Loading...`)).toBeInTheDocument()}},m={args:{isError:!0},play:async({canvas:e})=>{await l(e.getByText(`Failed to load the invite link.`)).toBeInTheDocument()}},h={play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByText(`This team doesn't have an invite link yet.`)).toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Generate link`})),await l(n.onGenerate).toHaveBeenCalled()}},g={args:{isGenerating:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Generating...`})).toBeDisabled()}},_={args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByDisplayValue(d)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Copy`})),await l(n.onCopy).toHaveBeenCalled()}},v={args:{link:d,copied:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Copied!`})).toBeInTheDocument()}},y={parameters:{chromatic:{disableSnapshot:!0}},args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Rotate link`})),await l(n.onRotate).toHaveBeenCalled()}},b={parameters:{chromatic:{disableSnapshot:!0}},args:{link:d},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Revoke link`})),await l(n.onExpire).toHaveBeenCalled()}},x={args:{link:d,isRotating:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Rotating...`})).toBeDisabled()}},S={args:{link:d,isExpiring:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Revoking...`})).toBeDisabled()}},C={args:{justExpired:!0},play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByText(`The link has been revoked. New joiners can no longer use it.`)).toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Generate new link`})),await l(n.onGenerate).toHaveBeenCalled()}},w={args:{link:d,actionError:!0},play:async({canvas:e})=>{await l(e.getByText(`Something went wrong. Please try again.`)).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Failed to load the invite link.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
    await expect(args.onExpire).toHaveBeenCalled();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    link: LINK,
    actionError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T=[`Loading`,`Error`,`NoLink`,`Generating`,`ActiveLink`,`Copied`,`RotateLink`,`RevokeLink`,`Rotating`,`Revoking`,`JustExpired`,`ActionError`]})))()}E();export{w as ActionError,_ as ActiveLink,v as Copied,m as Error,g as Generating,C as JustExpired,p as Loading,h as NoLink,b as RevokeLink,S as Revoking,y as RotateLink,x as Rotating,T as __namedExportsOrder,f as default};