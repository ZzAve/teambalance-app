import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-BANNHgHE.js";import{a as o,i as s,r as c,s as l,t as u}from"./event-fixtures-C1ds5yXh.js";import{n as d,t as f}from"./NextEventHeroView-DkiSwsiw.js";import{n as p,t as m}from"./EventLineupPanel-BPk4y61B.js";function h(e){let{left:t,top:n,width:r,height:i}=e.getBoundingClientRect();return document.elementFromPoint(t+r/2,n+i/2)}var g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{a(),c(),n(),p(),d(),g=t(),{expect:_,fn:v,within:y}=__STORYBOOK_MODULE_TEST__,b=new Date(2026,7,10,9,0),x=o({id:`evt-hero`,eventType:{id:`et-2`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,startTime:new Date(2026,7,12,20,0).toISOString(),location:`Sporthal De Toekomst`,description:`Bring both shirts — we split into two sides for the last half hour.`,attendanceSummary:{attending:10,maybe:1,absent:0,notResponded:4,roleBreakdown:[]},attendances:[s(`u-me`,`Julius`,`Setter`,{state:`NOT_RESPONDED`}),s(`u-2`,`Sanne`,`Setter`),s(`u-3`,`Lars`,`Libero`)]}),S=(0,g.jsx)(m,{attendances:x.attendances,roster:x.roster,currentUserId:`u-me`,onRespond:v(),onCallInSubstitutes:v(),onSetSubstituteState:v(),onTakeOffSubstitute:v()}),C=o({...x,roster:l({state:`LINEUP_SET`,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}],totalAttending:10})}),w={title:`widgets/next-event-hero/NextEventHeroView`,component:f,decorators:[i],args:{event:x,now:b,myState:`NOT_RESPONDED`,onRespond:v()}},T={parameters:{chromatic:{disableSnapshot:!0}},args:{lineup:S},play:async({canvas:e})=>{await _(e.getByText(`Next up`)).toBeInTheDocument(),await _(e.getByText(`Training`)).toBeInTheDocument(),await _(e.getByText(`Training — Court 2`)).toBeInTheDocument(),await _(e.getByText(`Sporthal De Toekomst`)).toBeInTheDocument(),await _(e.getByText(/Bring both shirts/)).toBeInTheDocument(),await _(e.getByText(`Lineup`)).toBeInTheDocument(),await _(e.getByRole(`button`,{name:/^Sanne/})).toBeInTheDocument(),await _(e.queryByRole(`button`,{name:/Show lineup/})).not.toBeInTheDocument(),await _(e.getByText(`2d`)).toBeInTheDocument(),await _(e.getByText(/10 going · you haven't responded/)).toBeInTheDocument(),await _(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await _(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},E={render:e=>(0,g.jsx)(r,{items:{Going:(0,g.jsx)(f,{...e,myState:`ATTENDING`}),"Not going":(0,g.jsx)(f,{...e,myState:`ABSENT`}),Maybe:(0,g.jsx)(f,{...e,myState:`MAYBE`}),Saving:(0,g.jsx)(f,{...e,isSaving:!0}),"Starting today":(0,g.jsx)(f,{...e,event:o({...x,startTime:new Date(2026,7,10,20,0).toISOString()})}),"Readiness covered":(0,g.jsx)(f,{...e,event:C,myState:`ATTENDING`}),"Readiness short":(0,g.jsx)(f,{...e,event:o({...x,roster:l({totalAttending:10})}),myState:`ATTENDING`}),"Readiness critical":(0,g.jsx)(f,{...e,event:o({...x,attendanceSummary:{attending:0,maybe:0,absent:2,notResponded:13,roleBreakdown:[]},roster:l({state:`CRITICAL`,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:0,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`}],totalAttending:0})})}),"Readiness tally only":(0,g.jsx)(f,{...e,event:o({...x,roster:l({state:`TALLY_ONLY`,positions:[],totalAttending:10,openSlots:0})}),myState:`ATTENDING`}),"Readiness not tracked":(0,g.jsx)(f,{...e,event:o({...x,roster:u}),myState:`ATTENDING`})}}),play:async({canvas:e})=>{let t=t=>y(e.getByRole(`region`,{name:t}));await _(t(`Going`).getByText(/10 going · you're in/)).toBeInTheDocument(),await _(t(`Going`).getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`),await _(t(`Not going`).getByText(/10 going · you're out/)).toBeInTheDocument(),await _(t(`Not going`).getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`true`),await _(t(`Maybe`).getByText(/10 going · you said maybe/)).toBeInTheDocument(),await _(t(`Maybe`).getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await _(t(`Maybe`).getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`),await _(t(`Saving`).getByRole(`button`,{name:/I'm in/})).toBeDisabled(),await _(t(`Saving`).getByRole(`button`,{name:/Can't make it/})).toBeDisabled(),await _(t(`Starting today`).getByText(`11h`)).toBeInTheDocument(),await _(t(`Readiness covered`).getByText(`Lineup set`)).toBeInTheDocument(),await _(t(`Readiness covered`).getByText(/10 going · you're in/)).toBeInTheDocument(),await _(t(`Readiness short`).getByText(`1 spot open`)).toBeInTheDocument(),await _(t(`Readiness critical`).getByText(`Missing 2 positions`)).toBeInTheDocument(),await _(t(`Readiness tally only`).getAllByText(/\bgoing\b/)).toHaveLength(1);let n=t(`Readiness not tracked`).getByText(/10 going · you're in/);await _(t(`Readiness not tracked`).queryByText(/spot|spots|Lineup set|Full|more needed/)).not.toBeInTheDocument();let r=n.parentElement;await _(r.getBoundingClientRect().height).toBe(n.getBoundingClientRect().height)}},D={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,g.jsx)(r,{items:{Default:(0,g.jsx)(f,{...e,lineup:S}),Saving:(0,g.jsx)(f,{...e,isSaving:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>y(e.getByRole(`region`,{name:t})),i=e.getByRole(`region`,{name:`Default`}),a=y(i).getByRole(`link`,{name:x.title}),o=i.querySelector(`section`);for(let e of[y(i).getByText(`Next up`),y(i).getByText(`2d`),y(i).getByText(/20:00/),y(i).getByText(/10 going/)])await _(h(e)).toBe(a);let{left:s,bottom:c,width:l}=o.getBoundingClientRect();await _(document.elementFromPoint(s+l/2,c-4)).toBe(a);for(let e of[/I'm in/,/Can't make it/]){let t=y(i).getByRole(`button`,{name:e});await _(h(t)?.closest(`button`)).toBe(t)}let u=y(i).getByRole(`button`,{name:/^Sanne/});await _(h(u)?.closest(`button`)).toBe(u);let d=y(i).getByRole(`link`,{name:x.location});await _(h(d)?.closest(`a`)).toBe(d),await _(d).toHaveAttribute(`href`,_.stringContaining(`maps.google.com`)),await _(d).toHaveAttribute(`target`,`_blank`),await _(i.querySelectorAll(`a a`)).toHaveLength(0),await t.click(r(`Saving`).getByRole(`button`,{name:/I'm in/})),await _(n.onRespond).not.toHaveBeenCalled(),await t.click(r(`Default`).getByRole(`button`,{name:/I'm in/})),await _(n.onRespond).toHaveBeenLastCalledWith(`ATTENDING`),await t.click(r(`Default`).getByRole(`button`,{name:/Can't make it/})),await _(n.onRespond).toHaveBeenLastCalledWith(`ABSENT`)}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    lineup: LINEUP
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    // Every detail a list card carries: type, title, time, location, description and the lineup.
    await expect(canvas.getByText('Training')).toBeInTheDocument();
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument();
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument();
    await expect(canvas.getByText(/Bring both shirts/)).toBeInTheDocument();
    // The lineup is open from the start — there is no disclosure to tap.
    await expect(canvas.getByText('Lineup')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /^Sanne/
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: /Show lineup/
    })).not.toBeInTheDocument();
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument();
    await expect(canvas.getByText(/10 going · you haven't responded/)).toBeInTheDocument();
    // Neither answer is pressed yet — "I'm in" is solid because it is the invitation.
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'false');
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Going: <NextEventHeroView {...args} myState="ATTENDING" />,
    'Not going': <NextEventHeroView {...args} myState="ABSENT" />,
    // "Maybe" can only be set from the detail page — the hero offers the two answers it offers.
    // So it shows neither button as chosen and lets the status line carry what was actually said.
    Maybe: <NextEventHeroView {...args} myState="MAYBE" />,
    // Both answers are held while an RSVP is in flight, so a double-tap can't race the mutation.
    Saving: <NextEventHeroView {...args} isSaving />,
    // A same-day hero drops to hours, which is the one thing the card's date chit cannot say.
    'Starting today': <NextEventHeroView {...args} event={makeEvent({
      ...EVENT,
      startTime: new Date(2026, 7, 10, 20, 0).toISOString()
    })} />,
    // ── Readiness (#275) ──────────────────────────────────────────────────────────────────────
    // The hero was the last surface in the app with no roster verdict. It carries the same
    // \`ReadinessBadge\` as the card row (#273) — same \`rosterChip\`, no second computation.
    'Readiness covered': <NextEventHeroView {...args} event={READY_EVENT} myState="ATTENDING" />,
    'Readiness short': <NextEventHeroView {...args} event={makeEvent({
      ...EVENT,
      roster: makeRoster({
        totalAttending: 10
      })
    })} myState="ATTENDING" />,
    // Nobody at all at two targeted positions. The headcount moves with it: a roster with no
    // one attending cannot sit on a summary claiming ten are.
    'Readiness critical': <NextEventHeroView {...args} event={makeEvent({
      ...EVENT,
      attendanceSummary: {
        attending: 0,
        maybe: 0,
        absent: 2,
        notResponded: 13,
        roleBreakdown: []
      },
      roster: makeRoster({
        state: 'CRITICAL',
        positions: [{
          id: 'pos-setter',
          label: 'Setter',
          required: 2,
          attending: 0,
          kind: 'PLAYING'
        }, {
          id: 'pos-libero',
          label: 'Libero',
          required: 1,
          attending: 0,
          kind: 'PLAYING'
        }],
        totalAttending: 0
      })
    })} />,
    // Tracking is on but nothing is targeted, so there is no verdict to give. On the card that
    // falls back to a plain headcount — here it renders nothing, because the hero's own status
    // line is already a headcount and printing "10 going" twice on one card says nothing twice.
    'Readiness tally only': <NextEventHeroView {...args} event={makeEvent({
      ...EVENT,
      roster: makeRoster({
        state: 'TALLY_ONLY',
        positions: [],
        totalAttending: 10,
        openSlots: 0
      })
    })} myState="ATTENDING" />,
    // A social: tracking off entirely. No chip — and, because the chip shares the status line's
    // row rather than claiming one of its own, no reserved space either.
    'Readiness not tracked': <NextEventHeroView {...args} event={makeEvent({
      ...EVENT,
      roster: NO_ROSTER
    })} myState="ATTENDING" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Going').getByText(/10 going · you're in/)).toBeInTheDocument();
    await expect(region('Going').getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Not going').getByText(/10 going · you're out/)).toBeInTheDocument();
    await expect(region('Not going').getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Maybe').getByText(/10 going · you said maybe/)).toBeInTheDocument();
    await expect(region('Maybe').getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(region('Maybe').getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(region('Saving').getByRole('button', {
      name: /I'm in/
    })).toBeDisabled();
    await expect(region('Saving').getByRole('button', {
      name: /Can't make it/
    })).toBeDisabled();
    await expect(region('Starting today').getByText('11h')).toBeInTheDocument();
    await expect(region('Readiness covered').getByText('Lineup set')).toBeInTheDocument();
    // The verdict joins the headcount the hero already carried; it does not replace it.
    await expect(region('Readiness covered').getByText(/10 going · you're in/)).toBeInTheDocument();
    await expect(region('Readiness short').getByText('1 spot open')).toBeInTheDocument();
    await expect(region('Readiness critical').getByText('Missing 2 positions')).toBeInTheDocument();
    await expect(region('Readiness tally only').getAllByText(/\\bgoing\\b/)).toHaveLength(1);
    const notTrackedStatus = region('Readiness not tracked').getByText(/10 going · you're in/);
    await expect(region('Readiness not tracked').queryByText(/spot|spots|Lineup set|Full|more needed/)).not.toBeInTheDocument();
    // The row the chip would have shared claims no more height than the status line inside it, so
    // an absent verdict leaves no gap above the RSVP buttons.
    const row = notTrackedStatus.parentElement!;
    await expect(row.getBoundingClientRect().height).toBe(notTrackedStatus.getBoundingClientRect().height);
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <NextEventHeroView {...args} lineup={LINEUP} />,
    Saving: <NextEventHeroView {...args} isSaving />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const defaultRegion = canvas.getByRole('region', {
      name: 'Default'
    });

    // ── The hero is one big target: everything that isn't its own control opens the event ──────
    const cardLink = within(defaultRegion).getByRole('link', {
      name: EVENT.title
    });
    const hero = defaultRegion.querySelector('section')!;

    // Passive rows: each one hits the card link, not the text node under the cursor.
    for (const passive of [within(defaultRegion).getByText('Next up'), within(defaultRegion).getByText('2d'),
    // the countdown block sits above the overlay but lets taps through
    within(defaultRegion).getByText(/20:00/),
    // the date · time row
    within(defaultRegion).getByText(/10 going/)]) {
      await expect(topmostAtCentreOf(passive)).toBe(cardLink);
    }

    // Bare padding — the strip below the buttons — is part of the target too.
    const {
      left,
      bottom,
      width
    } = hero.getBoundingClientRect();
    await expect(document.elementFromPoint(left + width / 2, bottom - 4)).toBe(cardLink);

    // ── The other half of the bargain: widening the target must not swallow the controls ───────
    for (const name of [/I'm in/, /Can't make it/]) {
      const button = within(defaultRegion).getByRole('button', {
        name
      });
      await expect(topmostAtCentreOf(button)?.closest('button')).toBe(button);
    }

    // The lineup's chips open the answer sheet, so they sit above the overlay too.
    const chip = within(defaultRegion).getByRole('button', {
      name: /^Sanne/
    });
    await expect(topmostAtCentreOf(chip)?.closest('button')).toBe(chip);

    // The location opens maps, so it stays its own target — and stays a *sibling* of the card link
    // rather than a nested <a>, which is invalid HTML.
    const maps = within(defaultRegion).getByRole('link', {
      name: EVENT.location
    });
    await expect(topmostAtCentreOf(maps)?.closest('a')).toBe(maps);
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    await expect(maps).toHaveAttribute('target', '_blank');
    await expect(defaultRegion.querySelectorAll('a a')).toHaveLength(0);

    // ── Held: a saving hero's tap must not fire, checked before any call reaches the shared spy ──
    await userEvent.click(region('Saving').getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onRespond).not.toHaveBeenCalled();

    // ── Prop-contract spies: both buttons actually call onRespond with the right state ──────────
    await userEvent.click(region('Default').getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onRespond).toHaveBeenLastCalledWith('ATTENDING');
    await userEvent.click(region('Default').getByRole('button', {
      name: /Can't make it/
    }));
    await expect(args.onRespond).toHaveBeenLastCalledWith('ABSENT');
  }
}`,...D.parameters?.docs?.source}}},O=[`Data`,`Shells`,`Interactions`]})))()}k();export{T as Data,D as Interactions,E as Shells,O as __namedExportsOrder,w as default};