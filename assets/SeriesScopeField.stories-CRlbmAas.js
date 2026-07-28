import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-CBtyNRTE.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{n as i,t as a}from"./event-fixtures-3405VcxT.js";import{S as o,f as s,t as c}from"./lucide-react-CSKqdPow.js";function l(e,t,n){switch(e){case`THIS`:return[t,t];case`THIS_AND_FOLLOWING`:return[t,n-1];case`ALL`:return[0,n-1]}}function u(e,t,n){let r=[...e].sort((e,t)=>e.startTime.localeCompare(t.startTime)),i=r.findIndex(e=>e.id===t);if(i===-1)return null;let[a,o]=l(n,i,r.length);return{scope:n,nodes:r.map((e,t)=>({id:e.id,startTime:e.startTime,affected:t>=a&&t<=o,isCurrent:t===i})),affectedCount:o-a+1,total:r.length}}var d=e((()=>{}));function f(e){return new Date(e).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`})}function p({siblings:e,currentId:t,scope:n,onScopeChange:r,variant:i=`edit`}){let a=u(e,t,n);if(!a)return null;let c=i===`delete`,l=c?`Removes`:`Affects`,d=c?v[n]:_[n],f=c?`border-red-500/20 bg-red-500/5`:`border-blue/20 bg-blue/5`,p=c?`text-red-500`:`text-blue`;return(0,h.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`p`,{className:`mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground`,children:c?`Delete`:`Apply to`}),(0,h.jsx)(`div`,{role:`group`,"aria-label":`Scope`,className:`flex gap-1.5`,children:g.map(({value:e,label:t})=>{let i=n===e;return(0,h.jsx)(`button`,{type:`button`,"aria-pressed":i,onClick:()=>r(e),className:[`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors`,i?c?`border-red-500 bg-red-500 text-white`:`border-blue bg-blue text-white`:`border-border text-muted-foreground hover:bg-muted/60`].join(` `),children:t},e)})})]}),(0,h.jsxs)(`div`,{className:`rounded-xl border p-3 ${f}`,children:[(0,h.jsxs)(`p`,{className:`text-sm font-bold ${p}`,children:[l,` `,a.affectedCount,` of `,a.total,` event`,a.total===1?``:`s`]}),(0,h.jsx)(m,{preview:a,danger:c}),(0,h.jsxs)(`p`,{className:`mt-2.5 flex items-start gap-1.5 text-xs text-muted-foreground`,children:[(0,h.jsx)(s,{size:13,className:`mt-0.5 shrink-0`}),(0,h.jsx)(`span`,{children:d})]})]}),!c&&n!==`THIS`&&(0,h.jsxs)(`p`,{className:`flex items-start gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground`,children:[(0,h.jsx)(o,{size:13,className:`mt-0.5 shrink-0`}),(0,h.jsx)(`span`,{children:`Each occurrence keeps its own date; the time & details apply to all affected events.`})]})]})}function m({preview:e,danger:t}){let n=t?`bg-red-500`:`bg-blue`;return(0,h.jsx)(`div`,{className:`mt-2 flex items-center gap-1`,"aria-hidden":`true`,children:e.nodes.map((r,i)=>{let a=e.nodes[i-1];return(0,h.jsxs)(`div`,{className:`flex items-center gap-1`,children:[a&&a.affected!==r.affected&&(0,h.jsx)(`span`,{className:`h-4 w-px shrink-0 bg-border`,"data-testid":`split-marker`}),(0,h.jsx)(`span`,{title:f(r.startTime),className:[`h-2.5 w-2.5 rounded-full transition-colors`,r.affected?n:`bg-border`,r.isCurrent?t?`ring-2 ring-red-500/40`:`ring-2 ring-blue/40`:``].join(` `)})]},r.id)})})}var h,g,_,v,y=e((()=>{c(),d(),h=r(),g=[{value:`THIS`,label:`This event`},{value:`THIS_AND_FOLLOWING`,label:`This & following`},{value:`ALL`,label:`All events`}],_={THIS:`Splits the series into three: everything before, this one on its own (its date can move), and everything after — each independent.`,THIS_AND_FOLLOWING:`Splits the series in two: occurrences before stay as they are; this one and every later one become a new series with the edited details.`,ALL:`No split — the edit applies to every occurrence in the one series.`},v={THIS:`Removes just this occurrence; the rest of the series stays.`,THIS_AND_FOLLOWING:`Removes this occurrence and every later one; the earlier ones stay as a shorter series.`,ALL:`Removes the entire series.`},p.__docgenInfo={description:`The scope selector + live affected-preview shown when editing or deleting one occurrence of a
recurring series (ADR-0014, Phase 3 — the guided scope prompt from prototype A over prototype B's
before│this│after timeline). Presentational: \`scope\` and its setter are owned by the dialog, so
every state is a plain render arg. Standalone events don't render this at all.`,methods:[],displayName:`SeriesScopeField`,props:{siblings:{required:!0,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing the current event's recurring group (any order).`},currentId:{required:!0,tsType:{name:`string`},description:``},scope:{required:!0,tsType:{name:`EventSeriesScope`},description:``},onScopeChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(scope: EventSeriesScope) => void`,signature:{arguments:[{type:{name:`EventSeriesScope`},name:`scope`}],return:{name:`void`}}},description:``},variant:{required:!1,tsType:{name:`union`,raw:`'edit' | 'delete'`,elements:[{name:`literal`,value:`'edit'`},{name:`literal`,value:`'delete'`}]},description:`'edit' shows the accent/date-lock treatment; 'delete' shows the removed/kept treatment.`,defaultValue:{value:`'edit'`,computed:!1}}}}}));function b({variant:e,initialScope:t}){let[n,r]=(0,x.useState)(t);return(0,S.jsx)(`div`,{className:`max-w-md`,children:(0,S.jsx)(p,{siblings:w,currentId:`b`,scope:n,onScopeChange:r,variant:e})})}var x,S,C,w,T,E,D,O,k,A,j,M;e((()=>{x=t(n(),1),a(),y(),S=r(),{expect:C}=__STORYBOOK_MODULE_TEST__,w=[i({id:`a`,startTime:`2026-09-01T18:30:00Z`,recurringGroup:`g1`}),i({id:`b`,startTime:`2026-09-08T18:30:00Z`,recurringGroup:`g1`}),i({id:`c`,startTime:`2026-09-15T18:30:00Z`,recurringGroup:`g1`}),i({id:`d`,startTime:`2026-09-22T18:30:00Z`,recurringGroup:`g1`})],T={title:`features/edit-event/SeriesScopeField`,component:b},E={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e})=>{await C(e.getByText(`Affects 1 of 4 events`)).toBeInTheDocument(),await C(e.getByRole(`button`,{name:`This event`})).toHaveAttribute(`aria-pressed`,`true`),await C(e.getByText(/Splits the series into three/)).toBeInTheDocument(),await C(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},D={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await C(e.getByText(`Affects 3 of 4 events`)).toBeInTheDocument(),await C(e.getByRole(`button`,{name:`This & following`})).toHaveAttribute(`aria-pressed`,`true`),await C(e.getByText(/Splits the series in two/)).toBeInTheDocument(),await C(e.getByText(/keeps its own date/)).toBeInTheDocument()}},O={args:{variant:`edit`,initialScope:`ALL`},play:async({canvas:e})=>{await C(e.getByText(`Affects 4 of 4 events`)).toBeInTheDocument(),await C(e.getByRole(`button`,{name:`All events`})).toHaveAttribute(`aria-pressed`,`true`),await C(e.getByText(/No split/)).toBeInTheDocument(),await C(e.getByText(/keeps its own date/)).toBeInTheDocument()}},k={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e})=>{await C(e.getByText(`Removes 1 of 4 events`)).toBeInTheDocument(),await C(e.getByText(/Removes just this occurrence/)).toBeInTheDocument(),await C(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},A={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await C(e.getByText(`Removes 3 of 4 events`)).toBeInTheDocument(),await C(e.getByText(/every later one/)).toBeInTheDocument()}},j={args:{variant:`delete`,initialScope:`ALL`},play:async({canvas:e})=>{await C(e.getByText(`Removes 4 of 4 events`)).toBeInTheDocument(),await C(e.getByText(/Removes the entire series/)).toBeInTheDocument()}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Affects 1 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'This event'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/Splits the series into three/)).toBeInTheDocument();
    // THIS keeps the date free, so no lock note.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
    await expect(canvas.getByText('Affects 3 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'This & following'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/Splits the series in two/)).toBeInTheDocument();
    // A bulk scope locks the per-occurrence date.
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'ALL'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Affects 4 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'All events'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/No split/)).toBeInTheDocument();
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'THIS'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Removes 1 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/Removes just this occurrence/)).toBeInTheDocument();
    // Delete never locks a date — that note is edit-only.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'THIS'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
    await expect(canvas.getByText('Removes 3 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/every later one/)).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'ALL'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Removes 4 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/Removes the entire series/)).toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M=[`EditThis`,`EditThisAndFollowing`,`EditAll`,`DeleteThis`,`DeleteThisAndFollowing`,`DeleteAll`]}))();export{j as DeleteAll,k as DeleteThis,A as DeleteThisAndFollowing,O as EditAll,E as EditThis,D as EditThisAndFollowing,M as __namedExportsOrder,T as default};