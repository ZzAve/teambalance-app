import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-x1v3kgdX.js";import{a as n,i as r,r as i,s as a,t as o}from"./event-fixtures-CuRrQuRB.js";import{n as s,t as c}from"./PanelViewMenu-DFz8LF7Y.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./router-decorator-D0YUF5mA.js";import{n as f,t as p}from"./modes-Bzyminl_.js";import{n as m,t as h}from"./EventListView-BVR1Pd2b.js";import{n as g,t as _}from"./EventRosterPanel-CwZnKeNm.js";function v({events:e,view:t=`pips`,defaultExpanded:n=!1,onViewChange:r,onDefaultExpandedChange:i}){let[a,o]=(0,y.useState)(t),[s,l]=(0,y.useState)(n);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{className:`mb-2 flex justify-end`,children:(0,b.jsx)(c,{view:a,onViewChange:e=>{r?.(e),o(e)},defaultExpanded:s,onDefaultExpandedChange:e=>{i?.(e),l(e)}})}),(0,b.jsx)(h,{events:e,now:F,defaultRosterOpen:s,rosterPanel:e=>(0,b.jsx)(_,{event:e,view:a,currentUserId:E[0],detailHref:`/t/setpoint-vt/events/${e.id}`})})]})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{y=t(),d(),i(),m(),s(),f(),g(),b=l(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,[w,T,E,D,O,k,A,j]=[[`u-1`,`Sanne Bakker`,`Setter`],[`u-2`,`Sofia de Wit`,`Setter`],[`u-3`,`Lars Peters`,`Libero`],[`u-4`,`Milan Visser`,`Middle`],[`u-5`,`Mees Jansen`,`Middle`],[`u-6`,`Tess de Groot`,`Outside`],[`u-7`,`Bram Willems`,`Outside`],[`u-8`,`Uwe Hofman`,`Unassigned`]],M=e=>e.map(([[e,t,n],i])=>r(e,t,n,{state:i})),N=(e,t,n)=>({id:`p-${e.toLowerCase()}`,label:e,required:t,attending:n,kind:`PLAYING`}),P={match:{id:`et-match`,name:`Match`,color:`#3b82f6`},training:{id:`et-training`,name:`Training`,color:`#249E6C`},social:{id:`et-social`,name:`Social`,color:`#E0A526`}},F=new Date(2026,7,10,9,0),I=(e,t=20)=>new Date(2026,7,e,t,0).toISOString(),L=n({id:`evt-critical`,eventType:P.match,title:`League Match vs Smash United`,startTime:I(11,14),location:`Sportcentrum Noord`,myState:`NOT_RESPONDED`,roster:a({state:`CRITICAL`,totalAttending:4,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,0),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ABSENT`],[O,`NOT_RESPONDED`],[k,`ATTENDING`],[A,`MAYBE`],[j,`NOT_RESPONDED`]])}),R=n({id:`evt-spots`,eventType:P.training,title:`Tuesday Training`,startTime:I(13),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:a({state:`SPOTS_OPEN`,totalAttending:5,positions:[N(`Setter`,2,1),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),z=n({id:`evt-set`,eventType:P.training,title:`Friday Training`,startTime:I(14),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:a({state:`LINEUP_SET`,totalAttending:7,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,2)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ATTENDING`],[j,`NOT_RESPONDED`]])}),B=n({id:`evt-headcount`,eventType:P.match,title:`Regio-toernooi`,startTime:I(20,10),location:`Topsportcentrum`,myState:`MAYBE`,roster:a({state:`HEADCOUNT_SHORT`,totalTarget:8,totalAttending:5,openSlots:3,positions:[],unassignedAttending:5}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),V=n({id:`evt-social`,eventType:P.social,title:`Season Drinks`,startTime:I(22,21),location:`Café De Zwaluw`,myState:`MAYBE`,roster:a({...o,totalAttending:4}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),H=[L,R,z,B,V],U=/Hide (lineup|who's coming)/,W={title:`widgets/event-panel/EventListPanels`,component:v,decorators:[u],args:{events:H},parameters:{chromatic:{modes:{light:p.light,dark:p.dark}}}},G={play:async({canvas:e})=>{await x(e.getByText(`Missing a position`)).toBeInTheDocument(),await x(e.getByText(`2 spots open`)).toBeInTheDocument(),await x(e.getByText(`Lineup set`)).toBeInTheDocument(),await x(e.getByText(`3 more needed`)).toBeInTheDocument(),await x(e.getByText(`4 going`)).toBeInTheDocument(),await x(e.queryByText(`Sanne Bakker`)).not.toBeInTheDocument(),await x(e.queryByText(`Positions`)).not.toBeInTheDocument()}},K={args:{defaultExpanded:!0},play:async({canvas:e})=>{await x(e.getAllByRole(`button`,{name:U})).toHaveLength(5),await x(e.queryByRole(`switch`,{name:`Keep panels open`})).not.toBeInTheDocument(),await x(e.getByText(/still has no one/)).toBeInTheDocument(),await x(e.getByText(`4 of 4 covered`)).toBeInTheDocument(),await x(e.getByText(`5/8 going`)).toBeInTheDocument(),await x(e.getAllByText(`Sanne Bakker`)).toHaveLength(1)}},q={args:{view:`members`,defaultExpanded:!0},play:async({canvas:e})=>{await x(e.getAllByRole(`heading`,{name:`Setter`})).toHaveLength(3),await x(e.getAllByText(`Uwe Hofman`)).toHaveLength(5),await x(e.getAllByText(`Awaiting`).length).toBeGreaterThan(0),await x(e.queryByRole(`button`,{name:/Change .+'s answer/})).not.toBeInTheDocument()}},J={args:{defaultExpanded:!0,onViewChange:S()},play:async({canvas:e,userEvent:t,args:n})=>{await x(e.getByText(/still has no one/)).toBeInTheDocument(),await x(e.getAllByText(`Sanne Bakker`)).toHaveLength(1),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`button`,{name:`People`})),await t.keyboard(`{Escape}`),await x(n.onViewChange).toHaveBeenCalledWith(`members`),await x(e.queryByText(/still has no one/)).not.toBeInTheDocument(),await x(e.queryByText(`4 of 4 covered`)).not.toBeInTheDocument(),await x(e.getAllByText(`Sanne Bakker`)).toHaveLength(5)}},Y={args:{onDefaultExpandedChange:S()},play:async({canvas:e,userEvent:t,args:n})=>{let r=()=>e.queryAllByRole(`button`,{name:U});await t.click(e.getAllByRole(`button`,{name:/Show lineup/})[0]),await x(r()).toHaveLength(1),await t.click(e.getByRole(`button`,{name:`View options`})),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await x(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0),await x(r()).toHaveLength(5),await t.click(e.getByRole(`switch`,{name:`Keep panels open`})),await x(n.onDefaultExpandedChange).toHaveBeenLastCalledWith(!1),await x(r()).toHaveLength(0)}},X=Array.from({length:17},(e,t)=>r(`u-big-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%4==0?`NOT_RESPONDED`:`ATTENDING`})),Z={args:{view:`members`,defaultExpanded:!0,events:[n({id:`evt-big`,eventType:P.training,title:`Club Night`,startTime:I(12),roster:a({state:`TALLY_ONLY`,openSlots:0,totalAttending:13,positions:[]}),attendances:X}),V]},play:async({canvas:e})=>{let t=C(e.getByText(`Club Night`).closest(`.card-enter`));await x(t.getByText(`Member 15`)).toBeInTheDocument(),await x(t.queryByText(`Member 16`)).not.toBeInTheDocument(),await x(t.getByRole(`link`,{name:/See all 17/})).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-big`),await x(e.getByText(`Sanne Bakker`)).toBeInTheDocument()}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true
  },
  play: async ({
    canvas
  }) => {
    // One open panel per card, and no preference chrome on any of them.
    await expect(canvas.getAllByRole('button', {
      name: OPEN_PANEL
    })).toHaveLength(5);
    await expect(canvas.queryByRole('switch', {
      name: 'Keep panels open'
    })).not.toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument(); // CRITICAL's chase nudge
    await expect(canvas.getByText('4 of 4 covered')).toBeInTheDocument(); // LINEUP_SET's fraction
    await expect(canvas.getByText('5/8 going')).toBeInTheDocument(); // the headcount-only panel
    // The social has no pips to draw, so it opens onto its people whatever the preference says —
    // and it is the ONLY card naming anyone while the rest are on pips.
    await expect(canvas.getAllByText('Sanne Bakker')).toHaveLength(1);
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members',
    defaultExpanded: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getAllByRole('heading', {
      name: 'Setter'
    })).toHaveLength(3); // the 3 with positions
    await expect(canvas.getAllByText('Uwe Hofman')).toHaveLength(5); // a non-responder, on every card
    await expect(canvas.getAllByText('Awaiting').length).toBeGreaterThan(0);
    // Read-only on every card, not just the one the per-card story checks (#271 ⑫).
    await expect(canvas.queryByRole('button', {
      name: /Change .+'s answer/
    })).not.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true,
    onViewChange: fn()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Every tracked card starts on pips; only the social names anyone.
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
    await expect(canvas.getAllByText('Sanne Bakker')).toHaveLength(1);

    // One control, in the header — not one per card, which is the whole point of the move.
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'People'
    }));
    await userEvent.keyboard('{Escape}');
    await expect(args.onViewChange).toHaveBeenCalledWith('members');
    // No card is left on the old view — the pips and their callouts are gone everywhere…
    await expect(canvas.queryByText(/still has no one/)).not.toBeInTheDocument();
    await expect(canvas.queryByText('4 of 4 covered')).not.toBeInTheDocument();
    // …and each of the five now names the team.
    await expect(canvas.getAllByText('Sanne Bakker')).toHaveLength(5);
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    onDefaultExpandedChange: fn()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // An open card's own trigger reads \`Hide …\`, so counting those counts the open panels — and it
    // counts them whichever view they are on, and whatever the header popover is doing.
    const openPanels = () => canvas.queryAllByRole('button', {
      name: OPEN_PANEL
    });

    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Show lineup/
    })[0]);
    await expect(openPanels()).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true);
    await expect(openPanels()).toHaveLength(5);

    // And off again, which has to close them just as promptly.
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false);
    await expect(openPanels()).toHaveLength(0);
  }
}`,...Y.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members',
    defaultExpanded: true,
    events: [makeEvent({
      id: 'evt-big',
      eventType: TYPES.training,
      title: 'Club Night',
      startTime: on(12),
      roster: makeRoster({
        state: 'TALLY_ONLY',
        openSlots: 0,
        totalAttending: 13,
        positions: []
      }),
      attendances: BIG_SQUAD
    }), SOCIAL]
  },
  play: async ({
    canvas
  }) => {
    const card = within(canvas.getByText('Club Night').closest('.card-enter') as HTMLElement);
    await expect(card.getByText(\`Member \${MEMBER_CAP}\`)).toBeInTheDocument();
    await expect(card.queryByText(\`Member \${MEMBER_CAP + 1}\`)).not.toBeInTheDocument();
    await expect(card.getByRole('link', {
      name: /See all 17/
    })).toHaveAttribute('href', '/t/setpoint-vt/events/evt-big');
    // The neighbouring card is untouched by the cap — it is a per-card limit, not a list-wide one.
    await expect(canvas.getByText('Sanne Bakker')).toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q=[`RestingList`,`EveryPanelOpenOnPips`,`EveryPanelOpenOnMembers`,`SwitchingTheViewMovesEveryCard`,`KeepOpenReachesEveryCardAtOnce`,`ABigSquadIsCapped`]})))()}$();export{Z as ABigSquadIsCapped,q as EveryPanelOpenOnMembers,K as EveryPanelOpenOnPips,Y as KeepOpenReachesEveryCardAtOnce,G as RestingList,J as SwitchingTheViewMovesEveryCard,Q as __namedExportsOrder,W as default};