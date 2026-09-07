import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DVvbbR_a.js";import{o as n,r,t as i}from"./event-fixtures-GLq-GGnS.js";import{n as a,t as o}from"./chevron-down-DC_VUp5d.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./AttendanceToggle-CLV5WREy.js";import{n as u,t as d}from"./avatar-vgaxelzA.js";function f(e,t){if(t.positions.length===0)return null;let n=new Set(t.positions.map(e=>e.label)),r=[];for(let n of t.positions){let t=e.filter(e=>e.role===n.label);t.length!==0&&r.push({positionLabel:n.label,countLabel:n.required==null?null:`${n.attending}/${n.required}`,attendees:t})}let i=e.filter(e=>!n.has(e.role));return i.length>0&&r.push({positionLabel:p,countLabel:null,attendees:i}),r}var p;function m(){return(m=e((()=>{p=`Unassigned`})))()}function h(e,t){let{changedBy:n}=e;return n==null||n===e.userId?null:t.find(e=>e.userId===n)?.displayName??`a teammate`}function g({attendees:e,roster:t,onRespond:n,currentUserId:r,pending:i=!1}){let[a,o]=(0,y.useState)(null);if(e.length===0)return(0,b.jsx)(`p`,{className:`py-6 text-center text-sm text-muted-foreground`,children:`No one`});let s=f(e,t),c=(t,s)=>(0,b.jsx)(v,{attendance:t,attribution:h(t,e),isSelf:t.userId===r,showRole:s,expanded:a===t.userId,pending:i,onToggle:()=>o(e=>e===t.userId?null:t.userId),onRespond:e=>{n(t.userId,e),o(null)}},t.userId);return s?(0,b.jsx)(`div`,{children:s.map(e=>(0,b.jsx)(_,{group:e,renderRow:e=>c(e,!1)},e.positionLabel))}):(0,b.jsx)(`div`,{className:`py-1`,children:e.map(e=>c(e,!0))})}function _({group:e,renderRow:t}){return(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{className:`flex items-center justify-between px-3 pb-1 pt-3`,children:[(0,b.jsx)(`h3`,{className:`text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:e.positionLabel}),e.countLabel&&(0,b.jsx)(`span`,{className:`text-[11px] font-bold tabular-nums text-foreground/70`,children:e.countLabel})]}),e.attendees.map(t)]})}function v({attendance:e,attribution:t,isSelf:n,showRole:r,expanded:i,pending:a,onToggle:s,onRespond:c}){let u=t?`set by ${t}`:r&&e.role&&e.role!==`Unassigned`?e.role:null,f=S[e.state];return(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-3 border-l-[3px] px-2.5 py-1.5 ${x[e.state]}`,children:[(0,b.jsx)(d,{userId:e.userId,name:e.displayName}),(0,b.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,b.jsxs)(`span`,{className:`block truncate text-sm leading-tight`,children:[e.displayName,n&&(0,b.jsx)(`span`,{className:`ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-[10px] font-bold tracking-wide text-blue`,children:`You`})]}),u&&(0,b.jsx)(`span`,{className:`block text-xs text-muted-foreground`,children:u})]}),(0,b.jsxs)(`button`,{type:`button`,"aria-expanded":i,onClick:s,className:`flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-1 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,children:[(0,b.jsx)(`span`,{className:`rounded-full px-2.5 py-1 text-xs font-semibold ${f.className}`,children:f.label}),(0,b.jsx)(o,{size:14,"aria-hidden":!0,className:`text-muted-foreground transition-transform duration-200 ${i?`rotate-180`:``}`}),(0,b.jsx)(`span`,{className:`sr-only`,children:i?`Hide answer options`:`Change ${e.displayName}'s answer`})]})]}),i&&(0,b.jsxs)(`div`,{className:`border-t border-dashed border-border px-2.5 pb-3 pt-2.5`,role:`group`,"aria-label":`${e.displayName}'s answer`,children:[!n&&(0,b.jsxs)(`p`,{className:`mb-2 text-xs text-muted-foreground`,children:[`Changing `,(0,b.jsx)(`span`,{className:`font-semibold text-foreground`,children:e.displayName}),`’s answer`]}),(0,b.jsx)(l,{value:e.state,disabled:a,onToggle:c})]})]})}var y,b,x,S;function C(){return(C=e((()=>{y=t(),a(),u(),c(),m(),b=s(),x={ATTENDING:`border-l-green bg-green/5`,MAYBE:`border-l-gold bg-gold/5`,ABSENT:`border-l-red bg-red/5`,NOT_RESPONDED:`border-l-border bg-transparent`},S={ATTENDING:{label:`Going`,className:`bg-green/10 text-green`},MAYBE:{label:`Maybe`,className:`bg-gold/20 text-gold-dark`},ABSENT:{label:`Can't`,className:`bg-red/10 text-red`},NOT_RESPONDED:{label:`Awaiting`,className:`bg-muted text-muted-foreground`}},g.__docgenInfo={description:`The event-detail attendance list: no tabs. Everyone is shown under their position (Unassigned last),
tinted by their answer, each row a collapsed answer pill that expands to the three-way control —
the same disclosure the event card uses, so the interaction is one thing app-wide. Editing anyone
is a deliberate two steps; the viewer's own fast path is the "Your response" control above the list.
Opening a teammate's control carries a quiet "Changing …" notice (a member may set a teammate's
answer — ADR-0003 — but should know they are). A row a teammate last changed reads \`set by …\` (⑪).

Prop-only apart from which row is open (ADR-0017): grouping and name resolution are pure helpers,
and the mutation (and its Undo toast) live in the route container. Rows keep their roster order —
an answer changing must not make the list jump.`,methods:[],displayName:`AttendeeList`,props:{attendees:{required:!0,tsType:{name:`Array`,elements:[{name:`AttendanceEntry`}],raw:`AttendanceEntry[]`},description:`Everyone on the event — every position section lists all its members, whatever their answer.`},roster:{required:!0,tsType:{name:`EventRoster`},description:``},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Fires with the *target* member's id — trust-based editing lets a member set a teammate's answer.`},currentUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The viewer, so their own row is marked and its edit skips the "changing …" notice.`},pending:{required:!1,tsType:{name:`boolean`},description:`An attendance write is in flight; the open control is held.`,defaultValue:{value:`false`,computed:!1}}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{r(),C(),w=s(),{expect:T,fn:E,within:D}=__STORYBOOK_MODULE_TEST__,O=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),k=[O(`u-set1`,`Sanne`,`Setter`),O(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),O(`u-lib`,`Lars`,`Libero`),O(`u-mid1`,`Milan`,`Middle`),O(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),O(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],A={title:`widgets/attendee-list/AttendeeList`,component:g,args:{attendees:k,roster:n(),onRespond:E()},decorators:[e=>(0,w.jsx)(`div`,{className:`max-w-md overflow-hidden rounded-2xl border border-border/40 bg-card`,children:(0,w.jsx)(e,{})})]},j={play:async({canvas:e})=>{await T(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await T(e.getByText(`2/2`)).toBeInTheDocument(),await T(e.getByText(`1/2`)).toBeInTheDocument();let t=e.getAllByRole(`heading`).map(e=>e.textContent);T(t.at(-1)).toContain(`Unassigned`),await T(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument(),await T(e.queryByRole(`group`)).not.toBeInTheDocument()}},M={args:{roster:i,attendees:[O(`u-a`,`Sanne`,`Unassigned`),O(`u-b`,`Lars`,`Unassigned`)]},play:async({canvas:e})=>{await T(e.queryByRole(`heading`)).not.toBeInTheDocument(),await T(e.getByRole(`button`,{name:/Change Sanne's answer/})).toBeInTheDocument()}},N={args:{attendees:[],roster:i},play:async({canvas:e})=>{await T(e.getByText(`No one`)).toBeInTheDocument()}},P={args:{currentUserId:`u-set1`},play:async({canvas:e})=>{await T(e.getByText(`You`)).toBeInTheDocument(),T(e.getAllByText(`You`)).toHaveLength(1)}},F={args:{roster:i,attendees:[O(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),O(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),O(`u-tim`,`Tim de Vries`,`Unassigned`)]},play:async({canvas:e})=>{await T(e.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await T(e.queryByText(/set by Me/)).not.toBeInTheDocument()}},I={args:{attendees:[O(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]},play:async({canvas:e,args:t})=>{await e.getByRole(`button`,{name:/Change Bob's answer/}).click(),await D(e.getByRole(`group`,{name:`Bob's answer`})).getByRole(`button`,{name:`Can't go`}).click(),await T(t.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`)}},L={args:{currentUserId:`u-set1`},play:async({canvas:e})=>{await e.getByRole(`button`,{name:/Change Sofia's answer/}).click(),await T(e.getByText(/Changing/)).toBeInTheDocument(),await T(D(e.getByRole(`group`,{name:`Sofia's answer`})).getByText(`Sofia`)).toBeInTheDocument(),await e.getByRole(`button`,{name:/Change Sanne's answer/}).click(),await T(e.queryByText(/Changing/)).not.toBeInTheDocument()}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Every position with someone gets a heading and the roster's own fraction beside it.
    await expect(canvas.getByRole('heading', {
      name: 'Setter'
    })).toBeInTheDocument();
    await expect(canvas.getByText('2/2')).toBeInTheDocument();
    await expect(canvas.getByText('1/2')).toBeInTheDocument(); // Middle, one short
    const headings = canvas.getAllByRole('heading').map(h => h.textContent);
    expect(headings.at(-1)).toContain('Unassigned');
    // Rows are collapsed: each is a disclosure trigger, and no answer control is on screen yet.
    await expect(canvas.getByRole('button', {
      name: /Change Sanne's answer/
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('group')).not.toBeInTheDocument();
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER,
    attendees: [att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Change Sanne's answer/
    })).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [],
    roster: NO_ROSTER
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No one')).toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('You')).toBeInTheDocument();
    expect(canvas.getAllByText('You')).toHaveLength(1);
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER,
    attendees: [att('u-bob', 'Bob', 'Unassigned', {
      changedBy: 'u-tim'
    }), att('u-me', 'Me', 'Unassigned', {
      changedBy: 'u-me'
    }), att('u-tim', 'Tim de Vries', 'Unassigned')]
  },
  play: async ({
    canvas
  }) => {
    // A row a teammate changed names them...
    await expect(canvas.getByText('set by Tim de Vries')).toBeInTheDocument();
    // ...and a row set by its own member says nothing — the negative is the whole design.
    await expect(canvas.queryByText(/set by Me/)).not.toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [att('u-bob', 'Bob', 'Setter', {
      state: 'ATTENDING'
    })]
  },
  play: async ({
    canvas,
    args
  }) => {
    // Expand Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await canvas.getByRole('button', {
      name: /Change Bob's answer/
    }).click();
    const control = within(canvas.getByRole('group', {
      name: "Bob's answer"
    }));
    await control.getByRole('button', {
      name: "Can't go"
    }).click();
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT');
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  // the viewer is Sanne
  play: async ({
    canvas
  }) => {
    // Opening a teammate's control announces whose answer you're about to change.
    await canvas.getByRole('button', {
      name: /Change Sofia's answer/
    }).click();
    await expect(canvas.getByText(/Changing/)).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', {
      name: "Sofia's answer"
    })).getByText('Sofia')).toBeInTheDocument();
    // The viewer's own row gets no such notice — it isn't a cross-member change.
    await canvas.getByRole('button', {
      name: /Change Sanne's answer/
    }).click();
    await expect(canvas.queryByText(/Changing/)).not.toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R=[`GroupedByPosition`,`FlatWhenNoPositions`,`Empty`,`YourRow`,`Attribution`,`EditingTargetsThatMember`,`ChangingATeammateShowsNotice`]})))()}z();export{F as Attribution,L as ChangingATeammateShowsNotice,I as EditingTargetsThatMember,N as Empty,M as FlatWhenNoPositions,j as GroupedByPosition,P as YourRow,R as __namedExportsOrder,A as default};