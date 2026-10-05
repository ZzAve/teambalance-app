import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-D-WZm2as.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as ee}from"./link-BeUIVTlP.js";import{n as c,t as l}from"./router-decorator-Dh-Me_2c.js";import{r as u,t as te}from"./app-column-decorator-Cd2vRJI0.js";import{a as d,c as f,i as p,r as m,s as h,t as g}from"./event-fixtures-C1ds5yXh.js";import{n as _,t as v}from"./createLucideIcon-BfLWGXMF.js";import{n as y,t as ne}from"./calendar-days-syu-ZLn2.js";import{i as b,n as re,r as ie,t as ae}from"./map-pin-FLgJyP75.js";import{n as oe,t as se}from"./EventTypeIcon-DFxwaf6c.js";import{i as ce,n as le,r as ue,t as de}from"./ReferenceChips-4pAEO6ME.js";import{n as fe,t as pe}from"./EventTypeBadge-C7AGEe8W.js";import{n as me,t as he}from"./EventDetailSkeleton-5wfJkgy3.js";import{r as ge}from"./attribution-D0ubBBus.js";import{n as x,t as S}from"./button-D41Fc0KU.js";import{n as _e,t as ve}from"./RoleBreakdown-QN_vWfAD.js";import{n as ye,t as be}from"./SectionLabel-_vzOhMMA.js";import{n as xe,t as Se}from"./RosterBar-CBG8OF71.js";import{i as Ce,n as we,r as Te,t as Ee}from"./SeriesPeek-CUN2H2Dw.js";import{n as De,r as Oe,t as C}from"./app-shell-decorator-BoLgc7Z3.js";import{n as ke,t as Ae}from"./AttendanceToggle-BWXSQgPl.js";import{n as je,r as Me}from"./SubstitutesBlock-Cnor8oDM.js";import{n as Ne,t as Pe}from"./SubstituteSheet-DusQ5Slf.js";import{n as Fe,t as Ie}from"./MapsLink-BoIsKYBK.js";import{n as Le,t as Re}from"./QueryErrorState-Ddh6AmLV.js";import{n as ze,t as Be}from"./AttendeeList-BNvdDSKZ.js";import{n as Ve,t as He}from"./PageHeader-BJvSgWb0.js";var w,T;function E(){return(E=e((()=>{_(),w=[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]],T=v(`link-2`,w)})))()}var D,O;function k(){return(k=e((()=>{_(),D=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],O=v(`pencil`,D)})))()}var A,j;function M(){return(M=e((()=>{_(),A=[[`path`,{d:`M21 5H3`,key:`1fi0y6`}],[`path`,{d:`M15 12H3`,key:`6jk70r`}],[`path`,{d:`M17 19H3`,key:`z6ezky`}]],j=v(`text-align-start`,A)})))()}var N,P;function F(){return(F=e((()=>{_(),N=[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],P=v(`trash-2`,N)})))()}function I({isLoading:e,isError:t,onRetry:n,backTo:r,event:i,currentUserId:a,myState:o,myAttribution:s,isPending:c=!1,isSubstitutePending:l=!1,onToggleMine:u,onRespond:te,onSetSubstituteState:d,onTakeOffSubstitute:f,onCallInSubstitutes:p,seriesPeek:m,adminActions:h}){let[g,_]=(0,R.useState)(null);if(e)return(0,z.jsx)(he,{});if(t)return(0,z.jsx)(Re,{title:`Couldn't load this event`,description:`Something went wrong on our end. Give it another try.`,onRetry:()=>n?.(),children:(0,z.jsx)(S,{asChild:!0,variant:`ghost`,children:(0,z.jsx)(ee,{to:r,children:`Back to events`})})});if(!i)return(0,z.jsx)(`p`,{children:`Event not found.`});let v=new Date(i.startTime),y=i.roster.positions.some(e=>e.required!=null),b=i.substitutes.find(e=>e.substituteId===g),re=y||i.roster.trackRoster;return(0,z.jsxs)(`div`,{children:[(0,z.jsx)(He,{title:i.title,backTo:r,backLabel:`Back to events`}),(0,z.jsxs)(`div`,{className:`mt-2 rounded-lg border border-border/40 bg-card p-5 shadow-sm`,children:[(0,z.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,z.jsx)(se,{type:i.eventType,size:`md`}),(0,z.jsxs)(`div`,{className:`min-w-0`,children:[(0,z.jsx)(pe,{type:i.eventType}),(0,z.jsx)(`h1`,{className:`mt-1 font-display text-title font-bold leading-tight`,children:i.title})]})]}),(0,z.jsxs)(`dl`,{className:`mt-5 space-y-4 border-t border-border/40 pt-5 text-body`,children:[(0,z.jsx)(L,{icon:ne,label:`Date`,children:v.toLocaleDateString(`nl-NL`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}),(0,z.jsx)(L,{icon:ie,label:`Time`,children:v.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})}),i.location&&(0,z.jsx)(L,{icon:ae,label:`Location`,children:(0,z.jsxs)(Ie,{location:i.location,className:`inline-flex items-center gap-1.5 font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue`,children:[i.location,(0,z.jsx)(ue,{size:14,className:`shrink-0`,"aria-hidden":!0})]})}),i.description&&(0,z.jsx)(L,{icon:j,label:`Description`,children:(0,z.jsx)(`p`,{className:`leading-relaxed text-muted-foreground`,children:i.description})}),i.references.length>0&&(0,z.jsx)(L,{icon:T,label:`Additional info`,children:(0,z.jsx)(de,{references:i.references,max:i.references.length})})]})]}),re&&(0,z.jsx)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,z.jsx)(Se,{roster:i.roster})}),a&&(0,z.jsxs)(`div`,{className:`mt-6`,children:[(0,z.jsx)(be,{as:`p`,className:`mb-3`,children:`Your response`}),(0,z.jsx)(`div`,{role:`group`,"aria-label":`Your response`,children:(0,z.jsx)(Ae,{value:o,disabled:c,onToggle:u})}),s&&(0,z.jsxs)(`p`,{className:`mt-2 text-caption text-muted-foreground`,children:[`set by `,s]})]}),(0,z.jsxs)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:[!y&&(0,z.jsx)(ve,{breakdown:i.attendanceSummary.roleBreakdown}),(0,z.jsx)(Be,{attendees:i.attendances,roster:i.roster,currentUserId:a,onRespond:te,pending:c,substitutes:i.substitutes,onOpenSubstitute:_,onFindSubstitute:p})]}),(0,z.jsx)(je,{substitutes:i.substitutes,members:i.attendances,onSetState:d,onOpen:_,onCallIn:()=>p(null),pending:l}),(0,z.jsx)(Pe,{substitute:b??null,setBy:b?ge(b.changedBy,i.attendances):null,onSetState:d,onTakeOff:f,onClose:()=>_(null),pending:l}),m&&(0,z.jsx)(Ee,{peek:m}),h&&(0,z.jsx)(`div`,{className:`mt-6 flex gap-2.5 border-t border-border/40 pt-5`,children:h})]})}function L({icon:e,label:t,children:n}){return(0,z.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,z.jsxs)(`dt`,{className:`flex h-6 shrink-0 items-center text-muted-foreground`,children:[(0,z.jsx)(e,{size:18,"aria-hidden":!0}),(0,z.jsx)(`span`,{className:`sr-only`,children:t})]}),(0,z.jsx)(`dd`,{className:`min-w-0 flex-1`,children:n})]})}var R,z;function B(){return(B=e((()=>{R=t(),s(),M(),y(),b(),ce(),E(),re(),x(),Fe(),Le(),ye(),fe(),oe(),me(),le(),_e(),xe(),we(),ze(),Ve(),ke(),Me(),Ne(),z=i(),I.__docgenInfo={description:`The event-detail page laid out (ADR-0032 §3): load and error shells, then one card with the
event's identity, description and references, the roster bar, the viewer's response, the
attendance list, the series peek and the admin actions. Prop-only — the mutation, its
cross-member Undo toast and the sibling lookup stay in the route; the story renders every
section with zero network.`,methods:[],displayName:`EventDetailView`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},backTo:{required:!0,tsType:{name:`string`},description:`Where "Back to events" goes.`},event:{required:!0,tsType:{name:`union`,raw:`EventDetail | null`,elements:[{name:`EventDetail`},{name:`null`}]},description:``},currentUserId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:``},myAttribution:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Who last set the viewer's own answer, when it was a teammate (⑪).`},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},isSubstitutePending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the Substitute controls are held.`,defaultValue:{value:`false`,computed:!1}},onToggleMine:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`The viewer changing their own answer.`},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream.`},onSetSubstituteState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteState`},name:`state`}],return:{name:`void`}}},description:`Any Member changing a Substitute's state on this event (ADR-0033).`},onTakeOffSubstitute:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`}],return:{name:`void`}}},description:`Takes a Substitute off this event; they stay on the Team's list.`},onCallInSubstitutes:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: PositionRef | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Opens the picker for calling Substitutes in: for one Position from its nudge, else unfiltered.`},seriesPeek:{required:!0,tsType:{name:`union`,raw:`SeriesPeekModel | null`,elements:[{name:`SeriesPeekModel`},{name:`null`}]},description:``},adminActions:{required:!1,tsType:{name:`ReactNode`},description:`Scoped series edit/delete (ADR-0014 Phase 3); absent for members.`}}}})))()}var V,H,U,W,G,K,q,Ue,J,We,Ge,Y,Ke,X,Z,Q,qe;function $(){return($=e((()=>{k(),F(),x(),m(),a(),u(),l(),Ce(),Oe(),r(),B(),V=i(),{expect:H,fn:U,within:W}=__STORYBOOK_MODULE_TEST__,G=[p(`u-me`,`Julius`,`Setter`),p(`u-2`,`Sanne`,`Setter`),p(`u-3`,`Lars`,`Libero`),p(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),p(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),p(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],K=`rg-1`,q=e=>new Date(2026,7,e,20,0).toISOString(),Ue=[d({id:`evt-1`,recurringGroup:K,startTime:q(5)}),d({id:`evt-2`,recurringGroup:K,startTime:q(12)}),d({id:`evt-3`,recurringGroup:K,startTime:q(19)}),d({id:`evt-4`,recurringGroup:K,startTime:q(26)})],J=d({id:`evt-2`,eventType:{id:`et-1`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,description:`Serve-receive drills first, then six-on-six. Bring both kits.`,startTime:q(12),endTime:new Date(2026,7,12,22,0).toISOString(),location:`Sporthal De Toekomst`,references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`}],recurringGroup:K,attendances:G,substitutes:[f(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},changedBy:`u-2`}),f(`sub-2`,`Mila Jansen`,{state:`MAYBE`})],myState:`ATTENDING`,roster:h({substituteAttending:1})}),We=d({id:`evt-social`,eventType:{id:`et-3`,name:`Social`,color:`#D9A23B`},title:`Season kick-off drinks`,startTime:q(22),endTime:new Date(2026,7,22,23,0).toISOString(),location:`Café De Zon`,attendances:G,myState:`ABSENT`,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1}]},roster:{...g,totalAttending:3}}),Ge=(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(S,{variant:`outline`,className:`flex-1`,children:[(0,V.jsx)(O,{size:15}),`Edit event`]}),(0,V.jsxs)(S,{variant:`outline`,className:`flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red`,children:[(0,V.jsx)(P,{size:15}),`Delete`]})]}),Y=De(`events`),Ke={title:`pages/event-detail/EventDetailView`,component:I,parameters:Y.parameters,args:{backTo:C.events,event:J,currentUserId:`u-me`,myState:`ATTENDING`,myAttribution:null,seriesPeek:Te(Ue,J.id),adminActions:Ge,onRetry:U(),onToggleMine:U(),onRespond:U(),onSetSubstituteState:U(),onTakeOffSubstitute:U(),onCallInSubstitutes:U()}},X={decorators:Y.decorators,parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await H(e.getByRole(`link`,{name:`Back to events`})).toHaveAttribute(`href`,C.events),await H(e.getByRole(`heading`,{level:1,name:`Training — Court 2`})).toBeInTheDocument(),await H(e.getByRole(`link`,{name:/Sporthal De Toekomst/})).toHaveAttribute(`href`,`https://maps.google.com/?q=Sporthal%20De%20Toekomst`);let t=W(e.getByRole(`group`,{name:`Your response`}));await H(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await H(e.getByText(`Serve-receive drills first, then six-on-six. Bring both kits.`)).toBeInTheDocument(),await H(e.getByRole(`link`,{name:`Nevobo`})).toBeInTheDocument(),await H(e.getByRole(`link`,{name:`Match form`})).toBeInTheDocument();for(let t of[`Julius`,`Sanne`,`Lars`,`Sofia`,`Tim`,`Noor`])await H(e.getByText(t)).toBeInTheDocument();await H(e.getByText(`+ 1 substitute`)).toBeInTheDocument();let n=e.getByRole(`region`,{name:`Substitutes`});await H(n).toHaveTextContent(`1 going · 1 asked`);let r=W(n);await H(r.getByText(`Jan de Vries`)).toBeInTheDocument(),await H(r.getByText(`Libero · set by Sanne`)).toBeInTheDocument(),await H(r.getByText(`Mila Jansen`)).toBeInTheDocument(),await H(e.getByRole(`button`,{name:/^Jan de Vries, substitute — Going/})).toBeInTheDocument(),await H(e.getByRole(`button`,{name:/^Mila Jansen, substitute — Maybe/})).toBeInTheDocument(),await H(e.getByRole(`button`,{name:`Edit event`})).toBeInTheDocument(),await H(e.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await H(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Z={decorators:[...te.decorators,c],render:e=>(0,V.jsx)(o,{items:{Loading:(0,V.jsx)(I,{...e,event:null,isLoading:!0}),Error:(0,V.jsx)(I,{...e,event:null,isError:!0}),"Not found":(0,V.jsx)(I,{...e,event:null}),"Member on a social":(0,V.jsx)(I,{...e,event:We,myState:`ABSENT`,myAttribution:`Tim de Vries`,seriesPeek:null,adminActions:void 0})}}),play:async({canvas:e})=>{let t=t=>W(e.getByRole(`region`,{name:t}));await H(t(`Loading`).queryByRole(`heading`,{level:1})).not.toBeInTheDocument(),await H(t(`Error`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await H(t(`Error`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await H(t(`Not found`).getByText(`Event not found.`)).toBeInTheDocument();let n=t(`Member on a social`);await H(n.getByRole(`heading`,{level:1,name:`Season kick-off drinks`})).toBeInTheDocument(),await H(n.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await H(n.queryByRole(`button`,{name:`Edit event`})).not.toBeInTheDocument(),await H(n.queryByText(`Additional info`)).not.toBeInTheDocument()}},Q={decorators:Y.decorators,parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,V.jsx)(o,{items:{Event:(0,V.jsx)(I,{...e}),Error:(0,V.jsx)(I,{...e,event:null,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>W(e.getByRole(`region`,{name:t})),i=r(`Event`);await t.click(W(i.getByRole(`group`,{name:`Your response`})).getByRole(`button`,{name:`Maybe`})),await H(n.onToggleMine).toHaveBeenCalledWith(`MAYBE`),await t.click(i.getByRole(`button`,{name:/Sofia — Maybe/}));let a=W(await W(document.body).findByRole(`dialog`));await H(a.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Can't go`})),await H(n.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`);let o=W(i.getByRole(`region`,{name:`Substitutes`}));await t.click(W(o.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Going`})),await H(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ATTENDING`),await t.click(o.getByRole(`button`,{name:`Call in substitutes`})),await H(n.onCallInSubstitutes).toHaveBeenCalledWith(null),await t.click(i.getByRole(`button`,{name:/^Jan de Vries, substitute/}));let s=W(await W(document.body).findByRole(`dialog`,{name:`Jan de Vries`}));await H(s.getByText(`Substitute · Libero · set by Sanne`)).toBeInTheDocument(),await t.click(s.getByRole(`button`,{name:`Take off this event`})),await H(n.onTakeOffSubstitute).toHaveBeenCalledWith(`sub-1`),await t.click(o.getByRole(`button`,{name:/^Mila Jansen/})),s=W(await W(document.body).findByRole(`dialog`,{name:`Mila Jansen`})),await t.click(s.getByRole(`button`,{name:`Can't go`})),await H(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ABSENT`),await t.click(r(`Error`).getByRole(`button`,{name:/try again|retry/i})),await H(n.onRetry).toHaveBeenCalled()}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Back to events'
    })).toHaveAttribute('href', SHELL_ROUTES.events);
    await expect(canvas.getByRole('heading', {
      level: 1,
      name: 'Training — Court 2'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: /Sporthal De Toekomst/
    })).toHaveAttribute('href', 'https://maps.google.com/?q=Sporthal%20De%20Toekomst');
    // The viewer's own answer is the pressed one in the primary control.
    const mine = within(canvas.getByRole('group', {
      name: 'Your response'
    }));
    await expect(mine.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Serve-receive drills first, then six-on-six. Bring both kits.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Nevobo'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Match form'
    })).toBeInTheDocument();
    // Everyone is listed, non-responders included (ADR-0030 §8).
    for (const name of ['Julius', 'Sanne', 'Lars', 'Sofia', 'Tim', 'Noor']) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }
    // Substitutes fill spots but are named apart from the Members going (ADR-0033).
    await expect(canvas.getByText('+ 1 substitute')).toBeInTheDocument();
    const block = canvas.getByRole('region', {
      name: 'Substitutes'
    });
    await expect(block).toHaveTextContent('1 going · 1 asked');
    const substitutes = within(block);
    await expect(substitutes.getByText('Jan de Vries')).toBeInTheDocument();
    await expect(substitutes.getByText('Libero · set by Sanne')).toBeInTheDocument();
    await expect(substitutes.getByText('Mila Jansen')).toBeInTheDocument();
    // They also sit in their Position group, tagged, in any state; without a Position, under Unassigned.
    await expect(canvas.getByRole('button', {
      name: /^Jan de Vries, substitute — Going/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /^Mila Jansen, substitute — Maybe/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Edit event'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Delete'
    })).toBeInTheDocument();
    // The shell around it: the Events tab stays current on a detail route under it.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  decorators: [...appColumn.decorators, withRouter],
  render: args => <Stack items={{
    Loading: <EventDetailView {...args} event={null} isLoading />,
    Error: <EventDetailView {...args} event={null} isError />,
    'Not found': <EventDetailView {...args} event={null} />,
    'Member on a social': <EventDetailView {...args} event={SOCIAL} myState="ABSENT" myAttribution="Tim de Vries" seriesPeek={null} adminActions={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').queryByRole('heading', {
      level: 1
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load this event")).toBeInTheDocument();
    await expect(region('Error').getByRole('link', {
      name: 'Back to events'
    })).toBeInTheDocument();
    await expect(region('Not found').getByText('Event not found.')).toBeInTheDocument();
    const social = region('Member on a social');
    await expect(social.getByRole('heading', {
      level: 1,
      name: 'Season kick-off drinks'
    })).toBeInTheDocument();
    await expect(social.getByText('set by Tim de Vries')).toBeInTheDocument();
    await expect(social.queryByRole('button', {
      name: 'Edit event'
    })).not.toBeInTheDocument();
    await expect(social.queryByText('Additional info')).not.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  decorators: shell.decorators,
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Event: <EventDetailView {...args} />,
    Error: <EventDetailView {...args} event={null} isError />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const page = region('Event');

    // The viewer changing their own answer goes through the primary control.
    await userEvent.click(within(page.getByRole('group', {
      name: 'Your response'
    })).getByRole('button', {
      name: 'Maybe'
    }));
    await expect(args.onToggleMine).toHaveBeenCalledWith('MAYBE');

    // Changing a teammate's answer goes through their row into the answer sheet, which names them
    // and says you are answering for them (ADR-0003, trust-based; awareness, not friction).
    await userEvent.click(page.getByRole('button', {
      name: /Sofia — Maybe/
    }));
    const sheet = within(await within(document.body).findByRole('dialog'));
    await expect(sheet.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument();
    await userEvent.click(sheet.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-4', 'ABSENT');

    // Any Member moves a Substitute from asked to going inline, and calls more in (ADR-0033).
    const substitutes = within(page.getByRole('region', {
      name: 'Substitutes'
    }));
    await userEvent.click(within(substitutes.getByRole('group', {
      name: 'Mila Jansen'
    })).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetSubstituteState).toHaveBeenCalledWith('sub-2', 'ATTENDING');
    await userEvent.click(substitutes.getByRole('button', {
      name: 'Call in substitutes'
    }));
    await expect(args.onCallInSubstitutes).toHaveBeenCalledWith(null);

    // Tapping a Substitute, in their Position group or in the block, opens their sheet, which can also
    // take them off the event.
    await userEvent.click(page.getByRole('button', {
      name: /^Jan de Vries, substitute/
    }));
    let subSheet = within(await within(document.body).findByRole('dialog', {
      name: 'Jan de Vries'
    }));
    await expect(subSheet.getByText('Substitute · Libero · set by Sanne')).toBeInTheDocument();
    await userEvent.click(subSheet.getByRole('button', {
      name: 'Take off this event'
    }));
    await expect(args.onTakeOffSubstitute).toHaveBeenCalledWith('sub-1');
    await userEvent.click(substitutes.getByRole('button', {
      name: /^Mila Jansen/
    }));
    subSheet = within(await within(document.body).findByRole('dialog', {
      name: 'Mila Jansen'
    }));
    await userEvent.click(subSheet.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onSetSubstituteState).toHaveBeenCalledWith('sub-2', 'ABSENT');

    // The error shell's retry reaches the query.
    await userEvent.click(region('Error').getByRole('button', {
      name: /try again|retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...Q.parameters?.docs?.source}}},qe=[`Data`,`Shells`,`Interactions`]})))()}$();export{X as Data,Q as Interactions,Z as Shells,qe as __namedExportsOrder,Ke as default};