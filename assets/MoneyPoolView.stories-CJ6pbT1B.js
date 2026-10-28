import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./iframe-Bx1ifuQg.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-DUXBP51x.js";import{n as o,t as s}from"./MoneyPoolView-MWMyMoYM.js";import{n as c,t as l}from"./button-Ce8-U6t7.js";var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{c(),i(),n(),o(),u=r(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p=[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}],m={title:`widgets/money-pool/MoneyPoolView`,component:s,args:{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,payments:p,beerPrice:270,beerCount:69,canTopUp:!0,topUp:(0,u.jsx)(l,{size:`lg`,children:`Top up`})}},h={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await d(f(e.getByRole(`region`,{name:`Balance`})).getByText(/187,50/)).toBeInTheDocument();let t=f(e.getByRole(`region`,{name:`Beer Counter`}));await d(t.getByText(`69 beers`)).toBeInTheDocument(),await d(t.getByText(/The pool balance covers 69 beers at .*2,70 each\./)).toBeInTheDocument();let n=e.getByRole(`button`,{name:`Top up`}),r=e.getByRole(`region`,{name:`Balance`}),i=e.getByRole(`region`,{name:`Beer Counter`});await d(r.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy(),await d(n.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();let a=f(e.getByRole(`region`,{name:`Payments`}));await d(a.getByText(`Lisa de Vries`)).toBeInTheDocument(),await d(a.getAllByText(/Incoming/)).toHaveLength(2),await d(a.getByText(/Outgoing/)).toBeInTheDocument(),await d(a.getAllByText(`+`)[0]).toHaveAttribute(`aria-hidden`,`true`),await d(a.getByText(/20,00/)).toBeInTheDocument(),await d(a.getByText(`−`)).toHaveAttribute(`aria-hidden`,`true`),await d(a.getByText(/45,00/)).toBeInTheDocument()}},g={parameters:{chromatic:{modes:t}},render:e=>(0,u.jsx)(a,{items:{Loading:(0,u.jsx)(s,{...e,state:void 0,isLoading:!0}),Error:(0,u.jsx)(s,{...e,state:void 0,isError:!0}),Off:(0,u.jsx)(s,{...e,state:`Off`}),"Not connected (member)":(0,u.jsx)(s,{...e,state:`NotConnected`}),"Not connected (admin)":(0,u.jsx)(s,{...e,state:`NotConnected`,isAdmin:!0}),"Not connected (admin, connecting off)":(0,u.jsx)(s,{...e,state:`NotConnected`,isAdmin:!0,connectAvailable:!1}),"Not connected (admin, can connect)":(0,u.jsx)(s,{...e,state:`NotConnected`,isAdmin:!0,connectAvailable:!0}),Unavailable:(0,u.jsx)(s,{...e,state:`Unavailable`}),"No link (member)":(0,u.jsx)(s,{...e,state:`NotConnected`,canTopUp:!1}),"No link (admin)":(0,u.jsx)(s,{...e,state:`NotConnected`,canTopUp:!1,isAdmin:!0}),"No payments":(0,u.jsx)(s,{...e,payments:[]}),"Same-day duplicates":(0,u.jsx)(s,{...e,payments:[p[0],p[0]]}),"Missing balance":(0,u.jsx)(s,{...e,balance:void 0}),"No beer price":(0,u.jsx)(s,{...e,beerPrice:void 0,beerCount:void 0}),"Empty pool":(0,u.jsx)(s,{...e,balance:0,beerCount:0})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await d(t(`Loading`).getByRole(`status`)).toHaveTextContent(`Loading…`),await d(t(`Error`).getByRole(`alert`)).toHaveTextContent(/couldn't load/i),await d(t(`Off`).getByText(`The money pool is switched off for this team`)).toBeInTheDocument(),await d(t(`Not connected (member)`).getByText(/once an admin connects/i)).toBeInTheDocument(),await d(t(`Not connected (admin)`).getByText(/balance and payments of the team.s bunq account will show up here/i)).toBeInTheDocument(),await d(t(`Not connected (admin)`).queryByText(/coming soon/i)).not.toBeInTheDocument(),await d(t(`Not connected (admin, connecting off)`).getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument(),await d(t(`Not connected (admin, can connect)`).getByText(/connect the team.s bunq account in the team settings/i)).toBeInTheDocument(),await d(t(`Not connected (admin, can connect)`).queryByText(/coming soon/i)).not.toBeInTheDocument(),await d(t(`Unavailable`).getByText(`The pool is unavailable right now`)).toBeInTheDocument(),await d(t(`Not connected (member)`).getByRole(`button`,{name:`Top up`})).toBeInTheDocument(),await d(t(`Unavailable`).getByRole(`button`,{name:`Top up`})).toBeInTheDocument(),await d(t(`Off`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await d(t(`No link (member)`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await d(t(`No link (member)`).queryByText(/bunq\.me link/)).not.toBeInTheDocument(),await d(t(`No link (admin)`).queryByRole(`button`,{name:`Top up`})).not.toBeInTheDocument(),await d(t(`No link (admin)`).getByText(/Add the team.s bunq\.me link in the team settings/)).toBeInTheDocument(),await d(t(`No payments`).getByText(`No payments in this period.`)).toBeInTheDocument(),await d(t(`Same-day duplicates`).getAllByText(`Lisa de Vries`)).toHaveLength(2),await d(t(`Missing balance`).getByText(/couldn't load/i)).toBeInTheDocument(),await d(t(`No beer price`).queryByRole(`region`,{name:`Beer Counter`})).not.toBeInTheDocument(),await d(f(t(`Empty pool`).getByRole(`region`,{name:`Beer Counter`})).getByText(`0 beers`)).toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    'Not connected (admin, connecting off)': <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable={false} />,
    'Not connected (admin, can connect)': <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable />,
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
    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…');
    await expect(region('Error').getByRole('alert')).toHaveTextContent(/couldn't load/i);
    await expect(region('Off').getByText('The money pool is switched off for this team')).toBeInTheDocument();
    await expect(region('Not connected (member)').getByText(/once an admin connects/i)).toBeInTheDocument();
    // Until the connection status is known (or when it could not be read) the admin copy promises nothing.
    await expect(region('Not connected (admin)').getByText(/balance and payments of the team.s bunq account will show up here/i)).toBeInTheDocument();
    await expect(region('Not connected (admin)').queryByText(/coming soon/i)).not.toBeInTheDocument();
    await expect(region('Not connected (admin, connecting off)').getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument();
    await expect(region('Not connected (admin, can connect)').getByText(/connect the team.s bunq account in the team settings/i)).toBeInTheDocument();
    await expect(region('Not connected (admin, can connect)').queryByText(/coming soon/i)).not.toBeInTheDocument();
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
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`]})))()}v();export{h as Data,g as Shells,_ as __namedExportsOrder,m as default};