import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BD-ZbcV5.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{a as r,n as i,r as a}from"./event-fixtures-GLq-GGnS.js";import{n as o,t as s}from"./createLucideIcon-BDYYYRqV.js";import{n as c,t as l}from"./button-DBgqMzdC.js";import{n as u,t as ee}from"./input-BuYIGuSa.js";import{i as d,n as te,r as ne}from"./roster-default-summary-CcDNxJxK.js";import{a as f,i as p,n as m,o as h,r as g,s as _,t as v}from"./dialog-DefEeWGY.js";var y,b;function x(){return(x=e((()=>{o(),y=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],b=s(`archive-restore`,y)})))()}var S,re;function C(){return(C=e((()=>{o(),S=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8`,key:`1s80jp`}],[`path`,{d:`M10 12h4`,key:`a56b0p`}]],re=s(`archive`,S)})))()}var w,ie;function T(){return(T=e((()=>{o(),w=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],ie=s(`pencil`,w)})))()}function ae(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function E({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:c,onUnarchive:u}){let[d,f]=(0,D.useState)(null),[p,m]=(0,D.useState)(null),[h,g]=(0,D.useState)(null),[_,v]=(0,D.useState)(!1),y=e.filter(e=>!e.archived),x=e.filter(e=>e.archived),S=()=>{f(`new`),m({name:``,color:A[0],rosterDefault:k}),v(!1)},C=e=>{f(e.id),m({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),v(!1)},w=()=>{f(null),m(null),v(!1)},T=ae({hasDraft:p!==null,submitted:_,errorCode:a});return(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Event types`}),(0,O.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,O.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,O.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,O.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,O.jsx)(`p`,{className:`text-sm text-red`,children:j[a]??se}),y.length===0?(0,O.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,O.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:y.map(e=>(0,O.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,O.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,O.jsx)(`span`,{className:`text-sm font-semibold`,children:e.name}),(0,O.jsx)(`span`,{className:`text-[11.5px] text-muted-foreground`,children:te(e.rosterDefault,t)}),(0,O.jsxs)(`div`,{className:`ml-auto flex gap-2`,children:[(0,O.jsxs)(l,{variant:`outline`,size:`sm`,disabled:i,onClick:()=>C(e),"aria-label":`Edit ${e.name}`,children:[(0,O.jsx)(ie,{size:14}),`Edit`]}),(0,O.jsxs)(l,{variant:`destructive`,size:`sm`,disabled:i,onClick:()=>g(e),"aria-label":`Archive ${e.name}`,children:[(0,O.jsx)(re,{size:14}),`Archive`]})]})]},e.id))}),!T&&(0,O.jsx)(l,{className:`self-start`,disabled:i,onClick:S,children:`Add event type`}),T&&p&&(0,O.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,O.jsx)(`h3`,{className:`text-sm font-semibold`,children:d===`new`?`New event type`:`Edit event type`}),(0,O.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,O.jsx)(ee,{"aria-label":`Event type name`,className:`w-48`,value:p.name,placeholder:`e.g. Match`,onChange:e=>m({...p,name:e.target.value})}),(0,O.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:A.map(e=>(0,O.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":p.color===e,"aria-label":`Colour ${e}`,onClick:()=>m({...p,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${p.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,O.jsx)(ne,{idPrefix:`type-default`,value:p.rosterDefault,positions:t,disabled:i,onChange:e=>m({...p,rosterDefault:e})}),(0,O.jsxs)(`div`,{className:`flex gap-2`,children:[(0,O.jsx)(l,{disabled:i||p.name.trim().length===0,onClick:()=>{if(!p||p.name.trim().length===0)return;let e={...p,name:p.name.trim()};d===`new`?o(e):d&&s(d,e),v(!0)},children:`Save`}),(0,O.jsx)(l,{variant:`outline`,disabled:i,onClick:w,children:`Cancel`})]})]}),x.length>0&&(0,O.jsxs)(`div`,{className:`mt-2`,children:[(0,O.jsx)(`h3`,{className:`text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Archived`}),(0,O.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:x.map(e=>(0,O.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,O.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.name}),(0,O.jsxs)(l,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>u(e.id),"aria-label":`Restore ${e.name}`,children:[(0,O.jsx)(b,{size:14}),`Restore`]})]},e.id))})]})]}),(0,O.jsx)(oe,{target:h,alternatives:y.filter(e=>e.id!==h?.id),isSaving:i,onCancel:()=>g(null),onConfirm:(e,t)=>{c(e,t),g(null)}})]})}function oe({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,D.useState)(``);return(0,O.jsx)(v,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,O.jsxs)(m,{children:[(0,O.jsxs)(f,{children:[(0,O.jsxs)(h,{children:[`Archive "`,e?.name,`"?`]}),(0,O.jsx)(g,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,O.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,O.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-[13px] font-semibold`,children:`Move its events to another type first?`}),(0,O.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-sm`,value:a,onChange:e=>o(e.target.value),children:[(0,O.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,O.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,O.jsxs)(p,{children:[(0,O.jsx)(l,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,O.jsx)(l,{variant:`destructive`,disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var D,O,k,A,se,j;function M(){return(M=e((()=>{D=t(),C(),x(),T(),c(),u(),_(),d(),O=n(),k={trackRoster:!1,totalTarget:void 0,positionTargets:[]},A=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],se=`Something went wrong. Please try again.`,j={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},E.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,ce;function le(){return(le=e((()=>{a(),M(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],L=[r({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),r({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:i})],R={title:`features/manage-event-types/ManageEventTypesView`,component:E,args:{eventTypes:L,positions:I,onCreate:P(),onUpdate:P(),onArchive:P(),onUnarchive:P()}},z={args:{isLoading:!0},play:async({canvas:e})=>{await N(e.getByText(`Loading…`)).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument()}},B={args:{isError:!0},play:async({canvas:e})=>{await N(e.getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument()}},V={args:{eventTypes:[]},play:async({canvas:e})=>{await N(e.getByText(`No event types yet. Add one below.`)).toBeInTheDocument()}},H={play:async({canvas:e})=>{await N(e.getByText(`Match`)).toBeInTheDocument(),await N(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await N(e.getByText(`No roster`)).toBeInTheDocument()}},U={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Tournament`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onCreate).toHaveBeenCalledWith(N.objectContaining({name:`Tournament`,rosterDefault:i}))}},W={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Edit Training`})),await N(e.queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Track roster`})),await t.type(e.getByLabelText(/People needed in total/),`10`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onUpdate).toHaveBeenCalledWith(`et-2`,N.objectContaining({name:`Training`,rosterDefault:N.objectContaining({trackRoster:!0,totalTarget:10})}))}},G={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Edit Match`}));let r=e.getByLabelText(`Setter`);await t.clear(r),await t.type(r,`0`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onUpdate).toHaveBeenCalledWith(`et-1`,N.objectContaining({rosterDefault:N.objectContaining({positionTargets:[]})}))}},K={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await N(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await N(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(r.getByLabelText(/Move its events/),`et-2`),await t.click(r.getByRole(`button`,{name:`Archive`})),await N(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`)}},q={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await t.click(await r.findByRole(`button`,{name:`Archive`})),await N(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0)}},J={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await N(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await N(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await N(r.getByLabelText(/Move its events/)).toBeInTheDocument(),await N(n.onArchive).not.toHaveBeenCalled()}},Y={args:{eventTypes:[...L,r({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:i})]},play:async({canvas:e,userEvent:t,args:n})=>{await N(e.getByText(`Archived`)).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:`Edit Old Social`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Restore Old Social`})),await N(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},X={args:{errorCode:`EVENT_TYPE_NAME_TAKEN`},play:async({canvas:e})=>{await N(e.getByText(`That event type already exists.`)).toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Match`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(e.queryByLabelText(`Event type name`)).not.toBeInTheDocument()}},Q={args:{errorCode:`FORBIDDEN`},play:async({canvas:e})=>{await N(e.getByText(`You are not allowed to make this change.`)).toBeInTheDocument()}},$={args:{errorCode:`LAST_EVENT_TYPE`},play:async({canvas:e})=>{await N(e.getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load event types. Please try again.")).toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No event types yet. Add one below.')).toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument();
    await expect(canvas.getByText('No roster')).toBeInTheDocument();
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'Edit Training'
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'Edit Match'
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'Archive Match'
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'Archive Match'
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
    await userEvent.click(canvas.getByRole('button', {
      name: 'Archive Match'
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
    await expect(canvas.queryByRole('button', {
      name: 'Edit Old Social'
    })).not.toBeInTheDocument();
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
}`,...$.parameters?.docs?.source}}},ce=[`Loading`,`ErrorState`,`Empty`,`WithTypes`,`CreateEventType`,`EditRosterDefault`,`ZeroTargetMeansNoTarget`,`ArchiveWithMigration`,`ArchiveWithoutMigration`,`ArchiveDialogOpen`,`WithArchivedTypes`,`NameTaken`,`SubmitClosesTheEditorOptimistically`,`UnhandledErrorStillSpeaks`,`LastEventTypeRefused`]})))()}le();export{J as ArchiveDialogOpen,K as ArchiveWithMigration,q as ArchiveWithoutMigration,U as CreateEventType,W as EditRosterDefault,V as Empty,B as ErrorState,$ as LastEventTypeRefused,z as Loading,X as NameTaken,Z as SubmitClosesTheEditorOptimistically,Q as UnhandledErrorStillSpeaks,Y as WithArchivedTypes,H as WithTypes,G as ZeroTargetMeansNoTarget,ce as __namedExportsOrder,R as default};