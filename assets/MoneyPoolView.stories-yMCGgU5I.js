import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-DnPB3fG0.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-DUXBP51x.js";import{n as o,t as s}from"./MoneyPoolView-CD8sHjJE.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{i(),n(),o(),c=r(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d=[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}],f={title:`widgets/money-pool/MoneyPoolView`,component:s,args:{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,payments:d,beerPrice:270,beerCount:69}},p={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(u(e.getByRole(`region`,{name:`Balance`})).getByText(/187,50/)).toBeInTheDocument();let t=u(e.getByRole(`region`,{name:`Beer Counter`}));await l(t.getByText(`69 beers`)).toBeInTheDocument(),await l(t.getByText(/The pool balance covers 69 beers at .*2,70 each\./)).toBeInTheDocument();let n=u(e.getByRole(`region`,{name:`Payments`}));await l(n.getByText(`Lisa de Vries`)).toBeInTheDocument(),await l(n.getAllByText(/Incoming/)).toHaveLength(2),await l(n.getByText(/Outgoing/)).toBeInTheDocument(),await l(n.getAllByText(`+`)[0]).toHaveAttribute(`aria-hidden`,`true`),await l(n.getByText(/20,00/)).toBeInTheDocument(),await l(n.getByText(`−`)).toHaveAttribute(`aria-hidden`,`true`),await l(n.getByText(/45,00/)).toBeInTheDocument()}},m={parameters:{chromatic:{modes:t}},render:e=>(0,c.jsx)(a,{items:{Loading:(0,c.jsx)(s,{...e,state:void 0,isLoading:!0}),Error:(0,c.jsx)(s,{...e,state:void 0,isError:!0}),Off:(0,c.jsx)(s,{...e,state:`Off`}),"Not connected (member)":(0,c.jsx)(s,{...e,state:`NotConnected`}),"Not connected (admin)":(0,c.jsx)(s,{...e,state:`NotConnected`,isAdmin:!0}),Unavailable:(0,c.jsx)(s,{...e,state:`Unavailable`}),"No payments":(0,c.jsx)(s,{...e,payments:[]}),"Same-day duplicates":(0,c.jsx)(s,{...e,payments:[d[0],d[0]]}),"Missing balance":(0,c.jsx)(s,{...e,balance:void 0}),"No beer price":(0,c.jsx)(s,{...e,beerPrice:void 0,beerCount:void 0}),"Empty pool":(0,c.jsx)(s,{...e,balance:0,beerCount:0})}}),play:async({canvas:e})=>{let t=t=>u(e.getByRole(`region`,{name:t}));await l(t(`Loading`).getByRole(`status`)).toHaveTextContent(`Loading…`),await l(t(`Error`).getByRole(`alert`)).toHaveTextContent(/couldn't load/i),await l(t(`Off`).getByText(`The money pool is switched off for this team`)).toBeInTheDocument(),await l(t(`Not connected (member)`).getByText(/once an admin connects/i)).toBeInTheDocument(),await l(t(`Not connected (admin)`).getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument(),await l(t(`Unavailable`).getByText(`The pool is unavailable right now`)).toBeInTheDocument(),await l(t(`No payments`).getByText(`No payments in this period.`)).toBeInTheDocument(),await l(t(`Same-day duplicates`).getAllByText(`Lisa de Vries`)).toHaveLength(2),await l(t(`Missing balance`).getByText(/couldn't load/i)).toBeInTheDocument(),await l(t(`No beer price`).queryByRole(`region`,{name:`Beer Counter`})).not.toBeInTheDocument(),await l(u(t(`Empty pool`).getByRole(`region`,{name:`Beer Counter`})).getByText(`0 beers`)).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
    await expect(beers.getByText(/The pool balance covers 69 beers at .*2,70 each\\./)).toBeInTheDocument();
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
  // Carries the dark-mode baseline for every pool state.
  parameters: {
    chromatic: {
      modes: darkMode
    }
  },
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
    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…');
    await expect(region('Error').getByRole('alert')).toHaveTextContent(/couldn't load/i);
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
}`,...m.parameters?.docs?.source}}},h=[`Data`,`Shells`]})))()}g();export{p as Data,m as Shells,h as __namedExportsOrder,f as default};