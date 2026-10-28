import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,n,r}from"./iframe-BBRdzbA7.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./button-AKCGabB4.js";function l({connected:e,accountPicked:t,disconnected:n,accounts:r,result:i,focusResult:a,isConnecting:o,error:s,onConnect:l}){let p=n?void 0:i,m=(0,d.useId)(),_=(0,d.useId)(),[v,y]=(0,d.useState)(!1),[b,x]=(0,d.useState)(!1),S=(0,d.useRef)(null);(0,d.useEffect)(()=>{a&&p&&S.current?.focus({preventScroll:!0})},[a,p]),(0,d.useEffect)(()=>{n&&!e&&S.current?.focus()},[n,e]);let C=p===`error`,w=C?``:u(p,e,t,n),T=!e||b||!!o,E=v||!!o;return(0,f.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Connect Bunq`}),!e&&(0,f.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Show the balance and payments of the team’s Bunq account on the Money page.`})]}),(0,f.jsx)(`p`,{ref:C?void 0:S,role:`status`,tabIndex:-1,className:`text-small font-semibold outline-none empty:sr-only`,children:w}),C&&(0,f.jsx)(`p`,{ref:S,role:`alert`,tabIndex:-1,className:`${g} outline-none`,children:h}),e&&r,e&&(0,f.jsx)(c,{variant:`link`,size:`sm`,className:`self-start px-0 underline`,"aria-expanded":T,"aria-controls":T?_:void 0,disabled:o,onClick:()=>{b&&y(!1),x(!b)},children:`Connect a different bunq login`}),T&&(0,f.jsxs)(`div`,{id:_,className:`flex flex-col gap-4`,children:[(0,f.jsxs)(`label`,{className:`flex min-h-11 items-start gap-3 py-2 text-small leading-relaxed`,children:[(0,f.jsx)(`input`,{type:`checkbox`,checked:E,disabled:o,onChange:e=>y(e.target.checked),className:`mt-0.5 size-5 shrink-0 accent-primary`}),(0,f.jsx)(`span`,{children:`Connecting gives TeamBalance bunq’s standard app access to this bunq login, which is more than reading: bunq’s default grant also allows creating payments and draft payments. TeamBalance only reads the balance and payments of the one account you pick and stores no payment data. Every member of this team will see the balance and the names, dates and amounts of payments on that account. You can disconnect in TeamBalance at any time, which deletes the access it stored; to withdraw the grant at bunq itself, remove TeamBalance under connected apps in the bunq app.`})]}),s&&(0,f.jsx)(`p`,{role:`alert`,className:g,children:s}),(0,f.jsxs)(`div`,{className:`flex flex-col items-start gap-2`,children:[(0,f.jsx)(c,{disabled:!v||o,"aria-describedby":E?void 0:m,onClick:l,children:o?`Opening Bunq…`:e?`Connect again`:`Connect Bunq`}),!E&&(0,f.jsx)(`p`,{id:m,className:`text-caption text-muted-foreground`,children:`Tick the box above to continue.`})]})]})]})}function u(e,t,n,r){return e===`declined`?p:t?n?`Connected to bunq.`:`Connected, pick an account below.`:r?m:``}var d,f,p,m,h,g;function _(){return(_=e((()=>{d=t(),s(),f=i(),p=`You declined at Bunq, so nothing was connected.`,m=`Disconnected from bunq.`,h=`Couldn’t connect Bunq. Please try again.`,g=`rounded-lg bg-card p-3 text-small text-red-ink`,l.__docgenInfo={description:`Presentational "connect Bunq" section for the team settings: what connecting grants, a tick to
acknowledge it, and the Connect button that stays disabled until it is ticked. Owns only the tick and
whether a connected team has opened the form to connect another login. A connected team sees its
status and the account picker instead, with the form behind a text button.
A declined trip is the Admin's choice and reads as plain status; only a failure is an alert. The
status line is mounted before it has anything to say; when the page was opened by Bunq's return the
result also takes focus, so a screen reader reads it even though it arrived with the page.`,methods:[],displayName:`ConnectBunqView`,props:{connected:{required:!0,tsType:{name:`boolean`},description:`The team already has a Bunq connection; connecting again replaces it.`},accountPicked:{required:!1,tsType:{name:`boolean`},description:`The Admin picked the account the Money page reads. Only meaningful while connected.`},disconnected:{required:!1,tsType:{name:`boolean`},description:`The Admin just disconnected: the status says so and takes focus, since the controls they used are gone.`},accounts:{required:!1,tsType:{name:`ReactNode`},description:`The account picker and Disconnect, supplied by the ConnectBunq container so this View stays prop-only. Shown while connected.`},result:{required:!1,tsType:{name:`union`,raw:`'connected' | 'declined' | 'error'`,elements:[{name:`literal`,value:`'connected'`},{name:`literal`,value:`'declined'`},{name:`literal`,value:`'error'`}]},description:``},focusResult:{required:!1,tsType:{name:`boolean`},description:`Move focus to the result on mount: the page was opened by Bunq's return, at the top of a long page.`},isConnecting:{required:!1,tsType:{name:`boolean`},description:`The start request is in flight, or the browser is on its way to Bunq.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The start request failed, shown inline.`},onConnect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{a(),r(),_(),v=i(),{expect:y,fn:b,within:x}=__STORYBOOK_MODULE_TEST__,S=(0,v.jsx)(`p`,{children:`Accounts and Disconnect`}),C={title:`features/connect-bunq/ConnectBunqView`,component:l,args:{connected:!1,onConnect:b()}},w={play:async({canvas:e})=>{await y(e.getByRole(`heading`,{name:`Connect Bunq`})).toBeInTheDocument(),await y(e.getByLabelText(/Connecting gives TeamBalance bunq’s standard app access/)).not.toBeChecked(),await y(e.getByText(/bunq’s default grant also allows creating payments and draft payments/)).toBeInTheDocument(),await y(e.getByText(/You can disconnect in TeamBalance at any time, which deletes the access it stored/)).toBeInTheDocument();let t=e.getByRole(`button`,{name:`Connect Bunq`});await y(t).toBeDisabled(),await y(t).toHaveAccessibleDescription(`Tick the box above to continue.`),await y(e.getByRole(`status`)).toBeEmptyDOMElement()}},T={parameters:{chromatic:{modes:n}},render:e=>(0,v.jsx)(o,{items:{"Connected, no pick":(0,v.jsx)(l,{...e,connected:!0,accounts:S,result:`connected`}),"Connected, picked":(0,v.jsx)(l,{...e,connected:!0,accountPicked:!0,accounts:S}),Disconnected:(0,v.jsx)(l,{...e,disconnected:!0}),"Disconnected, stale declined":(0,v.jsx)(l,{...e,disconnected:!0,result:`declined`}),"Disconnected, stale failure":(0,v.jsx)(l,{...e,disconnected:!0,result:`error`}),"Failed, connected":(0,v.jsx)(l,{...e,connected:!0,accountPicked:!0,accounts:S,result:`error`}),Connecting:(0,v.jsx)(l,{...e,isConnecting:!0}),"Start failed":(0,v.jsx)(l,{...e,error:`Couldn’t open Bunq. Please try again.`}),Declined:(0,v.jsx)(l,{...e,result:`declined`}),Failed:(0,v.jsx)(l,{...e,result:`error`})}}),play:async({canvas:e})=>{let t=t=>x(e.getByRole(`region`,{name:t}));await y(t(`Connected, no pick`).getByRole(`status`)).toHaveTextContent(`Connected, pick an account below.`),await y(t(`Connected, picked`).getByRole(`status`)).toHaveTextContent(`Connected to bunq.`);for(let e of[`Connected, no pick`,`Connected, picked`]){await y(t(e).getByText(`Accounts and Disconnect`)).toBeInTheDocument(),await y(t(e).queryByRole(`checkbox`)).not.toBeInTheDocument(),await y(t(e).queryByRole(`button`,{name:`Connect again`})).not.toBeInTheDocument();let n=t(e).getByRole(`button`,{name:`Connect a different bunq login`});await y(n).toBeEnabled(),await y(n).toHaveAttribute(`aria-expanded`,`false`),await y(n).toHaveStyle({textDecorationLine:`underline`})}await y(t(`Disconnected`).getByRole(`status`)).toHaveTextContent(`Disconnected from bunq.`),await y(t(`Disconnected`).getByRole(`button`,{name:`Connect Bunq`})).toBeDisabled();for(let e of[`Disconnected, stale declined`,`Disconnected, stale failure`])await y(t(e).getByRole(`status`)).toHaveTextContent(`Disconnected from bunq.`),await y(t(e).queryByRole(`alert`)).not.toBeInTheDocument(),await y(t(e).queryByText(/You declined at Bunq/)).not.toBeInTheDocument();await y(t(`Disconnected, stale failure`).getByRole(`status`)).toHaveFocus(),await y(t(`Failed, connected`).getByRole(`alert`)).toHaveTextContent(`Couldn’t connect Bunq.`),await y(t(`Failed, connected`).getByRole(`status`)).toBeEmptyDOMElement(),await y(t(`Connecting`).getByRole(`button`,{name:`Opening Bunq…`})).toBeDisabled(),await y(t(`Connecting`).getByRole(`checkbox`)).toBeChecked(),await y(t(`Connecting`).getByRole(`checkbox`)).toBeDisabled(),await y(t(`Connecting`).queryByText(`Tick the box above to continue.`)).not.toBeInTheDocument(),await y(t(`Start failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t open Bunq. Please try again.`);let n=t(`Declined`).getByRole(`status`);await y(n).toHaveTextContent(`You declined at Bunq, so nothing was connected.`),await y(n).not.toHaveClass(`text-red-ink`),await y(t(`Declined`).queryByRole(`alert`)).not.toBeInTheDocument(),await y(t(`Failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t connect Bunq. Please try again.`),await y(t(`Failed`).getByRole(`alert`)).toHaveClass(`text-red-ink`),await y(t(`Failed`).getByRole(`status`)).toBeEmptyDOMElement()}},E={parameters:{chromatic:{disableSnapshot:!0}},args:{result:`declined`},render:e=>(0,v.jsx)(o,{items:{"First connect":(0,v.jsx)(l,{...e,focusResult:!0}),Reconnect:(0,v.jsx)(l,{...e,result:void 0,connected:!0,accountPicked:!0,accounts:S})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=x(e.getByRole(`region`,{name:`First connect`})),i=r.getByRole(`checkbox`,{name:/Connecting gives TeamBalance bunq’s standard app access/}),a=r.getByRole(`button`,{name:`Connect Bunq`});await y(r.getByRole(`status`)).toHaveFocus(),await y(a).toBeDisabled(),await y(n.onConnect).not.toHaveBeenCalled(),await t.click(i),await y(i).toBeChecked(),await y(a).toBeEnabled(),await y(r.queryByText(`Tick the box above to continue.`)).not.toBeInTheDocument(),await t.click(a),await y(n.onConnect).toHaveBeenCalledTimes(1),await t.click(i),await y(a).toBeDisabled(),await y(a).toHaveAccessibleDescription(`Tick the box above to continue.`);let o=x(e.getByRole(`region`,{name:`Reconnect`})),s=o.getByRole(`button`,{name:`Connect a different bunq login`});await t.click(s),await y(s).toHaveFocus(),await y(s).toHaveAttribute(`aria-expanded`,`true`),await y(s).toHaveAttribute(`aria-controls`,o.getByRole(`checkbox`).closest(`[id]`).id);let c=o.getByRole(`button`,{name:`Connect again`});await y(c).toBeDisabled(),await y(o.getByRole(`checkbox`)).not.toBeChecked(),await t.click(o.getByRole(`checkbox`)),await t.click(c),await y(n.onConnect).toHaveBeenCalledTimes(2),await t.click(s),await y(s).toHaveAttribute(`aria-expanded`,`false`),await y(o.queryByRole(`checkbox`)).not.toBeInTheDocument(),await t.click(s),await y(o.getByRole(`checkbox`)).not.toBeChecked(),await y(o.getByRole(`button`,{name:`Connect again`})).toBeDisabled()}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Connect Bunq'
    })).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Connecting gives TeamBalance bunq’s standard app access/)).not.toBeChecked();
    await expect(canvas.getByText(/bunq’s default grant also allows creating payments and draft payments/)).toBeInTheDocument();
    await expect(canvas.getByText(/You can disconnect in TeamBalance at any time, which deletes the access it stored/)).toBeInTheDocument();
    const connect = canvas.getByRole('button', {
      name: 'Connect Bunq'
    });
    await expect(connect).toBeDisabled();
    // The reason is on the page and tied to the button.
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.');
    // The status line is mounted before it has anything to say, so a result is announced when it appears.
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      modes: darkMode
    }
  },
  render: args => <Stack items={{
    'Connected, no pick': <ConnectBunqView {...args} connected accounts={ACCOUNTS_SLOT} result="connected" />,
    'Connected, picked': <ConnectBunqView {...args} connected accountPicked accounts={ACCOUNTS_SLOT} />,
    Disconnected: <ConnectBunqView {...args} disconnected />,
    'Disconnected, stale declined': <ConnectBunqView {...args} disconnected result="declined" />,
    'Disconnected, stale failure': <ConnectBunqView {...args} disconnected result="error" />,
    'Failed, connected': <ConnectBunqView {...args} connected accountPicked accounts={ACCOUNTS_SLOT} result="error" />,
    Connecting: <ConnectBunqView {...args} isConnecting />,
    'Start failed': <ConnectBunqView {...args} error="Couldn’t open Bunq. Please try again." />,
    Declined: <ConnectBunqView {...args} result="declined" />,
    Failed: <ConnectBunqView {...args} result="error" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // A connected team sees its status and the accounts slot, not the acknowledgement it already gave.
    await expect(region('Connected, no pick').getByRole('status')).toHaveTextContent('Connected, pick an account below.');
    await expect(region('Connected, picked').getByRole('status')).toHaveTextContent('Connected to bunq.');
    for (const name of ['Connected, no pick', 'Connected, picked']) {
      await expect(region(name).getByText('Accounts and Disconnect')).toBeInTheDocument();
      await expect(region(name).queryByRole('checkbox')).not.toBeInTheDocument();
      await expect(region(name).queryByRole('button', {
        name: 'Connect again'
      })).not.toBeInTheDocument();
      const reconnect = region(name).getByRole('button', {
        name: 'Connect a different bunq login'
      });
      await expect(reconnect).toBeEnabled();
      await expect(reconnect).toHaveAttribute('aria-expanded', 'false');
      // It reads as a control at rest, not as plain text.
      await expect(reconnect).toHaveStyle({
        textDecorationLine: 'underline'
      });
    }

    // Disconnecting says so and offers Connect again.
    await expect(region('Disconnected').getByRole('status')).toHaveTextContent('Disconnected from bunq.');
    await expect(region('Disconnected').getByRole('button', {
      name: 'Connect Bunq'
    })).toBeDisabled();

    // A result still in the URL from an earlier trip does not outlive the disconnect.
    for (const name of ['Disconnected, stale declined', 'Disconnected, stale failure']) {
      await expect(region(name).getByRole('status')).toHaveTextContent('Disconnected from bunq.');
      await expect(region(name).queryByRole('alert')).not.toBeInTheDocument();
      await expect(region(name).queryByText(/You declined at Bunq/)).not.toBeInTheDocument();
    }
    // The status takes focus (the button pressed is gone). Each disconnected frame focuses its own on mount and
    // effects run in render order, so the last of them is the one that holds it.
    await expect(region('Disconnected, stale failure').getByRole('status')).toHaveFocus();

    // A failed reconnect does not also claim the team is connected.
    await expect(region('Failed, connected').getByRole('alert')).toHaveTextContent('Couldn’t connect Bunq.');
    await expect(region('Failed, connected').getByRole('status')).toBeEmptyDOMElement();

    // While the browser is on its way to Bunq the acknowledgement stays ticked and disabled, the button is
    // disabled, and the tick hint is not needed.
    await expect(region('Connecting').getByRole('button', {
      name: 'Opening Bunq…'
    })).toBeDisabled();
    await expect(region('Connecting').getByRole('checkbox')).toBeChecked();
    await expect(region('Connecting').getByRole('checkbox')).toBeDisabled();
    await expect(region('Connecting').queryByText('Tick the box above to continue.')).not.toBeInTheDocument();
    await expect(region('Start failed').getByRole('alert')).toHaveTextContent('Couldn’t open Bunq. Please try again.');

    // Declining is a choice: plain status, no alert, no error colour.
    const declined = region('Declined').getByRole('status');
    await expect(declined).toHaveTextContent('You declined at Bunq, so nothing was connected.');
    await expect(declined).not.toHaveClass('text-red-ink');
    await expect(region('Declined').queryByRole('alert')).not.toBeInTheDocument();

    // A failure is an alert in the error colour, and the status line stays mounted but empty.
    await expect(region('Failed').getByRole('alert')).toHaveTextContent('Couldn’t connect Bunq. Please try again.');
    await expect(region('Failed').getByRole('alert')).toHaveClass('text-red-ink');
    await expect(region('Failed').getByRole('status')).toBeEmptyDOMElement();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // The section as the redirect from Bunq opens it, next to a connected team's.
  args: {
    result: 'declined'
  },
  render: args => <Stack items={{
    'First connect': <ConnectBunqView {...args} focusResult />,
    Reconnect: <ConnectBunqView {...args} result={undefined} connected accountPicked accounts={ACCOUNTS_SLOT} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const first = within(canvas.getByRole('region', {
      name: 'First connect'
    }));
    const acknowledge = first.getByRole('checkbox', {
      name: /Connecting gives TeamBalance bunq’s standard app access/
    });
    const connect = first.getByRole('button', {
      name: 'Connect Bunq'
    });

    // The result takes focus, so a screen reader reads it although it arrived with the page.
    await expect(first.getByRole('status')).toHaveFocus();

    // A disabled button takes no pointer events, so there is no click to try before the tick.
    await expect(connect).toBeDisabled();
    await expect(args.onConnect).not.toHaveBeenCalled();
    await userEvent.click(acknowledge);
    await expect(acknowledge).toBeChecked();
    await expect(connect).toBeEnabled();
    // The reason goes away with the tick.
    await expect(first.queryByText('Tick the box above to continue.')).not.toBeInTheDocument();
    await userEvent.click(connect);
    await expect(args.onConnect).toHaveBeenCalledTimes(1);
    await userEvent.click(acknowledge);
    await expect(connect).toBeDisabled();
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.');

    // A connected team opens the form first, and the tick is asked for again.
    const reconnect = within(canvas.getByRole('region', {
      name: 'Reconnect'
    }));
    const disclosure = reconnect.getByRole('button', {
      name: 'Connect a different bunq login'
    });
    await userEvent.click(disclosure);
    // The button stays, now expanded and pointing at the form, so focus is not dropped.
    await expect(disclosure).toHaveFocus();
    await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure).toHaveAttribute('aria-controls', reconnect.getByRole('checkbox').closest('[id]')!.id);
    const connectAgain = reconnect.getByRole('button', {
      name: 'Connect again'
    });
    await expect(connectAgain).toBeDisabled();
    await expect(reconnect.getByRole('checkbox')).not.toBeChecked();
    await userEvent.click(reconnect.getByRole('checkbox'));
    await userEvent.click(connectAgain);
    await expect(args.onConnect).toHaveBeenCalledTimes(2);

    // And it closes again.
    await userEvent.click(disclosure);
    await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    await expect(reconnect.queryByRole('checkbox')).not.toBeInTheDocument();

    // Reopening asks for the consent again instead of remembering the tick.
    await userEvent.click(disclosure);
    await expect(reconnect.getByRole('checkbox')).not.toBeChecked();
    await expect(reconnect.getByRole('button', {
      name: 'Connect again'
    })).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D=[`Data`,`Shells`,`Interactions`]})))()}O();export{w as Data,E as Interactions,T as Shells,D as __namedExportsOrder,C as default};