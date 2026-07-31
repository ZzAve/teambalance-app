import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BXclvPvy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{K as i,n as a,t as o}from"./lucide-react-KU5fijHq.js";import{n as s,t as c}from"./utils-D76EcPql.js";import{n as l,t as u}from"./CreateEventForm-BJR6iijk.js";import{n as d,t as f}from"./RecurringEventsWizard-qyYc14Bo.js";import{a as p,c as m,i as h,n as g,o as _,r as v,s as y,t as b}from"./dist-K2GVCUg1.js";import{n as x,t as S}from"./CreateEntryChooser-BA8UDzRE.js";var C,w,T,E,D,O,k,A,j,M=e((()=>{C=t(n(),1),m(),o(),s(),w=r(),T=b,E=_,D=C.forwardRef(({className:e,...t},n)=>(0,w.jsx)(p,{ref:n,className:c(`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,e),...t})),D.displayName=`SheetOverlay`,O=C.forwardRef(({className:e,children:t,...n},r)=>(0,w.jsxs)(E,{children:[(0,w.jsx)(D,{}),(0,w.jsxs)(v,{ref:r,className:c(`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-2xl border border-border/60 bg-background px-5 pb-8 pt-3 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`,e),...n,children:[(0,w.jsx)(`div`,{className:`mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-border`,"aria-hidden":`true`}),t,(0,w.jsxs)(g,{className:`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring`,children:[(0,w.jsx)(a,{className:`h-4 w-4`}),(0,w.jsx)(`span`,{className:`sr-only`,children:`Close`})]})]})]})),O.displayName=`SheetContent`,k=({className:e,...t})=>(0,w.jsx)(`div`,{className:c(`mb-3 flex flex-col gap-1 text-center`,e),...t}),k.displayName=`SheetHeader`,A=C.forwardRef(({className:e,...t},n)=>(0,w.jsx)(y,{ref:n,className:c(`font-display text-lg font-semibold leading-none tracking-tight`,e),...t})),A.displayName=`SheetTitle`,j=C.forwardRef(({className:e,...t},n)=>(0,w.jsx)(h,{ref:n,className:c(`text-sm text-muted-foreground`,e),...t})),j.displayName=`SheetDescription`,D.__docgenInfo={description:``,methods:[],displayName:`SheetOverlay`},O.__docgenInfo={description:``,methods:[],displayName:`SheetContent`},k.__docgenInfo={description:``,methods:[],displayName:`SheetHeader`},A.__docgenInfo={description:``,methods:[],displayName:`SheetTitle`},j.__docgenInfo={description:``,methods:[],displayName:`SheetDescription`}}));function N({mode:e,eventTypes:t=[],season:n,today:r,isCreatingSingle:a,isCreatingRecurring:o,singleError:s,recurringError:c,onBack:l,onChooseSingle:d,onChooseRecurring:p,onSubmitSingle:m,onSubmitRecurring:h}){return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,P.jsx)(`button`,{type:`button`,onClick:l,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,P.jsx)(i,{size:18})}),(0,P.jsx)(A,{children:F[e]})]}),(0,P.jsx)(j,{className:`mb-4`,children:I[e]}),e===`chooser`&&(0,P.jsx)(S,{onSingle:d,onRecurring:p}),e===`single`&&(0,P.jsx)(u,{eventTypes:t,isPending:!!a,onSubmit:m,error:s}),e===`recurring`&&(0,P.jsx)(f,{eventTypes:t,season:n,isPending:!!o,errorMessage:c,today:r,onSubmit:h})]})}var P,F,I,L=e((()=>{o(),M(),l(),d(),x(),P=r(),F={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},I={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},N.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})),R,z,B,V,H,U,W,G,K;e((()=>{M(),L(),R=r(),{expect:z,fn:B}=__STORYBOOK_MODULE_TEST__,V={title:`widgets/create-event/CreateEventSheetView`,component:N,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#22c55e`},{id:`et-2`,name:`Match`,color:`#3b82f6`}],today:`2026-09-01`,onBack:B(),onChooseSingle:B(),onChooseRecurring:B(),onSubmitSingle:B(),onSubmitRecurring:B()},decorators:[e=>(0,R.jsx)(T,{open:!0,children:e()})]},H={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await z(e.getByText(`Create event`)).toBeInTheDocument(),await z(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await z(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await z(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await z(n.onChooseRecurring).toHaveBeenCalled()}},U={args:{mode:`single`},play:async({canvas:e,userEvent:t,args:n})=>{await z(e.getByText(`New event`)).toBeInTheDocument(),await z(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await z(n.onBack).toHaveBeenCalled()}},W={args:{mode:`single`,singleError:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await z(e.getByText(`Could not create the event. Please try again.`)).toBeInTheDocument()}},G={args:{mode:`recurring`},play:async({canvas:e,userEvent:t,args:n})=>{await z(e.getByText(`New recurring series`)).toBeInTheDocument(),await z(e.getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await z(n.onBack).toHaveBeenCalled()}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    singleError: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not create the event. Please try again.')).toBeInTheDocument();
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K=[`Chooser`,`SingleForm`,`SingleError`,`Recurring`]}))();export{H as Chooser,G as Recurring,W as SingleError,U as SingleForm,K as __namedExportsOrder,V as default};