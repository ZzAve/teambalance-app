import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,n,r}from"./iframe-Bx1ifuQg.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./button-Ce8-U6t7.js";function l({connected:e,result:t,focusResult:n,isConnecting:r,error:i,onConnect:a}){let o=(0,u.useId)(),[s,l]=(0,u.useState)(!1),m=(0,u.useRef)(null);(0,u.useEffect)(()=>{n&&t&&m.current?.focus({preventScroll:!0})},[n,t]);let h=t===`error`,g=s||!!r;return(0,d.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Connect Bunq`}),(0,d.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:e?`The team’s Bunq account is connected. Connecting again replaces the current connection.`:`Show the balance and payments of the team’s Bunq account on the Money page.`})]}),(0,d.jsx)(`p`,{ref:h?void 0:m,role:`status`,tabIndex:-1,className:`text-small font-semibold outline-none empty:sr-only`,children:t&&!h?f[t]:``}),h&&(0,d.jsx)(`p`,{ref:m,role:`alert`,tabIndex:-1,className:`${p} outline-none`,children:f.error}),(0,d.jsxs)(`label`,{className:`flex min-h-11 items-start gap-3 py-2 text-small leading-relaxed`,children:[(0,d.jsx)(`input`,{type:`checkbox`,checked:g,disabled:r,onChange:e=>l(e.target.checked),className:`mt-0.5 size-5 shrink-0 accent-primary`}),(0,d.jsx)(`span`,{children:`Connecting gives TeamBalance bunq’s standard app access to this bunq login, which is more than reading: bunq’s default grant also allows creating payments and draft payments. TeamBalance only reads the balance and payments of the one account you pick and stores no payment data. Every member of this team will see the balance and the names, dates and amounts of payments on that account. You can revoke this in the bunq app under connected apps; a Disconnect button in TeamBalance follows.`})]}),i&&(0,d.jsx)(`p`,{role:`alert`,className:p,children:i}),(0,d.jsxs)(`div`,{className:`flex flex-col items-start gap-2`,children:[(0,d.jsx)(c,{disabled:!s||r,"aria-describedby":g?void 0:o,onClick:a,children:r?`Opening Bunq…`:e?`Connect again`:`Connect Bunq`}),!g&&(0,d.jsx)(`p`,{id:o,className:`text-caption text-muted-foreground`,children:`Tick the box above to continue.`})]})]})}var u,d,f,p;function m(){return(m=e((()=>{u=t(),s(),d=i(),f={connected:`Bunq connected`,declined:`You declined at Bunq, so nothing was connected.`,error:`Couldn’t connect Bunq. Please try again.`},p=`rounded-lg bg-card p-3 text-small text-red-ink`,l.__docgenInfo={description:`Presentational "connect Bunq" section for the team settings: what connecting grants, a tick to
acknowledge it, and the Connect button that stays disabled until it is ticked. Owns only the tick.
A declined trip is the Admin's choice and reads as plain status; only a failure is an alert. The
status line is mounted before it has anything to say; when the page was opened by Bunq's return the
result also takes focus, so a screen reader reads it even though it arrived with the page.`,methods:[],displayName:`ConnectBunqView`,props:{connected:{required:!0,tsType:{name:`boolean`},description:`The team already has a Bunq connection; connecting again replaces it.`},result:{required:!1,tsType:{name:`union`,raw:`'connected' | 'declined' | 'error'`,elements:[{name:`literal`,value:`'connected'`},{name:`literal`,value:`'declined'`},{name:`literal`,value:`'error'`}]},description:``},focusResult:{required:!1,tsType:{name:`boolean`},description:`Move focus to the result on mount: the page was opened by Bunq's return, at the top of a long page.`},isConnecting:{required:!1,tsType:{name:`boolean`},description:`The start request is in flight, or the browser is on its way to Bunq.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The start request failed, shown inline.`},onConnect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{a(),r(),m(),h=i(),{expect:g,fn:_,within:v}=__STORYBOOK_MODULE_TEST__,y={title:`features/connect-bunq/ConnectBunqView`,component:l,args:{connected:!1,onConnect:_()}},b={play:async({canvas:e})=>{await g(e.getByRole(`heading`,{name:`Connect Bunq`})).toBeInTheDocument(),await g(e.getByLabelText(/Connecting gives TeamBalance bunq’s standard app access/)).not.toBeChecked(),await g(e.getByText(/bunq’s default grant also allows creating payments and draft payments/)).toBeInTheDocument();let t=e.getByRole(`button`,{name:`Connect Bunq`});await g(t).toBeDisabled(),await g(t).toHaveAccessibleDescription(`Tick the box above to continue.`),await g(e.getByRole(`status`)).toBeEmptyDOMElement()}},x={parameters:{chromatic:{modes:n}},render:e=>(0,h.jsx)(o,{items:{Connected:(0,h.jsx)(l,{...e,connected:!0,result:`connected`}),Connecting:(0,h.jsx)(l,{...e,isConnecting:!0}),"Start failed":(0,h.jsx)(l,{...e,error:`Couldn’t open Bunq. Please try again.`}),Declined:(0,h.jsx)(l,{...e,result:`declined`}),Failed:(0,h.jsx)(l,{...e,result:`error`})}}),play:async({canvas:e})=>{let t=t=>v(e.getByRole(`region`,{name:t}));await g(t(`Connected`).getByRole(`status`)).toHaveTextContent(`Bunq connected`),await g(t(`Connected`).getByRole(`button`,{name:`Connect again`})).toBeDisabled(),await g(t(`Connected`).getByText(/Connecting again replaces the current connection/)).toBeInTheDocument(),await g(t(`Connecting`).getByRole(`button`,{name:`Opening Bunq…`})).toBeDisabled(),await g(t(`Connecting`).getByRole(`checkbox`)).toBeChecked(),await g(t(`Connecting`).getByRole(`checkbox`)).toBeDisabled(),await g(t(`Connecting`).queryByText(`Tick the box above to continue.`)).not.toBeInTheDocument(),await g(t(`Start failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t open Bunq. Please try again.`);let n=t(`Declined`).getByRole(`status`);await g(n).toHaveTextContent(`You declined at Bunq, so nothing was connected.`),await g(n).not.toHaveClass(`text-red-ink`),await g(t(`Declined`).queryByRole(`alert`)).not.toBeInTheDocument(),await g(t(`Failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t connect Bunq. Please try again.`),await g(t(`Failed`).getByRole(`alert`)).toHaveClass(`text-red-ink`),await g(t(`Failed`).getByRole(`status`)).toBeEmptyDOMElement()}},S={parameters:{chromatic:{disableSnapshot:!0}},args:{result:`declined`,focusResult:!0},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByRole(`checkbox`,{name:/Connecting gives TeamBalance bunq’s standard app access/}),i=e.getByRole(`button`,{name:`Connect Bunq`});await g(e.getByRole(`status`)).toHaveFocus(),await g(i).toBeDisabled(),await g(n.onConnect).not.toHaveBeenCalled(),await t.click(r),await g(r).toBeChecked(),await g(i).toBeEnabled(),await g(e.queryByText(`Tick the box above to continue.`)).not.toBeInTheDocument(),await t.click(i),await g(n.onConnect).toHaveBeenCalledTimes(1),await t.click(r),await g(i).toBeDisabled(),await g(i).toHaveAccessibleDescription(`Tick the box above to continue.`)}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Connect Bunq'
    })).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Connecting gives TeamBalance bunq’s standard app access/)).not.toBeChecked();
    await expect(canvas.getByText(/bunq’s default grant also allows creating payments and draft payments/)).toBeInTheDocument();
    const connect = canvas.getByRole('button', {
      name: 'Connect Bunq'
    });
    await expect(connect).toBeDisabled();
    // The reason is on the page and tied to the button.
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.');
    // The status line is mounted before it has anything to say, so a result is announced when it appears.
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      modes: darkMode
    }
  },
  render: args => <Stack items={{
    Connected: <ConnectBunqView {...args} connected result="connected" />,
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
    await expect(region('Connected').getByRole('status')).toHaveTextContent('Bunq connected');
    await expect(region('Connected').getByRole('button', {
      name: 'Connect again'
    })).toBeDisabled();
    await expect(region('Connected').getByText(/Connecting again replaces the current connection/)).toBeInTheDocument();

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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // The section as the redirect from Bunq opens it.
  args: {
    result: 'declined',
    focusResult: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const acknowledge = canvas.getByRole('checkbox', {
      name: /Connecting gives TeamBalance bunq’s standard app access/
    });
    const connect = canvas.getByRole('button', {
      name: 'Connect Bunq'
    });

    // The result takes focus, so a screen reader reads it although it arrived with the page.
    await expect(canvas.getByRole('status')).toHaveFocus();

    // A disabled button takes no pointer events, so there is no click to try before the tick.
    await expect(connect).toBeDisabled();
    await expect(args.onConnect).not.toHaveBeenCalled();
    await userEvent.click(acknowledge);
    await expect(acknowledge).toBeChecked();
    await expect(connect).toBeEnabled();
    // The reason goes away with the tick.
    await expect(canvas.queryByText('Tick the box above to continue.')).not.toBeInTheDocument();
    await userEvent.click(connect);
    await expect(args.onConnect).toHaveBeenCalledTimes(1);
    await userEvent.click(acknowledge);
    await expect(connect).toBeDisabled();
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.');
  }
}`,...S.parameters?.docs?.source}}},C=[`Data`,`Shells`,`Interactions`]})))()}w();export{b as Data,S as Interactions,x as Shells,C as __namedExportsOrder,y as default};