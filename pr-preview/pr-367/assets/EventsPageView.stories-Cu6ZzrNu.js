import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-Cm8AJftX.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-D87d-8jv.js";import{a as s,i as c,o as l,r as u,s as d,t as f}from"./event-fixtures-CuRrQuRB.js";import{n as p,t as m}from"./PanelViewMenu-N2Pse_zl.js";import{n as h,t as ee}from"./plus-CRh3qUBh.js";import{a as g,i as _,n as te,o as v,r as y,s as ne,t as re}from"./EventFiltersView-CX86ThQZ.js";import{i as ie,r as ae}from"./EventCard-CznE-V_s.js";import{n as oe,t as se}from"./EventListView-DkZyqD5-.js";import{n as ce,t as le}from"./button-jmcBUdua.js";import{n as ue,r as de}from"./app-shell-decorator-BtfmzATm.js";import{n as fe,t as b}from"./BulkAttendBarView-DM8Qb9_x.js";import{n as pe,t as me}from"./NextEventHeroView-DvkkFnUn.js";import{n as he,t as ge}from"./EventLineupPanel-BMo_ESvE.js";function _e(e,t){let n=e.filter(e=>new Date(e.startTime).getTime()>=t.getTime()).reduce((e,t)=>e===null||new Date(t.startTime)<new Date(e.startTime)?t:e,null);return n===null?null:ae(n.startTime,t)<=7?n:null}function x(){return(x=e((()=>{ie()})))()}function ve(e,t,n,r){return e.filter(e=>t.has(e.eventType.id)&&n.has(e.myState)&&r.has(g(e.roster.state)))}function S(){return(S=e((()=>{_()})))()}function ye({hasHero:e,showPast:t,activeTypeIds:n,allTypeIds:r,activeStates:i,activeTurnouts:a}){if(e)return`Nothing else coming up.`;let o=n.size<r.length,s=i.size<v.length,c=a.size<y.length,l=[o,s,c].filter(Boolean).length;if(l===0)return t?`No events yet.`:`No upcoming events.`;if(l===1){if(o)return`No events for this type.`;if(s&&i.size===1&&i.has(`NOT_RESPONDED`))return`Nothing needs your answer.`;if(c&&[...a].every(e=>C.includes(e)))return`No events are short of players.`}return`No events match these filters.`}var C;function w(){return(w=e((()=>{ne(),_(),C=[`missing-position`,`spots-open`]})))()}function T(e){let t=new Map;for(let n of e){let e=t.get(n.eventType.id);e?e.events.push(n):t.set(n.eventType.id,{typeId:n.eventType.id,typeName:n.eventType.name,events:[n]})}return[...t.values()].sort((e,t)=>t.events.length-e.events.length||e.typeName.localeCompare(t.typeName))}function be(e,t,n){return e?e.filter(e=>t.has(e.eventType.id)&&e.myState===`NOT_RESPONDED`&&new Date(e.startTime)>=n):[]}function E({createAction:e,filters:t,panelMenu:n,hero:r,bulkBar:i,list:a}){return(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,D.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Events`}),(0,D.jsxs)(`div`,{className:`flex items-center gap-2`,children:[e,(0,D.jsx)(re,{...t}),(0,D.jsx)(m,{...n})]})]}),r,i,(0,D.jsx)(se,{...a})]})}var D;function O(){return(O=e((()=>{oe(),te(),p(),D=i(),E.__docgenInfo={description:`The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
containers with their own queries), and the story fills the same slots with their prop-only Views,
so the whole page renders with zero network.`,methods:[],displayName:`EventsPageView`,props:{createAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's "New Event" trigger; absent for members.`},filters:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventFiltersView`}],raw:`ComponentProps<typeof EventFiltersView>`},description:``},panelMenu:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`PanelViewMenu`}],raw:`ComponentProps<typeof PanelViewMenu>`},description:``},hero:{required:!1,tsType:{name:`ReactNode`},description:`The Next Up hero, when (and only when) one is due — no placeholder in its place.`},bulkBar:{required:!1,tsType:{name:`ReactNode`},description:`One button per event type with blanks left; renders nothing when there are none.`},list:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventListView`}],raw:`ComponentProps<typeof EventListView>`},description:``}}}})))()}function k(e,t){let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}function xe(e){let[t,n]=(0,A.useState)(new Set(G)),[r,i]=(0,A.useState)(new Set(v)),[a,o]=(0,A.useState)(new Set(y)),[s,c]=(0,A.useState)(!1),[l,u]=(0,A.useState)(!1),[d,f]=(0,A.useState)({}),p=(e,t,n)=>f(r=>({...r,[e]:{...r[e],[t]:n}})),m=[...ve(e.events.map(e=>{let t=d[e.id];return t?{...e,myState:t[`u-me`]??e.myState,attendances:e.attendances.map(e=>t[e.userId]?{...e,state:t[e.userId]}:e)}:e}),t,r,a)].sort((e,t)=>e.startTime.localeCompare(t.startTime)),h=_e(m,F),g=h?m.filter(e=>e.id!==h.id):m,_=T(be(m,t,F));return(0,j.jsx)(E,{createAction:e.isAdmin&&(0,j.jsxs)(le,{children:[(0,j.jsx)(ee,{size:16}),`New Event`]}),filters:{eventTypes:V,activeTypeIds:t,activeStates:r,activeTurnouts:a,showTurnout:!0,showPast:s,resultCount:m.length,onToggleType:t=>{e.onToggleType(t),n(e=>k(e,t))},onToggleState:t=>{e.onToggleState(t),i(e=>k(e,t))},onToggleTurnout:e=>o(t=>k(t,e)),onToggleShowPast:t=>{e.onToggleShowPast(t),c(t)},onClearFilters:()=>{n(new Set(G)),i(new Set(v)),o(new Set(y)),c(!1)}},panelMenu:{defaultExpanded:l,onDefaultExpandedChange:u},hero:h&&(0,j.jsx)(me,{event:h,myState:h.myState,now:F,onRespond:t=>{e.onHeroRespond(t),p(h.id,`u-me`,t)}}),bulkBar:(0,j.jsx)(b,{groups:_,onAttend:e.onAttend}),list:{events:g,now:F,currentUserId:`u-me`,defaultRosterOpen:l,onRespond:(t,n)=>{e.onRespond(t,n),p(t,`u-me`,n)},rosterPanel:t=>(0,j.jsx)(ge,{attendances:t.attendances,roster:t.roster,currentUserId:`u-me`,onRespond:(n,r)=>{e.onRespondFor(t.id,n,r),p(t.id,n,r)}}),emptyMessage:ye({hasHero:h!==null,showPast:s,activeTypeIds:t,allTypeIds:G,activeStates:r,activeTurnouts:a})}})}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,Se;function $(){return($=e((()=>{A=t(),h(),ce(),u(),a(),x(),ne(),_(),S(),w(),fe(),pe(),he(),de(),r(),O(),j=i(),{expect:M,fn:N,within:P}=__STORYBOOK_MODULE_TEST__,F=new Date(2026,7,10,9,0),I=(e,t=7,n=20)=>new Date(2026,t,e,n,0).toISOString(),L=l({id:`et-1`,name:`Training`,color:`#249E6C`}),R=l({id:`et-2`,name:`Match`,color:`#225C9C`}),z=l({id:`et-3`,name:`Social`,color:`#D9A23B`}),B=l({id:`et-4`,name:`Tournament`,color:`#7B5EA7`}),V=[L,R,z,B],H=e=>({id:e.id,name:e.name,color:e.color}),U=[c(`u-me`,`Julius`,`Setter`),c(`u-2`,`Sanne`,`Setter`),c(`u-3`,`Lars`,`Libero`),c(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),c(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),c(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],W=[s({id:`evt-hero`,eventType:H(L),title:`Training — Court 2`,startTime:I(12),endTime:I(12,7,22),location:`Sporthal De Toekomst`,attendances:U,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[]},roster:d()}),s({id:`evt-match`,eventType:H(R),title:`League Match vs Smash United`,startTime:I(15),endTime:I(15,7,22),location:`Sporthal Oost`,myState:`ATTENDING`,attendances:U,roster:d({state:`LINEUP_SET`,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}]})}),s({id:`evt-training-2`,eventType:H(L),title:`Training — Court 1`,startTime:I(19),endTime:I(19,7,22),attendances:U,roster:d({state:`CRITICAL`,totalAttending:3,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})}),s({id:`evt-social`,eventType:H(z),title:`Season kick-off drinks`,startTime:I(22),endTime:I(22,7,23),location:`Café De Zon`,attendances:U,attendanceSummary:{attending:8,maybe:0,absent:0,notResponded:3,roleBreakdown:[]},roster:{...f,totalAttending:8}}),s({id:`evt-tournament`,eventType:H(B),title:`Beach tournament Scheveningen`,startTime:I(5,8,10),endTime:I(5,8,18),myState:`MAYBE`,attendances:U,roster:d()})],G=V.map(e=>e.id),K=ue(`events`),q={title:`pages/events/EventsPageView`,component:xe,decorators:K.decorators,parameters:K.parameters,args:{events:W,isAdmin:!0,onToggleType:N(),onToggleState:N(),onToggleShowPast:N(),onRespondFor:N(),onHeroRespond:N(),onRespond:N(),onAttend:N()}},J={parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await M(e.getByRole(`heading`,{name:`Events`})).toBeInTheDocument(),await M(e.getByRole(`button`,{name:`New Event`})).toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await M(e.getByText(`Next up`)).toBeInTheDocument(),await M(e.getAllByText(`Training — Court 2`)).toHaveLength(1),await M(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await M(e.getByRole(`button`,{name:`Attend 2 trainings`})).toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Attend 1 social`})).toBeInTheDocument();for(let t of[`League Match vs Smash United`,`Training — Court 1`,`Season kick-off drinks`,`Beach tournament Scheveningen`])await M(e.getByText(t)).toBeInTheDocument();await M(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await M(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Y=()=>{},X={filters:{eventTypes:V,activeTypeIds:new Set(G),activeStates:new Set(v),activeTurnouts:new Set(y),showTurnout:!0,showPast:!1,resultCount:0,onToggleType:Y,onToggleState:Y,onToggleTurnout:Y,onToggleShowPast:Y,onClearFilters:Y},panelMenu:{defaultExpanded:!1,onDefaultExpandedChange:Y}},Z={render:()=>(0,j.jsx)(o,{items:{Loading:(0,j.jsx)(E,{...X,list:{events:[],isLoading:!0,now:F}}),Error:(0,j.jsx)(E,{...X,list:{events:[],error:Error(`boom`),now:F}}),Empty:(0,j.jsx)(E,{...X,list:{events:[],now:F}}),"Filtered to nothing":(0,j.jsx)(E,{...X,filters:{...X.filters,activeTypeIds:new Set([z.id])},list:{events:[],now:F,emptyMessage:`No events for this type.`}}),"Nothing within the week":(0,j.jsx)(E,{...X,bulkBar:(0,j.jsx)(b,{groups:T([W[4]]),onAttend:Y}),list:{events:[W[4]],now:F,currentUserId:`u-me`}})}}),play:async({canvas:e})=>{let t=t=>P(e.getByRole(`region`,{name:t}));await M(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await M(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await M(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await M(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await M(t(`Filtered to nothing`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await M(t(`Nothing within the week`).queryByText(`Next up`)).not.toBeInTheDocument(),await M(t(`Nothing within the week`).getByText(`Beach tournament Scheveningen`)).toBeInTheDocument(),await M(e.queryByText(`Next up`)).not.toBeInTheDocument()}},Q={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/I'm in/})),await M(n.onHeroRespond).toHaveBeenCalledWith(`ATTENDING`),await M(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`),await M(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Training`})),await M(n.onToggleType).toHaveBeenCalledWith(L.id),await t.keyboard(`{Escape}`),await M(e.queryByText(`Training — Court 1`)).not.toBeInTheDocument(),await M(e.getAllByText(`League Match vs Smash United`)).toHaveLength(1),await M(e.getByRole(`button`,{name:/Can't make it/})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await M(e.getByText(`Training — Court 1`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await t.keyboard(`{Escape}`),await M(e.getAllByRole(`button`,{name:/Hide lineup/}).length).toBeGreaterThan(0),await t.click(e.getAllByRole(`button`,{name:/Sofia — Maybe/})[0]);let r=P(await P(document.body).findByRole(`dialog`));await M(r.getByText(/you are answering for them/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Can't go`})),await M(n.onRespondFor).toHaveBeenCalledWith(`evt-match`,`u-4`,`ABSENT`),await t.click(e.getAllByRole(`button`,{name:/Change your answer/})[0]),await t.click(e.getByRole(`button`,{name:/^Maybe$/})),await M(n.onRespond).toHaveBeenCalledWith(`evt-match`,`MAYBE`),await t.click(e.getByRole(`button`,{name:`Attend 1 social`})),await M(n.onAttend).toHaveBeenCalledWith(z.id)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Events'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'New Event'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Filters'
    })).toHaveAttribute('aria-expanded', 'false');
    // The hero holds the one event within the window, and the list does not repeat it.
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getAllByText('Training — Court 2')).toHaveLength(1);
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'false');
    // Bulk Attend reads the same list the page shows: two unanswered trainings, one social.
    await expect(canvas.getByRole('button', {
      name: 'Attend 2 trainings'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 social'
    })).toBeInTheDocument();
    for (const title of ['League Match vs Smash United', 'Training — Court 1', 'Season kick-off drinks', 'Beach tournament Scheveningen']) {
      await expect(canvas.getByText(title)).toBeInTheDocument();
    }
    // The shell around it: the team is named up top and the Events tab is the current one.
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...J.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <Stack items={{
    Loading: <EventsPageView {...STATIC} list={{
      events: [],
      isLoading: true,
      now: NOW
    }} />,
    Error: <EventsPageView {...STATIC} list={{
      events: [],
      error: new Error('boom'),
      now: NOW
    }} />,
    Empty: <EventsPageView {...STATIC} list={{
      events: [],
      now: NOW
    }} />,
    'Filtered to nothing': <EventsPageView {...STATIC} filters={{
      ...STATIC.filters,
      activeTypeIds: new Set([SOCIAL.id])
    }} list={{
      events: [],
      now: NOW,
      emptyMessage: 'No events for this type.'
    }} />,
    'Nothing within the week': <EventsPageView {...STATIC} bulkBar={<BulkAttendBarView groups={groupByType([EVENTS[4]])} onAttend={noop} />} list={{
      events: [EVENTS[4]],
      now: NOW,
      currentUserId: 'u-me'
    }} />
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
    // A filter in effect is never invisible (ADR-0030 §2): the undo sits beside the trigger.
    await expect(region('Filtered to nothing').getByRole('button', {
      name: 'Clear filters'
    })).toBeInTheDocument();
    await expect(region('Nothing within the week').queryByText('Next up')).not.toBeInTheDocument();
    await expect(region('Nothing within the week').getByText('Beach tournament Scheveningen')).toBeInTheDocument();
    await expect(canvas.queryByText('Next up')).not.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
    // RSVP from the hero: the callback fires and the harness flips the hero's own state.
    await userEvent.click(canvas.getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onHeroRespond).toHaveBeenCalledWith('ATTENDING');
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'true');
    // …and Bulk Attend no longer counts that training.
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 training'
    })).toBeInTheDocument();

    // Hide trainings: the callback fires, the hero re-picks the next event in the window.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Training'
    }));
    await expect(args.onToggleType).toHaveBeenCalledWith(TRAINING.id);
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByText('Training — Court 1')).not.toBeInTheDocument();
    await expect(canvas.getAllByText('League Match vs Smash United')).toHaveLength(1);
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toBeInTheDocument();
    // Undo it so the list below is whole again.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Clear filters'
    }));
    await expect(canvas.getByText('Training — Court 1')).toBeInTheDocument();

    // The view menu holds the one remaining preference: every card's panel starts open.
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getAllByRole('button', {
      name: /Hide lineup/
    }).length).toBeGreaterThan(0);

    // Answering for a teammate from a card's lineup: the chip opens the answer sheet, which names
    // them, and the pick reports the event, the member and the state through the panel slot.
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Sofia — Maybe/
    })[0]);
    const sheet = within(await within(document.body).findByRole('dialog'));
    await expect(sheet.getByText(/you are answering for them/)).toBeInTheDocument();
    await userEvent.click(sheet.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespondFor).toHaveBeenCalledWith('evt-match', 'u-4', 'ABSENT');

    // Answering from a card: the match and the tournament are already answered, so their rows read
    // "Change your answer"; the list is chronological, so the first is the match. Picking Maybe
    // reports the event and the state.
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Change your answer/
    })[0]);
    await userEvent.click(canvas.getByRole('button', {
      name: /^Maybe$/
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('evt-match', 'MAYBE');

    // Bulk Attend reports the type it stands for.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Attend 1 social'
    }));
    await expect(args.onAttend).toHaveBeenCalledWith(SOCIAL.id);
  }
}`,...Q.parameters?.docs?.source}}},Se=[`Data`,`Shells`,`Interactions`]})))()}$();export{J as Data,Q as Interactions,Z as Shells,Se as __namedExportsOrder,q as default};