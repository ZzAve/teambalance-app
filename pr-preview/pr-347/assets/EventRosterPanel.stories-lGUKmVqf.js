import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{n as i,t as a}from"./router-decorator-DQHXi5me.js";import{a as o,r as s,s as c,t as l}from"./event-fixtures-CuRrQuRB.js";import{n as u,t as d}from"./EventRosterPanel-Bc28tgyM.js";var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{a(),s(),n(),u(),f=t(),{expect:p,within:m}=__STORYBOOK_MODULE_TEST__,h=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),g=[h(`u-set1`,`Sanne`,`Setter`),h(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),h(`u-lib`,`Lars`,`Libero`),h(`u-mid1`,`Milan`,`Middle`),h(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),h(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],_=Array.from({length:18},(e,t)=>h(`u-${t}`,`Member ${t+1}`,`Unassigned`,{state:t%3==0?`NOT_RESPONDED`:`ATTENDING`})),v=o({roster:c(),attendances:g}),y={title:`widgets/event-panel/EventRosterPanel`,component:d,decorators:[i],args:{event:v,view:`pips`,currentUserId:`u-lib`,detailHref:`/t/setpoint-vt/events/evt-002`}},b={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await p(e.getByText(`Positions`,{selector:`span`})).toBeInTheDocument(),await p(e.queryByText(`Sanne`)).not.toBeInTheDocument()}},x={render:e=>(0,f.jsx)(r,{items:{"Member view":(0,f.jsx)(d,{...e,view:`members`}),"Member list is capped at 15":(0,f.jsx)(d,{...e,view:`members`,event:o({roster:c(),attendances:_})}),"No see-all link under the cap":(0,f.jsx)(d,{...e,view:`members`}),"Member list is read-only":(0,f.jsx)(d,{...e,view:`members`}),"Social always shows members":(0,f.jsx)(d,{...e,view:`pips`,event:o({roster:c({...l,totalAttending:4}),attendances:g})})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await p(t(`Member view`).getByText(`Sanne`)).toBeInTheDocument(),await p(t(`Member view`).getByText(`Uwe`)).toBeInTheDocument(),await p(t(`Member view`).getByText(`Awaiting`)).toBeInTheDocument(),await p(t(`Member view`).getByText(`You`)).toBeInTheDocument(),await p(t(`Member list is capped at 15`).getByText(`Member 15`)).toBeInTheDocument(),await p(t(`Member list is capped at 15`).queryByText(`Member 16`)).not.toBeInTheDocument(),await p(t(`Member list is capped at 15`).getByRole(`link`,{name:/See all 18/})).toHaveAttribute(`href`,`/t/setpoint-vt/events/evt-002`),await p(t(`No see-all link under the cap`).queryByRole(`link`,{name:/See all/})).not.toBeInTheDocument(),await p(t(`Member list is read-only`).getByText(`Sanne`)).toBeInTheDocument(),await p(t(`Member list is read-only`).queryByRole(`button`,{name:/Change .*'s answer/})).not.toBeInTheDocument(),await p(t(`Member list is read-only`).queryByRole(`button`,{name:/^Going$/})).not.toBeInTheDocument(),await p(t(`Member list is read-only`).queryByRole(`button`,{name:/^Can't$/})).not.toBeInTheDocument(),await p(t(`Social always shows members`).getByText(`Sanne`)).toBeInTheDocument(),await p(t(`Social always shows members`).queryByText(`Positions`)).not.toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Positions', {
      selector: 'span'
    })).toBeInTheDocument();
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Grouped by position, non-responders included and named (the whole point of the payload
    // change). The viewer's own row is marked.
    'Member view': <EventRosterPanel {...args} view="members" />,
    // Uncapped, one card on the member view is a screenful and the list stops being a list. 18
    // members: 15 on the card, the rest behind a link to the event.
    'Member list is capped at 15': <EventRosterPanel {...args} view="members" event={makeEvent({
      roster: makeRoster(),
      attendances: BIG_TEAM
    })} />,
    // At or below the cap there is nothing behind a link, so no link.
    'No see-all link under the cap': <EventRosterPanel {...args} view="members" />,
    // Editing a teammate's attendance lives on detail-page rows only. Reusing AttendeeList here
    // must not extend that to the list page — so the rows carry the answer as a fact, with
    // nothing to open.
    'Member list is read-only': <EventRosterPanel {...args} view="members" />,
    // Tracking off: there are no pips to draw, so the panel is its people whatever the
    // preference says — which is what finally gives a social something to expand to (#324
    // cause 3). It no longer has to suppress a view switch to manage that, because there is no
    // switch on a card any more.
    'Social always shows members': <EventRosterPanel {...args} view="pips" event={makeEvent({
      roster: makeRoster({
        ...NO_ROSTER,
        totalAttending: 4
      }),
      attendances: TEAM
    })} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Member view').getByText('Sanne')).toBeInTheDocument();
    await expect(region('Member view').getByText('Uwe')).toBeInTheDocument();
    await expect(region('Member view').getByText('Awaiting')).toBeInTheDocument();
    await expect(region('Member view').getByText('You')).toBeInTheDocument();
    await expect(region('Member list is capped at 15').getByText(\`Member \${MEMBER_CAP}\`)).toBeInTheDocument();
    await expect(region('Member list is capped at 15').queryByText(\`Member \${MEMBER_CAP + 1}\`)).not.toBeInTheDocument();
    await expect(region('Member list is capped at 15').getByRole('link', {
      name: /See all 18/
    })).toHaveAttribute('href', '/t/setpoint-vt/events/evt-002');
    await expect(region('No see-all link under the cap').queryByRole('link', {
      name: /See all/
    })).not.toBeInTheDocument();
    await expect(region('Member list is read-only').getByText('Sanne')).toBeInTheDocument();
    // No per-row disclosure…
    await expect(region('Member list is read-only').queryByRole('button', {
      name: /Change .*'s answer/
    })).not.toBeInTheDocument();
    // …and therefore no three-way control anywhere in the panel.
    await expect(region('Member list is read-only').queryByRole('button', {
      name: /^Going$/
    })).not.toBeInTheDocument();
    await expect(region('Member list is read-only').queryByRole('button', {
      name: /^Can't$/
    })).not.toBeInTheDocument();
    await expect(region('Social always shows members').getByText('Sanne')).toBeInTheDocument();
    // Even asked for pips, it shows people — there are none to draw.
    await expect(region('Social always shows members').queryByText('Positions')).not.toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S=[`Data`,`Shells`]})))()}C();export{b as Data,x as Shells,S as __namedExportsOrder,y as default};