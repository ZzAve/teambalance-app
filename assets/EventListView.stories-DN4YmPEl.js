import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-DQnhcWM1.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{i,r as a}from"./event-fixtures-GLq-GGnS.js";import{n as o,t as s}from"./EventCard-CuugozA3.js";import{n as c,t as l}from"./skeleton-DFjPCpBZ.js";function u({events:e,isLoading:t=!1,error:n,emptyMessage:r=`No upcoming events.`,now:i}){return e.length===0?t?(0,f.jsx)(d,{}):n?(0,f.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load events.`}):(0,f.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:r}):(0,f.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,children:e.map((e,t)=>(0,f.jsx)(s,{event:e,index:t,now:i},e.id))})}function d(){return(0,f.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,role:`status`,"aria-label":`Loading events`,children:[0,1,2].map(e=>(0,f.jsxs)(`div`,{className:`rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm`,children:[(0,f.jsxs)(`div`,{className:`flex gap-3.5`,children:[(0,f.jsx)(l,{className:`h-[62px] w-[54px] shrink-0 rounded-[15px]`}),(0,f.jsxs)(`div`,{className:`min-w-0 flex-1 space-y-2`,children:[(0,f.jsx)(l,{className:`h-4 w-16 rounded-full`}),(0,f.jsx)(l,{className:`h-5 w-2/3`}),(0,f.jsx)(l,{className:`h-3.5 w-1/2`})]})]}),(0,f.jsx)(`div`,{className:`mt-3 border-t border-border/40 pt-3`,children:(0,f.jsx)(l,{className:`h-6 w-40 rounded-full`})})]},e))})}var f;function p(){return(p=e((()=>{c(),o(),f=r(),u.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / data — so each state is testable in
isolation (see EventListView.stories.tsx).

The list is flat and chronological: the date chit on each card carries the date, so the old
This Week / Later grouping headings are gone. Sorting, filtering and hero extraction stay in the
container; this component renders exactly the events it is given, in the order it is given them.`,methods:[],displayName:`EventListView`,props:{events:{required:!0,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Already filtered, already sorted, and with the hero event removed by the container.`},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No upcoming events.'`,computed:!1}},now:{required:!1,tsType:{name:`Date`},description:`Injected so relative labels are deterministic in stories; defaults to the real clock.`}}}})))()}var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{n(),a(),p(),{expect:m}=__STORYBOOK_MODULE_TEST__,h=new Date(2026,7,10,9,0),g=e=>new Date(2026,7,e,20,0).toISOString(),_={title:`entities/event/EventListView`,component:u,decorators:[t],args:{now:h}},v={args:{events:[],isLoading:!0},play:async({canvas:e})=>{await m(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},y={args:{events:[],error:Error(`boom`)},play:async({canvas:e})=>{await m(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},b={args:{events:[]},play:async({canvas:e})=>{await m(e.getByText(`No upcoming events.`)).toBeInTheDocument()}},x={args:{events:[],emptyMessage:`No events for this type.`},play:async({canvas:e})=>{await m(e.getByText(`No events for this type.`)).toBeInTheDocument()}},S={args:{events:[i({id:`evt-1`,title:`League Match`,startTime:g(11)}),i({id:`evt-2`,title:`Training`,startTime:g(13)}),i({id:`evt-3`,title:`Regio-toernooi`,startTime:g(29)})]},play:async({canvas:e})=>{await m(e.getByText(`League Match`)).toBeInTheDocument(),await m(e.getByText(`Training`)).toBeInTheDocument(),await m(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await m(e.queryByText(`This Week`)).not.toBeInTheDocument(),await m(e.queryByText(`Later`)).not.toBeInTheDocument()}},C={args:{error:Error(`refetch failed`),events:[i({id:`evt-1`,title:`League Match`,startTime:g(11)})]},play:async({canvas:e})=>{await m(e.getByText(`League Match`)).toBeInTheDocument(),await m(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events for this type.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w=[`Loading`,`ErrorState`,`Empty`,`EmptyWhenFiltered`,`WithEvents`,`DataDespiteBackgroundError`]})))()}T();export{C as DataDespiteBackgroundError,b as Empty,x as EmptyWhenFiltered,y as ErrorState,v as Loading,S as WithEvents,w as __namedExportsOrder,_ as default};