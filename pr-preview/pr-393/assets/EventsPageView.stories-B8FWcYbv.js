import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-u5hs3rCW.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./link-DagzGqq1.js";import{n as l,t as u}from"./router-decorator-RVR9V5xQ.js";import{a as d,n as f}from"./team-routes-DzCW9IHK.js";import{r as p,t as m}from"./app-column-decorator-Dl8iJZhi.js";import{a as h,i as g,o as _,r as ee,s as v,t as te}from"./event-fixtures-C1ds5yXh.js";import{n as ne,t as re}from"./calendar-days-55HaGBk-.js";import{n as ie,t as ae}from"./PanelViewMenu-B0ZrLFGD.js";import{n as oe,t as se}from"./plus-Dz4AfR65.js";import{a as ce,i as y,n as le,o as b,r as x,s as S,t as ue}from"./EventFiltersView-DAskin6f.js";import{i as de,r as fe}from"./EventCard-YLuZAhJQ.js";import{n as pe,t as me}from"./EventListView-Om-RJkNj.js";import{n as he,t as ge}from"./button-C1NV3wA_.js";import{n as _e,r as ve}from"./app-shell-decorator-BbRrB_pc.js";import{n as ye,t as be}from"./BulkAttendBarView-Bpa74fJe.js";import{n as xe,t as Se}from"./NextEventHeroView-DdE886Uo.js";import{n as Ce,t as we}from"./EventLineupPanel-BF4FKsWH.js";function Te(e,t){let n=e.filter(e=>new Date(e.startTime).getTime()>=t.getTime()).reduce((e,t)=>e===null||new Date(t.startTime)<new Date(e.startTime)?t:e,null);return n===null?null:fe(n.startTime,t)<=7?n:null}function Ee(){return(Ee=e((()=>{de()})))()}function De(e,t,n,r){return e.filter(e=>t.has(e.eventType.id)&&n.has(e.myState)&&r.has(ce(e.roster.state)))}function Oe(){return(Oe=e((()=>{y()})))()}function ke({hasHero:e,showPast:t,activeTypeIds:n,allTypeIds:r,activeStates:i,activeTurnouts:a}){if(e)return`Nothing else coming up.`;let o=n.size<r.length,s=i.size<b.length,c=a.size<x.length,l=[o,s,c].filter(Boolean).length;if(l===0)return t?`No events yet.`:`No upcoming events.`;if(l===1){if(o)return`No events for this type.`;if(s&&i.size===1&&i.has(`NOT_RESPONDED`))return`Nothing needs your answer.`;if(c&&[...a].every(e=>C.includes(e)))return`No events are short of players.`}return`No events match these filters.`}var C;function w(){return(w=e((()=>{S(),y(),C=[`missing-position`,`spots-open`]})))()}function T(e){let t=new Map;for(let n of e){let e=t.get(n.eventType.id);e?e.events.push(n):t.set(n.eventType.id,{typeId:n.eventType.id,typeName:n.eventType.name,events:[n]})}return[...t.values()].sort((e,t)=>t.events.length-e.events.length||e.typeName.localeCompare(t.typeName))}function Ae(e,t,n){return e?e.filter(e=>t.has(e.eventType.id)&&e.myState===`NOT_RESPONDED`&&new Date(e.startTime)>=n):[]}function E({createAction:e,filters:t,panelMenu:n,hero:r,bulkBar:i,list:a,hideCalendarLink:o}){let s=d();return(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,D.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Events`}),(0,D.jsxs)(`div`,{className:`flex items-center gap-2`,children:[e,(0,D.jsx)(ue,{...t}),(0,D.jsx)(ae,{...n}),!o&&(0,D.jsx)(c,{to:s.calendar,"aria-label":`Calendar links`,className:`flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:(0,D.jsx)(re,{size:16})})]})]}),r,i,(0,D.jsx)(me,{...a})]})}var D;function O(){return(O=e((()=>{s(),ne(),f(),pe(),le(),ie(),D=i(),E.__docgenInfo={description:`The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
containers with their own queries), and the story fills the same slots with their prop-only Views,
so the whole page renders with zero network.`,methods:[],displayName:`EventsPageView`,props:{createAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's "New Event" trigger; absent for members.`},filters:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventFiltersView`}],raw:`ComponentProps<typeof EventFiltersView>`},description:``},panelMenu:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`PanelViewMenu`}],raw:`ComponentProps<typeof PanelViewMenu>`},description:``},hero:{required:!1,tsType:{name:`ReactNode`},description:`The Next Up hero, when (and only when) one is due — no placeholder in its place.`},bulkBar:{required:!1,tsType:{name:`ReactNode`},description:`One button per event type with blanks left; renders nothing when there are none.`},list:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventListView`}],raw:`ComponentProps<typeof EventListView>`},description:``},hideCalendarLink:{required:!1,tsType:{name:`boolean`},description:`A Platform Admin acting as this team has no calendar links of their own (ADR-0024).`}}}})))()}function k(e,t){let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}function je(e){let[t,n]=(0,A.useState)(new Set(G)),[r,i]=(0,A.useState)(new Set(b)),[a,o]=(0,A.useState)(new Set(x)),[s,c]=(0,A.useState)(!1),[l,u]=(0,A.useState)(!1),[d,f]=(0,A.useState)({}),p=(e,t,n)=>f(r=>({...r,[e]:{...r[e],[t]:n}})),m=[...De(e.events.map(e=>{let t=d[e.id];return t?{...e,myState:t[`u-me`]??e.myState,attendances:e.attendances.map(e=>t[e.userId]?{...e,state:t[e.userId]}:e)}:e}),t,r,a)].sort((e,t)=>e.startTime.localeCompare(t.startTime)),h=Te(m,F),g=h?m.filter(e=>e.id!==h.id):m,_=T(Ae(g,t,F));return(0,j.jsx)(E,{createAction:e.isAdmin&&(0,j.jsxs)(ge,{children:[(0,j.jsx)(se,{size:16}),`New Event`]}),filters:{eventTypes:V,activeTypeIds:t,activeStates:r,activeTurnouts:a,showTurnout:!0,showPast:s,resultCount:m.length,onToggleType:t=>{e.onToggleType(t),n(e=>k(e,t))},onToggleState:t=>{e.onToggleState(t),i(e=>k(e,t))},onToggleTurnout:e=>o(t=>k(t,e)),onToggleShowPast:t=>{e.onToggleShowPast(t),c(t)},onClearFilters:()=>{n(new Set(G)),i(new Set(b)),o(new Set(x)),c(!1)}},panelMenu:{defaultExpanded:l,onDefaultExpandedChange:u},hero:h&&(0,j.jsx)(Se,{event:h,myState:h.myState,now:F,defaultRosterOpen:l,onRespond:t=>{e.onHeroRespond(t),p(h.id,`u-me`,t)},lineup:(0,j.jsx)(we,{attendances:h.attendances,roster:h.roster,currentUserId:`u-me`,substitutes:h.substitutes,summary:!1,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(t,n)=>{e.onRespondFor(h.id,t,n),p(h.id,t,n)}})}),bulkBar:(0,j.jsx)(be,{groups:_,onAttend:e.onAttend}),list:{events:g,now:F,currentUserId:`u-me`,defaultRosterOpen:l,onRespond:(t,n)=>{e.onRespond(t,n),p(t,`u-me`,n)},rosterPanel:t=>(0,j.jsx)(we,{attendances:t.attendances,roster:t.roster,currentUserId:`u-me`,substitutes:t.substitutes,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(n,r)=>{e.onRespondFor(t.id,n,r),p(t.id,n,r)}}),emptyMessage:ke({hasHero:h!==null,showPast:s,activeTypeIds:t,allTypeIds:G,activeStates:r,activeTurnouts:a})}})}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,Me,q,J,Y,X,Z,Q,Ne;function $(){return($=e((()=>{A=t(),oe(),he(),ee(),a(),p(),u(),Ee(),S(),y(),Oe(),w(),ye(),xe(),Ce(),ve(),r(),O(),j=i(),{expect:M,fn:N,within:P}=__STORYBOOK_MODULE_TEST__,F=new Date(2026,7,10,9,0),I=(e,t=7,n=20)=>new Date(2026,t,e,n,0).toISOString(),L=_({id:`et-1`,name:`Training`,color:`#249E6C`}),R=_({id:`et-2`,name:`Match`,color:`#225C9C`}),z=_({id:`et-3`,name:`Social`,color:`#D9A23B`}),B=_({id:`et-4`,name:`Tournament`,color:`#7B5EA7`}),V=[L,R,z,B],H=e=>({id:e.id,name:e.name,color:e.color}),U=[g(`u-me`,`Julius`,`Setter`),g(`u-2`,`Sanne`,`Setter`),g(`u-3`,`Lars`,`Libero`),g(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),g(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),g(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],W=[h({id:`evt-hero`,eventType:H(L),title:`Training — Court 2`,startTime:I(12),endTime:I(12,7,22),location:`Sporthal De Toekomst`,attendances:U,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[]},roster:v()}),h({id:`evt-match`,eventType:H(R),title:`League Match vs Smash United`,startTime:I(15),endTime:I(15,7,22),location:`Sporthal Oost`,myState:`ATTENDING`,attendances:U,roster:v({state:`LINEUP_SET`,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}]})}),h({id:`evt-training-2`,eventType:H(L),title:`Training — Court 1`,startTime:I(19),endTime:I(19,7,22),attendances:U,roster:v({state:`CRITICAL`,totalAttending:3,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})}),h({id:`evt-social`,eventType:H(z),title:`Season kick-off drinks`,startTime:I(22),endTime:I(22,7,23),location:`Café De Zon`,attendances:U,attendanceSummary:{attending:8,maybe:0,absent:0,notResponded:3,roleBreakdown:[]},roster:{...te,totalAttending:8}}),h({id:`evt-tournament`,eventType:H(B),title:`Beach tournament Scheveningen`,startTime:I(5,8,10),endTime:I(5,8,18),myState:`MAYBE`,attendances:U,roster:v()})],G=V.map(e=>e.id),K=_e(`events`),Me={title:`pages/events/EventsPageView`,component:je,parameters:K.parameters,args:{events:W,isAdmin:!0,onToggleType:N(),onToggleState:N(),onToggleShowPast:N(),onRespondFor:N(),onHeroRespond:N(),onRespond:N(),onAttend:N()}},q=e=>P(e.getByRole(`region`,{name:`Next up`})),J={decorators:K.decorators,parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await M(e.getByRole(`heading`,{name:`Events`})).toBeInTheDocument(),await M(e.getByRole(`button`,{name:`New Event`})).toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await M(e.getByRole(`link`,{name:`Calendar links`})).toHaveAttribute(`href`,`/t/setpoint-vt/calendar`),await M(e.getByText(`Next up`)).toBeInTheDocument(),await M(e.getAllByText(`Training — Court 2`)).toHaveLength(1),await M(q(e).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await M(e.getAllByRole(`button`,{name:/Show lineup/})).toHaveLength(4),await M(e.queryByText(`Lineup`)).not.toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await M(e.queryByRole(`button`,{name:`Attend 2 trainings`})).not.toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Attend 1 social`})).toBeInTheDocument();for(let t of[`League Match vs Smash United`,`Training — Court 1`,`Season kick-off drinks`,`Beach tournament Scheveningen`])await M(e.getByText(t)).toBeInTheDocument();await M(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await M(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Y=()=>{},X={filters:{eventTypes:V,activeTypeIds:new Set(G),activeStates:new Set(b),activeTurnouts:new Set(x),showTurnout:!0,showPast:!1,resultCount:0,onToggleType:Y,onToggleState:Y,onToggleTurnout:Y,onToggleShowPast:Y,onClearFilters:Y},panelMenu:{defaultExpanded:!1,onDefaultExpandedChange:Y}},Z={decorators:[...m.decorators,l],render:()=>(0,j.jsx)(o,{items:{Loading:(0,j.jsx)(E,{...X,list:{events:[],isLoading:!0,now:F}}),Error:(0,j.jsx)(E,{...X,list:{events:[],error:Error(`boom`),now:F}}),Empty:(0,j.jsx)(E,{...X,list:{events:[],now:F}}),"Filtered to nothing":(0,j.jsx)(E,{...X,filters:{...X.filters,activeTypeIds:new Set([z.id])},list:{events:[],now:F,emptyMessage:`No events for this type.`}}),"Nothing within the week":(0,j.jsx)(E,{...X,bulkBar:(0,j.jsx)(be,{groups:T([W[4]]),onAttend:Y}),list:{events:[W[4]],now:F,currentUserId:`u-me`}})}}),play:async({canvas:e})=>{let t=t=>P(e.getByRole(`region`,{name:t}));await M(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await M(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await M(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await M(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await M(t(`Filtered to nothing`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await M(t(`Nothing within the week`).queryByText(`Next up`)).not.toBeInTheDocument(),await M(t(`Nothing within the week`).getByText(`Beach tournament Scheveningen`)).toBeInTheDocument(),await M(e.queryByText(`Next up`)).not.toBeInTheDocument()}},Q={decorators:K.decorators,parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await M(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(q(e).getByRole(`button`,{name:`Going`})),await M(n.onHeroRespond).toHaveBeenCalledWith(`ATTENDING`),await M(q(e).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await M(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Training`})),await M(n.onToggleType).toHaveBeenCalledWith(L.id),await t.keyboard(`{Escape}`),await M(e.queryByText(`Training — Court 1`)).not.toBeInTheDocument(),await M(e.getAllByText(`League Match vs Smash United`)).toHaveLength(1),await M(q(e).getByRole(`button`,{name:`Can't`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await M(e.getByText(`Training — Court 1`)).toBeInTheDocument(),await M(e.queryByRole(`button`,{name:/Sofia — Maybe/})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await t.keyboard(`{Escape}`),await M(e.getAllByRole(`button`,{name:/Hide lineup/})).toHaveLength(4),await M(P(e.getByRole(`region`,{name:`Next up`})).getByText(`Lineup`)).toBeInTheDocument(),await t.click(e.getAllByRole(`button`,{name:/Sofia — Maybe/})[1]);let r=P(await P(document.body).findByRole(`dialog`));await M(r.getByText(/you are answering for them/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Can't`})),await M(n.onRespondFor).toHaveBeenCalledWith(`evt-match`,`u-4`,`ABSENT`);let i=e.getAllByRole(`button`,{name:/Change your answer/})[0];await t.click(i);let a=P(document.getElementById(i.getAttribute(`aria-controls`)));await t.click(a.getByRole(`button`,{name:`Maybe`})),await M(n.onRespond).toHaveBeenCalledWith(`evt-match`,`MAYBE`),await t.click(e.getByRole(`button`,{name:`Attend 1 social`})),await M(n.onAttend).toHaveBeenCalledWith(z.id)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
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
    // Every member, not just admins, reaches their calendar links from here.
    await expect(canvas.getByRole('link', {
      name: 'Calendar links'
    })).toHaveAttribute('href', '/t/setpoint-vt/calendar');
    // The hero holds the one event within the window, and the list does not repeat it.
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getAllByText('Training — Court 2')).toHaveLength(1);
    await expect(hero(canvas).getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // The hero's lineup is behind the same disclosure as the cards', closed by default (#386), so
    // the hero leaves room on a phone for the bar and the next card.
    await expect(canvas.getAllByRole('button', {
      name: /Show lineup/
    })).toHaveLength(4);
    await expect(canvas.queryByText('Lineup')).not.toBeInTheDocument();
    // Bulk Attend reads the list below the hero (#386): the hero's own training has its answer
    // buttons right there, so the bar counts only the other unanswered training and the social.
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 training'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Attend 2 trainings'
    })).not.toBeInTheDocument();
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
  decorators: [...appColumn.decorators, withRouter],
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
  decorators: shell.decorators,
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
    // RSVP from the hero: the callback fires and the harness flips the hero's own state. Bulk
    // Attend never counted the hero's training (#386), so the bar reads the same before and after.
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 training'
    })).toBeInTheDocument();
    await userEvent.click(hero(canvas).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onHeroRespond).toHaveBeenCalledWith('ATTENDING');
    await expect(hero(canvas).getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
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
    await expect(hero(canvas).getByRole('button', {
      name: "Can't"
    })).toBeInTheDocument();
    // Undo it so the list below is whole again.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Clear filters'
    }));
    await expect(canvas.getByText('Training — Court 1')).toBeInTheDocument();

    // The view menu holds the one remaining preference: every panel starts open — the hero's
    // included (#386), which is why nothing below needs a tap to reach a chip.
    await expect(canvas.queryByRole('button', {
      name: /Sofia — Maybe/
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getAllByRole('button', {
      name: /Hide lineup/
    })).toHaveLength(4);
    await expect(within(canvas.getByRole('region', {
      name: 'Next up'
    })).getByText('Lineup')).toBeInTheDocument();

    // Answering for a teammate from a card's lineup: the chip opens the answer sheet, which names
    // them, and the pick reports the event, the member and the state through the panel slot. The
    // hero's lineup comes first in the DOM, so the match card's chip is the second.
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Sofia — Maybe/
    })[1]);
    const sheet = within(await within(document.body).findByRole('dialog'));
    await expect(sheet.getByText(/you are answering for them/)).toBeInTheDocument();
    await userEvent.click(sheet.getByRole('button', {
      name: "Can't"
    }));
    await expect(args.onRespondFor).toHaveBeenCalledWith('evt-match', 'u-4', 'ABSENT');

    // Answering from a card: the match and the tournament are already answered, so their rows read
    // "Change your answer"; the list is chronological, so the first is the match. Picking Maybe
    // reports the event and the state.
    const change = canvas.getAllByRole('button', {
      name: /Change your answer/
    })[0];
    await userEvent.click(change);
    // The hero offers Maybe too, so the pick is scoped to the panel this trigger controls.
    const options = within(document.getElementById(change.getAttribute('aria-controls')!)!);
    await userEvent.click(options.getByRole('button', {
      name: 'Maybe'
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('evt-match', 'MAYBE');

    // Bulk Attend reports the type it stands for.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Attend 1 social'
    }));
    await expect(args.onAttend).toHaveBeenCalledWith(SOCIAL.id);
  }
}`,...Q.parameters?.docs?.source}}},Ne=[`Data`,`Shells`,`Interactions`]})))()}$();export{J as Data,Q as Interactions,Z as Shells,Ne as __namedExportsOrder,Me as default};