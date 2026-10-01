import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Cm8AJftX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,o,r as s}from"./event-fixtures-CuRrQuRB.js";import{n as c,t as l}from"./createLucideIcon-It2k_8pt.js";import{a as u,n as ee,o as d,r as f,t as te}from"./dropdown-menu-Y6P7PWTi.js";import{n as p,t as m}from"./button-jmcBUdua.js";import{n as h,t as g}from"./input-jI_vzpvO.js";import{n as _,t as ne}from"./SectionLabel-B5oFQ-GJ.js";import{i as v,n as re,r as ie}from"./roster-default-summary-DXEwZjVI.js";import{a as y,i as b,n as x,o as S,r as C,s as w,t as T}from"./dialog-B4vEaeYy.js";var E,D;function O(){return(O=e((()=>{c(),E=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],D=l(`archive-restore`,E)})))()}function k(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function A({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:c,onUnarchive:l}){let[d,p]=(0,M.useState)(null),[h,_]=(0,M.useState)(null),[v,y]=(0,M.useState)(null),[b,x]=(0,M.useState)(!1),S=e.filter(e=>!e.archived),C=e.filter(e=>e.archived),w=()=>{p(`new`),_({name:``,color:F[0],rosterDefault:P}),x(!1)},T=e=>{p(e.id),_({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),x(!1)},E=()=>{p(null),_(null),x(!1)},O=k({hasDraft:h!==null,submitted:b,errorCode:a});return(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Event types`}),(0,N.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,N.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,N.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,N.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,N.jsx)(`p`,{className:`text-small text-red`,children:L[a]??I}),S.length===0?(0,N.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,N.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:S.map(e=>(0,N.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,N.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,N.jsxs)(`span`,{className:`min-w-0 flex-1 truncate`,children:[(0,N.jsx)(`span`,{className:`text-small font-semibold`,children:e.name}),` `,(0,N.jsx)(`span`,{className:`text-caption text-muted-foreground`,children:re(e.rosterDefault,t)})]}),(0,N.jsxs)(te,{children:[(0,N.jsx)(u,{asChild:!0,children:(0,N.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.name}`,disabled:i,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,N.jsxs)(ee,{align:`end`,children:[(0,N.jsx)(f,{onSelect:()=>T(e),children:`Edit`}),(0,N.jsx)(f,{onSelect:()=>y(e),children:`Archive…`})]})]})]},e.id))}),!O&&(0,N.jsx)(m,{className:`self-start`,disabled:i,onClick:w,children:`Add event type`}),O&&h&&(0,N.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,N.jsx)(`h3`,{className:`text-small font-semibold`,children:d===`new`?`New event type`:`Edit event type`}),(0,N.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,N.jsx)(g,{"aria-label":`Event type name`,className:`w-48`,value:h.name,placeholder:`e.g. Match`,onChange:e=>_({...h,name:e.target.value})}),(0,N.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:F.map(e=>(0,N.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":h.color===e,"aria-label":`Colour ${e}`,onClick:()=>_({...h,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${h.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,N.jsx)(ie,{idPrefix:`type-default`,value:h.rosterDefault,positions:t,disabled:i,onChange:e=>_({...h,rosterDefault:e})}),(0,N.jsxs)(`div`,{className:`flex gap-2`,children:[(0,N.jsx)(m,{disabled:i||h.name.trim().length===0,onClick:()=>{if(!h||h.name.trim().length===0)return;let e={...h,name:h.name.trim()};d===`new`?o(e):d&&s(d,e),x(!0)},children:`Save`}),(0,N.jsx)(m,{variant:`outline`,disabled:i,onClick:E,children:`Cancel`})]})]}),C.length>0&&(0,N.jsxs)(`div`,{className:`mt-2`,children:[(0,N.jsx)(ne,{as:`h3`,children:`Archived`}),(0,N.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:C.map(e=>(0,N.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,N.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.name}),(0,N.jsxs)(m,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>l(e.id),"aria-label":`Restore ${e.name}`,children:[(0,N.jsx)(D,{size:14}),`Restore`]})]},e.id))})]})]}),(0,N.jsx)(j,{target:v,alternatives:S.filter(e=>e.id!==v?.id),isSaving:i,onCancel:()=>y(null),onConfirm:(e,t)=>{c(e,t),y(null)}})]})}function j({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,M.useState)(``);return(0,N.jsx)(T,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,N.jsxs)(x,{children:[(0,N.jsxs)(y,{children:[(0,N.jsxs)(S,{children:[`Archive "`,e?.name,`"?`]}),(0,N.jsx)(C,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,N.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,N.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-small font-semibold`,children:`Move its events to another type first?`}),(0,N.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-small`,value:a,onChange:e=>o(e.target.value),children:[(0,N.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,N.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(m,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,N.jsx)(m,{disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var M,N,P,F,I,L;function R(){return(R=e((()=>{M=t(),O(),p(),h(),w(),d(),v(),_(),N=n(),P={trackRoster:!1,totalTarget:void 0,positionTargets:[]},F=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],I=`Something went wrong. Please try again.`,L={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},A.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Same quiet-row shape as the member roster and positions list (issue #341, variant B): colour dot +
name + roster summary as text, and a single overflow (⋯) menu carrying "Edit" (opens the editor
below) and "Archive…" — deliberately not the red destructive treatment, since archiving only ever
hides a type (it can be restored from the Archived section) and never deletes anything.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{r(),s(),R(),z=n(),{expect:B,fn:V,within:H}=__STORYBOOK_MODULE_TEST__,U=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],W=[o({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),o({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:a})],G=[...W,o({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:a})],K={title:`features/manage-event-types/ManageEventTypesView`,component:A,args:{eventTypes:W,positions:U,onCreate:V(),onUpdate:V(),onArchive:V(),onUnarchive:V()}},q={play:async({canvas:e})=>{await B(e.getByText(`Match`)).toBeInTheDocument(),await B(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await B(e.getByText(`No roster`)).toBeInTheDocument(),await B(e.getAllByLabelText(/^Actions for /)).toHaveLength(2)}},J={render:e=>(0,z.jsx)(i,{items:{Loading:(0,z.jsx)(A,{...e,isLoading:!0}),Error:(0,z.jsx)(A,{...e,isError:!0}),Empty:(0,z.jsx)(A,{...e,eventTypes:[]}),"With archived types":(0,z.jsx)(A,{...e,eventTypes:G}),"Name taken":(0,z.jsx)(A,{...e,errorCode:`EVENT_TYPE_NAME_TAKEN`}),"Not allowed":(0,z.jsx)(A,{...e,errorCode:`FORBIDDEN`}),"Last type refused":(0,z.jsx)(A,{...e,errorCode:`LAST_EVENT_TYPE`})}}),play:async({canvas:e})=>{let t=t=>H(e.getByRole(`region`,{name:t}));await B(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await B(t(`Loading`).queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument(),await B(t(`Error`).getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument(),await B(t(`Empty`).getByText(`No event types yet. Add one below.`)).toBeInTheDocument(),await B(t(`With archived types`).getByText(`Archived`)).toBeInTheDocument(),await B(t(`With archived types`).queryByLabelText(`Actions for Old Social`)).not.toBeInTheDocument(),await B(t(`Name taken`).getByText(`That event type already exists.`)).toBeInTheDocument(),await B(t(`Not allowed`).getByText(`You are not allowed to make this change.`)).toBeInTheDocument(),await B(t(`Last type refused`).getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},Y={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Match`));let n=H(document.body),r=await n.findByRole(`menuitem`,{name:`Archive…`});await B(n.getByRole(`menuitem`,{name:`Edit`})).toBeInTheDocument(),await B(r).not.toHaveAttribute(`data-tone`,`destructive`)}},X={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=H(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Archive…`})),await B(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await B(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await B(r.getByLabelText(/Move its events/)).toBeInTheDocument(),await B(n.onArchive).not.toHaveBeenCalled()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,z.jsx)(i,{items:{List:(0,z.jsx)(A,{...e}),Empty:(0,z.jsx)(A,{...e,eventTypes:[]}),Archived:(0,z.jsx)(A,{...e,eventTypes:G})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>H(e.getByRole(`region`,{name:t})),i=H(document.body);await t.click(r(`Empty`).getByRole(`button`,{name:`Add event type`})),await t.type(r(`Empty`).getByLabelText(`Event type name`),`Tournament`),await t.click(r(`Empty`).getByRole(`button`,{name:`Save`})),await B(n.onCreate).toHaveBeenCalledWith(B.objectContaining({name:`Tournament`,rosterDefault:a})),await B(r(`Empty`).queryByLabelText(`Event type name`)).not.toBeInTheDocument(),await t.click(r(`List`).getByLabelText(`Actions for Training`)),await t.click(await i.findByRole(`menuitem`,{name:`Edit`})),await B(r(`List`).queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(r(`List`).getByRole(`switch`,{name:`Track roster`})),await t.type(r(`List`).getByLabelText(/People needed in total/),`10`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await B(n.onUpdate).toHaveBeenCalledWith(`et-2`,B.objectContaining({name:`Training`,rosterDefault:B.objectContaining({trackRoster:!0,totalTarget:10})})),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Edit`}));let o=r(`List`).getByLabelText(`Setter`);await t.clear(o),await t.type(o,`0`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await B(n.onUpdate).toHaveBeenCalledWith(`et-1`,B.objectContaining({rosterDefault:B.objectContaining({positionTargets:[]})})),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Archive…`})),await B(await i.findByText(`Archive "Match"?`)).toBeInTheDocument(),await B(i.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(i.getByLabelText(/Move its events/),`et-2`),await t.click(i.getByRole(`button`,{name:`Archive`})),await B(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Archive…`})),await t.click(await i.findByRole(`button`,{name:`Archive`})),await B(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0),await t.click(r(`Archived`).getByRole(`button`,{name:`Restore Old Social`})),await B(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument();
    await expect(canvas.getByText('No roster')).toBeInTheDocument();
    // One overflow-menu trigger per row, no inline Edit/Archive buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
    // Archived rows only offer Restore — no ⋯ actions menu at all.
    await expect(region('With archived types').queryByLabelText('Actions for Old Social')).not.toBeInTheDocument();
    await expect(region('Name taken').getByText('That event type already exists.')).toBeInTheDocument();
    await expect(region('Not allowed').getByText('You are not allowed to make this change.')).toBeInTheDocument();
    await expect(region('Last type refused').getByText('A team must keep at least one active event type.')).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const menu = within(document.body);
    const archiveItem = await menu.findByRole('menuitem', {
      name: 'Archive…'
    });
    await expect(menu.getByRole('menuitem', {
      name: 'Edit'
    })).toBeInTheDocument();
    await expect(archiveItem).not.toHaveAttribute('data-tone', 'destructive');
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const portal = within(document.body);
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Archive…'
    }));
    await expect(await portal.findByText('Archive "Match"?')).toBeInTheDocument();
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(portal.getByText(/no event is deleted/i)).toBeInTheDocument();
    // The migration picker leads; leaving it unset is the fallback, not the default.
    await expect(portal.getByLabelText(/Move its events/)).toBeInTheDocument();
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
    const portal = within(document.body);

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
    // can't disagree about what a blank field means. Reached via the row's ⋯ menu, not an inline
    // Edit button.
    await userEvent.click(region('List').getByLabelText('Actions for Training'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Edit'
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
    await userEvent.click(region('List').getByLabelText('Actions for Match'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Edit'
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
    // picker shows is the fallback, not the default. Reached via the ⋯ menu; Archive… itself carries
    // no destructive styling (it only ever hides a type — MenuOpen carries that baseline).
    await userEvent.click(region('List').getByLabelText('Actions for Match'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Archive…'
    }));
    await expect(await portal.findByText('Archive "Match"?')).toBeInTheDocument();
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(portal.getByText(/no event is deleted/i)).toBeInTheDocument();
    await userEvent.selectOptions(portal.getByLabelText(/Move its events/), 'et-2');
    await userEvent.click(portal.getByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', 'et-2');

    // Declining the migration is a real choice, not an oversight: the events keep the archived type.
    await userEvent.click(region('List').getByLabelText('Actions for Match'));
    await userEvent.click(await portal.findByRole('menuitem', {
      name: 'Archive…'
    }));
    await userEvent.click(await portal.findByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', undefined);

    // Restoring an archived type is the only action its row offers — no ⋯ menu for archived rows.
    await userEvent.click(region('Archived').getByRole('button', {
      name: 'Restore Old Social'
    }));
    await expect(args.onUnarchive).toHaveBeenCalledWith('et-3');
  }
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`MenuOpen`,`ArchiveDialogOpen`,`Interactions`]})))()}$();export{X as ArchiveDialogOpen,q as Data,Z as Interactions,Y as MenuOpen,J as Shells,Q as __namedExportsOrder,K as default};