import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-DMVDr1b2.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{g as i,n as a,t as o}from"./lucide-react-CV9rSiO3.js";import{i as s,n as c,r as l,t as u}from"./input-CJ6uHDnG.js";import{n as d,t as f}from"./label-Br1GlJMz.js";import{a as p,i as m,n as h,o as g,r as _,t as v}from"./select-Cx2d0IYL.js";function y(e){let t=e.trim();return t?/^[a-z][a-z0-9+.-]*:\/\//i.test(t)?t:`https://${t}`:``}var b=e((()=>{}));function x({eventTypes:e,isPending:t,onSubmit:n,error:r}){let[o,s]=(0,S.useState)(``),[c,d]=(0,S.useState)(``),[g,b]=(0,S.useState)(!1),[x,E]=(0,S.useState)(T),[D,O]=(0,S.useState)([]),k=e.find(e=>e.id===o),A=(e,t,n)=>O(r=>r.map((r,i)=>i===e?{...r,[t]:n}:r)),j=()=>O(e=>[...e,{title:``,url:``}]),M=e=>O(t=>t.filter((t,n)=>n!==e));return(0,C.jsxs)(`form`,{onSubmit:e=>{e.preventDefault();let t=new FormData(e.currentTarget),r=new Date(t.get(`startTime`)),i=new Date(r.getTime()+Number(x)*6e4),a=D.map(e=>({title:e.title.trim(),url:y(e.url)})).filter(e=>e.url!==``).map(e=>({title:e.title||void 0,url:e.url}));n({eventTypeId:o,title:c,description:t.get(`description`)||void 0,startTime:r.toISOString(),endTime:i.toISOString(),location:t.get(`location`)||void 0,references:a})},className:`flex flex-col gap-4`,children:[(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`eventTypeId`,children:`Type`}),(0,C.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,C.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border transition-colors`,style:{backgroundColor:k?.color??`transparent`},"aria-hidden":`true`}),(0,C.jsxs)(v,{name:`eventTypeId`,required:!0,value:o,onValueChange:t=>{if(s(t),!g){let n=e.find(e=>e.id===t);n&&d(n.name)}},children:[(0,C.jsx)(m,{id:`eventTypeId`,className:`flex-1`,children:(0,C.jsx)(p,{placeholder:`Select type`})}),(0,C.jsx)(h,{children:e.map(e=>(0,C.jsx)(_,{value:e.id,children:(0,C.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,C.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`title`,children:`Title`}),(0,C.jsx)(u,{id:`title`,name:`title`,required:!0,value:c,onChange:e=>{d(e.target.value),b(!0)},placeholder:k?`e.g. ${k.name}`:`Event title`})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`startTime`,children:`Start time`}),(0,C.jsx)(u,{id:`startTime`,name:`startTime`,type:`datetime-local`,required:!0})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`duration`,children:`Duration`}),(0,C.jsxs)(v,{name:`durationMinutes`,value:x,onValueChange:E,children:[(0,C.jsx)(m,{id:`duration`,children:(0,C.jsx)(p,{})}),(0,C.jsx)(h,{children:w.map(e=>(0,C.jsx)(_,{value:String(e.minutes),children:e.label},e.minutes))})]})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`location`,children:`Location (optional)`}),(0,C.jsx)(u,{id:`location`,name:`location`})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{htmlFor:`description`,children:`Description (optional)`}),(0,C.jsx)(u,{id:`description`,name:`description`})]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(f,{children:`Links (optional)`}),(0,C.jsx)(`p`,{className:`mb-1 text-xs text-muted-foreground`,children:`Add the Nevobo page, match form, and more.`}),(0,C.jsx)(`div`,{className:`flex flex-col gap-2`,children:D.map((e,t)=>(0,C.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,C.jsx)(u,{"aria-label":`Link ${t+1} label`,placeholder:`Label (optional)`,value:e.title,onChange:e=>A(t,`title`,e.target.value),className:`w-2/5`}),(0,C.jsx)(u,{"aria-label":`Link ${t+1} URL`,placeholder:`https://…`,value:e.url,onChange:e=>A(t,`url`,e.target.value),className:`flex-1`}),(0,C.jsx)(l,{type:`button`,variant:`ghost`,size:`icon`,"aria-label":`Remove link ${t+1}`,onClick:()=>M(t),children:(0,C.jsx)(a,{size:16})})]},t))}),(0,C.jsxs)(l,{type:`button`,variant:`ghost`,size:`sm`,className:`mt-2 gap-1.5`,onClick:j,children:[(0,C.jsx)(i,{size:15}),`Add link`]})]}),r&&(0,C.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:r}),(0,C.jsx)(l,{type:`submit`,disabled:t,style:k?.color?{backgroundColor:k.color,borderColor:k.color}:void 0,children:t?`Creating...`:`Create Event`})]})}var S,C,w,T,E=e((()=>{S=t(n(),1),o(),s(),c(),d(),g(),b(),C=r(),w=[{minutes:60,label:`1 hour`},{minutes:90,label:`1.5 hours`},{minutes:120,label:`2 hours`},{minutes:180,label:`3 hours`}],T=`120`,x.__docgenInfo={description:`Presentational create-event form. Owns local form state (type selection + title auto-suggest)
and hands a fully-assembled EventInput up via onSubmit. Data fetching, the mutation, and the
sheet open/close state live in the CreateEventSheet widget — so every form state (idle,
type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).`,methods:[],displayName:`CreateEventForm`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: EventInput) => void`,signature:{arguments:[{type:{name:`EventInput`},name:`values`}],return:{name:`void`}}},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Message to surface when the last create attempt failed; null/undefined hides the alert.`}}}})),D,O,k,A,j,M,N,P,F,I,L,R,z;e((()=>{E(),{expect:D,fn:O,within:k}=__STORYBOOK_MODULE_TEST__,A=[{id:`et-1`,name:`Match`,color:`#3b82f6`},{id:`et-2`,name:`Training`,color:`#22c55e`}],j={title:`features/create-event/CreateEventForm`,component:x,args:{onSubmit:()=>{}}},M={args:{eventTypes:A,isPending:!1},play:async({canvas:e})=>{await D(e.getByText(`Type`)).toBeInTheDocument(),await D(e.getByLabelText(`Title`)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},N={args:{eventTypes:A,isPending:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating...`});await D(t).toBeInTheDocument(),await D(t).toBeDisabled()}},P={args:{eventTypes:A,isPending:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await k(document.body).findByRole(`option`,{name:/Match/})),await D(e.getByLabelText(`Title`)).toHaveValue(`Match`)}},F={args:{eventTypes:[],isPending:!1},play:async({canvas:e})=>{await D(e.getByText(`Select type`)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument()}},I={args:{eventTypes:A,isPending:!1},play:async({canvas:e,userEvent:t})=>{await D(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await D(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await D(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await D(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await D(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await D(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},L={args:{eventTypes:A,isPending:!1,error:`Could not create the event. Please try again.`},play:async({canvas:e})=>{await D(e.getByRole(`alert`)).toHaveTextContent(`Could not create the event. Please try again.`)}},R={args:{eventTypes:A,isPending:!1,onSubmit:O()},play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getAllByRole(`combobox`)[0]),await n.click(await k(document.body).findByRole(`option`,{name:/Match/})),await n.type(t.getByLabelText(`Start time`),`2026-08-01T20:00`),await n.click(t.getByRole(`button`,{name:`Create Event`})),await D(e.onSubmit).toHaveBeenCalledTimes(1);let r=e.onSubmit.mock.calls[0][0];await D((new Date(r.endTime).getTime()-new Date(r.startTime).getTime())/6e4).toBe(120)}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z=[`Default`,`Submitting`,`TypeSelected`,`NoEventTypes`,`AddingLinks`,`CreateFailed`,`DerivesEndTimeFromDuration`]}))();export{I as AddingLinks,L as CreateFailed,M as Default,R as DerivesEndTimeFromDuration,F as NoEventTypes,N as Submitting,P as TypeSelected,z as __namedExportsOrder,j as default};