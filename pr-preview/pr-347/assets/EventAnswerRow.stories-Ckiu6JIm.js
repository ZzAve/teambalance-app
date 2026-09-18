import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DrbUYmN2.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D1VBtmRF.js";import{r as a,t as o}from"./app-column-decorator-I0ctpr7k.js";import{r as s,s as c,t as l}from"./event-fixtures-CuRrQuRB.js";import{n as u,t as d}from"./EventAnswerRow-D4FZo6c0.js";function f(e){let[t,n]=(0,p.useState)(`NOT_RESPONDED`);return(0,m.jsx)(d,{...e,myState:t,onRespond:t=>{e.onRespond(t),n(t)}})}var p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{p=t(),r(),a(),s(),u(),m=n(),{expect:h,fn:g,within:_}=__STORYBOOK_MODULE_TEST__,v=`rounded-md border border-border bg-card p-3.5`,y=`w-[300px] rounded-lg border border-border bg-card p-3.5`,b={title:`entities/event/EventAnswerRow`,component:d,...o,args:{roster:c(),myState:`NOT_RESPONDED`,onRespond:g()}},x={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e})}),play:async({canvas:e})=>{await h(e.getByText(`Respond`)).toBeInTheDocument(),await h(e.getByText(`1 spot open`)).toBeInTheDocument(),await h(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await h(e.queryByText(`Positions`)).not.toBeInTheDocument(),await h(e.getByRole(`button`,{name:/Change your answer/})).toBeInTheDocument(),await h(e.getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument()}},S={render:e=>(0,m.jsx)(i,{items:{Attending:(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,myState:`ATTENDING`})}),"Set by teammate":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,myState:`ABSENT`,setBy:`Tim de Vries`})}),"Long name":(0,m.jsx)(`div`,{className:y,children:(0,m.jsx)(d,{...e,myState:`ATTENDING`,setBy:`Sophie van Dijk-van der Bergh`})}),"Headcount fallback — off":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({...l,totalAttending:8})})}),"Headcount fallback — tally only":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})})}),"Roster expanded by default":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultRosterOpen:!0})}),Pending:(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultAttnOpen:!0,myState:`ATTENDING`,pending:!0})}),"Both panels open":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultAttnOpen:!0,defaultRosterOpen:!0})}),"Social expands":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({...l,totalAttending:8}),rosterPanel:(0,m.jsx)(`p`,{children:`Sanne, Sofia, Lars`}),defaultRosterOpen:!0})})}}),play:async({canvas:e})=>{let t=t=>_(e.getByRole(`region`,{name:t}));await h(t(`Attending`).getByText(`You're in`)).toBeInTheDocument(),await h(t(`Set by teammate`).getByText(`Tim de Vries said you're out`)).toBeInTheDocument(),await h(t(`Set by teammate`).getByRole(`button`,{name:/Change your answer/})).toBeInTheDocument(),await h(t(`Long name`).getByText(/said you're in/)).toBeInTheDocument(),await h(t(`Long name`).getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument(),await h(t(`Headcount fallback — off`).getByText(`8 going`)).toBeInTheDocument(),await h(t(`Headcount fallback — off`).queryByRole(`button`,{name:/Show lineup/})).not.toBeInTheDocument(),await h(t(`Headcount fallback — tally only`).getByText(`5 going`)).toBeInTheDocument(),await h(t(`Roster expanded by default`).getByText(`Positions`)).toBeInTheDocument(),await h(t(`Roster expanded by default`).getByRole(`button`,{name:/Hide lineup/})).toBeInTheDocument(),await h(t(`Pending`).getByText(`1 spot open`)).toHaveAttribute(`aria-busy`,`true`),await h(t(`Pending`).getByRole(`button`,{name:/^Going$/})).toBeDisabled();let n=t(`Both panels open`).getByRole(`button`,{name:/^Going$/}),r=t(`Both panels open`).getByText(`Positions`);await h(n).toBeInTheDocument(),await h(r).toBeInTheDocument(),await h(n.getBoundingClientRect().top).toBeLessThan(r.getBoundingClientRect().top),await h(t(`Social expands`).getByText(`8 going`)).toBeInTheDocument(),await h(t(`Social expands`).getByText(`Sanne, Sofia, Lars`)).toBeInTheDocument()}},C={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,m.jsx)(i,{items:{"Attendance trigger":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,onRespond:g()})}),"Roster trigger":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,onRespond:g()})}),"Unnamed teammate":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,myState:`ATTENDING`,setBy:`a teammate`})}),"Self-set":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,myState:`ATTENDING`})}),"Answer reported":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultAttnOpen:!0,myState:`ATTENDING`})}),"Collapse on pick":(0,m.jsx)(f,{...e,defaultAttnOpen:!0,defaultRosterOpen:!0}),"Headcount off answer":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({...l,totalAttending:8}),onRespond:g()})}),"Headcount tally answer":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})})}),"Roster collapsed":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultRosterOpen:!1})}),"Roster expanded — collapse":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,defaultRosterOpen:!0})}),"No panel":(0,m.jsx)(`div`,{className:v,children:(0,m.jsx)(d,{...e,roster:c({...l,totalAttending:8}),rosterPanel:null})})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>_(e.getByRole(`region`,{name:t}));await t.click(r(`Attendance trigger`).getByRole(`button`,{name:/Change your answer/})),await h(r(`Attendance trigger`).getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await h(r(`Attendance trigger`).queryByText(`Positions`)).not.toBeInTheDocument(),await t.click(r(`Roster trigger`).getByRole(`button`,{name:/Show lineup/})),await h(r(`Roster trigger`).getByText(`Positions`)).toBeInTheDocument(),await h(r(`Roster trigger`).queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await h(r(`Unnamed teammate`).getByText(`a teammate said you're in`)).toBeInTheDocument(),await h(r(`Self-set`).getByText(`You're in`)).toBeInTheDocument(),await h(r(`Self-set`).queryByText(/ said /)).not.toBeInTheDocument(),await h(r(`Answer reported`).getByRole(`button`,{name:/^Going$/})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r(`Answer reported`).getByRole(`button`,{name:/^Maybe$/})),await h(n.onRespond).toHaveBeenLastCalledWith(`MAYBE`),await h(r(`Collapse on pick`).getByText(`Respond`)).toBeInTheDocument(),await t.click(r(`Collapse on pick`).getByRole(`button`,{name:/^Going$/})),await h(r(`Collapse on pick`).queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await h(r(`Collapse on pick`).getByText(`You're in`)).toBeInTheDocument(),await h(r(`Collapse on pick`).getByText(`Positions`)).toBeInTheDocument(),await h(n.onRespond).toHaveBeenLastCalledWith(`ATTENDING`),await t.click(r(`Headcount off answer`).getByRole(`button`,{name:/Change your answer/})),await h(r(`Headcount off answer`).getByRole(`button`,{name:/^Going$/})).toBeInTheDocument(),await t.click(r(`Headcount tally answer`).getByRole(`button`,{name:/Show lineup/})),await h(r(`Headcount tally answer`).getByText(`Positions`)).toBeInTheDocument(),await h(r(`Roster collapsed`).queryByText(`Positions`)).not.toBeInTheDocument(),await h(r(`Roster collapsed`).getByRole(`button`,{name:/Show lineup/})).toBeInTheDocument(),await t.click(r(`Roster expanded — collapse`).getByRole(`button`,{name:/Hide lineup/})),await h(r(`Roster expanded — collapse`).queryByText(`Positions`)).not.toBeInTheDocument(),await h(r(`No panel`).getByText(`8 going`)).toBeInTheDocument(),await h(r(`No panel`).queryByRole(`button`,{name:/Show/})).not.toBeInTheDocument()}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <div className={CARD}>
      <EventAnswerRow {...args} />
    </div>,
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
    // Neither panel is open until asked.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
    // Both sides are their own trigger.
    await expect(canvas.getByRole('button', {
      name: /Change your answer/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Attending: <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" />
          </div>,
    // Attribution (⑪): an answer someone else gave on your behalf. Still your answer and still
    // yours to change: the pill is the same trigger it always was.
    'Set by teammate': <div className={CARD}>
            <EventAnswerRow {...args} myState="ABSENT" setBy="Tim de Vries" />
          </div>,
    // A name is the one thing on this row with no upper bound, so it yields first: the pill
    // truncates rather than pushing the chevron or the verdict off a narrow card.
    'Long name': <div className={LONG_NAME_CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" setBy="Sophie van Dijk-van der Bergh" />
          </div>,
    // Headcount fallback (⑥), right side, off: a social with tracking off has no lineup, so the
    // verdict is a plain headcount, NOT a trigger.
    'Headcount fallback — off': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        ...NO_ROSTER,
        totalAttending: 8
      })} />
          </div>,
    // Tracking on but no targets — still no verdict, so the badge shows the headcount, but there
    // ARE per-position rows to open.
    'Headcount fallback — tally only': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        state: 'TALLY_ONLY',
        openSlots: 0,
        totalAttending: 5,
        positions: []
      })} />
          </div>,
    // The panel's default open state (ADR-0030 §6): \`Keep open\` on, affordable only because the
    // list payload now carries the whole picture (ADR-0030 §8).
    'Roster expanded by default': <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen />
          </div>,
    // The pending state (⑤): the badge dims while the write settles and the control is held.
    Pending: <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen myState="ATTENDING" pending />
          </div>,
    // Both open, opened roster-first: the attendance panel must still sit ABOVE the roster panel
    // (①), whichever order they were opened in.
    'Both panels open': <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen defaultRosterOpen />
          </div>,
    // The social is a disclosure now (#324 cause 3): with a panel handed in, tracking-off stops
    // being the one card whose verdict silently navigates — the same screen position expands,
    // like every other card. The events list always hands one in.
    'Social expands': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        ...NO_ROSTER,
        totalAttending: 8
      })} rosterPanel={<p>Sanne, Sofia, Lars</p>} defaultRosterOpen />
          </div>
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Attending').getByText("You're in")).toBeInTheDocument();
    await expect(region('Set by teammate').getByText("Tim de Vries said you're out")).toBeInTheDocument();
    await expect(region('Set by teammate').getByRole('button', {
      name: /Change your answer/
    })).toBeInTheDocument();
    await expect(region('Long name').getByText(/said you're in/)).toBeInTheDocument();
    // The verdict on the right survives — the row never wraps or scrolls.
    await expect(region('Long name').getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
    await expect(region('Headcount fallback — off').getByText('8 going')).toBeInTheDocument();
    await expect(region('Headcount fallback — off').queryByRole('button', {
      name: /Show lineup/
    })).not.toBeInTheDocument();
    await expect(region('Headcount fallback — tally only').getByText('5 going')).toBeInTheDocument();
    await expect(region('Roster expanded by default').getByText('Positions')).toBeInTheDocument();
    await expect(region('Roster expanded by default').getByRole('button', {
      name: /Hide lineup/
    })).toBeInTheDocument();
    await expect(region('Pending').getByText('1 spot open')).toHaveAttribute('aria-busy', 'true');
    await expect(region('Pending').getByRole('button', {
      name: /^Going$/
    })).toBeDisabled();
    const going = region('Both panels open').getByRole('button', {
      name: /^Going$/
    });
    const positions = region('Both panels open').getByText('Positions');
    await expect(going).toBeInTheDocument();
    await expect(positions).toBeInTheDocument();
    // Attendance renders above the roster panel regardless of which was opened first.
    await expect(going.getBoundingClientRect().top).toBeLessThan(positions.getBoundingClientRect().top);
    await expect(region('Social expands').getByText('8 going')).toBeInTheDocument();
    await expect(region('Social expands').getByText('Sanne, Sofia, Lars')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Attendance trigger': <div className={CARD}>
            <EventAnswerRow {...args} onRespond={fn()} />
          </div>,
    'Roster trigger': <div className={CARD}>
            <EventAnswerRow {...args} onRespond={fn()} />
          </div>,
    // A setter the event's rows cannot name — one who has since left the team — still gets a
    // subject.
    'Unnamed teammate': <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" setBy="a teammate" />
          </div>,
    // The negative is the design: an answer you gave yourself is simply yours, in the first
    // person.
    'Self-set': <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" />
          </div>,
    'Answer reported': <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen myState="ATTENDING" />
          </div>,
    'Collapse on pick': <CollapseOnPickHarness {...args} defaultAttnOpen defaultRosterOpen />,
    // The interaction half of the two headcount-fallback shells: answering still works whichever
    // side the badge falls back to.
    'Headcount off answer': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        ...NO_ROSTER,
        totalAttending: 8
      })} onRespond={fn()} />
          </div>,
    'Headcount tally answer': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        state: 'TALLY_ONLY',
        openSlots: 0,
        totalAttending: 5,
        positions: []
      })} />
          </div>,
    // \`Keep open\` off — the resting state, and the only one before this preference existed.
    'Roster collapsed': <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen={false} />
          </div>,
    // Still a disclosure, not a permanently open panel: \`Keep open\` on does not stop a member
    // from closing this one card by hand.
    'Roster expanded — collapse': <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen />
          </div>,
    // A caller may still say there is nothing to open, which is what the plain headcount is for.
    'No panel': <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({
        ...NO_ROSTER,
        totalAttending: 8
      })} rosterPanel={null} />
          </div>
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Attendance trigger').getByRole('button', {
      name: /Change your answer/
    }));
    // The three-way control is shown…
    await expect(region('Attendance trigger').getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
    // …and the roster panel stays closed.
    await expect(region('Attendance trigger').queryByText('Positions')).not.toBeInTheDocument();
    await userEvent.click(region('Roster trigger').getByRole('button', {
      name: /Show lineup/
    }));
    // The pips are shown…
    await expect(region('Roster trigger').getByText('Positions')).toBeInTheDocument();
    // …and the answer control stays closed.
    await expect(region('Roster trigger').queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(region('Unnamed teammate').getByText("a teammate said you're in")).toBeInTheDocument();
    await expect(region('Self-set').getByText("You're in")).toBeInTheDocument();
    await expect(region('Self-set').queryByText(/ said /)).not.toBeInTheDocument();
    await expect(region('Answer reported').getByRole('button', {
      name: /^Going$/
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(region('Answer reported').getByRole('button', {
      name: /^Maybe$/
    }));
    await expect(args.onRespond).toHaveBeenLastCalledWith('MAYBE');
    await expect(region('Collapse on pick').getByText('Respond')).toBeInTheDocument();
    await userEvent.click(region('Collapse on pick').getByRole('button', {
      name: /^Going$/
    }));
    // Attendance panel collapsed…
    await expect(region('Collapse on pick').queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    // …the pill flipped optimistically…
    await expect(region('Collapse on pick').getByText("You're in")).toBeInTheDocument();
    // …the roster panel stayed open…
    await expect(region('Collapse on pick').getByText('Positions')).toBeInTheDocument();
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenLastCalledWith('ATTENDING');

    // Answering still works.
    await userEvent.click(region('Headcount off answer').getByRole('button', {
      name: /Change your answer/
    }));
    await expect(region('Headcount off answer').getByRole('button', {
      name: /^Going$/
    })).toBeInTheDocument();
    await userEvent.click(region('Headcount tally answer').getByRole('button', {
      name: /Show lineup/
    }));
    await expect(region('Headcount tally answer').getByText('Positions')).toBeInTheDocument();
    await expect(region('Roster collapsed').queryByText('Positions')).not.toBeInTheDocument();
    await expect(region('Roster collapsed').getByRole('button', {
      name: /Show lineup/
    })).toBeInTheDocument();
    await userEvent.click(region('Roster expanded — collapse').getByRole('button', {
      name: /Hide lineup/
    }));
    await expect(region('Roster expanded — collapse').queryByText('Positions')).not.toBeInTheDocument();
    await expect(region('No panel').getByText('8 going')).toBeInTheDocument();
    await expect(region('No panel').queryByRole('button', {
      name: /Show/
    })).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Data`,`Shells`,`Interactions`]})))()}T();export{x as Data,C as Interactions,S as Shells,w as __namedExportsOrder,b as default};