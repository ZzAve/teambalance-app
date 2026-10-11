import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-B6ffpKAe.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-BqTmlbIE.js";import{n as a,t as o}from"./input-CD0kqAVw.js";import{n as s,t as c}from"./label-Vf1FVk_5.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./sheet-CEVOVyXk.js";function g(e){let t=e.trim();if(!v.test(t))return null;let n=Number(t);return n>=1&&n<=500?n:null}var _,v;function y(){return(y=e((()=>{_=[10,20,50],v=/^\d+$/})))()}function b({open:e,onOpenChange:t,onPick:n,isPending:r,error:a,trigger:s}){let m=(0,x.useId)(),[v,y]=(0,x.useState)(``),b=g(v),C=v.trim()!==``&&b===null;return(0,S.jsxs)(h,{open:e,onOpenChange:t,children:[s&&(0,S.jsx)(f,{asChild:!0,children:s}),(0,S.jsxs)(d,{children:[(0,S.jsxs)(u,{children:[(0,S.jsx)(l,{children:`Top up the pool`}),(0,S.jsx)(p,{children:`Pick an amount. You pay on the team's bunq.me page.`})]}),(0,S.jsx)(`div`,{className:`mt-4 grid grid-cols-3 gap-3`,children:_.map(e=>(0,S.jsxs)(i,{variant:`outline`,size:`lg`,disabled:r,onClick:()=>n(e),children:[`€`,e]},e))}),(0,S.jsxs)(`form`,{className:`mt-5 flex flex-col gap-1`,onSubmit:e=>{e.preventDefault(),b!==null&&n(b)},children:[(0,S.jsx)(c,{htmlFor:`top-up-custom`,children:`Other amount (€)`}),(0,S.jsxs)(`div`,{className:`flex gap-3`,children:[(0,S.jsx)(o,{id:`top-up-custom`,inputMode:`numeric`,value:v,placeholder:`1 to 500`,className:`h-11`,"aria-invalid":C,"aria-describedby":C?m:void 0,onChange:e=>y(e.target.value)}),(0,S.jsx)(i,{type:`submit`,size:`lg`,disabled:r||b===null,children:r?`Opening…`:`Pay`})]}),C&&(0,S.jsxs)(`p`,{id:m,role:`alert`,className:`text-small text-red`,children:[`Enter a whole amount from €`,1,` to €`,500,`.`]})]}),a&&(0,S.jsx)(`p`,{role:`alert`,className:`mt-3 text-small text-red`,children:a})]})]})}var x,S;function C(){return(C=e((()=>{x=t(),r(),a(),s(),m(),y(),S=n(),b.__docgenInfo={description:`The amounts a member can top up the pool with: three presets and a custom whole-euro field.`,methods:[],displayName:`TopUpSheetView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},onOpenChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(open: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`open`}],return:{name:`void`}}},description:``},onPick:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(euros: number) => void`,signature:{arguments:[{type:{name:`number`},name:`euros`}],return:{name:`void`}}},description:`Whole euros, 1 to 500.`},isPending:{required:!1,tsType:{name:`boolean`},description:`The link is being fetched; the amounts are disabled until it answers.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},trigger:{required:!1,tsType:{name:`ReactNode`},description:`The element that opens the sheet; the sheet hands focus back to it on close.`}}}})))()}function w(e){let[t,n]=(0,T.useState)(!1);return(0,E.jsx)(b,{...e,isPending:t,onPick:t=>{e.onPick(t),n(_.includes(t))}})}var T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{T=t(),y(),C(),E=n(),{expect:D,fn:O,within:k}=__STORYBOOK_MODULE_TEST__,A={title:`features/top-up/TopUpSheetView`,component:b,args:{open:!0,onOpenChange:O(),onPick:O()}},j=async()=>k(await k(document.body).findByRole(`dialog`)),M={play:async()=>{let e=await j();await D(e.getByText(`Top up the pool`)).toBeInTheDocument();for(let t of[`€10`,`€20`,`€50`])await D(e.getByRole(`button`,{name:t})).toBeEnabled();await D(e.getByLabelText(`Other amount (€)`)).toHaveValue(``),await D(e.getByRole(`button`,{name:`Pay`})).toBeDisabled()}},N={args:{error:`Couldn't open the payment page. Please try again.`},play:async()=>{let e=await j();await D(e.getByRole(`alert`)).toHaveTextContent(`Couldn't open the payment page. Please try again.`)}},P={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,E.jsx)(w,{...e}),play:async({userEvent:e,args:t})=>{let n=await j(),r=n.getByLabelText(`Other amount (€)`),i=n.getByRole(`button`,{name:`Pay`});for(let t of[`0`,`501`,`12.5`])await e.clear(r),await e.type(r,t),await D(n.getByRole(`alert`)).toHaveTextContent(`Enter a whole amount from €1 to €500.`),await D(r).toHaveAccessibleDescription(`Enter a whole amount from €1 to €500.`),await D(i).toBeDisabled();await e.type(r,`{Enter}`),await D(t.onPick).not.toHaveBeenCalled(),await e.clear(r),await D(n.queryByText(`Enter a whole amount from €1 to €500.`)).not.toBeInTheDocument(),await D(i).toBeDisabled(),await e.type(r,`75`),await e.click(i),await D(t.onPick).toHaveBeenCalledWith(75),await e.click(n.getByRole(`button`,{name:`€20`})),await D(t.onPick).toHaveBeenCalledWith(20),await D(n.getByRole(`button`,{name:`Opening…`})).toBeDisabled();for(let e of[`€10`,`€20`,`€50`])await D(n.getByRole(`button`,{name:e})).toBeDisabled()}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    error: "Couldn't open the payment page. Please try again."
  },
  play: async () => {
    const dialog = await sheet();
    await expect(dialog.getByRole('alert')).toHaveTextContent("Couldn't open the payment page. Please try again.");
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <PendingAfterPresetPick {...args} />,
  play: async ({
    userEvent,
    args
  }) => {
    const dialog = await sheet();
    const custom = dialog.getByLabelText('Other amount (€)');
    const pay = dialog.getByRole('button', {
      name: 'Pay'
    });

    // Rejected amounts keep Pay disabled and never reach onPick.
    for (const invalid of ['0', '501', '12.5']) {
      await userEvent.clear(custom);
      await userEvent.type(custom, invalid);
      await expect(dialog.getByRole('alert')).toHaveTextContent('Enter a whole amount from €1 to €500.');
      await expect(custom).toHaveAccessibleDescription('Enter a whole amount from €1 to €500.');
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
    await userEvent.click(dialog.getByRole('button', {
      name: '€20'
    }));
    await expect(args.onPick).toHaveBeenCalledWith(20);
    // While the link is fetched, nothing else can be picked.
    await expect(dialog.getByRole('button', {
      name: 'Opening…'
    })).toBeDisabled();
    for (const label of ['€10', '€20', '€50']) await expect(dialog.getByRole('button', {
      name: label
    })).toBeDisabled();
  }
}`,...P.parameters?.docs?.source}}},F=[`Data`,`Shells`,`Interactions`]})))()}I();export{M as Data,P as Interactions,N as Shells,F as __namedExportsOrder,A as default};