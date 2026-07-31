import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-7ra-rxTo.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-DxkqsRsm.js";import{n as a,t as o}from"./check-BYkxRwiL.js";import{a as ee,i as te,n as ne,o as s,r as re,t as ie}from"./select-DiiNCvUe.js";import{n as c,t as ae}from"./ReferenceRowsEditor-CyebicYv.js";import{n as l,t as oe}from"./repeat-DrR7c4r2.js";import{a as se,i as ce,n as u,o as d,r as f,t as p}from"./MonthCalendarPreview-BeUpWya0.js";import{i as m,n as h,r as g,t as _}from"./input-DSfQ-uEk.js";import{n as v,t as y}from"./label-oJWJ1dSz.js";import{t as le}from"./references-CZJ2rW2Z.js";var b,x;function S(){return(S=e((()=>{r(),b=[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]],x=i(`arrow-left`,b)})))()}var C,w;function T(){return(T=e((()=>{r(),C=[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]],w=i(`arrow-right`,C)})))()}var E,D;function O(){return(O=e((()=>{r(),E=[[`path`,{d:`M16 14v2.2l1.6 1`,key:`fo4ql5`}],[`path`,{d:`M16 2v4`,key:`4m81vk`}],[`path`,{d:`M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5`,key:`1osxxc`}],[`path`,{d:`M3 10h5`,key:`r794hk`}],[`path`,{d:`M8 2v4`,key:`1cmpym`}],[`circle`,{cx:`16`,cy:`16`,r:`6`,key:`qoo3c4`}]],D=i(`calendar-clock`,E)})))()}function k({eventTypes:e,season:t,isPending:n,errorMessage:r,today:i,onSubmit:a}){let[s,c]=(0,F.useState)(0),[l,u]=(0,F.useState)(``),[d,m]=(0,F.useState)(``),[h,v]=(0,F.useState)(!1),[b,S]=(0,F.useState)(`20:30`),[C,T]=(0,F.useState)(90),[E,O]=(0,F.useState)(``),[k,L]=(0,F.useState)(``),[B,V]=(0,F.useState)([]),[H,U]=(0,F.useState)(`WEEKLY`),[W,G]=(0,F.useState)(new Set([`TUESDAY`,`THURSDAY`])),K=(0,F.useMemo)(()=>se(t,i),[t,i]),[q,J]=(0,F.useState)(K.startDate),[Y,X]=(0,F.useState)(K.endDate),Z=e.find(e=>e.id===l),Q=Z?.color??z,$=(0,F.useMemo)(()=>{let e={frequency:H,weekdays:j(W),startDate:q,endDate:Y};return ce(e,t)},[H,W,q,Y,t]),de=!!l&&d.trim().length>0&&!!b&&C>0,fe=$.count>0&&!$.overCap&&$.outOfSeasonCount===0,pe=t=>{if(u(t),!h){let n=e.find(e=>e.id===t);n&&m(n.name)}},me=e=>{G(t=>{let n=new Set(t);return n.has(e)?n.size>1&&n.delete(e):n.add(e),n})};return(0,I.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,I.jsx)(ue,{step:s}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`p`,{className:`font-display text-lg font-semibold leading-tight`,children:R[s].title}),(0,I.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:R[s].sub})]}),s>0&&(0,I.jsxs)(`div`,{className:`rounded-xl border border-blue/15 bg-blue/5 p-3`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`span`,{className:`inline-block h-3 w-3 shrink-0 rounded-full`,style:{backgroundColor:Q}}),(0,I.jsx)(`span`,{className:`truncate text-sm font-semibold`,children:d||`Untitled series`}),(0,I.jsxs)(`span`,{className:`ml-auto shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue`,children:[$.count,` `,$.count===1?`event`:`events`]})]}),(0,I.jsxs)(`p`,{className:`mt-1 flex items-center gap-1.5 text-xs text-muted-foreground`,children:[(0,I.jsx)(D,{size:12,className:`shrink-0`}),b,` · `,C,` min · `,M(H),` · `,N(W)]})]}),s===0&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-type`,children:`Type`}),(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`div`,{className:`h-6 w-6 shrink-0 rounded-full border border-border`,style:{backgroundColor:Z?.color??`transparent`},"aria-hidden":`true`}),(0,I.jsxs)(ie,{value:l,onValueChange:pe,children:[(0,I.jsx)(te,{id:`rec-type`,className:`flex-1`,children:(0,I.jsx)(ee,{placeholder:`Select type`})}),(0,I.jsx)(ne,{children:e.map(e=>(0,I.jsx)(re,{value:e.id,children:(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`span`,{className:`inline-block h-3 w-3 rounded-full`,style:{backgroundColor:e.color??`#888`}}),e.name]})},e.id))})]})]})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-title`,children:`Title`}),(0,I.jsx)(_,{id:`rec-title`,value:d,onChange:e=>{m(e.target.value),v(!0)},placeholder:Z?`e.g. ${Z.name}`:`Series title`})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-time`,children:`Time of day`}),(0,I.jsx)(_,{id:`rec-time`,type:`time`,value:b,onChange:e=>S(e.target.value)})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-duration`,children:`Duration (min)`}),(0,I.jsx)(_,{id:`rec-duration`,type:`number`,min:1,value:C,onChange:e=>T(Number(e.target.value))})]})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-location`,children:`Location (optional)`}),(0,I.jsx)(_,{id:`rec-location`,value:E,onChange:e=>O(e.target.value)})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-description`,children:`Description (optional)`}),(0,I.jsx)(_,{id:`rec-description`,value:k,onChange:e=>L(e.target.value)})]}),(0,I.jsx)(ae,{rows:B,onChange:V,hint:`Shared across every event in the series.`})]}),s===1&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{children:`Repeats`}),(0,I.jsx)(`div`,{className:`mt-1 inline-flex rounded-full bg-muted p-1`,children:[`WEEKLY`,`BIWEEKLY`].map(e=>(0,I.jsx)(`button`,{type:`button`,onClick:()=>U(e),className:[`rounded-full px-4 py-1 text-sm font-medium transition-all`,H===e?`bg-card text-foreground shadow-sm`:`text-muted-foreground hover:text-foreground`].join(` `),children:M(e)},e))})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{children:`On`}),(0,I.jsx)(`div`,{className:`mt-1 flex flex-wrap gap-1.5`,children:f.map(({value:e,short:t})=>{let n=W.has(e);return(0,I.jsx)(`button`,{type:`button`,"aria-pressed":n,onClick:()=>me(e),className:[`rounded-full border px-3 py-1 text-xs font-medium transition-all`,n?`border-blue bg-blue text-white`:`border-border text-muted-foreground hover:border-blue hover:text-blue`].join(` `),children:t},e)})})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-start`,children:`From`}),(0,I.jsx)(_,{id:`rec-start`,type:`date`,value:q,onChange:e=>J(e.target.value)})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(y,{htmlFor:`rec-end`,children:`Until`}),(0,I.jsx)(_,{id:`rec-end`,type:`date`,value:Y,onChange:e=>X(e.target.value)})]})]}),(0,I.jsx)(p,{preview:$,accentColor:Q})]}),s===2&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,I.jsxs)(`div`,{className:`rounded-xl border border-border/60 bg-card p-4 shadow-sm`,children:[(0,I.jsxs)(`p`,{className:`flex items-center gap-2 font-display text-lg font-semibold`,children:[(0,I.jsx)(oe,{size:18,style:{color:Q}}),d||`Untitled series`]}),(0,I.jsxs)(`dl`,{className:`mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm`,children:[(0,I.jsx)(A,{label:`Type`,value:Z?.name??`—`}),(0,I.jsx)(A,{label:`When`,value:`${b} · ${C} min`}),(0,I.jsx)(A,{label:`Repeats`,value:`${M(H)} · ${N(W)}`}),$.firstDate&&$.lastDate&&(0,I.jsx)(A,{label:`Dates`,value:`${P($.firstDate)} → ${P($.lastDate)}`}),E&&(0,I.jsx)(A,{label:`Location`,value:E}),(0,I.jsx)(A,{label:`Total`,value:`${$.count} ${$.count===1?`event`:`events`}`,emphasise:!0})]})]}),(0,I.jsx)(p,{preview:$,accentColor:Q}),r&&(0,I.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:r})]}),(0,I.jsxs)(`div`,{className:`flex gap-2`,children:[s>0&&(0,I.jsxs)(g,{type:`button`,variant:`outline`,onClick:()=>c(e=>e-1),className:`flex-1`,children:[(0,I.jsx)(x,{size:16}),`Back`]}),s<2&&(0,I.jsxs)(g,{type:`button`,onClick:()=>c(e=>e+1),disabled:s===0?!de:!fe,className:`flex-1`,children:[`Next`,(0,I.jsx)(w,{size:16})]}),s===2&&(0,I.jsxs)(g,{type:`button`,onClick:()=>{a({eventTypeId:l,title:d.trim(),description:k.trim()||void 0,location:E.trim()||void 0,timeOfDay:b,durationMinutes:C,references:le(B),recurrence:{frequency:H,weekdays:j(W),startDate:q,endDate:Y}})},disabled:n||!fe||!de,className:`flex-1`,style:{backgroundColor:Q,borderColor:Q},children:[(0,I.jsx)(o,{size:16}),n?`Creating…`:`Create ${$.count} ${$.count===1?`event`:`events`}`]})]})]})}function ue({step:e}){return(0,I.jsx)(`div`,{className:`flex items-center justify-center gap-1`,children:L.map((t,n)=>(0,I.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,I.jsx)(`span`,{className:[`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all`,n<e?`bg-green text-white`:n===e?`bg-blue text-white`:`bg-muted text-muted-foreground`].join(` `),children:n<e?(0,I.jsx)(o,{size:13}):n+1}),(0,I.jsx)(`span`,{className:`text-xs font-medium ${n===e?`text-foreground`:`text-muted-foreground`}`,children:t})]}),n<L.length-1&&(0,I.jsx)(`span`,{className:`mx-1 h-px w-5 bg-border`})]},t))})}function A({label:e,value:t,emphasise:n=!1}){return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`dt`,{className:`text-muted-foreground`,children:e}),(0,I.jsx)(`dd`,{className:n?`font-semibold text-foreground`:`text-foreground`,children:t})]})}function j(e){return f.map(e=>e.value).filter(t=>e.has(t))}function M(e){return e===`WEEKLY`?`Weekly`:`Bi-weekly`}function N(e){let t=f.filter(t=>e.has(t.value)).map(e=>e.short);return t.length>0?t.join(`, `):`no days`}function P(e){return new Date(`${e}T00:00:00Z`).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`,timeZone:`UTC`})}var F,I,L,R,z;function B(){return(B=e((()=>{F=t(),S(),T(),O(),a(),l(),m(),h(),v(),s(),c(),d(),u(),I=n(),L=[`Details`,`Repeat`,`Confirm`],R=[{title:`What are you scheduling?`,sub:`Pick a type — we'll pre-fill the rest.`},{title:`How often?`,sub:`Choose the cadence and the days it lands on.`},{title:`Ready to create`,sub:`Review the dates before you confirm.`}],z=`#225C9C`,k.__docgenInfo={description:`Guided 3-step wizard for creating a recurring series (prototype A + B): ① type & details →
② recurrence with a live month-calendar preview → ③ confirm. A persistent context block carries
the chosen summary + running count across steps. Purely presentational — data, the mutation, and
the sheet open/close state live in the CreateEventSheet widget, so each step state is renderable
in isolation (see RecurringEventsWizard.stories.tsx).`,methods:[],displayName:`RecurringEventsWizard`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},season:{required:!0,tsType:{name:`union`,raw:`Season | undefined`,elements:[{name:`Season`},{name:`undefined`}]},description:``},isPending:{required:!0,tsType:{name:`boolean`},description:``},errorMessage:{required:!1,tsType:{name:`string`},description:``},today:{required:!0,tsType:{name:`string`},description:`Today as 'YYYY-MM-DD', injected so the default date range stays deterministic/testable.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(body: CreateRecurringEventsRequest) => void`,signature:{arguments:[{type:{name:`CreateRecurringEventsRequest`},name:`body`}],return:{name:`void`}}},description:``}}}})))()}async function V(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await W(document.body).findByRole(`option`,{name:/Training/}))}var H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{B(),{expect:H,fn:U,within:W}=__STORYBOOK_MODULE_TEST__,G={title:`features/create-recurring-events/RecurringEventsWizard`,component:k,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#225C9C`},{id:`et-2`,name:`Match`,color:`#249E6C`}],season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:U()}},K={play:async({canvas:e})=>{await H(e.getByText(`Details`)).toBeInTheDocument(),await H(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},q={play:async({canvas:e,userEvent:t})=>{await V(e,t),await H(e.getByLabelText(`Title`)).toHaveValue(`Training`),await H(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},J={play:async({canvas:e,userEvent:t})=>{await V(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await H(e.getByText(`On`)).toBeInTheDocument();let n=e.getByTestId(`occurrence-count`);await H(n).toBeInTheDocument(),await H(n).not.toHaveTextContent(`0 events`)}},Y={args:{season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`},play:async({canvas:e,userEvent:t})=>{await V(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await H(e.getByText(/over 200 events/i)).toBeInTheDocument(),await H(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},X={args:{isPending:!0},play:async({canvas:e,userEvent:t})=>{await V(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await H(e.getByRole(`button`,{name:/Creating/})).toBeDisabled()}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}},Z=[`DetailsEmpty`,`DetailsFilled`,`RecurrencePreview`,`OverCap`,`Submitting`]})))()}Q();export{K as DetailsEmpty,q as DetailsFilled,Y as OverCap,J as RecurrencePreview,X as Submitting,Z as __namedExportsOrder,G as default};