import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ARJhC-h6.js";import{i as n,n as r,r as i,t as a}from"./router-decorator-CLZqZksA.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./event-fixtures-zk5yUMAb.js";import{n as l,t as u}from"./chevron-down-DIefHD0U.js";import{n as d,t as f}from"./repeat-BqLW8k5J.js";function p(e,t){if(e.length<2)return null;let n=[...e].sort((e,t)=>e.startTime.localeCompare(t.startTime)),r=n.findIndex(e=>e.id===t);if(r===-1)return null;let i=e=>({id:e.id,startTime:e.startTime,isCurrent:e.id===t});return n.length<=4?{total:n.length,currentPosition:r+1,head:n.map(i),tail:[],hiddenCount:0}:{total:n.length,currentPosition:r+1,head:n.slice(0,m).map(i),tail:n.slice(n.length-h).map(i),hiddenCount:n.length-m-h}}var m,h;function g(){return(g=e((()=>{m=2,h=2})))()}function _(e){return new Date(e).toLocaleDateString(`nl-NL`,{weekday:`short`,day:`numeric`,month:`short`,year:`numeric`})}function v({entry:e}){let t=_(e.startTime),n=(0,x.jsxs)(`div`,{className:[`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm tabular-nums transition-colors`,e.isCurrent?`bg-blue/10 font-semibold text-foreground`:`text-muted-foreground hover:bg-muted/60`].join(` `),children:[(0,x.jsx)(`span`,{className:`h-2 w-2 shrink-0 rounded-full ${e.isCurrent?`bg-blue`:`bg-blue/40`}`}),t,e.isCurrent&&(0,x.jsx)(`span`,{className:`ml-auto rounded-full bg-blue/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue`,children:`This one`})]});return e.isCurrent?n:(0,x.jsx)(i,{to:`/events/$eventId`,params:{eventId:e.id},children:n})}function y({peek:e}){let[t,n]=(0,b.useState)(!1);return(0,x.jsxs)(`div`,{className:`mt-6 rounded-2xl border border-blue/15 bg-blue/5 p-4`,children:[(0,x.jsxs)(`button`,{type:`button`,onClick:()=>n(e=>!e),"aria-expanded":t,className:`flex w-full items-center gap-2 text-left`,children:[(0,x.jsx)(`span`,{className:`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue`,children:(0,x.jsx)(f,{size:15})}),(0,x.jsxs)(`div`,{className:`min-w-0`,children:[(0,x.jsx)(`p`,{className:`text-sm font-bold leading-tight`,children:`Part of a series`}),(0,x.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Occurrence `,e.currentPosition,` of `,e.total]})]}),(0,x.jsx)(u,{size:18,className:`ml-auto shrink-0 text-muted-foreground transition-transform ${t?`rotate-180`:``}`})]}),t&&(0,x.jsxs)(`div`,{className:`mt-3 flex flex-col gap-1`,children:[e.head.map(e=>(0,x.jsx)(v,{entry:e},e.id)),e.hiddenCount>0&&(0,x.jsxs)(`div`,{className:`flex items-center gap-2 px-2.5 py-1 text-xs italic text-muted-foreground`,children:[(0,x.jsx)(`span`,{className:`h-px flex-1 bg-border`}),`+`,e.hiddenCount,` more`,(0,x.jsx)(`span`,{className:`h-px flex-1 bg-border`})]}),e.tail.map(e=>(0,x.jsx)(v,{entry:e},e.id))]})]})}var b,x;function S(){return(S=e((()=>{b=t(),n(),l(),d(),x=o(),y.__docgenInfo={description:`A "part of a series" disclosure on the event-detail route (ADR-0014). The membership line is
usually incidental context, so the card is **collapsed by default** — showing only "Part of a
series · Occurrence X of Y" — and expands on click to reveal the first-two + last-two occurrences
(with a "+N more" gap) and the current one highlighted. Purely presentational; the peek model is
built by buildSeriesPeek.`,methods:[],displayName:`SeriesPeek`,props:{peek:{required:!0,tsType:{name:`SeriesPeekModel`},description:``}}}})))()}var C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{a(),c(),g(),S(),{expect:C}=__STORYBOOK_MODULE_TEST__,w={title:`entities/event/SeriesPeek`,component:y,decorators:[r]},T=[`a`,`b`,`c`,`d`,`e`].map((e,t)=>s({id:e,recurringGroup:`g1`,startTime:`2026-09-0${t+1}T18:30:00Z`})),E={args:{peek:p(T,`c`)},play:async({canvas:e})=>{await C(e.getByText(`Part of a series`)).toBeInTheDocument(),await C(e.getByText(`Occurrence 3 of 5`)).toBeInTheDocument(),await C(e.queryByText(/\+1 more/)).not.toBeInTheDocument(),await C(e.getByRole(`button`)).toHaveAttribute(`aria-expanded`,`false`)}},D={args:{peek:p(T,`c`)},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`)),await C(e.getByRole(`button`)).toHaveAttribute(`aria-expanded`,`true`),await C(e.getByText(/\+1 more/)).toBeInTheDocument()}},O={args:{peek:p(T,`a`)},play:async({canvas:e,userEvent:t})=>{await C(e.getByText(`Occurrence 1 of 5`)).toBeInTheDocument(),await t.click(e.getByRole(`button`)),await C(e.getByText(`This one`)).toBeInTheDocument()}},k={args:{peek:p(T.slice(0,3),`b`)},play:async({canvas:e,userEvent:t})=>{await C(e.getByText(`Occurrence 2 of 3`)).toBeInTheDocument(),await t.click(e.getByRole(`button`)),await C(e.queryByText(/more/)).not.toBeInTheDocument()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    peek: buildSeriesPeek(series, 'c')!
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Part of a series')).toBeInTheDocument();
    await expect(canvas.getByText('Occurrence 3 of 5')).toBeInTheDocument();
    // The occurrence list stays hidden until expanded.
    await expect(canvas.queryByText(/\\+1 more/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    peek: buildSeriesPeek(series, 'c')!
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/\\+1 more/)).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    peek: buildSeriesPeek(series, 'a')!
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('Occurrence 1 of 5')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByText('This one')).toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    peek: buildSeriesPeek(series.slice(0, 3), 'b')!
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('Occurrence 2 of 3')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.queryByText(/more/)).not.toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A=[`CollapsedByDefault`,`ExpandedLongSeries`,`CurrentInHead`,`ShortSeries`]})))()}j();export{E as CollapsedByDefault,O as CurrentInHead,D as ExpandedLongSeries,k as ShortSeries,A as __namedExportsOrder,w as default};