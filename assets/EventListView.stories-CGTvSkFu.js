import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./event-fixtures-GLq-GGnS.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./router-decorator-D0R4BT1K.js";import{n as o,t as s}from"./EventCard-4IknQ9fz.js";import{n as c,t as l}from"./skeleton-BjDDxe09.js";function u({events:e,isLoading:t=!1,error:n,emptyMessage:r=`No upcoming events.`,now:i,onRespond:a,optimistic:o,onClearFilters:c}){return e.length===0?t?(0,f.jsx)(d,{}):n?(0,f.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load events.`}):(0,f.jsxs)(`div`,{className:`mt-4`,children:[(0,f.jsx)(`p`,{className:`text-muted-foreground`,children:r}),c&&(0,f.jsx)(`button`,{onClick:c,className:`mt-3 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted`,children:`Clear filters`})]}):(0,f.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,children:e.map((e,t)=>{let n=o?.eventId===e.id&&o.state!==e.myState;return(0,f.jsx)(s,{event:e,index:t,now:i,myState:n?o.state:e.myState,pending:n,onRespond:t=>a?.(e.id,t)},e.id)})})}function d(){return(0,f.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,role:`status`,"aria-label":`Loading events`,children:[0,1,2].map(e=>(0,f.jsxs)(`div`,{className:`rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm`,children:[(0,f.jsxs)(`div`,{className:`flex gap-3.5`,children:[(0,f.jsx)(l,{className:`h-[62px] w-[54px] shrink-0 rounded-[15px]`}),(0,f.jsxs)(`div`,{className:`min-w-0 flex-1 space-y-2`,children:[(0,f.jsx)(l,{className:`h-4 w-16 rounded-full`}),(0,f.jsx)(l,{className:`h-5 w-2/3`}),(0,f.jsx)(l,{className:`h-3.5 w-1/2`})]})]}),(0,f.jsx)(`div`,{className:`mt-3 border-t border-border/40 pt-3`,children:(0,f.jsx)(l,{className:`h-6 w-40 rounded-full`})})]},e))})}var f;function p(){return(p=e((()=>{c(),o(),f=r(),u.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / data — so each state is testable in
isolation (see EventListView.stories.tsx).

The list is flat and chronological: the date chit on each card carries the date, so the old
This Week / Later grouping headings are gone. Sorting, filtering and hero extraction stay in the
container; this component renders exactly the events it is given, in the order it is given them.`,methods:[],displayName:`EventListView`,props:{events:{required:!0,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Already filtered, already sorted, and with the hero event removed by the container.`},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No upcoming events.'`,computed:!1}},now:{required:!1,tsType:{name:`Date`},description:`Injected so relative labels are deterministic in stories; defaults to the real clock.`},onRespond:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(eventId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`eventId`},{type:{name:`Event['myState']`,raw:`Event['myState']`},name:`state`}],return:{name:`void`}}},description:`Fires the viewer's attendance write for one event. Wired by the page container (the route).`},optimistic:{required:!1,tsType:{name:`union`,raw:`{ eventId: string; state: AttendanceState } | null`,elements:[{name:`signature`,type:`object`,raw:`{ eventId: string; state: AttendanceState }`,signature:{properties:[{key:`eventId`,value:{name:`string`,required:!0}},{key:`state`,value:{name:`Event['myState']`,raw:`Event['myState']`,required:!0}}]}},{name:`null`}]},description:`The event whose write is in flight, with the optimistic answer to show on its card meanwhile.`},onClearFilters:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Resets every filter. Passed only while one is active, and offered only on the empty state: the
chip groups live behind a popover, so a member can strand themselves on an empty list without
remembering why (ADR-0029).`}}}})))()}var m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{a(),n(),p(),{expect:m,fn:h}=__STORYBOOK_MODULE_TEST__,g=new Date(2026,7,10,9,0),_=e=>new Date(2026,7,e,20,0).toISOString(),v={title:`entities/event/EventListView`,component:u,decorators:[i],args:{now:g}},y={args:{events:[],isLoading:!0},play:async({canvas:e})=>{await m(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},b={args:{events:[],error:Error(`boom`)},play:async({canvas:e})=>{await m(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},x={args:{events:[]},play:async({canvas:e})=>{await m(e.getByText(`No upcoming events.`)).toBeInTheDocument()}},S={args:{events:[],emptyMessage:`No events for this type.`},play:async({canvas:e})=>{await m(e.getByText(`No events for this type.`)).toBeInTheDocument()}},C={args:{events:[],emptyMessage:`Nothing needs your answer.`,onClearFilters:h()},play:async({canvas:e,userEvent:t,args:n})=>{await m(e.getByText(`Nothing needs your answer.`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await m(n.onClearFilters).toHaveBeenCalled()}},w={args:{events:[t({id:`evt-1`,title:`League Match`,startTime:_(11)}),t({id:`evt-2`,title:`Training`,startTime:_(13)}),t({id:`evt-3`,title:`Regio-toernooi`,startTime:_(29)})]},play:async({canvas:e})=>{await m(e.getByText(`League Match`)).toBeInTheDocument(),await m(e.getByText(`Training`)).toBeInTheDocument(),await m(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await m(e.queryByText(`This Week`)).not.toBeInTheDocument(),await m(e.queryByText(`Later`)).not.toBeInTheDocument()}},T={args:{error:Error(`refetch failed`),events:[t({id:`evt-1`,title:`League Match`,startTime:_(11)})]},play:async({canvas:e})=>{await m(e.getByText(`League Match`)).toBeInTheDocument(),await m(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('status', {
      name: /loading events/i
    })).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events for this type.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'Nothing needs your answer.',
    onClearFilters: fn()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('Nothing needs your answer.')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Clear filters'
    }));
    await expect(args.onClearFilters).toHaveBeenCalled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    events: [makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11)
    }), makeEvent({
      id: 'evt-2',
      title: 'Training',
      startTime: on(13)
    }), makeEvent({
      id: 'evt-3',
      title: 'Regio-toernooi',
      startTime: on(29)
    })]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument();
    await expect(canvas.getByText('Training')).toBeInTheDocument();
    await expect(canvas.getByText('Regio-toernooi')).toBeInTheDocument();
    // The old section headings are gone for good.
    await expect(canvas.queryByText('This Week')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Later')).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('refetch failed'),
    events: [makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11)
    })]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument();
    await expect(canvas.queryByText(/couldn't load events/i)).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E=[`Loading`,`ErrorState`,`Empty`,`EmptyWhenFiltered`,`EmptyWithClearFilters`,`WithEvents`,`DataDespiteBackgroundError`]})))()}D();export{T as DataDespiteBackgroundError,x as Empty,S as EmptyWhenFiltered,C as EmptyWithClearFilters,b as ErrorState,y as Loading,w as WithEvents,E as __namedExportsOrder,v as default};