import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-DlYdzhrd.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./router-decorator-1s_Bijuq.js";import{r as l,t as u}from"./app-column-decorator-BWKNmFIn.js";import{a as d,i as f,o as p,r as m,s as h,t as g}from"./event-fixtures-C1ds5yXh.js";import{n as ee,t as te}from"./PanelViewMenu-A_rkOYmn.js";import{n as ne,t as re}from"./plus-ChfEdY7q.js";import{a as ie,i as _,n as ae,o as v,r as y,s as b,t as oe}from"./EventFiltersView-BAqXK7r3.js";import{i as se,r as ce}from"./EventCard-m74puR_V.js";import{n as le,t as ue}from"./EventListView-DBT5CWkc.js";import{n as de,t as fe}from"./button-C8S7p0n8.js";import{n as pe,r as me}from"./app-shell-decorator-VmjoPLpj.js";import{n as he,t as x}from"./BulkAttendBarView-DeTBEQsd.js";import{n as ge,t as _e}from"./NextEventHeroView-Du93I0tK.js";import{n as ve,t as S}from"./EventLineupPanel-ytAHRoUV.js";function ye(e,t){let n=e.filter(e=>new Date(e.startTime).getTime()>=t.getTime()).reduce((e,t)=>e===null||new Date(t.startTime)<new Date(e.startTime)?t:e,null);return n===null?null:ce(n.startTime,t)<=7?n:null}function C(){return(C=e((()=>{se()})))()}function be(e,t,n,r){return e.filter(e=>t.has(e.eventType.id)&&n.has(e.myState)&&r.has(ie(e.roster.state)))}function xe(){return(xe=e((()=>{_()})))()}function Se({hasHero:e,showPast:t,activeTypeIds:n,allTypeIds:r,activeStates:i,activeTurnouts:a}){if(e)return`Nothing else coming up.`;let o=n.size<r.length,s=i.size<v.length,c=a.size<y.length,l=[o,s,c].filter(Boolean).length;if(l===0)return t?`No events yet.`:`No upcoming events.`;if(l===1){if(o)return`No events for this type.`;if(s&&i.size===1&&i.has(`NOT_RESPONDED`))return`Nothing needs your answer.`;if(c&&[...a].every(e=>w.includes(e)))return`No events are short of players.`}return`No events match these filters.`}var w;function T(){return(T=e((()=>{b(),_(),w=[`missing-position`,`spots-open`]})))()}function E(e){let t=new Map;for(let n of e){let e=t.get(n.eventType.id);e?e.events.push(n):t.set(n.eventType.id,{typeId:n.eventType.id,typeName:n.eventType.name,events:[n]})}return[...t.values()].sort((e,t)=>t.events.length-e.events.length||e.typeName.localeCompare(t.typeName))}function Ce(e,t,n){return e?e.filter(e=>t.has(e.eventType.id)&&e.myState===`NOT_RESPONDED`&&new Date(e.startTime)>=n):[]}function D({createAction:e,filters:t,panelMenu:n,hero:r,bulkBar:i,list:a}){return(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,O.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Events`}),(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[e,(0,O.jsx)(oe,{...t}),(0,O.jsx)(te,{...n})]})]}),r,i,(0,O.jsx)(ue,{...a})]})}var O;function k(){return(k=e((()=>{le(),ae(),ee(),O=i(),D.__docgenInfo={description:`The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
containers with their own queries), and the story fills the same slots with their prop-only Views,
so the whole page renders with zero network.`,methods:[],displayName:`EventsPageView`,props:{createAction:{required:!1,tsType:{name:`ReactNode`},description:`The admin's "New Event" trigger; absent for members.`},filters:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventFiltersView`}],raw:`ComponentProps<typeof EventFiltersView>`},description:``},panelMenu:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`PanelViewMenu`}],raw:`ComponentProps<typeof PanelViewMenu>`},description:``},hero:{required:!1,tsType:{name:`ReactNode`},description:`The Next Up hero, when (and only when) one is due — no placeholder in its place.`},bulkBar:{required:!1,tsType:{name:`ReactNode`},description:`One button per event type with blanks left; renders nothing when there are none.`},list:{required:!0,tsType:{name:`ComponentProps`,elements:[{name:`EventListView`}],raw:`ComponentProps<typeof EventListView>`},description:``}}}})))()}function A(e,t){let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}function we(e){let[t,n]=(0,j.useState)(new Set(K)),[r,i]=(0,j.useState)(new Set(v)),[a,o]=(0,j.useState)(new Set(y)),[s,c]=(0,j.useState)(!1),[l,u]=(0,j.useState)(!1),[d,f]=(0,j.useState)({}),p=(e,t,n)=>f(r=>({...r,[e]:{...r[e],[t]:n}})),m=[...be(e.events.map(e=>{let t=d[e.id];return t?{...e,myState:t[`u-me`]??e.myState,attendances:e.attendances.map(e=>t[e.userId]?{...e,state:t[e.userId]}:e)}:e}),t,r,a)].sort((e,t)=>e.startTime.localeCompare(t.startTime)),h=ye(m,I),g=h?m.filter(e=>e.id!==h.id):m,ee=E(Ce(g,t,I));return(0,M.jsx)(D,{createAction:e.isAdmin&&(0,M.jsxs)(fe,{children:[(0,M.jsx)(re,{size:16}),`New Event`]}),filters:{eventTypes:H,activeTypeIds:t,activeStates:r,activeTurnouts:a,showTurnout:!0,showPast:s,resultCount:m.length,onToggleType:t=>{e.onToggleType(t),n(e=>A(e,t))},onToggleState:t=>{e.onToggleState(t),i(e=>A(e,t))},onToggleTurnout:e=>o(t=>A(t,e)),onToggleShowPast:t=>{e.onToggleShowPast(t),c(t)},onClearFilters:()=>{n(new Set(K)),i(new Set(v)),o(new Set(y)),c(!1)}},panelMenu:{defaultExpanded:l,onDefaultExpandedChange:u},hero:h&&(0,M.jsx)(_e,{event:h,myState:h.myState,now:I,defaultRosterOpen:l,onRespond:t=>{e.onHeroRespond(t),p(h.id,`u-me`,t)},lineup:(0,M.jsx)(S,{attendances:h.attendances,roster:h.roster,currentUserId:`u-me`,substitutes:h.substitutes,summary:!1,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(t,n)=>{e.onRespondFor(h.id,t,n),p(h.id,t,n)}})}),bulkBar:(0,M.jsx)(x,{groups:ee,onAttend:e.onAttend}),list:{events:g,now:I,currentUserId:`u-me`,defaultRosterOpen:l,onRespond:(t,n)=>{e.onRespond(t,n),p(t,`u-me`,n)},rosterPanel:t=>(0,M.jsx)(S,{attendances:t.attendances,roster:t.roster,currentUserId:`u-me`,substitutes:t.substitutes,onCallInSubstitutes:()=>{},onSetSubstituteState:()=>{},onTakeOffSubstitute:()=>{},onRespond:(n,r)=>{e.onRespondFor(t.id,n,r),p(t.id,n,r)}}),emptyMessage:Se({hasHero:h!==null,showPast:s,activeTypeIds:t,allTypeIds:K,activeStates:r,activeTurnouts:a})}})}var j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,Te,J,Y,X,Z,Q,Ee;function $(){return($=e((()=>{j=t(),ne(),de(),m(),a(),l(),c(),C(),b(),_(),xe(),T(),he(),ge(),ve(),me(),r(),k(),M=i(),{expect:N,fn:P,within:F}=__STORYBOOK_MODULE_TEST__,I=new Date(2026,7,10,9,0),L=(e,t=7,n=20)=>new Date(2026,t,e,n,0).toISOString(),R=p({id:`et-1`,name:`Training`,color:`#249E6C`}),z=p({id:`et-2`,name:`Match`,color:`#225C9C`}),B=p({id:`et-3`,name:`Social`,color:`#D9A23B`}),V=p({id:`et-4`,name:`Tournament`,color:`#7B5EA7`}),H=[R,z,B,V],U=e=>({id:e.id,name:e.name,color:e.color}),W=[f(`u-me`,`Julius`,`Setter`),f(`u-2`,`Sanne`,`Setter`),f(`u-3`,`Lars`,`Libero`),f(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),f(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),f(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],G=[d({id:`evt-hero`,eventType:U(R),title:`Training — Court 2`,startTime:L(12),endTime:L(12,7,22),location:`Sporthal De Toekomst`,attendances:W,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[]},roster:h()}),d({id:`evt-match`,eventType:U(z),title:`League Match vs Smash United`,startTime:L(15),endTime:L(15,7,22),location:`Sporthal Oost`,myState:`ATTENDING`,attendances:W,roster:h({state:`LINEUP_SET`,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}]})}),d({id:`evt-training-2`,eventType:U(R),title:`Training — Court 1`,startTime:L(19),endTime:L(19,7,22),attendances:W,roster:h({state:`CRITICAL`,totalAttending:3,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})}),d({id:`evt-social`,eventType:U(B),title:`Season kick-off drinks`,startTime:L(22),endTime:L(22,7,23),location:`Café De Zon`,attendances:W,attendanceSummary:{attending:8,maybe:0,absent:0,notResponded:3,roleBreakdown:[]},roster:{...g,totalAttending:8}}),d({id:`evt-tournament`,eventType:U(V),title:`Beach tournament Scheveningen`,startTime:L(5,8,10),endTime:L(5,8,18),myState:`MAYBE`,attendances:W,roster:h()})],K=H.map(e=>e.id),q=pe(`events`),Te={title:`pages/events/EventsPageView`,component:we,parameters:q.parameters,args:{events:G,isAdmin:!0,onToggleType:P(),onToggleState:P(),onToggleShowPast:P(),onRespondFor:P(),onHeroRespond:P(),onRespond:P(),onAttend:P()}},J={decorators:q.decorators,parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await N(e.getByRole(`heading`,{name:`Events`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`New Event`})).toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await N(e.getByText(`Next up`)).toBeInTheDocument(),await N(e.getAllByText(`Training — Court 2`)).toHaveLength(1),await N(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await N(e.getAllByRole(`button`,{name:/Show lineup/})).toHaveLength(4),await N(e.queryByText(`Lineup`)).not.toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:`Attend 2 trainings`})).not.toBeInTheDocument(),await N(e.getByRole(`button`,{name:`Attend 1 social`})).toBeInTheDocument();for(let t of[`League Match vs Smash United`,`Training — Court 1`,`Season kick-off drinks`,`Beach tournament Scheveningen`])await N(e.getByText(t)).toBeInTheDocument();await N(e.getByText(`Setpoint VT`)).toBeInTheDocument(),await N(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Y=()=>{},X={filters:{eventTypes:H,activeTypeIds:new Set(K),activeStates:new Set(v),activeTurnouts:new Set(y),showTurnout:!0,showPast:!1,resultCount:0,onToggleType:Y,onToggleState:Y,onToggleTurnout:Y,onToggleShowPast:Y,onClearFilters:Y},panelMenu:{defaultExpanded:!1,onDefaultExpandedChange:Y}},Z={decorators:[...u.decorators,s],render:()=>(0,M.jsx)(o,{items:{Loading:(0,M.jsx)(D,{...X,list:{events:[],isLoading:!0,now:I}}),Error:(0,M.jsx)(D,{...X,list:{events:[],error:Error(`boom`),now:I}}),Empty:(0,M.jsx)(D,{...X,list:{events:[],now:I}}),"Filtered to nothing":(0,M.jsx)(D,{...X,filters:{...X.filters,activeTypeIds:new Set([B.id])},list:{events:[],now:I,emptyMessage:`No events for this type.`}}),"Nothing within the week":(0,M.jsx)(D,{...X,bulkBar:(0,M.jsx)(x,{groups:E([G[4]]),onAttend:Y}),list:{events:[G[4]],now:I,currentUserId:`u-me`}})}}),play:async({canvas:e})=>{let t=t=>F(e.getByRole(`region`,{name:t}));await N(t(`Loading`).getByRole(`status`,{name:/loading events/i})).toBeInTheDocument(),await N(t(`Error`).getByText(/couldn't load events/i)).toBeInTheDocument(),await N(t(`Empty`).getByText(`No upcoming events.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByText(`No events for this type.`)).toBeInTheDocument(),await N(t(`Filtered to nothing`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await N(t(`Nothing within the week`).queryByText(`Next up`)).not.toBeInTheDocument(),await N(t(`Nothing within the week`).getByText(`Beach tournament Scheveningen`)).toBeInTheDocument(),await N(e.queryByText(`Next up`)).not.toBeInTheDocument()}},Q={decorators:q.decorators,parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await N(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/I'm in/})),await N(n.onHeroRespond).toHaveBeenCalledWith(`ATTENDING`),await N(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`),await N(e.getByRole(`button`,{name:`Attend 1 training`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Training`})),await N(n.onToggleType).toHaveBeenCalledWith(R.id),await t.keyboard(`{Escape}`),await N(e.queryByText(`Training — Court 1`)).not.toBeInTheDocument(),await N(e.getAllByText(`League Match vs Smash United`)).toHaveLength(1),await N(e.getByRole(`button`,{name:/Can't make it/})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Clear filters`})),await N(e.getByText(`Training — Court 1`)).toBeInTheDocument(),await N(e.queryByRole(`button`,{name:/Sofia — Maybe/})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await t.keyboard(`{Escape}`),await N(e.getAllByRole(`button`,{name:/Hide lineup/})).toHaveLength(4),await N(F(e.getByRole(`region`,{name:`Next up`})).getByText(`Lineup`)).toBeInTheDocument(),await t.click(e.getAllByRole(`button`,{name:/Sofia — Maybe/})[1]);let r=F(await F(document.body).findByRole(`dialog`));await N(r.getByText(/you are answering for them/)).toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Can't go`})),await N(n.onRespondFor).toHaveBeenCalledWith(`evt-match`,`u-4`,`ABSENT`),await t.click(e.getAllByRole(`button`,{name:/Change your answer/})[0]),await t.click(e.getByRole(`button`,{name:/^Maybe$/})),await N(n.onRespond).toHaveBeenCalledWith(`evt-match`,`MAYBE`),await t.click(e.getByRole(`button`,{name:`Attend 1 social`})),await N(n.onAttend).toHaveBeenCalledWith(B.id)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
    // The hero holds the one event within the window, and the list does not repeat it.
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getAllByText('Training — Court 2')).toHaveLength(1);
    await expect(canvas.getByRole('button', {
      name: /I'm in/
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
    await userEvent.click(canvas.getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onHeroRespond).toHaveBeenCalledWith('ATTENDING');
    await expect(canvas.getByRole('button', {
      name: /I'm in/
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
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
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
}`,...Q.parameters?.docs?.source}}},Ee=[`Data`,`Shells`,`Interactions`]})))()}$();export{J as Data,Q as Interactions,Z as Shells,Ee as __namedExportsOrder,Te as default};