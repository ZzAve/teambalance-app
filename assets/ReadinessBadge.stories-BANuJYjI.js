import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,r as n,t as r}from"./event-fixtures-GLq-GGnS.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./ReadinessBadge-zWCaBMXq.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),a(),s=i(),{expect:c}=__STORYBOOK_MODULE_TEST__,l={title:`entities/event/ReadinessBadge`,component:o,decorators:[e=>(0,s.jsx)(`div`,{className:`flex max-w-xs items-center justify-end rounded-xl border border-border bg-card p-3.5`,children:(0,s.jsx)(e,{})})]},u={args:{roster:t({state:`LINEUP_SET`,openSlots:0,positions:[]})},play:async({canvas:e})=>{await c(e.getByText(`Lineup set`)).toBeInTheDocument()}},d={args:{roster:t({state:`SPOTS_OPEN`,positions:[{id:`p`,label:`Setter`,required:2,attending:1}]})},play:async({canvas:e})=>{await c(e.getByText(`1 spot open`)).toBeInTheDocument()}},f={args:{roster:t({state:`CRITICAL`,positions:[{id:`p`,label:`Libero`,required:1,attending:0}]})},play:async({canvas:e})=>{await c(e.getByText(`1 spot open`)).toBeInTheDocument()}},p={args:{roster:{...r,totalAttending:8}},play:async({canvas:e})=>{await c(e.getByText(`8 going`)).toBeInTheDocument()}},m={args:{roster:t({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},play:async({canvas:e})=>{await c(e.getByText(`5 going`)).toBeInTheDocument()}},h={args:{roster:t({state:`LINEUP_SET`,openSlots:0,positions:[]}),pending:!0},play:async({canvas:e})=>{let t=e.getByText(`Lineup set`);await c(t).toBeInTheDocument(),await c(t).toHaveAttribute(`aria-busy`,`true`)}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'LINEUP_SET',
      openSlots: 0,
      positions: []
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      positions: [{
        id: 'p',
        label: 'Setter',
        required: 2,
        attending: 1
      }]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      positions: [{
        id: 'p',
        label: 'Libero',
        required: 1,
        attending: 0
      }]
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    roster: {
      ...NO_ROSTER,
      totalAttending: 8
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalAttending: 5,
      positions: []
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('5 going')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      state: 'LINEUP_SET',
      openSlots: 0,
      positions: []
    }),
    pending: true
  },
  play: async ({
    canvas
  }) => {
    const badge = canvas.getByText('Lineup set');
    await expect(badge).toBeInTheDocument();
    await expect(badge).toHaveAttribute('aria-busy', 'true');
  }
}`,...h.parameters?.docs?.source}}},g=[`Covered`,`Short`,`Critical`,`HeadcountFallbackOff`,`HeadcountFallbackTallyOnly`,`Pending`]})))()}_();export{u as Covered,f as Critical,p as HeadcountFallbackOff,m as HeadcountFallbackTallyOnly,h as Pending,d as Short,g as __namedExportsOrder,l as default};