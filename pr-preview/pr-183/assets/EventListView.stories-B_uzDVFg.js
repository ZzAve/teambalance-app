import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-kFDTRPj-.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i}from"./event-fixtures-aDtuIL9P.js";import{n as a,t as o}from"./EventCard-BViVw3RN.js";import{n as s,t as c}from"./skeleton-BNCbGCl8.js";function l({groups:e,isLoading:t=!1,error:n,emptyMessage:r=`No events yet.`}){return e.length===0?t?(0,d.jsx)(u,{}):n?(0,d.jsx)(`p`,{className:`mt-4 text-sm text-red-500`,children:`Couldn't load events.`}):(0,d.jsx)(`p`,{className:`mt-4 text-muted-foreground`,children:r}):(0,d.jsx)(d.Fragment,{children:e.map((e,t)=>(0,d.jsxs)(`div`,{className:t===0?`mt-4`:`mt-6`,children:[e.label&&(0,d.jsx)(`h3`,{className:`mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground`,children:e.label}),(0,d.jsx)(`div`,{className:`flex flex-col gap-3`,children:e.events.map((e,t)=>(0,d.jsx)(o,{event:e,index:t},e.id))})]},e.label||`past`))})}function u(){return(0,d.jsx)(`div`,{className:`mt-4 flex flex-col gap-3`,role:`status`,"aria-label":`Loading events`,children:[0,1,2].map(e=>(0,d.jsxs)(`div`,{className:`rounded-2xl border border-border/40 bg-card p-4 shadow-sm`,children:[(0,d.jsxs)(`div`,{className:`flex items-start gap-3.5`,children:[(0,d.jsx)(c,{className:`h-10 w-10 shrink-0 rounded-xl`}),(0,d.jsxs)(`div`,{className:`min-w-0 flex-1 space-y-2`,children:[(0,d.jsx)(c,{className:`h-4 w-16 rounded-full`}),(0,d.jsx)(c,{className:`h-5 w-2/3`})]})]}),(0,d.jsx)(c,{className:`mt-3 ml-[50px] h-3.5 w-1/2`}),(0,d.jsx)(`div`,{className:`mt-3 border-t border-border/40 pt-3`,children:(0,d.jsx)(c,{className:`h-6 w-40 rounded-full`})})]},e))})}var d;function f(){return(f=e((()=>{s(),a(),d=r(),l.__docgenInfo={description:`Presentational list region of the events page. Renders one of four states from props the
container (the route) hands down — loading / error / empty / grouped data — so each state is
testable in isolation (see EventListView.stories.tsx). Date-based grouping and filtering stay in
the container; this component only renders the groups it is given.`,methods:[],displayName:`EventListView`,props:{groups:{required:!0,tsType:{name:`Array`,elements:[{name:`EventGroup`}],raw:`EventGroup[]`},description:``},isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},error:{required:!1,tsType:{name:`unknown`},description:``},emptyMessage:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'No events yet.'`,computed:!1}}}}})))()}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),f(),{expect:p}=__STORYBOOK_MODULE_TEST__,m={title:`entities/event/EventListView`,component:l,decorators:[t]},h={args:{groups:[],isLoading:!0},play:async({canvas:e})=>{await p(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},g={args:{groups:[],error:Error(`boom`)},play:async({canvas:e})=>{await p(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},_={args:{groups:[]},play:async({canvas:e})=>{await p(e.getByText(`No events yet.`)).toBeInTheDocument()}},v={args:{groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`}),i({id:`evt-2`,title:`Training`})]}]},play:async({canvas:e})=>{await p(e.getByText(`This Week`)).toBeInTheDocument(),await p(e.getByText(`League Match`)).toBeInTheDocument(),await p(e.getByText(`Training`)).toBeInTheDocument()}},y={args:{error:Error(`refetch failed`),groups:[{label:`This Week`,events:[i({id:`evt-1`,title:`League Match`})]}]},play:async({canvas:e})=>{await p(e.getByText(`League Match`)).toBeInTheDocument(),await p(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('status', {
      name: /loading events/i
    })).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    groups: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events yet.')).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Loading`,`ErrorState`,`Empty`,`WithEvents`,`DataDespiteBackgroundError`]})))()}x();export{y as DataDespiteBackgroundError,_ as Empty,g as ErrorState,h as Loading,v as WithEvents,b as __namedExportsOrder,m as default};