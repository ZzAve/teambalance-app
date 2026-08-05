import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{n}from"./iframe-BNgfS-0Y.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{i,n as a,r as o,t as s}from"./RecurringEventsWizard-CTBIXB-8.js";import{n as c,t as l}from"./CreateEntryChooser-6usADoPP.js";import{n as u,t as d}from"./x-B_3pnbKz.js";import{n as f,t as p}from"./utils-CRCkelvV.js";import{n as m,t as h}from"./CreateEventForm-BpUcEMQu.js";import{a as g,c as _,i as v,n as y,o as b,r as x,s as S,t as C}from"./dist-D8ZOh9XK.js";var w,T,E,D,O,k,A,j,M;function N(){return(N=t((()=>{w=e(n(),1),_(),u(),f(),T=r(),E=C,D=b,O=w.forwardRef(({className:e,...t},n)=>(0,T.jsx)(g,{ref:n,className:p(`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,e),...t})),O.displayName=`SheetOverlay`,k=w.forwardRef(({className:e,children:t,...n},r)=>(0,T.jsxs)(D,{children:[(0,T.jsx)(O,{}),(0,T.jsxs)(x,{ref:r,className:p(`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-2xl border border-border/60 bg-background px-5 pb-8 pt-3 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`,e),...n,children:[(0,T.jsx)(`div`,{className:`mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-border`,"aria-hidden":`true`}),t,(0,T.jsxs)(y,{className:`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring`,children:[(0,T.jsx)(d,{className:`h-4 w-4`}),(0,T.jsx)(`span`,{className:`sr-only`,children:`Close`})]})]})]})),k.displayName=`SheetContent`,A=({className:e,...t})=>(0,T.jsx)(`div`,{className:p(`mb-3 flex flex-col gap-1 text-center`,e),...t}),A.displayName=`SheetHeader`,j=w.forwardRef(({className:e,...t},n)=>(0,T.jsx)(S,{ref:n,className:p(`font-display text-lg font-semibold leading-none tracking-tight`,e),...t})),j.displayName=`SheetTitle`,M=w.forwardRef(({className:e,...t},n)=>(0,T.jsx)(v,{ref:n,className:p(`text-sm text-muted-foreground`,e),...t})),M.displayName=`SheetDescription`,O.__docgenInfo={description:``,methods:[],displayName:`SheetOverlay`},k.__docgenInfo={description:``,methods:[],displayName:`SheetContent`},A.__docgenInfo={description:``,methods:[],displayName:`SheetHeader`},j.__docgenInfo={description:``,methods:[],displayName:`SheetTitle`},M.__docgenInfo={description:``,methods:[],displayName:`SheetDescription`}})))()}function P({mode:e,eventTypes:t=[],season:n,today:r,isCreatingSingle:i,isCreatingRecurring:a,singleError:c,recurringError:u,onBack:d,onChooseSingle:f,onChooseRecurring:p,onSubmitSingle:m,onSubmitRecurring:g}){return(0,F.jsxs)(F.Fragment,{children:[(0,F.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,F.jsx)(`button`,{type:`button`,onClick:d,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,F.jsx)(o,{size:18})}),(0,F.jsx)(j,{children:I[e]})]}),(0,F.jsx)(M,{className:`mb-4`,children:L[e]}),e===`chooser`&&(0,F.jsx)(l,{onSingle:f,onRecurring:p}),e===`single`&&(0,F.jsx)(h,{eventTypes:t,isPending:!!i,onSubmit:m,error:c}),e===`recurring`&&(0,F.jsx)(s,{eventTypes:t,season:n,isPending:!!a,errorMessage:u,today:r,onSubmit:g})]})}var F,I,L;function R(){return(R=t((()=>{i(),N(),m(),a(),c(),F=r(),I={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},L={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},P.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}var z,B,V,H,U,W,G,K,q;function J(){return(J=t((()=>{N(),R(),z=r(),{expect:B,fn:V}=__STORYBOOK_MODULE_TEST__,H={title:`widgets/create-event/CreateEventSheetView`,component:P,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#22c55e`},{id:`et-2`,name:`Match`,color:`#3b82f6`}],today:`2026-09-01`,onBack:V(),onChooseSingle:V(),onChooseRecurring:V(),onSubmitSingle:V(),onSubmitRecurring:V()},decorators:[e=>(0,z.jsx)(E,{open:!0,children:e()})]},U={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await B(e.getByText(`Create event`)).toBeInTheDocument(),await B(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await B(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await B(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await B(n.onChooseRecurring).toHaveBeenCalled()}},W={args:{mode:`single`},play:async({canvas:e,userEvent:t,args:n})=>{await B(e.getByText(`New event`)).toBeInTheDocument(),await B(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await B(n.onBack).toHaveBeenCalled()}},G={args:{mode:`single`,singleError:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await B(e.getByText(`Could not create the event. Please try again.`)).toBeInTheDocument()}},K={args:{mode:`recurring`},play:async({canvas:e,userEvent:t,args:n})=>{await B(e.getByText(`New recurring series`)).toBeInTheDocument(),await B(e.getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await B(n.onBack).toHaveBeenCalled()}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'chooser'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('Create event')).toBeInTheDocument();
    await expect(canvas.getByText('Choose how you want to add events')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Back to event type'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByText('Single event'));
    await expect(args.onChooseSingle).toHaveBeenCalled();
    await userEvent.click(canvas.getByText('Recurring series'));
    await expect(args.onChooseRecurring).toHaveBeenCalled();
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'single'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('New event')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Back to event type'
    }));
    await expect(args.onBack).toHaveBeenCalled();
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    singleError: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not create the event. Please try again.')).toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'recurring'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByText('New recurring series')).toBeInTheDocument();
    await expect(canvas.getByText('What are you scheduling?')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Back to event type'
    }));
    await expect(args.onBack).toHaveBeenCalled();
  }
}`,...K.parameters?.docs?.source}}},q=[`Chooser`,`SingleForm`,`SingleError`,`Recurring`]})))()}J();export{U as Chooser,K as Recurring,G as SingleError,W as SingleForm,q as __namedExportsOrder,H as default};