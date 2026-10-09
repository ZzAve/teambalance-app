import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Bsl8OoW-.js";import{n,t as r}from"./utils-BTemNN_S.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{c as a,r as o}from"./event-fixtures-C1ds5yXh.js";import{n as s,t as c}from"./plus-BD6Ngbvq.js";import{n as l,t as u}from"./button-DqJ_WWAC.js";import{n as d,t as f}from"./input-0kNOePMa.js";import{n as p,t as m}from"./label-n5eBBUTz.js";import{a as h,i as g,n as _,o as v,r as y,t as b}from"./sheet-BVPenk-2.js";import{a as x,i as S}from"./lineup-TDQLra9X.js";import{n as C,t as w}from"./SubstituteAvatar-CAiik72l.js";import{r as T,t as E}from"./SubstitutesBlock-DhNv-_6C.js";function D(e,t){return{plays:e.filter(e=>e.position?.id===t),others:e.filter(e=>e.position?.id!==t)}}function O({open:e,eventTitle:t,position:n=null,positions:i,substitutes:a,isLoading:o=!1,pending:s=!1,onEvent:l,onSetState:d,onCreate:p,onClose:v,creating:x=!1}){let[C,T]=(0,A.useState)(!1),[D,O]=(0,A.useState)(``),[N,P]=(0,A.useState)(null),F=e=>{let t=l.find(t=>t.substituteId===e.id)?.state;return(0,j.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,j.jsx)(w,{name:e.name}),(0,j.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,j.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,j.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,j.jsx)(`span`,{className:`flex shrink-0 items-center gap-1`,children:E.map(n=>(0,j.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:s,onClick:()=>d(e.id,n.value),className:r(`relative rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60 after:absolute after:-inset-y-2.5 after:inset-x-0`,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value))})]},e.id)},I=()=>{T(!1),O(``),v()},L=()=>{p(D.trim(),N),T(!1),O(``)};return(0,j.jsx)(b,{open:e,onOpenChange:e=>!e&&I(),children:(0,j.jsxs)(_,{children:[(0,j.jsxs)(g,{children:[(0,j.jsx)(h,{children:n?S(n.label):`Call in substitutes`}),(0,j.jsx)(y,{children:t})]}),a.length===0?(0,j.jsx)(`p`,{className:`mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground`,children:o?`Loading the list…`:`Nobody on the list yet.`}):n?(0,j.jsx)(k,{position:n,substitutes:a,renderRow:F}):(0,j.jsx)(`div`,{className:M,children:a.map(F)}),C?(0,j.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,j.jsx)(m,{htmlFor:`new-substitute-name`,children:`Name`}),(0,j.jsx)(f,{id:`new-substitute-name`,value:D,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>O(e.target.value)}),(0,j.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,j.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,j.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...i,{id:null,label:`None`}].map(e=>(0,j.jsx)(`button`,{type:`button`,"aria-pressed":N===e.id,onClick:()=>P(e.id),className:r(`rounded-full border px-2.5 py-1 text-small`,N===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),(0,j.jsx)(u,{type:`button`,disabled:!D.trim()||x,onClick:L,children:`Add as asked`})]}):(0,j.jsxs)(`button`,{type:`button`,onClick:()=>{P(n?.id??null),T(!0)},className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,j.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,j.jsx)(c,{size:16})}),(0,j.jsxs)(`span`,{children:[`New substitute`,(0,j.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,j.jsx)(u,{type:`button`,variant:`outline`,className:`mt-4`,onClick:I,children:`Done`})]})})}function k({position:e,substitutes:t,renderRow:n}){let{plays:r,others:i}=D(t,e.id),a=`Plays ${e.label}`;return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)(`div`,{role:`group`,"aria-label":a,children:[(0,j.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:a}),(0,j.jsx)(`div`,{className:M,children:r.length===0?(0,j.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:`Nobody on the list plays this yet.`}):r.map(n)})]}),i.length>0&&(0,j.jsxs)(`div`,{role:`group`,"aria-label":`Others`,children:[(0,j.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:`Others`}),(0,j.jsx)(`div`,{className:M,children:i.map(n)})]})]})}var A,j,M;function N(){return(N=e((()=>{A=t(),s(),l(),d(),p(),v(),n(),C(),x(),T(),j=i(),M=`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,O.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Asked / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
the person on the event as declined; taking them off the event is not offered here, only in their
Substitute sheet, so recording a "no" can never delete that they were asked.

Any Member may also add someone who is not on the list yet: a name and an optional Position, added
as Asked (Maybe), since the person has been asked and not yet answered. Prop-only; the writes live
in [SubstitutePicker].`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},position:{required:!1,tsType:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},description:`Opened from one Position's open spot: who plays it comes first, and a new one plays it too.`,defaultValue:{value:`null`,computed:!1}},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionRef`}],raw:`PositionRef[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:`Creates a Substitute and adds them to the event as Asked.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},creating:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{o(),N(),{expect:P,fn:F,within:I}=__STORYBOOK_MODULE_TEST__,L=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],R={id:`pos-libero`,label:`Libero`},z=[{id:`sub-1`,name:`Jan de Vries`,position:R},{id:`sub-2`,name:`Mila Jansen`,position:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`}},{id:`sub-4`,name:`Pieter Smit`,position:{id:`pos-setter`,label:`Setter`}}],B=[a(`sub-1`,`Jan de Vries`,{position:R}),a(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),a(`sub-4`,`Pieter Smit`,{state:`ABSENT`})],V={title:`features/call-in-substitutes/SubstitutePickerView`,component:O,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:L,substitutes:z,onEvent:B,onSetState:F(),onCreate:F(),onClose:F()}},H={args:{position:R},play:async()=>{let e=I(await I(document.body).findByRole(`dialog`,{name:`Find a Libero`})),t=I(e.getByRole(`group`,{name:`Plays Libero`}));await P(t.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Jan de Vries`]);let n=I(e.getByRole(`group`,{name:`Others`}));await P(n.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Mila Jansen`,`Kees Bakker`,`Pieter Smit`]);let r=I(e.getByRole(`group`,{name:`Jan de Vries`}));await P(r.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await P(r.getByText(`Libero`)).toBeInTheDocument();let i=I(e.getByRole(`group`,{name:`Mila Jansen`}));await P(i.getByRole(`button`,{name:`Asked`})).toHaveAttribute(`aria-pressed`,`true`);let a=I(e.getByRole(`group`,{name:`Pieter Smit`}));await P(a.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`true`);let o=I(e.getByRole(`group`,{name:`Kees Bakker`}));await P(o.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await P(e.queryByRole(`button`,{name:/take off/i})).not.toBeInTheDocument()}},U={args:{substitutes:[],onEvent:[]},play:async({userEvent:e})=>{let t=I(await I(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await P(t.getByText(`Nobody on the list yet.`)).toBeInTheDocument(),await P(t.queryByRole(`group`,{name:`Others`})).not.toBeInTheDocument(),await e.click(t.getByRole(`button`,{name:/New substitute/})),await P(t.getByLabelText(`Name`)).toBeInTheDocument(),await P(t.getByRole(`button`,{name:`None`})).toHaveAttribute(`aria-pressed`,`true`),await P(t.getByRole(`button`,{name:`Add as asked`})).toBeDisabled()}},W={args:{position:R},parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=I(await I(document.body).findByRole(`dialog`,{name:`Find a Libero`}));await e.click(I(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await P(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(I(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`})),await P(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(I(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Can't`})),await P(t.onSetState).toHaveBeenCalledWith(`sub-2`,`ABSENT`);let r=I(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Asked`}),i=r.getBoundingClientRect(),a=(44-i.height)/2-1;for(let e of[i.top-a,i.bottom+a])await P(document.elementFromPoint(i.left+i.width/2,e)).toBe(r);await e.click(n.getByRole(`button`,{name:/New substitute/}));let o=n.getByRole(`button`,{name:`Add as asked`});await P(o).toBeDisabled(),await P(n.getByRole(`button`,{name:`Libero`})).toHaveAttribute(`aria-pressed`,`true`),await e.type(n.getByLabelText(`Name`),`Anouk de Boer`),await e.click(o),await P(t.onCreate).toHaveBeenCalledWith(`Anouk de Boer`,`pos-libero`),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`None`})),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await P(t.onCreate).toHaveBeenCalledWith(`Sanne Vos`,null),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Half`),await e.click(n.getByRole(`button`,{name:`Done`})),await P(t.onClose).toHaveBeenCalled(),await P(n.queryByLabelText(`Name`)).not.toBeInTheDocument()}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO
  },
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Find a Libero'
    }));
    // Who plays the Position comes first, the rest after (#359 decision 9).
    const plays = within(sheet.getByRole('group', {
      name: 'Plays Libero'
    }));
    await expect(plays.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Jan de Vries']);
    const others = within(sheet.getByRole('group', {
      name: 'Others'
    }));
    await expect(others.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Mila Jansen', 'Kees Bakker', 'Pieter Smit']);
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    substitutes: [],
    onEvent: []
  },
  play: async ({
    userEvent
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));
    await expect(sheet.getByText('Nobody on the list yet.')).toBeInTheDocument();
    await expect(sheet.queryByRole('group', {
      name: 'Others'
    })).not.toBeInTheDocument();

    // Opened without a Position, so none is chosen yet.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await expect(sheet.getByLabelText('Name')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: 'None'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(sheet.getByRole('button', {
      name: 'Add as asked'
    })).toBeDisabled();
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO
  },
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
      name: 'Find a Libero'
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

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Asked'
    });
    const box = pill.getBoundingClientRect();
    const reach = (44 - box.height) / 2 - 1;
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill);
    }

    // Someone not on the list yet: a name and an optional Position, added as Asked. Opened for
    // Libero, so Libero is already chosen.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    const add = sheet.getByRole('button', {
      name: 'Add as asked'
    });
    await expect(add).toBeDisabled();
    await expect(sheet.getByRole('button', {
      name: 'Libero'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.type(sheet.getByLabelText('Name'), 'Anouk de Boer');
    await userEvent.click(add);
    await expect(args.onCreate).toHaveBeenCalledWith('Anouk de Boer', 'pos-libero');

    // The picker stays open for the next one, and the form starts from the Position again.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos');
    await userEvent.click(sheet.getByRole('button', {
      name: 'None'
    }));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('Sanne Vos', null);

    // Closing drops a half-typed name, so the next open starts fresh.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Half');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(sheet.queryByLabelText('Name')).not.toBeInTheDocument();
  }
}`,...W.parameters?.docs?.source}}},G=[`Data`,`Shells`,`Interactions`]})))()}K();export{H as Data,W as Interactions,U as Shells,G as __namedExportsOrder,V as default};