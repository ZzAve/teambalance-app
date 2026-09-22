import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-CN0e_lCC.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./router-decorator-CakS7x0S.js";import{a as s,i as c,r as l,s as u,t as d}from"./event-fixtures-CuRrQuRB.js";import{n as f,t as p}from"./PanelViewMenu-C8pVceF7.js";import{n as m,t as h}from"./EventListView-BQdF4o5D.js";import{n as g,t as _}from"./EventLineupPanel-8zEWc3QF.js";function v({events:e,defaultExpanded:t=!1,onDefaultExpandedChange:n,onRespond:r}){let[i,a]=(0,y.useState)(t);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{className:`mb-2 flex justify-end`,children:(0,b.jsx)(p,{defaultExpanded:i,onDefaultExpandedChange:e=>{n?.(e),a(e)}})}),(0,b.jsx)(h,{events:e,now:F,currentUserId:E[0],defaultRosterOpen:i,rosterPanel:e=>(0,b.jsx)(_,{attendances:e.attendances,roster:e.roster,currentUserId:E[0],onRespond:(t,n)=>r?.(e.id,t,n)})})]})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{y=t(),o(),l(),m(),f(),r(),g(),b=n(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,[w,T,E,D,O,k,A,j]=[[`u-1`,`Sanne Bakker`,`Setter`],[`u-2`,`Sofia de Wit`,`Setter`],[`u-3`,`Lars Peters`,`Libero`],[`u-4`,`Milan Visser`,`Middle`],[`u-5`,`Mees Jansen`,`Middle`],[`u-6`,`Tess de Groot`,`Outside`],[`u-7`,`Bram Willems`,`Outside`],[`u-8`,`Uwe Hofman`,`Unassigned`]],M=e=>e.map(([[e,t,n],r])=>c(e,t,n,{state:r})),N=(e,t,n)=>({id:`p-${e.toLowerCase()}`,label:e,required:t,attending:n,kind:`PLAYING`}),P={match:{id:`et-match`,name:`Match`,color:`#3b82f6`},training:{id:`et-training`,name:`Training`,color:`#249E6C`},social:{id:`et-social`,name:`Social`,color:`#E0A526`}},F=new Date(2026,7,10,9,0),I=(e,t=20)=>new Date(2026,7,e,t,0).toISOString(),L=s({id:`evt-critical`,eventType:P.match,title:`League Match vs Smash United`,startTime:I(11,14),location:`Sportcentrum Noord`,myState:`NOT_RESPONDED`,roster:u({state:`CRITICAL`,totalAttending:4,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,0),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ABSENT`],[O,`NOT_RESPONDED`],[k,`ATTENDING`],[A,`MAYBE`],[j,`NOT_RESPONDED`]])}),R=s({id:`evt-spots`,eventType:P.training,title:`Tuesday Training`,startTime:I(13),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:u({state:`SPOTS_OPEN`,totalAttending:5,positions:[N(`Setter`,2,1),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),z=s({id:`evt-set`,eventType:P.training,title:`Friday Training`,startTime:I(14),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:u({state:`LINEUP_SET`,totalAttending:7,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,2)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ATTENDING`],[j,`NOT_RESPONDED`]])}),B=s({id:`evt-headcount`,eventType:P.match,title:`Regio-toernooi`,startTime:I(20,10),location:`Topsportcentrum`,myState:`MAYBE`,roster:u({state:`HEADCOUNT_SHORT`,totalTarget:8,totalAttending:5,openSlots:3,positions:[],unassignedAttending:5}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),V=s({id:`evt-social`,eventType:P.social,title:`Season Drinks`,startTime:I(22,21),location:`Café De Zwaluw`,myState:`MAYBE`,roster:u({...d,totalAttending:4}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),H=[L,R,z,B,V],U=/Hide (lineup|who's coming)/,W={title:`widgets/event-panel/EventListPanels`,component:v,decorators:[a],args:{events:H}},G={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await x(e.getByText(`Missing a position`)).toBeInTheDocument(),await x(e.getByText(`2 spots open`)).toBeInTheDocument(),await x(e.getByText(`Lineup set`)).toBeInTheDocument(),await x(e.getByText(`3 more needed`)).toBeInTheDocument(),await x(e.getByText(`4 going`)).toBeInTheDocument(),await x(e.queryByText(`Sanne Bakker`)).not.toBeInTheDocument(),await x(e.queryByText(`Lineup`)).not.toBeInTheDocument()}},K=Array.from({length:17},(e,t)=>c(`u-big-${t}`,`Member ${String(t+1).padStart(2,`0`)}`,`Unassigned`,{state:t%4==0?`NOT_RESPONDED`:`ATTENDING`})),q=()=>[s({id:`evt-big`,eventType:P.training,title:`Club Night`,startTime:I(12),roster:u({state:`TALLY_ONLY`,openSlots:0,totalAttending:13,positions:[]}),attendances:K}),V],J={render:e=>(0,b.jsx)(i,{items:{"Every panel open":(0,b.jsx)(v,{...e,defaultExpanded:!0}),"A big squad is capped":(0,b.jsx)(v,{...e,defaultExpanded:!0,events:q()})}}),play:async({canvas:e})=>{let t=t=>C(e.getByRole(`region`,{name:t})),n=t(`Every panel open`);await x(n.getAllByRole(`button`,{name:U})).toHaveLength(5),await x(n.queryByRole(`switch`,{name:`Keep panels open`})).not.toBeInTheDocument(),await x(n.getAllByText(`nobody yet`).length).toBeGreaterThan(0),await x(n.getByText(`4 of 4 covered`)).toBeInTheDocument(),await x(n.getByText(`5/8 going`)).toBeInTheDocument(),await x(n.getAllByText(/Sanne/)).toHaveLength(5),await x(n.getAllByRole(`button`,{name:/Uwe Hofman — Awaiting/})).toHaveLength(5);let r=t(`A big squad is capped`),i=C(r.getByText(`Club Night`).closest(`.card-enter`));await x(i.getByRole(`button`,{name:/Member 02 —/})).toBeInTheDocument(),await x(i.queryByRole(`button`,{name:/Member 16 —/})).not.toBeInTheDocument(),await x(r.getByRole(`button`,{name:/Sanne Bakker/})).toBeInTheDocument()}},Y=S(),X=S(),Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,b.jsx)(i,{items:{"Answer from a card":(0,b.jsx)(v,{...e,defaultExpanded:!0,onRespond:Y}),"Keep open":(0,b.jsx)(v,{...e,onDefaultExpandedChange:X}),"Big squad":(0,b.jsx)(v,{...e,defaultExpanded:!0,events:q()})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>C(e.getByRole(`region`,{name:t})),r=n(`Answer from a card`),i=C(r.getByText(`League Match vs Smash United`).closest(`.card-enter`));await t.click(i.getAllByRole(`button`,{name:/Sanne Bakker/})[0]),await t.click(C(document.body).getByRole(`button`,{name:`Can't go`})),await x(Y).toHaveBeenCalledWith(`evt-critical`,w[0],`ABSENT`);let a=n(`Keep open`),o=()=>a.queryAllByRole(`button`,{name:U});await t.click(a.getAllByRole(`button`,{name:/Show lineup/})[0]),await x(o()).toHaveLength(1),await t.click(a.getByRole(`button`,{name:`View options`})),await t.click(a.getByRole(`switch`,{name:`Keep panels open`})),await x(X).toHaveBeenCalledWith(!0),await x(o()).toHaveLength(5),await t.click(a.getByRole(`switch`,{name:`Keep panels open`})),await x(X).toHaveBeenLastCalledWith(!1),await x(o()).toHaveLength(0);let s=n(`Big squad`),c=C(s.getByText(`Club Night`).closest(`.card-enter`));await t.click(c.getByRole(`button`,{name:`Show 8 more going`})),await x(c.getByRole(`button`,{name:/Member 16 —/})).toBeInTheDocument(),await x(c.getByRole(`button`,{name:/Member 17 — Awaiting/})).toBeInTheDocument(),await x(s.getByRole(`button`,{name:/Sanne Bakker/})).toBeInTheDocument()}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument();
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument();
    await expect(canvas.getByText('3 more needed')).toBeInTheDocument();
    await expect(canvas.getByText('4 going')).toBeInTheDocument(); // the social's headcount
    // Nothing is open, so no panel content is on screen at all.
    await expect(canvas.queryByText('Sanne Bakker')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Lineup')).not.toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // The whole variety in one frame: a position with nobody, a mixed row, a covered row, a
    // headcount-only panel, and a social. One panel does all five now — before the lineup panel
    // this took two stories, because the card opened onto pips OR names and neither could show
    // both.
    'Every panel open': <ListWithPanels {...args} defaultExpanded />,
    // Capped and collapsed — the picture the counter exists to protect.
    'A big squad is capped': <ListWithPanels {...args} defaultExpanded events={bigSquadEvents()} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const everyPanelOpen = region('Every panel open');

    // One open panel per card, and no preference chrome on any of them.
    await expect(everyPanelOpen.getAllByRole('button', {
      name: OPEN_PANEL
    })).toHaveLength(5);
    await expect(everyPanelOpen.queryByRole('switch', {
      name: 'Keep panels open'
    })).not.toBeInTheDocument();

    // Targets and people at once, which is the merge: the verdict words come from the roster, the
    // names beside them from the attendances, on the same rows.
    await expect(everyPanelOpen.getAllByText('nobody yet').length).toBeGreaterThan(0);
    await expect(everyPanelOpen.getByText('4 of 4 covered')).toBeInTheDocument();
    await expect(everyPanelOpen.getByText('5/8 going')).toBeInTheDocument(); // the headcount-only panel
    // Every card names the team, the social included — there is no view that hides them any more.
    await expect(everyPanelOpen.getAllByText(/Sanne/)).toHaveLength(5);
    // A non-responder is still on every card, whatever its roster state — named in the chip's
    // accessible name even though the chip itself prints only a first name.
    await expect(everyPanelOpen.getAllByRole('button', {
      name: /Uwe Hofman — Awaiting/
    })).toHaveLength(5);
    const bigSquad = region('A big squad is capped');
    const card = within(bigSquad.getByText('Club Night').closest('.card-enter') as HTMLElement);
    // Twelve going, four shown plus a counter — the collapsed row is a handful of chips, not 17.
    await expect(card.getByRole('button', {
      name: /Member 02 —/
    })).toBeInTheDocument();
    await expect(card.queryByRole('button', {
      name: /Member 16 —/
    })).not.toBeInTheDocument();
    // The neighbouring card is untouched by the cap — it is a per-card limit, not a list-wide one.
    await expect(bigSquad.getByRole('button', {
      name: /Sanne Bakker/
    })).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Answer from a card': <ListWithPanels {...args} defaultExpanded onRespond={onRespondSpy} />,
    'Keep open': <ListWithPanels {...args} onDefaultExpandedChange={onDefaultExpandedChangeSpy} />,
    'Big squad': <ListWithPanels {...args} defaultExpanded events={bigSquadEvents()} />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Answering from the list, on the right card. A chip reaches its own member and its own event,
    // which a per-card story cannot prove: five cards carry the same squad, so a factory closing over
    // the wrong event would look identical.
    const answerFrom = region('Answer from a card');
    const criticalCard = within(answerFrom.getByText('League Match vs Smash United').closest('.card-enter') as HTMLElement);
    await userEvent.click(criticalCard.getAllByRole('button', {
      name: /Sanne Bakker/
    })[0]);
    await userEvent.click(within(document.body).getByRole('button', {
      name: "Can't go"
    }));
    await expect(onRespondSpy).toHaveBeenCalledWith('evt-critical', SANNE[0], 'ABSENT');

    // \`Keep open\` is a *live* default (ADR-0030 §6): turning it on opens the cards the member never
    // touched, now — not on their next visit. The card holds its own open state, so this is the one
    // behaviour that only appears when the preference changes under a list that is already rendered.
    const keepOpen = region('Keep open');
    // An open card's own trigger reads \`Hide …\`, so counting those counts the open panels.
    const openPanels = () => keepOpen.queryAllByRole('button', {
      name: OPEN_PANEL
    });

    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(keepOpen.getAllByRole('button', {
      name: /Show lineup/
    })[0]);
    await expect(openPanels()).toHaveLength(1);
    await userEvent.click(keepOpen.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(keepOpen.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(onDefaultExpandedChangeSpy).toHaveBeenCalledWith(true);
    await expect(openPanels()).toHaveLength(5);

    // And off again, which has to close them just as promptly.
    await userEvent.click(keepOpen.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(onDefaultExpandedChangeSpy).toHaveBeenLastCalledWith(false);
    await expect(openPanels()).toHaveLength(0);

    // A club side of 17: expanding one card's crowded cluster leaves its neighbour untouched.
    const bigSquad = region('Big squad');
    const clubNight = within(bigSquad.getByText('Club Night').closest('.card-enter') as HTMLElement);
    await userEvent.click(clubNight.getByRole('button', {
      name: 'Show 8 more going'
    }));
    await expect(clubNight.getByRole('button', {
      name: /Member 16 —/
    })).toBeInTheDocument();
    // The five awaiting sit in their own cluster, which is at the cap and so shows in full: the limit
    // is per run of chips, not per row — and certainly not per list.
    await expect(clubNight.getByRole('button', {
      name: /Member 17 — Awaiting/
    })).toBeInTheDocument();
    await expect(bigSquad.getByRole('button', {
      name: /Sanne Bakker/
    })).toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`Interactions`]})))()}$();export{G as Data,Z as Interactions,J as Shells,Q as __namedExportsOrder,W as default};