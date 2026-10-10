import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{r as i,t as a}from"./app-column-decorator-BvduiEb8.js";import{r as o,s,t as c}from"./event-fixtures-C1ds5yXh.js";import{n as l,t as u}from"./ReadinessBadge-BsCNyDtB.js";var d,f,p,m,h,g,_;function v(){return(v=e((()=>{i(),o(),n(),l(),d=t(),{expect:f,within:p}=__STORYBOOK_MODULE_TEST__,m={covered:{roster:s({state:`LINEUP_SET`,openSlots:0,positions:[]})},short:{roster:s({state:`SPOTS_OPEN`,positions:[{id:`p`,label:`Setter`,required:2,attending:1,kind:`PLAYING`}]})},critical:{roster:s({state:`CRITICAL`,positions:[{id:`p`,label:`Libero`,required:1,attending:0,kind:`PLAYING`}]})},headcountFallbackOff:{roster:s({...c,totalAttending:8})},headcountFallbackTallyOnly:{roster:s({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},pending:{roster:s({state:`LINEUP_SET`,openSlots:0,positions:[]}),pending:!0},headcountFallbackWithStaff:{roster:s({state:`TALLY_ONLY`,totalTarget:void 0,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})}},h={title:`entities/event/ReadinessBadge`,component:u,...a},g={args:m.covered,render:()=>(0,d.jsx)(r,{columns:`grid-cols-1`,items:Object.fromEntries(Object.entries(m).map(([e,t])=>[e,(0,d.jsx)(`div`,{"data-testid":`variant-${e}`,className:`flex items-center justify-end rounded-md border border-border bg-card p-3.5`,children:(0,d.jsx)(u,{...t})})]))}),play:async({canvas:e})=>{let t=t=>p(e.getByTestId(`variant-${t}`));await f(t(`covered`).getByText(`Lineup set`)).toBeInTheDocument(),await f(t(`short`).getByText(`1 spot open`)).toBeInTheDocument(),await f(t(`critical`).getByText(`Missing a position`)).toBeInTheDocument(),await f(t(`headcountFallbackOff`).getByText(`8 going`)).toBeInTheDocument(),await f(t(`headcountFallbackTallyOnly`).getByText(`5 going`)).toBeInTheDocument();let n=t(`pending`).getByText(`Lineup set`);await f(n).toBeInTheDocument(),await f(n).toHaveAttribute(`aria-busy`,`true`),await f(t(`headcountFallbackWithStaff`).getByText(/11 going \+1 staff/)).toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.covered,
  render: () => <Stack columns="grid-cols-1" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`} className="flex items-center justify-end rounded-md border border-border bg-card p-3.5">
            <ReadinessBadge {...props} />
          </div>]))} />,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(\`variant-\${name}\`));
    await expect(variant('covered').getByText('Lineup set')).toBeInTheDocument();
    await expect(variant('short').getByText('1 spot open')).toBeInTheDocument();
    await expect(variant('critical').getByText('Missing a position')).toBeInTheDocument();
    await expect(variant('headcountFallbackOff').getByText('8 going')).toBeInTheDocument();
    await expect(variant('headcountFallbackTallyOnly').getByText('5 going')).toBeInTheDocument();
    const pendingBadge = variant('pending').getByText('Lineup set');
    await expect(pendingBadge).toBeInTheDocument();
    await expect(pendingBadge).toHaveAttribute('aria-busy', 'true');
    await expect(variant('headcountFallbackWithStaff').getByText(/11 going \\+1 staff/)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_=[`Gallery`]})))()}v();export{g as Gallery,_ as __namedExportsOrder,h as default};