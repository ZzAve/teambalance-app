import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-kaJo8txd.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i}from"./event-fixtures-BaYeuP-I.js";import{n as a,t as o}from"./EventCard-DvyeeFmn.js";import{n as s,t as c}from"./skeleton-g7oTFQIS.js";function l({events:e,isLoading:t=!1,error:n,emptyMessage:r=`No upcoming events.`,now:i}){return e.length===0?t?(0,d.jsx)(u,{}):n?(0,d.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load events.`}):(0,d.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:r}):(0,d.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,children:e.map((e,t)=>(0,d.jsx)(o,{event:e,index:t,now:i},e.id))})}function u(){return(0,d.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,role:`status`,"aria-label":`Loading events`,children:[0,1,2].map(e=>(0,d.jsxs)(`div`,{className:`rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm`,children:[(0,d.jsxs)(`div`,{className:`flex gap-3.5`,children:[(0,d.jsx)(c,{className:`h-[62px] w-[54px] shrink-0 rounded-[15px]`}),(0,d.jsxs)(`div`,{className:`min-w-0 flex-1 space-y-2`,children:[(0,d.jsx)(c,{className:`h-4 w-16 rounded-full`}),(0,d.jsx)(c,{className:`h-5 w-2/3`}),(0,d.jsx)(c,{className:`h-3.5 w-1/2`})]})]}),(0,d.jsx)(`div`,{className:`mt-3 border-t border-border/40 pt-3`,children:(0,d.jsx)(c,{className:`h-6 w-40 rounded-full`})})]},e))})}var d;function f(){return(f=e((()=>{s(),a(),d=r(),l.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / data — so each state is testable in
isolation (see EventListView.stories.tsx).

The list is flat and chronological: the date chit on each card carries the date, so the old
This Week / Later grouping headings are gone. Sorting, filtering and hero extraction stay in the
container; this component renders exactly the events it is given, in the order it is given them.`,methods:[],displayName:`EventListView`,props:{events:{required:!0,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Already filtered, already sorted, and with the hero event removed by the container.`},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No upcoming events.'`,computed:!1}},now:{required:!1,tsType:{name:`Date`},description:`Injected so relative labels are deterministic in stories; defaults to the real clock.`}}}})))()}var p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{n(),f(),{expect:p}=__STORYBOOK_MODULE_TEST__,m=new Date(2026,7,10,9,0),h=e=>new Date(2026,7,e,20,0).toISOString(),g={title:`entities/event/EventListView`,component:l,decorators:[t],args:{now:m}},_={args:{events:[],isLoading:!0},play:async({canvas:e})=>{await p(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},v={args:{events:[],error:Error(`boom`)},play:async({canvas:e})=>{await p(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},y={args:{events:[]},play:async({canvas:e})=>{await p(e.getByText(`No upcoming events.`)).toBeInTheDocument()}},b={args:{events:[],emptyMessage:`No events for this type.`},play:async({canvas:e})=>{await p(e.getByText(`No events for this type.`)).toBeInTheDocument()}},x={args:{events:[i({id:`evt-1`,title:`League Match`,startTime:h(11)}),i({id:`evt-2`,title:`Training`,startTime:h(13)}),i({id:`evt-3`,title:`Regio-toernooi`,startTime:h(29)})]},play:async({canvas:e})=>{await p(e.getByText(`League Match`)).toBeInTheDocument(),await p(e.getByText(`Training`)).toBeInTheDocument(),await p(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await p(e.queryByText(`This Week`)).not.toBeInTheDocument(),await p(e.queryByText(`Later`)).not.toBeInTheDocument()}},S={args:{error:Error(`refetch failed`),events:[i({id:`evt-1`,title:`League Match`,startTime:h(11)})]},play:async({canvas:e})=>{await p(e.getByText(`League Match`)).toBeInTheDocument(),await p(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events for this type.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C=[`Loading`,`ErrorState`,`Empty`,`EmptyWhenFiltered`,`WithEvents`,`DataDespiteBackgroundError`]})))()}w();export{S as DataDespiteBackgroundError,y as Empty,b as EmptyWhenFiltered,v as ErrorState,_ as Loading,x as WithEvents,C as __namedExportsOrder,g as default};