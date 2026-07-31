import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BXclvPvy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{n as i,t as a}from"./event-fixtures-CKCzWaqm.js";import{n as o,t as s}from"./button-BHtExP71.js";import{n as c,t as l}from"./input-BSXte1aw.js";import{n as u,t as d}from"./label-B6iEqIuF.js";import{n as f,t as p}from"./ReferenceRowsEditor-BATJLo6x.js";import{a as m,i as h,n as g,o as _,r as v,t as y}from"./select-BtN_h-6P.js";import{n as b,r as x,t as S}from"./references-BQqvxJXp.js";import{n as C,t as w}from"./SeriesScopeField-BJ2roWuR.js";function T(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function E(e,t){return`${e.slice(0,10)}T${t}`}function D({event:e,siblings:t=[],eventTypes:n=[],isPending:r,isError:i,onSubmit:a}){let o=t.length>1,[c,u]=(0,O.useState)(`THIS`),f=o&&c!==`THIS`,[_,b]=(0,O.useState)(e.eventType.id),[C,D]=(0,O.useState)(e.title),[A,j]=(0,O.useState)(T(e.startTime)),[M,N]=(0,O.useState)(T(e.endTime)),[P,F]=(0,O.useState)(x(e.references));return(0,k.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);a({id:e.id,scope:c,eventTypeId:_,title:C,description:n.get(`description`)||void 0,startTime:new Date(A).toISOString(),endTime:new Date(M).toISOString(),location:n.get(`location`)||void 0,references:S(P)})},className:`flex flex-col gap-4`,children:[o&&(0,k.jsx)(w,{siblings:t,currentId:e.id,scope:c,onScopeChange:u,variant:`edit`}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-type`,children:`Type`}),(0,k.jsxs)(y,{value:_,onValueChange:b,children:[(0,k.jsx)(h,{id:`edit-type`,children:(0,k.jsx)(m,{placeholder:`Select type`})}),(0,k.jsx)(g,{children:n.map(e=>(0,k.jsx)(v,{value:e.id,children:(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-title`,children:`Title`}),(0,k.jsx)(l,{id:`edit-title`,required:!0,value:C,onChange:e=>D(e.target.value)})]}),f?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-start-time`,children:`Start time`}),(0,k.jsx)(l,{id:`edit-start-time`,type:`time`,required:!0,value:A.slice(11,16),onChange:e=>j(t=>E(t,e.target.value))})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-end-time`,children:`End time`}),(0,k.jsx)(l,{id:`edit-end-time`,type:`time`,required:!0,value:M.slice(11,16),onChange:e=>N(t=>E(t,e.target.value))})]})]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-start`,children:`Start time`}),(0,k.jsx)(l,{id:`edit-start`,type:`datetime-local`,required:!0,value:A,onChange:e=>j(e.target.value)})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-end`,children:`End time`}),(0,k.jsx)(l,{id:`edit-end`,type:`datetime-local`,required:!0,value:M,onChange:e=>N(e.target.value)})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,k.jsx)(l,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(d,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,k.jsx)(l,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,k.jsx)(p,{rows:P,onChange:F}),i&&(0,k.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:`Could not save changes. Please try again.`}),(0,k.jsx)(s,{type:`submit`,disabled:r,children:r?`Saving…`:`Save changes`})]})}var O,k,A=e((()=>{O=t(n(),1),o(),c(),u(),_(),f(),b(),C(),k=r(),D.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})),j,M,N,P,F,I,L,R,z,B,V;e((()=>{a(),A(),{expect:j,fn:M}=__STORYBOOK_MODULE_TEST__,N=[{id:`et-1`,name:`Training`,color:`#22c55e`},{id:`et-2`,name:`Match`,color:`#3b82f6`}],P={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[]},F=[i({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],I={title:`features/edit-event/EditEventDialogView`,component:D,args:{event:P,eventTypes:N,onSubmit:M()}},L={play:async({canvas:e,userEvent:t,args:n})=>{await j(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await j(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save changes`})),await j(n.onSubmit).toHaveBeenCalledWith(j.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`}))}},R={args:{siblings:F},play:async({canvas:e})=>{await j(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await j(e.getByText(`Affects 1 of 3 events`)).toBeInTheDocument()}},z={args:{isPending:!0},play:async({canvas:e})=>{await j(e.getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},B={args:{isError:!0},play:async({canvas:e})=>{await j(e.getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V=[`Standalone`,`Series`,`Saving`,`ErrorState`]}))();export{B as ErrorState,z as Saving,R as Series,L as Standalone,V as __namedExportsOrder,I as default};