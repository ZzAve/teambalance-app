import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,n,r}from"./iframe-CQoHr3e8.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./button-CmIclryv.js";import{n as l,t as u}from"./ConfirmDialog-DTa-cu5v.js";function d({accounts:e,selectedAccountId:t,isLoading:n,isError:r,isSaving:i,saved:a,rejected:o,error:s,onPick:l,onDisconnect:d}){let[h,_]=(0,p.useState)(!1),v=(0,p.useRef)(null),y=(0,p.useRef)(!1),b=(0,p.useRef)(null),x=(0,p.useRef)(null),S=(0,p.useRef)(!1);return(0,p.useEffect)(()=>{o&&S.current&&x.current?.focus()},[o]),(0,p.useEffect)(()=>{s&&b.current?.focus()},[s]),(0,m.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[n&&(0,m.jsx)(`p`,{role:`status`,className:`text-small text-muted-foreground`,children:`Loading the bunq accounts…`}),o?(0,m.jsx)(`p`,{ref:x,role:`alert`,tabIndex:-1,className:`${g} outline-none`,children:`TeamBalance can’t use its stored bunq access any more. Use “Connect a different bunq login” below, or disconnect.`}):r&&(0,m.jsx)(`p`,{role:`alert`,className:g,children:`Couldn’t load the bunq accounts. Please try again.`}),e&&!n&&!r&&(0,m.jsx)(f,{accounts:e,selectedAccountId:t,isSaving:i,saved:a,onPick:e=>{S.current=!0,l(e)}}),s&&(0,m.jsx)(`p`,{ref:b,role:`alert`,tabIndex:-1,className:`${g} outline-none`,children:s}),(0,m.jsx)(`div`,{children:(0,m.jsx)(c,{ref:v,variant:`outline`,size:`sm`,disabled:i,onClick:()=>_(!0),children:`Disconnect`})}),(0,m.jsx)(u,{open:h,title:`Disconnect Bunq`,description:`This deletes the access TeamBalance stored. To withdraw the grant at bunq too, remove TeamBalance under connected apps in the bunq app.`,confirmLabel:`Disconnect`,onConfirm:()=>{y.current=!1,S.current=!0,_(!1),d()},onCancel:()=>{y.current=!0,_(!1)},onCloseAutoFocus:e=>{e.preventDefault(),y.current&&v.current?.focus()}})]})}function f({accounts:e,selectedAccountId:t,isSaving:n,saved:r,onPick:i}){let a=(0,p.useId)(),[o,s]=(0,p.useState)(t),l=(0,p.useRef)(null);(0,p.useEffect)(()=>{r&&l.current?.focus()},[r]);let u=e.find(e=>e.id===t);return e.length===0?(0,m.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This bunq login has no accounts to show.`}):(0,m.jsxs)(`fieldset`,{className:`flex flex-col gap-1`,disabled:n,children:[(0,m.jsx)(`legend`,{className:`text-small font-semibold`,children:`Choose the account the Money page shows`}),e.map(e=>(0,m.jsxs)(`label`,{className:`flex min-h-11 items-center gap-3 py-2 text-small`,children:[(0,m.jsx)(`input`,{type:`radio`,name:a,value:e.id,checked:o===e.id,onChange:()=>s(e.id),className:h}),e.name]},e.id)),(0,m.jsx)(`div`,{className:`mt-2`,children:(0,m.jsx)(c,{size:`sm`,disabled:n||o===void 0||o===t,onClick:()=>o&&i(o),children:n?`Saving…`:`Use this account`})}),(0,m.jsx)(`p`,{ref:l,role:`status`,tabIndex:-1,className:`mt-3 text-small outline-none empty:sr-only`,children:r&&u?`The Money page now shows ${u.name}.`:``})]})}var p,m,h,g;function _(){return(_=e((()=>{p=t(),s(),l(),m=i(),h=[`size-5 shrink-0 appearance-none rounded-full border-2 border-muted-foreground bg-transparent`,`checked:border-primary checked:bg-primary`,`checked:bg-[radial-gradient(circle,var(--color-primary-foreground)_0_32%,transparent_36%)]`,`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`].join(` `),g=`rounded-lg bg-card p-3 text-small text-red-ink`,d.__docgenInfo={description:`Presentational account picker and Disconnect for a connected team: one list of the accounts the
Money page can read, with the picked one checked. Owns only the choice that has not been saved yet and
the Disconnect confirmation. The reads and the mutations live in the BunqAccounts container; the
loading, error and rejected shells are props-driven so they render as stories without a network.`,methods:[],displayName:`BunqAccountsView`,props:{accounts:{required:!1,tsType:{name:`Array`,elements:[{name:`BunqAccount`}],raw:`BunqAccount[]`},description:`The accounts the team's Bunq access covers; undefined until they are read.`},selectedAccountId:{required:!1,tsType:{name:`string`},description:`The account the Money page reads; undefined until the Admin picks one.`},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:`The accounts could not be read.`},isSaving:{required:!1,tsType:{name:`boolean`},description:`A pick or a disconnect is in flight.`},saved:{required:!1,tsType:{name:`boolean`},description:`The last pick went through: announced, and focus moves to the announcement.`},rejected:{required:!1,tsType:{name:`boolean`},description:`The stored access cannot be used any more (422): the Admin has to connect again.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`A pick or a disconnect failed, shown inline.`},onPick:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(accountId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`accountId`}],return:{name:`void`}}},description:``},onDisconnect:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}function v(e){let[t,n]=(0,y.useState)(null),[r,i]=(0,y.useState)(!1);return(0,b.jsx)(d,{...e,error:t,rejected:r,onPick:t=>{e.onPick(t),i(!0)},onDisconnect:()=>{e.onDisconnect(),n(O)}})}var y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{y=t(),a(),r(),_(),b=i(),{expect:x,fn:S,waitFor:C,within:w}=__STORYBOOK_MODULE_TEST__,T={title:`features/connect-bunq/BunqAccountsView`,component:d,args:{accounts:[{id:`fake-account-1`,name:`Teamkas`},{id:`fake-account-2`,name:`Privé`}],selectedAccountId:`fake-account-1`,onPick:S(),onDisconnect:S()}},E={play:async({canvas:e})=>{await x(e.getByText(`Choose the account the Money page shows`)).toBeInTheDocument(),await x(e.getByRole(`radio`,{name:`Teamkas`})).toBeChecked(),await x(e.getByRole(`radio`,{name:`Privé`})).not.toBeChecked(),await x(e.getByRole(`button`,{name:`Use this account`})).toBeDisabled(),await x(e.getByRole(`button`,{name:`Disconnect`})).toBeEnabled()}},D={parameters:{chromatic:{modes:n}},render:e=>(0,b.jsx)(o,{items:{"Nothing picked":(0,b.jsx)(d,{...e,selectedAccountId:void 0}),Loading:(0,b.jsx)(d,{...e,accounts:void 0,selectedAccountId:void 0,isLoading:!0}),"Load failed":(0,b.jsx)(d,{...e,accounts:void 0,selectedAccountId:void 0,isError:!0}),Saving:(0,b.jsx)(d,{...e,isSaving:!0}),"Pick failed":(0,b.jsx)(d,{...e,error:`Couldn’t save the account. Please try again.`}),Rejected:(0,b.jsx)(d,{...e,accounts:void 0,selectedAccountId:void 0,isError:!0,rejected:!0}),Saved:(0,b.jsx)(d,{...e,saved:!0})}}),play:async({canvas:e})=>{let t=t=>w(e.getByRole(`region`,{name:t}));await x(t(`Nothing picked`).getByText(`Choose the account the Money page shows`)).toBeInTheDocument(),await x(t(`Nothing picked`).getAllByRole(`radio`)).toHaveLength(2),await x(t(`Nothing picked`).queryByRole(`radio`,{checked:!0})).not.toBeInTheDocument(),await x(t(`Nothing picked`).getByRole(`button`,{name:`Use this account`})).toBeDisabled(),await x(t(`Loading`).getByRole(`status`)).toHaveTextContent(`Loading the bunq accounts…`),await x(t(`Loading`).queryByRole(`radio`)).not.toBeInTheDocument(),await x(t(`Load failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t load the bunq accounts.`),await x(t(`Load failed`).queryByRole(`radio`)).not.toBeInTheDocument(),await x(t(`Load failed`).getByRole(`button`,{name:`Disconnect`})).toBeEnabled(),await x(t(`Saving`).getByRole(`button`,{name:`Saving…`})).toBeDisabled(),await x(t(`Saving`).getByRole(`radio`,{name:`Privé`})).toBeDisabled(),await x(t(`Saving`).getByRole(`button`,{name:`Disconnect`})).toBeDisabled(),await x(t(`Saved`).getByRole(`status`)).toHaveTextContent(`The Money page now shows Teamkas.`),await x(t(`Saved`).getByRole(`status`)).toHaveFocus(),await x(t(`Nothing picked`).getByRole(`status`)).toBeEmptyDOMElement(),await x(t(`Pick failed`).getByRole(`alert`)).toHaveTextContent(`Couldn’t save the account.`);let n=t(`Rejected`).getByRole(`alert`);await x(n).toHaveTextContent(`can’t use its stored bunq access any more`),await x(n).toHaveTextContent(`Connect a different bunq login`),await x(t(`Rejected`).getAllByRole(`alert`)).toHaveLength(1),await x(t(`Rejected`).getByRole(`button`,{name:`Disconnect`})).toBeEnabled(),await x(n).not.toHaveFocus()}},O=`Couldn’t disconnect Bunq. Please try again.`,k={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,b.jsx)(v,{...e}),play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByRole(`button`,{name:`Use this account`});await t.click(e.getByRole(`radio`,{name:`Privé`})),await x(e.getByRole(`radio`,{name:`Privé`})).toBeChecked(),await x(n.onPick).not.toHaveBeenCalled(),await x(r).toBeEnabled(),await t.click(r),await x(n.onPick).toHaveBeenCalledWith(`fake-account-2`),await C(()=>x(e.getByRole(`alert`)).toHaveFocus()),await x(e.getByRole(`alert`)).toHaveTextContent(`can’t use its stored bunq access any more`),await t.click(e.getByRole(`radio`,{name:`Teamkas`})),await x(r).toBeDisabled();let i=w(document.body);await t.click(e.getByRole(`button`,{name:`Disconnect`})),await x(await i.findByText(/This deletes the access TeamBalance stored/)).toBeInTheDocument(),await x(i.getByText(/remove TeamBalance under connected apps in the bunq app/)).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await C(()=>x(i.queryByRole(`dialog`)).not.toBeInTheDocument()),await x(n.onDisconnect).not.toHaveBeenCalled(),await C(()=>x(e.getByRole(`button`,{name:`Disconnect`})).toHaveFocus()),await t.click(e.getByRole(`button`,{name:`Disconnect`})),await t.click(w(await i.findByRole(`dialog`)).getByRole(`button`,{name:`Disconnect`})),await x(n.onDisconnect).toHaveBeenCalledTimes(1),await C(()=>x(e.getByText(O)).toHaveFocus())}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Choose the account the Money page shows')).toBeInTheDocument();
    await expect(canvas.getByRole('radio', {
      name: 'Teamkas'
    })).toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'Privé'
    })).not.toBeChecked();
    // Nothing to save until the choice differs from the saved one.
    await expect(canvas.getByRole('button', {
      name: 'Use this account'
    })).toBeDisabled();
    await expect(canvas.getByRole('button', {
      name: 'Disconnect'
    })).toBeEnabled();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      modes: darkMode
    }
  },
  render: args => <Stack items={{
    'Nothing picked': <BunqAccountsView {...args} selectedAccountId={undefined} />,
    Loading: <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isLoading />,
    'Load failed': <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isError />,
    Saving: <BunqAccountsView {...args} isSaving />,
    'Pick failed': <BunqAccountsView {...args} error="Couldn’t save the account. Please try again." />,
    Rejected: <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isError rejected />,
    // Last, because a saved pick focuses its announcement on mount and the last frame to do so keeps focus.
    Saved: <BunqAccountsView {...args} saved />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Before a pick the list leads with what to do, and nothing is checked or savable.
    await expect(region('Nothing picked').getByText('Choose the account the Money page shows')).toBeInTheDocument();
    await expect(region('Nothing picked').getAllByRole('radio')).toHaveLength(2);
    await expect(region('Nothing picked').queryByRole('radio', {
      checked: true
    })).not.toBeInTheDocument();
    await expect(region('Nothing picked').getByRole('button', {
      name: 'Use this account'
    })).toBeDisabled();
    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading the bunq accounts…');
    await expect(region('Loading').queryByRole('radio')).not.toBeInTheDocument();
    await expect(region('Load failed').getByRole('alert')).toHaveTextContent('Couldn’t load the bunq accounts.');
    await expect(region('Load failed').queryByRole('radio')).not.toBeInTheDocument();
    // Disconnecting stays possible when the accounts cannot be read.
    await expect(region('Load failed').getByRole('button', {
      name: 'Disconnect'
    })).toBeEnabled();
    await expect(region('Saving').getByRole('button', {
      name: 'Saving…'
    })).toBeDisabled();
    await expect(region('Saving').getByRole('radio', {
      name: 'Privé'
    })).toBeDisabled();
    await expect(region('Saving').getByRole('button', {
      name: 'Disconnect'
    })).toBeDisabled();

    // A saved pick says what the Money page shows now, and the announcement takes focus from the disabled controls.
    await expect(region('Saved').getByRole('status')).toHaveTextContent('The Money page now shows Teamkas.');
    await expect(region('Saved').getByRole('status')).toHaveFocus();
    await expect(region('Nothing picked').getByRole('status')).toBeEmptyDOMElement();
    await expect(region('Pick failed').getByRole('alert')).toHaveTextContent('Couldn’t save the account.');

    // A rejected grant says how to get out, and does not also claim the read failed.
    const rejected = region('Rejected').getByRole('alert');
    await expect(rejected).toHaveTextContent('can’t use its stored bunq access any more');
    await expect(rejected).toHaveTextContent('Connect a different bunq login');
    await expect(region('Rejected').getAllByRole('alert')).toHaveLength(1);
    await expect(region('Rejected').getByRole('button', {
      name: 'Disconnect'
    })).toBeEnabled();
    // Opening the page on a connection that is already rejected leaves focus where it is.
    await expect(rejected).not.toHaveFocus();
  }
}`,...D.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <FailingActions {...args} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const save = canvas.getByRole('button', {
      name: 'Use this account'
    });
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Privé'
    }));
    await expect(canvas.getByRole('radio', {
      name: 'Privé'
    })).toBeChecked();
    await expect(args.onPick).not.toHaveBeenCalled();
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    await expect(args.onPick).toHaveBeenCalledWith('fake-account-2');
    // A pick that ends rejected takes focus to the message: the button pressed is about to go.
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveFocus());
    await expect(canvas.getByRole('alert')).toHaveTextContent('can’t use its stored bunq access any more');

    // Choosing the saved account again leaves nothing to save.
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Teamkas'
    }));
    await expect(save).toBeDisabled();

    // The dialog is in a portal, outside the canvas. Cancel keeps the connection.
    const dialog = within(document.body);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Disconnect'
    }));
    await expect(await dialog.findByText(/This deletes the access TeamBalance stored/)).toBeInTheDocument();
    await expect(dialog.getByText(/remove TeamBalance under connected apps in the bunq app/)).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', {
      name: 'Cancel'
    }));
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onDisconnect).not.toHaveBeenCalled();
    // Focus is back on the button that opened the dialog, not on the page.
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Disconnect'
    })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', {
      name: 'Disconnect'
    }));
    await userEvent.click(within(await dialog.findByRole('dialog')).getByRole('button', {
      name: 'Disconnect'
    }));
    await expect(args.onDisconnect).toHaveBeenCalledTimes(1);
    // A failure takes focus to its alert, so it is read and the keyboard user is not left on the page.
    await waitFor(() => expect(canvas.getByText(DISCONNECT_FAILED)).toHaveFocus());
  }
}`,...k.parameters?.docs?.source}}},A=[`Data`,`Shells`,`Interactions`]})))()}j();export{E as Data,k as Interactions,D as Shells,A as __namedExportsOrder,T as default};