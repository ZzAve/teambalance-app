import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./MoneyPoolView-CrsF0wGB.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l=[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}],u={title:`widgets/money-pool/MoneyPoolView`,component:a,args:{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,payments:l,beerPrice:270,beerCount:69}},d={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await s(c(e.getByRole(`region`,{name:`Balance`})).getByText(/187,50/)).toBeInTheDocument();let t=c(e.getByRole(`region`,{name:`Beer Counter`}));await s(t.getByText(`69 beers`)).toBeInTheDocument(),await s(t.getByText(/At .*2,70 a beer/)).toBeInTheDocument();let n=c(e.getByRole(`region`,{name:`Payments`}));await s(n.getByText(`Lisa de Vries`)).toBeInTheDocument(),await s(n.getAllByText(/Incoming/)).toHaveLength(2),await s(n.getByText(/Outgoing/)).toBeInTheDocument(),await s(n.getAllByText(`+`)[0]).toHaveAttribute(`aria-hidden`,`true`),await s(n.getByText(/20,00/)).toBeInTheDocument(),await s(n.getByText(`−`)).toHaveAttribute(`aria-hidden`,`true`),await s(n.getByText(/45,00/)).toBeInTheDocument()}},f={render:e=>(0,o.jsx)(r,{items:{Loading:(0,o.jsx)(a,{...e,state:void 0,isLoading:!0}),Error:(0,o.jsx)(a,{...e,state:void 0,isError:!0}),Off:(0,o.jsx)(a,{...e,state:`Off`}),"Not connected (member)":(0,o.jsx)(a,{...e,state:`NotConnected`}),"Not connected (admin)":(0,o.jsx)(a,{...e,state:`NotConnected`,isAdmin:!0}),Unavailable:(0,o.jsx)(a,{...e,state:`Unavailable`}),"No payments":(0,o.jsx)(a,{...e,payments:[]}),"Same-day duplicates":(0,o.jsx)(a,{...e,payments:[l[0],l[0]]}),"Missing balance":(0,o.jsx)(a,{...e,balance:void 0}),"No beer price":(0,o.jsx)(a,{...e,beerPrice:void 0,beerCount:void 0}),"Empty pool":(0,o.jsx)(a,{...e,balance:0,beerCount:0})}}),play:async({canvas:e})=>{let t=t=>c(e.getByRole(`region`,{name:t}));await s(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await s(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument(),await s(t(`Off`).getByText(`The money pool is switched off for this team`)).toBeInTheDocument(),await s(t(`Not connected (member)`).getByText(/once an admin connects/i)).toBeInTheDocument(),await s(t(`Not connected (admin)`).getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument(),await s(t(`Unavailable`).getByText(`The pool is unavailable right now`)).toBeInTheDocument(),await s(t(`No payments`).getByText(`No payments in this period.`)).toBeInTheDocument(),await s(t(`Same-day duplicates`).getAllByText(`Lisa de Vries`)).toHaveLength(2),await s(t(`Missing balance`).getByText(/couldn't load/i)).toBeInTheDocument(),await s(t(`No beer price`).queryByRole(`region`,{name:`Beer Counter`})).not.toBeInTheDocument(),await s(c(t(`Empty pool`).getByRole(`region`,{name:`Beer Counter`})).getByText(`0 beers`)).toBeInTheDocument()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  // MoneyPageView's Data owns the connected picture (ADR-0032 §3).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(within(canvas.getByRole('region', {
      name: 'Balance'
    })).getByText(/187,50/)).toBeInTheDocument();
    const beers = within(canvas.getByRole('region', {
      name: 'Beer Counter'
    }));
    await expect(beers.getByText('69 beers')).toBeInTheDocument();
    await expect(beers.getByText(/At .*2,70 a beer/)).toBeInTheDocument();
    const payments = within(canvas.getByRole('region', {
      name: 'Payments'
    }));
    await expect(payments.getByText('Lisa de Vries')).toBeInTheDocument();
    await expect(payments.getAllByText(/Incoming/)).toHaveLength(2);
    await expect(payments.getByText(/Outgoing/)).toBeInTheDocument();
    // The sign is visual only; screen readers get the direction from the sr-only text.
    await expect(payments.getAllByText('+')[0]).toHaveAttribute('aria-hidden', 'true');
    await expect(payments.getByText(/20,00/)).toBeInTheDocument();
    await expect(payments.getByText('−')).toHaveAttribute('aria-hidden', 'true');
    await expect(payments.getByText(/45,00/)).toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MoneyPoolView {...args} state={undefined} isLoading />,
    Error: <MoneyPoolView {...args} state={undefined} isError />,
    Off: <MoneyPoolView {...args} state="Off" />,
    'Not connected (member)': <MoneyPoolView {...args} state="NotConnected" />,
    'Not connected (admin)': <MoneyPoolView {...args} state="NotConnected" isAdmin />,
    Unavailable: <MoneyPoolView {...args} state="Unavailable" />,
    'No payments': <MoneyPoolView {...args} payments={[]} />,
    'Same-day duplicates': <MoneyPoolView {...args} payments={[PAYMENTS[0], PAYMENTS[0]]} />,
    'Missing balance': <MoneyPoolView {...args} balance={undefined} />,
    'No beer price': <MoneyPoolView {...args} beerPrice={undefined} beerCount={undefined} />,
    'Empty pool': <MoneyPoolView {...args} balance={0} beerCount={0} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument();
    await expect(region('Off').getByText('The money pool is switched off for this team')).toBeInTheDocument();
    await expect(region('Not connected (member)').getByText(/once an admin connects/i)).toBeInTheDocument();
    await expect(region('Not connected (admin)').getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument();
    await expect(region('Unavailable').getByText('The pool is unavailable right now')).toBeInTheDocument();
    await expect(region('No payments').getByText('No payments in this period.')).toBeInTheDocument();
    await expect(region('Same-day duplicates').getAllByText('Lisa de Vries')).toHaveLength(2);
    await expect(region('Missing balance').getByText(/couldn't load/i)).toBeInTheDocument();
    await expect(region('No beer price').queryByRole('region', {
      name: 'Beer Counter'
    })).not.toBeInTheDocument();
    await expect(within(region('Empty pool').getByRole('region', {
      name: 'Beer Counter'
    })).getByText('0 beers')).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p=[`Data`,`Shells`]})))()}m();export{d as Data,f as Shells,p as __namedExportsOrder,u as default};