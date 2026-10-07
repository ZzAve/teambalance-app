import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DMX6FY1D.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,o,r as s}from"./event-fixtures-C1ds5yXh.js";import{n as c,t as l}from"./createLucideIcon-BhQXnsc2.js";import{a as u,n as d,o as f,r as p,t as ee}from"./dropdown-menu-Bk2EtHoR.js";import{n as m,t as h}from"./button-CT4OB9OR.js";import{n as g,t as _}from"./input-CxUw5kRD.js";import{n as v,t as te}from"./SectionLabel-_vzOhMMA.js";import{i as y,n as ne,r as re}from"./roster-default-summary-CxdIkhVj.js";import{a as b,i as x,n as S,o as C,r as w,s as T,t as E}from"./dialog-8l1JWmEG.js";var D,O;function k(){return(k=e((()=>{c(),D=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],O=l(`archive-restore`,D)})))()}function A(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function j({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:c,onUnarchive:l}){let[f,m]=(0,N.useState)(null),[g,v]=(0,N.useState)(null),[y,b]=(0,N.useState)(null),[x,S]=(0,N.useState)(!1),C=e.filter(e=>!e.archived),w=e.filter(e=>e.archived),T=()=>{m(`new`),v({name:``,color:I[0],rosterDefault:F}),S(!1)},E=e=>{m(e.id),v({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),S(!1)},D=()=>{m(null),v(null),S(!1)},k=A({hasDraft:g!==null,submitted:x,errorCode:a});return(0,P.jsxs)(`div`,{children:[(0,P.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Event types`}),(0,P.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,P.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,P.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,P.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,P.jsx)(`p`,{className:`text-small text-red`,children:R[a]??L}),C.length===0?(0,P.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,P.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:C.map(e=>(0,P.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,P.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,P.jsxs)(`span`,{className:`min-w-0 flex-1 truncate`,children:[(0,P.jsx)(`span`,{className:`text-small font-semibold`,children:e.name}),` `,(0,P.jsx)(`span`,{className:`text-caption text-muted-foreground`,children:ne(e.rosterDefault,t)})]}),(0,P.jsxs)(ee,{children:[(0,P.jsx)(u,{asChild:!0,children:(0,P.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.name}`,disabled:i,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,P.jsxs)(d,{align:`end`,children:[(0,P.jsx)(p,{onSelect:()=>E(e),children:`Edit`}),(0,P.jsx)(p,{onSelect:()=>b(e),children:`Archive…`})]})]})]},e.id))}),!k&&(0,P.jsx)(h,{className:`self-start`,disabled:i,onClick:T,children:`Add event type`}),k&&g&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,P.jsx)(`h3`,{className:`text-small font-semibold`,children:f===`new`?`New event type`:`Edit event type`}),(0,P.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,P.jsx)(_,{"aria-label":`Event type name`,className:`w-48`,value:g.name,placeholder:`e.g. Match`,onChange:e=>v({...g,name:e.target.value})}),(0,P.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:I.map(e=>(0,P.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":g.color===e,"aria-label":`Colour ${e}`,onClick:()=>v({...g,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${g.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,P.jsx)(re,{idPrefix:`type-default`,value:g.rosterDefault,positions:t,disabled:i,onChange:e=>v({...g,rosterDefault:e})}),(0,P.jsxs)(`div`,{className:`flex gap-2`,children:[(0,P.jsx)(h,{disabled:i||g.name.trim().length===0,onClick:()=>{if(!g||g.name.trim().length===0)return;let e={...g,name:g.name.trim()};f===`new`?o(e):f&&s(f,e),S(!0)},children:`Save`}),(0,P.jsx)(h,{variant:`outline`,disabled:i,onClick:D,children:`Cancel`})]})]}),w.length>0&&(0,P.jsxs)(`div`,{className:`mt-2`,children:[(0,P.jsx)(te,{as:`h3`,children:`Archived`}),(0,P.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:w.map(e=>(0,P.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,P.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.name}),(0,P.jsxs)(h,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>l(e.id),"aria-label":`Restore ${e.name}`,children:[(0,P.jsx)(O,{size:14}),`Restore`]})]},e.id))})]})]}),(0,P.jsx)(M,{target:y,alternatives:C.filter(e=>e.id!==y?.id),isSaving:i,onCancel:()=>b(null),onConfirm:(e,t)=>{c(e,t),b(null)}})]})}function M({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,N.useState)(``);return(0,P.jsx)(E,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,P.jsxs)(S,{children:[(0,P.jsxs)(b,{children:[(0,P.jsxs)(C,{children:[`Archive "`,e?.name,`"?`]}),(0,P.jsx)(w,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,P.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-small font-semibold`,children:`Move its events to another type first?`}),(0,P.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-small`,value:a,onChange:e=>o(e.target.value),children:[(0,P.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,P.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,P.jsxs)(x,{children:[(0,P.jsx)(h,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,P.jsx)(h,{disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var N,P,F,I,L,R;function z(){return(z=e((()=>{N=t(),k(),m(),g(),T(),f(),y(),v(),P=n(),F={trackRoster:!1,totalTarget:void 0,positionTargets:[]},I=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],L=`Something went wrong. Please try again.`,R={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},j.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Same quiet-row shape as the member roster and positions list (issue #341, variant B): colour dot +
name + roster summary as text, and a single overflow (⋯) menu carrying "Edit" (opens the editor
below) and "Archive…" — deliberately not the red destructive treatment, since archiving only ever
hides a type (it can be restored from the Archived section) and never deletes anything.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{r(),s(),z(),B=n(),{expect:V,fn:H,within:U}=__STORYBOOK_MODULE_TEST__,W=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],G=[o({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),o({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:a})],K=[...G,o({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:a})],q={title:`features/manage-event-types/ManageEventTypesView`,component:j,args:{eventTypes:G,positions:W,onCreate:H(),onUpdate:H(),onArchive:H(),onUnarchive:H()}},J={play:async({canvas:e})=>{await V(e.getByText(`Match`)).toBeInTheDocument(),await V(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await V(e.getByText(`No roster`)).toBeInTheDocument(),await V(e.getAllByLabelText(/^Actions for /)).toHaveLength(2)}},Y={render:e=>(0,B.jsx)(i,{items:{Loading:(0,B.jsx)(j,{...e,isLoading:!0}),Error:(0,B.jsx)(j,{...e,isError:!0}),Empty:(0,B.jsx)(j,{...e,eventTypes:[]}),"With archived types":(0,B.jsx)(j,{...e,eventTypes:K}),"Name taken":(0,B.jsx)(j,{...e,errorCode:`EVENT_TYPE_NAME_TAKEN`}),"Not allowed":(0,B.jsx)(j,{...e,errorCode:`FORBIDDEN`}),"Last type refused":(0,B.jsx)(j,{...e,errorCode:`LAST_EVENT_TYPE`})}}),play:async({canvas:e})=>{let t=t=>U(e.getByRole(`region`,{name:t}));await V(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await V(t(`Loading`).queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument(),await V(t(`Error`).getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument(),await V(t(`Empty`).getByText(`No event types yet. Add one below.`)).toBeInTheDocument(),await V(t(`With archived types`).getByText(`Archived`)).toBeInTheDocument(),await V(t(`With archived types`).queryByLabelText(`Actions for Old Social`)).not.toBeInTheDocument(),await V(t(`Name taken`).getByText(`That event type already exists.`)).toBeInTheDocument(),await V(t(`Not allowed`).getByText(`You are not allowed to make this change.`)).toBeInTheDocument(),await V(t(`Last type refused`).getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},X={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=U(document.body),i=await r.findByRole(`menuitem`,{name:`Archive…`});await V(i).not.toHaveAttribute(`data-tone`,`destructive`),await t.click(i),await V(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await V(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await V(r.getByLabelText(/Move its events/)).toBeInTheDocument(),await V(n.onArchive).not.toHaveBeenCalled()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,B.jsx)(i,{items:{List:(0,B.jsx)(j,{...e}),Empty:(0,B.jsx)(j,{...e,eventTypes:[]}),Archived:(0,B.jsx)(j,{...e,eventTypes:K})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>U(e.getByRole(`region`,{name:t})),i=U(document.body);await t.click(r(`Empty`).getByRole(`button`,{name:`Add event type`})),await t.type(r(`Empty`).getByLabelText(`Event type name`),`Tournament`),await t.click(r(`Empty`).getByRole(`button`,{name:`Save`})),await V(n.onCreate).toHaveBeenCalledWith(V.objectContaining({name:`Tournament`,rosterDefault:a})),await V(r(`Empty`).queryByLabelText(`Event type name`)).not.toBeInTheDocument(),await t.click(r(`List`).getByLabelText(`Actions for Training`)),await t.click(await i.findByRole(`menuitem`,{name:`Edit`})),await V(r(`List`).queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(r(`List`).getByRole(`switch`,{name:`Track roster`})),await t.type(r(`List`).getByLabelText(/People needed in total/),`10`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await V(n.onUpdate).toHaveBeenCalledWith(`et-2`,V.objectContaining({name:`Training`,rosterDefault:V.objectContaining({trackRoster:!0,totalTarget:10})})),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Edit`}));let o=r(`List`).getByLabelText(`Setter`);await t.clear(o),await t.type(o,`0`),await t.click(r(`List`).getByRole(`button`,{name:`Save`})),await V(n.onUpdate).toHaveBeenCalledWith(`et-1`,V.objectContaining({rosterDefault:V.objectContaining({positionTargets:[]})})),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Archive…`})),await V(await i.findByText(`Archive "Match"?`)).toBeInTheDocument(),await V(i.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(i.getByLabelText(/Move its events/),`et-2`),await t.click(i.getByRole(`button`,{name:`Archive`})),await V(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`),await t.click(r(`List`).getByLabelText(`Actions for Match`)),await t.click(await i.findByRole(`menuitem`,{name:`Archive…`})),await t.click(await i.findByRole(`button`,{name:`Archive`})),await V(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0),await t.click(r(`Archived`).getByRole(`button`,{name:`Restore Old Social`})),await V(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument();
    await expect(canvas.getByText('No roster')).toBeInTheDocument();
    // One overflow-menu trigger per row, no inline Edit/Archive buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
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
    // Archived rows only offer Restore — no ⋯ actions menu at all.
    await expect(region('With archived types').queryByLabelText('Actions for Old Social')).not.toBeInTheDocument();
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
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const portal = within(document.body);
    const archiveItem = await portal.findByRole('menuitem', {
      name: 'Archive…'
    });
    await expect(archiveItem).not.toHaveAttribute('data-tone', 'destructive');
    await userEvent.click(archiveItem);
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
    // no destructive styling (it only ever hides a type).
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
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`ArchiveDialogOpen`,`Interactions`]})))()}$();export{X as ArchiveDialogOpen,J as Data,Z as Interactions,Y as Shells,Q as __namedExportsOrder,q as default};