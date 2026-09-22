import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-CakS7x0S.js";import{a as o,i as s,r as c}from"./event-fixtures-CuRrQuRB.js";import{n as l,t as u}from"./EventListView-BQdF4o5D.js";var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),n(),c(),l(),d=t(),{expect:f,fn:p,within:m}=__STORYBOOK_MODULE_TEST__,h=new Date(2026,7,10,9,0),g=e=>new Date(2026,7,e,20,0).toISOString(),_={title:`entities/event/EventListView`,component:u,decorators:[i],args:{now:h,events:[]}},v={parameters:{chromatic:{disableSnapshot:!0}},args:{events:[o({id:`evt-1`,title:`League Match`,startTime:g(11)}),o({id:`evt-2`,title:`Training`,startTime:g(13)}),o({id:`evt-3`,title:`Regio-toernooi`,startTime:g(29)})]},play:async({canvas:e})=>{await f(e.getByText(`League Match`)).toBeInTheDocument(),await f(e.getByText(`Training`)).toBeInTheDocument(),await f(e.getByText(`Regio-toernooi`)).toBeInTheDocument(),await f(e.queryByText(`This Week`)).not.toBeInTheDocument(),await f(e.queryByText(`Later`)).not.toBeInTheDocument()}},y={render:e=>(0,d.jsx)(r,{items:{Loading:(0,d.jsx)(u,{...e,events:[],isLoading:!0}),Error:(0,d.jsx)(u,{...e,events:[],error:Error(`boom`)}),Empty:(0,d.jsx)(u,{...e,events:[]}),"Filtered to nothing":(0,d.jsx)(u,{...e,events:[],emptyMessage:`No events for this type.`}),"Data despite background error":(0,d.jsx)(u,{...e,error:Error(`refetch failed`),events:[o({id:`evt-1`,title:`League Match`,startTime:g(11)})]}),Attribution:(0,d.jsx)(u,{...e,currentUserId:`u-me`,events:[o({id:`evt-1`,title:`League Match`,startTime:g(11),myState:`ABSENT`,attendances:[s(`u-me`,`Me`,`Unassigned`,{state:`ABSENT`,changedBy:`u-tim`}),s(`u-tim`,`Tim de Vries`,`Unassigned`,{changedBy:`u-tim`})]}),o({id:`evt-2`,title:`Training`,startTime:g(13),myState:`ATTENDING`,attendances:[s(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`})]})]}),"Attribution clears while settling":(0,d.jsx)(u,{...e,currentUserId:`u-me`,optimistic:{eventId:`evt-1`,userId:`u-me`,state:`ATTENDING`},events:[o({id:`evt-1`,title:`League Match`,startTime:g(11),myState:`ABSENT`,attendances:[s(`u-me`,`Me`,`Unassigned`,{state:`ABSENT`,changedBy:`u-tim`}),s(`u-tim`,`Tim de Vries`,`Unassigned`,{changedBy:`u-tim`})]})]})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await f(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await f(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await f(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await f(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await f(t(`Data despite background error`).getByText(`League Match`)).toBeInTheDocument(),await f(t(`Data despite background error`).queryByText(/couldn't load events/i)).not.toBeInTheDocument(),await f(t(`Attribution`).getByText(`Tim de Vries said you're out`)).toBeInTheDocument(),await f(t(`Attribution`).getByText(`You're in`)).toBeInTheDocument(),await f(t(`Attribution clears while settling`).getByText(`You're in`)).toBeInTheDocument(),await f(t(`Attribution clears while settling`).queryByText(/ said /)).not.toBeInTheDocument()}},b={parameters:{chromatic:{disableSnapshot:!0}},args:{onRespond:p(),events:[o({id:`evt-1`,title:`League Match`,startTime:g(11)}),o({id:`evt-2`,title:`Training`,startTime:g(13)})]},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:/Change your answer/})[1]),await t.click(e.getByRole(`button`,{name:/^Going$/})),await f(n.onRespond).toHaveBeenCalledWith(`evt-2`,`ATTENDING`)}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <EventListView {...args} events={[]} isLoading />,
    Error: <EventListView {...args} events={[]} error={new Error('boom')} />,
    // The page-level "no hero" case bottoms out here: with nothing upcoming there is no hero
    // and no placeholder in its place — just this message. (The ≤7-day boundary itself is
    // proven by the selectHeroEvent unit test.)
    Empty: <EventListView {...args} events={[]} />,
    'Filtered to nothing': <EventListView {...args} events={[]} emptyMessage="No events for this type." />,
    // A background refetch can fail while react-query still holds cached data: \`error\` is set
    // but \`events\` is non-empty. The list must keep showing the cached events, not blank them out.
    'Data despite background error': <EventListView {...args} error={new Error('refetch failed')} events={[makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11)
    })]} />,
    // ⑪ on the card: the list payload carries every member (ADR-0030 §8), so the setter resolves
    // to a real name here exactly as it does on the detail page. Only the event a teammate
    // touched is marked — the negative on the self-set card is the design, not an oversight.
    Attribution: <EventListView {...args} currentUserId="u-me" events={[makeEvent({
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
    })]} />,
    // The pick in flight is the viewer's own, so the attribution it replaces is dropped the
    // moment they tap — not one round-trip later, when the refetched list finally agrees.
    'Attribution clears while settling': <EventListView {...args} currentUserId="u-me" optimistic={{
      eventId: 'evt-1',
      userId: 'u-me',
      state: 'ATTENDING'
    }} events={[makeEvent({
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
    })]} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByRole('status', {
      name: /loading events/i
    })).toBeInTheDocument();
    await expect(region('Error').getByText(/couldn't load events/i)).toBeInTheDocument();
    await expect(region('Empty').getByText('No upcoming events.')).toBeInTheDocument();
    await expect(region('Filtered to nothing').getByText('No events for this type.')).toBeInTheDocument();
    await expect(region('Data despite background error').getByText('League Match')).toBeInTheDocument();
    await expect(region('Data despite background error').queryByText(/couldn't load events/i)).not.toBeInTheDocument();
    await expect(region('Attribution').getByText("Tim de Vries said you're out")).toBeInTheDocument();
    // The self-set card stays in the first person.
    await expect(region('Attribution').getByText("You're in")).toBeInTheDocument();
    await expect(region('Attribution clears while settling').getByText("You're in")).toBeInTheDocument();
    await expect(region('Attribution clears while settling').queryByText(/ said /)).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    onRespond: fn(),
    events: [makeEvent({
      id: 'evt-1',
      title: 'League Match',
      startTime: on(11)
    }), makeEvent({
      id: 'evt-2',
      title: 'Training',
      startTime: on(13)
    })]
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Change your answer/
    })[1]);
    await userEvent.click(canvas.getByRole('button', {
      name: /^Going$/
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('evt-2', 'ATTENDING');
  }
}`,...b.parameters?.docs?.source}}},x=[`Data`,`Shells`,`Interactions`]})))()}S();export{v as Data,b as Interactions,y as Shells,x as __namedExportsOrder,_ as default};