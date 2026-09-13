import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,o as n,r,t as i}from"./event-fixtures-BltZTX-3.js";import{n as a,t as o}from"./createLucideIcon-kmI8T8Hh.js";import{n as s,t as c}from"./arrow-right-CE0MZFL4.js";import{n as l,t as u}from"./users-D3HAU36h.js";import{t as d}from"./jsx-runtime-DeHZSEgm.js";import{n as f,t as p}from"./RosterPips-oMqpYcxY.js";import{i as m,n as h,r as g,t as _}from"./router-decorator-Bna-6SzR.js";import{n as v,t as y}from"./modes-Bzyminl_.js";import{n as b,t as x}from"./AttendeeList-ClBOSuPq.js";var S,C;function w(){return(w=e((()=>{a(),S=[[`rect`,{width:`7`,height:`7`,x:`3`,y:`3`,rx:`1`,key:`1g98yp`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`3`,rx:`1`,key:`6d4xhi`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`14`,rx:`1`,key:`nxv5o0`}],[`rect`,{width:`7`,height:`7`,x:`3`,y:`14`,rx:`1`,key:`1bb6yr`}]],C=o(`layout-grid`,S)})))()}function T({view:e,onViewChange:t,defaultExpanded:n,onDefaultExpandedChange:r}){return(0,E.jsxs)(`div`,{className:`mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-2.5`,children:[e!==null&&(0,E.jsx)(`div`,{className:`flex gap-1`,role:`group`,"aria-label":`Panel view`,children:D.map(({value:n,label:r,Icon:i})=>{let a=e===n;return(0,E.jsxs)(`button`,{type:`button`,"aria-pressed":a,onClick:()=>t(n),className:[`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors`,a?`border-foreground bg-foreground text-background`:`border-border text-muted-foreground`].join(` `),children:[(0,E.jsx)(i,{size:12}),r]},n)})}),(0,E.jsx)(`button`,{type:`button`,"aria-pressed":n,onClick:()=>r(!n),className:[`ml-auto shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors`,n?`border-blue bg-blue/10 text-blue`:`border-border text-muted-foreground`].join(` `),children:`Keep open`})]})}var E,D;function O(){return(O=e((()=>{w(),l(),E=d(),D=[{value:`pips`,label:`Positions`,Icon:C},{value:`members`,label:`People`,Icon:u}],T.__docgenInfo={description:`The panel's own footer: which view it shows, and whether it starts open. Both are one *global*
preference each, not per card (ADR-0030 §5) — which of the two you think in is a taste, and a
per-card switch would persist a great deal of state for one.

It lives inside the panel rather than in the filter popover for the same reason: a display switch
belongs where its result is visible. Prop-only; the store is wired in by the events route.`,methods:[],displayName:`PanelPreferencesBar`,props:{view:{required:!0,tsType:{name:`union`,raw:`PanelView | null`,elements:[{name:`union`,raw:`'pips' | 'members'`,elements:[{name:`literal`,value:`'pips'`},{name:`literal`,value:`'members'`}]},{name:`null`}]},description:`Null on an event with no lineup to draw: there is only one view, so there is nothing to pick.`},onViewChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(view: PanelView) => void`,signature:{arguments:[{type:{name:`union`,raw:`'pips' | 'members'`,elements:[{name:`literal`,value:`'pips'`},{name:`literal`,value:`'members'`}]},name:`view`}],return:{name:`void`}}},description:``},defaultExpanded:{required:!0,tsType:{name:`boolean`},description:``},onDefaultExpandedChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(defaultExpanded: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`defaultExpanded`}],return:{name:`void`}}},description:``}}}})))()}function k({event:e,view:t,onViewChange:n,defaultExpanded:r,onDefaultExpandedChange:i,currentUserId:a,detailHref:o}){let s=e.roster.trackRoster,l=t===`members`||!s,u=e.attendances.length-15;return(0,A.jsxs)(`div`,{children:[l?(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(x,{attendees:e.attendances.slice(0,15),roster:e.roster,currentUserId:a}),u>0&&(0,A.jsxs)(g,{to:o,className:`mt-2 flex items-center gap-1 px-2.5 text-xs font-semibold text-blue`,children:[`See all `,e.attendances.length,(0,A.jsx)(c,{size:12,"aria-hidden":!0})]})]}):(0,A.jsx)(p,{roster:e.roster}),(0,A.jsx)(T,{view:s?t:null,onViewChange:n,defaultExpanded:r,onDefaultExpandedChange:i})]})}var A;function j(){return(j=e((()=>{m(),s(),f(),b(),O(),A=d(),k.__docgenInfo={description:`What the card's roster disclosure opens onto: the position pips, or the team, the member's choice
(ADR-0030 §5). Composed here rather than in \`EventAnswerRow\` because the member list is
\`AttendeeList\` — a widget — and the card is an entity; the events route injects this whole panel
as a node, which is also what keeps the card prop-only.

The member list is \`AttendeeList\` itself, reused verbatim from the detail page and rendered
**read-only** (no \`onRespond\`): editing a teammate's attendance stays on detail-page rows (#271
⑫), and the card's own answer row already handles the viewer's own answer.

An event with roster tracking off has no pips to draw, so it always shows its members — which is
what finally gives a social something to expand to (#324 cause 3) and why it offers no view
switch: the other view would be blank.`,methods:[],displayName:`EventRosterPanel`,props:{event:{required:!0,tsType:{name:`Event`},description:``},view:{required:!0,tsType:{name:`PanelView`},description:``},onViewChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(view: PanelView) => void`,signature:{arguments:[{type:{name:`PanelView`},name:`view`}],return:{name:`void`}}},description:``},defaultExpanded:{required:!0,tsType:{name:`boolean`},description:``},onDefaultExpandedChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(defaultExpanded: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`defaultExpanded`}],return:{name:`void`}}},description:``},currentUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:"The viewer, so their own row is marked `You`."},detailHref:{required:!0,tsType:{name:`string`},description:`Where the capped remainder lives — this event's own detail page.`}}}})))()}var M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{_(),r(),v(),j(),{expect:M,fn:N}=__STORYBOOK_MODULE_TEST__,P=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),F=[P(`u-set1`,`Sanne`,`Setter`),P(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),P(`u-lib`,`Lars`,`Libero`),P(`u-mid1`,`Milan`,`Middle`),P(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),P(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],I=Array.from({length:18},(e,t)=>P(`u-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%3==0?`NOT_RESPONDED`:`ATTENDING`})),L=t({roster:n(),attendances:F}),R={title:`widgets/event-panel/EventRosterPanel`,component:k,decorators:[h],args:{event:L,view:`pips`,onViewChange:N(),defaultExpanded:!1,onDefaultExpandedChange:N(),currentUserId:`u-lib`,detailHref:`/t/setpoint-vt/events/evt-002`},parameters:{chromatic:{modes:{light:y.light,dark:y.dark}}}},z={play:async({canvas:e})=>{await M(e.getByText(`Positions`,{selector:`span`})).toBeInTheDocument(),await M(e.queryByText(`Sanne`)).not.toBeInTheDocument()}},B={args:{view:`members`},play:async({canvas:e})=>{await M(e.getByText(`Sanne`)).toBeInTheDocument(),await M(e.getByText(`Uwe`)).toBeInTheDocument(),await M(e.getByText(`Awaiting`)).toBeInTheDocument(),await M(e.getByText(`You`)).toBeInTheDocument()}},V={play:async({canvas:e,userEvent:t,args:n})=>{await M(e.getByRole(`button`,{name:`Positions`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:`People`})),await M(n.onViewChange).toHaveBeenCalledWith(`members`)}},H={args:{view:`members`},play:async({canvas:e,userEvent:t,args:n})=>{await M(e.getByRole(`button`,{name:`People`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:`Positions`})),await M(n.onViewChange).toHaveBeenCalledWith(`pips`)}},U={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByRole(`button`,{name:`Keep open`});await M(r).toHaveAttribute(`aria-pressed`,`false`),await t.click(r),await M(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0)}},W={args:{defaultExpanded:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Keep open`})),await M(n.onDefaultExpandedChange).toHaveBeenCalledWith(!1)}},G={args:{view:`members`,event:t({roster:n(),attendances:I})},play:async({canvas:e})=>{await M(e.getByText(`Member 15`)).toBeInTheDocument(),await M(e.queryByText(`Member 16`)).not.toBeInTheDocument();let t=e.getByRole(`link`,{name:/See all 18/});await M(t).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-002`)}},K={args:{view:`members`},play:async({canvas:e})=>{await M(e.queryByRole(`link`,{name:/See all/})).not.toBeInTheDocument()}},q={args:{view:`members`},play:async({canvas:e})=>{await M(e.getByText(`Sanne`)).toBeInTheDocument(),await M(e.queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await M(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await M(e.queryByRole(`button`,{name:/^Can't$/})).not.toBeInTheDocument()}},J={args:{view:`pips`,event:t({roster:n({...i,totalAttending:4}),attendances:F})},play:async({canvas:e})=>{await M(e.getByText(`Sanne`)).toBeInTheDocument(),await M(e.queryByRole(`button`,{name:`Positions`})).not.toBeInTheDocument(),await M(e.queryByRole(`button`,{name:`People`})).not.toBeInTheDocument(),await M(e.getByRole(`button`,{name:`Keep open`})).toBeInTheDocument()}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Positions', {
      selector: 'span'
    })).toBeInTheDocument();
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members'
  },
  play: async ({
    canvas
  }) => {
    // Grouped by position, non-responders included and named (the whole point of the payload change).
    await expect(canvas.getByText('Sanne')).toBeInTheDocument();
    await expect(canvas.getByText('Uwe')).toBeInTheDocument();
    await expect(canvas.getByText('Awaiting')).toBeInTheDocument();
    // The viewer's own row is marked.
    await expect(canvas.getByText('You')).toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Positions'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', {
      name: 'People'
    }));
    await expect(args.onViewChange).toHaveBeenCalledWith('members');
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'People'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Positions'
    }));
    await expect(args.onViewChange).toHaveBeenCalledWith('pips');
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const keepOpen = canvas.getByRole('button', {
      name: 'Keep open'
    });
    await expect(keepOpen).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(keepOpen);
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true);
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpanded: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Keep open'
    }));
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(false);
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members',
    event: makeEvent({
      roster: makeRoster(),
      attendances: BIG_TEAM
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(\`Member \${MEMBER_CAP}\`)).toBeInTheDocument();
    await expect(canvas.queryByText(\`Member \${MEMBER_CAP + 1}\`)).not.toBeInTheDocument();
    const seeAll = canvas.getByRole('link', {
      name: /See all 18/
    });
    await expect(seeAll).toHaveAttribute('href', '/t/setpoint-vt/events/evt-002');
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('link', {
      name: /See all/
    })).not.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'members'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Sanne')).toBeInTheDocument();
    // No per-row disclosure…
    await expect(canvas.queryByRole('button', {
      name: /Change .*'s answer/
    })).not.toBeInTheDocument();
    // …and therefore no three-way control anywhere in the panel.
    await expect(canvas.queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: /^Can't$/
    })).not.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'pips',
    event: makeEvent({
      roster: makeRoster({
        ...NO_ROSTER,
        totalAttending: 4
      }),
      attendances: TEAM
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Sanne')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Positions'
    })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'People'
    })).not.toBeInTheDocument();
    // \`Keep open\` is still offered — it applies to every card.
    await expect(canvas.getByRole('button', {
      name: 'Keep open'
    })).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y=[`PipsView`,`MembersView`,`SwitchingToMembersIsReported`,`SwitchingBackToPipsIsReported`,`KeepOpenIsReported`,`KeepOpenAlreadyOn`,`MemberListIsCappedAt15`,`NoSeeAllLinkUnderTheCap`,`MemberListIsReadOnly`,`SocialAlwaysShowsMembers`]})))()}X();export{W as KeepOpenAlreadyOn,U as KeepOpenIsReported,G as MemberListIsCappedAt15,q as MemberListIsReadOnly,B as MembersView,K as NoSeeAllLinkUnderTheCap,z as PipsView,J as SocialAlwaysShowsMembers,H as SwitchingBackToPipsIsReported,V as SwitchingToMembersIsReported,Y as __namedExportsOrder,R as default};