import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-D-gPkH2q.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./link-D4PNaBTM.js";import{n as l,t as u}from"./router-decorator-Cn_kX_Pg.js";import{a as d,n as ee}from"./team-routes-OkJtVONy.js";import{r as f,t as p}from"./app-column-decorator-w3YKfoui.js";import{a as m,i as h,o as g,r as te,s as _,t as ne}from"./event-fixtures-C1ds5yXh.js";import{n as re,t as ie}from"./calendar-days-CbQ8MXsA.js";import{n as ae,t as oe}from"./PanelViewMenu-B2DRz0cl.js";import{n as se,t as ce}from"./plus-CFY5WL4g.js";import{a as le,i as v,n as ue,o as y,r as b,s as de,t as fe}from"./EventFiltersView-DpnzNonU.js";import{i as pe,r as me}from"./EventCard-C8fwd-kZ.js";import{n as he,t as ge}from"./EventListView-DXY-N4i9.js";import{n as _e,t as ve}from"./button-HJX3GoHV.js";import{n as ye,r as be}from"./app-shell-decorator-DSWziJMv.js";import{n as xe,t as Se}from"./BulkAttendBarView-8X0lri1Y.js";import{n as Ce,t as we}from"./NextEventHeroView-DXLO6CFW.js";import{n as Te,t as x}from"./EventLineupPanel-CqZ8ckSC.js";function Ee(e,t){let n=e.filter(e=>new Date(e.startTime).getTime()>=t.getTime()).reduce((e,t)=>e===null||new Date(t.startTime)<new Date(e.startTime)?t:e,null);return n===null?null:me(n.startTime,t)<=7?n:null}function S(){return(S=e((()=>{pe()})))()}function De(e,t,n,r){return e.filter(e=>t.has(e.eventType.id)&&n.has(e.myState)&&r.has(le(e.roster.state)))}function C(){return(C=e((()=>{v()})))()}function Oe({hasHero:e,showPast:t,activeTypeIds:n,allTypeIds:r,activeStates:i,activeTurnouts:a}){if(e)return`Nothing else coming up.`;let o=n.size<r.length,s=i.size<y.length,c=a.size<b.length,l=[o,s,c].filter(Boolean).length;if(l===0)return t?`No events yet.`:`No upcoming events.`;if(l===1){if(o)return`No events for this type.`;if(s&&i.size===1&&i.has(`NOT_RESPONDED`))return`Nothing needs your answer.`;if(c&&[...a].every(e=>w.includes(e)))return`No events are short of players.`}return`No events match these filters.`}var w;function T(){return(T=e((()=>{de(),v(),w=[`missing-position`,`spots-open`]})))()}function E(e){let t=new Map;for(let n of e){let e=t.get(n.eventType.id);e?e.events.push(n):t.set(n.eventType.id,{typeId:n.eventType.id,typeName:n.eventType.name,events:[n]})}return[...t.values()].sort((e,t)=>t.events.length-e.events.length||e.typeName.localeCompare(t.typeName))}function ke(e,t,n){return e?e.filter(e=>t.has(e.eventType.id)&&e.myState===`NOT_RESPONDED`&&new Date(e.startTime)>=n):[]}function D({createAction:e,filters:t,panelMenu:n,hero:r,bulkBar:i,list:a,hideCalendarLink:o}){let s=d();return(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,O.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Events`}),(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[e,(0,O.jsx)(fe,{...t}),(0,O.jsx)(oe,{...n}),!o&&(0,O.jsx)(c,{to:s.calendar,"aria-label":`Calendar links`,className:`flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:(0,O.jsx)(ie,{size:16})})]})]}),r,i,(0,O.jsx)(ge,{...a})]})}var O;function k(){return(k=e((()=>{s(),re(),ee(),he(),ue(),ae(),O=i(),D.__docgenInfo={description:`The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
containers with their own queries), and the story fills the same slots with their prop-only Views,
so the whole page renders with zero network.`,methods:[],displayName:`EventsPageView`,props:{createAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's "New Event" trigger; absent for members.`},filters:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventFiltersView`}],raw:`ComponentProps<typeof EventFiltersView>`},description:``},panelMenu:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`PanelViewMenu`}],raw:`ComponentProps<typeof PanelViewMenu>`},description:``},hero:{required:!1,tsType:{name:`ReactNode`},description:`The Next Up hero, when (and only when) one is due — no placeholder in its place.`},bulkBar:{required:!1,tsType:{name:`ReactNode`},description:`One button per event type with blanks left; renders nothing when there are none.`},list:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventListView`}],raw:`ComponentProps<typeof EventListView>`},description:``},hideCalendarLink:{required:!1,tsType:{name:`boolean`},description:`A Platform Admin acting as this team has no calendar links of their own (ADR-0024).`}}}})))()}function A(e,t){let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}function Ae(e){let[t,n]=(0,j.useState)(new Set(K)),[r,i]=(0,j.useState)(new Set(y)),[a,o]=(0,j.useState)(new Set(b)),[s,c]=(0,j.useState)(!1),[l,u]=(0,j.useState)(!1),[d,ee]=(0,j.useState)({}),f=(e,t,n)=>ee(r=>({...r,[e]:{...r[e],[t]:n}})),p=[...De(e.events.map(e=>{let t=d[e.id];return t?{...e,myState:t[`u-me`]??e.myState,attendances:e.attendances.map(e=>t[e.userId]?{...e,state:t[e.userId]}:e)}:e}),t,r,a)].sort((e,t)=>e.startTime.localeCompare(t.startTime)),m=Ee(p,I),h=m?p.filter(e=>e.id!==m.id):p,g=E(ke(p,t,I));return(0,M.jsx)(D,{createAction:e.isAdmin&&(0,M.jsxs)(ve,{children:[(0,M.jsx)(ce,{size:16}),`New Event`]}),filters:{eventTypes:H,activeTypeIds:t,activeStates:r,activeTurnouts:a,showTurnout:!0,showPast:s,resultCount:p.length,onToggleType:t=>{e.onToggleType(t),n(e=>A(e,t))},onToggleState:t=>{e.onToggleState(t),i(e=>A(e,t))},onToggleTurnout:e=>o(t=>A(t,e)),onToggleShowPast:t=>{e.onToggleShowPast(t),c(t)},onClearFilters:()=>{n(new Set(K)),i(new Set(y)),o(new Set(b)),c(!1)}},panelMenu:{defaultExpanded:l,onDefaultExpandedChange:u},hero:m&&(0,M.jsx)(we,{event:m,myState:m.myState,now:I,onRespond:t=>{e.onHeroRespond(t),f(m.id,`u-me`,t)},lineup:(0,M.jsx)(x,{attendances:m.attendances,roster:m.roster,currentUserId:`u-me`,substitutes:m.substitutes,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(t,n)=>{e.onRespondFor(m.id,t,n),f(m.id,t,n)}})}),bulkBar:(0,M.jsx)(Se,{groups:g,onAttend:e.onAttend}),list:{events:h,now:I,currentUserId:`u-me`,defaultRosterOpen:l,onRespond:(t,n)=>{e.onRespond(t,n),f(t,`u-me`,n)},rosterPanel:t=>(0,M.jsx)(x,{attendances:t.attendances,roster:t.roster,currentUserId:`u-me`,substitutes:t.substitutes,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(n,r)=>{e.onRespondFor(t.id,n,r),f(t.id,n,r)}}),emptyMessage:Oe({hasHero:m!==null,showPast:s,activeTypeIds:t,allTypeIds:K,activeStates:r,activeTurnouts:a})}})}var j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,je,J,Y,X,Z,Q,$,Me;function Ne(){return(Ne=e((()=>{j=t(),se(),_e(),te(),a(),f(),u(),S(),de(),v(),C(),T(),xe(),Ce(),Te(),be(),r(),k(),M=i(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=new Date(2026,7,10,9,0),L=(e,t=7,n=20)=>new Date(2026,t,e,n,0).toISOString(),R=g({id:`et-1`,name:`Training`,color:`#249E6C`}),z=g({id:`et-2`,name:`Match`,color:`#225C9C`}),B=g({id:`et-3`,name:`Social`,color:`#D9A23B`}),V=g({id:`et-4`,name:`Tournament`,color:`#7B5EA7`}),H=[R,z,B,V],U=e=>({id:e.id,name:e.name,color:e.color}),W=[h(`u-me`,`Julius`,`Setter`),h(`u-2`,`Sanne`,`Setter`),h(`u-3`,`Lars`,`Libero`),h(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),h(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),h(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],G=[m({id:`evt-hero`,eventType:U(R),title:`Training — Court 2`,startTime:L(12),endTime:L(12,7,22),location:`Sporthal De Toekomst`,attendances:W,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[]},roster:_()}),m({id:`evt-match`,eventType:U(z),title:`League Match vs Smash United`,startTime:L(15),endTime:L(15,7,22),location:`Sporthal Oost`,myState:`ATTENDING`,attendances:W,roster:_({state:`LINEUP_SET`,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}]})}),m({id:`evt-training-2`,eventType:U(R),title:`Training — Court 1`,startTime:L(19),endTime:L(19,7,22),attendances:W,roster:_({state:`CRITICAL`,totalAttending:3,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})}),m({id:`evt-social`,eventType:U(B),title:`Season kick-off drinks`,startTime:L(22),endTime:L(22,7,23),location:`Café De Zon`,attendances:W,attendanceSummary:{attending:8,maybe:0,absent:0,notResponded:3,roleBreakdown:[]},roster:{...ne,totalAttending:8}}),m({id:`evt-tournament`,eventType:U(V),title:`Beach tournament Scheveningen`,startTime:L(5,8,10),endTime:L(5,8,18),myState:`MAYBE`,attendances:W,roster:_()})],K=H.map(e=>e.id),q=ye(`events`),je={title:`pages/events/EventsPageView`,component:Ae,parameters:q.parameters,args:{events:G,isAdmin:!0,onToggleType:P(),onToggleState:P(),onToggleShowPast:P(),onRespondFor:P(),onHeroRespond:P(),onRespond:P(),onAttend:P()}},J=e=>F(e.getByRole(`region`,{name:`Next up`})),Y={decorators:q.decorators,parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await N(e.getByRole(`heading`,{name:`Events`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`New Event`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await N(e.getByRole(`link`,{name:`Calendar links`})).toHaveAttribute(`href`,`/t/setpoint-vt/calendar`),await N(e.getByText(`Next up`)).toBeInTheDocument(),await N(e.getAllByText(`Training — Court 2`)).toHaveLength(1),await N(J(e).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await N(e.getByRole(`button`,{name:`Attend 2 trainings`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Attend 1 social`})).toBeInTheDocument();for(let t of[`League Match vs Smash United`,`Training — Court 1`,`Season kick-off drinks`,`Beach tournament Scheveningen`])await N(e.getByText(t)).toBeInTheDocument();await N(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await N(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},X=()=>{},Z={filters:{eventTypes:H,activeTypeIds:new Set(K),activeStates:new Set(y),activeTurnouts:new Set(b),showTurnout:!0,showPast:!1,resultCount:0,onToggleType:X,onToggleState:X,onToggleTurnout:X,onToggleShowPast:X,onClearFilters:X},panelMenu:{defaultExpanded:!1,onDefaultExpandedChange:X}},Q={decorators:[...p.decorators,l],render:()=>(0,M.jsx)(o,{items:{Loading:(0,M.jsx)(D,{...Z,list:{events:[],isLoading:!0,now:I}}),Error:(0,M.jsx)(D,{...Z,list:{events:[],error:Error(`boom`),now:I}}),Empty:(0,M.jsx)(D,{...Z,list:{events:[],now:I}}),"Filtered to nothing":(0,M.jsx)(D,{...Z,filters:{...Z.filters,activeTypeIds:new Set([B.id])},list:{events:[],now:I,emptyMessage:`No events for this type.`}}),"Nothing within the week":(0,M.jsx)(D,{...Z,bulkBar:(0,M.jsx)(Se,{groups:E([G[4]]),onAttend:X}),list:{events:[G[4]],now:I,currentUserId:`u-me`}})}}),play:async({canvas:e})=>{let t=t=>F(e.getByRole(`region`,{name:t}));await N(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await N(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await N(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await N(t(`Nothing within the week`).queryByText(`Next up`)).not.toBeInTheDocument(),await N(t(`Nothing within the week`).getByText(`Beach tournament Scheveningen`)).toBeInTheDocument(),await N(e.queryByText(`Next up`)).not.toBeInTheDocument()}},$={decorators:q.decorators,parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(J(e).getByRole(`button`,{name:`Going`})),await N(n.onHeroRespond).toHaveBeenCalledWith(`ATTENDING`),await N(J(e).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await N(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Training`})),await N(n.onToggleType).toHaveBeenCalledWith(R.id),await t.keyboard(`{Escape}`),await N(e.queryByText(`Training — Court 1`)).not.toBeInTheDocument(),await N(e.getAllByText(`League Match vs Smash United`)).toHaveLength(1),await N(J(e).getByRole(`button`,{name:`Can't`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await N(e.getByText(`Training — Court 1`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await t.keyboard(`{Escape}`),await N(e.getAllByRole(`button`,{name:/Hide lineup/}).length).toBeGreaterThan(0),await t.click(e.getAllByRole(`button`,{name:/Sofia — Maybe/})[1]);let r=F(await F(document.body).findByRole(`dialog`));await N(r.getByText(/you are answering for them/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Can't`})),await N(n.onRespondFor).toHaveBeenCalledWith(`evt-match`,`u-4`,`ABSENT`);let i=e.getAllByRole(`button`,{name:/Change your answer/})[0];await t.click(i);let a=F(document.getElementById(i.getAttribute(`aria-controls`)));await t.click(a.getByRole(`button`,{name:`Maybe`})),await N(n.onRespond).toHaveBeenCalledWith(`evt-match`,`MAYBE`),await t.click(e.getByRole(`button`,{name:`Attend 1 social`})),await N(n.onAttend).toHaveBeenCalledWith(B.id)}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
    // RSVP from the hero: the callback fires and the harness flips the hero's own state.
    await userEvent.click(hero(canvas).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onHeroRespond).toHaveBeenCalledWith('ATTENDING');
    await expect(hero(canvas).getByRole('button', {
      name: 'Going'
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
    await expect(hero(canvas).getByRole('button', {
      name: "Can't"
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
    // them, and the pick reports the event, the member and the state through the panel slot. The
    // hero's lineup is always open and comes first, so the match card's chip is the second.
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
}`,...$.parameters?.docs?.source}}},Me=[`Data`,`Shells`,`Interactions`]})))()}Ne();export{Y as Data,$ as Interactions,Q as Shells,Me as __namedExportsOrder,je as default};