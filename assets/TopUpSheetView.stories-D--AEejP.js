import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BiX7bVYv.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-BGck6MJ_.js";import{n as a,t as o}from"./input-2ekB5OrC.js";import{n as s,t as c}from"./label-Bq5Qgg1v.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./sheet-Ck8uBP3c.js";function g(e){let t=e.trim();if(!v.test(t))return null;let n=Number(t);return n>=1&&n<=500?n:null}var _,v;function y(){return(y=e((()=>{_=[10,20,50],v=/^\d+$/})))()}function b({open:e,onOpenChange:t,onPick:n,isPending:r,error:a,trigger:s}){let m=(0,x.useId)(),[v,y]=(0,x.useState)(``),b=g(v),w=v.trim()!==``&&b===null;return(0,S.jsxs)(h,{open:e,onOpenChange:t,children:[s&&(0,S.jsx)(f,{asChild:!0,children:s}),(0,S.jsxs)(d,{children:[(0,S.jsxs)(u,{children:[(0,S.jsx)(l,{children:`Top up the pool`}),(0,S.jsx)(p,{children:`Pick an amount. You pay on the team's bunq.me page.`})]}),(0,S.jsx)(`div`,{role:`group`,"aria-label":`Amounts`,className:`mt-4 grid grid-cols-3 gap-3`,children:_.map(e=>(0,S.jsxs)(i,{variant:`outline`,size:`lg`,"aria-disabled":r,className:`aria-disabled:pointer-events-none aria-disabled:opacity-50`,onClick:()=>!r&&n(e),children:[`€`,e]},e))}),(0,S.jsxs)(`form`,{className:`mt-5 flex flex-col gap-1`,onSubmit:e=>{e.preventDefault(),b!==null&&!r&&n(b)},children:[(0,S.jsx)(c,{htmlFor:`top-up-custom`,children:`Other amount (€)`}),(0,S.jsxs)(`div`,{className:`flex gap-3`,children:[(0,S.jsx)(o,{id:`top-up-custom`,inputMode:`numeric`,value:v,placeholder:`1 to 500`,className:`h-11`,"aria-invalid":w,"aria-describedby":w?m:void 0,onChange:e=>y(e.target.value)}),(0,S.jsx)(i,{type:`submit`,size:`lg`,disabled:!r&&b===null,"aria-disabled":r,className:`aria-disabled:pointer-events-none aria-disabled:opacity-50`,children:r?`Opening…`:`Pay`})]}),(0,S.jsx)(`div`,{"aria-live":`polite`,"aria-atomic":`true`,children:w&&(0,S.jsxs)(`p`,{id:m,className:C,children:[`Enter a whole amount from €`,1,` to €`,500,`.`]})})]}),a&&(0,S.jsx)(`p`,{role:`alert`,className:`mt-3 ${C}`,children:a})]})]})}var x,S,C;function w(){return(w=e((()=>{x=t(),r(),a(),s(),m(),y(),S=n(),C=`text-small text-red-ink`,b.__docgenInfo={description:`The amounts a member can top up the pool with: three presets and a custom whole-euro field.`,methods:[],displayName:`TopUpSheetView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},onOpenChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(open: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`open`}],return:{name:`void`}}},description:``},onPick:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(euros: number) => void`,signature:{arguments:[{type:{name:`number`},name:`euros`}],return:{name:`void`}}},description:`Whole euros, 1 to 500.`},isPending:{required:!1,tsType:{name:`boolean`},description:`The link is being fetched; the amounts are inert until it answers.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},trigger:{required:!1,tsType:{name:`ReactNode`},description:`The element that opens the sheet; the sheet hands focus back to it on close.`}}}})))()}function T(e){let[t,n]=(0,E.useState)(e.open),[r,a]=(0,E.useState)(!1);return(0,D.jsx)(b,{...e,trigger:(0,D.jsx)(i,{size:`lg`,children:`Top up`}),open:t,onOpenChange:t=>{e.onOpenChange(t),n(t),t||a(!1)},isPending:r,onPick:t=>{e.onPick(t),a(!0)}})}var E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{E=t(),r(),w(),D=n(),{expect:O,fn:k,waitFor:A,within:j}=__STORYBOOK_MODULE_TEST__,M={title:`features/top-up/TopUpSheetView`,component:b,args:{open:!0,onOpenChange:k(),onPick:k()}},N=async()=>j(await j(document.body).findByRole(`dialog`)),P={play:async()=>{let e=await N();await O(e.getByText(`Top up the pool`)).toBeInTheDocument();for(let t of[`€10`,`€20`,`€50`])await O(e.getByRole(`button`,{name:t})).toBeEnabled();await O(e.getByLabelText(`Other amount (€)`)).toHaveValue(``),await O(e.getByRole(`button`,{name:`Pay`})).toBeDisabled()}},F={args:{error:`Couldn't open the payment page. Please try again.`},play:async()=>{let e=await N();await O(e.getByRole(`alert`)).toHaveTextContent(`Couldn't open the payment page. Please try again.`)}},I={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,D.jsx)(T,{...e}),play:async({canvas:e,userEvent:t,args:n})=>{let r=await N(),i=r.getByLabelText(`Other amount (€)`),a=r.getByRole(`button`,{name:`Pay`}),o=document.querySelectorAll(`[role="dialog"] [aria-live="polite"]`);await O(o).toHaveLength(1),await O(o[0]).toHaveAttribute(`aria-atomic`,`true`),await O(o[0]).toBeEmptyDOMElement(),await O(r.getByRole(`group`,{name:`Amounts`})).toContainElement(r.getByRole(`button`,{name:`€10`}));for(let e of[`0`,`501`,`12.5`])await t.clear(i),await t.type(i,e),await A(()=>O(o[0]).toHaveTextContent(`Enter a whole amount from €1 to €500.`)),await A(()=>O(i).toHaveAccessibleDescription(`Enter a whole amount from €1 to €500.`)),await O(i).toBeInvalid(),await O(r.queryByRole(`alert`)).not.toBeInTheDocument(),await O(a).toBeDisabled();await t.type(i,`{Enter}`),await O(n.onPick).not.toHaveBeenCalled(),await t.clear(i),await O(r.queryByText(`Enter a whole amount from €1 to €500.`)).not.toBeInTheDocument(),await O(a).toBeDisabled(),await t.type(i,`75`),await t.click(a),await O(n.onPick).toHaveBeenCalledWith(75),await A(()=>O(a).toHaveTextContent(`Opening…`)),await O(a).toHaveFocus(),await O(a).toHaveAttribute(`aria-disabled`,`true`),await t.keyboard(`{Enter}`),await t.type(i,`{Enter}`),await O(n.onPick).toHaveBeenCalledTimes(1),await t.keyboard(`{Escape}`),await A(()=>O(j(document.body).queryByRole(`dialog`)).not.toBeInTheDocument()),await t.click(e.getByRole(`button`,{name:`Top up`}));let s=await N(),c=s.getByRole(`button`,{name:`€20`});await t.click(c),await O(n.onPick).toHaveBeenCalledWith(20),await O(s.getByRole(`button`,{name:`Opening…`})).toHaveAttribute(`aria-disabled`,`true`);for(let e of[`€10`,`€20`,`€50`])await O(s.getByRole(`button`,{name:e})).toHaveAttribute(`aria-disabled`,`true`);await O(c).toHaveFocus(),await t.keyboard(`{Enter}`),await O(n.onPick).toHaveBeenCalledTimes(2),await t.keyboard(`{Escape}`),await A(()=>O(n.onOpenChange).toHaveBeenCalledWith(!1)),await A(()=>O(e.getByRole(`button`,{name:`Top up`})).toHaveFocus())}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async () => {
    const dialog = await sheet();
    await expect(dialog.getByText('Top up the pool')).toBeInTheDocument();
    for (const label of ['€10', '€20', '€50']) await expect(dialog.getByRole('button', {
      name: label
    })).toBeEnabled();
    await expect(dialog.getByLabelText('Other amount (€)')).toHaveValue('');
    await expect(dialog.getByRole('button', {
      name: 'Pay'
    })).toBeDisabled();
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    error: "Couldn't open the payment page. Please try again."
  },
  play: async () => {
    const dialog = await sheet();
    await expect(dialog.getByRole('alert')).toHaveTextContent("Couldn't open the payment page. Please try again.");
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <PendingAfterPick {...args} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const dialog = await sheet();
    const custom = dialog.getByLabelText('Other amount (€)');
    const pay = dialog.getByRole('button', {
      name: 'Pay'
    });

    // The custom amount's polite live region is mounted from the start and empty until it has an error,
    // so the error is announced when it appears without interrupting the typing.
    const amountErrors = document.querySelectorAll('[role="dialog"] [aria-live="polite"]');
    await expect(amountErrors).toHaveLength(1);
    await expect(amountErrors[0]).toHaveAttribute('aria-atomic', 'true');
    await expect(amountErrors[0]).toBeEmptyDOMElement();
    await expect(dialog.getByRole('group', {
      name: 'Amounts'
    })).toContainElement(dialog.getByRole('button', {
      name: '€10'
    }));

    // Rejected amounts keep Pay disabled and never reach onPick.
    for (const invalid of ['0', '501', '12.5']) {
      await userEvent.clear(custom);
      await userEvent.type(custom, invalid);
      await waitFor(() => expect(amountErrors[0]).toHaveTextContent('Enter a whole amount from €1 to €500.'));
      await waitFor(() => expect(custom).toHaveAccessibleDescription('Enter a whole amount from €1 to €500.'));
      await expect(custom).toBeInvalid();
      await expect(dialog.queryByRole('alert')).not.toBeInTheDocument();
      await expect(pay).toBeDisabled();
    }
    await userEvent.type(custom, '{Enter}');
    await expect(args.onPick).not.toHaveBeenCalled();

    // An empty field is not an error message, just not payable.
    await userEvent.clear(custom);
    await expect(dialog.queryByText('Enter a whole amount from €1 to €500.')).not.toBeInTheDocument();
    await expect(pay).toBeDisabled();
    await userEvent.type(custom, '75');
    await userEvent.click(pay);
    await expect(args.onPick).toHaveBeenCalledWith(75);
    // While the link is fetched, Pay is aria-disabled rather than disabled: a focused button that becomes
    // disabled drops focus to <body>, outside the modal dialog. Pressing it again, or Enter in the field,
    // picks nothing.
    await waitFor(() => expect(pay).toHaveTextContent('Opening…'));
    await expect(pay).toHaveFocus();
    await expect(pay).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    await userEvent.type(custom, '{Enter}');
    await expect(args.onPick).toHaveBeenCalledTimes(1);

    // Closing ends the pending state; the sheet reopens with the amount still typed.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', {
      name: 'Top up'
    }));
    const reopened = await sheet();
    const twenty = reopened.getByRole('button', {
      name: '€20'
    });
    await userEvent.click(twenty);
    await expect(args.onPick).toHaveBeenCalledWith(20);
    // While the link is fetched, nothing else can be picked. The presets are aria-disabled too, for the
    // same reason as Pay.
    await expect(reopened.getByRole('button', {
      name: 'Opening…'
    })).toHaveAttribute('aria-disabled', 'true');
    for (const label of ['€10', '€20', '€50']) {
      await expect(reopened.getByRole('button', {
        name: label
      })).toHaveAttribute('aria-disabled', 'true');
    }
    await expect(twenty).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPick).toHaveBeenCalledTimes(2);

    // Closing hands focus back to the Top up button.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false));
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Top up'
    })).toHaveFocus());
  }
}`,...I.parameters?.docs?.source}}},L=[`Data`,`Shells`,`Interactions`]})))()}R();export{P as Data,I as Interactions,F as Shells,L as __namedExportsOrder,M as default};