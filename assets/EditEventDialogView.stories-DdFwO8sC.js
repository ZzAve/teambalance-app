import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BrFaSCbD.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{a,o,r as s,t as c}from"./event-fixtures-C1ds5yXh.js";import{n as l,t as u}from"./SeriesScopeField-BVHNauwh.js";import{n as d,t as f}from"./button-DiHOr_jB.js";import{n as p,t as m}from"./input-6TZ-Y2R_.js";import{n as h,t as g}from"./label-CZZAVSyn.js";import{n as _,t as v}from"./ReferenceRowsEditor-DRPWl7ff.js";import{a as y,i as b,r as x,t as S}from"./references-DKZq0AZz.js";import{n as C,t as w}from"./RosterOverrideField-AtqOo6Tq.js";function T(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function E(e,t){return`${e.slice(0,10)}T${t}`}function D({event:e,siblings:t=[],eventTypes:n=[],positions:r=[],isPending:i,isError:a,onSubmit:o}){let s=t.length>1,[c,l]=(0,k.useState)(`THIS`),d=s&&c!==`THIS`,[p,h]=(0,k.useState)(e.eventType.id),[_,y]=(0,k.useState)(e.title),[C,D]=(0,k.useState)(T(e.startTime)),[j,M]=(0,k.useState)(T(e.endTime)),[N,P]=(0,k.useState)(x(e.references)),[F,I]=(0,k.useState)(e.rosterOverride??void 0),L=n.filter(t=>!t.archived||t.id===e.eventType.id),R=n.find(e=>e.id===p);return(0,A.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);o({id:e.id,scope:c,eventTypeId:p,title:_,description:n.get(`description`)||void 0,startTime:new Date(C).toISOString(),endTime:new Date(j).toISOString(),location:n.get(`location`)||void 0,references:S(N),rosterOverride:F})},className:`flex flex-col gap-4`,children:[s&&(0,A.jsx)(u,{siblings:t,currentId:e.id,scope:c,onScopeChange:l,variant:`edit`}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(g,{htmlFor:`edit-type`,children:`Type`}),(0,A.jsx)(b,{id:`edit-type`,eventTypes:L,value:p,onValueChange:h})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(g,{htmlFor:`edit-title`,children:`Title`}),(0,A.jsx)(m,{id:`edit-title`,required:!0,value:_,onChange:e=>y(e.target.value)})]}),d?(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(O,{id:`edit-start-time`,label:`Start time`,type:`time`,value:C.slice(11,16),onChange:e=>D(t=>E(t,e))}),(0,A.jsx)(O,{id:`edit-end-time`,label:`End time`,type:`time`,value:j.slice(11,16),onChange:e=>M(t=>E(t,e))})]}):(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(O,{id:`edit-start`,label:`Start time`,type:`datetime-local`,value:C,onChange:D}),(0,A.jsx)(O,{id:`edit-end`,label:`End time`,type:`datetime-local`,value:j,onChange:M})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(g,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,A.jsx)(m,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(g,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,A.jsx)(m,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,A.jsx)(v,{rows:N,onChange:P}),(0,A.jsx)(w,{value:F,eventType:R,positions:r,disabled:i,onChange:I}),a&&(0,A.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-small text-red`,children:`Could not save changes. Please try again.`}),(0,A.jsx)(f,{type:`submit`,disabled:i,children:i?`Saving…`:`Save changes`})]})}function O({id:e,label:t,type:n,value:r,onChange:i}){return(0,A.jsxs)(`div`,{children:[(0,A.jsx)(g,{htmlFor:e,children:t}),(0,A.jsx)(m,{id:e,type:n,required:!0,value:r,onChange:e=>i(e.target.value)})]})}var k,A;function j(){return(j=e((()=>{k=t(),d(),p(),h(),y(),C(),_(),l(),A=n(),D.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, so a customised roster can be authored per position.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var M,N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{s(),r(),j(),M=n(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=[o({id:`et-1`,name:`Training`,color:`#22c55e`}),o({id:`et-2`,name:`Match`,color:`#3b82f6`})],L={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],substitutes:[],myState:`NOT_RESPONDED`,rosterOverride:void 0,roster:c},R={...L,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}},z=[a({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],B={title:`features/edit-event/EditEventDialogView`,component:D,args:{event:L,eventTypes:I,onSubmit:P()}},V={play:async({canvas:e})=>{await N(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await N(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument()}},H={render:e=>(0,M.jsx)(i,{items:{Series:(0,M.jsx)(D,{...e,siblings:z}),Saving:(0,M.jsx)(D,{...e,isPending:!0}),Error:(0,M.jsx)(D,{...e,isError:!0})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>F(e.getByRole(`region`,{name:t}));await N(n(`Series`).getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await N(n(`Series`).getByText(`Affects 1 of 3 events`)).toBeInTheDocument(),await N(n(`Saving`).getByRole(`button`,{name:`Saving…`})).toBeDisabled(),await N(n(`Error`).getByText(`Could not save changes. Please try again.`)).toBeInTheDocument(),await t.click(n(`Series`).getByRole(`button`,{name:`This & following`})),await N(n(`Series`).getByLabelText(`Start time`)).toHaveAttribute(`type`,`time`),await N(n(`Series`).getByLabelText(`End time`)).toHaveAttribute(`type`,`time`),await N(n(`Series`).getByText(/keeps its own date/)).toBeInTheDocument()}},U={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Save changes`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({rosterOverride:void 0}))}},W={parameters:{chromatic:{disableSnapshot:!0}},args:{event:R},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Title`);await t.clear(r),await t.type(r,`Renamed Training`),await t.click(e.getByRole(`button`,{name:`Save changes`})),await N(n.onSubmit).toHaveBeenCalledWith(N.objectContaining({title:`Renamed Training`,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}))}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Title')).toHaveValue('Tuesday Training');
    await expect(canvas.queryByRole('group', {
      name: 'Scope'
    })).not.toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // A series occurrence surfaces the scope selector so the admin can choose how far the edit
    // reaches.
    Series: <EditEventDialogView {...args} siblings={SIBLINGS} />,
    Saving: <EditEventDialogView {...args} isPending />,
    Error: <EditEventDialogView {...args} isError />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Series').getByRole('group', {
      name: 'Scope'
    })).toBeInTheDocument();
    await expect(region('Series').getByText('Affects 1 of 3 events')).toBeInTheDocument();
    await expect(region('Saving').getByRole('button', {
      name: 'Saving…'
    })).toBeDisabled();
    await expect(region('Error').getByText('Could not save changes. Please try again.')).toBeInTheDocument();

    // A bulk scope locks the per-occurrence date: the datetime-local inputs swap for time-only ones
    // and a lock note appears. Left on this scope — this is the frame the snapshot keeps.
    await userEvent.click(region('Series').getByRole('button', {
      name: 'This & following'
    }));
    await expect(region('Series').getByLabelText('Start time')).toHaveAttribute('type', 'time');
    await expect(region('Series').getByLabelText('End time')).toHaveAttribute('type', 'time');
    await expect(region('Series').getByText(/keeps its own date/)).toBeInTheDocument();
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
      id: 'evt-1',
      scope: 'THIS',
      eventTypeId: 'et-1',
      title: 'Tuesday Training'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      rosterOverride: undefined
    }));
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    event: EVENT_WITH_ROSTER_OVERRIDE
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
}`,...W.parameters?.docs?.source}}},G=[`Data`,`Shells`,`Interactions`,`InteractionsRosterOverride`]})))()}K();export{V as Data,U as Interactions,W as InteractionsRosterOverride,H as Shells,G as __namedExportsOrder,B as default};