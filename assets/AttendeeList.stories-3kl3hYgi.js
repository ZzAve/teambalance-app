import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ByyS7Yi9.js";import{r as n,s as r,t as i}from"./event-fixtures-CuRrQuRB.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{t as o}from"./attribution-BNYbBukc.js";import{n as s,t as c}from"./SectionLabel-B5oFQ-GJ.js";import{n as l,t as u}from"./avatar-BavbRZxs.js";import{c as d,n as f,o as p,r as m,s as h,t as g}from"./AnswerSheet-CuIKl2Kq.js";function _({attendees:e,roster:t,onRespond:n,currentUserId:r,pending:i=!1}){let[a,s]=(0,b.useState)(null);if(e.length===0)return(0,x.jsx)(`p`,{className:`py-6 text-center text-small text-muted-foreground`,children:`No one`});let c=(e,t)=>s({userId:e.userId,displayName:e.displayName,state:e.state,isSelf:e.userId===r,position:t}),l=(t,i,a=!1)=>(0,x.jsx)(y,{attendance:t,attribution:o(t,e),isSelf:t.userId===r,showRole:a,onOpen:n&&(()=>c(t,i))},t.userId),u=n&&(0,x.jsx)(g,{target:a,onRespond:n,onClose:()=>s(null),pending:i});return t.positions.length===0?(0,x.jsxs)(`div`,{className:`py-1`,children:[e.map(e=>l(e,void 0,!0)),u]}):(0,x.jsxs)(`div`,{children:[h(e,t,r).map(t=>(0,x.jsx)(v,{row:t,attendees:e,renderRow:l},t.id)),u]})}function v({row:e,attendees:t,renderRow:n}){let r=d(e),i=[...e.members].sort((e,t)=>e.displayName.localeCompare(t.displayName));return(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3 px-3 pb-1 pt-3`,children:[(0,x.jsx)(c,{as:`h3`,children:e.label}),(0,x.jsxs)(`span`,{className:`flex items-baseline gap-1.5`,children:[r&&(0,x.jsx)(`span`,{className:`text-caption font-semibold ${w[e.tone??`short`]}`,children:r}),e.required!=null&&(0,x.jsx)(`span`,{className:`text-caption font-bold tabular-nums text-foreground/70`,children:`${e.attending}/${e.required}`})]})]}),i.length===0?(0,x.jsx)(`p`,{className:`px-3 pb-2 text-caption italic text-muted-foreground`,children:`nobody in this position yet`}):i.map(r=>n(t.find(e=>e.userId===r.userId),e.label))]})}function y({attendance:e,attribution:t,isSelf:n,showRole:r,onOpen:i}){let a=t?`set by ${t}`:r&&e.role&&e.role!==`Unassigned`?e.role:null,o=(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(u,{userId:e.userId,name:e.displayName}),(0,x.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,x.jsxs)(`span`,{className:`block truncate text-small leading-tight`,children:[e.displayName,n&&(0,x.jsx)(`span`,{className:`ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-blue`,children:`You`})]}),a&&(0,x.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:a})]}),(0,x.jsx)(`span`,{className:`shrink-0 rounded-full px-2.5 py-1 text-caption font-semibold ${C[e.state]}`,children:m[e.state]})]}),s=`flex w-full items-center gap-3 border-l-[3px] px-2.5 py-1.5 text-left ${S[e.state]}`;return i?(0,x.jsx)(`button`,{type:`button`,onClick:i,"aria-label":`${e.displayName}${n?` (you)`:``} — ${m[e.state]}. Change their answer`,className:`${s} transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`,children:o}):(0,x.jsx)(`div`,{className:s,children:o})}var b,x,S,C,w;function T(){return(T=e((()=>{b=t(),l(),f(),p(),s(),x=a(),S={ATTENDING:`border-l-green bg-green/5`,MAYBE:`border-l-gold bg-gold/5`,ABSENT:`border-l-red bg-red/5`,NOT_RESPONDED:`border-l-border bg-transparent`},C={ATTENDING:`bg-green/10 text-green`,MAYBE:`bg-gold/20 text-gold-dark`,ABSENT:`bg-red/10 text-red`,NOT_RESPONDED:`bg-muted text-muted-foreground`},w={covered:`text-green-dark`,short:`text-gold-dark`,critical:`text-red`},_.__docgenInfo={description:`The event-detail attendance list: everyone under their position, Unassigned last, tinted by their
answer, and any row opens the answer sheet.

It is the unabridged half of what the event card shows. The card compresses a position into
overlapping chips capped at five; here there is room for the avatar, the whole name, the \`set by …\`
attribution and the role, so nothing is dropped. What the two share is the *model* and the
*words*: both build their rows with [lineupRows], both lead with [verdictWord] before the fraction,
and both open the one [AnswerSheet]. A reader who learned the card has nothing new to learn here.

Two deliberate differences from the card, both because the jobs differ:

  - **Rows keep roster order and sort by name inside a position, never by answer.** The card sorts
    by state because you are scanning it; you are *editing* here, and a row that jumps out from
    under your finger the moment you set it is a bug, not a feature.
  - **No cap.** Crowding collapses on a card because a card has ~40px to give. A page does not.

Prop-only apart from which row's sheet is open (ADR-0017): grouping and name resolution are pure
helpers, and the mutation (and its Undo toast) live in the route container.`,methods:[],displayName:`AttendeeList`,props:{attendees:{required:!0,tsType:{name:`Array`,elements:[{name:`AttendanceEntry`}],raw:`AttendanceEntry[]`},description:`Everyone on the event — every position section lists all its members, whatever their answer.`},roster:{required:!0,tsType:{name:`EventRoster`},description:``},onRespond:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Fires with the *target* member's id — trust-based editing lets a member set a teammate's answer.

**Omit it to render the list read-only.** There is no separate \`readOnly\` flag on purpose — with
one, "read-only but respondable" would be a state to reason about.`},currentUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The viewer, so their own row is marked and the sheet knows it is not a cross-member change.`},pending:{required:!1,tsType:{name:`boolean`},description:`An attendance write is in flight; the open control is held.`,defaultValue:{value:`false`,computed:!1}}}}})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{n(),T(),E=a(),{expect:D,fn:O,within:k}=__STORYBOOK_MODULE_TEST__,A=(e,t,n,r={})=>({id:e,userId:e,displayName:t,role:n,state:`ATTENDING`,changedBy:void 0,updatedAt:void 0,...r}),j=[A(`u-set1`,`Sanne`,`Setter`),A(`u-set2`,`Sofia`,`Setter`,{state:`MAYBE`}),A(`u-lib`,`Lars`,`Libero`),A(`u-mid1`,`Milan`,`Middle`),A(`u-mid2`,`Mees`,`Middle`,{state:`ABSENT`}),A(`u-un`,`Uwe`,`Unassigned`,{state:`NOT_RESPONDED`})],M={title:`widgets/attendee-list/AttendeeList`,component:_,args:{attendees:j,roster:r(),onRespond:O()},decorators:[e=>(0,E.jsx)(`div`,{className:`max-w-md overflow-hidden rounded-lg border border-border/40 bg-card`,children:(0,E.jsx)(e,{})})]},N={play:async({canvas:e})=>{let t=t=>k(e.getByRole(`heading`,{name:t}).parentElement);await D(t(`Setter`).getByText(`needs 1 more`)).toBeInTheDocument(),await D(t(`Setter`).getByText(`1/2`)).toBeInTheDocument(),await D(t(`Libero`).getByText(`covered`)).toBeInTheDocument(),await D(t(`Libero`).getByText(`1/1`)).toBeInTheDocument();let n=e.getAllByRole(`heading`).map(e=>e.textContent);D(n.at(-1)).toContain(`Unassigned`),await D(t(`Unassigned`).queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument(),await D(e.getByRole(`button`,{name:/Sanne — Going/})).toBeInTheDocument(),await D(k(document.body).queryByRole(`dialog`)).not.toBeInTheDocument()}},P={args:{roster:i,attendees:[A(`u-a`,`Sanne`,`Unassigned`),A(`u-b`,`Lars`,`Unassigned`)]},play:async({canvas:e})=>{await D(e.queryByRole(`heading`)).not.toBeInTheDocument(),await D(e.getByRole(`button`,{name:/Sanne — Going/})).toBeInTheDocument()}},F={args:{attendees:[],roster:i},play:async({canvas:e})=>{await D(e.getByText(`No one`)).toBeInTheDocument()}},I={args:{currentUserId:`u-set1`},play:async({canvas:e})=>{await D(e.getByText(`You`)).toBeInTheDocument(),D(e.getAllByText(`You`)).toHaveLength(1)}},L={args:{roster:i,attendees:[A(`u-bob`,`Bob`,`Unassigned`,{changedBy:`u-tim`}),A(`u-me`,`Me`,`Unassigned`,{changedBy:`u-me`}),A(`u-tim`,`Tim de Vries`,`Unassigned`)]},play:async({canvas:e})=>{await D(e.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await D(e.queryByText(/set by Me/)).not.toBeInTheDocument()}},R={args:{attendees:[A(`u-bob`,`Bob`,`Setter`,{state:`ATTENDING`})]},play:async({canvas:e,args:t})=>{await e.getByRole(`button`,{name:/Bob — Going/}).click(),await k(await k(document.body).findByRole(`dialog`)).getByRole(`button`,{name:`Can't go`}).click(),await D(t.onRespond).toHaveBeenCalledWith(`u-bob`,`ABSENT`)}},z={args:{currentUserId:`u-set1`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Sofia — Maybe/}));let n=k(document.body),r=k(await n.findByRole(`dialog`));await D(r.getByText(`Sofia`)).toBeInTheDocument(),await D(r.getByText(/Setter · currently maybe · you are answering for them/)).toBeInTheDocument()}},B={args:{currentUserId:`u-set1`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Sanne \(you\) — Going/}));let n=k(await k(document.body).findByRole(`dialog`));await D(n.getByText(/Setter · currently going/)).toBeInTheDocument(),await D(n.queryByText(/answering for them/)).not.toBeInTheDocument()}},V={args:{onRespond:void 0},play:async({canvas:e})=>{await D(e.getByRole(`heading`,{name:`Setter`})).toBeInTheDocument(),await D(e.getByText(`Sanne`)).toBeInTheDocument(),await D(e.getByText(`Awaiting`)).toBeInTheDocument(),await D(e.queryByRole(`button`)).not.toBeInTheDocument()}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const heading = (name: string) => within(canvas.getByRole('heading', {
      name
    }).parentElement!);

    // Each position's verdict leads and its fraction is demoted — the card's order, the card's words.
    // Setter's two people are one Going and one Maybe, so the fraction counts the *attending* member
    // rather than the roster's server-side 2/2: the heading can never contradict the rows beneath it.
    await expect(heading('Setter').getByText('needs 1 more')).toBeInTheDocument();
    await expect(heading('Setter').getByText('1/2')).toBeInTheDocument();
    await expect(heading('Libero').getByText('covered')).toBeInTheDocument();
    await expect(heading('Libero').getByText('1/1')).toBeInTheDocument();

    // Unassigned is last and carries no verdict — there is nothing for it to fall short of.
    const headings = canvas.getAllByRole('heading').map(h => h.textContent);
    expect(headings.at(-1)).toContain('Unassigned');
    await expect(heading('Unassigned').queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument();

    // Nothing is open: each row is a way into the sheet, and no answer control is on screen yet.
    await expect(canvas.getByRole('button', {
      name: /Sanne — Going/
    })).toBeInTheDocument();
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    roster: NO_ROSTER,
    attendees: [att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Sanne — Going/
    })).toBeInTheDocument();
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [],
    roster: NO_ROSTER
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No one')).toBeInTheDocument();
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('You')).toBeInTheDocument();
    expect(canvas.getAllByText('You')).toHaveLength(1);
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    attendees: [att('u-bob', 'Bob', 'Setter', {
      state: 'ATTENDING'
    })]
  },
  play: async ({
    canvas,
    args
  }) => {
    // Open Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await canvas.getByRole('button', {
      name: /Bob — Going/
    }).click();
    // The sheet is a portal, so it lands on document.body rather than inside the canvas.
    const sheet = within(await within(document.body).findByRole('dialog'));
    await sheet.getByRole('button', {
      name: "Can't go"
    }).click();
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT');
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  // the viewer is Sanne
  play: async ({
    canvas,
    userEvent
  }) => {
    // The sheet names the teammate, their position and that you are answering for them.
    await userEvent.click(canvas.getByRole('button', {
      name: /Sofia — Maybe/
    }));
    const body = within(document.body);
    const sheet = within(await body.findByRole('dialog'));
    await expect(sheet.getByText('Sofia')).toBeInTheDocument();
    await expect(sheet.getByText(/Setter · currently maybe · you are answering for them/)).toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    currentUserId: 'u-set1'
  },
  // the viewer is Sanne
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Sanne \\(you\\) — Going/
    }));
    const sheet = within(await within(document.body).findByRole('dialog'));
    await expect(sheet.getByText(/Setter · currently going/)).toBeInTheDocument();
    await expect(sheet.queryByText(/answering for them/)).not.toBeInTheDocument();
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    onRespond: undefined
  },
  play: async ({
    canvas
  }) => {
    // The list itself is unchanged — same groups, same names, same answers.
    await expect(canvas.getByRole('heading', {
      name: 'Setter'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Sanne')).toBeInTheDocument();
    await expect(canvas.getByText('Awaiting')).toBeInTheDocument();
    // But no row is a control, so there is no route to anyone's answer.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  }
}`,...V.parameters?.docs?.source}}},H=[`GroupedByPosition`,`FlatWhenNoPositions`,`Empty`,`YourRow`,`Attribution`,`EditingTargetsThatMember`,`ChangingATeammateSaysSo`,`AnsweringForYourselfSaysNothingExtra`,`ReadOnly`]})))()}U();export{B as AnsweringForYourselfSaysNothingExtra,L as Attribution,z as ChangingATeammateSaysSo,R as EditingTargetsThatMember,F as Empty,P as FlatWhenNoPositions,N as GroupedByPosition,V as ReadOnly,I as YourRow,H as __namedExportsOrder,M as default};