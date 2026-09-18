import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n}from"./iframe-DrbUYmN2.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D1VBtmRF.js";import{o,r as s}from"./event-fixtures-CuRrQuRB.js";import{n as c,t as l}from"./arrow-left-BeqqyFMb.js";import{n as u,t as d}from"./RecurringEventsWizard-grraf7qw.js";import{n as f,t as p}from"./CreateEntryChooser-CsFMFHJ5.js";import{n as m,t as h}from"./x-Dk-FfWfl.js";import{n as g,t as _}from"./utils-BTemNN_S.js";import{n as v,t as y}from"./CreateEventForm-DBZuW_sz.js";import{a as b,c as x,i as S,n as C,o as w,r as T,s as E,t as D}from"./dist-BjQf5dJe.js";var O,k,A,j,M,N,P,F,I;function L(){return(L=t((()=>{O=e(n(),1),x(),m(),g(),k=r(),A=D,j=w,M=O.forwardRef(({className:e,...t},n)=>(0,k.jsx)(b,{ref:n,className:_(`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,e),...t})),M.displayName=`SheetOverlay`,N=O.forwardRef(({className:e,children:t,...n},r)=>(0,k.jsxs)(j,{children:[(0,k.jsx)(M,{}),(0,k.jsxs)(T,{ref:r,className:_(`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-2xl border border-border/60 bg-background px-5 pb-8 pt-3 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`,e),...n,children:[(0,k.jsx)(`div`,{className:`mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-border`,"aria-hidden":`true`}),t,(0,k.jsxs)(C,{className:`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring`,children:[(0,k.jsx)(h,{className:`h-4 w-4`}),(0,k.jsx)(`span`,{className:`sr-only`,children:`Close`})]})]})]})),N.displayName=`SheetContent`,P=({className:e,...t})=>(0,k.jsx)(`div`,{className:_(`mb-3 flex flex-col gap-1 text-center`,e),...t}),P.displayName=`SheetHeader`,F=O.forwardRef(({className:e,...t},n)=>(0,k.jsx)(E,{ref:n,className:_(`font-display text-lead font-semibold leading-none tracking-tight`,e),...t})),F.displayName=`SheetTitle`,I=O.forwardRef(({className:e,...t},n)=>(0,k.jsx)(S,{ref:n,className:_(`text-small text-muted-foreground`,e),...t})),I.displayName=`SheetDescription`,M.__docgenInfo={description:``,methods:[],displayName:`SheetOverlay`},N.__docgenInfo={description:``,methods:[],displayName:`SheetContent`},P.__docgenInfo={description:``,methods:[],displayName:`SheetHeader`},F.__docgenInfo={description:``,methods:[],displayName:`SheetTitle`},I.__docgenInfo={description:``,methods:[],displayName:`SheetDescription`}})))()}function R({mode:e,eventTypes:t=[],positions:n=[],season:r,today:i,isCreatingSingle:a,isCreatingRecurring:o,singleError:s,recurringError:c,onBack:u,onChooseSingle:f,onChooseRecurring:m,onSubmitSingle:h,onSubmitRecurring:g}){return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,z.jsx)(`button`,{type:`button`,onClick:u,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,z.jsx)(l,{size:18})}),(0,z.jsx)(F,{children:B[e]})]}),(0,z.jsx)(I,{className:`mb-4`,children:V[e]}),e===`chooser`&&(0,z.jsx)(p,{onSingle:f,onRecurring:m}),e===`single`&&(0,z.jsx)(y,{eventTypes:t,positions:n,isPending:!!a,onSubmit:h,error:s}),e===`recurring`&&(0,z.jsx)(d,{eventTypes:t,season:r,isPending:!!o,errorMessage:c,today:i,onSubmit:g})]})}var z,B,V;function H(){return(H=t((()=>{c(),L(),v(),u(),f(),z=r(),B={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},V={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},R.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, for authoring a per-event roster override.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}var U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=t((()=>{L(),s(),i(),H(),U=r(),{expect:W,fn:G,within:K}=__STORYBOOK_MODULE_TEST__,q=[o({id:`et-1`,name:`Training`,color:`#22c55e`}),o({id:`et-2`,name:`Match`,color:`#3b82f6`})],J={title:`widgets/create-event/CreateEventSheetView`,component:R,args:{eventTypes:q,today:`2026-09-01`,onBack:G(),onChooseSingle:G(),onChooseRecurring:G(),onSubmitSingle:G(),onSubmitRecurring:G()},decorators:[e=>(0,U.jsx)(A,{open:!0,children:e()})]},Y={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await W(e.getByText(`Create event`)).toBeInTheDocument(),await W(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await W(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await W(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await W(n.onChooseRecurring).toHaveBeenCalled()}},X={args:{mode:`single`},render:e=>(0,U.jsx)(a,{items:{"Single form":(0,U.jsx)(R,{...e,mode:`single`}),"Single error":(0,U.jsx)(R,{...e,mode:`single`,singleError:`Could not create the event. Please try again.`}),Recurring:(0,U.jsx)(R,{...e,mode:`recurring`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>K(e.getByRole(`region`,{name:t}));await W(r(`Single form`).getByText(`New event`)).toBeInTheDocument(),await W(r(`Single form`).getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(r(`Single form`).getByRole(`button`,{name:`Back to event type`})),await W(n.onBack).toHaveBeenCalledTimes(1),await W(r(`Single error`).getByText(`Could not create the event. Please try again.`)).toBeInTheDocument(),await W(r(`Recurring`).getByText(`New recurring series`)).toBeInTheDocument(),await W(r(`Recurring`).getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(r(`Recurring`).getByRole(`button`,{name:`Back to event type`})),await W(n.onBack).toHaveBeenCalledTimes(2)}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  // \`mode\` has no default; a top-level value lets \`render\` build its own instances without
  // TypeScript flagging the required prop as missing.
  args: {
    mode: 'single'
  },
  render: args => <Stack items={{
    // The single-event form, with a back step to the chooser.
    'Single form': <CreateEventSheetView {...args} mode="single" />,
    // A failed single-create surfaces inline in the form.
    'Single error': <CreateEventSheetView {...args} mode="single" singleError="Could not create the event. Please try again." />,
    // The recurring-series wizard opens on its first step, with a back step to the chooser.
    Recurring: <CreateEventSheetView {...args} mode="recurring" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Single form').getByText('New event')).toBeInTheDocument();
    await expect(region('Single form').getByRole('button', {
      name: 'Create Event'
    })).toBeInTheDocument();
    await userEvent.click(region('Single form').getByRole('button', {
      name: 'Back to event type'
    }));
    await expect(args.onBack).toHaveBeenCalledTimes(1);
    await expect(region('Single error').getByText('Could not create the event. Please try again.')).toBeInTheDocument();
    await expect(region('Recurring').getByText('New recurring series')).toBeInTheDocument();
    await expect(region('Recurring').getByText('What are you scheduling?')).toBeInTheDocument();
    await userEvent.click(region('Recurring').getByRole('button', {
      name: 'Back to event type'
    }));
    await expect(args.onBack).toHaveBeenCalledTimes(2);
  }
}`,...X.parameters?.docs?.source}}},Z=[`Data`,`Shells`]})))()}Q();export{Y as Data,X as Shells,Z as __namedExportsOrder,J as default};