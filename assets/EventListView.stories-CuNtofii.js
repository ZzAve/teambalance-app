import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./event-fixtures-CuRrQuRB.js";import{n as i,t as a}from"./router-decorator-BzUBeuvS.js";import{n as o,t as s}from"./EventListView-K2nb7D56.js";var c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a(),r(),o(),{expect:c}=__STORYBOOK_MODULE_TEST__,l=new Date(2026,7,10,9,0),u=e=>new Date(2026,7,e,20,0).toISOString(),d={title:`entities/event/EventListView`,component:s,decorators:[i],args:{now:l}},f={args:{events:[],isLoading:!0},play:async({canvas:e})=>{await c(e.getByRole(`status`,{name:/loading events/i})).toBeInTheDocument()}},p={args:{events:[],error:Error(`boom`)},play:async({canvas:e})=>{await c(e.getByText(/couldn't load events/i)).toBeInTheDocument()}},m={args:{events:[]},play:async({canvas:e})=>{await c(e.getByText(`No upcoming events.`)).toBeInTheDocument()}},h={args:{events:[],emptyMessage:`No events for this type.`},play:async({canvas:e})=>{await c(e.getByText(`No events for this type.`)).toBeInTheDocument()}},g={args:{events:[t({id:`evt-1`,title:`League Match`,startTime:u(11)}),t({id:`evt-2`,title:`Training`,startTime:u(13)}),t({id:`evt-3`,title:`Regio-toernooi`,startTime:u(29)})]},play:async({canvas:e})=>{await c(e.getByText(`League Match`)).toBeInTheDocument(),await c(e.getByText(`Training`)).toBeInTheDocument(),await c(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await c(e.queryByText(`This Week`)).not.toBeInTheDocument(),await c(e.queryByText(`Later`)).not.toBeInTheDocument()}},_={args:{error:Error(`refetch failed`),events:[t({id:`evt-1`,title:`League Match`,startTime:u(11)})]},play:async({canvas:e})=>{await c(e.getByText(`League Match`)).toBeInTheDocument(),await c(e.queryByText(/couldn't load events/i)).not.toBeInTheDocument()}},v={args:{currentUserId:`u-me`,events:[t({id:`evt-1`,title:`League Match`,startTime:u(11),myState:`ABSENT`,attendances:[n(`u-me`,`Me`,`Unassigned`,{state:`ABSENT`,changedBy:`u-tim`}),n(`u-tim`,`Tim de Vries`,`Unassigned`,{changedBy:`u-tim`})]}),t({id:`evt-2`,title:`Training`,startTime:u(13),myState:`ATTENDING`,attendances:[n(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`})]})]},play:async({canvas:e})=>{await c(e.getByText(`Tim de Vries said you're out`)).toBeInTheDocument(),await c(e.getByText(`You're in`)).toBeInTheDocument()}},y={args:{currentUserId:`u-me`,optimistic:{eventId:`evt-1`,userId:`u-me`,state:`ATTENDING`},events:[t({id:`evt-1`,title:`League Match`,startTime:u(11),myState:`ABSENT`,attendances:[n(`u-me`,`Me`,`Unassigned`,{state:`ABSENT`,changedBy:`u-tim`}),n(`u-tim`,`Tim de Vries`,`Unassigned`,{changedBy:`u-tim`})]})]},play:async({canvas:e})=>{await c(e.getByText(`You're in`)).toBeInTheDocument(),await c(e.queryByText(/ said /)).not.toBeInTheDocument()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    error: new Error('boom')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events for this type.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-me',
    events: [makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11),
      myState: 'ABSENT',
      attendances: [makeAttendee('u-me', 'Me', 'Unassigned', {
        state: 'ABSENT',
        changedBy: 'u-tim'
      }), makeAttendee('u-tim', 'Tim de Vries', 'Unassigned', {
        changedBy: 'u-tim'
      })]
    }), makeEvent({
      id: 'evt-2',
      title: 'Training',
      startTime: on(13),
      myState: 'ATTENDING',
      attendances: [makeAttendee('u-me', 'Me', 'Unassigned', {
        changedBy: 'u-me'
      })]
    })]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Tim de Vries said you're out")).toBeInTheDocument();
    // The self-set card stays in the first person.
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-me',
    optimistic: {
      eventId: 'evt-1',
      userId: 'u-me',
      state: 'ATTENDING'
    },
    events: [makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11),
      myState: 'ABSENT',
      attendances: [makeAttendee('u-me', 'Me', 'Unassigned', {
        state: 'ABSENT',
        changedBy: 'u-tim'
      }), makeAttendee('u-tim', 'Tim de Vries', 'Unassigned', {
        changedBy: 'u-tim'
      })]
    })]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
    await expect(canvas.queryByText(/ said /)).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b=[`Loading`,`ErrorState`,`Empty`,`EmptyWhenFiltered`,`WithEvents`,`DataDespiteBackgroundError`,`AttributionOnTheCard`,`AttributionClearsWhileSettling`]})))()}x();export{y as AttributionClearsWhileSettling,v as AttributionOnTheCard,_ as DataDespiteBackgroundError,m as Empty,h as EmptyWhenFiltered,p as ErrorState,f as Loading,g as WithEvents,b as __namedExportsOrder,d as default};