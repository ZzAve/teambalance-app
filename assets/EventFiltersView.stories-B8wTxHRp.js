import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyS7Yi9.js";import{o as n,r}from"./event-fixtures-CuRrQuRB.js";import{n as i,t as a}from"./createLucideIcon-BkXp_paf.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./SectionLabel-B5oFQ-GJ.js";var l,u;function d(){return(d=e((()=>{i(),l=[[`path`,{d:`M10 5H3`,key:`1qgfaw`}],[`path`,{d:`M12 19H3`,key:`yhmn1j`}],[`path`,{d:`M14 3v4`,key:`1sua03`}],[`path`,{d:`M16 17v4`,key:`1q0r14`}],[`path`,{d:`M21 12h-9`,key:`1o4lsq`}],[`path`,{d:`M21 19h-5`,key:`1rlt1p`}],[`path`,{d:`M21 5h-7`,key:`1oszz2`}],[`path`,{d:`M8 10v4`,key:`tgpxqk`}],[`path`,{d:`M8 12H3`,key:`a7s4jb`}]],u=a(`sliders-horizontal`,l)})))()}var f;function p(){return(p=e((()=>{f=[`ATTENDING`,`MAYBE`,`ABSENT`,`NOT_RESPONDED`]})))()}var m;function h(){return(h=e((()=>{m=[`missing-position`,`spots-open`,`covered`,`no-target`]})))()}function g({eventTypes:e,activeTypeIds:t,activeStates:n,activeTurnouts:r,showTurnout:i,showPast:a,resultCount:o,onToggleType:s,onToggleState:l,onToggleTurnout:d,onToggleShowPast:p,onClearFilters:h}){let[g,x]=(0,_.useState)(!1),S=a||t.size<e.length||n.size<f.length||r.size<m.length;return(0,_.useEffect)(()=>{if(!g)return;let e=e=>{e.key===`Escape`&&x(!1)};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[g]),(0,v.jsxs)(`div`,{className:`flex items-center gap-2`,children:[S&&(0,v.jsx)(`button`,{onClick:h,className:`flex h-11 shrink-0 items-center rounded-md border border-border/60 bg-card px-3 text-caption font-semibold text-muted-foreground transition-colors hover:text-foreground`,children:`Clear filters`}),(0,v.jsxs)(`div`,{className:`relative`,children:[(0,v.jsxs)(`button`,{"aria-label":`Filters`,"aria-expanded":g,"aria-haspopup":`dialog`,onClick:()=>x(e=>!e),className:`relative flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:[(0,v.jsx)(u,{size:16}),S&&(0,v.jsx)(`span`,{"data-testid":`active-filter-dot`,className:`absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-blue`})]}),(0,v.jsx)(`p`,{"aria-live":`polite`,className:`sr-only`,children:o===1?`1 event matches these filters`:`${o} events match these filters`}),g&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/20`,"aria-hidden":`true`,onClick:()=>x(!1)}),(0,v.jsxs)(`div`,{role:`dialog`,"aria-label":`Filters`,className:`card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-lg border border-border/60 bg-card p-3.5`,children:[e.length>0&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(`div`,{role:`group`,"aria-labelledby":`event-types-filter-heading`,children:[(0,v.jsx)(c,{as:`h3`,id:`event-types-filter-heading`,className:`mb-2.5`,children:`Event types`}),(0,v.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.map(e=>{let n=t.has(e.id),r=e.color??`#888`;return(0,v.jsx)(`button`,{"aria-pressed":n,onClick:()=>s(e.id),style:n?{backgroundColor:r,borderColor:r,color:`#fff`}:{borderColor:r+`66`,color:r},className:`shrink-0 rounded-full border px-3 py-1.5 text-caption font-semibold transition-all`,children:e.name},e.id)})})]}),(0,v.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`})]}),(0,v.jsxs)(`div`,{role:`group`,"aria-labelledby":`your-answer-filter-heading`,children:[(0,v.jsx)(c,{as:`h3`,id:`your-answer-filter-heading`,className:`mb-2.5`,children:`Your answer`}),(0,v.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:y.map(({state:e,label:t,active:r,inactive:i})=>{let a=n.has(e);return(0,v.jsx)(`button`,{"aria-pressed":a,onClick:()=>l(e),className:[`shrink-0 rounded-full border px-3 py-1.5 text-caption font-semibold transition-all`,a?r:i].join(` `),children:t},e)})})]}),i&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`}),(0,v.jsxs)(`div`,{role:`group`,"aria-labelledby":`turnout-filter-heading`,children:[(0,v.jsx)(c,{as:`h3`,id:`turnout-filter-heading`,className:`mb-2.5`,children:`Turnout`}),(0,v.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:b.map(({bucket:e,label:t,active:n,inactive:i})=>{let a=r.has(e);return(0,v.jsx)(`button`,{"aria-pressed":a,onClick:()=>d(e),className:[`shrink-0 rounded-full border px-3 py-1.5 text-caption font-semibold transition-all`,a?n:i].join(` `),children:t},e)})})]})]}),(0,v.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`}),(0,v.jsxs)(`div`,{className:`flex items-center justify-between gap-2.5`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`div`,{className:`text-small font-semibold`,children:`Show past events`}),(0,v.jsx)(`div`,{className:`mt-0.5 text-caption text-muted-foreground`,children:a?`On — past events included`:`Off — upcoming only`})]}),(0,v.jsx)(`button`,{role:`switch`,"aria-checked":a,"aria-label":`Show past events`,onClick:()=>p(!a),className:[`relative h-6 w-11 shrink-0 rounded-full transition-colors`,a?`bg-green`:`bg-muted-foreground/30`].join(` `),children:(0,v.jsx)(`span`,{className:[`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200`,a?`left-[22px]`:`left-0.5`].join(` `)})})]})]})]})]})]})}var _,v,y,b;function x(){return(x=e((()=>{_=t(),d(),s(),p(),h(),v=o(),y=[{state:`ATTENDING`,label:`Going`,active:`bg-green border-green text-white`,inactive:`border-green/40 text-green`},{state:`MAYBE`,label:`Maybe`,active:`bg-gold border-gold text-white`,inactive:`border-gold/40 text-gold-ink`},{state:`ABSENT`,label:`Can't`,active:`bg-red border-red text-white`,inactive:`border-red/40 text-red`},{state:`NOT_RESPONDED`,label:`Not responded`,active:`bg-muted-foreground border-muted-foreground text-white`,inactive:`border-muted-foreground/40 text-muted-foreground`}],b=[{bucket:`missing-position`,label:`Missing a position`,active:`bg-red border-red text-white`,inactive:`border-red/40 text-red`},{bucket:`spots-open`,label:`Spots open`,active:`bg-gold border-gold text-white`,inactive:`border-gold/40 text-gold-ink`},{bucket:`covered`,label:`Covered`,active:`bg-green border-green text-white`,inactive:`border-green/40 text-green`},{bucket:`no-target`,label:`No target set`,active:`bg-muted-foreground border-muted-foreground text-white`,inactive:`border-muted-foreground/40 text-muted-foreground`}],g.__docgenInfo={description:`The events page's single filter control: an icon button that opens a popover holding the
event-type chips, the answer chips, the Turnout chips and the "Show past events" switch — plus a
\`Clear filters\` button beside it whenever any of them is in effect (ADR-0030 §2). It
replaces the old Upcoming/Past segmented tab bar — past events are a filter, not a mode, and the
page no longer spends a band of chrome on a control that only flipped which way the same list grew.

Each chip group is a total partition of the list, so "all chips on" is the unfiltered default and
can never hide anything (ADR-0029 §1). Selection is isolate-first and lives in the route, which
owns the one toggler every group shares. Groups come from the data: the type chips render only
when the team has types, and the Turnout group only when the list spans two of its bands (§5).

Prop-only apart from the popover's own open/closed state, which is local view state: the three
selections and the show-past flag live in the route so they can drive \`useEvents\`, the hero and
Bulk Attend.`,methods:[],displayName:`EventFiltersView`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},activeTypeIds:{required:!0,tsType:{name:`Set`,elements:[{name:`string`}],raw:`Set<string>`},description:`Ids of the types currently shown. Every id active = no type filter in effect.`},activeStates:{required:!0,tsType:{name:`Set`,elements:[{name:`AttendanceState`}],raw:`Set<AttendanceState>`},description:`Attendance States currently shown. Every state active = no answer filter in effect.`},activeTurnouts:{required:!0,tsType:{name:`Set`,elements:[{name:`union`,raw:`'missing-position' | 'spots-open' | 'covered' | 'no-target'`,elements:[{name:`literal`,value:`'missing-position'`},{name:`literal`,value:`'spots-open'`},{name:`literal`,value:`'covered'`},{name:`literal`,value:`'no-target'`}]}],raw:`Set<TurnoutBucket>`},description:`Turnout bands currently shown. Every band active = no turnout filter in effect.`},showTurnout:{required:!0,tsType:{name:`boolean`},description:`Whether the list spans two or more Turnout bands (ADR-0029 §5). False hides the whole group:
for a team that sets no targets it would be four chips that provably filter nothing.`},showPast:{required:!0,tsType:{name:`boolean`},description:``},resultCount:{required:!0,tsType:{name:`number`},description:`How many events survive the current filter — announced, never shown (ADR-0029).`},onToggleType:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},onToggleState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:``},onToggleTurnout:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(bucket: TurnoutBucket) => void`,signature:{arguments:[{type:{name:`union`,raw:`'missing-position' | 'spots-open' | 'covered' | 'no-target'`,elements:[{name:`literal`,value:`'missing-position'`},{name:`literal`,value:`'spots-open'`},{name:`literal`,value:`'covered'`},{name:`literal`,value:`'no-target'`}]},name:`bucket`}],return:{name:`void`}}},description:``},onToggleShowPast:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(showPast: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`showPast`}],return:{name:`void`}}},description:``},onClearFilters:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Resets every dimension. Offered next to the trigger whenever a filter is in effect.`}}}})))()}var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J;function Y(){return(Y=e((()=>{r(),p(),h(),x(),{expect:S,fn:C}=__STORYBOOK_MODULE_TEST__,w=[n({id:`et-1`,name:`Training`,color:`#249E6C`}),n({id:`et-2`,name:`Match`,color:`#225C9C`}),n({id:`et-3`,name:`Tournament`,color:`#7B5EA7`})],T=new Set(w.map(e=>e.id)),E=new Set(f),D=new Set(m),O={title:`features/filter-event-types/EventFiltersView`,component:g,args:{eventTypes:w,activeTypeIds:T,activeStates:E,activeTurnouts:D,showTurnout:!0,showPast:!1,resultCount:7,onToggleType:C(),onToggleState:C(),onToggleTurnout:C(),onToggleShowPast:C(),onClearFilters:C()}},k={play:async({canvas:e})=>{await S(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await S(e.queryByRole(`dialog`)).not.toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Clear filters`})).not.toBeInTheDocument()}},A={args:{activeTypeIds:new Set([`et-2`]),resultCount:2},play:async({canvas:e})=>{await S(e.getByRole(`button`,{name:`Clear filters`})).toBeInTheDocument(),await S(e.getByTestId(`active-filter-dot`)).toBeInTheDocument()}},j={args:{activeTypeIds:new Set([`et-2`]),resultCount:2},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Clear filters`})),await S(n.onClearFilters).toHaveBeenCalled()}},M={args:{showPast:!0},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Clear filters`})),await S(n.onClearFilters).toHaveBeenCalled()}},N={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await S(e.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await S(e.getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await S(e.getByRole(`group`,{name:`Turnout`})).toBeInTheDocument(),await S(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await S(e.getByText(`Off — upcoming only`)).toBeInTheDocument();for(let t of[`Going`,`Maybe`,`Can't`,`Not responded`,`Missing a position`,`Spots open`,`Covered`,`No target set`])await S(e.getByRole(`button`,{name:t})).toHaveAttribute(`aria-pressed`,`true`);await S(e.queryByTestId(`active-filter-dot`)).not.toBeInTheDocument()}},P={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Match`})),await S(n.onToggleType).toHaveBeenCalledWith(`et-2`)}},F={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await S(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},I={args:{showPast:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await S(e.getByText(`On — past events included`)).toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await S(n.onToggleShowPast).toHaveBeenCalledWith(!1)}},L={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await S(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},R={args:{eventTypes:[],activeTypeIds:new Set},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await S(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},z={args:{activeTypeIds:new Set([`et-2`])},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await S(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`)}},B={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Not responded`})),await S(n.onToggleState).toHaveBeenCalledWith(`NOT_RESPONDED`)}},V={args:{activeStates:new Set([`NOT_RESPONDED`]),resultCount:3},play:async({canvas:e,userEvent:t})=>{await S(e.getByTestId(`active-filter-dot`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`button`,{name:`Not responded`})).toHaveAttribute(`aria-pressed`,`true`),await S(e.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await S(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`true`)}},H={args:{activeStates:new Set([`NOT_RESPONDED`]),resultCount:3},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Maybe`})),await S(n.onToggleState).toHaveBeenCalledWith(`MAYBE`)}},U={args:{resultCount:1},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await S(e.getByText(`1 event matches these filters`)).toBeInTheDocument()}},W={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Spots open`})),await S(n.onToggleTurnout).toHaveBeenCalledWith(`spots-open`)}},G={args:{activeTurnouts:new Set([`missing-position`]),resultCount:2},play:async({canvas:e,userEvent:t})=>{await S(e.getByTestId(`active-filter-dot`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.getByRole(`button`,{name:`Missing a position`})).toHaveAttribute(`aria-pressed`,`true`);for(let t of[`Spots open`,`Covered`,`No target set`])await S(e.getByRole(`button`,{name:t})).toHaveAttribute(`aria-pressed`,`false`);await S(e.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`)}},K={args:{activeTurnouts:new Set([`missing-position`]),resultCount:2},parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Spots open`})),await S(n.onToggleTurnout).toHaveBeenCalledWith(`spots-open`)}},q={args:{showTurnout:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await S(e.queryByRole(`group`,{name:`Turnout`})).not.toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Spots open`})).not.toBeInTheDocument(),await S(e.getByRole(`group`,{name:`Your answer`})).toBeInTheDocument(),await S(e.getByRole(`switch`,{name:`Show past events`})).toBeInTheDocument()}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    activeTypeIds: new Set(['et-2']),
    resultCount: 2
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Clear filters'
    })).toBeInTheDocument();
    // Both signals, side by side: the dot says *that* something is filtered, the button says undo.
    await expect(canvas.getByTestId('active-filter-dot')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of ClearFiltersVisible — the same picture, only onClearFilters fires
  // (ADR-0027 §2).
  args: {
    activeTypeIds: new Set(['et-2']),
    resultCount: 2
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
      name: 'Clear filters'
    }));
    await expect(args.onClearFilters).toHaveBeenCalled();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    showPast: true
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
      name: 'Clear filters'
    }));
    await expect(args.onClearFilters).toHaveBeenCalled();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of Open — the open popover is the same picture; only onToggleTurnout fires
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
      name: 'Spots open'
    }));
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open');
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    activeTurnouts: new Set<TurnoutBucket>(['missing-position']),
    resultCount: 2
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
      name: 'Missing a position'
    })).toHaveAttribute('aria-pressed', 'true');
    for (const label of ['Spots open', 'Covered', 'No target set']) {
      await expect(canvas.getByRole('button', {
        name: label
      })).toHaveAttribute('aria-pressed', 'false');
    }
    // Every answer chip is still on — the dot is the Turnout group's doing.
    await expect(canvas.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of FilteredToMissingAPosition — same picture, only onToggleTurnout fires
  // (ADR-0027 §2).
  args: {
    activeTurnouts: new Set<TurnoutBucket>(['missing-position']),
    resultCount: 2
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
      name: 'Spots open'
    }));
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open');
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    showTurnout: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.queryByRole('group', {
      name: 'Turnout'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Spots open'
    })).not.toBeInTheDocument();
    await expect(canvas.getByRole('group', {
      name: 'Your answer'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J=[`Closed`,`ClearFiltersVisible`,`ClearsFilters`,`ClearFiltersVisibleForShowPastAlone`,`Open`,`TogglesType`,`TogglesShowPast`,`ShowingPast`,`ClosesOnEscape`,`WithoutEventTypes`,`FilteredToOneType`,`TogglesState`,`FilteredToNotResponded`,`TogglesSecondStateBackOn`,`AnnouncesResultCount`,`TogglesTurnout`,`FilteredToMissingAPosition`,`TogglesSecondTurnoutBackOn`,`WithoutTurnout`]})))()}Y();export{U as AnnouncesResultCount,A as ClearFiltersVisible,M as ClearFiltersVisibleForShowPastAlone,j as ClearsFilters,k as Closed,L as ClosesOnEscape,G as FilteredToMissingAPosition,V as FilteredToNotResponded,z as FilteredToOneType,N as Open,I as ShowingPast,H as TogglesSecondStateBackOn,K as TogglesSecondTurnoutBackOn,F as TogglesShowPast,B as TogglesState,W as TogglesTurnout,P as TogglesType,R as WithoutEventTypes,q as WithoutTurnout,J as __namedExportsOrder,O as default};