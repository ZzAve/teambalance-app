import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-CN0e_lCC.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as s}from"./router-decorator-CakS7x0S.js";import{a as c,r as l,s as u}from"./event-fixtures-CuRrQuRB.js";import{n as d,t as f}from"./EventCard-CMRTIf1q.js";var p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{s(),l(),i(),n(),d(),p=r(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_=new Date(2026,7,10,9,0),v=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),y=(0,p.jsx)(`p`,{children:`Setter · Sanne, Sofia`}),b=`Setter · Sanne, Sofia`,x={title:`entities/event/EventCard`,component:f,decorators:[o],args:{now:_,myState:`NOT_RESPONDED`,onRespond:h(),rosterPanel:y},parameters:{chromatic:{modes:t}}},S={args:{event:c()},render:e=>(0,p.jsx)(a,{items:{Populated:(0,p.jsx)(f,{...e,event:c({startTime:v(13,14,30),location:`Sportcentrum Noord`})}),Answered:(0,p.jsx)(f,{...e,event:c({startTime:v(13)}),myState:`ATTENDING`}),"Quiet relative label":(0,p.jsx)(f,{...e,event:c({startTime:v(13)})}),"Solid relative label":(0,p.jsx)(f,{...e,event:c({startTime:v(11)})}),"No relative label":(0,p.jsx)(f,{...e,event:c({startTime:v(31)})}),"Social event":(0,p.jsx)(f,{...e,event:c({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:v(15,21,0),location:`Café De Hoek`,roster:{trackRoster:!1,totalTarget:void 0,totalAttending:11,playingAttending:11,staffAttending:0,positions:[],unassignedAttending:0,openSlots:0,state:`OFF`}})}),"Roster verdict":(0,p.jsx)(f,{...e,defaultRosterOpen:!0,event:c({startTime:v(13,14,30),location:`Sportcentrum Noord`,roster:u({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})})}),"Staff attending":(0,p.jsx)(f,{...e,defaultRosterOpen:!0,event:c({title:`Training`,startTime:v(13,20,0),roster:u({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})})}),"With references":(0,p.jsx)(f,{...e,event:c({startTime:v(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})}),"With location":(0,p.jsx)(f,{...e,event:c({startTime:v(13),location:`Sporthal De Boog`})})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await m(t(`Populated`).getByText(`13`)).toBeInTheDocument(),await m(t(`Populated`).getByText(`14:30`)).toBeInTheDocument(),await m(t(`Populated`).getByText(`Match`)).toBeInTheDocument(),await m(t(`Populated`).getByText(`Respond`)).toBeInTheDocument(),await m(t(`Populated`).queryByText(/of 8/)).not.toBeInTheDocument(),await m(t(`Populated`).queryByText(/pending/)).not.toBeInTheDocument(),await m(t(`Answered`).getByText(`You're in`)).toBeInTheDocument(),await m(t(`Quiet relative label`).getByText(`in 3 days`)).toBeInTheDocument(),await m(t(`Solid relative label`).getByText(`Tomorrow`)).toBeInTheDocument(),await m(t(`No relative label`).getByText(`31`)).toBeInTheDocument(),await m(t(`No relative label`).queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await m(t(`No relative label`).queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument(),await m(t(`Social event`).getByText(`Social`)).toBeInTheDocument(),await m(t(`Social event`).getByText(`Season kick-off drinks`)).toBeInTheDocument(),await m(t(`Social event`).getByText(`11 going`)).toBeInTheDocument(),await m(t(`Social event`).getByText(`This weekend`)).toBeInTheDocument(),await m(t(`Roster verdict`).getByText(`Missing a position`)).toBeInTheDocument(),await m(t(`Roster verdict`).getByText(b)).toBeInTheDocument(),await m(t(`Staff attending`).getByText(`1 more needed`)).toBeInTheDocument(),await m(t(`Staff attending`).getByText(b)).toBeInTheDocument(),await m(t(`With references`).getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await m(t(`With references`).getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await m(t(`With references`).getByText(`+1`)).toBeInTheDocument(),await m(e.getByRole(`region`,{name:`With references`}).querySelectorAll(`a a`)).toHaveLength(0),await m(t(`With location`).getByText(`Sporthal De Boog`)).toBeInTheDocument();let n=e.getByRole(`region`,{name:`With location`});await m(n.querySelectorAll(`a[href*="maps.google.com"]`)).toHaveLength(0),await m(n.querySelectorAll(`a a`)).toHaveLength(0)}},C=(e,t,n)=>e.ownerDocument.elementFromPoint(t,n),w={parameters:{chromatic:{disableSnapshot:!0}},args:{event:c()},render:e=>(0,p.jsx)(a,{items:{"Social event":(0,p.jsx)(f,{...e,event:c({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:v(15,21,0),location:`Café De Hoek`,roster:{trackRoster:!1,totalTarget:void 0,totalAttending:11,playingAttending:11,staffAttending:0,positions:[],unassignedAttending:0,openSlots:0,state:`OFF`}})}),"Roster verdict":(0,p.jsx)(f,{...e,event:c({startTime:v(13,14,30),location:`Sportcentrum Noord`,roster:u({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`}]})})}),"Staff attending":(0,p.jsx)(f,{...e,event:c({title:`Training`,startTime:v(13,20,0),roster:u({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})})}),"Answer trigger band":(0,p.jsx)(f,{...e,event:c({startTime:v(13),location:`Sportcentrum Noord`})}),"Roster trigger band":(0,p.jsx)(f,{...e,event:c({startTime:v(13),roster:u({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-libero`,label:`Libero`,required:2,attending:0,kind:`PLAYING`}]})})}),"Thumb sized":(0,p.jsx)(f,{...e,event:c({startTime:v(13),roster:u()})}),"Card body still navigates":(0,p.jsx)(f,{...e,event:c({startTime:v(13),title:`Match vs Nova`,location:`Sportcentrum Noord`})})}}),play:async({canvas:e,canvasElement:t,userEvent:n,args:r})=>{let i=t=>g(e.getByRole(`region`,{name:t}));await n.click(i(`Social event`).getByRole(`button`,{name:/Change your answer/})),await m(i(`Social event`).getByRole(`button`,{name:`Going`})).toBeInTheDocument(),await m(i(`Roster verdict`).queryByText(b)).not.toBeInTheDocument(),await n.click(i(`Roster verdict`).getByRole(`button`,{name:/Show lineup/})),await m(i(`Roster verdict`).getByText(b)).toBeInTheDocument(),await n.click(i(`Staff attending`).getByRole(`button`,{name:/Show lineup/})),await m(i(`Staff attending`).getByText(b)).toBeInTheDocument();let a=i(`Answer trigger band`).getByRole(`button`,{name:/Change your answer/}),o=i(`Answer trigger band`).getByText(`Respond`);o.scrollIntoView({block:`center`});let s=o.getBoundingClientRect(),c=C(t,s.left+s.width/2,s.top-6);await m(a.contains(c)).toBe(!0),await m(c?.closest(`a`)).toBeNull(),await n.click(c),await m(i(`Answer trigger band`).getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await m(r.onRespond).not.toHaveBeenCalled();let l=i(`Roster trigger band`).getByRole(`button`,{name:/Show lineup/}),u=i(`Roster trigger band`).getByText(`Missing a position`);u.scrollIntoView({block:`center`});let d=u.getBoundingClientRect(),f=C(t,d.left+d.width/2,d.top-6);await m(l.contains(f)).toBe(!0),await m(f?.closest(`a`)).toBeNull(),await n.click(f),await m(i(`Roster trigger band`).getByText(b)).toBeInTheDocument();for(let e of[/Change your answer/,/Show lineup/]){let t=i(`Thumb sized`).getByRole(`button`,{name:e}).getBoundingClientRect();await m(t.height).toBeGreaterThanOrEqual(44)}let p=i(`Card body still navigates`).getByRole(`link`,{name:`Match vs Nova`});p.scrollIntoView({block:`center`});let h=p.getBoundingClientRect(),_=C(t,t.getBoundingClientRect().right-6,h.top+h.height/2);await m(_).toBe(p)}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  // Unused by render below — every Stack item supplies its own \`event\` — but required to satisfy
  // the story's prop contract (\`event\` is required on EventCard).
  args: {
    event: makeEvent()
  },
  render: args => <Stack items={{
    Populated: <EventCard {...args} event={makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord'
    })} />,
    // The viewer's own answer, shown in words on the left.
    Answered: <EventCard {...args} event={makeEvent({
      startTime: on(13)
    })} myState="ATTENDING" />,
    // Three days out: inside the window, past the imminent band — a quiet grey label, no pill.
    'Quiet relative label': <EventCard {...args} event={makeEvent({
      startTime: on(13)
    })} />,
    // Tomorrow: the imminent band, so the label is the solid ink pill.
    'Solid relative label': <EventCard {...args} event={makeEvent({
      startTime: on(11)
    })} />,
    // Beyond RELATIVE_WINDOW_DAYS the chit's date says it better than "in 21 days" would.
    'No relative label': <EventCard {...args} event={makeEvent({
      startTime: on(31)
    })} />,
    // A social event: tracking is off, so the right slot falls back to a headcount (⑥). Labelled
    // "Social event" rather than "Social" — the card's own type badge reads "Social" too, and the
    // two would collide on the same text query within this region.
    'Social event': <EventCard {...args} event={makeEvent({
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
    })} />,
    // The roster verdict in place on a real card (#219): the badge sits at the end of the answer
    // row, collapsed by default, with the panel beneath it — opened here via \`defaultRosterOpen\`
    // rather than a click, so the composed picture (badge + pips) is a single static frame.
    'Roster verdict': <EventCard {...args} defaultRosterOpen event={makeEvent({
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
    })} />,
    // The reported surface (#281). A training wanting 12, attended by 11 players and a coach:
    // the card used to carry a green "Full" here, because the coach filled the twelfth slot. It
    // now reads "1 more needed", and the opened lineup shows both why (the fraction counts 11)
    // and where the twelfth person went (the staff line).
    'Staff attending': <EventCard {...args} defaultRosterOpen event={makeEvent({
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
    })} />,
    'With references': <EventCard {...args} event={makeEvent({
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
    })} />,
    // The location is plain text on the card (ADR-0030 §9): a maps link is a destination
    // competing with the card's own, right beside the disclosures. It lives on the detail page.
    'With location': <EventCard {...args} event={makeEvent({
      startTime: on(13),
      location: 'Sporthal De Boog'
    })} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(region('Populated').getByText('13')).toBeInTheDocument();
    await expect(region('Populated').getByText('14:30')).toBeInTheDocument();
    // The type text label stays alongside the chit's colour.
    await expect(region('Populated').getByText('Match')).toBeInTheDocument();
    // The bottom row answers "what did I say?" — unanswered here, so it asks.
    await expect(region('Populated').getByText('Respond')).toBeInTheDocument();
    // The old "✓ 5 going · of 8 · 3 pending" counts are gone from the card.
    await expect(region('Populated').queryByText(/of 8/)).not.toBeInTheDocument();
    await expect(region('Populated').queryByText(/pending/)).not.toBeInTheDocument();
    await expect(region('Answered').getByText("You're in")).toBeInTheDocument();
    await expect(region('Quiet relative label').getByText('in 3 days')).toBeInTheDocument();
    await expect(region('Solid relative label').getByText('Tomorrow')).toBeInTheDocument();
    await expect(region('No relative label').getByText('31')).toBeInTheDocument();
    await expect(region('No relative label').queryByText(/^in \\d+ days$/)).not.toBeInTheDocument();
    await expect(region('No relative label').queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument();
    await expect(region('Social event').getByText('Social')).toBeInTheDocument();
    await expect(region('Social event').getByText('Season kick-off drinks')).toBeInTheDocument();
    // No roster verdict, so the headcount fallback carries the team information.
    await expect(region('Social event').getByText('11 going')).toBeInTheDocument();
    // The 15th is the Saturday of the current week.
    await expect(region('Social event').getByText('This weekend')).toBeInTheDocument();
    await expect(region('Roster verdict').getByText('Missing a position')).toBeInTheDocument();
    // Pips content moved out; the injected panel is a stand-in (ADR-0032 §1, see top-of-file note).
    await expect(region('Roster verdict').getByText(PANEL_TEXT)).toBeInTheDocument();

    // Not "Full" — the coach no longer fills a player's slot. That is the card's half of #281; the
    // panel's half (the 11/12 fraction and the staff line) is in EventLineupPanel.stories.
    await expect(region('Staff attending').getByText('1 more needed')).toBeInTheDocument();
    await expect(region('Staff attending').getByText(PANEL_TEXT)).toBeInTheDocument();

    // Two chips visible on the card, the third collapsed into "+1".
    await expect(region('With references').getByRole('link', {
      name: /Nevobo/
    })).toBeInTheDocument();
    await expect(region('With references').getByRole('link', {
      name: /Match form/
    })).toBeInTheDocument();
    await expect(region('With references').getByText('+1')).toBeInTheDocument();
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvas.getByRole('region', {
      name: 'With references'
    }).querySelectorAll('a a')).toHaveLength(0);
    await expect(region('With location').getByText('Sporthal De Boog')).toBeInTheDocument();
    const locationRegion = canvas.getByRole('region', {
      name: 'With location'
    });
    await expect(locationRegion.querySelectorAll('a[href*="maps.google.com"]')).toHaveLength(0);
    // Reference chips are still sibling anchors of the card's own <Link>, never nested inside it
    // (invalid HTML — the "<a> cannot contain a nested <a>" warning, #273); the card stays clickable
    // via a stretched-link overlay.
    await expect(locationRegion.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // Unused by render below — every Stack item supplies its own \`event\` — but required to satisfy
  // the story's prop contract (\`event\` is required on EventCard).
  args: {
    event: makeEvent()
  },
  render: args => <Stack items={{
    'Social event': <EventCard {...args} event={makeEvent({
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
    })} />,
    'Roster verdict': <EventCard {...args} event={makeEvent({
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
    })} />,
    'Staff attending': <EventCard {...args} event={makeEvent({
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
    })} />,
    // Cause 1: the spacing band between the card's rule and the answer pill fell through to the
    // card's stretched-link overlay, so a thumb aiming slightly high navigated instead of opening
    // the answer control. That band is the trigger's own padding now.
    'Answer trigger band': <EventCard {...args} event={makeEvent({
      startTime: on(13),
      location: 'Sportcentrum Noord'
    })} />,
    // Same band on the right-hand verdict trigger.
    'Roster trigger band': <EventCard {...args} event={makeEvent({
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
    })} />,
    // Cause 2: both triggers are a real thumb target (≥44 CSS px). The height sits on the button
    // (\`min-h-11\`), so the pills inside keep the size they had.
    'Thumb sized': <EventCard {...args} event={makeEvent({
      startTime: on(13),
      roster: makeRoster()
    })} />,
    // The stretched link is still the point of the card: everything outside the answer strip
    // navigates.
    'Card body still navigates': <EventCard {...args} event={makeEvent({
      startTime: on(13),
      title: 'Match vs Nova',
      location: 'Sportcentrum Noord'
    })} />
  }} />,
  play: async ({
    canvas,
    canvasElement,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Tapping the row opens the answer control even for a social.
    await userEvent.click(region('Social event').getByRole('button', {
      name: /Change your answer/
    }));
    await expect(region('Social event').getByRole('button', {
      name: 'Going'
    })).toBeInTheDocument();

    // The verdict is its own disclosure — collapsed until asked, opening it reveals the lineup, not
    // the answer control.
    await expect(region('Roster verdict').queryByText(PANEL_TEXT)).not.toBeInTheDocument();
    await userEvent.click(region('Roster verdict').getByRole('button', {
      name: /Show lineup/
    }));
    // Full panel detail is Gallery's assertion (rendered via \`defaultRosterOpen\`); this click only
    // needs to prove the affordance itself opens it.
    await expect(region('Roster verdict').getByText(PANEL_TEXT)).toBeInTheDocument();
    await userEvent.click(region('Staff attending').getByRole('button', {
      name: /Show lineup/
    }));
    await expect(region('Staff attending').getByText(PANEL_TEXT)).toBeInTheDocument();
    const answerTrigger = region('Answer trigger band').getByRole('button', {
      name: /Change your answer/
    });
    const answerPillEl = region('Answer trigger band').getByText('Respond');
    // The Stack holds several cards, so the target may sit outside the current scroll position —
    // bring it into view before trusting its on-screen coordinates.
    answerPillEl.scrollIntoView({
      block: 'center'
    });
    const pill = answerPillEl.getBoundingClientRect();
    // 6px above the pill: inside the strip's top spacing, where a high thumb lands.
    const answerHit = hitAt(canvasElement, pill.left + pill.width / 2, pill.top - 6);
    await expect(answerTrigger.contains(answerHit)).toBe(true);
    // …and it is not the card's stretched link.
    await expect(answerHit?.closest('a')).toBeNull();
    await userEvent.click(answerHit as HTMLElement);
    // The disclosure fired: the three-way answer control is open, and nothing was answered for us.
    await expect(region('Answer trigger band').getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
    await expect(args.onRespond).not.toHaveBeenCalled();
    const rosterTrigger = region('Roster trigger band').getByRole('button', {
      name: /Show lineup/
    });
    const badgeEl = region('Roster trigger band').getByText('Missing a position');
    badgeEl.scrollIntoView({
      block: 'center'
    });
    const badge = badgeEl.getBoundingClientRect();
    const rosterHit = hitAt(canvasElement, badge.left + badge.width / 2, badge.top - 6);
    await expect(rosterTrigger.contains(rosterHit)).toBe(true);
    await expect(rosterHit?.closest('a')).toBeNull();
    await userEvent.click(rosterHit as HTMLElement);
    await expect(region('Roster trigger band').getByText(PANEL_TEXT)).toBeInTheDocument();
    for (const name of [/Change your answer/, /Show lineup/]) {
      const box = region('Thumb sized').getByRole('button', {
        name
      }).getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const link = region('Card body still navigates').getByRole('link', {
      name: 'Match vs Nova'
    });
    link.scrollIntoView({
      block: 'center'
    });
    const title = link.getBoundingClientRect();
    // Blank card surface to the right of the title — covered by the link's stretched overlay.
    const bodyHit = hitAt(canvasElement, canvasElement.getBoundingClientRect().right - 6, title.top + title.height / 2);
    await expect(bodyHit).toBe(link);
  }
}`,...w.parameters?.docs?.source}}},T=[`Gallery`,`Interactions`]})))()}E();export{S as Gallery,w as Interactions,T as __namedExportsOrder,x as default};