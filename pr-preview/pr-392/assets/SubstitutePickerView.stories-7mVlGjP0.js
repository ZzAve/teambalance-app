import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BnrpfBEu.js";import{n,t as r}from"./utils-BTemNN_S.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{c as a,r as o}from"./event-fixtures-C1ds5yXh.js";import{n as s,t as c}from"./plus-CStNG54D.js";import{n as l,t as u}from"./button-DFNBMj0Z.js";import{n as d,t as f}from"./input-D8uJOBzb.js";import{n as p,t as m}from"./label-DVuwj_ZE.js";import{a as h,i as g,n as _,o as v,r as y,t as b}from"./sheet-BcOA6T0m.js";import{a as x,i as S}from"./lineup-TDQLra9X.js";import{n as C,t as w}from"./SubstituteAvatar-CAiik72l.js";import{i as T,n as E,t as D}from"./SubstitutesBlock-Uuz5HVqX.js";function O(e,t){return{plays:e.filter(e=>e.position?.id===t),others:e.filter(e=>e.position?.id!==t)}}function k({open:e,eventTitle:t,position:n=null,positions:i,substitutes:a,isLoading:o=!1,pending:s=!1,onEvent:l,onSetState:d,onCreate:p,onClose:v,creating:x=!1}){let[C,T]=(0,j.useState)(!1),[O,k]=(0,j.useState)(``),[P,F]=(0,j.useState)(null),I=e=>{let t=l.find(t=>t.substituteId===e.id)?.state;return(0,M.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,M.jsx)(w,{name:e.name}),(0,M.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,M.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,M.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,M.jsx)(`span`,{className:`flex shrink-0 items-center gap-1`,children:D.map(n=>(0,M.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:s,onClick:()=>d(e.id,n.value),className:r(E,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value))})]},e.id)},L=()=>{T(!1),k(``),v()},R=()=>{p(O.trim(),P),T(!1),k(``)};return(0,M.jsx)(b,{open:e,onOpenChange:e=>!e&&L(),children:(0,M.jsxs)(_,{children:[(0,M.jsxs)(g,{children:[(0,M.jsx)(h,{children:n?S(n.label):`Call in substitutes`}),(0,M.jsx)(y,{children:t})]}),a.length===0?(0,M.jsx)(`p`,{className:`mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground`,children:o?`Loading the list…`:`Nobody on the list yet.`}):n?(0,M.jsx)(A,{position:n,substitutes:a,renderRow:I}):(0,M.jsx)(`div`,{className:N,children:a.map(I)}),C?(0,M.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,M.jsx)(m,{htmlFor:`new-substitute-name`,children:`Name`}),(0,M.jsx)(f,{id:`new-substitute-name`,value:O,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>k(e.target.value)}),(0,M.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,M.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,M.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...i,{id:null,label:`None`}].map(e=>(0,M.jsx)(`button`,{type:`button`,"aria-pressed":P===e.id,onClick:()=>F(e.id),className:r(`min-h-11 rounded-full border px-3 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,P===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),(0,M.jsx)(u,{type:`button`,disabled:!O.trim()||x,onClick:R,children:`Add as asked`})]}):(0,M.jsxs)(`button`,{type:`button`,onClick:()=>{F(n?.id??null),T(!0)},className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,M.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,M.jsx)(c,{size:16})}),(0,M.jsxs)(`span`,{children:[`New substitute`,(0,M.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,M.jsx)(u,{type:`button`,variant:`outline`,className:`mt-4`,onClick:L,children:`Done`})]})})}function A({position:e,substitutes:t,renderRow:n}){let{plays:r,others:i}=O(t,e.id),a=`Plays ${e.label}`;return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)(`div`,{role:`group`,"aria-label":a,children:[(0,M.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:a}),(0,M.jsx)(`div`,{className:N,children:r.length===0?(0,M.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:`Nobody on the list plays this yet.`}):r.map(n)})]}),i.length>0&&(0,M.jsxs)(`div`,{role:`group`,"aria-label":`Others`,children:[(0,M.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:`Others`}),(0,M.jsx)(`div`,{className:N,children:i.map(n)})]})]})}var j,M,N;function P(){return(P=e((()=>{j=t(),s(),l(),d(),p(),v(),n(),C(),x(),T(),M=i(),N=`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,k.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Asked / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
the person on the event as declined; taking them off the event is not offered here, only in their
Substitute sheet, so recording a "no" can never delete that they were asked.

Any Member may also add someone who is not on the list yet: a name and an optional Position, added
as Asked (Maybe), since the person has been asked and not yet answered. Prop-only; the writes live
in [SubstitutePicker].`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},position:{required:!1,tsType:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},description:`Opened from one Position's open spot: who plays it comes first, and a new one plays it too.`,defaultValue:{value:`null`,computed:!1}},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionRef`}],raw:`PositionRef[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`void`}}},description:`Creates a Substitute and adds them to the event as Asked.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},creating:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var F,I,L,R,z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{o(),P(),{expect:F,fn:I,within:L}=__STORYBOOK_MODULE_TEST__,R=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],z={id:`pos-libero`,label:`Libero`},B=[{id:`sub-1`,name:`Jan de Vries`,position:z},{id:`sub-2`,name:`Mila Jansen`,position:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`}},{id:`sub-4`,name:`Pieter Smit`,position:{id:`pos-setter`,label:`Setter`}}],V=[a(`sub-1`,`Jan de Vries`,{position:z}),a(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),a(`sub-4`,`Pieter Smit`,{state:`ABSENT`})],H={title:`features/call-in-substitutes/SubstitutePickerView`,component:k,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:R,substitutes:B,onEvent:V,onSetState:I(),onCreate:I(),onClose:I()}},U={args:{position:z},play:async()=>{let e=L(await L(document.body).findByRole(`dialog`,{name:`Find a Libero`})),t=L(e.getByRole(`group`,{name:`Plays Libero`}));await F(t.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Jan de Vries`]);let n=L(e.getByRole(`group`,{name:`Others`}));await F(n.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Mila Jansen`,`Kees Bakker`,`Pieter Smit`]);let r=L(e.getByRole(`group`,{name:`Jan de Vries`}));await F(r.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await F(r.getByText(`Libero`)).toBeInTheDocument();let i=L(e.getByRole(`group`,{name:`Mila Jansen`}));await F(i.getByRole(`button`,{name:`Asked`})).toHaveAttribute(`aria-pressed`,`true`);let a=L(e.getByRole(`group`,{name:`Pieter Smit`}));await F(a.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`true`);let o=L(e.getByRole(`group`,{name:`Kees Bakker`}));await F(o.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await F(e.queryByRole(`button`,{name:/take off/i})).not.toBeInTheDocument()}},W={args:{substitutes:[],onEvent:[]},play:async({userEvent:e})=>{let t=L(await L(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await F(t.getByText(`Nobody on the list yet.`)).toBeInTheDocument(),await F(t.queryByRole(`group`,{name:`Others`})).not.toBeInTheDocument(),await e.click(t.getByRole(`button`,{name:/New substitute/})),await F(t.getByLabelText(`Name`)).toBeInTheDocument(),await F(t.getByRole(`button`,{name:`None`})).toHaveAttribute(`aria-pressed`,`true`),await F(t.getByRole(`button`,{name:`Add as asked`})).toBeDisabled()}},G={args:{position:z},parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=L(await L(document.body).findByRole(`dialog`,{name:`Find a Libero`}));await e.click(L(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await F(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(L(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`})),await F(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(L(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Can't`})),await F(t.onSetState).toHaveBeenCalledWith(`sub-2`,`ABSENT`);let r=L(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Asked`}),i=r.getBoundingClientRect(),a=(44-i.height)/2-1;for(let e of[i.top-a,i.bottom+a])await F(document.elementFromPoint(i.left+i.width/2,e)).toBe(r);await e.click(n.getByRole(`button`,{name:/New substitute/}));let o=n.getByRole(`button`,{name:`Add as asked`});await F(o).toBeDisabled(),await F(n.getByRole(`button`,{name:`Libero`})).toHaveAttribute(`aria-pressed`,`true`);for(let e of[`Setter`,`Libero`,`None`]){let t=n.getByRole(`button`,{name:e});t.scrollIntoView({block:`center`});let r=t.getBoundingClientRect();await F(r.height).toBeGreaterThanOrEqual(44);for(let e of[r.top+1,r.bottom-1])await F(document.elementFromPoint(r.left+r.width/2,e)).toBe(t)}await e.type(n.getByLabelText(`Name`),`Anouk de Boer`),await e.click(o),await F(t.onCreate).toHaveBeenCalledWith(`Anouk de Boer`,`pos-libero`),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`None`})),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await F(t.onCreate).toHaveBeenCalledWith(`Sanne Vos`,null),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Half`),await e.click(n.getByRole(`button`,{name:`Done`})),await F(t.onClose).toHaveBeenCalled(),await F(n.queryByLabelText(`Name`)).not.toBeInTheDocument()}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
    // A Position chip is a full 44px target itself: the chip is the box, no band around it (#388).
    for (const label of ['Setter', 'Libero', 'None']) {
      const chip = sheet.getByRole('button', {
        name: label
      });
      chip.scrollIntoView({
        block: 'center'
      });
      const box = chip.getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(44);
      for (const y of [box.top + 1, box.bottom - 1]) {
        await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(chip);
      }
    }
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
}`,...G.parameters?.docs?.source}}},K=[`Data`,`Shells`,`Interactions`]})))()}q();export{U as Data,G as Interactions,W as Shells,K as __namedExportsOrder,H as default};