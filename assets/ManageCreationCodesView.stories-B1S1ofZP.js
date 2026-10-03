import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Xmuaksu2.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./button-WU2s378O.js";import{n as s,t as c}from"./ConfirmDialog-ANvSceFe.js";function l(e,t){return e.consumedAt?`consumed`:e.expiresAt&&new Date(e.expiresAt).getTime()<=t.getTime()?`expired`:`active`}function u(e){return d[e]}var d;function f(){return(f=e((()=>{d={active:`Active`,expired:`Expired`,consumed:`Used`}})))()}function p({codes:e=[],isLoading:t,isError:n,isForbidden:r,isSaving:i,errorCode:a,now:s=new Date,onCreate:u,onRevoke:d}){let[f,p]=(0,h.useState)(null);return(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Creation codes`}),(0,g.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Generate one-time codes that let a new owner create a team.`}),t&&(0,g.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,g.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`You don't have access to creation codes.`}),n&&!r&&(0,g.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load creation codes. Please try again.`}),!t&&!n&&!r&&(0,g.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,g.jsx)(`div`,{children:(0,g.jsx)(o,{disabled:i,onClick:u,children:`Generate code`})}),a===`CONSUMED`&&(0,g.jsx)(`p`,{className:`text-small text-red`,children:`That code was already used and cannot be revoked.`}),e.length===0?(0,g.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No creation codes yet. Generate one above.`}):(0,g.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,g.jsx)(m,{code:e,status:l(e,s),isSaving:i,onRequestRevoke:p},e.code))}),(0,g.jsx)(c,{open:f!==null,title:`Revoke code`,description:(0,g.jsxs)(g.Fragment,{children:[`Revoke "`,f?.code,`"? It can no longer be used to create a team.`]}),confirmLabel:`Revoke`,onConfirm:()=>{f&&d(f),p(null)},onCancel:()=>p(null)})]})]})}function m({code:e,status:t,isSaving:n,onRequestRevoke:r}){return(0,g.jsxs)(`li`,{className:`flex flex-wrap items-center gap-3 p-3`,children:[(0,g.jsx)(`span`,{className:`font-mono text-small font-medium tracking-wide`,children:e.code}),(0,g.jsx)(`span`,{className:`rounded-full px-2 py-0.5 text-caption font-semibold ${_[t]}`,children:u(t)}),t!==`consumed`&&(0,g.jsx)(o,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:n,onClick:()=>r(e),children:`Revoke`})]})}var h,g,_;function v(){return(v=e((()=>{h=t(),a(),s(),f(),g=n(),_={active:`bg-green/12 text-green`,expired:`bg-muted text-muted-foreground`,consumed:`bg-blue/10 text-blue`},p.__docgenInfo={description:`Presentational creation-codes admin UI. Owns only local view state (the revoke-confirm dialog
target); the query and mutations live in the container. State shells are props-driven so every
state is a no-network story (ADR-0017).`,methods:[],displayName:`ManageCreationCodesView`,props:{codes:{required:!1,tsType:{name:`Array`,elements:[{name:`CreationCode`}],raw:`CreationCode[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isForbidden:{required:!1,tsType:{name:`boolean`},description:`403 — the caller is not a platform admin; renders a no-access shell rather than an error.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator (e.g. CONSUMED), shown inline.`},now:{required:!1,tsType:{name:`Date`},description:`Injected so status derivation is deterministic in tests; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(code: CreationCode) => void`,signature:{arguments:[{type:{name:`CreationCode`},name:`code`}],return:{name:`void`}}},description:``}}}})))()}var y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{r(),v(),y=n(),{expect:b,fn:x,within:S}=__STORYBOOK_MODULE_TEST__,C=new Date(`2026-08-03T12:00:00Z`),w=[{code:`AAAA-BBBB-CCCC`,createdAt:`2026-08-01T00:00:00Z`,expiresAt:void 0,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`DDDD-EEEE-FFFF`,createdAt:`2026-07-01T00:00:00Z`,expiresAt:`2026-07-15T00:00:00Z`,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`GGGG-HHHH-JJJJ`,createdAt:`2026-07-20T00:00:00Z`,expiresAt:void 0,consumedAt:`2026-07-21T00:00:00Z`,consumedByUserId:`u1`,createdTeamId:`t1`}],T={title:`features/manage-creation-codes/ManageCreationCodesView`,component:p,args:{codes:w,now:C,onCreate:x(),onRevoke:x()}},E={play:async({canvas:e})=>{await b(e.getByText(`AAAA-BBBB-CCCC`)).toBeInTheDocument(),await b(e.getByText(`Active`)).toBeInTheDocument(),await b(e.getByText(`Expired`)).toBeInTheDocument(),await b(e.getByText(`Used`)).toBeInTheDocument(),await b(e.getAllByRole(`button`,{name:`Revoke`})).toHaveLength(2)}},D={render:e=>(0,y.jsx)(i,{items:{Loading:(0,y.jsx)(p,{...e,isLoading:!0}),Error:(0,y.jsx)(p,{...e,isError:!0}),Forbidden:(0,y.jsx)(p,{...e,isForbidden:!0}),Empty:(0,y.jsx)(p,{...e,codes:[]}),"Revoke blocked":(0,y.jsx)(p,{...e,errorCode:`CONSUMED`})}}),play:async({canvas:e})=>{let t=t=>S(e.getByRole(`region`,{name:t}));await b(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await b(t(`Loading`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await b(t(`Error`).getByText(`Couldn't load creation codes. Please try again.`)).toBeInTheDocument(),await b(t(`Error`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await b(t(`Forbidden`).getByText(`You don't have access to creation codes.`)).toBeInTheDocument(),await b(t(`Forbidden`).queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument(),await b(t(`Empty`).getByText(`No creation codes yet. Generate one above.`)).toBeInTheDocument(),await b(t(`Empty`).getByRole(`button`,{name:`Generate code`})).toBeEnabled(),await b(t(`Revoke blocked`).getByText(`That code was already used and cannot be revoked.`)).toBeInTheDocument()}},O={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,y.jsx)(i,{items:{Empty:(0,y.jsx)(p,{...e,codes:[]}),"With items":(0,y.jsx)(p,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>S(e.getByRole(`region`,{name:t})),i=S(document.body);await t.click(r(`Empty`).getByRole(`button`,{name:`Generate code`})),await b(n.onCreate).toHaveBeenCalled(),await t.click(r(`With items`).getAllByRole(`button`,{name:`Revoke`})[0]),await b(await i.findByText(/can no longer be used to create a team/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Revoke`})),await b(n.onRevoke).toHaveBeenCalledWith(w[0])}},k={play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`,{name:`Revoke`})[0]);let n=S(document.body);await b(await n.findByText(/can no longer be used to create a team/)).toBeInTheDocument(),await b(n.getByRole(`button`,{name:`Cancel`})).toBeInTheDocument()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`Data`,`Shells`,`Interactions`,`RevokeConfirmOpen`]})))()}j();export{E as Data,O as Interactions,k as RevokeConfirmOpen,D as Shells,A as __namedExportsOrder,T as default};