import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{r as i,t as a}from"./app-column-decorator-0nMuVRZm.js";import{r as o,s}from"./event-fixtures-CuRrQuRB.js";import{n as c,t as l}from"./RosterBar-CsLBlPKL.js";var u,d,f,p,m,h,g;function _(){return(_=e((()=>{o(),n(),i(),c(),u=t(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p=`overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,m={title:`entities/event/RosterBar`,component:l,...a},h={args:{roster:s()},render:()=>(0,u.jsx)(r,{items:{"One spot open":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s()})}),Critical:(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-middle`,label:`Middle`,required:2,attending:0,kind:`PLAYING`}],state:`CRITICAL`})})}),"Lineup fully set":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`pos-libero`,label:`Libero`,required:1,attending:1,kind:`PLAYING`}],state:`LINEUP_SET`})})}),"Headcount target":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({positions:[],totalTarget:12,totalAttending:8,openSlots:4,state:`HEADCOUNT_SHORT`})})}),"Headcount full":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({positions:[],totalTarget:12,totalAttending:12,openSlots:0,state:`HEADCOUNT_FULL`})})}),"Tally only":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`TALLY_ONLY`})})}),"Tracking off":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({trackRoster:!1,positions:[],totalTarget:void 0,totalAttending:8,openSlots:0,state:`OFF`})})}),"With staff attending":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({state:`HEADCOUNT_SHORT`,openSlots:1,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})})}),"Trainer not marked":(0,u.jsx)(`div`,{className:p,children:(0,u.jsx)(l,{roster:s({state:`HEADCOUNT_FULL`,openSlots:0,totalTarget:12,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`PLAYING`}]})})})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await d(t(`One spot open`).getByText(/4\/5 spots/)).toBeInTheDocument(),await d(t(`One spot open`).getByText(/1 spot open/)).toBeInTheDocument(),await d(t(`One spot open`).queryByText(/Middle/)).not.toBeInTheDocument(),await d(t(`Critical`).getByText(/Missing a position/)).toBeInTheDocument(),await d(t(`Critical`).queryByText(/Middle/)).not.toBeInTheDocument(),await d(t(`Lineup fully set`).getByText(/3\/3 spots/)).toBeInTheDocument(),await d(t(`Lineup fully set`).getByText(/Lineup set/)).toBeInTheDocument(),await d(t(`Headcount target`).getByText(/8\/12 going/)).toBeInTheDocument(),await d(t(`Headcount target`).getByText(/4 more needed/)).toBeInTheDocument(),await d(t(`Headcount full`).getByText(/12\/12 going/)).toBeInTheDocument(),await d(t(`Headcount full`).getByText(/Full/)).toBeInTheDocument(),await d(t(`Tally only`).getByText(/8 going/)).toBeInTheDocument(),await d(t(`Tally only`).queryByText(/\//)).not.toBeInTheDocument();let n=e.getByRole(`region`,{name:`Tally only`});await d(n.querySelector(`[data-slot="roster-track"]`)).toBeNull();let r=e.getByRole(`region`,{name:`Tracking off`});await d(r.querySelector(`div`)?.textContent??``).toBe(``),await d(t(`With staff attending`).getByText(/11\/12 going \+1 staff/)).toBeInTheDocument(),await d(t(`With staff attending`).getByText(/1 more needed/)).toBeInTheDocument(),await d(t(`Trainer not marked`).getByText(/12\/12 going/)).toBeInTheDocument(),await d(t(`Trainer not marked`).getByText(/Full/)).toBeInTheDocument(),await d(t(`Trainer not marked`).queryByText(/staff/)).not.toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster()
  },
  render: () => <Stack items={{
    // makeRoster() default: Setter 2/2, Libero 1/1, Middle 1/2 → 4 of 5 spots, one open.
    'One spot open': <div className={CARD}>
            <RosterBar roster={makeRoster()} />
          </div>,
    // A position with nobody at all is critical, not merely short — chase now, not later.
    Critical: <div className={CARD}>
            <RosterBar roster={makeRoster({
        positions: [{
          id: 'pos-setter',
          label: 'Setter',
          required: 2,
          attending: 2,
          kind: 'PLAYING'
        }, {
          id: 'pos-middle',
          label: 'Middle',
          required: 2,
          attending: 0,
          kind: 'PLAYING'
        }],
        state: 'CRITICAL'
      })} />
          </div>,
    // Every targeted position met: the lineup is set.
    'Lineup fully set': <div className={CARD}>
            <RosterBar roster={makeRoster({
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
          attending: 1,
          kind: 'PLAYING'
        }],
        state: 'LINEUP_SET'
      })} />
          </div>,
    // No position targets (#271 ⑥, the half the detail page never got): \`rosterChip\` returns null
    // for two states, and until now the bar refused to render for either, so the detail page
    // stated no headcount at all whenever no position carried a target — the card advertised "4
    // more needed", you tapped through, and the number was gone. A total target, no position
    // targets: the fraction is against the target, and the verdict stands.
    'Headcount target': <div className={CARD}>
            <RosterBar roster={makeRoster({
        positions: [],
        totalTarget: 12,
        totalAttending: 8,
        openSlots: 4,
        state: 'HEADCOUNT_SHORT'
      })} />
          </div>,
    // The headcount target met.
    'Headcount full': <div className={CARD}>
            <RosterBar roster={makeRoster({
        positions: [],
        totalTarget: 12,
        totalAttending: 12,
        openSlots: 0,
        state: 'HEADCOUNT_FULL'
      })} />
          </div>,
    // A tally: tracking on, nothing targeted. There is no verdict and nothing to be a fraction of,
    // so the bar states the plain count and draws NO progress track — a bar with no denominator
    // would invent the judgement \`rosterChip\` deliberately withholds for this state.
    'Tally only': <div className={CARD}>
            <RosterBar roster={makeRoster({
        positions: [],
        totalTarget: undefined,
        totalAttending: 8,
        openSlots: 0,
        state: 'TALLY_ONLY'
      })} />
          </div>,
    // Tracking off entirely — a social. Still nothing: this is not a roster event, and the route
    // falls back to the role breakdown.
    'Tracking off': <div className={CARD}>
            <RosterBar roster={makeRoster({
        trackRoster: false,
        positions: [],
        totalTarget: undefined,
        totalAttending: 8,
        openSlots: 0,
        state: 'OFF'
      })} />
          </div>,
    // The same event on the detail page's pinned bar (#281). The progress track measures the
    // eleven players against the twelve wanted; the coach is named beside the fraction rather than
    // advancing it, which is what used to fill the bar and turn the headline green.
    'With staff attending': <div className={CARD}>
            <RosterBar roster={makeRoster({
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
      })} />
          </div>,
    // The same eleven players and one coach, on a team that has NOT ticked Staff on Trainer —
    // which is every team on the day this ships, because the migration defaults to PLAYING. Its
    // whole job is to sit next to "With staff attending" above: same people, same answers, and
    // the only difference is one checkbox in the position editor — a contrast a reviewer should
    // see as two pictures rather than reconstruct from a diff.
    'Trainer not marked': <div className={CARD}>
            <RosterBar roster={makeRoster({
        state: 'HEADCOUNT_FULL',
        openSlots: 0,
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
          kind: 'PLAYING'
        }]
      })} />
          </div>
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('One spot open').getByText(/4\\/5 spots/)).toBeInTheDocument();
    await expect(region('One spot open').getByText(/1 spot open/)).toBeInTheDocument();
    // The bar states the event's verdict and nothing per position: naming Middle here would repeat
    // what the attendee list already says beside its own heading, three blocks further down.
    await expect(region('One spot open').queryByText(/Middle/)).not.toBeInTheDocument();
    await expect(region('Critical').getByText(/Missing a position/)).toBeInTheDocument();
    await expect(region('Critical').queryByText(/Middle/)).not.toBeInTheDocument();
    await expect(region('Lineup fully set').getByText(/3\\/3 spots/)).toBeInTheDocument();
    await expect(region('Lineup fully set').getByText(/Lineup set/)).toBeInTheDocument();
    await expect(region('Headcount target').getByText(/8\\/12 going/)).toBeInTheDocument();
    await expect(region('Headcount target').getByText(/4 more needed/)).toBeInTheDocument();
    await expect(region('Headcount full').getByText(/12\\/12 going/)).toBeInTheDocument();
    await expect(region('Headcount full').getByText(/Full/)).toBeInTheDocument();
    await expect(region('Tally only').getByText(/8 going/)).toBeInTheDocument();
    await expect(region('Tally only').queryByText(/\\//)).not.toBeInTheDocument();
    const tallyOnly = canvas.getByRole('region', {
      name: 'Tally only'
    });
    await expect(tallyOnly.querySelector('[data-slot="roster-track"]')).toBeNull();
    const trackingOff = canvas.getByRole('region', {
      name: 'Tracking off'
    });
    await expect(trackingOff.querySelector('div')?.textContent ?? '').toBe('');
    await expect(region('With staff attending').getByText(/11\\/12 going \\+1 staff/)).toBeInTheDocument();
    await expect(region('With staff attending').getByText(/1 more needed/)).toBeInTheDocument();
    await expect(region('Trainer not marked').getByText(/12\\/12 going/)).toBeInTheDocument();
    await expect(region('Trainer not marked').getByText(/Full/)).toBeInTheDocument();
    // No staff suffix: nobody attending holds a staff position.
    await expect(region('Trainer not marked').queryByText(/staff/)).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g=[`Gallery`]})))()}_();export{h as Gallery,g as __namedExportsOrder,m as default};