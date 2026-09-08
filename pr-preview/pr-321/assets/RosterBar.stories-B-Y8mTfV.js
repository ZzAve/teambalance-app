import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,r as n}from"./event-fixtures-GLq-GGnS.js";import{a as r,o as i,s as a}from"./roster-view-jxUVV2ru.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";function s({roster:e}){let t=a(e).filter(e=>e.pips.length>0);if(t.length===0)return null;let n=t.reduce((e,t)=>e+t.pips.length,0),r=n-e.openSlots,o=n===0?0:Math.round(r/n*100),s=i(e);return(0,c.jsxs)(`div`,{className:`border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3`,children:[(0,c.jsxs)(`div`,{className:`mb-2 flex items-baseline justify-between gap-3`,children:[(0,c.jsx)(`span`,{className:`text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground`,children:`Roster`}),(0,c.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[(0,c.jsx)(`span`,{className:`font-display text-sm font-bold tabular-nums ${e.openSlots===0?`text-green-dark`:`text-foreground`}`,children:`${r}/${n} spots`}),s&&(0,c.jsxs)(`span`,{className:`text-xs font-semibold ${u[s.tone]}`,children:[`· `,s.text]})]})]}),(0,c.jsx)(`div`,{className:`mb-2.5 h-1.5 overflow-hidden rounded-full bg-muted`,children:(0,c.jsx)(`div`,{className:`h-full rounded-full bg-green transition-[width] duration-300 ease-out`,style:{width:`${o}%`}})}),(0,c.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:t.map(e=>(0,c.jsxs)(`span`,{className:`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${l[e.tone??`short`]}`,children:[e.label,` `,e.countLabel]},e.id))})]})}var c,l,u;function d(){return(d=e((()=>{r(),c=o(),l={covered:`bg-green/10 text-green-dark`,short:`bg-gold/15 text-gold-dark`,critical:`bg-red/10 text-red`},u={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},s.__docgenInfo={description:`A compact, always-visible roster overview: overall spots filled, a progress track, and a chip per
targeted position coloured by its tone. Meant to be pinned above the attendee list so completeness
stays one glance away however far you scroll a large squad — the thing a flat list loses.

Prop-only (ADR-0017), and it re-presents what the server already computed rather than re-deriving
status: the chips come from \`rosterRows\`, the headline chip from \`rosterChip\`, and the filled count
is \`totalTarget − openSlots\` (both server-owned; #219). Returns null when no position carries a
target — there is nothing to be a fraction of, and the route falls back to the headcount breakdown.`,methods:[],displayName:`RosterBar`,props:{roster:{required:!0,tsType:{name:`EventRoster`},description:``}}}})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),d(),f=o(),{expect:p}=__STORYBOOK_MODULE_TEST__,m={title:`entities/event/RosterBar`,component:s,args:{roster:t()},decorators:[e=>(0,f.jsx)(`div`,{className:`max-w-md`,children:(0,f.jsx)(e,{})})]},h={play:async({canvas:e})=>{await p(e.getByText(/4\/5 spots/)).toBeInTheDocument(),await p(e.getByText(/1 spot open/)).toBeInTheDocument(),await p(e.getByText(/Middle 1\/2/)).toBeInTheDocument()}},g={args:{roster:t({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-middle`,label:`Middle`,required:2,attending:0}],state:`CRITICAL`})},play:async({canvas:e})=>{await p(e.getByText(/2 spots open/)).toBeInTheDocument(),await p(e.getByText(/Middle 0\/2/)).toBeInTheDocument()}},_={args:{roster:t({positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-libero`,label:`Libero`,required:1,attending:1}],state:`LINEUP_SET`})},play:async({canvas:e})=>{await p(e.getByText(/3\/3 spots/)).toBeInTheDocument(),await p(e.getByText(/Lineup set/)).toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/4\\/5 spots/)).toBeInTheDocument();
    await expect(canvas.getByText(/1 spot open/)).toBeInTheDocument();
    await expect(canvas.getByText(/Middle 1\\/2/)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2
      }, {
        id: 'pos-middle',
        label: 'Middle',
        required: 2,
        attending: 0
      }],
      state: 'CRITICAL'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/2 spots open/)).toBeInTheDocument();
    await expect(canvas.getByText(/Middle 0\\/2/)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [{
        id: 'pos-setter',
        label: 'Setter',
        required: 2,
        attending: 2
      }, {
        id: 'pos-libero',
        label: 'Libero',
        required: 1,
        attending: 1
      }],
      state: 'LINEUP_SET'
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/3\\/3 spots/)).toBeInTheDocument();
    await expect(canvas.getByText(/Lineup set/)).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v=[`OneSpotOpen`,`Critical`,`LineupSet`]})))()}y();export{g as Critical,_ as LineupSet,h as OneSpotOpen,v as __namedExportsOrder,m as default};