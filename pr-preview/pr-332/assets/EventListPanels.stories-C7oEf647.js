import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CnCCNQOI.js";import{a as n,i as r,r as i,s as a,t as o}from"./event-fixtures-CuRrQuRB.js";import{n as s,t as c}from"./EventRosterPanel-CjNe6eSC.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./router-decorator-D_ZsG7bi.js";import{n as f,t as p}from"./modes-Bzyminl_.js";import{n as m,t as h}from"./EventListView-ClUKBPQm.js";function g({events:e,view:t=`pips`,defaultExpanded:n=!1,onViewChange:r,onDefaultExpandedChange:i}){let[a,o]=(0,_.useState)(t),[s,l]=(0,_.useState)(n);return(0,v.jsx)(h,{events:e,now:N,defaultRosterOpen:s,rosterPanel:e=>(0,v.jsx)(c,{event:e,view:a,onViewChange:e=>{r?.(e),o(e)},defaultExpanded:s,onDefaultExpandedChange:e=>{i?.(e),l(e)},currentUserId:w[0],detailHref:`/t/setpoint-vt/events/${e.id}`})})}var _,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{_=t(),d(),i(),m(),f(),s(),v=l(),{expect:y,fn:b,within:x}=__STORYBOOK_MODULE_TEST__,[S,C,w,T,E,D,O,k]=[[`u-1`,`Sanne Bakker`,`Setter`],[`u-2`,`Sofia de Wit`,`Setter`],[`u-3`,`Lars Peters`,`Libero`],[`u-4`,`Milan Visser`,`Middle`],[`u-5`,`Mees Jansen`,`Middle`],[`u-6`,`Tess de Groot`,`Outside`],[`u-7`,`Bram Willems`,`Outside`],[`u-8`,`Uwe Hofman`,`Unassigned`]],A=e=>e.map(([[e,t,n],i])=>r(e,t,n,{state:i})),j=(e,t,n)=>({id:`p-${e.toLowerCase()}`,label:e,required:t,attending:n,kind:`PLAYING`}),M={match:{id:`et-match`,name:`Match`,color:`#3b82f6`},training:{id:`et-training`,name:`Training`,color:`#249E6C`},social:{id:`et-social`,name:`Social`,color:`#E0A526`}},N=new Date(2026,7,10,9,0),P=(e,t=20)=>new Date(2026,7,e,t,0).toISOString(),F=n({id:`evt-critical`,eventType:M.match,title:`League Match vs Smash United`,startTime:P(11,14),location:`Sportcentrum Noord`,myState:`NOT_RESPONDED`,roster:a({state:`CRITICAL`,totalAttending:4,positions:[j(`Setter`,2,2),j(`Libero`,1,1),j(`Middle`,2,0),j(`Outside`,2,1)]}),attendances:A([[S,`ATTENDING`],[C,`ATTENDING`],[w,`ATTENDING`],[T,`ABSENT`],[E,`NOT_RESPONDED`],[D,`ATTENDING`],[O,`MAYBE`],[k,`NOT_RESPONDED`]])}),I=n({id:`evt-spots`,eventType:M.training,title:`Tuesday Training`,startTime:P(13),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:a({state:`SPOTS_OPEN`,totalAttending:5,positions:[j(`Setter`,2,1),j(`Libero`,1,1),j(`Middle`,2,2),j(`Outside`,2,1)]}),attendances:A([[S,`ATTENDING`],[C,`MAYBE`],[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ABSENT`],[k,`NOT_RESPONDED`]])}),L=n({id:`evt-set`,eventType:M.training,title:`Friday Training`,startTime:P(14),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:a({state:`LINEUP_SET`,totalAttending:7,positions:[j(`Setter`,2,2),j(`Libero`,1,1),j(`Middle`,2,2),j(`Outside`,2,2)]}),attendances:A([[S,`ATTENDING`],[C,`ATTENDING`],[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`NOT_RESPONDED`]])}),R=n({id:`evt-headcount`,eventType:M.match,title:`Regio-toernooi`,startTime:P(20,10),location:`Topsportcentrum`,myState:`MAYBE`,roster:a({state:`HEADCOUNT_SHORT`,totalTarget:8,totalAttending:5,openSlots:3,positions:[],unassignedAttending:5}),attendances:A([[S,`ATTENDING`],[C,`ATTENDING`],[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`MAYBE`],[O,`ABSENT`],[k,`NOT_RESPONDED`]])}),z=n({id:`evt-social`,eventType:M.social,title:`Season Drinks`,startTime:P(22,21),location:`Café De Zwaluw`,myState:`MAYBE`,roster:a({...o,totalAttending:4}),attendances:A([[S,`ATTENDING`],[C,`MAYBE`],[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`MAYBE`],[O,`ABSENT`],[k,`NOT_RESPONDED`]])}),B=[F,I,L,R,z],V={title:`widgets/event-panel/EventListPanels`,component:g,decorators:[u],args:{events:B},parameters:{chromatic:{modes:{light:p.light,dark:p.dark}}}},H={play:async({canvas:e})=>{await y(e.getByText(`Missing a position`)).toBeInTheDocument(),await y(e.getByText(`2 spots open`)).toBeInTheDocument(),await y(e.getByText(`Lineup set`)).toBeInTheDocument(),await y(e.getByText(`3 more needed`)).toBeInTheDocument(),await y(e.getByText(`4 going`)).toBeInTheDocument(),await y(e.queryByRole(`button`,{name:`People`})).not.toBeInTheDocument(),await y(e.queryByText(`Sanne Bakker`)).not.toBeInTheDocument()}},U={args:{defaultExpanded:!0},play:async({canvas:e})=>{await y(e.getAllByRole(`button`,{name:`Keep open`})).toHaveLength(5);for(let t of e.getAllByRole(`button`,{name:`Positions`}))await y(t).toHaveAttribute(`aria-pressed`,`true`);await y(e.getByText(/still has no one/)).toBeInTheDocument(),await y(e.getByText(`4 of 4 covered`)).toBeInTheDocument(),await y(e.getByText(`5/8 going`)).toBeInTheDocument(),await y(e.getAllByText(`Sanne Bakker`)).toHaveLength(1)}},W={args:{view:`members`,defaultExpanded:!0},play:async({canvas:e})=>{await y(e.getAllByRole(`heading`,{name:`Setter`})).toHaveLength(3),await y(e.getAllByText(`Uwe Hofman`)).toHaveLength(5),await y(e.getAllByText(`Awaiting`).length).toBeGreaterThan(0),await y(e.queryByRole(`button`,{name:/Change .+'s answer/})).not.toBeInTheDocument()}},G={args:{defaultExpanded:!0,onViewChange:b()},play:async({canvas:e,userEvent:t,args:n})=>{await y(e.getByText(/still has no one/)).toBeInTheDocument(),await y(e.getAllByText(`Sanne Bakker`)).toHaveLength(1),await t.click(e.getAllByRole(`button`,{name:`People`})[0]),await y(n.onViewChange).toHaveBeenCalledWith(`members`),await y(e.queryByText(/still has no one/)).not.toBeInTheDocument(),await y(e.queryByText(`4 of 4 covered`)).not.toBeInTheDocument(),await y(e.getAllByText(`Sanne Bakker`)).toHaveLength(5);for(let t of e.getAllByRole(`button`,{name:`People`}))await y(t).toHaveAttribute(`aria-pressed`,`true`)}},K={args:{onDefaultExpandedChange:b()},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:/Show lineup/})[0]),await y(e.getAllByRole(`button`,{name:`Keep open`})).toHaveLength(1),await t.click(e.getByRole(`button`,{name:`Keep open`})),await y(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0),await y(e.getAllByRole(`button`,{name:`Keep open`})).toHaveLength(5),await t.click(e.getAllByRole(`button`,{name:`Keep open`})[0]),await y(n.onDefaultExpandedChange).toHaveBeenLastCalledWith(!1),await y(e.queryByRole(`button`,{name:`Keep open`})).not.toBeInTheDocument()}},q=Array.from({length:17},(e,t)=>r(`u-big-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%4==0?`NOT_RESPONDED`:`ATTENDING`})),J={args:{view:`members`,defaultExpanded:!0,events:[n({id:`evt-big`,eventType:M.training,title:`Club Night`,startTime:P(12),roster:a({state:`TALLY_ONLY`,openSlots:0,totalAttending:13,positions:[]}),attendances:q}),z]},play:async({canvas:e})=>{let t=x(e.getByText(`Club Night`).closest(`.card-enter`));await y(t.getByText(`Member 15`)).toBeInTheDocument(),await y(t.queryByText(`Member 16`)).not.toBeInTheDocument(),await y(t.getByRole(`link`,{name:/See all 17/})).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-big`),await y(e.getByText(`Sanne Bakker`)).toBeInTheDocument()}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument();
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument();
    await expect(canvas.getByText('3 more needed')).toBeInTheDocument();
    await expect(canvas.getByText('4 going')).toBeInTheDocument(); // the social's headcount
    // Nothing is open, so no panel chrome is on screen at all.
    await expect(canvas.queryByRole('button', {
      name: 'People'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByText('Sanne Bakker')).not.toBeInTheDocument();
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true
  },
  play: async ({
    canvas
  }) => {
    // One open panel per card, four of them offering the switch — the social has only one view.
    await expect(canvas.getAllByRole('button', {
      name: 'Keep open'
    })).toHaveLength(5);
    for (const button of canvas.getAllByRole('button', {
      name: 'Positions'
    })) {
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument(); // CRITICAL's chase nudge
    await expect(canvas.getByText('4 of 4 covered')).toBeInTheDocument(); // LINEUP_SET's fraction
    await expect(canvas.getByText('5/8 going')).toBeInTheDocument(); // the headcount-only panel
    // The social has no pips to draw, so it opens onto its people whatever the preference says —
    // and it is the ONLY card naming anyone while the rest are on pips.
    await expect(canvas.getAllByText('Sanne Bakker')).toHaveLength(1);
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'People'
    })[0]);
    await expect(args.onViewChange).toHaveBeenCalledWith('members');
    // No card is left on the old view — the pips and their callouts are gone everywhere…
    await expect(canvas.queryByText(/still has no one/)).not.toBeInTheDocument();
    await expect(canvas.queryByText('4 of 4 covered')).not.toBeInTheDocument();
    // …and each of the five now names the team.
    await expect(canvas.getAllByText('Sanne Bakker')).toHaveLength(5);
    // Every switch reads as pressed, so no card disagrees about which view it is on.
    for (const button of canvas.getAllByRole('button', {
      name: 'People'
    })) {
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    onDefaultExpandedChange: fn()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // \`Keep open\` appears once per OPEN panel, so counting it counts the open cards.
    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(canvas.getAllByRole('button', {
      name: /Show lineup/
    })[0]);
    await expect(canvas.getAllByRole('button', {
      name: 'Keep open'
    })).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Keep open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true);
    await expect(canvas.getAllByRole('button', {
      name: 'Keep open'
    })).toHaveLength(5);

    // And off again, which has to close them just as promptly.
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Keep open'
    })[0]);
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false);
    await expect(canvas.queryByRole('button', {
      name: 'Keep open'
    })).not.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y=[`RestingList`,`EveryPanelOpenOnPips`,`EveryPanelOpenOnMembers`,`SwitchingTheViewMovesEveryCard`,`KeepOpenReachesEveryCardAtOnce`,`ABigSquadIsCapped`]})))()}X();export{J as ABigSquadIsCapped,W as EveryPanelOpenOnMembers,U as EveryPanelOpenOnPips,K as KeepOpenReachesEveryCardAtOnce,H as RestingList,G as SwitchingTheViewMovesEveryCard,Y as __namedExportsOrder,V as default};