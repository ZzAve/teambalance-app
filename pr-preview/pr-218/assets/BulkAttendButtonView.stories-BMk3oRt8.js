import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./check-Dox-fRs6.js";import{n as i,t as a}from"./button-CupsOBG7.js";function o({count:e,onAttend:t,isPending:n=!1}){return e===0?null:(0,s.jsxs)(a,{variant:`outline`,size:`sm`,onClick:t,disabled:n,className:`shrink-0 border-green/30 text-green hover:bg-green/10`,children:[(0,s.jsx)(r,{size:16}),`Attend `,e]})}var s;function c(){return(c=e((()=>{n(),i(),s=t(),o.__docgenInfo={description:`The "Attend N" button (ADR-0020). Presentational: the count and the callback come in as props, the
mutation and the Undo toast live in the container.

The count *is* the confirmation — there is no modal, so the number must be visible before the tap.
At zero there is nothing to fill, so the button renders nothing at all rather than a disabled
control: a greyed-out "Attend 0" is noise on a list where every event is already answered.`,methods:[],displayName:`BulkAttendButtonView`,props:{count:{required:!0,tsType:{name:`number`},description:`How many shown, unanswered, future events the tap would fill.`},onAttend:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{c(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`features/bulk-attend/BulkAttendButtonView`,component:o,args:{count:3,onAttend:u()}},p={args:{count:0},play:async({canvasElement:e})=>{await l(d(e).queryByRole(`button`)).not.toBeInTheDocument()}},m={play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:/Attend 3/})).toBeInTheDocument()}},h={args:{count:1},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:/Attend 1/})).toBeInTheDocument()}},g={args:{isPending:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:/Attend 3/})).toBeDisabled()}},_={play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:/Attend 3/})),await l(t.onAttend).toHaveBeenCalled()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    count: 0
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /Attend 3/
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    count: 1
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /Attend 1/
    })).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    // Disabled while the batch is in flight, so a double-tap can't fire it twice.
    await expect(canvas.getByRole('button', {
      name: /Attend 3/
    })).toBeDisabled();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Attend 3/
    }));
    await expect(args.onAttend).toHaveBeenCalled();
  }
}`,..._.parameters?.docs?.source}}},v=[`Hidden`,`WithCount`,`SingleEvent`,`Pending`,`TapFiresOnAttend`]})))()}y();export{p as Hidden,g as Pending,h as SingleEvent,_ as TapFiresOnAttend,m as WithCount,v as __namedExportsOrder,f as default};