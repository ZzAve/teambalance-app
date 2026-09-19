import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyS7Yi9.js";import{n,o as r,r as i}from"./event-fixtures-CuRrQuRB.js";import{n as a,t as o}from"./createLucideIcon-BkXp_paf.js";import{a as ee,n as te,o as s,r as c,t as ne}from"./dropdown-menu-DiA7Ox2I.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./button-BNHeYByf.js";import{n as f,t as re}from"./input-DR4rLi4i.js";import{n as p,t as ie}from"./SectionLabel-B5oFQ-GJ.js";import{i as m,n as ae,r as oe}from"./roster-default-summary-Dldk-ywx.js";import{a as h,i as g,n as _,o as v,r as y,s as b,t as x}from"./dialog-D6E64Zuo.js";var S,se;function C(){return(C=e((()=>{a(),S=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],se=o(`archive-restore`,S)})))()}function ce(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function w({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:l,onUnarchive:u}){let[f,p]=(0,T.useState)(null),[m,h]=(0,T.useState)(null),[g,_]=(0,T.useState)(null),[v,y]=(0,T.useState)(!1),b=e.filter(e=>!e.archived),x=e.filter(e=>e.archived),S=()=>{p(`new`),h({name:``,color:O[0],rosterDefault:D}),y(!1)},C=e=>{p(e.id),h({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),y(!1)},w=()=>{p(null),h(null),y(!1)},j=ce({hasDraft:m!==null,submitted:v,errorCode:a});return(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Event types`}),(0,E.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,E.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,E.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,E.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,E.jsx)(`p`,{className:`text-small text-red`,children:A[a]??k}),b.length===0?(0,E.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,E.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:b.map(e=>(0,E.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,E.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,E.jsxs)(`span`,{className:`min-w-0 flex-1 truncate`,children:[(0,E.jsx)(`span`,{className:`text-small font-semibold`,children:e.name}),` `,(0,E.jsx)(`span`,{className:`text-caption text-muted-foreground`,children:ae(e.rosterDefault,t)})]}),(0,E.jsxs)(ne,{children:[(0,E.jsx)(ee,{asChild:!0,children:(0,E.jsx)(`button`,{type:`button`,"aria-label":`Actions for ${e.name}`,disabled:i,className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50`,children:`⋯`})}),(0,E.jsxs)(te,{align:`end`,children:[(0,E.jsx)(c,{onSelect:()=>C(e),children:`Edit`}),(0,E.jsx)(c,{onSelect:()=>_(e),children:`Archive…`})]})]})]},e.id))}),!j&&(0,E.jsx)(d,{className:`self-start`,disabled:i,onClick:S,children:`Add event type`}),j&&m&&(0,E.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,E.jsx)(`h3`,{className:`text-small font-semibold`,children:f===`new`?`New event type`:`Edit event type`}),(0,E.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,E.jsx)(re,{"aria-label":`Event type name`,className:`w-48`,value:m.name,placeholder:`e.g. Match`,onChange:e=>h({...m,name:e.target.value})}),(0,E.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:O.map(e=>(0,E.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":m.color===e,"aria-label":`Colour ${e}`,onClick:()=>h({...m,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${m.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,E.jsx)(oe,{idPrefix:`type-default`,value:m.rosterDefault,positions:t,disabled:i,onChange:e=>h({...m,rosterDefault:e})}),(0,E.jsxs)(`div`,{className:`flex gap-2`,children:[(0,E.jsx)(d,{disabled:i||m.name.trim().length===0,onClick:()=>{if(!m||m.name.trim().length===0)return;let e={...m,name:m.name.trim()};f===`new`?o(e):f&&s(f,e),y(!0)},children:`Save`}),(0,E.jsx)(d,{variant:`outline`,disabled:i,onClick:w,children:`Cancel`})]})]}),x.length>0&&(0,E.jsxs)(`div`,{className:`mt-2`,children:[(0,E.jsx)(ie,{as:`h3`,children:`Archived`}),(0,E.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:x.map(e=>(0,E.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,E.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.name}),(0,E.jsxs)(d,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>u(e.id),"aria-label":`Restore ${e.name}`,children:[(0,E.jsx)(se,{size:14}),`Restore`]})]},e.id))})]})]}),(0,E.jsx)(le,{target:g,alternatives:b.filter(e=>e.id!==g?.id),isSaving:i,onCancel:()=>_(null),onConfirm:(e,t)=>{l(e,t),_(null)}})]})}function le({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,T.useState)(``);return(0,E.jsx)(x,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,E.jsxs)(_,{children:[(0,E.jsxs)(h,{children:[(0,E.jsxs)(v,{children:[`Archive "`,e?.name,`"?`]}),(0,E.jsx)(y,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,E.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,E.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-small font-semibold`,children:`Move its events to another type first?`}),(0,E.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-small`,value:a,onChange:e=>o(e.target.value),children:[(0,E.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,E.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,E.jsxs)(g,{children:[(0,E.jsx)(d,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,E.jsx)(d,{disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var T,E,D,O,k,A;function j(){return(j=e((()=>{T=t(),C(),u(),f(),b(),s(),m(),p(),E=l(),D={trackRoster:!1,totalTarget:void 0,positionTargets:[]},O=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],k=`Something went wrong. Please try again.`,A={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},w.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Same quiet-row shape as the member roster and positions list (issue #341, variant B): colour dot +
name + roster summary as text, and a single overflow (⋯) menu carrying "Edit" (opens the editor
below) and "Archive…" — deliberately not the red destructive treatment, since archiving only ever
hides a type (it can be restored from the Archived section) and never deletes anything.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,ue;function de(){return(de=e((()=>{i(),j(),{expect:M,fn:N,within:P}=__STORYBOOK_MODULE_TEST__,F=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],I=[r({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),r({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:n})],L={title:`features/manage-event-types/ManageEventTypesView`,component:w,args:{eventTypes:I,positions:F,onCreate:N(),onUpdate:N(),onArchive:N(),onUnarchive:N()}},R={args:{isLoading:!0},play:async({canvas:e})=>{await M(e.getByText(`Loading…`)).toBeInTheDocument(),await M(e.queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument()}},z={args:{isError:!0},play:async({canvas:e})=>{await M(e.getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument()}},B={args:{eventTypes:[]},play:async({canvas:e})=>{await M(e.getByText(`No event types yet. Add one below.`)).toBeInTheDocument()}},V={play:async({canvas:e})=>{await M(e.getByText(`Match`)).toBeInTheDocument(),await M(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await M(e.getByText(`No roster`)).toBeInTheDocument(),await M(e.getAllByLabelText(/^Actions for /)).toHaveLength(2)}},H={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByLabelText(`Actions for Match`));let n=P(document.body),r=await n.findByRole(`menuitem`,{name:`Archive…`});await M(n.getByRole(`menuitem`,{name:`Edit`})).toBeInTheDocument(),await M(r).not.toHaveAttribute(`data-tone`,`destructive`)}},U={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t,args:r})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Tournament`),await t.click(e.getByRole(`button`,{name:`Save`})),await M(r.onCreate).toHaveBeenCalledWith(M.objectContaining({name:`Tournament`,rosterDefault:n}))}},W={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Training`));let r=P(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Edit`})),await M(e.queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Track roster`})),await t.type(e.getByLabelText(/People needed in total/),`10`),await t.click(e.getByRole(`button`,{name:`Save`})),await M(n.onUpdate).toHaveBeenCalledWith(`et-2`,M.objectContaining({name:`Training`,rosterDefault:M.objectContaining({trackRoster:!0,totalTarget:10})}))}},G={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=P(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Edit`}));let i=e.getByLabelText(`Setter`);await t.clear(i),await t.type(i,`0`),await t.click(e.getByRole(`button`,{name:`Save`})),await M(n.onUpdate).toHaveBeenCalledWith(`et-1`,M.objectContaining({rosterDefault:M.objectContaining({positionTargets:[]})}))}},K={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=P(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Archive…`}));let i=P(document.body);await M(await i.findByText(`Archive "Match"?`)).toBeInTheDocument(),await M(i.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(i.getByLabelText(/Move its events/),`et-2`),await t.click(i.getByRole(`button`,{name:`Archive`})),await M(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`)}},q={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=P(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Archive…`}));let i=P(document.body);await t.click(await i.findByRole(`button`,{name:`Archive`})),await M(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0)}},J={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByLabelText(`Actions for Match`));let r=P(document.body);await t.click(await r.findByRole(`menuitem`,{name:`Archive…`}));let i=P(document.body);await M(await i.findByText(`Archive "Match"?`)).toBeInTheDocument(),await M(i.getByText(/no event is deleted/i)).toBeInTheDocument(),await M(i.getByLabelText(/Move its events/)).toBeInTheDocument(),await M(n.onArchive).not.toHaveBeenCalled()}},Y={args:{eventTypes:[...I,r({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:n})]},play:async({canvas:e,userEvent:t,args:n})=>{await M(e.getByText(`Archived`)).toBeInTheDocument(),await M(e.queryByLabelText(`Actions for Old Social`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Restore Old Social`})),await M(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},X={args:{errorCode:`EVENT_TYPE_NAME_TAKEN`},play:async({canvas:e})=>{await M(e.getByText(`That event type already exists.`)).toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Match`),await t.click(e.getByRole(`button`,{name:`Save`})),await M(e.queryByLabelText(`Event type name`)).not.toBeInTheDocument()}},Q={args:{errorCode:`FORBIDDEN`},play:async({canvas:e})=>{await M(e.getByText(`You are not allowed to make this change.`)).toBeInTheDocument()}},$={args:{errorCode:`LAST_EVENT_TYPE`},play:async({canvas:e})=>{await M(e.getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Add event type'
    })).not.toBeInTheDocument();
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load event types. Please try again.")).toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No event types yet. Add one below.')).toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument();
    await expect(canvas.getByText('No roster')).toBeInTheDocument();
    // One overflow-menu trigger per row, no inline Edit/Archive buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2);
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Empty — save closes the editor, so the post-play frame is the empty list
  // again (ADR-0027 §2). The spy is the point; the picture is Empty's.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    eventTypes: []
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Add event type'
    }));
    await userEvent.type(canvas.getByLabelText('Event type name'), 'Tournament');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Tournament',
      rosterDefault: ROSTER_OFF
    }));
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of WithTypes — save closes the editor and settles back to the list
  // (ADR-0027 §2). The mid-play frames (targets appearing when tracking is switched on) are
  // exercised here but pictured by RosterOverrideField's own stories.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Training'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Edit'
    }));
    // Tracking starts off for Training, so the targets are hidden until it is switched on.
    await expect(canvas.queryByLabelText('People needed in total')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Track roster'
    }));
    await userEvent.type(canvas.getByLabelText(/People needed in total/), '10');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onUpdate).toHaveBeenCalledWith('et-2', expect.objectContaining({
      name: 'Training',
      rosterDefault: expect.objectContaining({
        trackRoster: true,
        totalTarget: 10
      })
    }));
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of WithTypes — save closes the editor and settles back to the list
  // (ADR-0027 §2). What is being proven is the dropped target in the payload, not a picture.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Edit'
    }));
    const setter = canvas.getByLabelText('Setter');
    await userEvent.clear(setter);
    await userEvent.type(setter, '0');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onUpdate).toHaveBeenCalledWith('et-1', expect.objectContaining({
      rosterDefault: expect.objectContaining({
        positionTargets: []
      })
    }));
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of WithTypes — confirming closes the dialog, so the post-play frame is the
  // list again (ADR-0027 §2). The open dialog is pictured by ArchiveDialogOpen below.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Archive…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument();
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument();
    await userEvent.selectOptions(dialog.getByLabelText(/Move its events/), 'et-2');
    await userEvent.click(dialog.getByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', 'et-2');
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of WithTypes — as above; this one proves the undefined migration target.
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Archive…'
    }));
    const dialog = within(document.body);
    await userEvent.click(await dialog.findByRole('button', {
      name: 'Archive'
    }));
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', undefined);
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'));
    const menu = within(document.body);
    await userEvent.click(await menu.findByRole('menuitem', {
      name: 'Archive…'
    }));
    const dialog = within(document.body);
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument();
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument();
    // The migration picker leads; leaving it unset is the fallback, not the default.
    await expect(dialog.getByLabelText(/Move its events/)).toBeInTheDocument();
    await expect(args.onArchive).not.toHaveBeenCalled();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: [...TYPES, makeEventType({
      id: 'et-3',
      name: 'Old Social',
      archived: true,
      rosterDefault: ROSTER_OFF
    })]
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Archived types are listed apart, and cannot be edited — only restored.
    await expect(canvas.getByText('Archived')).toBeInTheDocument();
    await expect(canvas.queryByLabelText('Actions for Old Social')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Restore Old Social'
    }));
    await expect(args.onUnarchive).toHaveBeenCalledWith('et-3');
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'EVENT_TYPE_NAME_TAKEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That event type already exists.')).toBeInTheDocument();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Empty — asserts the editor is gone, which IS the empty-list picture
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    eventTypes: []
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Add event type'
    }));
    await userEvent.type(canvas.getByLabelText('Event type name'), 'Match');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(canvas.queryByLabelText('Event type name')).not.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'FORBIDDEN'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('You are not allowed to make this change.')).toBeInTheDocument();
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    errorCode: 'LAST_EVENT_TYPE'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('A team must keep at least one active event type.')).toBeInTheDocument();
  }
}`,...$.parameters?.docs?.source}}},ue=[`Loading`,`ErrorState`,`Empty`,`WithTypes`,`MenuOpen`,`CreateEventType`,`EditRosterDefault`,`ZeroTargetMeansNoTarget`,`ArchiveWithMigration`,`ArchiveWithoutMigration`,`ArchiveDialogOpen`,`WithArchivedTypes`,`NameTaken`,`SubmitClosesTheEditorOptimistically`,`UnhandledErrorStillSpeaks`,`LastEventTypeRefused`]})))()}de();export{J as ArchiveDialogOpen,K as ArchiveWithMigration,q as ArchiveWithoutMigration,U as CreateEventType,W as EditRosterDefault,B as Empty,z as ErrorState,$ as LastEventTypeRefused,R as Loading,H as MenuOpen,X as NameTaken,Z as SubmitClosesTheEditorOptimistically,Q as UnhandledErrorStillSpeaks,Y as WithArchivedTypes,V as WithTypes,G as ZeroTargetMeansNoTarget,ue as __namedExportsOrder,L as default};