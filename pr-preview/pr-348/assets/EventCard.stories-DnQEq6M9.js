import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n,s as r}from"./event-fixtures-CuRrQuRB.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./router-decorator-iKEF1Xv_.js";import{n as s,t as c}from"./modes-Bzyminl_.js";import{n as l,t as u}from"./EventCard-Do8YhMAi.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{o(),n(),s(),l(),d=i(),{expect:f,fn:p}=__STORYBOOK_MODULE_TEST__,m=new Date(2026,7,10,9,0),h=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),g=(0,d.jsx)(`p`,{children:`Setter · Sanne, Sofia`}),_=`Setter · Sanne, Sofia`,v={title:`entities/event/EventCard`,component:u,decorators:[a],args:{now:m,myState:`NOT_RESPONDED`,onRespond:p(),rosterPanel:g},parameters:{chromatic:{modes:{light:c.light,dark:c.dark}}}},y={args:{event:t({startTime:h(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await f(e.getByText(`13`)).toBeInTheDocument(),await f(e.getByText(`14:30`)).toBeInTheDocument(),await f(e.getByText(`Match`)).toBeInTheDocument(),await f(e.getByText(`Respond`)).toBeInTheDocument(),await f(e.queryByText(/of 8/)).not.toBeInTheDocument(),await f(e.queryByText(/pending/)).not.toBeInTheDocument()}},b={args:{event:t({startTime:h(13)}),myState:`ATTENDING`},play:async({canvas:e})=>{await f(e.getByText(`You're in`)).toBeInTheDocument()}},x={args:{event:t({startTime:h(13)})},play:async({canvas:e})=>{await f(e.getByText(`in 3 days`)).toBeInTheDocument()}},S={args:{event:t({startTime:h(11)})},play:async({canvas:e})=>{await f(e.getByText(`Tomorrow`)).toBeInTheDocument()}},C={args:{event:t({startTime:h(31)})},play:async({canvas:e})=>{await f(e.getByText(`31`)).toBeInTheDocument(),await f(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await f(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},w={args:{event:t({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:h(15,21,0),location:`Café De Hoek`,roster:{trackRoster:!1,totalTarget:void 0,totalAttending:11,playingAttending:11,staffAttending:0,positions:[],unassignedAttending:0,openSlots:0,state:`OFF`}})},play:async({canvas:e,userEvent:t})=>{await f(e.getByText(`Social`)).toBeInTheDocument(),await f(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await f(e.getByText(`11 going`)).toBeInTheDocument(),await f(e.getByText(`This weekend`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Change your answer/})),await f(e.getByRole(`button`,{name:`Going`})).toBeInTheDocument()}},T={args:{event:t({startTime:h(13,14,30),location:`Sportcentrum Noord`,roster:r({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})})},play:async({canvas:e,userEvent:t})=>{await f(e.getByText(`Missing a position`)).toBeInTheDocument(),await f(e.queryByText(_)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await f(e.getByText(_)).toBeInTheDocument(),await f(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument()}},E={args:{event:t({title:`Training`,startTime:h(13,20,0),roster:r({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})})},play:async({canvas:e,userEvent:t})=>{await f(e.getByText(`1 more needed`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await f(e.getByText(_)).toBeInTheDocument()}},D={args:{event:t({startTime:h(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await f(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await f(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await f(e.getByText(`+1`)).toBeInTheDocument(),await f(t.querySelectorAll(`a a`)).toHaveLength(0)}},O={args:{event:t({startTime:h(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{await f(e.getByText(`Sporthal De Boog`)).toBeInTheDocument(),await f(t.querySelectorAll(`a[href*="maps.google.com"]`)).toHaveLength(0),await f(t.querySelectorAll(`a a`)).toHaveLength(0)}},k=(e,t,n)=>e.ownerDocument.elementFromPoint(t,n),A={args:{event:t({startTime:h(13),location:`Sportcentrum Noord`})},play:async({canvas:e,canvasElement:t,userEvent:n,args:r})=>{let i=e.getByRole(`button`,{name:/Change your answer/}),a=e.getByText(`Respond`).getBoundingClientRect(),o=k(t,a.left+a.width/2,a.top-6);await f(i.contains(o)).toBe(!0),await f(o?.closest(`a`)).toBeNull(),await n.click(o),await f(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await f(r.onRespond).not.toHaveBeenCalled()}},j={args:{event:t({startTime:h(13),roster:r({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-libero`,label:`Libero`,required:2,attending:0,kind:`PLAYING`}]})})},play:async({canvas:e,canvasElement:t,userEvent:n})=>{let r=e.getByRole(`button`,{name:/Show lineup/}),i=e.getByText(`Missing a position`).getBoundingClientRect(),a=k(t,i.left+i.width/2,i.top-6);await f(r.contains(a)).toBe(!0),await f(a?.closest(`a`)).toBeNull(),await n.click(a),await f(e.getByText(_)).toBeInTheDocument()}},M={args:{event:t({startTime:h(13),roster:r()})},play:async({canvas:e})=>{for(let t of[/Change your answer/,/Show lineup/]){let n=e.getByRole(`button`,{name:t}).getBoundingClientRect();await f(n.height).toBeGreaterThanOrEqual(44)}}},N={args:{event:t({startTime:h(13),title:`Match vs Nova`,location:`Sportcentrum Noord`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Match vs Nova`}),r=n.getBoundingClientRect(),i=k(t,t.getBoundingClientRect().right-6,r.top+r.height/2);await f(i).toBe(n)}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord'
    })
  },
  play: async ({
    canvas
  }) => {
    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(canvas.getByText('13')).toBeInTheDocument();
    await expect(canvas.getByText('14:30')).toBeInTheDocument();
    // The type text label stays alongside the chit's colour.
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    // The bottom row answers "what did I say?" — unanswered here, so it asks.
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    // The old "✓ 5 going · of 8 · 3 pending" counts are gone from the card.
    await expect(canvas.queryByText(/of 8/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/pending/)).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13)
    }),
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('in 3 days')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(11)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Tomorrow')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(31)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('31')).toBeInTheDocument();
    await expect(canvas.queryByText(/^in \\d+ days$/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      eventType: {
        id: 'et-4',
        name: 'Social',
        color: '#F4B400'
      },
      title: 'Season kick-off drinks',
      startTime: on(15, 21, 0),
      location: 'Café De Hoek',
      roster: {
        trackRoster: false,
        totalTarget: undefined,
        totalAttending: 11,
        playingAttending: 11,
        staffAttending: 0,
        positions: [],
        unassignedAttending: 0,
        openSlots: 0,
        state: 'OFF'
      }
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument();
    await expect(canvas.getByText('Season kick-off drinks')).toBeInTheDocument();
    // No roster verdict, so the headcount fallback carries the team information.
    await expect(canvas.getByText('11 going')).toBeInTheDocument();
    // The 15th is the Saturday of the current week.
    await expect(canvas.getByText('This weekend')).toBeInTheDocument();
    // Tapping the row opens the answer control even for a social.
    await userEvent.click(canvas.getByRole('button', {
      name: /Change your answer/
    }));
    await expect(canvas.getByRole('button', {
      name: 'Going'
    })).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord',
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [{
          id: 'pos-setter',
          label: 'Setter',
          required: 2,
          attending: 2,
          kind: 'PLAYING'
        }, {
          id: 'pos-libero',
          label: 'Libero',
          required: 1,
          attending: 0,
          kind: 'PLAYING'
        }, {
          id: 'pos-middle',
          label: 'Middle',
          required: 2,
          attending: 1,
          kind: 'PLAYING'
        }]
      })
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument();
    // Collapsed on a list card until asked.
    await expect(canvas.queryByText(PANEL_TEXT)).not.toBeInTheDocument();

    // The verdict is its own disclosure — opening it reveals the lineup, not the answer control.
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      title: 'Training',
      startTime: on(13, 20, 0),
      roster: makeRoster({
        state: 'HEADCOUNT_SHORT',
        openSlots: 1,
        totalTarget: 12,
        totalAttending: 12,
        positions: [{
          id: 'pos-setter',
          label: 'Setter',
          required: undefined,
          attending: 11,
          kind: 'PLAYING'
        }, {
          id: 'pos-trainer',
          label: 'Trainer',
          required: undefined,
          attending: 1,
          kind: 'STAFF'
        }]
      })
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    // Not "Full" — the coach no longer fills a player's slot. That is the card's half of #281; the
    // panel's half (the 11/12 fraction and the staff line) is in EventLineupPanel.stories.
    await expect(canvas.getByText('1 more needed')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      references: [{
        title: 'Nevobo',
        url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133'
      }, {
        title: 'Match form',
        url: 'https://dwf.volleybal.nl/match/42'
      }, {
        title: 'Route',
        url: 'https://maps.example.com/hall'
      }]
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // Two chips visible on the card, the third collapsed into "+1".
    await expect(canvas.getByRole('link', {
      name: /Nevobo/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: /Match form/
    })).toBeInTheDocument();
    await expect(canvas.getByText('+1')).toBeInTheDocument();
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      location: 'Sporthal De Boog'
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // The location is plain text on the card (ADR-0030 §9): a maps link is a destination competing
    // with the card's own, right beside the disclosures. It lives on the detail page instead.
    await expect(canvas.getByText('Sporthal De Boog')).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('a[href*="maps.google.com"]')).toHaveLength(0);
    // The reference chips are still sibling anchors of the card's own <Link>, never nested inside
    // it (invalid HTML — the "<a> cannot contain a nested <a>" warning, #273); the card stays
    // clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      location: 'Sportcentrum Noord'
    })
  },
  play: async ({
    canvas,
    canvasElement,
    userEvent,
    args
  }) => {
    const trigger = canvas.getByRole('button', {
      name: /Change your answer/
    });
    const pill = canvas.getByText('Respond').getBoundingClientRect();

    // 6px above the pill: inside the strip's top spacing, where a high thumb lands.
    const hit = hitAt(canvasElement, pill.left + pill.width / 2, pill.top - 6);
    await expect(trigger.contains(hit)).toBe(true);
    // …and it is not the card's stretched link.
    await expect(hit?.closest('a')).toBeNull();
    await userEvent.click(hit as HTMLElement);
    // The disclosure fired: the three-way answer control is open, and nothing was answered for us.
    await expect(canvas.getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
    await expect(args.onRespond).not.toHaveBeenCalled();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [{
          id: 'pos-libero',
          label: 'Libero',
          required: 2,
          attending: 0,
          kind: 'PLAYING'
        }]
      })
    })
  },
  play: async ({
    canvas,
    canvasElement,
    userEvent
  }) => {
    const trigger = canvas.getByRole('button', {
      name: /Show lineup/
    });
    const badge = canvas.getByText('Missing a position').getBoundingClientRect();
    const hit = hitAt(canvasElement, badge.left + badge.width / 2, badge.top - 6);
    await expect(trigger.contains(hit)).toBe(true);
    await expect(hit?.closest('a')).toBeNull();
    await userEvent.click(hit as HTMLElement);
    await expect(canvas.getByText(PANEL_TEXT)).toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      roster: makeRoster()
    })
  },
  play: async ({
    canvas
  }) => {
    for (const name of [/Change your answer/, /Show lineup/]) {
      const box = canvas.getByRole('button', {
        name
      }).getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      title: 'Match vs Nova',
      location: 'Sportcentrum Noord'
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    const link = canvas.getByRole('link', {
      name: 'Match vs Nova'
    });
    const title = link.getBoundingClientRect();

    // Blank card surface to the right of the title — covered by the link's stretched overlay.
    const hit = hitAt(canvasElement, canvasElement.getBoundingClientRect().right - 6, title.top + title.height / 2);
    await expect(hit).toBe(link);
  }
}`,...N.parameters?.docs?.source}}},P=[`Populated`,`AnswerAttending`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`WithRosterVerdict`,`WithStaffAttending`,`WithReferences`,`WithLocation`,`AnswerTriggerBandIsTappable`,`RosterTriggerBandIsTappable`,`TriggersAreThumbSized`,`CardBodyStillNavigates`]})))()}F();export{b as AnswerAttending,A as AnswerTriggerBandIsTappable,N as CardBodyStillNavigates,y as Populated,j as RosterTriggerBandIsTappable,w as SocialEvent,M as TriggersAreThumbSized,O as WithLocation,x as WithQuietRelativeLabel,D as WithReferences,T as WithRosterVerdict,S as WithSolidRelativeLabel,E as WithStaffAttending,C as WithoutRelativeLabel,P as __namedExportsOrder,v as default};