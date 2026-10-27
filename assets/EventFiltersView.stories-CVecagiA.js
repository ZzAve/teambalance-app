import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DCXvz_wz.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{o as a,r as o}from"./event-fixtures-D7dsmgD6.js";import{i as s,n as c,r as l,t as u}from"./EventFiltersView-srwMgITL.js";import{a as d,o as f}from"./EventTypeChip-CnrULN3y.js";import{n as p,t as m}from"./KeepPanelsOpenRow-BOPA7Jii.js";function h(e){let[t,n]=(0,g.useState)(null);return(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`div`,{className:`flex justify-end`,children:(0,_.jsx)(u,{...e,inlineSlot:t})}),(0,_.jsx)(`div`,{ref:n})]})}var g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{g=t(),o(),r(),f(),p(),s(),c(),_=n(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=[a({id:`et-1`,name:`Training`,color:`#249E6C`}),a({id:`et-2`,name:`Match`,color:`#225C9C`}),a({id:`et-3`,name:`Tournament`,color:`#7B5EA7`})],S=new Set(x.map(e=>e.id)),C=new Set(d),w=new Set(l),T={title:`features/filter-event-types/EventFiltersView`,component:u,render:e=>(0,_.jsx)(h,{...e}),args:{inlineSlot:null,eventTypes:x,activeTypeIds:S,activeStates:C,activeTurnouts:w,showTurnout:!0,showPast:!1,resultCount:7,onToggleType:y(),onToggleState:y(),onToggleTurnout:y(),onToggleShowPast:y(),onClearFilters:y()}},E={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await v(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await v(e.queryByRole(`region`,{name:`Filters`})).not.toBeInTheDocument(),await v(e.queryByRole(`button`,{name:`Clear filters`})).not.toBeInTheDocument()}},D={render:e=>(0,_.jsx)(i,{items:{"Clear filters visible":(0,_.jsx)(h,{...e,activeTypeIds:new Set([`et-2`]),resultCount:2}),"Announces result count":(0,_.jsx)(h,{...e,resultCount:1}),"Without event types":(0,_.jsx)(h,{...e,eventTypes:[],activeTypeIds:new Set}),"Without turnout":(0,_.jsx)(h,{...e,showTurnout:!1}),Open:(0,_.jsx)(h,{...e,viewRow:(0,_.jsx)(m,{defaultExpanded:!1,onDefaultExpandedChange:()=>{}})})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>b(e.getByRole(`region`,{name:t}));await v(n(`Clear filters visible`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await v(n(`Clear filters visible`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await v(n(`Announces result count`).getByText(`1 event matches these filters`)).toBeInTheDocument(),await v(n(`Without event types`).queryByRole(`region`,{name:`Filters`})).not.toBeInTheDocument(),await v(n(`Without turnout`).queryByRole(`region`,{name:`Filters`})).not.toBeInTheDocument(),await t.click(n(`Open`).getByRole(`button`,{name:`Filters`}));let r=b(n(`Open`).getByRole(`region`,{name:`Filters`}));await v(r.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await v(r.getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await v(r.getByRole(`group`,{name:`Turnout`})).toBeInTheDocument(),await v(r.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await v(r.getByText(`Off — upcoming only`)).toBeInTheDocument();let i=r.getAllByRole(`switch`);await v(i[i.length-1]).toHaveAccessibleName(`Keep panels open`);for(let e of[`Going`,`Maybe`,`Can't`,`Not responded`,`Missing a position`,`Spots open`,`Covered`,`No target set`])await v(r.getByRole(`button`,{name:e})).toHaveAttribute(`aria-pressed`,`true`);await v(n(`Open`).queryByTestId(`active-filter-dot`)).not.toBeInTheDocument()}},O={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,_.jsx)(i,{items:{Default:(0,_.jsx)(h,{...e}),"Filtered to one type":(0,_.jsx)(h,{...e,activeTypeIds:new Set([`et-2`])}),"Show past already on":(0,_.jsx)(h,{...e,showPast:!0}),"Without event types":(0,_.jsx)(h,{...e,eventTypes:[],activeTypeIds:new Set}),"Filtered to not responded":(0,_.jsx)(h,{...e,activeStates:new Set([`NOT_RESPONDED`]),resultCount:3}),"Filtered to missing a position":(0,_.jsx)(h,{...e,activeTurnouts:new Set([`missing-position`]),resultCount:2}),"Without turnout":(0,_.jsx)(h,{...e,showTurnout:!1}),"Clear filters":(0,_.jsx)(h,{...e,activeTypeIds:new Set([`et-2`]),resultCount:2}),"Clear filters, show past alone":(0,_.jsx)(h,{...e,showPast:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>b(e.getByRole(`region`,{name:t})),i=async e=>t.click(r(e).getByRole(`button`,{name:`Filters`})),a=()=>t.keyboard(`{Escape}`);await i(`Default`),await t.click(r(`Default`).getByRole(`button`,{name:`Match`})),await v(n.onToggleType).toHaveBeenCalledWith(`et-2`),await t.click(r(`Default`).getByRole(`switch`,{name:`Show past events`})),await v(n.onToggleShowPast).toHaveBeenCalledWith(!0),await t.click(r(`Default`).getByRole(`button`,{name:`Not responded`})),await v(n.onToggleState).toHaveBeenCalledWith(`NOT_RESPONDED`),await t.click(r(`Default`).getByRole(`button`,{name:`Spots open`})),await v(n.onToggleTurnout).toHaveBeenCalledWith(`spots-open`);let o=r(`Default`).getByRole(`button`,{name:`Filters`});await v(r(`Default`).getByRole(`region`,{name:`Filters`})).toBeInTheDocument(),await t.click(o),await v(o).toHaveAttribute(`aria-expanded`,`false`),await v(r(`Default`).queryByRole(`region`,{name:`Filters`})).not.toBeInTheDocument(),await i(`Default`),await a(),await v(r(`Default`).queryByRole(`region`,{name:`Filters`})).not.toBeInTheDocument(),await i(`Filtered to one type`),await v(r(`Filtered to one type`).getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await v(r(`Filtered to one type`).getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`),await a(),await i(`Show past already on`),await v(r(`Show past already on`).getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await v(r(`Show past already on`).getByText(`On — past events included`)).toBeInTheDocument(),await t.click(r(`Show past already on`).getByRole(`switch`,{name:`Show past events`})),await v(n.onToggleShowPast).toHaveBeenLastCalledWith(!1),await a(),await i(`Without event types`),await v(r(`Without event types`).queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(r(`Without event types`).getByRole(`switch`,{name:`Show past events`})),await v(n.onToggleShowPast).toHaveBeenLastCalledWith(!0),await a(),await v(r(`Filtered to not responded`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await i(`Filtered to not responded`),await v(r(`Filtered to not responded`).getByRole(`button`,{name:`Not responded`})).toHaveAttribute(`aria-pressed`,`true`),await v(r(`Filtered to not responded`).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await v(r(`Filtered to not responded`).getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r(`Filtered to not responded`).getByRole(`button`,{name:`Maybe`})),await v(n.onToggleState).toHaveBeenLastCalledWith(`MAYBE`),await a(),await v(r(`Filtered to missing a position`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await i(`Filtered to missing a position`),await v(r(`Filtered to missing a position`).getByRole(`button`,{name:`Missing a position`})).toHaveAttribute(`aria-pressed`,`true`);for(let e of[`Spots open`,`Covered`,`No target set`])await v(r(`Filtered to missing a position`).getByRole(`button`,{name:e})).toHaveAttribute(`aria-pressed`,`false`);await v(r(`Filtered to missing a position`).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r(`Filtered to missing a position`).getByRole(`button`,{name:`Spots open`})),await v(n.onToggleTurnout).toHaveBeenLastCalledWith(`spots-open`),await a(),await i(`Without turnout`),await v(r(`Without turnout`).queryByRole(`group`,{name:`Turnout`})).not.toBeInTheDocument(),await v(r(`Without turnout`).queryByRole(`button`,{name:`Spots open`})).not.toBeInTheDocument(),await v(r(`Without turnout`).getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await v(r(`Without turnout`).getByRole(`switch`,{name:`Show past events`})).toBeInTheDocument(),await a(),await t.click(r(`Clear filters`).getByRole(`button`,{name:`Clear filters`})),await v(n.onClearFilters).toHaveBeenCalled(),await t.click(r(`Clear filters, show past alone`).getByRole(`button`,{name:`Clear filters`})),await v(n.onClearFilters).toHaveBeenCalledTimes(2)}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Filters'
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('region', {
      name: 'Filters'
    })).not.toBeInTheDocument();
    // Nothing is filtered, so there is nothing to undo — the header stays as narrow as it was.
    await expect(canvas.queryByRole('button', {
      name: 'Clear filters'
    })).not.toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Filter state now survives navigation and reopening (ADR-0030 §1), so a member can arrive
    // at a narrowed list they did not narrow this visit. \`Clear filters\` is therefore visible
    // whenever any dimension is in effect — not only once the filter has emptied the list, which
    // is where it used to live (ADR-0030 §2).
    'Clear filters visible': <WithSlot {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />,
    // The result count is announced, not shown — a chip tap gives no other sign that the list
    // below moved. Rendered here closed: the sr-only region sits outside the section, so it
    // needs no interaction to read.
    'Announces result count': <WithSlot {...args} resultCount={1} />,
    // A fresh tenant, or a types request that failed, still renders closed exactly like the
    // unfiltered default — the difference only shows once the section opens (Interactions).
    'Without event types': <WithSlot {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />,
    // A team that sets no targets also renders closed exactly like the unfiltered default.
    'Without turnout': <WithSlot {...args} showTurnout={false} />,
    // Opened by the play below: the page composite only ever shows the section closed.
    Open: <WithSlot {...args} viewRow={<KeepPanelsOpenRow defaultExpanded={false} onDefaultExpandedChange={() => {}} />} />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Clear filters visible').getByRole('button', {
      name: 'Clear filters'
    })).toBeInTheDocument();
    // Both signals, side by side: the dot says *that* something is filtered, the button says undo.
    await expect(region('Clear filters visible').getByTestId('active-filter-dot')).toBeInTheDocument();
    await expect(region('Announces result count').getByText('1 event matches these filters')).toBeInTheDocument();
    await expect(region('Without event types').queryByRole('region', {
      name: 'Filters'
    })).not.toBeInTheDocument();
    await expect(region('Without turnout').queryByRole('region', {
      name: 'Filters'
    })).not.toBeInTheDocument();
    await userEvent.click(region('Open').getByRole('button', {
      name: 'Filters'
    }));
    const open = within(region('Open').getByRole('region', {
      name: 'Filters'
    }));
    // All five parts of the section: the type chips, the answer chips, the Turnout chips, the
    // past-events switch and, last, the view switch the page hands in.
    await expect(open.getByRole('button', {
      name: 'Training'
    })).toBeInTheDocument();
    await expect(open.getByRole('group', {
      name: 'Your answer'
    })).toBeInTheDocument();
    await expect(open.getByRole('group', {
      name: 'Turnout'
    })).toBeInTheDocument();
    await expect(open.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(open.getByText('Off — upcoming only')).toBeInTheDocument();
    const switches = open.getAllByRole('switch');
    await expect(switches[switches.length - 1]).toHaveAccessibleName('Keep panels open');
    // The unfiltered default: every chip in every group is on, so nothing is hidden
    // (ADR-0029 §1), and the trigger carries no dot.
    const allChips = ['Going', 'Maybe', "Can't", 'Not responded', 'Missing a position', 'Spots open', 'Covered', 'No target set'];
    for (const label of allChips) {
      await expect(open.getByRole('button', {
        name: label
      })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(region('Open').queryByTestId('active-filter-dot')).not.toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <WithSlot {...args} />,
    'Filtered to one type': <WithSlot {...args} activeTypeIds={new Set(['et-2'])} />,
    'Show past already on': <WithSlot {...args} showPast />,
    'Without event types': <WithSlot {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />,
    'Filtered to not responded': <WithSlot {...args} activeStates={new Set<AttendanceState>(['NOT_RESPONDED'])} resultCount={3} />,
    'Filtered to missing a position': <WithSlot {...args} activeTurnouts={new Set<TurnoutBucket>(['missing-position'])} resultCount={2} />,
    'Without turnout': <WithSlot {...args} showTurnout={false} />,
    'Clear filters': <WithSlot {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />,
    'Clear filters, show past alone': <WithSlot {...args} showPast />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const openFilters = async (name: string) => userEvent.click(region(name).getByRole('button', {
      name: 'Filters'
    }));
    const closeFilters = () => userEvent.keyboard('{Escape}');

    // Every dimension counts: a chip tap reports its state/type/turnout id up to the route, which
    // runs it through the same isolate-first toggler as the other groups (ADR-0029 §3).
    await openFilters('Default');
    await userEvent.click(region('Default').getByRole('button', {
      name: 'Match'
    }));
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2');
    await userEvent.click(region('Default').getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true);
    await userEvent.click(region('Default').getByRole('button', {
      name: 'Not responded'
    }));
    await expect(args.onToggleState).toHaveBeenCalledWith('NOT_RESPONDED');
    await userEvent.click(region('Default').getByRole('button', {
      name: 'Spots open'
    }));
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open');
    // The section closes on a second tap of the trigger and on Escape — the Escape handler is on
    // the document, so it works wherever focus is.
    const trigger = region('Default').getByRole('button', {
      name: 'Filters'
    });
    await expect(region('Default').getByRole('region', {
      name: 'Filters'
    })).toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(region('Default').queryByRole('region', {
      name: 'Filters'
    })).not.toBeInTheDocument();
    await openFilters('Default');
    await closeFilters();
    await expect(region('Default').queryByRole('region', {
      name: 'Filters'
    })).not.toBeInTheDocument();

    // A narrowed selection is visible with the section open too: Match is pressed, Training is not.
    await openFilters('Filtered to one type');
    await expect(region('Filtered to one type').getByRole('button', {
      name: 'Match'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Filtered to one type').getByRole('button', {
      name: 'Training'
    })).toHaveAttribute('aria-pressed', 'false');
    await closeFilters();

    // Switching back off is the same callback with the opposite value.
    await openFilters('Show past already on');
    await expect(region('Show past already on').getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'true');
    await expect(region('Show past already on').getByText('On — past events included')).toBeInTheDocument();
    await userEvent.click(region('Show past already on').getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenLastCalledWith(false);
    await closeFilters();

    // With no event types to show — a fresh tenant, or a types request that failed — the section
    // still has to open and still has to offer the past toggle: it is the only route to past events
    // now.
    await openFilters('Without event types');
    await expect(region('Without event types').queryByText('Event types')).not.toBeInTheDocument();
    await userEvent.click(region('Without event types').getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenLastCalledWith(true);
    await closeFilters();

    // The isolated result: only what needs an answer. The other three chips are off. Adding a second
    // chip back is the OR case (ADR-0029 §2): "unanswered or maybe" — tapping from a subset toggles
    // rather than isolating.
    // The dot shows with the section shut too — an answer-only filter narrows the list just as
    // invisibly as a type filter does.
    await expect(region('Filtered to not responded').getByTestId('active-filter-dot')).toBeInTheDocument();
    await openFilters('Filtered to not responded');
    await expect(region('Filtered to not responded').getByRole('button', {
      name: 'Not responded'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Filtered to not responded').getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // Every type chip is still on — the dot on the trigger is the answer group's doing alone.
    await expect(region('Filtered to not responded').getByRole('button', {
      name: 'Training'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(region('Filtered to not responded').getByRole('button', {
      name: 'Maybe'
    }));
    await expect(args.onToggleState).toHaveBeenLastCalledWith('MAYBE');
    await closeFilters();

    // The isolated result: only the events short a whole position. The OR case again: "missing a
    // position or short of a few" — everything worth turning up for.
    // The dot shows with the section shut too, even though every event type is still selected — a
    // turnout-only filter narrows the list just as invisibly as a type filter does.
    await expect(region('Filtered to missing a position').getByTestId('active-filter-dot')).toBeInTheDocument();
    await openFilters('Filtered to missing a position');
    await expect(region('Filtered to missing a position').getByRole('button', {
      name: 'Missing a position'
    })).toHaveAttribute('aria-pressed', 'true');
    for (const label of ['Spots open', 'Covered', 'No target set']) {
      await expect(region('Filtered to missing a position').getByRole('button', {
        name: label
      })).toHaveAttribute('aria-pressed', 'false');
    }
    // Every answer chip is still on — the dot is the Turnout group's doing.
    await expect(region('Filtered to missing a position').getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(region('Filtered to missing a position').getByRole('button', {
      name: 'Spots open'
    }));
    await expect(args.onToggleTurnout).toHaveBeenLastCalledWith('spots-open');
    await closeFilters();

    // A team that sets no targets gets TALLY_ONLY on every event, so the list spans one band and the
    // Turnout group is four chips that provably filter nothing. It is not rendered at all
    // (ADR-0029 §5) — the other groups, and the past toggle, carry on as before.
    await openFilters('Without turnout');
    await expect(region('Without turnout').queryByRole('group', {
      name: 'Turnout'
    })).not.toBeInTheDocument();
    await expect(region('Without turnout').queryByRole('button', {
      name: 'Spots open'
    })).not.toBeInTheDocument();
    await expect(region('Without turnout').getByRole('group', {
      name: 'Your answer'
    })).toBeInTheDocument();
    await expect(region('Without turnout').getByRole('switch', {
      name: 'Show past events'
    })).toBeInTheDocument();
    await closeFilters();

    // Prop-contract spy: the reset itself lives in the route (it owns all four dimensions), so this
    // view's whole job is to report the tap — from a narrowed type selection, and from "past events
    // on" alone, since every dimension counts as a filter (ADR-0030 §2).
    await userEvent.click(region('Clear filters').getByRole('button', {
      name: 'Clear filters'
    }));
    await expect(args.onClearFilters).toHaveBeenCalled();
    await userEvent.click(region('Clear filters, show past alone').getByRole('button', {
      name: 'Clear filters'
    }));
    await expect(args.onClearFilters).toHaveBeenCalledTimes(2);
  }
}`,...O.parameters?.docs?.source}}},k=[`Data`,`Shells`,`Interactions`]})))()}A();export{E as Data,O as Interactions,D as Shells,k as __namedExportsOrder,T as default};