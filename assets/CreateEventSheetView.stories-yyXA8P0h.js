import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,r as n}from"./event-fixtures-CuRrQuRB.js";import{n as r,t as i}from"./arrow-left-D2saTF1k.js";import{n as a,t as o}from"./RecurringEventsWizard-EvXFbQMM.js";import{n as s,t as c}from"./CreateEntryChooser-B-qtvuV9.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./CreateEventForm-C_aY5C2C.js";import{a as f,o as p,r as m,t as h}from"./sheet-CdKCSDs8.js";function g({mode:e,eventTypes:t=[],positions:n=[],season:r,today:a,isCreatingSingle:s,isCreatingRecurring:l,singleError:u,recurringError:p,onBack:h,onChooseSingle:g,onChooseRecurring:b,onSubmitSingle:x,onSubmitRecurring:S}){return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)(`div`,{className:`relative mb-1 flex items-center justify-center`,children:[(e===`single`||e===`recurring`)&&(0,_.jsx)(`button`,{type:`button`,onClick:h,"aria-label":`Back to event type`,className:`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted`,children:(0,_.jsx)(i,{size:18})}),(0,_.jsx)(f,{children:v[e]})]}),(0,_.jsx)(m,{className:`mb-4`,children:y[e]}),e===`chooser`&&(0,_.jsx)(c,{onSingle:g,onRecurring:b}),e===`single`&&(0,_.jsx)(d,{eventTypes:t,positions:n,isPending:!!s,onSubmit:x,error:u}),e===`recurring`&&(0,_.jsx)(o,{eventTypes:t,season:r,isPending:!!l,errorMessage:p,today:a,onSubmit:S})]})}var _,v,y;function b(){return(b=e((()=>{r(),p(),u(),a(),s(),_=l(),v={chooser:`Create event`,single:`New event`,recurring:`New recurring series`},y={chooser:`Choose how you want to add events`,single:`A one-off training, match, or other event`,recurring:`A weekly or bi-weekly series across the season`},g.__docgenInfo={description:`Presentational body of the create-event sheet: the mode-dependent header (back step + title +
description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
purely from props as a story, with no network. Composes already-presentational child features
(CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
this View covers only the sheet's own navigation + wiring seam. See ADR-0017.`,methods:[],displayName:`CreateEventSheetView`,props:{mode:{required:!0,tsType:{name:`union`,raw:`'chooser' | 'single' | 'recurring'`,elements:[{name:`literal`,value:`'chooser'`},{name:`literal`,value:`'single'`},{name:`literal`,value:`'recurring'`}]},description:``},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`Event types for the pickers; defaults to an empty list while the container's query is in flight.`,defaultValue:{value:`[]`,computed:!1}},positions:{required:!1,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:`The team's position vocabulary, for authoring a per-event roster override.`,defaultValue:{value:`[]`,computed:!1}},season:{required:!1,tsType:{name:`Season`},description:``},today:{required:!0,tsType:{name:`string`},description:``},isCreatingSingle:{required:!1,tsType:{name:`boolean`},description:``},isCreatingRecurring:{required:!1,tsType:{name:`boolean`},description:``},singleError:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message when the last single-create attempt failed; null hides the alert.`},recurringError:{required:!1,tsType:{name:`string`},description:`Message when the last recurring-create attempt failed; undefined hides the alert.`},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmitSingle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},onSubmitRecurring:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}var x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{p(),n(),b(),x=l(),{expect:S,fn:C}=__STORYBOOK_MODULE_TEST__,w=[t({id:`et-1`,name:`Training`,color:`#22c55e`}),t({id:`et-2`,name:`Match`,color:`#3b82f6`})],T={title:`widgets/create-event/CreateEventSheetView`,component:g,args:{eventTypes:w,today:`2026-09-01`,onBack:C(),onChooseSingle:C(),onChooseRecurring:C(),onSubmitSingle:C(),onSubmitRecurring:C()},decorators:[e=>(0,x.jsx)(h,{open:!0,children:e()})]},E={args:{mode:`chooser`},play:async({canvas:e,userEvent:t,args:n})=>{await S(e.getByText(`Create event`)).toBeInTheDocument(),await S(e.getByText(`Choose how you want to add events`)).toBeInTheDocument(),await S(e.queryByRole(`button`,{name:`Back to event type`})).not.toBeInTheDocument(),await t.click(e.getByText(`Single event`)),await S(n.onChooseSingle).toHaveBeenCalled(),await t.click(e.getByText(`Recurring series`)),await S(n.onChooseRecurring).toHaveBeenCalled()}},D={args:{mode:`single`},play:async({canvas:e,userEvent:t,args:n})=>{await S(e.getByText(`New event`)).toBeInTheDocument(),await S(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await S(n.onBack).toHaveBeenCalled()}},O={args:{mode:`single`,singleError:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await S(e.getByText(`Could not create the event. Please try again.`)).toBeInTheDocument()}},k={args:{mode:`recurring`},play:async({canvas:e,userEvent:t,args:n})=>{await S(e.getByText(`New recurring series`)).toBeInTheDocument(),await S(e.getByText(`What are you scheduling?`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Back to event type`})),await S(n.onBack).toHaveBeenCalled()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    singleError: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not create the event. Please try again.')).toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`Chooser`,`SingleForm`,`SingleError`,`Recurring`]})))()}j();export{E as Chooser,k as Recurring,O as SingleError,D as SingleForm,A as __namedExportsOrder,T as default};