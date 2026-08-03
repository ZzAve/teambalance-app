import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-C6_vDrww.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i}from"./event-fixtures-aDtuIL9P.js";import{n as a,t as o}from"./EventCard-CQrh9Ia2.js";function s({groups:e,isLoading:t=!1,error:n,emptyMessage:r=`No events yet.`}){return e.length===0?t?(0,c.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:`Loading...`}):n?(0,c.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load events.`}):(0,c.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:r}):(0,c.jsx)(c.Fragment,{children:e.map((e,t)=>(0,c.jsxs)(`div`,{className:t===0?`mt-4`:`mt-6`,children:[e.label&&(0,c.jsx)(`h3`,{className:`mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground`,children:e.label}),(0,c.jsx)(`div`,{className:`flex flex-col gap-3`,children:e.events.map((e,t)=>(0,c.jsx)(o,{event:e,index:t},e.id))})]},e.label||`past`))})}var c;function l(){return(l=e((()=>{a(),c=r(),s.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / grouped data — so each state is
testable in isolation (see EventListView.stories.tsx). Date-based grouping and filtering stay in
the container; this component only renders the groups it is given.`,methods:[],displayName:`EventListView`,props:{groups:{required:!0,tsType:{name:`Array`,elements:[{name:`EventGroup`}],raw:`EventGroup[]`},description:``},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No events yet.'`,computed:!1}}}}})))()}var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),l(),{expect:u}=__STORYBOOK_MODULE_TEST__,d={title:`entities/event/EventListView`,component:s,decorators:[t]},f={args:{groups:[],isLoading:!0},play:async({canvas:e})=>{await u(e.getByText(`Loading...`)).toBeInTheDocument()}},p={args:{groups:[],error:Error(`boom`)},play:async({canvas:e})=>{await u(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},m={args:{groups:[]},play:async({canvas:e})=>{await u(e.getByText(`No events yet.`)).toBeInTheDocument()}},h={args:{groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`}),i({id:`evt-2`,title:`Training`})]}]},play:async({canvas:e})=>{await u(e.getByText(`This Week`)).toBeInTheDocument(),await u(e.getByText(`League Match`)).toBeInTheDocument(),await u(e.getByText(`Training`)).toBeInTheDocument()}},g={args:{error:Error(`refetch failed`),groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`})]}]},play:async({canvas:e})=>{await u(e.getByText(`League Match`)).toBeInTheDocument(),await u(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    groups: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events yet.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Loading`,`ErrorState`,`Empty`,`WithEvents`,`DataDespiteBackgroundError`]})))()}v();export{g as DataDespiteBackgroundError,m as Empty,p as ErrorState,f as Loading,h as WithEvents,_ as __namedExportsOrder,d as default};