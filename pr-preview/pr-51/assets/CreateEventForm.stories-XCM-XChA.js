import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-BiWk_8Xc.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{i,n as a,r as o,t as s}from"./input-C9onGI5X.js";import{n as c,t as l}from"./label-D-2_p5mX.js";import{n as u,t as d}from"./ReferenceRowsEditor-D9WlkZj8.js";import{a as f,i as p,n as m,o as h,r as g,t as _}from"./select-C42gHint.js";import{n as v,t as y}from"./references-bEcxwn2k.js";function b({eventTypes:e,isPending:t,onSubmit:n,error:r}){let[i,a]=(0,x.useState)(``),[c,u]=(0,x.useState)(``),[h,v]=(0,x.useState)(!1),[b,T]=(0,x.useState)(w),[E,D]=(0,x.useState)([]),O=e.find(e=>e.id===i);return(0,S.jsxs)(`form`,{onSubmit:e=>{e.preventDefault();let t=new FormData(e.currentTarget),r=new Date(t.get(`startTime`)),a=new Date(r.getTime()+Number(b)*6e4);n({eventTypeId:i,title:c,description:t.get(`description`)||void 0,startTime:r.toISOString(),endTime:a.toISOString(),location:t.get(`location`)||void 0,references:y(E)})},className:`flex flex-col gap-4`,children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`eventTypeId`,children:`Type`}),(0,S.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,S.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border transition-colors`,style:{backgroundColor:O?.color??`transparent`},"aria-hidden":`true`}),(0,S.jsxs)(_,{name:`eventTypeId`,required:!0,value:i,onValueChange:t=>{if(a(t),!h){let n=e.find(e=>e.id===t);n&&u(n.name)}},children:[(0,S.jsx)(p,{id:`eventTypeId`,className:`flex-1`,children:(0,S.jsx)(f,{placeholder:`Select type`})}),(0,S.jsx)(m,{children:e.map(e=>(0,S.jsx)(g,{value:e.id,children:(0,S.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,S.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`title`,children:`Title`}),(0,S.jsx)(s,{id:`title`,name:`title`,required:!0,value:c,onChange:e=>{u(e.target.value),v(!0)},placeholder:O?`e.g. ${O.name}`:`Event title`})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`startTime`,children:`Start time`}),(0,S.jsx)(s,{id:`startTime`,name:`startTime`,type:`datetime-local`,required:!0})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`duration`,children:`Duration`}),(0,S.jsxs)(_,{name:`durationMinutes`,value:b,onValueChange:T,children:[(0,S.jsx)(p,{id:`duration`,children:(0,S.jsx)(f,{})}),(0,S.jsx)(m,{children:C.map(e=>(0,S.jsx)(g,{value:String(e.minutes),children:e.label},e.minutes))})]})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`location`,children:`Location (optional)`}),(0,S.jsx)(s,{id:`location`,name:`location`})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(l,{htmlFor:`description`,children:`Description (optional)`}),(0,S.jsx)(s,{id:`description`,name:`description`})]}),(0,S.jsx)(d,{rows:E,onChange:D}),r&&(0,S.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:r}),(0,S.jsx)(o,{type:`submit`,disabled:t,style:O?.color?{backgroundColor:O.color,borderColor:O.color}:void 0,children:t?`Creating...`:`Create Event`})]})}var x,S,C,w,T=e((()=>{x=t(n(),1),i(),a(),c(),h(),u(),v(),S=r(),C=[{minutes:60,label:`1 hour`},{minutes:90,label:`1.5 hours`},{minutes:120,label:`2 hours`},{minutes:180,label:`3 hours`}],w=`120`,b.__docgenInfo={description:`Presentational create-event form. Owns local form state (type selection + title auto-suggest)
and hands a fully-assembled EventInput up via onSubmit. Data fetching, the mutation, and the
sheet open/close state live in the CreateEventSheet widget — so every form state (idle,
type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).`,methods:[],displayName:`CreateEventForm`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message to surface when the last create attempt failed; null/undefined hides the alert.`}}}})),E,D,O,k,A,j,M,N,P,F,I,L,R;e((()=>{T(),{expect:E,fn:D,within:O}=__STORYBOOK_MODULE_TEST__,k=[{id:`et-1`,name:`Match`,color:`#3b82f6`},{id:`et-2`,name:`Training`,color:`#22c55e`}],A={title:`features/create-event/CreateEventForm`,component:b,args:{onSubmit:()=>{}}},j={args:{eventTypes:k,isPending:!1},play:async({canvas:e})=>{await E(e.getByText(`Type`)).toBeInTheDocument(),await E(e.getByLabelText(`Title`)).toBeInTheDocument(),await E(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},M={args:{eventTypes:k,isPending:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating...`});await E(t).toBeInTheDocument(),await E(t).toBeDisabled()}},N={args:{eventTypes:k,isPending:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await O(document.body).findByRole(`option`,{name:/Match/})),await E(e.getByLabelText(`Title`)).toHaveValue(`Match`)}},P={args:{eventTypes:[],isPending:!1},play:async({canvas:e})=>{await E(e.getByText(`Select type`)).toBeInTheDocument(),await E(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument()}},F={args:{eventTypes:k,isPending:!1},play:async({canvas:e,userEvent:t})=>{await E(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await E(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await E(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await E(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await E(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await E(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},I={args:{eventTypes:k,isPending:!1,error:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await E(e.getByRole(`alert`)).toHaveTextContent(`Could not create the event. Please try again.`)}},L={args:{eventTypes:k,isPending:!1,onSubmit:D()},play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getAllByRole(`combobox`)[0]),await n.click(await O(document.body).findByRole(`option`,{name:/Match/})),await n.type(t.getByLabelText(`Start time`),`2026-08-01T20:00`),await n.click(t.getByRole(`button`,{name:`Create Event`})),await E(e.onSubmit).toHaveBeenCalledTimes(1);let r=e.onSubmit.mock.calls[0][0];await E((new Date(r.endTime).getTime()-new Date(r.startTime).getTime())/6e4).toBe(120)}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R=[`Default`,`Submitting`,`TypeSelected`,`NoEventTypes`,`AddingLinks`,`CreateFailed`,`DerivesEndTimeFromDuration`]}))();export{F as AddingLinks,I as CreateFailed,j as Default,L as DerivesEndTimeFromDuration,P as NoEventTypes,M as Submitting,N as TypeSelected,R as __namedExportsOrder,A as default};