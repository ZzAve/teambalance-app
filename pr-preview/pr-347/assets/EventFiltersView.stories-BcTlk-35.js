import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{o as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{i as o,n as s,o as c,r as l,s as u,t as d}from"./EventFiltersView-Dq2amOzh.js";var f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{a(),n(),u(),o(),s(),f=t(),{expect:p,fn:m,within:h}=__STORYBOOK_MODULE_TEST__,g=[i({id:`et-1`,name:`Training`,color:`#249E6C`}),i({id:`et-2`,name:`Match`,color:`#225C9C`}),i({id:`et-3`,name:`Tournament`,color:`#7B5EA7`})],_=new Set(g.map(e=>e.id)),v=new Set(c),y=new Set(l),b={title:`features/filter-event-types/EventFiltersView`,component:d,args:{eventTypes:g,activeTypeIds:_,activeStates:v,activeTurnouts:y,showTurnout:!0,showPast:!1,resultCount:7,onToggleType:m(),onToggleState:m(),onToggleTurnout:m(),onToggleShowPast:m(),onClearFilters:m()}},x={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await p(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await p(e.queryByRole(`dialog`)).not.toBeInTheDocument(),await p(e.queryByRole(`button`,{name:`Clear filters`})).not.toBeInTheDocument()}},S={render:e=>(0,f.jsx)(r,{items:{"Clear filters visible":(0,f.jsx)(d,{...e,activeTypeIds:new Set([`et-2`]),resultCount:2}),"Announces result count":(0,f.jsx)(d,{...e,resultCount:1}),"Without event types":(0,f.jsx)(d,{...e,eventTypes:[],activeTypeIds:new Set}),"Without turnout":(0,f.jsx)(d,{...e,showTurnout:!1})}}),play:async({canvas:e})=>{let t=t=>h(e.getByRole(`region`,{name:t}));await p(t(`Clear filters visible`).getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await p(t(`Clear filters visible`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await p(t(`Announces result count`).getByText(`1 event matches these filters`)).toBeInTheDocument(),await p(t(`Without event types`).queryByRole(`dialog`)).not.toBeInTheDocument(),await p(t(`Without turnout`).queryByRole(`dialog`)).not.toBeInTheDocument()}},C={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await p(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await p(e.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await p(e.getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await p(e.getByRole(`group`,{name:`Turnout`})).toBeInTheDocument(),await p(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await p(e.getByText(`Off — upcoming only`)).toBeInTheDocument();for(let t of[`Going`,`Maybe`,`Can't`,`Not responded`,`Missing a position`,`Spots open`,`Covered`,`No target set`])await p(e.getByRole(`button`,{name:t})).toHaveAttribute(`aria-pressed`,`true`);await p(e.queryByTestId(`active-filter-dot`)).not.toBeInTheDocument()}},w={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,f.jsx)(r,{items:{Default:(0,f.jsx)(d,{...e}),"Filtered to one type":(0,f.jsx)(d,{...e,activeTypeIds:new Set([`et-2`])}),"Show past already on":(0,f.jsx)(d,{...e,showPast:!0}),"Without event types":(0,f.jsx)(d,{...e,eventTypes:[],activeTypeIds:new Set}),"Filtered to not responded":(0,f.jsx)(d,{...e,activeStates:new Set([`NOT_RESPONDED`]),resultCount:3}),"Filtered to missing a position":(0,f.jsx)(d,{...e,activeTurnouts:new Set([`missing-position`]),resultCount:2}),"Without turnout":(0,f.jsx)(d,{...e,showTurnout:!1}),"Clear filters":(0,f.jsx)(d,{...e,activeTypeIds:new Set([`et-2`]),resultCount:2}),"Clear filters, show past alone":(0,f.jsx)(d,{...e,showPast:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>h(e.getByRole(`region`,{name:t})),i=async e=>t.click(r(e).getByRole(`button`,{name:`Filters`})),a=()=>t.keyboard(`{Escape}`);await i(`Default`),await t.click(r(`Default`).getByRole(`button`,{name:`Match`})),await p(n.onToggleType).toHaveBeenCalledWith(`et-2`),await t.click(r(`Default`).getByRole(`switch`,{name:`Show past events`})),await p(n.onToggleShowPast).toHaveBeenCalledWith(!0),await t.click(r(`Default`).getByRole(`button`,{name:`Not responded`})),await p(n.onToggleState).toHaveBeenCalledWith(`NOT_RESPONDED`),await t.click(r(`Default`).getByRole(`button`,{name:`Spots open`})),await p(n.onToggleTurnout).toHaveBeenCalledWith(`spots-open`),await p(r(`Default`).getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await a(),await p(r(`Default`).queryByRole(`dialog`)).not.toBeInTheDocument(),await i(`Filtered to one type`),await p(r(`Filtered to one type`).getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await p(r(`Filtered to one type`).getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`),await a(),await i(`Show past already on`),await p(r(`Show past already on`).getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await p(r(`Show past already on`).getByText(`On — past events included`)).toBeInTheDocument(),await t.click(r(`Show past already on`).getByRole(`switch`,{name:`Show past events`})),await p(n.onToggleShowPast).toHaveBeenLastCalledWith(!1),await a(),await i(`Without event types`),await p(r(`Without event types`).queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(r(`Without event types`).getByRole(`switch`,{name:`Show past events`})),await p(n.onToggleShowPast).toHaveBeenLastCalledWith(!0),await a(),await p(r(`Filtered to not responded`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await i(`Filtered to not responded`),await p(r(`Filtered to not responded`).getByRole(`button`,{name:`Not responded`})).toHaveAttribute(`aria-pressed`,`true`),await p(r(`Filtered to not responded`).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await p(r(`Filtered to not responded`).getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r(`Filtered to not responded`).getByRole(`button`,{name:`Maybe`})),await p(n.onToggleState).toHaveBeenLastCalledWith(`MAYBE`),await a(),await p(r(`Filtered to missing a position`).getByTestId(`active-filter-dot`)).toBeInTheDocument(),await i(`Filtered to missing a position`),await p(r(`Filtered to missing a position`).getByRole(`button`,{name:`Missing a position`})).toHaveAttribute(`aria-pressed`,`true`);for(let e of[`Spots open`,`Covered`,`No target set`])await p(r(`Filtered to missing a position`).getByRole(`button`,{name:e})).toHaveAttribute(`aria-pressed`,`false`);await p(r(`Filtered to missing a position`).getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r(`Filtered to missing a position`).getByRole(`button`,{name:`Spots open`})),await p(n.onToggleTurnout).toHaveBeenLastCalledWith(`spots-open`),await a(),await i(`Without turnout`),await p(r(`Without turnout`).queryByRole(`group`,{name:`Turnout`})).not.toBeInTheDocument(),await p(r(`Without turnout`).queryByRole(`button`,{name:`Spots open`})).not.toBeInTheDocument(),await p(r(`Without turnout`).getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await p(r(`Without turnout`).getByRole(`switch`,{name:`Show past events`})).toBeInTheDocument(),await a(),await t.click(r(`Clear filters`).getByRole(`button`,{name:`Clear filters`})),await p(n.onClearFilters).toHaveBeenCalled(),await t.click(r(`Clear filters, show past alone`).getByRole(`button`,{name:`Clear filters`})),await p(n.onClearFilters).toHaveBeenCalledTimes(2)}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    // Nothing is filtered, so there is nothing to undo — the header stays as narrow as it was.
    await expect(canvas.queryByRole('button', {
      name: 'Clear filters'
    })).not.toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Filter state now survives navigation and reopening (ADR-0030 §1), so a member can arrive
    // at a narrowed list they did not narrow this visit. \`Clear filters\` is therefore visible
    // whenever any dimension is in effect — not only once the filter has emptied the list, which
    // is where it used to live (ADR-0030 §2).
    'Clear filters visible': <EventFiltersView {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />,
    // The result count is announced, not shown — a chip tap inside the popover gives no other
    // sign that the list behind it moved. Rendered here closed: the sr-only region sits outside
    // the popover, so it needs no interaction to read.
    'Announces result count': <EventFiltersView {...args} resultCount={1} />,
    // A fresh tenant, or a types request that failed, still renders closed exactly like the
    // unfiltered default — the difference only shows once the popover opens (Interactions).
    'Without event types': <EventFiltersView {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />,
    // A team that sets no targets also renders closed exactly like the unfiltered default.
    'Without turnout': <EventFiltersView {...args} showTurnout={false} />
  }} />,
  play: async ({
    canvas
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
    await expect(region('Without event types').queryByRole('dialog')).not.toBeInTheDocument();
    await expect(region('Without turnout').queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('dialog', {
      name: 'Filters'
    })).toBeInTheDocument();
    // All four parts of the popover: the type chips, the answer chips, the Turnout chips and the
    // past-events switch.
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('group', {
      name: 'Your answer'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('group', {
      name: 'Turnout'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(canvas.getByText('Off — upcoming only')).toBeInTheDocument();
    // The unfiltered default: every chip in every group is on, so nothing is hidden
    // (ADR-0029 §1), and the trigger carries no dot.
    const allChips = ['Going', 'Maybe', "Can't", 'Not responded', 'Missing a position', 'Spots open', 'Covered', 'No target set'];
    for (const label of allChips) {
      await expect(canvas.getByRole('button', {
        name: label
      })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(canvas.queryByTestId('active-filter-dot')).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Default: <EventFiltersView {...args} />,
    'Filtered to one type': <EventFiltersView {...args} activeTypeIds={new Set(['et-2'])} />,
    'Show past already on': <EventFiltersView {...args} showPast />,
    'Without event types': <EventFiltersView {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />,
    'Filtered to not responded': <EventFiltersView {...args} activeStates={new Set<AttendanceState>(['NOT_RESPONDED'])} resultCount={3} />,
    'Filtered to missing a position': <EventFiltersView {...args} activeTurnouts={new Set<TurnoutBucket>(['missing-position'])} resultCount={2} />,
    'Without turnout': <EventFiltersView {...args} showTurnout={false} />,
    'Clear filters': <EventFiltersView {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />,
    'Clear filters, show past alone': <EventFiltersView {...args} showPast />
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
    // The popover closes on Escape and on a click outside, the same two paths PanelViewMenu offers —
    // the handler lives on the document because focus stays on the trigger, a sibling of the panel.
    await expect(region('Default').getByRole('dialog', {
      name: 'Filters'
    })).toBeInTheDocument();
    await closeFilters();
    await expect(region('Default').queryByRole('dialog')).not.toBeInTheDocument();

    // A narrowed selection is visible with the popover open too: Match is pressed, Training is not.
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

    // With no event types to show — a fresh tenant, or a types request that failed — the popover
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
    // The dot shows with the popover shut too — an answer-only filter narrows the list just as
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
    // The dot shows with the popover shut too, even though every event type is still selected — a
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
}`,...w.parameters?.docs?.source}}},T=[`Data`,`Shells`,`Open`,`Interactions`]})))()}E();export{x as Data,w as Interactions,C as Open,S as Shells,T as __namedExportsOrder,b as default};