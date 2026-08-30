import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CT8xQblw.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{i as r,n as i,r as a,t as o}from"./event-fixtures-HgN_WguE.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./select-D2fZzaJG.js";import{n as p,t as m}from"./SeriesScopeField-Bc2NXC8R.js";import{n as h,t as g}from"./ReferenceRowsEditor-bZhWurzv.js";import{n as _,t as v}from"./button-BWU7206k.js";import{n as y,t as b}from"./input-D2SQEg1T.js";import{n as x,t as S}from"./label-DLi1WXBK.js";import{r as C,t as w}from"./references-IoGSSQVz.js";function T(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function E(e,t){return`${e.slice(0,10)}T${t}`}function D({event:e,siblings:t=[],eventTypes:n=[],isPending:r,isError:i,onSubmit:a}){let o=t.length>1,[u,p]=(0,O.useState)(`THIS`),h=o&&u!==`THIS`,[_,y]=(0,O.useState)(e.eventType.id),[x,D]=(0,O.useState)(e.title),[A,j]=(0,O.useState)(T(e.startTime)),[M,N]=(0,O.useState)(T(e.endTime)),[P,F]=(0,O.useState)(C(e.references));return(0,k.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);a({id:e.id,scope:u,eventTypeId:_,title:x,description:n.get(`description`)||void 0,startTime:new Date(A).toISOString(),endTime:new Date(M).toISOString(),location:n.get(`location`)||void 0,references:w(P),rosterOverride:e.rosterOverride})},className:`flex flex-col gap-4`,children:[o&&(0,k.jsx)(m,{siblings:t,currentId:e.id,scope:u,onScopeChange:p,variant:`edit`}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-type`,children:`Type`}),(0,k.jsxs)(f,{value:_,onValueChange:y,children:[(0,k.jsx)(c,{id:`edit-type`,children:(0,k.jsx)(s,{placeholder:`Select type`})}),(0,k.jsx)(l,{children:n.map(e=>(0,k.jsx)(d,{value:e.id,children:(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-title`,children:`Title`}),(0,k.jsx)(b,{id:`edit-title`,required:!0,value:x,onChange:e=>D(e.target.value)})]}),h?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-start-time`,children:`Start time`}),(0,k.jsx)(b,{id:`edit-start-time`,type:`time`,required:!0,value:A.slice(11,16),onChange:e=>j(t=>E(t,e.target.value))})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-end-time`,children:`End time`}),(0,k.jsx)(b,{id:`edit-end-time`,type:`time`,required:!0,value:M.slice(11,16),onChange:e=>N(t=>E(t,e.target.value))})]})]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-start`,children:`Start time`}),(0,k.jsx)(b,{id:`edit-start`,type:`datetime-local`,required:!0,value:A,onChange:e=>j(e.target.value)})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-end`,children:`End time`}),(0,k.jsx)(b,{id:`edit-end`,type:`datetime-local`,required:!0,value:M,onChange:e=>N(e.target.value)})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,k.jsx)(b,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(S,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,k.jsx)(b,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,k.jsx)(g,{rows:P,onChange:F}),i&&(0,k.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red`,children:`Could not save changes. Please try again.`}),(0,k.jsx)(v,{type:`submit`,disabled:r,children:r?`Saving…`:`Save changes`})]})}var O,k;function A(){return(A=e((()=>{O=t(),_(),y(),x(),u(),h(),p(),k=n(),D.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{i(),A(),{expect:j,fn:M}=__STORYBOOK_MODULE_TEST__,N=[r({id:`et-1`,name:`Training`,color:`#22c55e`}),r({id:`et-2`,name:`Match`,color:`#3b82f6`})],P={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],myState:`NOT_RESPONDED`,rosterOverride:void 0,roster:o},F=[a({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],I={title:`features/edit-event/EditEventDialogView`,component:D,args:{event:P,eventTypes:N,onSubmit:M()}},L={play:async({canvas:e,userEvent:t,args:n})=>{await j(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await j(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save changes`})),await j(n.onSubmit).toHaveBeenCalledWith(j.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`}))}},R={args:{siblings:F},play:async({canvas:e})=>{await j(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await j(e.getByText(`Affects 1 of 3 events`)).toBeInTheDocument()}},z={args:{event:{...P,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Title`);await t.clear(r),await t.type(r,`Renamed Training`),await t.click(e.getByRole(`button`,{name:`Save changes`})),await j(n.onSubmit).toHaveBeenCalledWith(j.objectContaining({title:`Renamed Training`,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}))}},B={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Save changes`})),await j(n.onSubmit).toHaveBeenCalledWith(j.objectContaining({rosterOverride:void 0}))}},V={args:{isPending:!0},play:async({canvas:e})=>{await j(e.getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},H={args:{isError:!0},play:async({canvas:e})=>{await j(e.getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument();
  }
}`,...H.parameters?.docs?.source}}},U=[`Standalone`,`Series`,`CarriesRosterOverrideThroughAnUnrelatedEdit`,`KeepsAnInheritingEventInheriting`,`Saving`,`ErrorState`]})))()}W();export{z as CarriesRosterOverrideThroughAnUnrelatedEdit,H as ErrorState,B as KeepsAnInheritingEventInheriting,V as Saving,R as Series,L as Standalone,U as __namedExportsOrder,I as default};