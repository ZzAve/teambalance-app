import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BmKi-jTa.js";import{i as n,n as r,r as i,t as a}from"./router-decorator-Gd65UvHa.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{i as s,t as c}from"./team-routes-BrTkwG_z.js";import{n as l}from"./event-fixtures-BaYeuP-I.js";import{n as u,t as d}from"./chevron-down-D3qR23fX.js";import{n as f,t as p}from"./repeat-BfYYl7IT.js";function m(e,t){if(e.length<2)return null;let n=[...e].sort((e,t)=>e.startTime.localeCompare(t.startTime)),r=n.findIndex(e=>e.id===t);if(r===-1)return null;let i=e=>({id:e.id,startTime:e.startTime,isCurrent:e.id===t});return n.length<=4?{total:n.length,currentPosition:r+1,head:n.map(i),tail:[],hiddenCount:0}:{total:n.length,currentPosition:r+1,head:n.slice(0,h).map(i),tail:n.slice(n.length-g).map(i),hiddenCount:n.length-h-g}}var h,g;function _(){return(_=e((()=>{h=2,g=2})))()}function v(e){return new Date(e).toLocaleDateString(`nl-NL`,{weekday:`short`,day:`numeric`,month:`short`,year:`numeric`})}function y({entry:e}){let t=s(),n=v(e.startTime),r=(0,S.jsxs)(`div`,{className:[`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm tabular-nums transition-colors`,e.isCurrent?`bg-blue/10 font-semibold text-foreground`:`text-muted-foreground hover:bg-muted/60`].join(` `),children:[(0,S.jsx)(`span`,{className:`h-2 w-2 shrink-0 rounded-full ${e.isCurrent?`bg-blue`:`bg-blue/40`}`}),n,e.isCurrent&&(0,S.jsx)(`span`,{className:`ml-auto rounded-full bg-blue/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue`,children:`This one`})]});return e.isCurrent?r:(0,S.jsx)(i,{to:t.event(e.id),children:r})}function b({peek:e}){let[t,n]=(0,x.useState)(!1);return(0,S.jsxs)(`div`,{className:`mt-6 rounded-2xl border border-blue/15 bg-blue/5 p-4`,children:[(0,S.jsxs)(`button`,{type:`button`,onClick:()=>n(e=>!e),"aria-expanded":t,className:`flex w-full items-center gap-2 text-left`,children:[(0,S.jsx)(`span`,{className:`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue`,children:(0,S.jsx)(p,{size:15})}),(0,S.jsxs)(`div`,{className:`min-w-0`,children:[(0,S.jsx)(`p`,{className:`text-sm font-bold leading-tight`,children:`Part of a series`}),(0,S.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Occurrence `,e.currentPosition,` of `,e.total]})]}),(0,S.jsx)(d,{size:18,className:`ml-auto shrink-0 text-muted-foreground transition-transform ${t?`rotate-180`:``}`})]}),t&&(0,S.jsxs)(`div`,{className:`mt-3 flex flex-col gap-1`,children:[e.head.map(e=>(0,S.jsx)(y,{entry:e},e.id)),e.hiddenCount>0&&(0,S.jsxs)(`div`,{className:`flex items-center gap-2 px-2.5 py-1 text-xs italic text-muted-foreground`,children:[(0,S.jsx)(`span`,{className:`h-px flex-1 bg-border`}),`+`,e.hiddenCount,` more`,(0,S.jsx)(`span`,{className:`h-px flex-1 bg-border`})]}),e.tail.map(e=>(0,S.jsx)(y,{entry:e},e.id))]})]})}var x,S;function C(){return(C=e((()=>{x=t(),n(),u(),f(),c(),S=o(),b.__docgenInfo={description:`A "part of a series" disclosure on the event-detail route (ADR-0014). The membership line is
usually incidental context, so the card is **collapsed by default** — showing only "Part of a
series · Occurrence X of Y" — and expands on click to reveal the first-two + last-two occurrences
(with a "+N more" gap) and the current one highlighted. Purely presentational; the peek model is
built by buildSeriesPeek.`,methods:[],displayName:`SeriesPeek`,props:{peek:{required:!0,tsType:{name:`SeriesPeekModel`},description:``}}}})))()}var w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{a(),_(),C(),{expect:w}=__STORYBOOK_MODULE_TEST__,T={title:`entities/event/SeriesPeek`,component:b,decorators:[r]},E=[`a`,`b`,`c`,`d`,`e`].map((e,t)=>l({id:e,recurringGroup:`g1`,startTime:`2026-09-0${t+1}T18:30:00Z`})),D={args:{peek:m(E,`c`)},play:async({canvas:e})=>{await w(e.getByText(`Part of a series`)).toBeInTheDocument(),await w(e.getByText(`Occurrence 3 of 5`)).toBeInTheDocument(),await w(e.queryByText(/\+1 more/)).not.toBeInTheDocument(),await w(e.getByRole(`button`)).toHaveAttribute(`aria-expanded`,`false`)}},O={args:{peek:m(E,`c`)},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`)),await w(e.getByRole(`button`)).toHaveAttribute(`aria-expanded`,`true`),await w(e.getByText(/\+1 more/)).toBeInTheDocument()}},k={args:{peek:m(E,`a`)},play:async({canvas:e,userEvent:t})=>{await w(e.getByText(`Occurrence 1 of 5`)).toBeInTheDocument(),await t.click(e.getByRole(`button`)),await w(e.getByText(`This one`)).toBeInTheDocument()}},A={args:{peek:m(E.slice(0,3),`b`)},play:async({canvas:e,userEvent:t})=>{await w(e.getByText(`Occurrence 2 of 3`)).toBeInTheDocument(),await t.click(e.getByRole(`button`)),await w(e.queryByText(/more/)).not.toBeInTheDocument()}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`CollapsedByDefault`,`ExpandedLongSeries`,`CurrentInHead`,`ShortSeries`]})))()}M();export{D as CollapsedByDefault,k as CurrentInHead,O as ExpandedLongSeries,A as ShortSeries,j as __namedExportsOrder,T as default};