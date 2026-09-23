import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-BiajjKFy.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-D87d-8jv.js";import{i as s,r as c}from"./AppShellFrame-jrLBI-FO.js";import{a as l,i as u,o as d,r as f,s as p,t as m}from"./event-fixtures-CuRrQuRB.js";import{n as h,t as g}from"./PanelViewMenu-HRyAgRoG.js";import{n as _,t as ee}from"./plus-DwAa7E65.js";import{a as te,i as v,n as ne,o as y,r as b,s as re,t as ie}from"./EventFiltersView-BU10CoV6.js";import{i as ae,r as oe}from"./EventCard-KWAFvFWm.js";import{n as se,t as ce}from"./EventListView-DJ4YZCVE.js";import{n as le,t as ue}from"./button-BkXpgCJ0.js";import{n as de,r as fe}from"./app-shell-decorator-O0pj1xgm.js";import{n as pe,t as x}from"./BulkAttendBarView-gNKgehI-.js";import{n as me,t as he}from"./NextEventHeroView-DNuIaDS7.js";import{n as ge,t as _e}from"./EventLineupPanel--Y3ARHrK.js";function ve(e,t){let n=e.filter(e=>new Date(e.startTime).getTime()>=t.getTime()).reduce((e,t)=>e===null||new Date(t.startTime)<new Date(e.startTime)?t:e,null);return n===null?null:oe(n.startTime,t)<=7?n:null}function S(){return(S=e((()=>{ae()})))()}function ye(e,t,n,r){return e.filter(e=>t.has(e.eventType.id)&&n.has(e.myState)&&r.has(te(e.roster.state)))}function C(){return(C=e((()=>{v()})))()}function be({hasHero:e,showPast:t,activeTypeIds:n,allTypeIds:r,activeStates:i,activeTurnouts:a}){if(e)return`Nothing else coming up.`;let o=n.size<r.length,s=i.size<y.length,c=a.size<b.length,l=[o,s,c].filter(Boolean).length;if(l===0)return t?`No events yet.`:`No upcoming events.`;if(l===1){if(o)return`No events for this type.`;if(s&&i.size===1&&i.has(`NOT_RESPONDED`))return`Nothing needs your answer.`;if(c&&[...a].every(e=>w.includes(e)))return`No events are short of players.`}return`No events match these filters.`}var w;function T(){return(T=e((()=>{re(),v(),w=[`missing-position`,`spots-open`]})))()}function E(e){let t=new Map;for(let n of e){let e=t.get(n.eventType.id);e?e.events.push(n):t.set(n.eventType.id,{typeId:n.eventType.id,typeName:n.eventType.name,events:[n]})}return[...t.values()].sort((e,t)=>t.events.length-e.events.length||e.typeName.localeCompare(t.typeName))}function xe(e,t,n){return e?e.filter(e=>t.has(e.eventType.id)&&e.myState===`NOT_RESPONDED`&&new Date(e.startTime)>=n):[]}function D({createAction:e,filters:t,panelMenu:n,hero:r,bulkBar:i,list:a}){return(0,O.jsxs)(`div`,{...c,className:`lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8`,children:[(0,O.jsxs)(`div`,{className:`contents lg:block`,children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,O.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Events`}),(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[e,(0,O.jsx)(ie,{...t}),(0,O.jsx)(g,{...n})]})]}),(0,O.jsxs)(`div`,{className:`contents lg:block lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]`,children:[r,i]})]}),(0,O.jsx)(ce,{...a})]})}var O;function k(){return(k=e((()=>{se(),ne(),h(),s(),O=i(),D.__docgenInfo={description:`The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
containers with their own queries), and the story fills the same slots with their prop-only Views,
so the whole page renders with zero network.

