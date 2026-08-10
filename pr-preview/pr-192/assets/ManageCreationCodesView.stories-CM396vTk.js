import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyEDPpB.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-nGXeb6Fo.js";import{a,i as o,n as s,o as c,r as l,s as u,t as d}from"./dialog-CHr6kvPC.js";function f(e,t){return e.consumedAt?`consumed`:e.expiresAt&&new Date(e.expiresAt).getTime()<=t.getTime()?`expired`:`active`}function p(e){return m[e]}var m;function h(){return(h=e((()=>{m={active:`Active`,expired:`Expired`,consumed:`Used`}})))()}function g({codes:e=[],isLoading:t,isError:n,isForbidden:r,isSaving:u,errorCode:p,now:m=new Date,onCreate:h,onRevoke:g}){let[b,x]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{children:[(0,y.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Creation codes`}),(0,y.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Generate one-time codes that let a new owner create a team.`}),t&&(0,y.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,y.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`You don't have access to creation codes.`}),n&&!r&&(0,y.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load creation codes. Please try again.`}),!t&&!n&&!r&&(0,y.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[(0,y.jsx)(`div`,{children:(0,y.jsx)(i,{disabled:u,onClick:h,children:`Generate code`})}),p===`CONSUMED`&&(0,y.jsx)(`p`,{className:`text-sm text-red-500`,children:`That code was already used and cannot be revoked.`}),e.length===0?(0,y.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No creation codes yet. Generate one above.`}):(0,y.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,y.jsx)(_,{code:e,status:f(e,m),isSaving:u,onRequestRevoke:x},e.code))}),(0,y.jsx)(d,{open:b!==null,onOpenChange:e=>{e||x(null)},children:(0,y.jsxs)(s,{children:[(0,y.jsxs)(a,{children:[(0,y.jsx)(c,{children:`Revoke code`}),(0,y.jsxs)(l,{children:[`Revoke "`,b?.code,`"? It can no longer be used to create a team.`]})]}),(0,y.jsxs)(o,{children:[(0,y.jsx)(i,{variant:`outline`,onClick:()=>x(null),children:`Cancel`}),(0,y.jsx)(i,{variant:`destructive`,onClick:()=>{b&&g(b),x(null)},children:`Revoke`})]})]})})]})]})}function _({code:e,status:t,isSaving:n,onRequestRevoke:r}){return(0,y.jsxs)(`li`,{className:`flex flex-wrap items-center gap-3 p-3`,children:[(0,y.jsx)(`span`,{className:`font-mono text-sm font-medium tracking-wide`,children:e.code}),(0,y.jsx)(`span`,{className:`rounded-full px-2 py-0.5 text-xs font-semibold ${b[t]}`,children:p(t)}),t!==`consumed`&&(0,y.jsx)(i,{variant:`destructive`,size:`sm`,className:`ml-auto`,disabled:n,onClick:()=>r(e),children:`Revoke`})]})}var v,y,b;function x(){return(x=e((()=>{v=t(),r(),u(),h(),y=n(),b={active:`bg-green/12 text-green`,expired:`bg-muted text-muted-foreground`,consumed:`bg-blue/10 text-blue`},g.__docgenInfo={description:`Presentational creation-codes admin UI. Owns only local view state (the revoke-confirm dialog
target); the query and mutations live in the container. State shells are props-driven so every
state is a no-network story (ADR-0017).`,methods:[],displayName:`ManageCreationCodesView`,props:{codes:{required:!1,tsType:{name:`Array`,elements:[{name:`CreationCode`}],raw:`CreationCode[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isForbidden:{required:!1,tsType:{name:`boolean`},description:`403 — the caller is not a platform admin; renders a no-access shell rather than an error.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator (e.g. CONSUMED), shown inline.`},now:{required:!1,tsType:{name:`Date`},description:`Injected so status derivation is deterministic in tests; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRevoke:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(code: CreationCode) => void`,signature:{arguments:[{type:{name:`CreationCode`},name:`code`}],return:{name:`void`}}},description:``}}}})))()}var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{x(),{expect:S,fn:C,within:w}=__STORYBOOK_MODULE_TEST__,T=new Date(`2026-08-03T12:00:00Z`),E=[{code:`AAAA-BBBB-CCCC`,createdAt:`2026-08-01T00:00:00Z`,expiresAt:void 0,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`DDDD-EEEE-FFFF`,createdAt:`2026-07-01T00:00:00Z`,expiresAt:`2026-07-15T00:00:00Z`,consumedAt:void 0,consumedByUserId:void 0,createdTeamId:void 0},{code:`GGGG-HHHH-JJJJ`,createdAt:`2026-07-20T00:00:00Z`,expiresAt:void 0,consumedAt:`2026-07-21T00:00:00Z`,consumedByUserId:`u1`,createdTeamId:`t1`}],D={title:`features/manage-creation-codes/ManageCreationCodesView`,component:g,args:{codes:E,now:T,onCreate:C(),onRevoke:C()}},O={args:{isLoading:!0},play:async({canvas:e})=>{await S(e.getByText(`Loading…`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument()}},k={args:{isError:!0},play:async({canvas:e})=>{await S(e.getByText(`Couldn't load creation codes. Please try again.`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument()}},A={args:{isForbidden:!0},play:async({canvas:e})=>{await S(e.getByText(`You don't have access to creation codes.`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Generate code`})).not.toBeInTheDocument()}},j={args:{codes:[]},play:async({canvas:e})=>{await S(e.getByText(`No creation codes yet. Generate one above.`)).toBeInTheDocument(),await S(e.getByRole(`button`,{name:`Generate code`})).toBeEnabled()}},M={play:async({canvas:e})=>{await S(e.getByText(`AAAA-BBBB-CCCC`)).toBeInTheDocument(),await S(e.getByText(`Active`)).toBeInTheDocument(),await S(e.getByText(`Expired`)).toBeInTheDocument(),await S(e.getByText(`Used`)).toBeInTheDocument(),await S(e.getAllByRole(`button`,{name:`Revoke`})).toHaveLength(2)}},N={args:{codes:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Generate code`})),await S(n.onCreate).toHaveBeenCalled()}},P={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Revoke`})[0]);let r=w(document.body);await S(await r.findByText(/can no longer be used to create a team/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Revoke`})),await S(n.onRevoke).toHaveBeenCalledWith(E[0])}},F={args:{errorCode:`CONSUMED`},play:async({canvas:e})=>{await S(e.getByText(`That code was already used and cannot be revoked.`)).toBeInTheDocument()}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load creation codes. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    isForbidden: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You don't have access to creation codes.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Generate code'
    })).not.toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    codes: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No creation codes yet. Generate one above.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Generate code'
    })).toBeEnabled();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    codes: []
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Generate code'
    }));
    await expect(args.onCreate).toHaveBeenCalled();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Open the confirm dialog from the first (active) code's Revoke button.
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Revoke'
    })[0]);
    const dialog = within(document.body);
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument();
    // While the modal is open the list buttons are aria-hidden, so only the dialog's Revoke resolves.
    await userEvent.click(dialog.getByRole('button', {
      name: 'Revoke'
    }));
    await expect(args.onRevoke).toHaveBeenCalledWith(CODES[0]);
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'CONSUMED'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That code was already used and cannot be revoked.')).toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I=[`Loading`,`ErrorState`,`Forbidden`,`Empty`,`WithItems`,`GenerateCode`,`RevokeConfirm`,`RevokeConsumedBlocked`]})))()}L();export{j as Empty,k as ErrorState,A as Forbidden,N as GenerateCode,O as Loading,P as RevokeConfirm,F as RevokeConsumedBlocked,M as WithItems,I as __namedExportsOrder,D as default};