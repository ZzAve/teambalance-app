import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n,s as r,t as i}from"./event-fixtures-CuRrQuRB.js";import{n as a,t as o}from"./EventRosterPanel-CjNe6eSC.js";import{n as s,t as c}from"./router-decorator-D_ZsG7bi.js";import{n as l,t as u}from"./modes-Bzyminl_.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{c(),n(),l(),a(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),m=[p(`u-set1`,`Sanne`,`Setter`),p(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),p(`u-lib`,`Lars`,`Libero`),p(`u-mid1`,`Milan`,`Middle`),p(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),p(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],h=Array.from({length:18},(e,t)=>p(`u-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%3==0?`NOT_RESPONDED`:`ATTENDING`})),g=t({roster:r(),attendances:m}),_={title:`widgets/event-panel/EventRosterPanel`,component:o,decorators:[s],args:{event:g,view:`pips`,onViewChange:f(),defaultExpanded:!1,onDefaultExpandedChange:f(),currentUserId:`u-lib`,detailHref:`/t/setpoint-vt/events/evt-002`},parameters:{chromatic:{modes:{light:u.light,dark:u.dark}}}},v={play:async({canvas:e})=>{await d(e.getByText(`Positions`,{selector:`span`})).toBeInTheDocument(),await d(e.queryByText(`Sanne`)).not.toBeInTheDocument()}},y={args:{view:`members`},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.getByText(`Uwe`)).toBeInTheDocument(),await d(e.getByText(`Awaiting`)).toBeInTheDocument(),await d(e.getByText(`You`)).toBeInTheDocument()}},b={play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByRole(`button`,{name:`Positions`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:`People`})),await d(n.onViewChange).toHaveBeenCalledWith(`members`)}},x={args:{view:`members`},play:async({canvas:e,userEvent:t,args:n})=>{await d(e.getByRole(`button`,{name:`People`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(e.getByRole(`button`,{name:`Positions`})),await d(n.onViewChange).toHaveBeenCalledWith(`pips`)}},S={play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByRole(`button`,{name:`Keep open`});await d(r).toHaveAttribute(`aria-pressed`,`false`),await t.click(r),await d(n.onDefaultExpandedChange).toHaveBeenCalledWith(!0)}},C={args:{defaultExpanded:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Keep open`})),await d(n.onDefaultExpandedChange).toHaveBeenCalledWith(!1)}},w={args:{view:`members`,event:t({roster:r(),attendances:h})},play:async({canvas:e})=>{await d(e.getByText(`Member 15`)).toBeInTheDocument(),await d(e.queryByText(`Member 16`)).not.toBeInTheDocument();let t=e.getByRole(`link`,{name:/See all 18/});await d(t).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-002`)}},T={args:{view:`members`},play:async({canvas:e})=>{await d(e.queryByRole(`link`,{name:/See all/})).not.toBeInTheDocument()}},E={args:{view:`members`},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Can't$/})).not.toBeInTheDocument()}},D={args:{view:`pips`,event:t({roster:r({...i,totalAttending:4}),attendances:m})},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:`Positions`})).not.toBeInTheDocument(),await d(e.queryByRole(`button`,{name:`People`})).not.toBeInTheDocument(),await d(e.getByRole(`button`,{name:`Keep open`})).toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Positions', {
      selector: 'span'
    })).toBeInTheDocument();
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O=[`PipsView`,`MembersView`,`SwitchingToMembersIsReported`,`SwitchingBackToPipsIsReported`,`KeepOpenIsReported`,`KeepOpenAlreadyOn`,`MemberListIsCappedAt15`,`NoSeeAllLinkUnderTheCap`,`MemberListIsReadOnly`,`SocialAlwaysShowsMembers`]})))()}k();export{C as KeepOpenAlreadyOn,S as KeepOpenIsReported,w as MemberListIsCappedAt15,E as MemberListIsReadOnly,y as MembersView,T as NoSeeAllLinkUnderTheCap,v as PipsView,D as SocialAlwaysShowsMembers,x as SwitchingBackToPipsIsReported,b as SwitchingToMembersIsReported,O as __namedExportsOrder,_ as default};