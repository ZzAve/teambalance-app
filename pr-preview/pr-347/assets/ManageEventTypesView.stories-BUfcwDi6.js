import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Dnrk4Q1i.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-CKd6OPi-.js";import{n as a,o,r as s}from"./event-fixtures-CuRrQuRB.js";import{n as c,t as l}from"./createLucideIcon-DcDP8D26.js";import{n as u,t as d}from"./pencil-Cq-NxOum.js";import{n as f,t as p}from"./button-W1GRNbO0.js";import{n as m,t as h}from"./input-DRR9bnA7.js";import{i as g,n as _,r as ee}from"./roster-default-summary-B01yjyoM.js";import{a as v,i as y,n as b,o as x,r as S,s as C,t as w}from"./dialog-DaQh70xg.js";var T,E;function D(){return(D=e((()=>{c(),T=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],E=l(`archive-restore`,T)})))()}var O,k;function A(){return(A=e((()=>{c(),O=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8`,key:`1s80jp`}],[`path`,{d:`M10 12h4`,key:`a56b0p`}]],k=l(`archive`,O)})))()}function j(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function M({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:c,onUnarchive:l}){let[u,f]=(0,N.useState)(null),[m,g]=(0,N.useState)(null),[v,y]=(0,N.useState)(null),[b,x]=(0,N.useState)(!1),S=e.filter(e=>!e.archived),C=e.filter(e=>e.archived),w=()=>{f(`new`),g({name:``,color:I[0],rosterDefault:F}),x(!1)},T=e=>{f(e.id),g({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),x(!1)},D=()=>{f(null),g(null),x(!1)},O=j({hasDraft:m!==null,submitted:b,errorCode:a});return(0,P.jsxs)(`div`,{children:[(0,P.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Event types`}),(0,P.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,P.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,P.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,P.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,P.jsx)(`p`,{className:`text-sm text-red`,children:R[a]??L}),S.length===0?(0,P.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,P.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:S.map(e=>(0,P.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,P.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,P.jsx)(`span`,{className:`text-sm font-semibold`,children:e.name}),(0,P.jsx)(`span`,{className:`text-[11.5px] text-muted-foreground`,children:_(e.rosterDefault,t)}),(0,P.jsxs)(`div`,{className:`ml-auto flex gap-2`,children:[(0,P.jsxs)(p,{variant:`outline`,size:`sm`,disabled:i,onClick:()=>T(e),"aria-label":`Edit ${e.name}`,children:[(0,P.jsx)(d,{size:14}),`Edit`]}),(0,P.jsxs)(p,{variant:`destructive`,size:`sm`,disabled:i,onClick:()=>y(e),"aria-label":`Archive ${e.name}`,children:[(0,P.jsx)(k,{size:14}),`Archive`]})]})]},e.id))}),!O&&(0,P.jsx)(p,{className:`self-start`,disabled:i,onClick:w,children:`Add event type`}),O&&m&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,P.jsx)(`h3`,{className:`text-sm font-semibold`,children:u===`new`?`New event type`:`Edit event type`}),(0,P.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,P.jsx)(h,{"aria-label":`Event type name`,className:`w-48`,value:m.name,placeholder:`e.g. Match`,onChange:e=>g({...m,name:e.target.value})}),(0,P.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:I.map(e=>(0,P.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":m.color===e,"aria-label":`Colour ${e}`,onClick:()=>g({...m,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${m.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,P.jsx)(ee,{idPrefix:`type-default`,value:m.rosterDefault,positions:t,disabled:i,onChange:e=>g({...m,rosterDefault:e})}),(0,P.jsxs)(`div`,{className:`flex gap-2`,children:[(0,P.jsx)(p,{disabled:i||m.name.trim().length===0,onClick:()=>{if(!m||m.name.trim().length===0)return;let e={...m,name:m.name.trim()};u===`new`?o(e):u&&s(u,e),x(!0)},children:`Save`}),(0,P.jsx)(p,{variant:`outline`,disabled:i,onClick:D,children:`Cancel`})]})]}),C.length>0&&(0,P.jsxs)(`div`,{className:`mt-2`,children:[(0,P.jsx)(`h3`,{className:`text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Archived`}),(0,P.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:C.map(e=>(0,P.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,P.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.name}),(0,P.jsxs)(p,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>l(e.id),"aria-label":`Restore ${e.name}`,children:[(0,P.jsx)(E,{size:14}),`Restore`]})]},e.id))})]})]}),(0,P.jsx)(te,{target:v,alternatives:S.filter(e=>e.id!==v?.id),isSaving:i,onCancel:()=>y(null),onConfirm:(e,t)=>{c(e,t),y(null)}})]})}function te({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,N.useState)(``);return(0,P.jsx)(w,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,P.jsxs)(b,{children:[(0,P.jsxs)(v,{children:[(0,P.jsxs)(x,{children:[`Archive "`,e?.name,`"?`]}),(0,P.jsx)(S,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,P.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-[13px] font-semibold`,children:`Move its events to another type first?`}),(0,P.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-sm`,value:a,onChange:e=>o(e.target.value),children:[(0,P.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,P.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,P.jsxs)(y,{children:[(0,P.jsx)(p,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,P.jsx)(p,{variant:`destructive`,disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var N,P,F,I,L,R;function z(){return(z=e((()=>{N=t(),A(),D(),u(),f(),m(),C(),g(),P=n(),F={trackRoster:!1,totalTarget:void 0,positionTargets:[]},I=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],L=`Something went wrong. Please try again.`,R={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},M.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{r(),s(),z(),B=n(),{expect:V,fn:H,within:U}=__STORYBOOK_MODULE_TEST__,W=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],G=[o({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),o({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:a})],K=[...G,o({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:a})],q={title:`features/manage-event-types/ManageEventTypesView`,component:M,args:{eventTypes:G,positions:W,onCreate:H(),onUpdate:H(),onArchive:H(),onUnarchive:H()}},J={play:async({canvas:e})=>{await V(e.getByText(`Match`)).toBeInTheDocument(),await V(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await V(e.getByText(`No roster`)).toBeInTheDocument()}},Y={render:e=>(0,B.jsx)(i,{items:{Loading:(0,B.jsx)(M,{...e,isLoading:!0}),Error:(0,B.jsx)(M,{...e,isError:!0}),Empty:(0,B.jsx)(M,{...e,eventTypes:[]}),"With archived types":(0,B.jsx)(M,{...e,eventTypes:K}),"Name taken":(0,B.jsx)(M,{...e,errorCode:`EVENT_TYPE_NAME_TAKEN`}),"Not allowed":(0,B.jsx)(M,{...e,errorCode:`FORBIDDEN`}),"Last type refused":(0,B.jsx)(M,{...e,errorCode:`LAST_EVENT_TYPE`})}}),play:async({canvas:e})=>{let t=t=>U(e.getByRole(`region`,{name:t}));await V(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await V(t(`Loading`).queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument(),await V(t(`Error`).getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument(),await V(t(`Empty`).getByText(`No event types yet. Add one below.`)).toBeInTheDocument(),await V(t(`With archived types`).getByText(`Archived`)).toBeInTheDocument(),await V(t(`With archived types`).queryByRole(`button`,{name:`Edit Old Social`})).not.toBeInTheDocument(),await V(t(`Name taken`).getByText(`That event type already exists.`)).toBeInTheDocument(),await V(t(`Not allowed`).getByText(`You are not allowed to make this change.`)).toBeInTheDocument(),await V(t(`Last type refused`).getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},X={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=U(document.body);await V(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await V(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await V(r.getByLabelText(/Move its events/)).toBeInTheDocument(),await V(n.onArchive).not.toHaveBeenCalled()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,B.jsx)(i,{items:{List:(0,B.jsx)(M,{...e}),Empty:(0,B.jsx)(M,{...e,eventTypes:[]}),Archived:(0,B.jsx)(M,{...e,eventTypes:K})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>U(e.getByRole(`region`,{name:t})),i=U(document.body);await t.click(r(`Empty`).getByRole(`button`,{name:`Add event type`})),await t.type(r(`Empty`).getByLabelText(`Event type name`),`Tournament`),await t.click(r(`Empty`).getByRole(`button`,{name:`Save`})),await V(n.onCreate).toHaveBeenCalledWith(V.objectContaining({name:`Tournament`,rosterDefault:a})),await V(r(`Empty`).queryByLabelText(`Event type name`)).not.toBeInTheDocument(),await t.click(r(`List`).getByRole(`button`,{name:`Edit Training`})),await V(r(`List`).queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(r(`List`).getByRole(`switch`,{name:`Track roster`})),await t.type(r(`List`).getByLabelText(/People needed in total/),`10`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await V(n.onUpdate).toHaveBeenCalledWith(`et-2`,V.objectContaining({name:`Training`,rosterDefault:V.objectContaining({trackRoster:!0,totalTarget:10})})),await t.click(r(`List`).getByRole(`button`,{name:`Edit Match`}));let o=r(`List`).getByLabelText(`Setter`);await t.clear(o),await t.type(o,`0`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await V(n.onUpdate).toHaveBeenCalledWith(`et-1`,V.objectContaining({rosterDefault:V.objectContaining({positionTargets:[]})})),await t.click(r(`List`).getByRole(`button`,{name:`Archive Match`})),await V(await i.findByText(`Archive "Match"?`)).toBeInTheDocument(),await V(i.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(i.getByLabelText(/Move its events/),`et-2`),await t.click(i.getByRole(`button`,{name:`Archive`})),await V(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`),await t.click(r(`List`).getByRole(`button`,{name:`Archive Match`})),await t.click(await i.findByRole(`button`,{name:`Archive`})),await V(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0),await t.click(r(`Archived`).getByRole(`button`,{name:`Restore Old Social`})),await V(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument();
    await expect(canvas.getByText('No roster')).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <ManageEventTypesView {...args} isLoading />,
    Error: <ManageEventTypesView {...args} isError />,
    Empty: <ManageEventTypesView {...args} eventTypes={[]} />,
    // Archived types are listed apart, and cannot be edited — only restored.
    'With archived types': <ManageEventTypesView {...args} eventTypes={WITH_ARCHIVED} />,
    'Name taken': <ManageEventTypesView {...args} errorCode="EVENT_TYPE_NAME_TAKEN" />,
    // Every code the container can produce says something. Silence would be indistinguishable
    // from a save that worked.
    'Not allowed': <ManageEventTypesView {...args} errorCode="FORBIDDEN" />,
    // The rule that stops a team archiving its way to no types at all, and no way to create an
    // event.
    'Last type refused': <ManageEventTypesView {...args} errorCode="LAST_EVENT_TYPE" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Add event type'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load event types. Please try again.")).toBeInTheDocument();
    await expect(region('Empty').getByText('No event types yet. Add one below.')).toBeInTheDocument();
    await expect(region('With archived types').getByText('Archived')).toBeInTheDocument();
    await expect(region('With archived types').queryByRole('button', {
      name: 'Edit Old Social'
    })).not.toBeInTheDocument();
    await expect(region('Name taken').getByText('That event type already exists.')).toBeInTheDocument();
    await expect(region('Not allowed').getByText('You are not allowed to make this change.')).toBeInTheDocument();
    await expect(region('Last type refused').getByText('A team must keep at least one active event type.')).toBeInTheDocument();
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Archive Match'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument();
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument();
    // The migration picker leads; leaving it unset is the fallback, not the default.
    await expect(dialog.getByLabelText(/Move its events/)).toBeInTheDocument();
    await expect(args.onArchive).not.toHaveBeenCalled();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    List: <ManageEventTypesView {...args} />,
    Empty: <ManageEventTypesView {...args} eventTypes={[]} />,
    Archived: <ManageEventTypesView {...args} eventTypes={WITH_ARCHIVED} />
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

    // Creating: the editor hides optimistically on submit — the admin sees the save land rather
    // than watching a spinner.
    await userEvent.click(region('Empty').getByRole('button', {
      name: 'Add event type'
    }));
    await userEvent.type(region('Empty').getByLabelText('Event type name'), 'Tournament');
    await userEvent.click(region('Empty').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Tournament',
      rosterDefault: ROSTER_OFF
    }));
    await expect(region('Empty').queryByLabelText('Event type name')).not.toBeInTheDocument();

    // The roster default is authored in the same editor the per-event override uses, so the two
    // can't disagree about what a blank field means.
    await userEvent.click(region('List').getByRole('button', {
      name: 'Edit Training'
    }));
    // Tracking starts off for Training, so the targets are hidden until it is switched on.
    await expect(region('List').queryByLabelText('People needed in total')).not.toBeInTheDocument();
    await userEvent.click(region('List').getByRole('switch', {
      name: 'Track roster'
    }));
    await userEvent.type(region('List').getByLabelText(/People needed in total/), '10');
    await userEvent.click(region('List').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onUpdate).toHaveBeenCalledWith('et-2', expect.objectContaining({
      name: 'Training',
      rosterDefault: expect.objectContaining({
        trackRoster: true,
        totalTarget: 10
      })
    }));

    // A zero is "no target", the same as blank — and the same as what the server does with one.
    await userEvent.click(region('List').getByRole('button', {
      name: 'Edit Match'
    }));
    const setter = region('List').getByLabelText('Setter');
    await userEvent.clear(setter);
    await userEvent.type(setter, '0');
    await userEvent.click(region('List').getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onUpdate).toHaveBeenCalledWith('et-1', expect.objectContaining({
      rosterDefault: expect.objectContaining({
        positionTargets: []
      })
    }));

    // The destructive path. It leads with the migration offer, because leaving events on a type no
    // picker shows is the fallback, not the default.
    await userEvent.click(region('List').getByRole('button', {
      name: 'Archive Match'
    }));
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument();
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument();
    await userEvent.selectOptions(dialog.getByLabelText(/Move its events/), 'et-2');
    await userEvent.click(dialog.getByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', 'et-2');

    // Declining the migration is a real choice, not an oversight: the events keep the archived type.
    await userEvent.click(region('List').getByRole('button', {
      name: 'Archive Match'
    }));
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', undefined);

    // Restoring an archived type is the only action its row offers.
    await userEvent.click(region('Archived').getByRole('button', {
      name: 'Restore Old Social'
    }));
    await expect(args.onUnarchive).toHaveBeenCalledWith('et-3');
  }
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`ArchiveDialogOpen`,`Interactions`]})))()}$();export{X as ArchiveDialogOpen,J as Data,Z as Interactions,Y as Shells,Q as __namedExportsOrder,q as default};