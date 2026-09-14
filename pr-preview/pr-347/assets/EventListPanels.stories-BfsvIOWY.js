import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-exsfVg0I.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-CKd6OPi-.js";import{a,i as o,r as s,s as c,t as l}from"./event-fixtures-CuRrQuRB.js";import{n as u,t as d}from"./PanelViewMenu-Dpq68f5Z.js";import{n as f,t as p}from"./router-decorator-cUhowlgG.js";import{n as m,t as h}from"./EventListView-CeJutji_.js";import{n as g,t as _}from"./EventRosterPanel-ugfZnNQ0.js";function v({events:e,view:t=`pips`,defaultExpanded:n=!1,onViewChange:r,onDefaultExpandedChange:i}){let[a,o]=(0,y.useState)(t),[s,c]=(0,y.useState)(n);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{className:`mb-2 flex justify-end`,children:(0,b.jsx)(d,{view:a,onViewChange:e=>{r?.(e),o(e)},defaultExpanded:s,onDefaultExpandedChange:e=>{i?.(e),c(e)}})}),(0,b.jsx)(h,{events:e,now:F,defaultRosterOpen:s,rosterPanel:e=>(0,b.jsx)(_,{event:e,view:a,currentUserId:E[0],detailHref:`/t/setpoint-vt/events/${e.id}`})})]})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{y=t(),p(),s(),m(),u(),r(),g(),b=n(),{expect:x,fn:S,within:C}=__STORYBOOK_MODULE_TEST__,[w,T,E,D,O,k,A,j]=[[`u-1`,`Sanne Bakker`,`Setter`],[`u-2`,`Sofia de Wit`,`Setter`],[`u-3`,`Lars Peters`,`Libero`],[`u-4`,`Milan Visser`,`Middle`],[`u-5`,`Mees Jansen`,`Middle`],[`u-6`,`Tess de Groot`,`Outside`],[`u-7`,`Bram Willems`,`Outside`],[`u-8`,`Uwe Hofman`,`Unassigned`]],M=e=>e.map(([[e,t,n],r])=>o(e,t,n,{state:r})),N=(e,t,n)=>({id:`p-${e.toLowerCase()}`,label:e,required:t,attending:n,kind:`PLAYING`}),P={match:{id:`et-match`,name:`Match`,color:`#3b82f6`},training:{id:`et-training`,name:`Training`,color:`#249E6C`},social:{id:`et-social`,name:`Social`,color:`#E0A526`}},F=new Date(2026,7,10,9,0),I=(e,t=20)=>new Date(2026,7,e,t,0).toISOString(),L=a({id:`evt-critical`,eventType:P.match,title:`League Match vs Smash United`,startTime:I(11,14),location:`Sportcentrum Noord`,myState:`NOT_RESPONDED`,roster:c({state:`CRITICAL`,totalAttending:4,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,0),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ABSENT`],[O,`NOT_RESPONDED`],[k,`ATTENDING`],[A,`MAYBE`],[j,`NOT_RESPONDED`]])}),R=a({id:`evt-spots`,eventType:P.training,title:`Tuesday Training`,startTime:I(13),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:c({state:`SPOTS_OPEN`,totalAttending:5,positions:[N(`Setter`,2,1),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,1)]}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),z=a({id:`evt-set`,eventType:P.training,title:`Friday Training`,startTime:I(14),location:`Sporthal De Toekomst`,myState:`ATTENDING`,roster:c({state:`LINEUP_SET`,totalAttending:7,positions:[N(`Setter`,2,2),N(`Libero`,1,1),N(`Middle`,2,2),N(`Outside`,2,2)]}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`ATTENDING`],[A,`ATTENDING`],[j,`NOT_RESPONDED`]])}),B=a({id:`evt-headcount`,eventType:P.match,title:`Regio-toernooi`,startTime:I(20,10),location:`Topsportcentrum`,myState:`MAYBE`,roster:c({state:`HEADCOUNT_SHORT`,totalTarget:8,totalAttending:5,openSlots:3,positions:[],unassignedAttending:5}),attendances:M([[w,`ATTENDING`],[T,`ATTENDING`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),V=a({id:`evt-social`,eventType:P.social,title:`Season Drinks`,startTime:I(22,21),location:`Café De Zwaluw`,myState:`MAYBE`,roster:c({...l,totalAttending:4}),attendances:M([[w,`ATTENDING`],[T,`MAYBE`],[E,`ATTENDING`],[D,`ATTENDING`],[O,`ATTENDING`],[k,`MAYBE`],[A,`ABSENT`],[j,`NOT_RESPONDED`]])}),H=[L,R,z,B,V],U=/Hide (lineup|who's coming)/,W={title:`widgets/event-panel/EventListPanels`,component:v,decorators:[f],args:{events:H}},G={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await x(e.getByText(`Missing a position`)).toBeInTheDocument(),await x(e.getByText(`2 spots open`)).toBeInTheDocument(),await x(e.getByText(`Lineup set`)).toBeInTheDocument(),await x(e.getByText(`3 more needed`)).toBeInTheDocument(),await x(e.getByText(`4 going`)).toBeInTheDocument(),await x(e.queryByText(`Sanne Bakker`)).not.toBeInTheDocument(),await x(e.queryByText(`Positions`)).not.toBeInTheDocument()}},K=Array.from({length:17},(e,t)=>o(`u-big-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%4==0?`NOT_RESPONDED`:`ATTENDING`})),q={render:e=>(0,b.jsx)(i,{items:{"Every panel open on pips":(0,b.jsx)(v,{...e,defaultExpanded:!0}),"Every panel open on members":(0,b.jsx)(v,{...e,view:`members`,defaultExpanded:!0}),"A big squad is capped":(0,b.jsx)(v,{...e,view:`members`,defaultExpanded:!0,events:[a({id:`evt-big`,eventType:P.training,title:`Club Night`,startTime:I(12),roster:c({state:`TALLY_ONLY`,openSlots:0,totalAttending:13,positions:[]}),attendances:K}),V]})}}),play:async({canvas:e})=>{let t=t=>C(e.getByRole(`region`,{name:t}));await x(t(`Every panel open on pips`).getAllByRole(`button`,{name:U})).toHaveLength(5),await x(t(`Every panel open on pips`).queryByRole(`switch`,{name:`Keep panels open`})).not.toBeInTheDocument(),await x(t(`Every panel open on pips`).getByText(/still has no one/)).toBeInTheDocument(),await x(t(`Every panel open on pips`).getByText(`4 of 4 covered`)).toBeInTheDocument(),await x(t(`Every panel open on pips`).getByText(`5/8 going`)).toBeInTheDocument(),await x(t(`Every panel open on pips`).getAllByText(`Sanne Bakker`)).toHaveLength(1),await x(t(`Every panel open on members`).getAllByRole(`heading`,{name:`Setter`})).toHaveLength(3),await x(t(`Every panel open on members`).getAllByText(`Uwe Hofman`)).toHaveLength(5),await x(t(`Every panel open on members`).getAllByText(`Awaiting`).length).toBeGreaterThan(0),await x(t(`Every panel open on members`).queryByRole(`button`,{name:/Change .+'s answer/})).not.toBeInTheDocument();let n=C(t(`A big squad is capped`).getByText(`Club Night`).closest(`.card-enter`));await x(n.getByText(`Member 15`)).toBeInTheDocument(),await x(n.queryByText(`Member 16`)).not.toBeInTheDocument(),await x(n.getByRole(`link`,{name:/See all 17/})).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-big`),await x(t(`A big squad is capped`).getByText(`Sanne Bakker`)).toBeInTheDocument()}},J={parameters:{chromatic:{disableSnapshot:!0}},args:{onViewChange:S(),onDefaultExpandedChange:S()},render:e=>(0,b.jsx)(i,{items:{"Switch view":(0,b.jsx)(v,{...e,defaultExpanded:!0}),"Keep open":(0,b.jsx)(v,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>C(e.getByRole(`region`,{name:t}));await x(r(`Switch view`).getByText(/still has no one/)).toBeInTheDocument(),await x(r(`Switch view`).getAllByText(`Sanne Bakker`)).toHaveLength(1),await t.click(r(`Switch view`).getByRole(`button`,{name:`View options`})),await t.click(r(`Switch view`).getByRole(`button`,{name:`People`})),await t.keyboard(`{Escape}`),await x(n.onViewChange).toHaveBeenCalledWith(`members`),await x(r(`Switch view`).queryByText(/still has no one/)).not.toBeInTheDocument(),await x(r(`Switch view`).queryByText(`4 of 4 covered`)).not.toBeInTheDocument(),await x(r(`Switch view`).getAllByText(`Sanne Bakker`)).toHaveLength(5);let i=()=>r(`Keep open`).queryAllByRole(`button`,{name:U});await t.click(r(`Keep open`).getAllByRole(`button`,{name:/Show lineup/})[0]),await x(i()).toHaveLength(1),await t.click(r(`Keep open`).getByRole(`button`,{name:`View options`})),await t.click(r(`Keep open`).getByRole(`switch`,{name:`Keep panels open`})),await x(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0),await x(i()).toHaveLength(5),await t.click(r(`Keep open`).getByRole(`switch`,{name:`Keep panels open`})),await x(n.onDefaultExpandedChange).toHaveBeenLastCalledWith(!1),await x(i()).toHaveLength(0)}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // The pips variety in one frame: red rings for a position with nobody, a mixed row, a fully
    // covered row, and a headcount-only panel with no rows at all. The social ignores the
    // preference — it has no pips to show — which is the one card here that opens onto names.
    'Every panel open on pips': <ListWithPanels {...args} defaultExpanded />,
    // The same five events on the member view: grouped under their positions where the roster
    // has any, flat with a position subtitle where it does not, non-responders named throughout.
    'Every panel open on members': <ListWithPanels {...args} view="members" defaultExpanded />,
    // A club side of 17 beside a normal card: capped at 15 with the rest behind the event, so
    // one card on the member view cannot swallow the screen and stop the list being a list.
    'A big squad is capped': <ListWithPanels {...args} view="members" defaultExpanded events={[makeEvent({
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
    }), SOCIAL]} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // One open panel per card, and no preference chrome on any of them.
    await expect(region('Every panel open on pips').getAllByRole('button', {
      name: OPEN_PANEL
    })).toHaveLength(5);
    await expect(region('Every panel open on pips').queryByRole('switch', {
      name: 'Keep panels open'
    })).not.toBeInTheDocument();
    await expect(region('Every panel open on pips').getByText(/still has no one/)).toBeInTheDocument(); // CRITICAL's chase nudge
    await expect(region('Every panel open on pips').getByText('4 of 4 covered')).toBeInTheDocument(); // LINEUP_SET's fraction
    await expect(region('Every panel open on pips').getByText('5/8 going')).toBeInTheDocument(); // the headcount-only panel
    // The social has no pips to draw, so it opens onto its people whatever the preference says —
    // and it is the ONLY card naming anyone while the rest are on pips.
    await expect(region('Every panel open on pips').getAllByText('Sanne Bakker')).toHaveLength(1);
    await expect(region('Every panel open on members').getAllByRole('heading', {
      name: 'Setter'
    })).toHaveLength(3); // the 3 with positions
    await expect(region('Every panel open on members').getAllByText('Uwe Hofman')).toHaveLength(5); // a non-responder, on every card
    await expect(region('Every panel open on members').getAllByText('Awaiting').length).toBeGreaterThan(0);
    // Read-only on every card, not just the one the per-card story checks (#271 ⑫).
    await expect(region('Every panel open on members').queryByRole('button', {
      name: /Change .+'s answer/
    })).not.toBeInTheDocument();
    const card = within(region('A big squad is capped').getByText('Club Night').closest('.card-enter') as HTMLElement);
    await expect(card.getByText(\`Member \${MEMBER_CAP}\`)).toBeInTheDocument();
    await expect(card.queryByText(\`Member \${MEMBER_CAP + 1}\`)).not.toBeInTheDocument();
    await expect(card.getByRole('link', {
      name: /See all 17/
    })).toHaveAttribute('href', '/t/setpoint-vt/events/evt-big');
    // The neighbouring card is untouched by the cap — it is a per-card limit, not a list-wide one.
    await expect(region('A big squad is capped').getByText('Sanne Bakker')).toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    onViewChange: fn(),
    onDefaultExpandedChange: fn()
  },
  render: args => <Stack items={{
    'Switch view': <ListWithPanels {...args} defaultExpanded />,
    'Keep open': <ListWithPanels {...args} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Every tracked card starts on pips; only the social names anyone.
    await expect(region('Switch view').getByText(/still has no one/)).toBeInTheDocument();
    await expect(region('Switch view').getAllByText('Sanne Bakker')).toHaveLength(1);

    // One control, in the header — not one per card, which is the whole point of the move.
    await userEvent.click(region('Switch view').getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(region('Switch view').getByRole('button', {
      name: 'People'
    }));
    await userEvent.keyboard('{Escape}');
    await expect(args.onViewChange).toHaveBeenCalledWith('members');
    // No card is left on the old view — the pips and their callouts are gone everywhere…
    await expect(region('Switch view').queryByText(/still has no one/)).not.toBeInTheDocument();
    await expect(region('Switch view').queryByText('4 of 4 covered')).not.toBeInTheDocument();
    // …and each of the five now names the team.
    await expect(region('Switch view').getAllByText('Sanne Bakker')).toHaveLength(5);

    // An open card's own trigger reads \`Hide …\`, so counting those counts the open panels — and it
    // counts them whichever view they are on, and whatever the header popover is doing.
    const openPanels = () => region('Keep open').queryAllByRole('button', {
      name: OPEN_PANEL
    });

    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(region('Keep open').getAllByRole('button', {
      name: /Show lineup/
    })[0]);
    await expect(openPanels()).toHaveLength(1);
    await userEvent.click(region('Keep open').getByRole('button', {
      name: 'View options'
    }));
    await userEvent.click(region('Keep open').getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true);
    await expect(openPanels()).toHaveLength(5);

    // And off again, which has to close them just as promptly.
    await userEvent.click(region('Keep open').getByRole('switch', {
      name: 'Keep panels open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false);
    await expect(openPanels()).toHaveLength(0);
  }
}`,...J.parameters?.docs?.source}}},Y=[`Data`,`Shells`,`Interactions`]})))()}X();export{G as Data,J as Interactions,q as Shells,Y as __namedExportsOrder,W as default};