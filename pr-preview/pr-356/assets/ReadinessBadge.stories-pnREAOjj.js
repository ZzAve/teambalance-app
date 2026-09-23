import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./app-column-decorator-Pc02WrXN.js";import{r as i,s as a,t as o}from"./event-fixtures-CuRrQuRB.js";import{n as s,t as c}from"./ReadinessBadge-RdMfEQtn.js";var l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),s(),l=t(),{expect:u,within:d}=__STORYBOOK_MODULE_TEST__,f={covered:{roster:a({state:`LINEUP_SET`,openSlots:0,positions:[]})},short:{roster:a({state:`SPOTS_OPEN`,positions:[{id:`p`,label:`Setter`,required:2,attending:1,kind:`PLAYING`}]})},critical:{roster:a({state:`CRITICAL`,positions:[{id:`p`,label:`Libero`,required:1,attending:0,kind:`PLAYING`}]})},headcountFallbackOff:{roster:a({...o,totalAttending:8})},headcountFallbackTallyOnly:{roster:a({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},pending:{roster:a({state:`LINEUP_SET`,openSlots:0,positions:[]}),pending:!0},headcountFallbackWithStaff:{roster:a({state:`TALLY_ONLY`,totalTarget:void 0,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})}},p={title:`entities/event/ReadinessBadge`,component:c,...r},m={args:f.covered,render:()=>(0,l.jsx)(`div`,{className:`flex flex-wrap gap-4`,children:Object.entries(f).map(([e,t])=>(0,l.jsx)(`div`,{"data-testid":`variant-${e}`,className:`flex items-center justify-end rounded-md border border-border bg-card p-3.5`,children:(0,l.jsx)(c,{...t})},e))}),play:async({canvas:e})=>{let t=t=>d(e.getByTestId(`variant-${t}`));await u(t(`covered`).getByText(`Lineup set`)).toBeInTheDocument(),await u(t(`short`).getByText(`1 spot open`)).toBeInTheDocument(),await u(t(`critical`).getByText(`Missing a position`)).toBeInTheDocument(),await u(t(`headcountFallbackOff`).getByText(`8 going`)).toBeInTheDocument(),await u(t(`headcountFallbackTallyOnly`).getByText(`5 going`)).toBeInTheDocument();let n=t(`pending`).getByText(`Lineup set`);await u(n).toBeInTheDocument(),await u(n).toHaveAttribute(`aria-busy`,`true`),await u(t(`headcountFallbackWithStaff`).getByText(/11 going \+1 staff/)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.covered,
  render: () => <div className="flex flex-wrap gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`} className="flex items-center justify-end rounded-md border border-border bg-card p-3.5">
          <ReadinessBadge {...props} />
        </div>)}
    </div>,
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
}`,...m.parameters?.docs?.source}}},h=[`Gallery`]})))()}g();export{m as Gallery,h as __namedExportsOrder,p as default};