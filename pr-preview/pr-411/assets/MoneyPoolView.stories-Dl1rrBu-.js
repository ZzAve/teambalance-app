import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./MoneyPoolView-BWwIH_yZ.js";import{n as o,t as s}from"./button-BqTmlbIE.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{o(),n(),i(),c=t(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d=[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}],f={title:`widgets/money-pool/MoneyPoolView`,component:a,args:{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,payments:d,beerPrice:270,beerCount:69,canTopUp:!0,topUp:(0,c.jsx)(s,{children:`Top up`})}},p={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(u(e.getByRole(`region`,{name:`Balance`})).getByText(/187,50/)).toBeInTheDocument();let t=u(e.getByRole(`region`,{name:`Beer Counter`}));await l(t.getByText(`69 beers`)).toBeInTheDocument(),await l(t.getByText(/At .*2,70 a beer/)).toBeInTheDocument();let n=e.getByRole(`button`,{name:`Top up`}),r=e.getByRole(`region`,{name:`Balance`}),i=e.getByRole(`region`,{name:`Beer Counter`});await l(r.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy(),await l(n.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();let a=u(e.getByRole(`region`,{name:`Payments`}));await l(a.getByText(`Lisa de Vries`)).toBeInTheDocument(),await l(a.getAllByText(/Incoming/)).toHaveLength(2),await l(a.getByText(/Outgoing/)).toBeInTheDocument(),await l(a.getAllByText(`+`)[0]).toHaveAttribute(`aria-hidden`,`true`),await l(a.getByText(/20,00/)).toBeInTheDocument(),await l(a.getByText(`−`)).toHaveAttribute(`aria-hidden`,`true`),await l(a.getByText(/45,00/)).toBeInTheDocument()}},m={render:e=>(0,c.jsx)(r,{items:{Loading:(0,c.jsx)(a,{...e,state:void 0,isLoading:!0}),Error:(0,c.jsx)(a,{...e,state:void 0,isError:!0}),Off:(0,c.jsx)(a,{...e,state:`Off`}),"Not connected (member)":(0,c.jsx)(a,{...e,state:`NotConnected`}),"Not connected (admin)":(0,c.jsx)(a,{...e,state:`NotConnected`,isAdmin:!0}),Unavailable:(0,c.jsx)(a,{...e,state:`Unavailable`}),"No link (member)":(0,c.jsx)(a,{...e,state:`NotConnected`,canTopUp:!1}),"No link (admin)":(0,c.jsx)(a,{...e,state:`NotConnected`,canTopUp:!1,isAdmin:!0}),"No payments":(0,c.jsx)(a,{...e,payments:[]}),"Same-day duplicates":(0,c.jsx)(a,{...e,payments:[d[0],d[0]]}),"Missing balance":(0,c.jsx)(a,{...e,balance:void 0}),"No beer price":(0,c.jsx)(a,{...e,beerPrice:void 0,beerCount:void 0}),"Empty pool":(0,c.jsx)(a,{...e,balance:0,beerCount:0})}}),play:async({canvas:e})=>{let t=t=>u(e.getByRole(`region`,{name:t}));await l(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await l(t(`Error`).getByText(/couldn't load/i)).toBeInTheDocument(),await l(t(`Off`).getByText(`The money pool is switched off for this team`)).toBeInTheDocument(),await l(t(`Not connected (member)`).getByText(/once an admin connects/i)).toBeInTheDocument(),await l(t(`Not connected (admin)`).getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument(),await l(t(`Unavailable`).getByText(`The pool is unavailable right now`)).toBeInTheDocument(),await l(t(`Not connected (member)`).getByRole(`button`,{name:`Top up`})).toBeInTheDocument(),await l(t(`Unavailable`).getByRole(`button`,{name:`Top up`})).toBeInTheDocument(),await l(t(`Off`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await l(t(`No link (member)`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await l(t(`No link (member)`).queryByText(/bunq\.me link/)).not.toBeInTheDocument(),await l(t(`No link (admin)`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await l(t(`No link (admin)`).getByText(/Add the team.s bunq\.me link in the team settings/)).toBeInTheDocument(),await l(t(`No payments`).getByText(`No payments in this period.`)).toBeInTheDocument(),await l(t(`Same-day duplicates`).getAllByText(`Lisa de Vries`)).toHaveLength(2),await l(t(`Missing balance`).getByText(/couldn't load/i)).toBeInTheDocument(),await l(t(`No beer price`).queryByRole(`region`,{name:`Beer Counter`})).not.toBeInTheDocument(),await l(u(t(`Empty pool`).getByRole(`region`,{name:`Beer Counter`})).getByText(`0 beers`)).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
    // The button sits between the Balance card and the Beer Counter.
    const topUp = canvas.getByRole('button', {
      name: 'Top up'
    });
    const balanceCard = canvas.getByRole('region', {
      name: 'Balance'
    });
    const beerCard = canvas.getByRole('region', {
      name: 'Beer Counter'
    });
    await expect(balanceCard.compareDocumentPosition(topUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(topUp.compareDocumentPosition(beerCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MoneyPoolView {...args} state={undefined} isLoading />,
    Error: <MoneyPoolView {...args} state={undefined} isError />,
    Off: <MoneyPoolView {...args} state="Off" />,
    'Not connected (member)': <MoneyPoolView {...args} state="NotConnected" />,
    'Not connected (admin)': <MoneyPoolView {...args} state="NotConnected" isAdmin />,
    Unavailable: <MoneyPoolView {...args} state="Unavailable" />,
    'No link (member)': <MoneyPoolView {...args} state="NotConnected" canTopUp={false} />,
    'No link (admin)': <MoneyPoolView {...args} state="NotConnected" canTopUp={false} isAdmin />,
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
    // Paying through bunq.me needs no Bunq Connection, so Top up shows in every state but Off.
    await expect(region('Not connected (member)').getByRole('button', {
      name: 'Top up'
    })).toBeInTheDocument();
    await expect(region('Unavailable').getByRole('button', {
      name: 'Top up'
    })).toBeInTheDocument();
    await expect(region('Off').queryByRole('button', {
      name: 'Top up'
    })).not.toBeInTheDocument();
    await expect(region('No link (member)').queryByRole('button', {
      name: 'Top up'
    })).not.toBeInTheDocument();
    await expect(region('No link (member)').queryByText(/bunq\\.me link/)).not.toBeInTheDocument();
    await expect(region('No link (admin)').queryByRole('button', {
      name: 'Top up'
    })).not.toBeInTheDocument();
    await expect(region('No link (admin)').getByText(/Add the team.s bunq\\.me link in the team settings/)).toBeInTheDocument();
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
}`,...m.parameters?.docs?.source}}},h=[`Data`,`Shells`]})))()}g();export{p as Data,m as Shells,h as __namedExportsOrder,f as default};