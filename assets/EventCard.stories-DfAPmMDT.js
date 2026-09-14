import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n,s as r}from"./event-fixtures-CuRrQuRB.js";import{n as i,t as a}from"./router-decorator-DE4TWH_U.js";import{n as o,t as s}from"./modes-Bzyminl_.js";import{n as c,t as l}from"./EventCard-Cn4y7_0x.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{a(),n(),o(),c(),{expect:u,fn:d}=__STORYBOOK_MODULE_TEST__,f=new Date(2026,7,10,9,0),p=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),m={title:`entities/event/EventCard`,component:l,decorators:[i],args:{now:f,myState:`NOT_RESPONDED`,onRespond:d()},parameters:{chromatic:{modes:{light:s.light,dark:s.dark}}}},h={args:{event:t({startTime:p(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await u(e.getByText(`13`)).toBeInTheDocument(),await u(e.getByText(`14:30`)).toBeInTheDocument(),await u(e.getByText(`Match`)).toBeInTheDocument(),await u(e.getByText(`Respond`)).toBeInTheDocument(),await u(e.queryByText(/of 8/)).not.toBeInTheDocument(),await u(e.queryByText(/pending/)).not.toBeInTheDocument()}},g={args:{event:t({startTime:p(13)}),myState:`ATTENDING`},play:async({canvas:e})=>{await u(e.getByText(`You're in`)).toBeInTheDocument()}},_={args:{event:t({startTime:p(13)})},play:async({canvas:e})=>{await u(e.getByText(`in 3 days`)).toBeInTheDocument()}},v={args:{event:t({startTime:p(11)})},play:async({canvas:e})=>{await u(e.getByText(`Tomorrow`)).toBeInTheDocument()}},y={args:{event:t({startTime:p(31)})},play:async({canvas:e})=>{await u(e.getByText(`31`)).toBeInTheDocument(),await u(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await u(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},b={args:{event:t({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:p(15,21,0),location:`Café De Hoek`,roster:{trackRoster:!1,totalTarget:void 0,totalAttending:11,playingAttending:11,staffAttending:0,positions:[],unassignedAttending:0,openSlots:0,state:`OFF`}})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`Social`)).toBeInTheDocument(),await u(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await u(e.getByText(`11 going`)).toBeInTheDocument(),await u(e.getByText(`This weekend`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Change your answer/})),await u(e.getByRole(`button`,{name:`Going`})).toBeInTheDocument()}},x={args:{event:t({startTime:p(13,14,30),location:`Sportcentrum Noord`,roster:r({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`Missing a position`)).toBeInTheDocument(),await u(e.queryByText(/the one to chase/)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await u(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await u(e.getByText(/still has no one/)).toBeInTheDocument()}},S={args:{event:t({title:`Training`,startTime:p(13,20,0),roster:r({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`1 more needed`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await u(e.getByText(`11/12 going`)).toBeInTheDocument(),await u(e.getByText(`1 staff also going, not counted toward the target`)).toBeInTheDocument(),await u(e.getByText(`Trainer`)).toBeInTheDocument()}},C={args:{event:t({startTime:p(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await u(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await u(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await u(e.getByText(`+1`)).toBeInTheDocument(),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},w={args:{event:t({startTime:p(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{await u(e.getByText(`Sporthal De Boog`)).toBeInTheDocument(),await u(t.querySelectorAll(`a[href*="maps.google.com"]`)).toHaveLength(0),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},T=(e,t,n)=>e.ownerDocument.elementFromPoint(t,n),E={args:{event:t({startTime:p(13),location:`Sportcentrum Noord`})},play:async({canvas:e,canvasElement:t,userEvent:n,args:r})=>{let i=e.getByRole(`button`,{name:/Change your answer/}),a=e.getByText(`Respond`).getBoundingClientRect(),o=T(t,a.left+a.width/2,a.top-6);await u(i.contains(o)).toBe(!0),await u(o?.closest(`a`)).toBeNull(),await n.click(o),await u(e.getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await u(r.onRespond).not.toHaveBeenCalled()}},D={args:{event:t({startTime:p(13),roster:r({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-libero`,label:`Libero`,required:2,attending:0,kind:`PLAYING`}]})})},play:async({canvas:e,canvasElement:t,userEvent:n})=>{let r=e.getByRole(`button`,{name:/Show lineup/}),i=e.getByText(`Missing a position`).getBoundingClientRect(),a=T(t,i.left+i.width/2,i.top-6);await u(r.contains(a)).toBe(!0),await u(a?.closest(`a`)).toBeNull(),await n.click(a),await u(e.getByText(`Positions`)).toBeInTheDocument()}},O={args:{event:t({startTime:p(13),roster:r()})},play:async({canvas:e})=>{for(let t of[/Change your answer/,/Show lineup/]){let n=e.getByRole(`button`,{name:t}).getBoundingClientRect();await u(n.height).toBeGreaterThanOrEqual(44)}}},k={args:{event:t({startTime:p(13),title:`Match vs Nova`,location:`Sportcentrum Noord`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Match vs Nova`}),r=n.getBoundingClientRect(),i=T(t,t.getBoundingClientRect().right-6,r.top+r.height/2);await u(i).toBe(n)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();

    // The verdict is its own disclosure now — opening it reveals the pips, not the answer control.
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
    // Not "Full" — the coach no longer fills a player's slot.
    await expect(canvas.getByText('1 more needed')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText('11/12 going')).toBeInTheDocument();
    await expect(canvas.getByText('1 staff also going, not counted toward the target')).toBeInTheDocument();
    // Excluded from the target, not hidden.
    await expect(canvas.getByText('Trainer')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText('Positions')).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`Populated`,`AnswerAttending`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`WithRosterVerdict`,`WithStaffAttending`,`WithReferences`,`WithLocation`,`AnswerTriggerBandIsTappable`,`RosterTriggerBandIsTappable`,`TriggersAreThumbSized`,`CardBodyStillNavigates`]})))()}j();export{g as AnswerAttending,E as AnswerTriggerBandIsTappable,k as CardBodyStillNavigates,h as Populated,D as RosterTriggerBandIsTappable,b as SocialEvent,O as TriggersAreThumbSized,w as WithLocation,_ as WithQuietRelativeLabel,C as WithReferences,x as WithRosterVerdict,v as WithSolidRelativeLabel,S as WithStaffAttending,y as WithoutRelativeLabel,A as __namedExportsOrder,m as default};