import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Dnrk4Q1i.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-CKd6OPi-.js";import{n as a,t as o}from"./button-W1GRNbO0.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"./dialog-DaQh70xg.js";function m(e,t){return e.consumedAt?`consumed`:e.expiresAt&&new Date(e.expiresAt).getTime()<=t.getTime()?`expired`:`active`}function h(e){return g[e]}var g;function _(){return(_=e((()=>{g={active:`Active`,expired:`Expired`,consumed:`Used`}})))()}function v({codes:e=[],isLoading:t,isError:n,isForbidden:r,isSaving:i,errorCode:a,now:f=new Date,onCreate:h,onRevoke:g}){let[_,v]=(0,b.useState)(null);return(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Creation codes`}),(0,x.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Generate one-time codes that let a new owner create a team.`}),t&&(0,x.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,x.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`You don't have access to creation codes.`}),n&&!r&&(0,x.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load creation codes. Please try again.`}),!t&&!n&&!r&&(0,x.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(o,{disabled:i,onClick:h,children:`Generate code`})}),a===`CONSUMED`&&(0,x.jsx)(`p`,{className:`text-sm text-red`,children:`That code was already used and cannot be revoked.`}),e.length===0?(0,x.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No creation codes yet. Generate one above.`}):(0,x.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,x.jsx)(y,{code:e,status:m(e,f),isSaving:i,onRequestRevoke:v},e.code))}),(0,x.jsx)(p,{open:_!==null,onOpenChange:e=>{e||v(null)},children:(0,x.jsxs)(l,{children:[(0,x.jsxs)(s,{children:[(0,x.jsx)(u,{children:`Revoke code`}),(0,x.jsxs)(d,{children:[`Revoke "`,_?.code,`"? It can no longer be used to create a team.`]})]}),(0,x.jsxs)(c,{children:[(0,x.jsx)(o,{variant:`outline`,onClick:()=>v(null),children:`Cancel`}),(0,x.jsx)(o,{variant:`destructive`,onClick:()=>{_&&g(_),v(null)},children:`Revoke`})]})]})})]})]})}function y({code:e,status:t,isSaving:n,onRequestRevoke:r}){return(0,x.jsxs)(`li`,{className:`flex flex-wrap items-center gap-3 p-3`,children:[(0,x.jsx)(`span`,{className:`font-mono text-sm font-medium tracking-wide`,children:e.code}),(0,x.jsx)(`span`,{className:`rounded-full px-2 py-0.5 text-xs font-semibold ${S[t]}`,children:h(t)}),t!==`consumed`&&(0,x.jsx)(o,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:n,onClick:()=>r(e),children:`Revoke`})]})}var b,x,S;function C(){return(C=e((()=>{b=t(),a(),f(),_(),x=n(),S={active:`bg-green/12 text-green`,expired:`bg-muted text-muted-foreground`,consumed:`bg-blue/10 text-blue`},v.__docgenInfo={description:`Presentational creation-codes admin UI. Owns only local view state (the revoke-confirm dialog
target); the query and mutations live in the container. State shells are props-driven so every
state is a no-network story (ADR-0017).`,methods:[],displayName:`ManageCreationCodesView`,props:{codes:{required:!1,tsType:{name:`Array`,elements:[{name:`CreationCode`}],raw:`CreationCode[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isForbidden:{required:!1,tsType:{name:`boolean`},description:`403 — the caller is not a platform admin; renders a no-access shell rather than an error.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator (e.g. CONSUMED), shown inline.`},now:{required:!1,tsType:{name:`Date`},description:`Injected so status derivation is deterministic in tests; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(code: CreationCode) => void`,signature:{arguments:[{type:{name:`CreationCode`},name:`code`}],return:{name:`void`}}},description:``}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),C(),w=n(),{expect:T,fn:E,within:D}=__STORYBOOK_MODULE_TEST__,O=new Date(`2026-08-03T12:00:00Z`),k=[{code:`AAAA-BBBB-CCCC`,createdAt:`2026-08-01T00:00:00Z`,expiresAt:void 0,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`DDDD-EEEE-FFFF`,createdAt:`2026-07-01T00:00:00Z`,expiresAt:`2026-07-15T00:00:00Z`,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`GGGG-HHHH-JJJJ`,createdAt:`2026-07-20T00:00:00Z`,expiresAt:void 0,consumedAt:`2026-07-21T00:00:00Z`,consumedByUserId:`u1`,createdTeamId:`t1`}],A={title:`features/manage-creation-codes/ManageCreationCodesView`,component:v,args:{codes:k,now:O,onCreate:E(),onRevoke:E()}},j={play:async({canvas:e})=>{await T(e.getByText(`AAAA-BBBB-CCCC`)).toBeInTheDocument(),await T(e.getByText(`Active`)).toBeInTheDocument(),await T(e.getByText(`Expired`)).toBeInTheDocument(),await T(e.getByText(`Used`)).toBeInTheDocument(),await T(e.getAllByRole(`button`,{name:`Revoke`})).toHaveLength(2)}},M={render:e=>(0,w.jsx)(i,{items:{Loading:(0,w.jsx)(v,{...e,isLoading:!0}),Error:(0,w.jsx)(v,{...e,isError:!0}),Forbidden:(0,w.jsx)(v,{...e,isForbidden:!0}),Empty:(0,w.jsx)(v,{...e,codes:[]}),"Revoke blocked":(0,w.jsx)(v,{...e,errorCode:`CONSUMED`})}}),play:async({canvas:e})=>{let t=t=>D(e.getByRole(`region`,{name:t}));await T(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await T(t(`Loading`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await T(t(`Error`).getByText(`Couldn't load creation codes. Please try again.`)).toBeInTheDocument(),await T(t(`Error`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await T(t(`Forbidden`).getByText(`You don't have access to creation codes.`)).toBeInTheDocument(),await T(t(`Forbidden`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await T(t(`Empty`).getByText(`No creation codes yet. Generate one above.`)).toBeInTheDocument(),await T(t(`Empty`).getByRole(`button`,{name:`Generate code`})).toBeEnabled(),await T(t(`Revoke blocked`).getByText(`That code was already used and cannot be revoked.`)).toBeInTheDocument()}},N={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,w.jsx)(i,{items:{Empty:(0,w.jsx)(v,{...e,codes:[]}),"With items":(0,w.jsx)(v,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>D(e.getByRole(`region`,{name:t})),i=D(document.body);await t.click(r(`Empty`).getByRole(`button`,{name:`Generate code`})),await T(n.onCreate).toHaveBeenCalled(),await t.click(r(`With items`).getAllByRole(`button`,{name:`Revoke`})[0]),await T(await i.findByText(/can no longer be used to create a team/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Revoke`})),await T(n.onRevoke).toHaveBeenCalledWith(k[0])}},P={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Revoke`})[0]);let n=D(document.body);await T(await n.findByText(/can no longer be used to create a team/)).toBeInTheDocument(),await T(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('AAAA-BBBB-CCCC')).toBeInTheDocument();
    await expect(canvas.getByText('Active')).toBeInTheDocument();
    await expect(canvas.getByText('Expired')).toBeInTheDocument();
    await expect(canvas.getByText('Used')).toBeInTheDocument();
    // Only the two unconsumed codes (active + expired) expose a Revoke button.
    await expect(canvas.getAllByRole('button', {
      name: 'Revoke'
    })).toHaveLength(2);
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <ManageCreationCodesView {...args} isLoading />,
    Error: <ManageCreationCodesView {...args} isError />,
    Forbidden: <ManageCreationCodesView {...args} isForbidden />,
    Empty: <ManageCreationCodesView {...args} codes={[]} />,
    'Revoke blocked': <ManageCreationCodesView {...args} errorCode="CONSUMED" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load creation codes. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
    await expect(region('Forbidden').getByText("You don't have access to creation codes.")).toBeInTheDocument();
    await expect(region('Forbidden').queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
    await expect(region('Empty').getByText('No creation codes yet. Generate one above.')).toBeInTheDocument();
    await expect(region('Empty').getByRole('button', {
      name: 'Generate code'
    })).toBeEnabled();
    await expect(region('Revoke blocked').getByText('That code was already used and cannot be revoked.')).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Empty: <ManageCreationCodesView {...args} codes={[]} />,
    'With items': <ManageCreationCodesView {...args} />
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
    await userEvent.click(region('Empty').getByRole('button', {
      name: 'Generate code'
    }));
    await expect(args.onCreate).toHaveBeenCalled();

    // Open the confirm dialog from the first (active) code's Revoke button.
    await userEvent.click(region('With items').getAllByRole('button', {
      name: 'Revoke'
    })[0]);
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument();
    // While the modal is open the list buttons are aria-hidden, so only the dialog's Revoke resolves.
    await userEvent.click(dialog.getByRole('button', {
      name: 'Revoke'
    }));
    await expect(args.onRevoke).toHaveBeenCalledWith(CODES[0]);
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Revoke'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument();
    await expect(dialog.getByRole('button', {
      name: 'Cancel'
    })).toBeInTheDocument();
  }
}`,...P.parameters?.docs?.source}}},F=[`Data`,`Shells`,`Interactions`,`RevokeConfirmOpen`]})))()}I();export{j as Data,N as Interactions,P as RevokeConfirmOpen,M as Shells,F as __namedExportsOrder,A as default};