From \`lg\` up it splits in two (ADR-0033): everything a member scans *before* acting — the header
with its two popovers, the hero, the bulk-attend bar — moves into a left rail, and the
chronological list takes the right. The cards do not widen; the list column is 40rem, the width a
card already has on a laptop, so the extra room pays for the rail and nothing else. This is the
one page that opts out of the shell's centred column, hence WIDE_COLUMN on the root.`,methods:[],displayName:`EventsPageView`,props:{createAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's "New Event" trigger; absent for members.`},filters:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventFiltersView`}],raw:`ComponentProps<typeof EventFiltersView>`},description:``},panelMenu:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`PanelViewMenu`}],raw:`ComponentProps<typeof PanelViewMenu>`},description:``},hero:{required:!1,tsType:{name:`ReactNode`},description:`The Next Up hero, when (and only when) one is due — no placeholder in its place.`},bulkBar:{required:!1,tsType:{name:`ReactNode`},description:`One button per event type with blanks left; renders nothing when there are none.`},list:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventListView`}],raw:`ComponentProps<typeof EventListView>`},description:``}}}})))()}function A(e,t){let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}function Se(e){let[t,n]=(0,j.useState)(new Set(K)),[r,i]=(0,j.useState)(new Set(y)),[a,o]=(0,j.useState)(new Set(b)),[s,c]=(0,j.useState)(!1),[l,u]=(0,j.useState)(!1),[d,f]=(0,j.useState)({}),p=(e,t,n)=>f(r=>({...r,[e]:{...r[e],[t]:n}})),m=[...ye(e.events.map(e=>{let t=d[e.id];return t?{...e,myState:t[`u-me`]??e.myState,attendances:e.attendances.map(e=>t[e.userId]?{...e,state:t[e.userId]}:e)}:e}),t,r,a)].sort((e,t)=>e.startTime.localeCompare(t.startTime)),h=ve(m,I),g=h?m.filter(e=>e.id!==h.id):m,_=E(xe(m,t,I));return(0,M.jsx)(D,{createAction:e.isAdmin&&(0,M.jsxs)(ue,{children:[(0,M.jsx)(ee,{size:16}),`New Event`]}),filters:{eventTypes:H,activeTypeIds:t,activeStates:r,activeTurnouts:a,showTurnout:!0,showPast:s,resultCount:m.length,onToggleType:t=>{e.onToggleType(t),n(e=>A(e,t))},onToggleState:t=>{e.onToggleState(t),i(e=>A(e,t))},onToggleTurnout:e=>o(t=>A(t,e)),onToggleShowPast:t=>{e.onToggleShowPast(t),c(t)},onClearFilters:()=>{n(new Set(K)),i(new Set(y)),o(new Set(b)),c(!1)}},panelMenu:{defaultExpanded:l,onDefaultExpandedChange:u},hero:h&&(0,M.jsx)(he,{event:h,myState:h.myState,now:I,onRespond:t=>{e.onHeroRespond(t),p(h.id,`u-me`,t)}}),bulkBar:(0,M.jsx)(x,{groups:_,onAttend:e.onAttend}),list:{events:g,now:I,currentUserId:`u-me`,defaultRosterOpen:l,onRespond:(t,n)=>{e.onRespond(t,n),p(t,`u-me`,n)},rosterPanel:t=>(0,M.jsx)(_e,{attendances:t.attendances,roster:t.roster,currentUserId:`u-me`,onRespond:(n,r)=>{e.onRespondFor(t.id,n,r),p(t.id,n,r)}}),emptyMessage:be({hasHero:h!==null,showPast:s,activeTypeIds:t,allTypeIds:K,activeStates:r,activeTurnouts:a})}})}var j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,Ce;function we(){return(we=e((()=>{j=t(),_(),le(),f(),a(),S(),re(),v(),C(),T(),pe(),me(),ge(),fe(),r(),k(),M=i(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=new Date(2026,7,10,9,0),L=(e,t=7,n=20)=>new Date(2026,t,e,n,0).toISOString(),R=d({id:`et-1`,name:`Training`,color:`#249E6C`}),z=d({id:`et-2`,name:`Match`,color:`#225C9C`}),B=d({id:`et-3`,name:`Social`,color:`#D9A23B`}),V=d({id:`et-4`,name:`Tournament`,color:`#7B5EA7`}),H=[R,z,B,V],U=e=>({id:e.id,name:e.name,color:e.color}),W=[u(`u-me`,`Julius`,`Setter`),u(`u-2`,`Sanne`,`Setter`),u(`u-3`,`Lars`,`Libero`),u(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),u(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),u(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],G=[l({id:`evt-hero`,eventType:U(R),title:`Training — Court 2`,startTime:L(12),endTime:L(12,7,22),location:`Sporthal De Toekomst`,attendances:W,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[]},roster:p()}),l({id:`evt-match`,eventType:U(z),title:`League Match vs Smash United`,startTime:L(15),endTime:L(15,7,22),location:`Sporthal Oost`,myState:`ATTENDING`,attendances:W,roster:p({state:`LINEUP_SET`,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}]})}),l({id:`evt-training-2`,eventType:U(R),title:`Training — Court 1`,startTime:L(19),endTime:L(19,7,22),attendances:W,roster:p({state:`CRITICAL`,totalAttending:3,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})}),l({id:`evt-social`,eventType:U(B),title:`Season kick-off drinks`,startTime:L(22),endTime:L(22,7,23),location:`Café De Zon`,attendances:W,attendanceSummary:{attending:8,maybe:0,absent:0,notResponded:3,roleBreakdown:[]},roster:{...m,totalAttending:8}}),l({id:`evt-tournament`,eventType:U(V),title:`Beach tournament Scheveningen`,startTime:L(5,8,10),endTime:L(5,8,18),myState:`MAYBE`,attendances:W,roster:p()})],K=H.map(e=>e.id),q=de(`events`),J={title:`pages/events/EventsPageView`,component:Se,decorators:q.decorators,parameters:q.parameters,args:{events:G,isAdmin:!0,onToggleType:P(),onToggleState:P(),onToggleShowPast:P(),onRespondFor:P(),onHeroRespond:P(),onRespond:P(),onAttend:P()}},Y={parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{let t=e.getByRole(`heading`,{name:`Events`});await N(t).toBeInTheDocument(),await N(t.closest(`[data-wide-column]`)).not.toBeNull(),await N(e.getByRole(`button`,{name:`New Event`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await N(e.getByText(`Next up`)).toBeInTheDocument(),await N(e.getAllByText(`Training — Court 2`)).toHaveLength(1),await N(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await N(e.getByRole(`button`,{name:`Attend 2 trainings`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Attend 1 social`})).toBeInTheDocument();for(let t of[`League Match vs Smash United`,`Training — Court 1`,`Season kick-off drinks`,`Beach tournament Scheveningen`])await N(e.getByText(t)).toBeInTheDocument();await N(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await N(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},X=()=>{},Z={filters:{eventTypes:H,activeTypeIds:new Set(K),activeStates:new Set(y),activeTurnouts:new Set(b),showTurnout:!0,showPast:!1,resultCount:0,onToggleType:X,onToggleState:X,onToggleTurnout:X,onToggleShowPast:X,onClearFilters:X},panelMenu:{defaultExpanded:!1,onDefaultExpandedChange:X}},Q={render:()=>(0,M.jsx)(o,{items:{Loading:(0,M.jsx)(D,{...Z,list:{events:[],isLoading:!0,now:I}}),Error:(0,M.jsx)(D,{...Z,list:{events:[],error:Error(`boom`),now:I}}),Empty:(0,M.jsx)(D,{...Z,list:{events:[],now:I}}),"Filtered to nothing":(0,M.jsx)(D,{...Z,filters:{...Z.filters,activeTypeIds:new Set([B.id])},list:{events:[],now:I,emptyMessage:`No events for this type.`}}),"Nothing within the week":(0,M.jsx)(D,{...Z,bulkBar:(0,M.jsx)(x,{groups:E([G[4]]),onAttend:X}),list:{events:[G[4]],now:I,currentUserId:`u-me`}})}}),play:async({canvas:e})=>{let t=t=>F(e.getByRole(`region`,{name:t}));await N(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await N(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await N(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await N(t(`Nothing within the week`).queryByText(`Next up`)).not.toBeInTheDocument(),await N(t(`Nothing within the week`).getByText(`Beach tournament Scheveningen`)).toBeInTheDocument(),await N(e.queryByText(`Next up`)).not.toBeInTheDocument()}},$={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/I'm in/})),await N(n.onHeroRespond).toHaveBeenCalledWith(`ATTENDING`),await N(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`),await N(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Training`})),await N(n.onToggleType).toHaveBeenCalledWith(R.id),await t.keyboard(`{Escape}`),await N(e.queryByText(`Training — Court 1`)).not.toBeInTheDocument(),await N(e.getAllByText(`League Match vs Smash United`)).toHaveLength(1),await N(e.getByRole(`button`,{name:/Can't make it/})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await N(e.getByText(`Training — Court 1`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await t.keyboard(`{Escape}`),await N(e.getAllByRole(`button`,{name:/Hide lineup/}).length).toBeGreaterThan(0),await t.click(e.getAllByRole(`button`,{name:/Sofia — Maybe/})[0]);let r=F(await F(document.body).findByRole(`dialog`));await N(r.getByText(/you are answering for them/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Can't go`})),await N(n.onRespondFor).toHaveBeenCalledWith(`evt-match`,`u-4`,`ABSENT`),await t.click(e.getAllByRole(`button`,{name:/Change your answer/})[0]),await t.click(e.getByRole(`button`,{name:/^Maybe$/})),await N(n.onRespond).toHaveBeenCalledWith(`evt-match`,`MAYBE`),await t.click(e.getByRole(`button`,{name:`Attend 1 social`})),await N(n.onAttend).toHaveBeenCalledWith(B.id)}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    const heading = canvas.getByRole('heading', {
      name: 'Events'
    });
    await expect(heading).toBeInTheDocument();
    // The contract the rail rests on (ADR-0033): without this marker on the page root the shell
    // keeps its 42rem cap, and the rail and the list would be sharing 40rem instead of 64.
    await expect(heading.closest('[data-wide-column]')).not.toBeNull();
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
}`,...Y.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}},Ce=[`Data`,`Shells`,`Interactions`]})))()}we();export{Y as Data,$ as Interactions,Q as Shells,Ce as __namedExportsOrder,J as default};