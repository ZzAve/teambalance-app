import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-MJ8FevkI.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{H as i,I as a,K as ee,W as te,g as o,t as s}from"./lucide-react-Cz1dTPut.js";import{i as c,n as l,r as u,t as d}from"./input-n3IZEKWy.js";import{n as f,t as p}from"./label-DINOWFfn.js";import{n as m,t as ne}from"./ReferenceRowsEditor-0807ymst.js";import{a as re,i as ie,n as ae,o as h,r as oe,t as se}from"./select-CsCKhaHL.js";import{n as g,t as ce}from"./references-ORpQMdrm.js";import{a as le,i as ue,n as _,o as v,r as y,t as b}from"./MonthCalendarPreview-Cks5i4Zs.js";function x({eventTypes:e,season:t,isPending:n,errorMessage:r,today:s,onSubmit:c}){let[l,f]=(0,O.useState)(0),[m,h]=(0,O.useState)(``),[g,_]=(0,O.useState)(``),[v,x]=(0,O.useState)(!1),[A,N]=(0,O.useState)(`20:30`),[P,F]=(0,O.useState)(90),[I,L]=(0,O.useState)(``),[R,z]=(0,O.useState)(``),[B,V]=(0,O.useState)([]),[H,U]=(0,O.useState)(`WEEKLY`),[W,G]=(0,O.useState)(new Set([`TUESDAY`,`THURSDAY`])),K=(0,O.useMemo)(()=>le(t,s),[t,s]),[q,de]=(0,O.useState)(K.startDate),[J,fe]=(0,O.useState)(K.endDate),Y=e.find(e=>e.id===m),X=Y?.color??M,Z=(0,O.useMemo)(()=>ue({frequency:H,weekdays:w(W),startDate:q,endDate:J},t),[H,W,q,J,t]),Q=!!m&&g.trim().length>0&&!!A&&P>0,$=Z.count>0&&!Z.overCap&&Z.outOfSeasonCount===0,pe=t=>{if(h(t),!v){let n=e.find(e=>e.id===t);n&&_(n.name)}},me=e=>{G(t=>{let n=new Set(t);return n.has(e)?n.size>1&&n.delete(e):n.add(e),n})};return(0,k.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,k.jsx)(S,{step:l}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{className:`font-display text-lg font-semibold leading-tight`,children:j[l].title}),(0,k.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:j[l].sub})]}),l>0&&(0,k.jsxs)(`div`,{className:`rounded-xl border border-blue/15 bg-blue/5 p-3`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`span`,{className:`inline-block h-3 w-3 shrink-0 rounded-full`,style:{backgroundColor:X}}),(0,k.jsx)(`span`,{className:`truncate text-sm font-semibold`,children:g||`Untitled series`}),(0,k.jsxs)(`span`,{className:`ml-auto shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue`,children:[Z.count,` `,Z.count===1?`event`:`events`]})]}),(0,k.jsxs)(`p`,{className:`mt-1 flex items-center gap-1.5 text-xs text-muted-foreground`,children:[(0,k.jsx)(i,{size:12,className:`shrink-0`}),A,` · `,P,` min · `,T(H),` · `,E(W)]})]}),l===0&&(0,k.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-type`,children:`Type`}),(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border`,style:{backgroundColor:Y?.color??`transparent`},"aria-hidden":`true`}),(0,k.jsxs)(se,{value:m,onValueChange:pe,children:[(0,k.jsx)(ie,{id:`rec-type`,className:`flex-1`,children:(0,k.jsx)(re,{placeholder:`Select type`})}),(0,k.jsx)(ae,{children:e.map(e=>(0,k.jsx)(oe,{value:e.id,children:(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-title`,children:`Title`}),(0,k.jsx)(d,{id:`rec-title`,value:g,onChange:e=>{_(e.target.value),x(!0)},placeholder:Y?`e.g. ${Y.name}`:`Series title`})]}),(0,k.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-time`,children:`Time of day`}),(0,k.jsx)(d,{id:`rec-time`,type:`time`,value:A,onChange:e=>N(e.target.value)})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-duration`,children:`Duration (min)`}),(0,k.jsx)(d,{id:`rec-duration`,type:`number`,min:1,value:P,onChange:e=>F(Number(e.target.value))})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-location`,children:`Location (optional)`}),(0,k.jsx)(d,{id:`rec-location`,value:I,onChange:e=>L(e.target.value)})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-description`,children:`Description (optional)`}),(0,k.jsx)(d,{id:`rec-description`,value:R,onChange:e=>z(e.target.value)})]}),(0,k.jsx)(ne,{rows:B,onChange:V,hint:`Shared across every event in the series.`})]}),l===1&&(0,k.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{children:`Repeats`}),(0,k.jsx)(`div`,{className:`mt-1 inline-flex rounded-full bg-muted p-1`,children:[`WEEKLY`,`BIWEEKLY`].map(e=>(0,k.jsx)(`button`,{type:`button`,onClick:()=>U(e),className:[`rounded-full px-4 py-1 text-sm font-medium transition-all`,H===e?`bg-card text-foreground shadow-sm`:`text-muted-foreground hover:text-foreground`].join(` `),children:T(e)},e))})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{children:`On`}),(0,k.jsx)(`div`,{className:`mt-1 flex flex-wrap gap-1.5`,children:y.map(({value:e,short:t})=>{let n=W.has(e);return(0,k.jsx)(`button`,{type:`button`,"aria-pressed":n,onClick:()=>me(e),className:[`rounded-full border px-3 py-1 text-xs font-medium transition-all`,n?`border-blue bg-blue text-white`:`border-border text-muted-foreground hover:border-blue hover:text-blue`].join(` `),children:t},e)})})]}),(0,k.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-start`,children:`From`}),(0,k.jsx)(d,{id:`rec-start`,type:`date`,value:q,onChange:e=>de(e.target.value)})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(p,{htmlFor:`rec-end`,children:`Until`}),(0,k.jsx)(d,{id:`rec-end`,type:`date`,value:J,onChange:e=>fe(e.target.value)})]})]}),(0,k.jsx)(b,{preview:Z,accentColor:X})]}),l===2&&(0,k.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,k.jsxs)(`div`,{className:`rounded-xl border border-border/60 bg-card p-4 shadow-sm`,children:[(0,k.jsxs)(`p`,{className:`flex items-center gap-2 font-display text-lg font-semibold`,children:[(0,k.jsx)(o,{size:18,style:{color:X}}),g||`Untitled series`]}),(0,k.jsxs)(`dl`,{className:`mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm`,children:[(0,k.jsx)(C,{label:`Type`,value:Y?.name??`—`}),(0,k.jsx)(C,{label:`When`,value:`${A} · ${P} min`}),(0,k.jsx)(C,{label:`Repeats`,value:`${T(H)} · ${E(W)}`}),Z.firstDate&&Z.lastDate&&(0,k.jsx)(C,{label:`Dates`,value:`${D(Z.firstDate)} → ${D(Z.lastDate)}`}),I&&(0,k.jsx)(C,{label:`Location`,value:I}),(0,k.jsx)(C,{label:`Total`,value:`${Z.count} ${Z.count===1?`event`:`events`}`,emphasise:!0})]})]}),(0,k.jsx)(b,{preview:Z,accentColor:X}),r&&(0,k.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:r})]}),(0,k.jsxs)(`div`,{className:`flex gap-2`,children:[l>0&&(0,k.jsxs)(u,{type:`button`,variant:`outline`,onClick:()=>f(e=>e-1),className:`flex-1`,children:[(0,k.jsx)(ee,{size:16}),`Back`]}),l<2&&(0,k.jsxs)(u,{type:`button`,onClick:()=>f(e=>e+1),disabled:l===0?!Q:!$,className:`flex-1`,children:[`Next`,(0,k.jsx)(te,{size:16})]}),l===2&&(0,k.jsxs)(u,{type:`button`,onClick:()=>{c({eventTypeId:m,title:g.trim(),description:R.trim()||void 0,location:I.trim()||void 0,timeOfDay:A,durationMinutes:P,references:ce(B),recurrence:{frequency:H,weekdays:w(W),startDate:q,endDate:J}})},disabled:n||!$||!Q,className:`flex-1`,style:{backgroundColor:X,borderColor:X},children:[(0,k.jsx)(a,{size:16}),n?`Creating…`:`Create ${Z.count} ${Z.count===1?`event`:`events`}`]})]})]})}function S({step:e}){return(0,k.jsx)(`div`,{className:`flex items-center justify-center gap-1`,children:A.map((t,n)=>(0,k.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,k.jsx)(`span`,{className:[`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all`,n<e?`bg-green text-white`:n===e?`bg-blue text-white`:`bg-muted text-muted-foreground`].join(` `),children:n<e?(0,k.jsx)(a,{size:13}):n+1}),(0,k.jsx)(`span`,{className:`text-xs font-medium ${n===e?`text-foreground`:`text-muted-foreground`}`,children:t})]}),n<A.length-1&&(0,k.jsx)(`span`,{className:`mx-1 h-px w-5 bg-border`})]},t))})}function C({label:e,value:t,emphasise:n=!1}){return(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(`dt`,{className:`text-muted-foreground`,children:e}),(0,k.jsx)(`dd`,{className:n?`font-semibold text-foreground`:`text-foreground`,children:t})]})}function w(e){return y.map(e=>e.value).filter(t=>e.has(t))}function T(e){return e===`WEEKLY`?`Weekly`:`Bi-weekly`}function E(e){let t=y.filter(t=>e.has(t.value)).map(e=>e.short);return t.length>0?t.join(`, `):`no days`}function D(e){return new Date(`${e}T00:00:00Z`).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`,timeZone:`UTC`})}var O,k,A,j,M,N=e((()=>{O=t(n(),1),s(),c(),l(),f(),h(),m(),g(),v(),_(),k=r(),A=[`Details`,`Repeat`,`Confirm`],j=[{title:`What are you scheduling?`,sub:`Pick a type — we'll pre-fill the rest.`},{title:`How often?`,sub:`Choose the cadence and the days it lands on.`},{title:`Ready to create`,sub:`Review the dates before you confirm.`}],M=`#225C9C`,x.__docgenInfo={description:`Guided 3-step wizard for creating a recurring series (prototype A + B): ① type & details →
② recurrence with a live month-calendar preview → ③ confirm. A persistent context block carries
the chosen summary + running count across steps. Purely presentational — data, the mutation, and
the sheet open/close state live in the CreateEventSheet widget, so each step state is renderable
in isolation (see RecurringEventsWizard.stories.tsx).`,methods:[],displayName:`RecurringEventsWizard`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},season:{required:!0,tsType:{name:`union`,raw:`Season | undefined`,elements:[{name:`Season`},{name:`undefined`}]},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},errorMessage:{required:!1,tsType:{name:`string`},description:``},today:{required:!0,tsType:{name:`string`},description:`Today as 'YYYY-MM-DD', injected so the default date range stays deterministic/testable.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}}));async function P(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await L(document.body).findByRole(`option`,{name:/Training/}))}var F,I,L,R,z,B,V,H,U,W,G;e((()=>{N(),{expect:F,fn:I,within:L}=__STORYBOOK_MODULE_TEST__,R={title:`features/create-recurring-events/RecurringEventsWizard`,component:x,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#225C9C`},{id:`et-2`,name:`Match`,color:`#249E6C`}],season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:I()}},z={play:async({canvas:e})=>{await F(e.getByText(`Details`)).toBeInTheDocument(),await F(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},B={play:async({canvas:e,userEvent:t})=>{await P(e,t),await F(e.getByLabelText(`Title`)).toHaveValue(`Training`),await F(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},V={play:async({canvas:e,userEvent:t})=>{await P(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await F(e.getByText(`On`)).toBeInTheDocument();let n=e.getByTestId(`occurrence-count`);await F(n).toBeInTheDocument(),await F(n).not.toHaveTextContent(`0 events`)}},H={args:{season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`},play:async({canvas:e,userEvent:t})=>{await P(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await F(e.getByText(/over 200 events/i)).toBeInTheDocument(),await F(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},U={play:async({canvas:e,userEvent:t,args:n})=>{await P(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Create/})),await F(n.onSubmit).toHaveBeenCalledWith(F.objectContaining({eventTypeId:`et-1`,title:`Training`}))}},W={args:{isPending:!0},play:async({canvas:e,userEvent:t})=>{await P(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await F(e.getByRole(`button`,{name:/Creating/})).toBeDisabled()}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await expect(canvas.getByLabelText('Title')).toHaveValue('Training');
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeEnabled();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByText('On')).toBeInTheDocument();
    const count = canvas.getByTestId('occurrence-count');
    await expect(count).toBeInTheDocument();
    await expect(count).not.toHaveTextContent('0 events');
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    season: {
      start: '2026-01-01',
      end: '2027-12-31'
    },
    today: '2025-12-01'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByText(/over 200 events/i)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Create/
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      eventTypeId: 'et-1',
      title: 'Training'
    }));
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByRole('button', {
      name: /Creating/
    })).toBeDisabled();
  }
}`,...W.parameters?.docs?.source}}},G=[`DetailsEmpty`,`DetailsFilled`,`RecurrencePreview`,`OverCap`,`CreateSeries`,`Submitting`]}))();export{U as CreateSeries,z as DetailsEmpty,B as DetailsFilled,H as OverCap,V as RecurrencePreview,W as Submitting,G as __namedExportsOrder,R as default};