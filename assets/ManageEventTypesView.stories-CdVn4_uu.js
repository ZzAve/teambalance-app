import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ugXzxNVs.js";import{a as n,n as r,r as i}from"./event-fixtures-GLq-GGnS.js";import{n as a,t as o}from"./createLucideIcon-BfWitaxa.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./button-DxgScssa.js";import{n as ee,t as te}from"./input-DJjXKjo3.js";import{i as u,n as ne,r as re}from"./roster-default-summary-CvRlB7-s.js";import{a as d,i as f,n as p,o as m,r as h,s as g,t as _}from"./dialog-guC8vNDj.js";var v,y;function b(){return(b=e((()=>{a(),v=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h2`,key:`tvwodi`}],[`path`,{d:`M20 8v11a2 2 0 0 1-2 2h-2`,key:`1gkqxj`}],[`path`,{d:`m9 15 3-3 3 3`,key:`1pd0qc`}],[`path`,{d:`M12 12v9`,key:`192myk`}]],y=o(`archive-restore`,v)})))()}var x,S;function C(){return(C=e((()=>{a(),x=[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8`,key:`1s80jp`}],[`path`,{d:`M10 12h4`,key:`a56b0p`}]],S=o(`archive`,x)})))()}var w,T;function E(){return(E=e((()=>{a(),w=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],T=o(`pencil`,w)})))()}function ie(e){return e.hasDraft&&(!e.submitted||!!e.errorCode)}function D({eventTypes:e=[],positions:t=[],isLoading:n,isError:r,isSaving:i,errorCode:a,onCreate:o,onUpdate:s,onArchive:c,onUnarchive:ee}){let[u,d]=(0,O.useState)(null),[f,p]=(0,O.useState)(null),[m,h]=(0,O.useState)(null),[g,_]=(0,O.useState)(!1),v=e.filter(e=>!e.archived),b=e.filter(e=>e.archived),x=()=>{d(`new`),p({name:``,color:A[0],rosterDefault:oe}),_(!1)},C=e=>{d(e.id),p({name:e.name,color:e.color,rosterDefault:e.rosterDefault}),_(!1)},w=()=>{d(null),p(null),_(!1)},E=ie({hasDraft:f!==null,submitted:g,errorCode:a});return(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Event types`}),(0,k.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Each type carries the roster an event of that kind needs. Events follow their type unless you give one its own.`}),n&&(0,k.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),r&&(0,k.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load event types. Please try again.`}),!n&&!r&&(0,k.jsxs)(`div`,{className:`mt-4 flex flex-col gap-3`,children:[a&&(0,k.jsx)(`p`,{className:`text-sm text-red`,children:j[a]??se}),v.length===0?(0,k.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No event types yet. Add one below.`}):(0,k.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:v.map(e=>(0,k.jsxs)(`li`,{className:`flex flex-wrap items-center gap-2 p-3`,children:[(0,k.jsx)(`span`,{"aria-hidden":!0,className:`size-3 shrink-0 rounded-full`,style:{background:e.color??`#94A3B8`}}),(0,k.jsx)(`span`,{className:`text-sm font-semibold`,children:e.name}),(0,k.jsx)(`span`,{className:`text-[11.5px] text-muted-foreground`,children:ne(e.rosterDefault,t)}),(0,k.jsxs)(`div`,{className:`ml-auto flex gap-2`,children:[(0,k.jsxs)(l,{variant:`outline`,size:`sm`,disabled:i,onClick:()=>C(e),"aria-label":`Edit ${e.name}`,children:[(0,k.jsx)(T,{size:14}),`Edit`]}),(0,k.jsxs)(l,{variant:`destructive`,size:`sm`,disabled:i,onClick:()=>h(e),"aria-label":`Archive ${e.name}`,children:[(0,k.jsx)(S,{size:14}),`Archive`]})]})]},e.id))}),!E&&(0,k.jsx)(l,{className:`self-start`,disabled:i,onClick:x,children:`Add event type`}),E&&f&&(0,k.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border border-border p-3`,children:[(0,k.jsx)(`h3`,{className:`text-sm font-semibold`,children:u===`new`?`New event type`:`Edit event type`}),(0,k.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,k.jsx)(te,{"aria-label":`Event type name`,className:`w-48`,value:f.name,placeholder:`e.g. Match`,onChange:e=>p({...f,name:e.target.value})}),(0,k.jsx)(`div`,{className:`flex gap-1.5`,role:`radiogroup`,"aria-label":`Colour`,children:A.map(e=>(0,k.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":f.color===e,"aria-label":`Colour ${e}`,onClick:()=>p({...f,color:e}),style:{background:e},className:`size-6 rounded-full ring-offset-background transition-transform ${f.color===e?`ring-2 ring-foreground ring-offset-2`:``}`},e))})]}),(0,k.jsx)(re,{idPrefix:`type-default`,value:f.rosterDefault,positions:t,disabled:i,onChange:e=>p({...f,rosterDefault:e})}),(0,k.jsxs)(`div`,{className:`flex gap-2`,children:[(0,k.jsx)(l,{disabled:i||f.name.trim().length===0,onClick:()=>{if(!f||f.name.trim().length===0)return;let e={...f,name:f.name.trim()};u===`new`?o(e):u&&s(u,e),_(!0)},children:`Save`}),(0,k.jsx)(l,{variant:`outline`,disabled:i,onClick:w,children:`Cancel`})]})]}),b.length>0&&(0,k.jsxs)(`div`,{className:`mt-2`,children:[(0,k.jsx)(`h3`,{className:`text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Archived`}),(0,k.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-dashed border-border`,children:b.map(e=>(0,k.jsxs)(`li`,{className:`flex items-center gap-2 p-3`,children:[(0,k.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:e.name}),(0,k.jsxs)(l,{variant:`outline`,size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>ee(e.id),"aria-label":`Restore ${e.name}`,children:[(0,k.jsx)(y,{size:14}),`Restore`]})]},e.id))})]})]}),(0,k.jsx)(ae,{target:m,alternatives:v.filter(e=>e.id!==m?.id),isSaving:i,onCancel:()=>h(null),onConfirm:(e,t)=>{c(e,t),h(null)}})]})}function ae({target:e,alternatives:t,isSaving:n,onCancel:r,onConfirm:i}){let[a,o]=(0,O.useState)(``);return(0,k.jsx)(_,{open:e!==null,onOpenChange:e=>{e||(o(``),r())},children:(0,k.jsxs)(p,{children:[(0,k.jsxs)(d,{children:[(0,k.jsxs)(m,{children:[`Archive "`,e?.name,`"?`]}),(0,k.jsx)(h,{children:`It disappears from the event pickers. Existing events keep this type and still show — no event is deleted.`})]}),t.length>0&&(0,k.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,k.jsx)(`label`,{htmlFor:`migrate-to`,className:`text-[13px] font-semibold`,children:`Move its events to another type first?`}),(0,k.jsxs)(`select`,{id:`migrate-to`,className:`rounded-md border border-input bg-transparent px-3 py-2 text-sm`,value:a,onChange:e=>o(e.target.value),children:[(0,k.jsxs)(`option`,{value:``,children:[`Leave them on "`,e?.name,`"`]}),t.map(e=>(0,k.jsxs)(`option`,{value:e.id,children:[`Move to `,e.name]},e.id))]})]}),(0,k.jsxs)(f,{children:[(0,k.jsx)(l,{variant:`outline`,onClick:()=>{o(``),r()},children:`Cancel`}),(0,k.jsx)(l,{variant:`destructive`,disabled:n,onClick:()=>{e&&i(e.id,a||void 0),o(``)},children:`Archive`})]})]})})}var O,k,oe,A,se,j;function M(){return(M=e((()=>{O=t(),C(),b(),E(),c(),ee(),g(),u(),k=s(),oe={trackRoster:!1,totalTarget:void 0,positionTargets:[]},A=[`#225C9C`,`#249E6C`,`#F4B400`,`#7B5EA7`,`#E87C3E`,`#D93025`],se=`Something went wrong. Please try again.`,j={EVENT_TYPE_NAME_TAKEN:`That event type already exists.`,LAST_EVENT_TYPE:`A team must keep at least one active event type.`,INVALID_REQUEST:`That didn't work — check the name and roster, then try again.`,FORBIDDEN:`You are not allowed to make this change.`,NOT_FOUND:`That event type no longer exists. Reload and try again.`},D.__docgenInfo={description:`Presentational event-type management — the whole section, heading and all.

Owns only local view state (which type is being edited, the draft in the form, the archive
dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
container. The load/error shells are props-driven so every state is a story with no network
(ADR-0017).`,methods:[],displayName:`ManageEventTypesView`,props:{eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline.`},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, draft: EventTypeDraft) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`EventTypeDraft`},name:`draft`}],return:{name:`void`}}},description:``},onArchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, migrateEventsTo?: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`string`},name:`migrateEventsTo`}],return:{name:`void`}}},description:``},onUnarchive:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``}}}})))()}var N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,ce;function le(){return(le=e((()=>{i(),M(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=[{id:`p1`,label:`Setter`},{id:`p2`,label:`Libero`}],L=[n({id:`et-1`,name:`Match`,color:`#225C9C`,rosterDefault:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`p1`,count:2}]}}),n({id:`et-2`,name:`Training`,color:`#249E6C`,rosterDefault:r})],R={title:`features/manage-event-types/ManageEventTypesView`,component:D,args:{eventTypes:L,positions:I,onCreate:P(),onUpdate:P(),onArchive:P(),onUnarchive:P()}},z={args:{isLoading:!0},play:async({canvas:e})=>{await N(e.getByText(`Loading…`)).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:`Add event type`})).not.toBeInTheDocument()}},B={args:{isError:!0},play:async({canvas:e})=>{await N(e.getByText(`Couldn't load event types. Please try again.`)).toBeInTheDocument()}},V={args:{eventTypes:[]},play:async({canvas:e})=>{await N(e.getByText(`No event types yet. Add one below.`)).toBeInTheDocument()}},H={play:async({canvas:e})=>{await N(e.getByText(`Match`)).toBeInTheDocument(),await N(e.getByText(`2 Setter · 12 total`)).toBeInTheDocument(),await N(e.getByText(`No roster`)).toBeInTheDocument()}},U={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Tournament`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onCreate).toHaveBeenCalledWith(N.objectContaining({name:`Tournament`,rosterDefault:r}))}},W={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Edit Training`})),await N(e.queryByLabelText(`People needed in total`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Track roster`})),await t.type(e.getByLabelText(/People needed in total/),`10`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onUpdate).toHaveBeenCalledWith(`et-2`,N.objectContaining({name:`Training`,rosterDefault:N.objectContaining({trackRoster:!0,totalTarget:10})}))}},G={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Edit Match`}));let r=e.getByLabelText(`Setter`);await t.clear(r),await t.type(r,`0`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(n.onUpdate).toHaveBeenCalledWith(`et-1`,N.objectContaining({rosterDefault:N.objectContaining({positionTargets:[]})}))}},K={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await N(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await N(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await t.selectOptions(r.getByLabelText(/Move its events/),`et-2`),await t.click(r.getByRole(`button`,{name:`Archive`})),await N(n.onArchive).toHaveBeenCalledWith(`et-1`,`et-2`)}},q={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await t.click(await r.findByRole(`button`,{name:`Archive`})),await N(n.onArchive).toHaveBeenCalledWith(`et-1`,void 0)}},J={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Archive Match`}));let r=F(document.body);await N(await r.findByText(`Archive "Match"?`)).toBeInTheDocument(),await N(r.getByText(/no event is deleted/i)).toBeInTheDocument(),await N(r.getByLabelText(/Move its events/)).toBeInTheDocument(),await N(n.onArchive).not.toHaveBeenCalled()}},Y={args:{eventTypes:[...L,n({id:`et-3`,name:`Old Social`,archived:!0,rosterDefault:r})]},play:async({canvas:e,userEvent:t,args:n})=>{await N(e.getByText(`Archived`)).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:`Edit Old Social`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Restore Old Social`})),await N(n.onUnarchive).toHaveBeenCalledWith(`et-3`)}},X={args:{errorCode:`EVENT_TYPE_NAME_TAKEN`},play:async({canvas:e})=>{await N(e.getByText(`That event type already exists.`)).toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},args:{eventTypes:[]},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Add event type`})),await t.type(e.getByLabelText(`Event type name`),`Match`),await t.click(e.getByRole(`button`,{name:`Save`})),await N(e.queryByLabelText(`Event type name`)).not.toBeInTheDocument()}},Q={args:{errorCode:`FORBIDDEN`},play:async({canvas:e})=>{await N(e.getByText(`You are not allowed to make this change.`)).toBeInTheDocument()}},$={args:{errorCode:`LAST_EVENT_TYPE`},play:async({canvas:e})=>{await N(e.getByText(`A team must keep at least one active event type.`)).toBeInTheDocument()}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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