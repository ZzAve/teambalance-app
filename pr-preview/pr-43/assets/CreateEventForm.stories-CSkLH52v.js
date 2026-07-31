import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-7ra-rxTo.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{a as r,i,n as a,o,r as s,t as c}from"./select-DiiNCvUe.js";import{n as l,t as u}from"./ReferenceRowsEditor-CyebicYv.js";import{i as d,n as f,r as p,t as m}from"./input-DSfQ-uEk.js";import{n as h,t as g}from"./label-oJWJ1dSz.js";import{t as _}from"./references-CZJ2rW2Z.js";function v({eventTypes:e,isPending:t,onSubmit:n,error:o}){let[l,d]=(0,y.useState)(``),[f,h]=(0,y.useState)(``),[v,C]=(0,y.useState)(!1),[w,T]=(0,y.useState)(S),[E,D]=(0,y.useState)([]),O=e.find(e=>e.id===l);return(0,b.jsxs)(`form`,{onSubmit:e=>{e.preventDefault();let t=new FormData(e.currentTarget),r=new Date(t.get(`startTime`)),i=new Date(r.getTime()+Number(w)*6e4);n({eventTypeId:l,title:f,description:t.get(`description`)||void 0,startTime:r.toISOString(),endTime:i.toISOString(),location:t.get(`location`)||void 0,references:_(E)})},className:`flex flex-col gap-4`,children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`eventTypeId`,children:`Type`}),(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border transition-colors`,style:{backgroundColor:O?.color??`transparent`},"aria-hidden":`true`}),(0,b.jsxs)(c,{name:`eventTypeId`,required:!0,value:l,onValueChange:t=>{if(d(t),!v){let n=e.find(e=>e.id===t);n&&h(n.name)}},children:[(0,b.jsx)(i,{id:`eventTypeId`,className:`flex-1`,children:(0,b.jsx)(r,{placeholder:`Select type`})}),(0,b.jsx)(a,{children:e.map(e=>(0,b.jsx)(s,{value:e.id,children:(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`title`,children:`Title`}),(0,b.jsx)(m,{id:`title`,name:`title`,required:!0,value:f,onChange:e=>{h(e.target.value),C(!0)},placeholder:O?`e.g. ${O.name}`:`Event title`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`startTime`,children:`Start time`}),(0,b.jsx)(m,{id:`startTime`,name:`startTime`,type:`datetime-local`,required:!0})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`duration`,children:`Duration`}),(0,b.jsxs)(c,{name:`durationMinutes`,value:w,onValueChange:T,children:[(0,b.jsx)(i,{id:`duration`,children:(0,b.jsx)(r,{})}),(0,b.jsx)(a,{children:x.map(e=>(0,b.jsx)(s,{value:String(e.minutes),children:e.label},e.minutes))})]})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`location`,children:`Location (optional)`}),(0,b.jsx)(m,{id:`location`,name:`location`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(g,{htmlFor:`description`,children:`Description (optional)`}),(0,b.jsx)(m,{id:`description`,name:`description`})]}),(0,b.jsx)(u,{rows:E,onChange:D}),o&&(0,b.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:o}),(0,b.jsx)(p,{type:`submit`,disabled:t,style:O?.color?{backgroundColor:O.color,borderColor:O.color}:void 0,children:t?`Creating...`:`Create Event`})]})}var y,b,x,S;function C(){return(C=e((()=>{y=t(),d(),f(),h(),o(),l(),b=n(),x=[{minutes:60,label:`1 hour`},{minutes:90,label:`1.5 hours`},{minutes:120,label:`2 hours`},{minutes:180,label:`3 hours`}],S=`120`,v.__docgenInfo={description:`Presentational create-event form. Owns local form state (type selection + title auto-suggest)
and hands a fully-assembled EventInput up via onSubmit. Data fetching, the mutation, and the
sheet open/close state live in the CreateEventSheet widget — so every form state (idle,
type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).`,methods:[],displayName:`CreateEventForm`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message to surface when the last create attempt failed; null/undefined hides the alert.`}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{C(),{expect:w,fn:T,within:E}=__STORYBOOK_MODULE_TEST__,D=[{id:`et-1`,name:`Match`,color:`#3b82f6`},{id:`et-2`,name:`Training`,color:`#22c55e`}],O={title:`features/create-event/CreateEventForm`,component:v,args:{onSubmit:()=>{}}},k={args:{eventTypes:D,isPending:!1},play:async({canvas:e})=>{await w(e.getByText(`Type`)).toBeInTheDocument(),await w(e.getByLabelText(`Title`)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},A={args:{eventTypes:D,isPending:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating...`});await w(t).toBeInTheDocument(),await w(t).toBeDisabled()}},j={args:{eventTypes:D,isPending:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await E(document.body).findByRole(`option`,{name:/Match/})),await w(e.getByLabelText(`Title`)).toHaveValue(`Match`)}},M={args:{eventTypes:[],isPending:!1},play:async({canvas:e})=>{await w(e.getByText(`Select type`)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument()}},N={args:{eventTypes:D,isPending:!1},play:async({canvas:e,userEvent:t})=>{await w(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await w(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await w(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await w(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await w(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await w(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},P={args:{eventTypes:D,isPending:!1,error:`Could not create the event. Please try again.`},play:async({canvas:e})=>{let t=e.getByRole(`alert`);await w(t).toHaveTextContent(`Could not create the event. Please try again.`)}},F={args:{eventTypes:D,isPending:!1,onSubmit:T()},play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getAllByRole(`combobox`)[0]),await n.click(await E(document.body).findByRole(`option`,{name:/Match/})),await n.type(t.getByLabelText(`Start time`),`2026-08-01T20:00`),await n.click(t.getByRole(`button`,{name:`Create Event`})),await w(e.onSubmit).toHaveBeenCalledTimes(1);let r=e.onSubmit.mock.calls[0][0],i=(new Date(r.endTime).getTime()-new Date(r.startTime).getTime())/6e4;await w(i).toBe(120)}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Type')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Title')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeEnabled();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    const submit = canvas.getByRole('button', {
      name: 'Creating...'
    });
    await expect(submit).toBeInTheDocument();
    await expect(submit).toBeDisabled();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    // Selecting a type auto-suggests the title (until the user edits it themselves).
    // Two comboboxes now (Type, Duration); Type is first in DOM order.
    await userEvent.click(canvas.getAllByRole('combobox')[0]);
    await userEvent.click(await within(document.body).findByRole('option', {
      name: /Match/
    }));
    await expect(canvas.getByLabelText('Title')).toHaveValue('Match');
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: [],
    isPending: false
  },
  play: async ({
    canvas
  }) => {
    // With no types loaded, the selector shows its placeholder and the form is still rendered.
    await expect(canvas.getByText('Select type')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    // No link rows until "Add link" is clicked.
    await expect(canvas.queryByLabelText('Link 1 URL')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 label')).toBeInTheDocument();

    // A second row is independent.
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 2 URL')).toBeInTheDocument();

    // Removing the first row collapses the list back to one.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Remove link 1'
    }));
    await expect(canvas.queryByLabelText('Link 2 URL')).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false,
    error: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    // A failed create must surface feedback (regression: the dialog previously stayed open silently
    // on a 500). The message is exposed as an alert so assistive tech announces it.
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Could not create the event. Please try again.');
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false,
    onSubmit: fn()
  },
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    // endTime is required by the contract; the form derives it from startTime + the (default 2h)
    // duration so a valid end is always sent — the fix for "create without endTime → 500".
    await userEvent.click(canvas.getAllByRole('combobox')[0]);
    await userEvent.click(await within(document.body).findByRole('option', {
      name: /Match/
    }));
    await userEvent.type(canvas.getByLabelText('Start time'), '2026-08-01T20:00');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create Event'
    }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];
    // Default duration is 2h — assert the span rather than an absolute UTC value so the test is
    // independent of the runner's timezone.
    const spanMinutes = (new Date(submitted.endTime).getTime() - new Date(submitted.startTime).getTime()) / 60_000;
    await expect(spanMinutes).toBe(120);
  }
}`,...F.parameters?.docs?.source}}},I=[`Default`,`Submitting`,`TypeSelected`,`NoEventTypes`,`AddingLinks`,`CreateFailed`,`DerivesEndTimeFromDuration`]})))()}L();export{N as AddingLinks,P as CreateFailed,k as Default,F as DerivesEndTimeFromDuration,M as NoEventTypes,A as Submitting,j as TypeSelected,I as __namedExportsOrder,O as default};