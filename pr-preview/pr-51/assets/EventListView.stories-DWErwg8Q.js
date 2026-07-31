import{i as e}from"./preload-helper-CT_b8DTk.js";import{n as t,t as n}from"./router-decorator-CNNDLMHm.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{n as i,t as a}from"./event-fixtures-3405VcxT.js";import{n as o,t as s}from"./EventCard-BoySuzPz.js";function c({groups:e,isLoading:t=!1,error:n,emptyMessage:r=`No events yet.`}){return e.length===0?t?(0,l.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:`Loading...`}):n?(0,l.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load events.`}):(0,l.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:r}):(0,l.jsx)(l.Fragment,{children:e.map((e,t)=>(0,l.jsxs)(`div`,{className:t===0?`mt-4`:`mt-6`,children:[e.label&&(0,l.jsx)(`h3`,{className:`mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground`,children:e.label}),(0,l.jsx)(`div`,{className:`flex flex-col gap-3`,children:e.events.map((e,t)=>(0,l.jsx)(s,{event:e,index:t},e.id))})]},e.label||`past`))})}var l,u=e((()=>{o(),l=r(),c.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / grouped data — so each state is
testable in isolation (see EventListView.stories.tsx). Date-based grouping and filtering stay in
the container; this component only renders the groups it is given.`,methods:[],displayName:`EventListView`,props:{groups:{required:!0,tsType:{name:`Array`,elements:[{name:`EventGroup`}],raw:`EventGroup[]`},description:``},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No events yet.'`,computed:!1}}}}})),d,f,p,m,h,g,_,v;e((()=>{n(),a(),u(),{expect:d}=__STORYBOOK_MODULE_TEST__,f={title:`entities/event/EventListView`,component:c,decorators:[t]},p={args:{groups:[],isLoading:!0},play:async({canvas:e})=>{await d(e.getByText(`Loading...`)).toBeInTheDocument()}},m={args:{groups:[],error:Error(`boom`)},play:async({canvas:e})=>{await d(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},h={args:{groups:[]},play:async({canvas:e})=>{await d(e.getByText(`No events yet.`)).toBeInTheDocument()}},g={args:{groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`}),i({id:`evt-2`,title:`Training`})]}]},play:async({canvas:e})=>{await d(e.getByText(`This Week`)).toBeInTheDocument(),await d(e.getByText(`League Match`)).toBeInTheDocument(),await d(e.getByText(`Training`)).toBeInTheDocument()}},_={args:{error:Error(`refetch failed`),groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`})]}]},play:async({canvas:e})=>{await d(e.getByText(`League Match`)).toBeInTheDocument(),await d(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    groups: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events yet.')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [{
      label: 'This Week',
      events: [makeEvent({
        id: 'evt-1',
        title: 'League Match'
      }), makeEvent({
        id: 'evt-2',
        title: 'Training'
      })]
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('This Week')).toBeInTheDocument();
    await expect(canvas.getByText('League Match')).toBeInTheDocument();
    await expect(canvas.getByText('Training')).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('refetch failed'),
    groups: [{
      label: 'This Week',
      events: [makeEvent({
        id: 'evt-1',
        title: 'League Match'
      })]
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument();
    await expect(canvas.queryByText(/couldn't load events/i)).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v=[`Loading`,`ErrorState`,`Empty`,`WithEvents`,`DataDespiteBackgroundError`]}))();export{_ as DataDespiteBackgroundError,h as Empty,m as ErrorState,p as Loading,g as WithEvents,v as __namedExportsOrder,f as default};