import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-C1LAqUz3.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r}from"./event-fixtures-BaYeuP-I.js";import{a as i,i as a,n as o,o as s,r as c,t as l}from"./select-DMZogGKp.js";import{n as u,t as d}from"./SeriesScopeField-0C5_Z3d0.js";import{n as f,t as p}from"./ReferenceRowsEditor-BBM6WpS1.js";import{n as m,t as h}from"./button-B_IWRLXn.js";import{n as g,t as _}from"./input-Ky9GUfNf.js";import{n as v,t as y}from"./label-C3AbKUQM.js";import{r as b,t as x}from"./references-IoGSSQVz.js";function S(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function C(e,t){return`${e.slice(0,10)}T${t}`}function w({event:e,siblings:t=[],eventTypes:n=[],isPending:r,isError:s,onSubmit:u}){let f=t.length>1,[m,g]=(0,T.useState)(`THIS`),v=f&&m!==`THIS`,[w,D]=(0,T.useState)(e.eventType.id),[O,k]=(0,T.useState)(e.title),[A,j]=(0,T.useState)(S(e.startTime)),[M,N]=(0,T.useState)(S(e.endTime)),[P,F]=(0,T.useState)(b(e.references));return(0,E.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);u({id:e.id,scope:m,eventTypeId:w,title:O,description:n.get(`description`)||void 0,startTime:new Date(A).toISOString(),endTime:new Date(M).toISOString(),location:n.get(`location`)||void 0,references:x(P)})},className:`flex flex-col gap-4`,children:[f&&(0,E.jsx)(d,{siblings:t,currentId:e.id,scope:m,onScopeChange:g,variant:`edit`}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-type`,children:`Type`}),(0,E.jsxs)(l,{value:w,onValueChange:D,children:[(0,E.jsx)(a,{id:`edit-type`,children:(0,E.jsx)(i,{placeholder:`Select type`})}),(0,E.jsx)(o,{children:n.map(e=>(0,E.jsx)(c,{value:e.id,children:(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-title`,children:`Title`}),(0,E.jsx)(_,{id:`edit-title`,required:!0,value:O,onChange:e=>k(e.target.value)})]}),v?(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-start-time`,children:`Start time`}),(0,E.jsx)(_,{id:`edit-start-time`,type:`time`,required:!0,value:A.slice(11,16),onChange:e=>j(t=>C(t,e.target.value))})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-end-time`,children:`End time`}),(0,E.jsx)(_,{id:`edit-end-time`,type:`time`,required:!0,value:M.slice(11,16),onChange:e=>N(t=>C(t,e.target.value))})]})]}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-start`,children:`Start time`}),(0,E.jsx)(_,{id:`edit-start`,type:`datetime-local`,required:!0,value:A,onChange:e=>j(e.target.value)})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-end`,children:`End time`}),(0,E.jsx)(_,{id:`edit-end`,type:`datetime-local`,required:!0,value:M,onChange:e=>N(e.target.value)})]})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,E.jsx)(_,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(y,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,E.jsx)(_,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,E.jsx)(p,{rows:P,onChange:F}),s&&(0,E.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:`Could not save changes. Please try again.`}),(0,E.jsx)(h,{type:`submit`,disabled:r,children:r?`Saving…`:`Save changes`})]})}var T,E;function D(){return(D=e((()=>{T=t(),m(),g(),v(),s(),f(),u(),E=n(),w.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{D(),{expect:O,fn:k}=__STORYBOOK_MODULE_TEST__,A=[{id:`et-1`,name:`Training`,color:`#22c55e`},{id:`et-2`,name:`Match`,color:`#3b82f6`}],j={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],myState:`NOT_RESPONDED`},M=[r({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],N={title:`features/edit-event/EditEventDialogView`,component:w,args:{event:j,eventTypes:A,onSubmit:k()}},P={play:async({canvas:e,userEvent:t,args:n})=>{await O(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await O(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save changes`})),await O(n.onSubmit).toHaveBeenCalledWith(O.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`}))}},F={args:{siblings:M},play:async({canvas:e})=>{await O(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await O(e.getByText(`Affects 1 of 3 events`)).toBeInTheDocument()}},I={args:{isPending:!0},play:async({canvas:e})=>{await O(e.getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},L={args:{isError:!0},play:async({canvas:e})=>{await O(e.getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByLabelText('Title')).toHaveValue('Tuesday Training');
    await expect(canvas.queryByRole('group', {
      name: 'Scope'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save changes'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      id: 'evt-1',
      scope: 'THIS',
      eventTypeId: 'et-1',
      title: 'Tuesday Training'
    }));
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    siblings: SIBLINGS
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('group', {
      name: 'Scope'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Affects 1 of 3 events')).toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Saving…'
    })).toBeDisabled();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R=[`Standalone`,`Series`,`Saving`,`ErrorState`]})))()}z();export{L as ErrorState,I as Saving,F as Series,P as Standalone,R as __namedExportsOrder,N as default};