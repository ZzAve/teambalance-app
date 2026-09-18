import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{i,n as a,o,t as s}from"./MonthCalendarPreview-BElMyTfM.js";var c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),o(),a(),c=t(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d={start:`2026-09-01`,end:`2027-05-31`},f={title:`features/create-recurring-events/MonthCalendarPreview`,component:s,args:{accentColor:`#225C9C`}},p={args:{preview:i({frequency:`WEEKLY`,weekdays:[`TUESDAY`],startDate:`2026-09-01`,endDate:`2026-09-30`},d)},render:e=>(0,c.jsx)(r,{items:{"In season":(0,c.jsx)(s,{...e,preview:i({frequency:`WEEKLY`,weekdays:[`TUESDAY`,`THURSDAY`],startDate:`2026-09-01`,endDate:`2026-10-31`},d)}),"Out of season":(0,c.jsx)(s,{...e,preview:i({frequency:`WEEKLY`,weekdays:[`TUESDAY`],startDate:`2026-09-01`,endDate:`2026-09-30`},{start:`2026-09-01`,end:`2026-09-05`})}),"Over cap":(0,c.jsx)(s,{...e,preview:i({frequency:`WEEKLY`,weekdays:[`MONDAY`,`TUESDAY`,`WEDNESDAY`,`THURSDAY`,`FRIDAY`],startDate:`2026-01-01`,endDate:`2027-12-31`},void 0)}),Empty:(0,c.jsx)(s,{...e,preview:i({frequency:`WEEKLY`,weekdays:[],startDate:`2026-09-01`,endDate:`2026-09-30`},d)})}}),play:async({canvas:e})=>{let t=t=>u(e.getByRole(`region`,{name:t}));await l(t(`In season`).getByTestId(`occurrence-count`)).toBeInTheDocument(),await l(t(`In season`).queryByText(/outside the season/i)).not.toBeInTheDocument(),await l(t(`Out of season`).getByText(/outside the season/i)).toBeInTheDocument(),await l(t(`Over cap`).getByText(/over 200 events/i)).toBeInTheDocument(),await l(t(`Empty`).getByText(/No dates yet/i)).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  // Unused by render below — every Stack item supplies its own \`preview\` — but required to satisfy
  // the story's prop contract (\`preview\` is required on MonthCalendarPreview).
  args: {
    preview: buildCalendarPreview({
      frequency: 'WEEKLY',
      weekdays: ['TUESDAY'],
      startDate: '2026-09-01',
      endDate: '2026-09-30'
    }, SEASON)
  },
  render: args => <Stack items={{
    // In-season Tue+Thu weekly across two months.
    'In season': <MonthCalendarPreview {...args} preview={buildCalendarPreview({
      frequency: 'WEEKLY',
      weekdays: ['TUESDAY', 'THURSDAY'],
      startDate: '2026-09-01',
      endDate: '2026-10-31'
    }, SEASON)} />,
    // Some occurrences fall past a short season window — flagged red with a warning.
    'Out of season': <MonthCalendarPreview {...args} preview={buildCalendarPreview({
      frequency: 'WEEKLY',
      weekdays: ['TUESDAY'],
      startDate: '2026-09-01',
      endDate: '2026-09-30'
    }, {
      start: '2026-09-01',
      end: '2026-09-05'
    })} />,
    // Generation exceeds the 200 cap — the preview warns instead of silently truncating.
    'Over cap': <MonthCalendarPreview {...args} preview={buildCalendarPreview({
      frequency: 'WEEKLY',
      weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      startDate: '2026-01-01',
      endDate: '2027-12-31'
    }, undefined)} />,
    // Nothing selected yet — the empty prompt.
    Empty: <MonthCalendarPreview {...args} preview={buildCalendarPreview({
      frequency: 'WEEKLY',
      weekdays: [],
      startDate: '2026-09-01',
      endDate: '2026-09-30'
    }, SEASON)} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('In season').getByTestId('occurrence-count')).toBeInTheDocument();
    await expect(region('In season').queryByText(/outside the season/i)).not.toBeInTheDocument();
    await expect(region('Out of season').getByText(/outside the season/i)).toBeInTheDocument();
    await expect(region('Over cap').getByText(/over 200 events/i)).toBeInTheDocument();
    await expect(region('Empty').getByText(/No dates yet/i)).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m=[`Gallery`]})))()}h();export{p as Gallery,m as __namedExportsOrder,f as default};