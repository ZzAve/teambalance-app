import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./check-WYPLXHF_.js";import{n as i,t as a}from"./button-D-h9eELt.js";function o(e){let t=e.toLowerCase();return/(s|x|z|ch|sh)$/.test(t)?`${t}es`:/[^aeiou]y$/.test(t)?`${t.slice(0,-1)}ies`:`${t}s`}function s(e,t){return`Attend ${e} ${t===null?e===1?`event`:`events`:e===1?t.toLowerCase():o(t)}`}function c({count:e,typeName:t=null,onAttend:n,isPending:i=!1}){return e===0?null:(0,l.jsxs)(a,{variant:`outline`,size:`sm`,onClick:n,disabled:i,className:`shrink-0 border-green/30 text-green hover:bg-green/10`,children:[(0,l.jsx)(r,{size:16}),s(e,t)]})}var l;function u(){return(u=e((()=>{n(),i(),l=t(),c.__docgenInfo={description:`The "Attend N" button (ADR-0020). Presentational: the count and the callback come in as props, the
mutation and the Undo toast live in the container.

The label *is* the confirmation — there is no modal, so both the number and, when the batch is all
one kind, the type must be visible before the tap. At zero there is nothing to fill, so the button
renders nothing at all rather than a disabled control: a greyed-out "Attend 0" is noise on a list
where every event is already answered.`,methods:[],displayName:`BulkAttendButtonView`,props:{count:{required:!0,tsType:{name:`number`},description:`How many shown, unanswered, future events the tap would fill.`},typeName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The one event type the batch covers, or null when it spans several.`,defaultValue:{value:`null`,computed:!1}},onAttend:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{u(),{expect:d,fn:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`features/bulk-attend/BulkAttendButtonView`,component:c,args:{count:3,onAttend:f()}},h={args:{count:0},play:async({canvasElement:e})=>{await d(p(e).queryByRole(`button`)).not.toBeInTheDocument()}},g={play:async({canvas:e})=>{await d(e.getByRole(`button`,{name:/Attend 3 events/})).toBeInTheDocument()}},_={args:{count:1},play:async({canvas:e})=>{await d(e.getByRole(`button`,{name:`Attend 1 event`})).toBeInTheDocument()}},v={args:{count:4,typeName:`Training`},play:async({canvas:e})=>{await d(e.getByRole(`button`,{name:`Attend 4 trainings`})).toBeInTheDocument()}},y={args:{isPending:!0},play:async({canvas:e})=>{await d(e.getByRole(`button`,{name:/Attend 3 events/})).toBeDisabled()}},b={play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:/Attend 3 events/})),await d(t.onAttend).toHaveBeenCalled()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    count: 0
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /Attend 3 events/
    })).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    count: 1
  },
  play: async ({
    canvas
  }) => {
    // Singular noun, so the label never reads "Attend 1 events".
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 event'
    })).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    count: 4,
    typeName: 'Training'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 4 trainings'
    })).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    // Disabled while the batch is in flight, so a double-tap can't fire it twice.
    await expect(canvas.getByRole('button', {
      name: /Attend 3 events/
    })).toBeDisabled();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Attend 3 events/
    }));
    await expect(args.onAttend).toHaveBeenCalled();
  }
}`,...b.parameters?.docs?.source}}},x=[`Hidden`,`WithCount`,`SingleEvent`,`SingleType`,`Pending`,`TapFiresOnAttend`]})))()}S();export{h as Hidden,y as Pending,_ as SingleEvent,v as SingleType,b as TapFiresOnAttend,g as WithCount,x as __namedExportsOrder,m as default};