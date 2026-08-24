import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-B9fC39f8.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,r as i,t as a}from"./event-fixtures-zk5yUMAb.js";import{a as o,i as s,n as c,o as l,r as u,t as d}from"./select-B5GDYr3E.js";import{n as f,t as p}from"./SeriesScopeField-CY5Eq9H7.js";import{n as m,t as h}from"./ReferenceRowsEditor-DUTEIryA.js";import{n as g,t as _}from"./button-ClYieOjE.js";import{n as v,t as y}from"./input-DhVZ2Qj5.js";import{n as b,t as x}from"./label-uoI3y570.js";import{r as S,t as C}from"./references-IoGSSQVz.js";function w(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function T(e,t){return`${e.slice(0,10)}T${t}`}function E({event:e,siblings:t=[],eventTypes:n=[],isPending:r,isError:i,onSubmit:a}){let l=t.length>1,[f,m]=(0,D.useState)(`THIS`),g=l&&f!==`THIS`,[v,b]=(0,D.useState)(e.eventType.id),[E,k]=(0,D.useState)(e.title),[A,j]=(0,D.useState)(w(e.startTime)),[M,N]=(0,D.useState)(w(e.endTime)),[P,F]=(0,D.useState)(S(e.references));return(0,O.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);a({id:e.id,scope:f,eventTypeId:v,title:E,description:n.get(`description`)||void 0,startTime:new Date(A).toISOString(),endTime:new Date(M).toISOString(),location:n.get(`location`)||void 0,references:C(P),rosterOverride:e.rosterOverride})},className:`flex flex-col gap-4`,children:[l&&(0,O.jsx)(p,{siblings:t,currentId:e.id,scope:f,onScopeChange:m,variant:`edit`}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-type`,children:`Type`}),(0,O.jsxs)(d,{value:v,onValueChange:b,children:[(0,O.jsx)(s,{id:`edit-type`,children:(0,O.jsx)(o,{placeholder:`Select type`})}),(0,O.jsx)(c,{children:n.map(e=>(0,O.jsx)(u,{value:e.id,children:(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,O.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-title`,children:`Title`}),(0,O.jsx)(y,{id:`edit-title`,required:!0,value:E,onChange:e=>k(e.target.value)})]}),g?(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-start-time`,children:`Start time`}),(0,O.jsx)(y,{id:`edit-start-time`,type:`time`,required:!0,value:A.slice(11,16),onChange:e=>j(t=>T(t,e.target.value))})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-end-time`,children:`End time`}),(0,O.jsx)(y,{id:`edit-end-time`,type:`time`,required:!0,value:M.slice(11,16),onChange:e=>N(t=>T(t,e.target.value))})]})]}):(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-start`,children:`Start time`}),(0,O.jsx)(y,{id:`edit-start`,type:`datetime-local`,required:!0,value:A,onChange:e=>j(e.target.value)})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-end`,children:`End time`}),(0,O.jsx)(y,{id:`edit-end`,type:`datetime-local`,required:!0,value:M,onChange:e=>N(e.target.value)})]})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,O.jsx)(y,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(x,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,O.jsx)(y,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,O.jsx)(h,{rows:P,onChange:F}),i&&(0,O.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red`,children:`Could not save changes. Please try again.`}),(0,O.jsx)(_,{type:`submit`,disabled:r,children:r?`Saving…`:`Save changes`})]})}var D,O;function k(){return(k=e((()=>{D=t(),g(),v(),b(),l(),m(),f(),O=n(),E.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{a(),k(),{expect:A,fn:j}=__STORYBOOK_MODULE_TEST__,M=[i({id:`et-1`,name:`Training`,color:`#22c55e`}),i({id:`et-2`,name:`Match`,color:`#3b82f6`})],N={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],myState:`NOT_RESPONDED`,rosterOverride:void 0},P=[r({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],F={title:`features/edit-event/EditEventDialogView`,component:E,args:{event:N,eventTypes:M,onSubmit:j()}},I={play:async({canvas:e,userEvent:t,args:n})=>{await A(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await A(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save changes`})),await A(n.onSubmit).toHaveBeenCalledWith(A.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`}))}},L={args:{siblings:P},play:async({canvas:e})=>{await A(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await A(e.getByText(`Affects 1 of 3 events`)).toBeInTheDocument()}},R={args:{event:{...N,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Title`);await t.clear(r),await t.type(r,`Renamed Training`),await t.click(e.getByRole(`button`,{name:`Save changes`})),await A(n.onSubmit).toHaveBeenCalledWith(A.objectContaining({title:`Renamed Training`,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}))}},z={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Save changes`})),await A(n.onSubmit).toHaveBeenCalledWith(A.objectContaining({rosterOverride:void 0}))}},B={args:{isPending:!0},play:async({canvas:e})=>{await A(e.getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},V={args:{isError:!0},play:async({canvas:e})=>{await A(e.getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    event: {
      ...EVENT,
      rosterOverride: {
        trackRoster: true,
        totalTarget: 12,
        positionTargets: [{
          positionId: 'pos-setter',
          count: 2
        }]
      }
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const title = canvas.getByLabelText('Title');
    await userEvent.clear(title);
    await userEvent.type(title, 'Renamed Training');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save changes'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Renamed Training',
      rosterOverride: {
        trackRoster: true,
        totalTarget: 12,
        positionTargets: [{
          positionId: 'pos-setter',
          count: 2
        }]
      }
    }));
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save changes'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      rosterOverride: undefined
    }));
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H=[`Standalone`,`Series`,`CarriesRosterOverrideThroughAnUnrelatedEdit`,`KeepsAnInheritingEventInheriting`,`Saving`,`ErrorState`]})))()}U();export{R as CarriesRosterOverrideThroughAnUnrelatedEdit,V as ErrorState,z as KeepsAnInheritingEventInheriting,B as Saving,L as Series,I as Standalone,H as __namedExportsOrder,F as default};