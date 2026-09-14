import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n,s as r,t as i}from"./event-fixtures-CuRrQuRB.js";import{n as a,t as o}from"./router-decorator-B0OaSX4-.js";import{n as s,t as c}from"./modes-Bzyminl_.js";import{n as l,t as u}from"./EventRosterPanel-Ccci8SxD.js";var d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{o(),n(),s(),l(),{expect:d}=__STORYBOOK_MODULE_TEST__,f=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),p=[f(`u-set1`,`Sanne`,`Setter`),f(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),f(`u-lib`,`Lars`,`Libero`),f(`u-mid1`,`Milan`,`Middle`),f(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),f(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],m=Array.from({length:18},(e,t)=>f(`u-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%3==0?`NOT_RESPONDED`:`ATTENDING`})),h=t({roster:r(),attendances:p}),g={title:`widgets/event-panel/EventRosterPanel`,component:u,decorators:[a],args:{event:h,view:`pips`,currentUserId:`u-lib`,detailHref:`/t/setpoint-vt/events/evt-002`},parameters:{chromatic:{modes:{light:c.light,dark:c.dark}}}},_={play:async({canvas:e})=>{await d(e.getByText(`Positions`,{selector:`span`})).toBeInTheDocument(),await d(e.queryByText(`Sanne`)).not.toBeInTheDocument()}},v={args:{view:`members`},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.getByText(`Uwe`)).toBeInTheDocument(),await d(e.getByText(`Awaiting`)).toBeInTheDocument(),await d(e.getByText(`You`)).toBeInTheDocument()}},y={args:{view:`members`,event:t({roster:r(),attendances:m})},play:async({canvas:e})=>{await d(e.getByText(`Member 15`)).toBeInTheDocument(),await d(e.queryByText(`Member 16`)).not.toBeInTheDocument();let t=e.getByRole(`link`,{name:/See all 18/});await d(t).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-002`)}},b={args:{view:`members`},play:async({canvas:e})=>{await d(e.queryByRole(`link`,{name:/See all/})).not.toBeInTheDocument()}},x={args:{view:`members`},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await d(e.queryByRole(`button`,{name:/^Can't$/})).not.toBeInTheDocument()}},S={args:{view:`pips`,event:t({roster:r({...i,totalAttending:4}),attendances:p})},play:async({canvas:e})=>{await d(e.getByText(`Sanne`)).toBeInTheDocument(),await d(e.queryByText(`Positions`)).not.toBeInTheDocument()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Positions', {
      selector: 'span'
    })).toBeInTheDocument();
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
    // Even asked for pips, it shows people — there are none to draw.
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C=[`PipsView`,`MembersView`,`MemberListIsCappedAt15`,`NoSeeAllLinkUnderTheCap`,`MemberListIsReadOnly`,`SocialAlwaysShowsMembers`]})))()}w();export{y as MemberListIsCappedAt15,x as MemberListIsReadOnly,v as MembersView,b as NoSeeAllLinkUnderTheCap,_ as PipsView,S as SocialAlwaysShowsMembers,C as __namedExportsOrder,g as default};