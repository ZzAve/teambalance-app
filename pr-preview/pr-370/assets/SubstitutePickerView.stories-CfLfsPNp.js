import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DRL83bhs.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{c as r,r as i}from"./event-fixtures-C1ds5yXh.js";import{n as a,t as o}from"./plus-BD3Krbe6.js";import{r as s,t as c}from"./SubstitutesBlock-ileKHBFy.js";import{n as l,t as u}from"./x-h385I96y.js";import{n as d,t as f}from"./utils-BTemNN_S.js";import{n as p,t as m}from"./button-GaTj5jY7.js";import{n as h,t as g}from"./input-Css9WEsa.js";import{n as _,t as v}from"./label-BiO_9Ei6.js";import{a as y,i as b,n as x,o as S,r as C,t as w}from"./sheet-Cbq2tkAZ.js";import{n as T,t as E}from"./SubstituteAvatar-D1hsh3h3.js";function D({open:e,eventTitle:t,positions:n,substitutes:r,isLoading:i=!1,pending:a=!1,onEvent:s,onSetState:c,onTakeOff:l,onCreate:d,onClose:p,creating:h=!1}){let[_,S]=(0,O.useState)(!1),[T,D]=(0,O.useState)(``),[j,M]=(0,O.useState)(null),N=()=>{d(T.trim(),j),S(!1),D(``),M(null)};return(0,k.jsx)(w,{open:e,onOpenChange:e=>!e&&p(),children:(0,k.jsxs)(x,{children:[(0,k.jsxs)(b,{children:[(0,k.jsx)(y,{children:`Call in substitutes`}),(0,k.jsx)(C,{children:t})]}),(0,k.jsxs)(`div`,{className:`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,children:[r.length===0&&(0,k.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:i?`Loading the list…`:`Nobody on the list yet.`}),r.map(e=>{let t=s.find(t=>t.substituteId===e.id)?.state;return(0,k.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,k.jsx)(E,{name:e.name}),(0,k.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,k.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,k.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,k.jsxs)(`span`,{className:`flex shrink-0 items-center gap-1`,children:[A.map(n=>(0,k.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:a,onClick:()=>c(e.id,n.value),className:f(`rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60`,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value)),t&&(0,k.jsx)(`button`,{type:`button`,"aria-label":`Take off`,disabled:a,onClick:()=>l(e.id),className:`grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted`,children:(0,k.jsx)(u,{size:14})})]})]},e.id)})]}),_?(0,k.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,k.jsx)(v,{htmlFor:`new-substitute-name`,children:`Name`}),(0,k.jsx)(g,{id:`new-substitute-name`,value:T,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>D(e.target.value)}),(0,k.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,k.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,k.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...n,{id:null,label:`None`}].map(e=>(0,k.jsx)(`button`,{type:`button`,"aria-pressed":j===e.id,onClick:()=>M(e.id),className:f(`rounded-full border px-2.5 py-1 text-small`,j===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),(0,k.jsx)(m,{type:`button`,disabled:!T.trim()||h,onClick:N,children:`Add as asked`})]}):(0,k.jsxs)(`button`,{type:`button`,onClick:()=>S(!0),className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,k.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,k.jsx)(o,{size:16})}),(0,k.jsxs)(`span`,{children:[`New substitute`,(0,k.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,k.jsx)(m,{type:`button`,variant:`outline`,className:`mt-4`,onClick:p,children:`Done`})]})})}var O,k,A;function j(){return(j=e((()=>{O=t(),a(),l(),p(),h(),_(),S(),d(),T(),s(),k=n(),A=c.filter(e=>e.value!==`ABSENT`),D.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Asked, so several can be called in before Done. Any Member may also add someone who is not
on the list yet: a name and an optional Position, added as Asked (Maybe), since the person has
been asked and not yet answered. Prop-only; the writes live in the route.`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionOption`}],raw:`PositionOption[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onTakeOff:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:`Creates a Substitute and adds them to the event as Asked.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},creating:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{i(),j(),{expect:M,fn:N,within:P}=__STORYBOOK_MODULE_TEST__,F=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],I={id:`pos-libero`,label:`Libero`},L=[{id:`sub-1`,name:`Jan de Vries`,position:I},{id:`sub-2`,name:`Mila Jansen`,position:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`}}],R=[r(`sub-1`,`Jan de Vries`,{position:I}),r(`sub-2`,`Mila Jansen`,{state:`MAYBE`})],z={title:`features/call-in-substitutes/SubstitutePickerView`,component:D,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:F,substitutes:L,onEvent:R,onSetState:N(),onTakeOff:N(),onCreate:N(),onClose:N()}},B={play:async()=>{let e=P(await P(document.body).findByRole(`dialog`,{name:`Call in substitutes`})),t=P(e.getByRole(`group`,{name:`Jan de Vries`}));await M(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await M(t.getByText(`Libero`)).toBeInTheDocument();let n=P(e.getByRole(`group`,{name:`Mila Jansen`}));await M(n.getByRole(`button`,{name:`Asked`})).toHaveAttribute(`aria-pressed`,`true`);let r=P(e.getByRole(`group`,{name:`Kees Bakker`}));await M(r.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await M(r.queryByRole(`button`,{name:`Take off`})).not.toBeInTheDocument()}},V={args:{substitutes:[],onEvent:[]},play:async()=>{let e=P(await P(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await M(e.getByText(`Nobody on the list yet.`)).toBeInTheDocument(),await M(e.getByRole(`button`,{name:/New substitute/})).toBeInTheDocument()}},H={parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=P(await P(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await e.click(P(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await M(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(P(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`})),await M(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(P(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Take off`})),await M(t.onTakeOff).toHaveBeenCalledWith(`sub-2`),await e.click(n.getByRole(`button`,{name:/New substitute/}));let r=n.getByRole(`button`,{name:`Add as asked`});await M(r).toBeDisabled(),await e.type(n.getByLabelText(`Name`),`Pieter Smit`),await e.click(n.getByRole(`button`,{name:`Libero`})),await e.click(r),await M(t.onCreate).toHaveBeenCalledWith(`Pieter Smit`,`pos-libero`),await e.click(n.getByRole(`button`,{name:`Done`})),await M(t.onClose).toHaveBeenCalled()}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));
    const jan = within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    }));
    await expect(jan.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(jan.getByText('Libero')).toBeInTheDocument();
    const mila = within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    }));
    await expect(mila.getByRole('button', {
      name: 'Asked'
    })).toHaveAttribute('aria-pressed', 'true');
    // Not on this event yet: nothing pressed, nothing to take off.
    const kees = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    }));
    await expect(kees.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(kees.queryByRole('button', {
      name: 'Take off'
    })).not.toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    substitutes: [],
    onEvent: []
  },
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));
    await expect(sheet.getByText('Nobody on the list yet.')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));

    // Several people can be called in before Done: one confirmed, one only asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ATTENDING');
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Asked'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE');
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    })).getByRole('button', {
      name: 'Take off'
    }));
    await expect(args.onTakeOff).toHaveBeenCalledWith('sub-2');

    // Someone not on the list yet: a name and an optional Position, added as Asked.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    const add = sheet.getByRole('button', {
      name: 'Add as asked'
    });
    await expect(add).toBeDisabled();
    await userEvent.type(sheet.getByLabelText('Name'), 'Pieter Smit');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Libero'
    }));
    await userEvent.click(add);
    await expect(args.onCreate).toHaveBeenCalledWith('Pieter Smit', 'pos-libero');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await expect(args.onClose).toHaveBeenCalled();
  }
}`,...H.parameters?.docs?.source}}},U=[`Data`,`Shells`,`Interactions`]})))()}W();export{B as Data,H as Interactions,V as Shells,U as __namedExportsOrder,z as default};