import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-3HOVDQts.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{B as i,H as a,M as o,R as ee,m as s,t as c}from"./lucide-react-P_65KJz1.js";import{i as l,n as u,r as d,t as f}from"./input--gx_CYUx.js";import{n as p,t as m}from"./label-rXoExVYJ.js";import{n as h,t as te}from"./ReferenceRowsEditor-BzDC0NJy.js";import{a as ne,i as re,n as ie,o as g,r as ae,t as oe}from"./select-Drm5eT6m.js";import{n as _,t as se}from"./references-bEcxwn2k.js";import{a as ce,i as le,n as v,o as y,r as b,t as x}from"./MonthCalendarPreview-DQfOXeI8.js";function S({eventTypes:e,season:t,isPending:n,errorMessage:r,today:c,onSubmit:l}){let[u,p]=(0,k.useState)(0),[h,g]=(0,k.useState)(``),[_,v]=(0,k.useState)(``),[y,S]=(0,k.useState)(!1),[j,P]=(0,k.useState)(`20:30`),[F,I]=(0,k.useState)(90),[L,R]=(0,k.useState)(``),[z,B]=(0,k.useState)(``),[V,H]=(0,k.useState)([]),[U,W]=(0,k.useState)(`WEEKLY`),[G,ue]=(0,k.useState)(new Set([`TUESDAY`,`THURSDAY`])),K=(0,k.useMemo)(()=>ce(t,c),[t,c]),[q,de]=(0,k.useState)(K.startDate),[J,fe]=(0,k.useState)(K.endDate),Y=e.find(e=>e.id===h),X=Y?.color??N,Z=(0,k.useMemo)(()=>le({frequency:U,weekdays:T(G),startDate:q,endDate:J},t),[U,G,q,J,t]),Q=!!h&&_.trim().length>0&&!!j&&F>0,$=Z.count>0&&!Z.overCap&&Z.outOfSeasonCount===0,pe=t=>{if(g(t),!y){let n=e.find(e=>e.id===t);n&&v(n.name)}},me=e=>{ue(t=>{let n=new Set(t);return n.has(e)?n.size>1&&n.delete(e):n.add(e),n})};return(0,A.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,A.jsx)(C,{step:u}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{className:`font-display text-lg font-semibold leading-tight`,children:M[u].title}),(0,A.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:M[u].sub})]}),u>0&&(0,A.jsxs)(`div`,{className:`rounded-xl border border-blue/15 bg-blue/5 p-3`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(`span`,{className:`inline-block h-3 w-3 shrink-0 rounded-full`,style:{backgroundColor:X}}),(0,A.jsx)(`span`,{className:`truncate text-sm font-semibold`,children:_||`Untitled series`}),(0,A.jsxs)(`span`,{className:`ml-auto shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue`,children:[Z.count,` `,Z.count===1?`event`:`events`]})]}),(0,A.jsxs)(`p`,{className:`mt-1 flex items-center gap-1.5 text-xs text-muted-foreground`,children:[(0,A.jsx)(ee,{size:12,className:`shrink-0`}),j,` · `,F,` min · `,E(U),` · `,D(G)]})]}),u===0&&(0,A.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-type`,children:`Type`}),(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border`,style:{backgroundColor:Y?.color??`transparent`},"aria-hidden":`true`}),(0,A.jsxs)(oe,{value:h,onValueChange:pe,children:[(0,A.jsx)(re,{id:`rec-type`,className:`flex-1`,children:(0,A.jsx)(ne,{placeholder:`Select type`})}),(0,A.jsx)(ie,{children:e.map(e=>(0,A.jsx)(ae,{value:e.id,children:(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-title`,children:`Title`}),(0,A.jsx)(f,{id:`rec-title`,value:_,onChange:e=>{v(e.target.value),S(!0)},placeholder:Y?`e.g. ${Y.name}`:`Series title`})]}),(0,A.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-time`,children:`Time of day`}),(0,A.jsx)(f,{id:`rec-time`,type:`time`,value:j,onChange:e=>P(e.target.value)})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-duration`,children:`Duration (min)`}),(0,A.jsx)(f,{id:`rec-duration`,type:`number`,min:1,value:F,onChange:e=>I(Number(e.target.value))})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-location`,children:`Location (optional)`}),(0,A.jsx)(f,{id:`rec-location`,value:L,onChange:e=>R(e.target.value)})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-description`,children:`Description (optional)`}),(0,A.jsx)(f,{id:`rec-description`,value:z,onChange:e=>B(e.target.value)})]}),(0,A.jsx)(te,{rows:V,onChange:H,hint:`Shared across every event in the series.`})]}),u===1&&(0,A.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{children:`Repeats`}),(0,A.jsx)(`div`,{className:`mt-1 inline-flex rounded-full bg-muted p-1`,children:[`WEEKLY`,`BIWEEKLY`].map(e=>(0,A.jsx)(`button`,{type:`button`,onClick:()=>W(e),className:[`rounded-full px-4 py-1 text-sm font-medium transition-all`,U===e?`bg-card text-foreground shadow-sm`:`text-muted-foreground hover:text-foreground`].join(` `),children:E(e)},e))})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{children:`On`}),(0,A.jsx)(`div`,{className:`mt-1 flex flex-wrap gap-1.5`,children:b.map(({value:e,short:t})=>{let n=G.has(e);return(0,A.jsx)(`button`,{type:`button`,"aria-pressed":n,onClick:()=>me(e),className:[`rounded-full border px-3 py-1 text-xs font-medium transition-all`,n?`border-blue bg-blue text-white`:`border-border text-muted-foreground hover:border-blue hover:text-blue`].join(` `),children:t},e)})})]}),(0,A.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-start`,children:`From`}),(0,A.jsx)(f,{id:`rec-start`,type:`date`,value:q,onChange:e=>de(e.target.value)})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(m,{htmlFor:`rec-end`,children:`Until`}),(0,A.jsx)(f,{id:`rec-end`,type:`date`,value:J,onChange:e=>fe(e.target.value)})]})]}),(0,A.jsx)(x,{preview:Z,accentColor:X})]}),u===2&&(0,A.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,A.jsxs)(`div`,{className:`rounded-xl border border-border/60 bg-card p-4 shadow-sm`,children:[(0,A.jsxs)(`p`,{className:`flex items-center gap-2 font-display text-lg font-semibold`,children:[(0,A.jsx)(s,{size:18,style:{color:X}}),_||`Untitled series`]}),(0,A.jsxs)(`dl`,{className:`mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm`,children:[(0,A.jsx)(w,{label:`Type`,value:Y?.name??`—`}),(0,A.jsx)(w,{label:`When`,value:`${j} · ${F} min`}),(0,A.jsx)(w,{label:`Repeats`,value:`${E(U)} · ${D(G)}`}),Z.firstDate&&Z.lastDate&&(0,A.jsx)(w,{label:`Dates`,value:`${O(Z.firstDate)} → ${O(Z.lastDate)}`}),L&&(0,A.jsx)(w,{label:`Location`,value:L}),(0,A.jsx)(w,{label:`Total`,value:`${Z.count} ${Z.count===1?`event`:`events`}`,emphasise:!0})]})]}),(0,A.jsx)(x,{preview:Z,accentColor:X}),r&&(0,A.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:r})]}),(0,A.jsxs)(`div`,{className:`flex gap-2`,children:[u>0&&(0,A.jsxs)(d,{type:`button`,variant:`outline`,onClick:()=>p(e=>e-1),className:`flex-1`,children:[(0,A.jsx)(a,{size:16}),`Back`]}),u<2&&(0,A.jsxs)(d,{type:`button`,onClick:()=>p(e=>e+1),disabled:u===0?!Q:!$,className:`flex-1`,children:[`Next`,(0,A.jsx)(i,{size:16})]}),u===2&&(0,A.jsxs)(d,{type:`button`,onClick:()=>{l({eventTypeId:h,title:_.trim(),description:z.trim()||void 0,location:L.trim()||void 0,timeOfDay:j,durationMinutes:F,references:se(V),recurrence:{frequency:U,weekdays:T(G),startDate:q,endDate:J}})},disabled:n||!$||!Q,className:`flex-1`,style:{backgroundColor:X,borderColor:X},children:[(0,A.jsx)(o,{size:16}),n?`Creating…`:`Create ${Z.count} ${Z.count===1?`event`:`events`}`]})]})]})}function C({step:e}){return(0,A.jsx)(`div`,{className:`flex items-center justify-center gap-1`,children:j.map((t,n)=>(0,A.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,A.jsx)(`span`,{className:[`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all`,n<e?`bg-green text-white`:n===e?`bg-blue text-white`:`bg-muted text-muted-foreground`].join(` `),children:n<e?(0,A.jsx)(o,{size:13}):n+1}),(0,A.jsx)(`span`,{className:`text-xs font-medium ${n===e?`text-foreground`:`text-muted-foreground`}`,children:t})]}),n<j.length-1&&(0,A.jsx)(`span`,{className:`mx-1 h-px w-5 bg-border`})]},t))})}function w({label:e,value:t,emphasise:n=!1}){return(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(`dt`,{className:`text-muted-foreground`,children:e}),(0,A.jsx)(`dd`,{className:n?`font-semibold text-foreground`:`text-foreground`,children:t})]})}function T(e){return b.map(e=>e.value).filter(t=>e.has(t))}function E(e){return e===`WEEKLY`?`Weekly`:`Bi-weekly`}function D(e){let t=b.filter(t=>e.has(t.value)).map(e=>e.short);return t.length>0?t.join(`, `):`no days`}function O(e){return new Date(`${e}T00:00:00Z`).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`,timeZone:`UTC`})}var k,A,j,M,N,P=e((()=>{k=t(n(),1),c(),l(),u(),p(),g(),h(),_(),y(),v(),A=r(),j=[`Details`,`Repeat`,`Confirm`],M=[{title:`What are you scheduling?`,sub:`Pick a type — we'll pre-fill the rest.`},{title:`How often?`,sub:`Choose the cadence and the days it lands on.`},{title:`Ready to create`,sub:`Review the dates before you confirm.`}],N=`#225C9C`,S.__docgenInfo={description:`Guided 3-step wizard for creating a recurring series (prototype A + B): ① type & details →
② recurrence with a live month-calendar preview → ③ confirm. A persistent context block carries
the chosen summary + running count across steps. Purely presentational — data, the mutation, and
the sheet open/close state live in the CreateEventSheet widget, so each step state is renderable
in isolation (see RecurringEventsWizard.stories.tsx).`,methods:[],displayName:`RecurringEventsWizard`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},season:{required:!0,tsType:{name:`union`,raw:`Season | undefined`,elements:[{name:`Season`},{name:`undefined`}]},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},errorMessage:{required:!1,tsType:{name:`string`},description:``},today:{required:!0,tsType:{name:`string`},description:`Today as 'YYYY-MM-DD', injected so the default date range stays deterministic/testable.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}}));async function F(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await R(document.body).findByRole(`option`,{name:/Training/}))}var I,L,R,z,B,V,H,U,W,G;e((()=>{P(),{expect:I,fn:L,within:R}=__STORYBOOK_MODULE_TEST__,z={title:`features/create-recurring-events/RecurringEventsWizard`,component:S,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#225C9C`},{id:`et-2`,name:`Match`,color:`#249E6C`}],season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:L()}},B={play:async({canvas:e})=>{await I(e.getByText(`Details`)).toBeInTheDocument(),await I(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},V={play:async({canvas:e,userEvent:t})=>{await F(e,t),await I(e.getByLabelText(`Title`)).toHaveValue(`Training`),await I(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},H={play:async({canvas:e,userEvent:t})=>{await F(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await I(e.getByText(`On`)).toBeInTheDocument();let n=e.getByTestId(`occurrence-count`);await I(n).toBeInTheDocument(),await I(n).not.toHaveTextContent(`0 events`)}},U={args:{season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`},play:async({canvas:e,userEvent:t})=>{await F(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await I(e.getByText(/over 200 events/i)).toBeInTheDocument(),await I(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},W={args:{isPending:!0},play:async({canvas:e,userEvent:t})=>{await F(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await I(e.getByRole(`button`,{name:/Creating/})).toBeDisabled()}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G=[`DetailsEmpty`,`DetailsFilled`,`RecurrencePreview`,`OverCap`,`Submitting`]}))();export{B as DetailsEmpty,V as DetailsFilled,U as OverCap,H as RecurrencePreview,W as Submitting,G as __namedExportsOrder,z as default};