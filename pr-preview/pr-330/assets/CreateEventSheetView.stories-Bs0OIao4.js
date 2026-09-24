import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{o as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./arrow-left-BuFaN2gi.js";import{n as c,t as l}from"./RecurringEventsWizard-Deppih2j.js";import{n as u,t as d}from"./CreateEntryChooser-CzIG4WSB.js";import{n as f,t as p}from"./CreateEventForm-Bywg-V06.js";import{a as m,o as h,r as g,t as _}from"./sheet-Bw8Nir0d.js";function v({mode:e,eventTypes:t=[],positions:n=[],season:r,today:i,isCreatingSingle:a,isCreatingRecurring:o,singleError:c,recurringError:u,onBack:f,onChooseSingle:h,onChooseRecurring:_,onSubmitSingle:v,onSubmitRecurring:S}){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,y.jsx)(`button`,{type:`button`,onClick:f,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,y.jsx)(s,{size:18})}),(0,y.jsx)(m,{children:b[e]})]}),(0,y.jsx)(g,{className:`mb-4`,children:x[e]}),e===`chooser`&&(0,y.jsx)(d,{onSingle:h,onRecurring:_}),e===`single`&&(0,y.jsx)(p,{eventTypes:t,positions:n,isPending:!!a,onSubmit:v,error:c}),e===`recurring`&&(0,y.jsx)(l,{eventTypes:t,season:r,isPending:!!o,errorMessage:u,today:i,onSubmit:S})]})}var y,b,x;function S(){return(S=e((()=>{o(),h(),f(),c(),u(),y=t(),b={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},x={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},v.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, for authoring a per-event roster override.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}var C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{h(),a(),n(),S(),C=t(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[i({id:`et-1`,name:`Training`,color:`#22c55e`}),i({id:`et-2`,name:`Match`,color:`#3b82f6`})],O={title:`widgets/create-event/CreateEventSheetView`,component:v,args:{eventTypes:D,today:`2026-09-01`,onBack:T(),onChooseSingle:T(),onChooseRecurring:T(),onSubmitSingle:T(),onSubmitRecurring:T()},decorators:[e=>(0,C.jsx)(_,{open:!0,children:e()})]},k={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await w(e.getByText(`Create event`)).toBeInTheDocument(),await w(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await w(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await w(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await w(n.onChooseRecurring).toHaveBeenCalled()}},A={args:{mode:`single`},render:e=>(0,C.jsx)(r,{items:{"Single form":(0,C.jsx)(v,{...e,mode:`single`}),"Single error":(0,C.jsx)(v,{...e,mode:`single`,singleError:`Could not create the event. Please try again.`}),Recurring:(0,C.jsx)(v,{...e,mode:`recurring`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>E(e.getByRole(`region`,{name:t}));await w(r(`Single form`).getByText(`New event`)).toBeInTheDocument(),await w(r(`Single form`).getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(r(`Single form`).getByRole(`button`,{name:`Back to event type`})),await w(n.onBack).toHaveBeenCalledTimes(1),await w(r(`Single error`).getByText(`Could not create the event. Please try again.`)).toBeInTheDocument(),await w(r(`Recurring`).getByText(`New recurring series`)).toBeInTheDocument(),await w(r(`Recurring`).getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(r(`Recurring`).getByRole(`button`,{name:`Back to event type`})),await w(n.onBack).toHaveBeenCalledTimes(2)}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`Data`,`Shells`]})))()}M();export{k as Data,A as Shells,j as __namedExportsOrder,O as default};