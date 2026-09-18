import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DrbUYmN2.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D1VBtmRF.js";import{a,o,r as s,t as c}from"./event-fixtures-CuRrQuRB.js";import{a as l,i as u,n as d,o as f,r as p,t as m}from"./select-V2_ERSSm.js";import{n as h,t as g}from"./SeriesScopeField-Da650Ldv.js";import{n as _,t as v}from"./button-CmXzxiAJ.js";import{n as y,t as b}from"./input-DnghFZpx.js";import{n as x,t as S}from"./label-TdKac9RL.js";import{n as C,t as w}from"./ReferenceRowsEditor-CJCixOjq.js";import{n as T,t as E}from"./RosterOverrideField-BbcG9c18.js";import{r as D,t as O}from"./references-IoGSSQVz.js";function k(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function A(e,t){return`${e.slice(0,10)}T${t}`}function j({event:e,siblings:t=[],eventTypes:n=[],positions:r=[],isPending:i,isError:a,onSubmit:o}){let s=t.length>1,[c,f]=(0,M.useState)(`THIS`),h=s&&c!==`THIS`,[_,y]=(0,M.useState)(e.eventType.id),[x,C]=(0,M.useState)(e.title),[T,j]=(0,M.useState)(k(e.startTime)),[P,F]=(0,M.useState)(k(e.endTime)),[I,L]=(0,M.useState)(D(e.references)),[R,z]=(0,M.useState)(e.rosterOverride??void 0),B=n.filter(t=>!t.archived||t.id===e.eventType.id),V=n.find(e=>e.id===_);return(0,N.jsxs)(`form`,{onSubmit:t=>{t.preventDefault();let n=new FormData(t.currentTarget);o({id:e.id,scope:c,eventTypeId:_,title:x,description:n.get(`description`)||void 0,startTime:new Date(T).toISOString(),endTime:new Date(P).toISOString(),location:n.get(`location`)||void 0,references:O(I),rosterOverride:R})},className:`flex flex-col gap-4`,children:[s&&(0,N.jsx)(g,{siblings:t,currentId:e.id,scope:c,onScopeChange:f,variant:`edit`}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-type`,children:`Type`}),(0,N.jsxs)(m,{value:_,onValueChange:y,children:[(0,N.jsx)(u,{id:`edit-type`,children:(0,N.jsx)(l,{placeholder:`Select type`})}),(0,N.jsx)(d,{children:B.map(e=>(0,N.jsx)(p,{value:e.id,children:(0,N.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,N.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-title`,children:`Title`}),(0,N.jsx)(b,{id:`edit-title`,required:!0,value:x,onChange:e=>C(e.target.value)})]}),h?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-start-time`,children:`Start time`}),(0,N.jsx)(b,{id:`edit-start-time`,type:`time`,required:!0,value:T.slice(11,16),onChange:e=>j(t=>A(t,e.target.value))})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-end-time`,children:`End time`}),(0,N.jsx)(b,{id:`edit-end-time`,type:`time`,required:!0,value:P.slice(11,16),onChange:e=>F(t=>A(t,e.target.value))})]})]}):(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-start`,children:`Start time`}),(0,N.jsx)(b,{id:`edit-start`,type:`datetime-local`,required:!0,value:T,onChange:e=>j(e.target.value)})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-end`,children:`End time`}),(0,N.jsx)(b,{id:`edit-end`,type:`datetime-local`,required:!0,value:P,onChange:e=>F(e.target.value)})]})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-location`,children:`Location (optional)`}),(0,N.jsx)(b,{id:`edit-location`,name:`location`,defaultValue:e.location??``})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(S,{htmlFor:`edit-description`,children:`Description (optional)`}),(0,N.jsx)(b,{id:`edit-description`,name:`description`,defaultValue:e.description??``})]}),(0,N.jsx)(w,{rows:I,onChange:L}),(0,N.jsx)(E,{value:R,eventType:V,positions:r,disabled:i,onChange:z}),a&&(0,N.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-small text-red`,children:`Could not save changes. Please try again.`}),(0,N.jsx)(v,{type:`submit`,disabled:i,children:i?`Saving…`:`Save changes`})]})}var M,N;function P(){return(P=e((()=>{M=t(),_(),y(),x(),f(),T(),C(),h(),N=n(),j.__docgenInfo={description:`Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
open/close state live in the EditEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / saving / error — renders purely from props as a story, with
no network. See ADR-0017.

Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
input is swapped for a time-only input.`,methods:[],displayName:`EditEventDialogView`,props:{event:{required:!0,tsType:{name:`EventDetail`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the picker; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, so a customised roster can be authored per position.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The update mutation is in flight — the submit button shows "Saving…" and is disabled.`},isError:{required:!1,tsType:{name:`boolean`},description:`The update mutation failed — render the inline error shell.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: UpdateEventRequest) => void`,signature:{arguments:[{type:{name:`intersection`,raw:`EventInput & { id: string; scope: EventSeriesScope }`,elements:[{name:`EventInput`},{name:`signature`,type:`object`,raw:`{ id: string; scope: EventSeriesScope }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`scope`,value:{name:`EventSeriesScope`,required:!0}}]}}]},name:`request`}],return:{name:`void`}}},description:``}}}})))()}var F,I,L,R,z,B,V,H,U,W,G,K,q,J;function Y(){return(Y=e((()=>{s(),r(),P(),F=n(),{expect:I,fn:L,within:R}=__STORYBOOK_MODULE_TEST__,z=[o({id:`et-1`,name:`Training`,color:`#22c55e`}),o({id:`et-2`,name:`Match`,color:`#3b82f6`})],B={id:`evt-1`,eventType:{id:`et-1`,name:`Training`,color:`#22c55e`},title:`Tuesday Training`,description:void 0,startTime:`2026-09-01T18:30:00+02:00`,endTime:`2026-09-01T20:00:00+02:00`,location:void 0,references:[],recurringGroup:void 0,attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]},attendances:[],myState:`NOT_RESPONDED`,rosterOverride:void 0,roster:c},V={...B,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}},H=[a({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],U={title:`features/edit-event/EditEventDialogView`,component:j,args:{event:B,eventTypes:z,onSubmit:L()}},W={play:async({canvas:e})=>{await I(e.getByLabelText(`Title`)).toHaveValue(`Tuesday Training`),await I(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument()}},G={render:e=>(0,F.jsx)(i,{items:{Series:(0,F.jsx)(j,{...e,siblings:H}),Saving:(0,F.jsx)(j,{...e,isPending:!0}),Error:(0,F.jsx)(j,{...e,isError:!0})}}),play:async({canvas:e})=>{let t=t=>R(e.getByRole(`region`,{name:t}));await I(t(`Series`).getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await I(t(`Series`).getByText(`Affects 1 of 3 events`)).toBeInTheDocument(),await I(t(`Saving`).getByRole(`button`,{name:`Saving…`})).toBeDisabled(),await I(t(`Error`).getByText(`Could not save changes. Please try again.`)).toBeInTheDocument()}},K={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Save changes`})),await I(n.onSubmit).toHaveBeenCalledWith(I.objectContaining({id:`evt-1`,scope:`THIS`,eventTypeId:`et-1`,title:`Tuesday Training`})),await I(n.onSubmit).toHaveBeenCalledWith(I.objectContaining({rosterOverride:void 0}))}},q={parameters:{chromatic:{disableSnapshot:!0}},args:{event:V},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Title`);await t.clear(r),await t.type(r,`Renamed Training`),await t.click(e.getByRole(`button`,{name:`Save changes`})),await I(n.onSubmit).toHaveBeenCalledWith(I.objectContaining({title:`Renamed Training`,rosterOverride:{trackRoster:!0,totalTarget:12,positionTargets:[{positionId:`pos-setter`,count:2}]}}))}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Title')).toHaveValue('Tuesday Training');
    await expect(canvas.queryByRole('group', {
      name: 'Scope'
    })).not.toBeInTheDocument();
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // A series occurrence surfaces the scope selector so the admin can choose how far the edit
    // reaches.
    Series: <EditEventDialogView {...args} siblings={SIBLINGS} />,
    Saving: <EditEventDialogView {...args} isPending />,
    Error: <EditEventDialogView {...args} isError />
  }} />,
  play: async ({
    canvas
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
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J=[`Data`,`Shells`,`Interactions`,`InteractionsRosterOverride`]})))()}Y();export{W as Data,K as Interactions,q as InteractionsRosterOverride,G as Shells,J as __namedExportsOrder,U as default};