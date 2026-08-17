import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{n}from"./iframe-DZxis02t.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{a as i,r as a}from"./event-fixtures-lW1LLQhc.js";import{n as o,t as s}from"./arrow-left-BJN7XO5T.js";import{n as c,t as l}from"./RecurringEventsWizard-DvbEREqn.js";import{n as u,t as d}from"./CreateEntryChooser-BHLP2Pf1.js";import{n as f,t as p}from"./x-C2_fvDsE.js";import{n as m,t as h}from"./utils-CRCkelvV.js";import{n as g,t as _}from"./CreateEventForm-B5Aifnxk.js";import{a as v,c as y,i as b,n as x,o as S,r as C,s as w,t as T}from"./dist-CtHAcysA.js";var E,D,O,k,A,j,M,N,P;function F(){return(F=t((()=>{E=e(n(),1),y(),f(),m(),D=r(),O=T,k=S,A=E.forwardRef(({className:e,...t},n)=>(0,D.jsx)(v,{ref:n,className:h(`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,e),...t})),A.displayName=`SheetOverlay`,j=E.forwardRef(({className:e,children:t,...n},r)=>(0,D.jsxs)(k,{children:[(0,D.jsx)(A,{}),(0,D.jsxs)(C,{ref:r,className:h(`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-2xl border border-border/60 bg-background px-5 pb-8 pt-3 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`,e),...n,children:[(0,D.jsx)(`div`,{className:`mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-border`,"aria-hidden":`true`}),t,(0,D.jsxs)(x,{className:`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring`,children:[(0,D.jsx)(p,{className:`h-4 w-4`}),(0,D.jsx)(`span`,{className:`sr-only`,children:`Close`})]})]})]})),j.displayName=`SheetContent`,M=({className:e,...t})=>(0,D.jsx)(`div`,{className:h(`mb-3 flex flex-col gap-1 text-center`,e),...t}),M.displayName=`SheetHeader`,N=E.forwardRef(({className:e,...t},n)=>(0,D.jsx)(w,{ref:n,className:h(`font-display text-lg font-semibold leading-none tracking-tight`,e),...t})),N.displayName=`SheetTitle`,P=E.forwardRef(({className:e,...t},n)=>(0,D.jsx)(b,{ref:n,className:h(`text-sm text-muted-foreground`,e),...t})),P.displayName=`SheetDescription`,A.__docgenInfo={description:``,methods:[],displayName:`SheetOverlay`},j.__docgenInfo={description:``,methods:[],displayName:`SheetContent`},M.__docgenInfo={description:``,methods:[],displayName:`SheetHeader`},N.__docgenInfo={description:``,methods:[],displayName:`SheetTitle`},P.__docgenInfo={description:``,methods:[],displayName:`SheetDescription`}})))()}function I({mode:e,eventTypes:t=[],positions:n=[],season:r,today:i,isCreatingSingle:a,isCreatingRecurring:o,singleError:c,recurringError:u,onBack:f,onChooseSingle:p,onChooseRecurring:m,onSubmitSingle:h,onSubmitRecurring:g}){return(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,L.jsx)(`button`,{type:`button`,onClick:f,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,L.jsx)(s,{size:18})}),(0,L.jsx)(N,{children:R[e]})]}),(0,L.jsx)(P,{className:`mb-4`,children:z[e]}),e===`chooser`&&(0,L.jsx)(d,{onSingle:p,onRecurring:m}),e===`single`&&(0,L.jsx)(_,{eventTypes:t,positions:n,isPending:!!a,onSubmit:h,error:c}),e===`recurring`&&(0,L.jsx)(l,{eventTypes:t,season:r,isPending:!!o,errorMessage:u,today:i,onSubmit:g})]})}var L,R,z;function B(){return(B=t((()=>{o(),F(),g(),c(),u(),L=r(),R={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},z={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},I.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, for authoring a per-event roster override.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}var V,H,U,W,G,K,q,J,Y,X;function Z(){return(Z=t((()=>{F(),a(),B(),V=r(),{expect:H,fn:U}=__STORYBOOK_MODULE_TEST__,W=[i({id:`et-1`,name:`Training`,color:`#22c55e`}),i({id:`et-2`,name:`Match`,color:`#3b82f6`})],G={title:`widgets/create-event/CreateEventSheetView`,component:I,args:{eventTypes:W,today:`2026-09-01`,onBack:U(),onChooseSingle:U(),onChooseRecurring:U(),onSubmitSingle:U(),onSubmitRecurring:U()},decorators:[e=>(0,V.jsx)(O,{open:!0,children:e()})]},K={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await H(e.getByText(`Create event`)).toBeInTheDocument(),await H(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await H(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await H(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await H(n.onChooseRecurring).toHaveBeenCalled()}},q={args:{mode:`single`},play:async({canvas:e,userEvent:t,args:n})=>{await H(e.getByText(`New event`)).toBeInTheDocument(),await H(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await H(n.onBack).toHaveBeenCalled()}},J={args:{mode:`single`,singleError:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await H(e.getByText(`Could not create the event. Please try again.`)).toBeInTheDocument()}},Y={args:{mode:`recurring`},play:async({canvas:e,userEvent:t,args:n})=>{await H(e.getByText(`New recurring series`)).toBeInTheDocument(),await H(e.getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await H(n.onBack).toHaveBeenCalled()}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    singleError: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not create the event. Please try again.')).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X=[`Chooser`,`SingleForm`,`SingleError`,`Recurring`]})))()}Z();export{K as Chooser,Y as Recurring,J as SingleError,q as SingleForm,X as __namedExportsOrder,G as default};