import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n}from"./event-fixtures-CuRrQuRB.js";import{n as r,t as i}from"./router-decorator-B2uHYZwn.js";import{n as a,t as o}from"./EventListView-DOYnlMsN.js";var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{i(),n(),a(),{expect:s}=__STORYBOOK_MODULE_TEST__,c=new Date(2026,7,10,9,0),l=e=>new Date(2026,7,e,20,0).toISOString(),u={title:`entities/event/EventListView`,component:o,decorators:[r],args:{now:c}},d={args:{events:[],isLoading:!0},play:async({canvas:e})=>{await s(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},f={args:{events:[],error:Error(`boom`)},play:async({canvas:e})=>{await s(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},p={args:{events:[]},play:async({canvas:e})=>{await s(e.getByText(`No upcoming events.`)).toBeInTheDocument()}},m={args:{events:[],emptyMessage:`No events for this type.`},play:async({canvas:e})=>{await s(e.getByText(`No events for this type.`)).toBeInTheDocument()}},h={args:{events:[t({id:`evt-1`,title:`League Match`,startTime:l(11)}),t({id:`evt-2`,title:`Training`,startTime:l(13)}),t({id:`evt-3`,title:`Regio-toernooi`,startTime:l(29)})]},play:async({canvas:e})=>{await s(e.getByText(`League Match`)).toBeInTheDocument(),await s(e.getByText(`Training`)).toBeInTheDocument(),await s(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await s(e.queryByText(`This Week`)).not.toBeInTheDocument(),await s(e.queryByText(`Later`)).not.toBeInTheDocument()}},g={args:{error:Error(`refetch failed`),events:[t({id:`evt-1`,title:`League Match`,startTime:l(11)})]},play:async({canvas:e})=>{await s(e.getByText(`League Match`)).toBeInTheDocument(),await s(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events for this type.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Loading`,`ErrorState`,`Empty`,`EmptyWhenFiltered`,`WithEvents`,`DataDespiteBackgroundError`]})))()}v();export{g as DataDespiteBackgroundError,p as Empty,m as EmptyWhenFiltered,f as ErrorState,d as Loading,h as WithEvents,_ as __namedExportsOrder,u as default};