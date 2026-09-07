import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BVbJKSHT.js";import{a as n,r}from"./event-fixtures-GLq-GGnS.js";import{n as i,t as a}from"./createLucideIcon-0JiXVqz_.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";var s,c;function l(){return(l=e((()=>{i(),s=[[`path`,{d:`M10 5H3`,key:`1qgfaw`}],[`path`,{d:`M12 19H3`,key:`yhmn1j`}],[`path`,{d:`M14 3v4`,key:`1sua03`}],[`path`,{d:`M16 17v4`,key:`1q0r14`}],[`path`,{d:`M21 12h-9`,key:`1o4lsq`}],[`path`,{d:`M21 19h-5`,key:`1rlt1p`}],[`path`,{d:`M21 5h-7`,key:`1oszz2`}],[`path`,{d:`M8 10v4`,key:`tgpxqk`}],[`path`,{d:`M8 12H3`,key:`a7s4jb`}]],c=a(`sliders-horizontal`,s)})))()}var u;function d(){return(d=e((()=>{u=[`ATTENDING`,`MAYBE`,`ABSENT`,`NOT_RESPONDED`]})))()}function f({eventTypes:e,activeTypeIds:t,activeStates:n,showPast:r,resultCount:i,onToggleType:a,onToggleState:o,onToggleShowPast:s}){let[l,d]=(0,p.useState)(!1),f=r||t.size<e.length||n.size<u.length;return(0,p.useEffect)(()=>{if(!l)return;let e=e=>{e.key===`Escape`&&d(!1)};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[l]),(0,m.jsxs)(`div`,{className:`relative`,children:[(0,m.jsxs)(`button`,{"aria-label":`Filters`,"aria-expanded":l,"aria-haspopup":`dialog`,onClick:()=>d(e=>!e),className:`relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:[(0,m.jsx)(c,{size:16}),f&&(0,m.jsx)(`span`,{"data-testid":`active-filter-dot`,className:`absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-blue`})]}),(0,m.jsx)(`p`,{"aria-live":`polite`,className:`sr-only`,children:i===1?`1 event matches these filters`:`${i} events match these filters`}),l&&(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/20`,"aria-hidden":`true`,onClick:()=>d(!1)}),(0,m.jsxs)(`div`,{role:`dialog`,"aria-label":`Filters`,className:`card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-2xl border border-border/60 bg-card p-3.5`,children:[e.length>0&&(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(`div`,{role:`group`,"aria-labelledby":`event-types-filter-heading`,children:[(0,m.jsx)(`h3`,{id:`event-types-filter-heading`,className:`mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Event types`}),(0,m.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.map(e=>{let n=t.has(e.id),r=e.color??`#888`;return(0,m.jsx)(`button`,{"aria-pressed":n,onClick:()=>a(e.id),style:n?{backgroundColor:r,borderColor:r,color:`#fff`}:{borderColor:r+`66`,color:r},className:`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all`,children:e.name},e.id)})})]}),(0,m.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`})]}),(0,m.jsxs)(`div`,{role:`group`,"aria-labelledby":`your-answer-filter-heading`,children:[(0,m.jsx)(`h3`,{id:`your-answer-filter-heading`,className:`mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Your answer`}),(0,m.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:h.map(({state:e,label:t,active:r,inactive:i})=>{let a=n.has(e);return(0,m.jsx)(`button`,{"aria-pressed":a,onClick:()=>o(e),className:[`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all`,a?r:i].join(` `),children:t},e)})})]}),(0,m.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`}),(0,m.jsxs)(`div`,{className:`flex items-center justify-between gap-2.5`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`div`,{className:`text-[13.5px] font-semibold`,children:`Show past events`}),(0,m.jsx)(`div`,{className:`mt-0.5 text-[11.5px] text-muted-foreground`,children:r?`On — past events included`:`Off — upcoming only`})]}),(0,m.jsx)(`button`,{role:`switch`,"aria-checked":r,"aria-label":`Show past events`,onClick:()=>s(!r),className:[`relative h-6 w-11 shrink-0 rounded-full transition-colors`,r?`bg-green`:`bg-muted-foreground/30`].join(` `),children:(0,m.jsx)(`span`,{className:[`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200`,r?`left-[22px]`:`left-0.5`].join(` `)})})]})]})]})]})}var p,m,h;function g(){return(g=e((()=>{p=t(),l(),d(),m=o(),h=[{state:`ATTENDING`,label:`Going`,active:`bg-green border-green text-white`,inactive:`border-green/40 text-green`},{state:`MAYBE`,label:`Maybe`,active:`bg-gold border-gold text-white`,inactive:`border-gold/40 text-gold`},{state:`ABSENT`,label:`Can't`,active:`bg-red border-red text-white`,inactive:`border-red/40 text-red`},{state:`NOT_RESPONDED`,label:`Not responded`,active:`bg-muted-foreground border-muted-foreground text-white`,inactive:`border-muted-foreground/40 text-muted-foreground`}],f.__docgenInfo={description:`The events page's single filter control: an icon button that opens a popover holding the
event-type chips, the answer chips and the "Show past events" switch. It replaces the old
Upcoming/Past segmented tab bar — past events are a filter, not a mode, and the page no longer
spends a band of chrome on a control that only flipped which way the same list grew.

