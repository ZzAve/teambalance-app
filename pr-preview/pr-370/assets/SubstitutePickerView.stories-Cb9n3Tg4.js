import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-f3128gtW.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{c as r,r as i}from"./event-fixtures-C1ds5yXh.js";import{n as a,t as o}from"./plus-xXjHDj69.js";import{r as s,t as c}from"./SubstitutesBlock-CQpqhlw_.js";import{n as l,t as u}from"./utils-BTemNN_S.js";import{n as d,t as f}from"./button-Q9P7hTbt.js";import{n as p,t as m}from"./input-Cfm0tNBW.js";import{n as h,t as g}from"./label-CXbl0QZZ.js";import{a as _,i as v,n as y,o as b,r as x,t as S}from"./sheet-DqmdJzCh.js";import{n as C,t as w}from"./SubstituteAvatar-D1hsh3h3.js";function T({open:e,eventTitle:t,positions:n,substitutes:r,isLoading:i=!1,pending:a=!1,onEvent:s,onSetState:l,onCreate:d,onClose:p,creating:h=!1}){let[b,C]=(0,E.useState)(!1),[T,O]=(0,E.useState)(``),[k,A]=(0,E.useState)(null),j=()=>{d(T.trim(),k),C(!1),O(``),A(null)};return(0,D.jsx)(S,{open:e,onOpenChange:e=>!e&&p(),children:(0,D.jsxs)(y,{children:[(0,D.jsxs)(v,{children:[(0,D.jsx)(_,{children:`Call in substitutes`}),(0,D.jsx)(x,{children:t})]}),(0,D.jsxs)(`div`,{className:`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,children:[r.length===0&&(0,D.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:i?`Loading the list…`:`Nobody on the list yet.`}),r.map(e=>{let t=s.find(t=>t.substituteId===e.id)?.state;return(0,D.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,D.jsx)(w,{name:e.name}),(0,D.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,D.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,D.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,D.jsx)(`span`,{className:`flex shrink-0 items-center gap-1`,children:c.map(n=>(0,D.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:a,onClick:()=>l(e.id,n.value),className:u(`rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60`,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value))})]},e.id)})]}),b?(0,D.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,D.jsx)(g,{htmlFor:`new-substitute-name`,children:`Name`}),(0,D.jsx)(m,{id:`new-substitute-name`,value:T,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>O(e.target.value)}),(0,D.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,D.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,D.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...n,{id:null,label:`None`}].map(e=>(0,D.jsx)(`button`,{type:`button`,"aria-pressed":k===e.id,onClick:()=>A(e.id),className:u(`rounded-full border px-2.5 py-1 text-small`,k===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),(0,D.jsx)(f,{type:`button`,disabled:!T.trim()||h,onClick:j,children:`Add as asked`})]}):(0,D.jsxs)(`button`,{type:`button`,onClick:()=>C(!0),className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,D.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,D.jsx)(o,{size:16})}),(0,D.jsxs)(`span`,{children:[`New substitute`,(0,D.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,D.jsx)(f,{type:`button`,variant:`outline`,className:`mt-4`,onClick:p,children:`Done`})]})})}var E,D;function O(){return(O=e((()=>{E=t(),a(),d(),p(),h(),b(),l(),C(),s(),D=n(),T.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Asked / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
the person on the event as declined; taking them off the event is not offered here, only in their
sheet on the event page, so recording a "no" can never delete that they were asked.

Any Member may also add someone who is not on the list yet: a name and an optional Position, added
as Asked (Maybe), since the person has been asked and not yet answered. Prop-only; the writes live
in the route.`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionOption`}],raw:`PositionOption[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:`Creates a Substitute and adds them to the event as Asked.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},creating:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{i(),O(),{expect:k,fn:A,within:j}=__STORYBOOK_MODULE_TEST__,M=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],N={id:`pos-libero`,label:`Libero`},P=[{id:`sub-1`,name:`Jan de Vries`,position:N},{id:`sub-2`,name:`Mila Jansen`,position:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`}},{id:`sub-4`,name:`Pieter Smit`,position:{id:`pos-setter`,label:`Setter`}}],F=[r(`sub-1`,`Jan de Vries`,{position:N}),r(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),r(`sub-4`,`Pieter Smit`,{state:`ABSENT`})],I={title:`features/call-in-substitutes/SubstitutePickerView`,component:T,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:M,substitutes:P,onEvent:F,onSetState:A(),onCreate:A(),onClose:A()}},L={play:async()=>{let e=j(await j(document.body).findByRole(`dialog`,{name:`Call in substitutes`})),t=j(e.getByRole(`group`,{name:`Jan de Vries`}));await k(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await k(t.getByText(`Libero`)).toBeInTheDocument();let n=j(e.getByRole(`group`,{name:`Mila Jansen`}));await k(n.getByRole(`button`,{name:`Asked`})).toHaveAttribute(`aria-pressed`,`true`);let r=j(e.getByRole(`group`,{name:`Pieter Smit`}));await k(r.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`true`);let i=j(e.getByRole(`group`,{name:`Kees Bakker`}));await k(i.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await k(e.queryByRole(`button`,{name:/take off/i})).not.toBeInTheDocument()}},R={args:{substitutes:[],onEvent:[]},play:async()=>{let e=j(await j(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await k(e.getByText(`Nobody on the list yet.`)).toBeInTheDocument(),await k(e.getByRole(`button`,{name:/New substitute/})).toBeInTheDocument()}},z={parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=j(await j(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await e.click(j(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await k(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(j(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`})),await k(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(j(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Can't`})),await k(t.onSetState).toHaveBeenCalledWith(`sub-2`,`ABSENT`),await e.click(n.getByRole(`button`,{name:/New substitute/}));let r=n.getByRole(`button`,{name:`Add as asked`});await k(r).toBeDisabled(),await e.type(n.getByLabelText(`Name`),`Pieter Smit`),await e.click(n.getByRole(`button`,{name:`Libero`})),await e.click(r),await k(t.onCreate).toHaveBeenCalledWith(`Pieter Smit`,`pos-libero`),await e.click(n.getByRole(`button`,{name:`Done`})),await k(t.onClose).toHaveBeenCalled()}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
    // Asked and said no: kept on the event as declined, not deleted.
    const pieter = within(sheet.getByRole('group', {
      name: 'Pieter Smit'
    }));
    await expect(pieter.getByRole('button', {
      name: "Can't"
    })).toHaveAttribute('aria-pressed', 'true');
    // Not on this event yet: nothing pressed.
    const kees = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    }));
    await expect(kees.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // Deleting someone from the event is not a picker action; it lives in their sheet on the page.
    await expect(sheet.queryByRole('button', {
      name: /take off/i
    })).not.toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
    // Mila answered no: recorded as declined, so the team still sees she was asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    })).getByRole('button', {
      name: "Can't"
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ABSENT');

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
}`,...z.parameters?.docs?.source}}},B=[`Data`,`Shells`,`Interactions`]})))()}V();export{L as Data,z as Interactions,R as Shells,B as __namedExportsOrder,I as default};