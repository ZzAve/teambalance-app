import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,s as r,t as i}from"./event-fixtures-CuRrQuRB.js";import{n as a,t as o}from"./ReadinessBadge-BMj7OgHN.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),a(),s=t(),{expect:c,within:l}=__STORYBOOK_MODULE_TEST__,u={covered:{roster:r({state:`LINEUP_SET`,openSlots:0,positions:[]})},short:{roster:r({state:`SPOTS_OPEN`,positions:[{id:`p`,label:`Setter`,required:2,attending:1,kind:`PLAYING`}]})},critical:{roster:r({state:`CRITICAL`,positions:[{id:`p`,label:`Libero`,required:1,attending:0,kind:`PLAYING`}]})},headcountFallbackOff:{roster:r({...i,totalAttending:8})},headcountFallbackTallyOnly:{roster:r({state:`TALLY_ONLY`,openSlots:0,totalAttending:5,positions:[]})},pending:{roster:r({state:`LINEUP_SET`,openSlots:0,positions:[]}),pending:!0},headcountFallbackWithStaff:{roster:r({state:`TALLY_ONLY`,totalTarget:void 0,totalAttending:12,positions:[{id:`pos-setter`,label:`Setter`,required:void 0,attending:11,kind:`PLAYING`},{id:`pos-trainer`,label:`Trainer`,required:void 0,attending:1,kind:`STAFF`}]})}},d={title:`entities/event/ReadinessBadge`,component:o},f={args:u.covered,render:()=>(0,s.jsx)(`div`,{className:`flex flex-wrap gap-4`,children:Object.entries(u).map(([e,t])=>(0,s.jsx)(`div`,{"data-testid":`variant-${e}`,className:`flex max-w-xs items-center justify-end rounded-xl border border-border bg-card p-3.5`,children:(0,s.jsx)(o,{...t})},e))}),play:async({canvas:e})=>{let t=t=>l(e.getByTestId(`variant-${t}`));await c(t(`covered`).getByText(`Lineup set`)).toBeInTheDocument(),await c(t(`short`).getByText(`1 spot open`)).toBeInTheDocument(),await c(t(`critical`).getByText(`Missing a position`)).toBeInTheDocument(),await c(t(`headcountFallbackOff`).getByText(`8 going`)).toBeInTheDocument(),await c(t(`headcountFallbackTallyOnly`).getByText(`5 going`)).toBeInTheDocument();let n=t(`pending`).getByText(`Lineup set`);await c(n).toBeInTheDocument(),await c(n).toHaveAttribute(`aria-busy`,`true`),await c(t(`headcountFallbackWithStaff`).getByText(/11 going \+1 staff/)).toBeInTheDocument()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.covered,
  render: () => <div className="flex flex-wrap gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`} className="flex max-w-xs items-center justify-end rounded-xl border border-border bg-card p-3.5">
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
}`,...f.parameters?.docs?.source}}},p=[`Gallery`]})))()}m();export{f as Gallery,p as __namedExportsOrder,d as default};