Each chip group is a total partition of the list, so "all chips on" is the unfiltered default and
can never hide anything (ADR-0029 §1). Selection is isolate-first and lives in the route, which
owns the one toggler both groups share.

Prop-only apart from the popover's own open/closed state, which is local view state: the selected
types, the selected answers and the show-past flag live in the route so they can drive
\`useEvents\`, the hero and Bulk Attend.`,methods:[],displayName:`EventFiltersView`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},activeTypeIds:{required:!0,tsType:{name:`Set`,elements:[{name:`string`}],raw:`Set<string>`},description:`Ids of the types currently shown. Every id active = no type filter in effect.`},activeStates:{required:!0,tsType:{name:`Set`,elements:[{name:`AttendanceState`}],raw:`Set<AttendanceState>`},description:`Attendance States currently shown. Every state active = no answer filter in effect.`},showPast:{required:!0,tsType:{name:`boolean`},description:``},resultCount:{required:!0,tsType:{name:`number`},description:`How many events survive the current filter — announced, never shown (ADR-0029).`},onToggleType:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},onToggleState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:``},onToggleShowPast:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(showPast: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`showPast`}],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),d(),g(),{expect:_,fn:v}=__STORYBOOK_MODULE_TEST__,y=[n({id:`et-1`,name:`Training`,color:`#249E6C`}),n({id:`et-2`,name:`Match`,color:`#225C9C`}),n({id:`et-3`,name:`Tournament`,color:`#7B5EA7`})],b=new Set(y.map(e=>e.id)),x=new Set(u),S={title:`features/filter-event-types/EventFiltersView`,component:f,args:{eventTypes:y,activeTypeIds:b,activeStates:x,showPast:!1,resultCount:7,onToggleType:v(),onToggleState:v(),onToggleShowPast:v()}},C={play:async({canvas:e})=>{await _(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await _(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},w={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await _(e.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await _(e.getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await _(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await _(e.getByText(`Off — upcoming only`)).toBeInTheDocument();for(let t of[`Going`,`Maybe`,`Can't`,`Not responded`])await _(e.getByRole(`button`,{name:t})).toHaveAttribute(`aria-pressed`,`true`);await _(e.queryByTestId(`active-filter-dot`)).not.toBeInTheDocument()}},T={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Match`})),await _(n.onToggleType).toHaveBeenCalledWith(`et-2`)}},E={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await _(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},D={args:{showPast:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await _(e.getByText(`On — past events included`)).toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await _(n.onToggleShowPast).toHaveBeenCalledWith(!1)}},O={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await _(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},k={args:{eventTypes:[],activeTypeIds:new Set},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await _(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},A={args:{activeTypeIds:new Set([`et-2`])},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await _(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`)}},j={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Not responded`})),await _(n.onToggleState).toHaveBeenCalledWith(`NOT_RESPONDED`)}},M={args:{activeStates:new Set([`NOT_RESPONDED`]),resultCount:3},play:async({canvas:e,userEvent:t})=>{await _(e.getByTestId(`active-filter-dot`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await _(e.getByRole(`button`,{name:`Not responded`})).toHaveAttribute(`aria-pressed`,`true`),await _(e.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await _(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`true`)}},N={args:{activeStates:new Set([`NOT_RESPONDED`]),resultCount:3},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Maybe`})),await _(n.onToggleState).toHaveBeenCalledWith(`MAYBE`)}},P={args:{resultCount:1},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await _(e.getByText(`1 event matches these filters`)).toBeInTheDocument()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Filters'
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
    // All three parts of the popover: the type chips, the answer chips and the past-events switch.
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('group', {
      name: 'Your answer'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(canvas.getByText('Off — upcoming only')).toBeInTheDocument();
    // The unfiltered default: every chip in both groups is on, so nothing is hidden
    // (ADR-0029 §1), and the trigger carries no dot.
    for (const label of ['Going', 'Maybe', "Can't", 'Not responded']) {
      await expect(canvas.getByRole('button', {
        name: label
      })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(canvas.queryByTestId('active-filter-dot')).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Open — the open popover is the same picture; only onToggleType fires
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Match'
    }));
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2');
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Open — the open popover is the same picture; only onToggleShowPast fires
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true);
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    showPast: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText('On — past events included')).toBeInTheDocument();
    // Switching back off is the same callback with the opposite value.
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(false);
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Closed — Escape settles back to the shut popover (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
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
    // Focus is still on the trigger, which is a sibling of the panel — Escape is caught on the
    // document, so it has to work from there.
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: [],
    activeTypeIds: new Set<string>()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.queryByText('Event types')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true);
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    activeTypeIds: new Set(['et-2'])
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Match'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toHaveAttribute('aria-pressed', 'false');
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Open — the open popover is the same picture; only onToggleState fires
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Not responded'
    }));
    await expect(args.onToggleState).toHaveBeenCalledWith('NOT_RESPONDED');
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    activeStates: new Set<AttendanceState>(['NOT_RESPONDED']),
    resultCount: 3
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByTestId('active-filter-dot')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Not responded'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // Every type chip is still on — the dot is the answer group's doing.
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toHaveAttribute('aria-pressed', 'true');
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of FilteredToNotResponded — same picture, only onToggleState fires
  // (ADR-0027 §2).
  args: {
    activeStates: new Set<AttendanceState>(['NOT_RESPONDED']),
    resultCount: 3
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Maybe'
    }));
    await expect(args.onToggleState).toHaveBeenCalledWith('MAYBE');
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Open — the sr-only region is invisible (ADR-0027 §2).
  args: {
    resultCount: 1
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 event matches these filters')).toBeInTheDocument();
  }
}`,...P.parameters?.docs?.source}}},F=[`Closed`,`Open`,`TogglesType`,`TogglesShowPast`,`ShowingPast`,`ClosesOnEscape`,`WithoutEventTypes`,`FilteredToOneType`,`TogglesState`,`FilteredToNotResponded`,`TogglesSecondStateBackOn`,`AnnouncesResultCount`]})))()}I();export{P as AnnouncesResultCount,C as Closed,O as ClosesOnEscape,M as FilteredToNotResponded,A as FilteredToOneType,w as Open,D as ShowingPast,N as TogglesSecondStateBackOn,E as TogglesShowPast,j as TogglesState,T as TogglesType,k as WithoutEventTypes,F as __namedExportsOrder,S as default};