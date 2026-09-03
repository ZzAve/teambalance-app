import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-S0c8oIbM.js";import{a as n,i as r,r as i,t as a}from"./event-fixtures-GLq-GGnS.js";import{a as o,i as s,n as c,o as l,r as u,t as d}from"./select-O-kWjHfZ.js";import{n as f,t as p}from"./SeriesScopeField-Wjr-odIv.js";import{n as m,t as h}from"./ReferenceRowsEditor-BpAsg6Rz.js";import{t as g}from"./jsx-runtime-DeHZSEgm.js";import{n as _,t as v}from"./button-Cbtiql8F.js";import{n as y,t as b}from"./input-Dd3obFrb.js";import{n as x,t as S}from"./label-Xp4-dqQi.js";import{n as C,t as w}from"./RosterOverrideField-DoYoNwu8.js";import{r as T,t as E}from"./references-IoGSSQVz.js";function D(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function O(e,t){return`${e.slice(0,10)}T${t}`}function k({event:e,siblings:t=[],eventTypes:n=[],positions:r=[],isPending:i,isError:a,onSubmit:l}){let f=t.length>1,[m,g]=(0,A.useState)(`THIS`),_=f&&m!==`THIS`,[y,x]=(0,A.useState)(e.eventType.id),[C,k]=(0,A.useState)(e.title),[M,N]=(0,A.useState)(D(e.startTime)),[P,F]=(0,A.useState)(D(e.endTime)),[I,L]=(0,A.useState)(T(e.references)),[R,z]=(0,A.useState)(e.rosterOverride??void 0),B=n.filter(t=>!t.archived||t.id===e.eventType.id),V=n.find(e=>e.id===y);return(0,j.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);l({id:e.id,scope:m,eventTypeId:y,title:C,description:n.get(`description`)||void 0,startTime:new Date(M).toISOString(),endTime:new Date(P).toISOString(),location:n.get(`location`)||void 0,references:E(I),rosterOverride:R})},className:`flex flex-col gap-4`,children:[f&&(0,j.jsx)(p,{siblings:t,currentId:e.id,scope:m,onScopeChange:g,variant:`edit`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-type`,children:`Type`}),(0,j.jsxs)(d,{value:y,onValueChange:x,children:[(0,j.jsx)(s,{id:`edit-type`,children:(0,j.jsx)(o,{placeholder:`Select type`})}),(0,j.jsx)(c,{children:B.map(e=>(0,j.jsx)(u,{value:e.id,children:(0,j.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,j.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-title`,children:`Title`}),(0,j.jsx)(b,{id:`edit-title`,required:!0,value:C,onChange:e=>k(e.target.value)})]}),_?(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-start-time`,children:`Start time`}),(0,j.jsx)(b,{id:`edit-start-time`,type:`time`,required:!0,value:M.slice(11,16),onChange:e=>N(t=>O(t,e.target.value))})]}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-end-time`,children:`End time`}),(0,j.jsx)(b,{id:`edit-end-time`,type:`time`,required:!0,value:P.slice(11,16),onChange:e=>F(t=>O(t,e.target.value))})]})]}):(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-start`,children:`Start time`}),(0,j.jsx)(b,{id:`edit-start`,type:`datetime-local`,required:!0,value:M,onChange:e=>N(e.target.value)})]}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-end`,children:`End time`}),(0,j.jsx)(b,{id:`edit-end`,type:`datetime-local`,required:!0,value:P,onChange:e=>F(e.target.value)})]})]}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,j.jsx)(b,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(S,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,j.jsx)(b,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,j.jsx)(h,{rows:I,onChange:L}),(0,j.jsx)(w,{value:R,eventType:V,positions:r,disabled:i,onChange:z}),a&&(0,j.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red`,children:`Could not save changes. Please try again.`}),(0,j.jsx)(v,{type:`submit`,disabled:i,children:i?`Saving…`:`Save changes`})]})}var A,j;function M(){return(M=e((()=>{A=t(),_(),y(),x(),l(),C(),m(),f(),j=g(),k.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, so a customised roster can be authored per position.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{i(),M(),{expect:N,fn:P}=__STORYBOOK_MODULE_TEST__,F=[n({id:`et-1`,name:`Training`,color:`#22c55e`}),n({id:`et-2`,name:`Match`,color:`#3b82f6`})],I={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],myState:`NOT_RESPONDED`,rosterOverride:void 0,roster:a},L=[r({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],R={title:`features/edit-event/EditEventDialogView`,component:k,args:{event:I,eventTypes:F,onSubmit:P()}},z={play:async({canvas:e,userEvent:t,args:n})=>{await N(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await N(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Save changes`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`}))}},B={args:{siblings:L},play:async({canvas:e})=>{await N(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await N(e.getByText(`Affects 1 of 3 events`)).toBeInTheDocument()}},V={parameters:{chromatic:{disableSnapshot:!0}},args:{event:{...I,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Title`);await t.clear(r),await t.type(r,`Renamed Training`),await t.click(e.getByRole(`button`,{name:`Save changes`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({title:`Renamed Training`,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}))}},H={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Save changes`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({rosterOverride:void 0}))}},U={args:{isPending:!0},play:async({canvas:e})=>{await N(e.getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},W={args:{isError:!0},play:async({canvas:e})=>{await N(e.getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Standalone — the roster-override carry is a callback assertion; the filled
  // edit-form picture ≈ Standalone (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Standalone — asserts onSave gets \`rosterOverride: undefined\`; the picture
  // settles back to Standalone (ADR-0027 §2).
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
      name: 'Save changes'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      rosterOverride: undefined
    }));
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument();
  }
}`,...W.parameters?.docs?.source}}},G=[`Standalone`,`Series`,`CarriesRosterOverrideThroughAnUnrelatedEdit`,`KeepsAnInheritingEventInheriting`,`Saving`,`ErrorState`]})))()}K();export{V as CarriesRosterOverrideThroughAnUnrelatedEdit,W as ErrorState,H as KeepsAnInheritingEventInheriting,U as Saving,B as Series,z as Standalone,G as __namedExportsOrder,R as default};