import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-CQxXEzr2.js";import{a as o,r as s,s as c,t as l}from"./event-fixtures-CuRrQuRB.js";import{n as u,t as d}from"./NextEventHeroView-BILOiuom.js";function f(e){let{left:t,top:n,width:r,height:i}=e.getBoundingClientRect();return document.elementFromPoint(t+r/2,n+i/2)}var p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{a(),s(),n(),u(),p=t(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_=new Date(2026,7,10,9,0),v=o({id:`evt-hero`,eventType:{id:`et-2`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,startTime:new Date(2026,7,12,20,0).toISOString(),location:`Sporthal De Toekomst`,attendanceSummary:{attending:10,maybe:1,absent:0,notResponded:4,roleBreakdown:[]}}),y=o({...v,roster:c({state:`LINEUP_SET`,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:2,kind:`PLAYING`}],totalAttending:10})}),b={title:`widgets/next-event-hero/NextEventHeroView`,component:d,decorators:[i],args:{event:v,now:_,myState:`NOT_RESPONDED`,onRespond:h()}},x={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await m(e.getByText(`Next up`)).toBeInTheDocument(),await m(e.getByText(`Training — Court 2`)).toBeInTheDocument(),await m(e.getByText(`Sporthal De Toekomst`)).toBeInTheDocument(),await m(e.getByText(`2d`)).toBeInTheDocument(),await m(e.getByText(/10 going · you haven't responded/)).toBeInTheDocument(),await m(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await m(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},S={render:e=>(0,p.jsx)(r,{items:{Going:(0,p.jsx)(d,{...e,myState:`ATTENDING`}),"Not going":(0,p.jsx)(d,{...e,myState:`ABSENT`}),Maybe:(0,p.jsx)(d,{...e,myState:`MAYBE`}),Saving:(0,p.jsx)(d,{...e,isSaving:!0}),"Starting today":(0,p.jsx)(d,{...e,event:o({...v,startTime:new Date(2026,7,10,20,0).toISOString()})}),"Readiness covered":(0,p.jsx)(d,{...e,event:y,myState:`ATTENDING`}),"Readiness short":(0,p.jsx)(d,{...e,event:o({...v,roster:c({totalAttending:10})}),myState:`ATTENDING`}),"Readiness critical":(0,p.jsx)(d,{...e,event:o({...v,attendanceSummary:{attending:0,maybe:0,absent:2,notResponded:13,roleBreakdown:[]},roster:c({state:`CRITICAL`,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:0,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`}],totalAttending:0})})}),"Readiness tally only":(0,p.jsx)(d,{...e,event:o({...v,roster:c({state:`TALLY_ONLY`,positions:[],totalAttending:10,openSlots:0})}),myState:`ATTENDING`}),"Readiness not tracked":(0,p.jsx)(d,{...e,event:o({...v,roster:l}),myState:`ATTENDING`})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await m(t(`Going`).getByText(/10 going · you're in/)).toBeInTheDocument(),await m(t(`Going`).getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`),await m(t(`Not going`).getByText(/10 going · you're out/)).toBeInTheDocument(),await m(t(`Not going`).getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`true`),await m(t(`Maybe`).getByText(/10 going · you said maybe/)).toBeInTheDocument(),await m(t(`Maybe`).getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await m(t(`Maybe`).getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`),await m(t(`Saving`).getByRole(`button`,{name:/I'm in/})).toBeDisabled(),await m(t(`Saving`).getByRole(`button`,{name:/Can't make it/})).toBeDisabled(),await m(t(`Starting today`).getByText(`11h`)).toBeInTheDocument(),await m(t(`Readiness covered`).getByText(`Lineup set`)).toBeInTheDocument(),await m(t(`Readiness covered`).getByText(/10 going · you're in/)).toBeInTheDocument(),await m(t(`Readiness short`).getByText(`1 spot open`)).toBeInTheDocument(),await m(t(`Readiness critical`).getByText(`Missing 2 positions`)).toBeInTheDocument(),await m(t(`Readiness tally only`).getAllByText(/\bgoing\b/)).toHaveLength(1);let n=t(`Readiness not tracked`).getByText(/10 going · you're in/);await m(t(`Readiness not tracked`).queryByText(/spot|spots|Lineup set|Full|more needed/)).not.toBeInTheDocument();let r=n.parentElement;await m(r.getBoundingClientRect().height).toBe(n.getBoundingClientRect().height)}},C={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,p.jsx)(r,{items:{Default:(0,p.jsx)(d,{...e}),Saving:(0,p.jsx)(d,{...e,isSaving:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>g(e.getByRole(`region`,{name:t})),i=e.getByRole(`region`,{name:`Default`}),a=g(i).getByRole(`link`,{name:v.title}),o=i.querySelector(`section`);for(let e of[g(i).getByText(`Next up`),g(i).getByText(`2d`),g(i).getByText(/20:00/),g(i).getByText(/10 going/)])await m(f(e)).toBe(a);let{left:s,bottom:c,width:l}=o.getBoundingClientRect();await m(document.elementFromPoint(s+l/2,c-4)).toBe(a);for(let e of[/I'm in/,/Can't make it/]){let t=g(i).getByRole(`button`,{name:e});await m(f(t)?.closest(`button`)).toBe(t)}let u=g(i).getByRole(`link`,{name:v.location});await m(f(u)?.closest(`a`)).toBe(u),await m(u).toHaveAttribute(`href`,m.stringContaining(`maps.google.com`)),await m(u).toHaveAttribute(`target`,`_blank`),await m(i.querySelectorAll(`a a`)).toHaveLength(0),await t.click(r(`Saving`).getByRole(`button`,{name:/I'm in/})),await m(n.onRespond).not.toHaveBeenCalled(),await t.click(r(`Default`).getByRole(`button`,{name:/I'm in/})),await m(n.onRespond).toHaveBeenLastCalledWith(`ATTENDING`),await t.click(r(`Default`).getByRole(`button`,{name:/Can't make it/})),await m(n.onRespond).toHaveBeenLastCalledWith(`ABSENT`)}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument();
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument();
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <NextEventHeroView {...args} />,
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
}`,...C.parameters?.docs?.source}}},w=[`Data`,`Shells`,`Interactions`]})))()}T();export{x as Data,C as Interactions,S as Shells,w as __namedExportsOrder,b as default};