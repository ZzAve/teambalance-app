import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-DR2Ep7sx.js";import{n as i,t as a}from"./input-BOOGX4GB.js";function o({isPending:e,isError:t,link:n,copied:i,expired:o,isRotating:c,isExpiring:l,actionError:u,onCopy:d,onRotate:f,onExpire:p,onGenerateNew:m}){return e?(0,s.jsx)(`p`,{className:`text-muted-foreground`,children:`Generating...`}):t?(0,s.jsx)(`p`,{className:`text-destructive`,children:`Failed to generate invite link.`}):n?o?(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`This link has expired. New joiners can no longer use it.`}),(0,s.jsx)(r,{type:`button`,onClick:m,children:`Generate new link`})]}):(0,s.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,s.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Share this link with your team. Anyone with the link can join.`}),(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(a,{readOnly:!0,value:n,onFocus:e=>e.currentTarget.select()}),(0,s.jsx)(r,{type:`button`,onClick:d,children:i?`Copied!`:`Copy`})]}),(0,s.jsxs)(`div`,{className:`flex gap-2`,children:[(0,s.jsx)(r,{type:`button`,variant:`outline`,onClick:f,disabled:c,children:c?`Rotating...`:`Rotate link`}),(0,s.jsx)(r,{type:`button`,variant:`destructive`,onClick:p,disabled:l,children:l?`Expiring...`:`Expire link`})]}),u&&(0,s.jsx)(`p`,{className:`text-sm text-destructive`,children:`Something went wrong. Please try again.`})]}):null}var s;function c(){return(c=e((()=>{n(),i(),s=t(),o.__docgenInfo={description:`Presentational body of the invite dialog. Renders exactly one of: generating / error / expired /
the active link with copy+rotate+expire actions. The mutations, dialog open/close state, and the
copied flag all live in the GenerateInviteDialog container — so each state is renderable in
isolation as a story (see GenerateInviteContent.stories.tsx). The Dialog chrome (trigger + header)
stays in the container, so this stays free of Radix context.`,methods:[],displayName:`GenerateInviteContent`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},link:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},copied:{required:!0,tsType:{name:`boolean`},description:``},expired:{required:!0,tsType:{name:`boolean`},description:``},isRotating:{required:!0,tsType:{name:`boolean`},description:``},isExpiring:{required:!0,tsType:{name:`boolean`},description:``},actionError:{required:!0,tsType:{name:`boolean`},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRotate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onExpire:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onGenerateNew:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{c(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d=`https://app.teambalance.nl/invite/abc123`,f={title:`features/generate-invite/GenerateInviteContent`,component:o,args:{expired:!1,isRotating:!1,isExpiring:!1,actionError:!1,onCopy:u(),onRotate:u(),onExpire:u(),onGenerateNew:u()}},p={args:{isPending:!1,isError:!1,link:null,copied:!1},play:async({canvas:e})=>{await l(e.queryByText(`Generating...`)).not.toBeInTheDocument(),await l(e.queryByRole(`button`,{name:`Copy`})).not.toBeInTheDocument()}},m={args:{isPending:!0,isError:!1,link:null,copied:!1},play:async({canvas:e})=>{await l(e.getByText(`Generating...`)).toBeInTheDocument()}},h={args:{isPending:!1,isError:!0,link:null,copied:!1},play:async({canvas:e})=>{await l(e.getByText(`Failed to generate invite link.`)).toBeInTheDocument()}},g={args:{isPending:!1,isError:!1,link:d,copied:!1},play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByDisplayValue(d)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Copy`})),await l(n.onCopy).toHaveBeenCalled()}},_={args:{isPending:!1,isError:!1,link:d,copied:!1},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Rotate link`})),await l(n.onRotate).toHaveBeenCalled()}},v={args:{isPending:!1,isError:!1,link:d,copied:!1},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Expire link`})),await l(n.onExpire).toHaveBeenCalled()}},y={args:{isPending:!1,isError:!1,link:d,copied:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Copied!`})).toBeInTheDocument()}},b={args:{isPending:!1,isError:!1,link:d,copied:!1,isRotating:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Rotating...`})).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Rotating...`})).toBeDisabled()}},x={args:{isPending:!1,isError:!1,link:d,copied:!1,isExpiring:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Expiring...`})).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Expiring...`})).toBeDisabled()}},S={args:{isPending:!1,isError:!1,link:d,copied:!1,expired:!0},play:async({canvas:e,userEvent:t,args:n})=>{await l(e.getByText(/this link has expired/i)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Generate new link`})),await l(n.onGenerateNew).toHaveBeenCalled()}},C={args:{isPending:!1,isError:!1,link:d,copied:!1,actionError:!0},play:async({canvas:e})=>{await l(e.getByText(/something went wrong/i)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Rotate link`})).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: null,
    copied: false
  },
  play: async ({
    canvas
  }) => {
    // Nothing generated yet and not loading → renders nothing.
    await expect(canvas.queryByText('Generating...')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Copy'
    })).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true,
    isError: false,
    link: null,
    copied: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Generating...')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: true,
    link: null,
    copied: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Failed to generate invite link.')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Expire link'
    }));
    await expect(args.onExpire).toHaveBeenCalled();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false,
    isRotating: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Rotating...'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Rotating...'
    })).toBeDisabled();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false,
    isExpiring: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Expiring...'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Expiring...'
    })).toBeDisabled();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false,
    expired: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText(/this link has expired/i)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Generate new link'
    }));
    await expect(args.onGenerateNew).toHaveBeenCalled();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: false,
    isError: false,
    link: LINK,
    copied: false,
    actionError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/something went wrong/i)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Rotate link'
    })).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Idle`,`Pending`,`Error`,`Generated`,`RotateLink`,`ExpireLink`,`Copied`,`Rotating`,`Expiring`,`Expired`,`ActionError`]})))()}T();export{C as ActionError,y as Copied,h as Error,v as ExpireLink,S as Expired,x as Expiring,g as Generated,p as Idle,m as Pending,_ as RotateLink,b as Rotating,w as __namedExportsOrder,f as default};