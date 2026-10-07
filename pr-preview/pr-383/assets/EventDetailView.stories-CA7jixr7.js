import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-C5-YsDqR.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-D87d-8jv.js";import{n as s,t as ee}from"./link-DjnD-M2E.js";import{a as c,c as l,i as u,r as d,s as f,t as te}from"./event-fixtures-C1ds5yXh.js";import{n as p,t as m}from"./createLucideIcon-Idduf6gc.js";import{n as h,t as ne}from"./calendar-days-6h_U1MFc.js";import{i as g,n as _,r as re,t as ie}from"./map-pin-BsgjaiLw.js";import{n as v,t as ae}from"./EventTypeIcon-DciZBh7w.js";import{i as y,n as b,r as oe,t as se}from"./ReferenceChips-CasA5hCu.js";import{i as x,n as ce,r as le,t as S}from"./InfoRow-CouZej-U.js";import{n as ue,t as de}from"./EventTypeBadge-C7AGEe8W.js";import{n as fe,t as pe}from"./EventDetailSkeleton-DlB41Zv2.js";import{r as me}from"./attribution-D0ubBBus.js";import{n as C,t as w}from"./button-BtUk0nl9.js";import{n as he,t as ge}from"./RoleBreakdown-QN_vWfAD.js";import{n as _e,t as ve}from"./SectionLabel-B5oFQ-GJ.js";import{n as ye,t as be}from"./RosterBar-DKGbCahK.js";import{i as xe,n as Se,r as Ce,t as we}from"./SeriesPeek-nfLifPuZ.js";import{n as Te,r as Ee,t as T}from"./app-shell-decorator-DE4FZT8p.js";import{n as De,t as Oe}from"./AttendanceToggle-Zo0GG6tV.js";import{n as ke,r as Ae}from"./SubstitutesBlock-BUeQjvOt.js";import{n as je,t as Me}from"./MapsLink-BoIsKYBK.js";import{n as Ne,t as Pe}from"./QueryErrorState-D9cY9kha.js";import{n as Fe,t as Ie}from"./AttendeeList-5HW8Uiq3.js";import{n as Le,t as Re}from"./PageHeader-CBKnb6qv.js";import{n as ze,t as Be}from"./SubstituteSheet-Cjjt74Ka.js";var E,D;function O(){return(O=e((()=>{p(),E=[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]],D=m(`link-2`,E)})))()}var k,A;function j(){return(j=e((()=>{p(),k=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],A=m(`pencil`,k)})))()}var M,N;function P(){return(P=e((()=>{p(),M=[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],N=m(`trash-2`,M)})))()}function F({isLoading:e,isError:t,onRetry:n,backTo:r,event:i,currentUserId:a,myState:o,myAttribution:s,isPending:c=!1,isSubstitutePending:l=!1,onToggleMine:u,onRespond:d,onSetSubstituteState:f,onTakeOffSubstitute:te,onCallInSubstitutes:p,seriesPeek:m,adminActions:h}){let[g,_]=(0,I.useState)(null);if(e)return(0,L.jsx)(pe,{});if(t)return(0,L.jsx)(Pe,{title:`Couldn't load this event`,description:`Something went wrong on our end. Give it another try.`,onRetry:()=>n?.(),children:(0,L.jsx)(w,{asChild:!0,variant:`ghost`,children:(0,L.jsx)(ee,{to:r,children:`Back to events`})})});if(!i)return(0,L.jsx)(`p`,{children:`Event not found.`});let v=new Date(i.startTime),y=i.roster.positions.some(e=>e.required!=null),b=i.substitutes.find(e=>e.substituteId===g),x=y||i.roster.trackRoster;return(0,L.jsxs)(`div`,{children:[(0,L.jsx)(Re,{title:i.title,backTo:r,backLabel:`Back to events`}),(0,L.jsxs)(`div`,{className:`mt-2 rounded-lg border border-border/40 bg-card p-5 shadow-sm`,children:[(0,L.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,L.jsx)(ae,{type:i.eventType,size:`md`}),(0,L.jsxs)(`div`,{className:`min-w-0`,children:[(0,L.jsx)(de,{type:i.eventType}),(0,L.jsx)(`h1`,{className:`mt-1 font-display text-title font-bold leading-tight`,children:i.title})]})]}),(0,L.jsxs)(`dl`,{className:`mt-5 space-y-4 border-t border-border/40 pt-5 text-body`,children:[(0,L.jsx)(S,{icon:ne,label:`Date`,children:v.toLocaleDateString(`nl-NL`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}),(0,L.jsx)(S,{icon:re,label:`Time`,children:v.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})}),i.location&&(0,L.jsx)(S,{icon:ie,label:`Location`,children:(0,L.jsxs)(Me,{location:i.location,className:`inline-flex items-center gap-1.5 font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue`,children:[i.location,(0,L.jsx)(oe,{size:14,className:`shrink-0`,"aria-hidden":!0})]})}),i.description&&(0,L.jsx)(S,{icon:le,label:`Description`,children:(0,L.jsx)(`p`,{className:`leading-relaxed text-muted-foreground`,children:i.description})}),i.references.length>0&&(0,L.jsx)(S,{icon:D,label:`Additional info`,children:(0,L.jsx)(se,{references:i.references,max:i.references.length})})]})]}),x&&(0,L.jsx)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,L.jsx)(be,{roster:i.roster})}),a&&(0,L.jsxs)(`div`,{className:`mt-6`,children:[(0,L.jsx)(ve,{as:`p`,className:`mb-3`,children:`Your response`}),(0,L.jsx)(`div`,{role:`group`,"aria-label":`Your response`,children:(0,L.jsx)(Oe,{value:o,disabled:c,onToggle:u})}),s&&(0,L.jsxs)(`p`,{className:`mt-2 text-caption text-muted-foreground`,children:[`set by `,s]})]}),(0,L.jsxs)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:[!y&&(0,L.jsx)(ge,{breakdown:i.attendanceSummary.roleBreakdown}),(0,L.jsx)(Ie,{attendees:i.attendances,roster:i.roster,currentUserId:a,onRespond:d,pending:c,substitutes:i.substitutes,onOpenSubstitute:_,onFindSubstitute:p})]}),(0,L.jsx)(ke,{substitutes:i.substitutes,members:i.attendances,onSetState:f,onOpen:_,onCallIn:()=>p(null),pending:l}),(0,L.jsx)(Be,{substitute:b??null,setBy:b?me(b.changedBy,i.attendances):null,onSetState:f,onTakeOff:te,onClose:()=>_(null),pending:l}),m&&(0,L.jsx)(we,{peek:m}),h&&(0,L.jsx)(`div`,{className:`mt-6 flex gap-2.5 border-t border-border/40 pt-5`,children:h})]})}var I,L;function R(){return(R=e((()=>{I=t(),s(),x(),h(),g(),y(),O(),_(),C(),ce(),je(),Ne(),_e(),ue(),v(),fe(),b(),he(),ye(),Se(),Fe(),Le(),De(),Ae(),ze(),L=i(),F.__docgenInfo={description:`The event-detail page laid out (ADR-0032 §3): load and error shells, then one card with the
event's identity, description and references, the roster bar, the viewer's response, the
attendance list, the series peek and the admin actions. Prop-only — the mutation, its
cross-member Undo toast and the sibling lookup stay in the route; the story renders every
section with zero network.`,methods:[],displayName:`EventDetailView`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},backTo:{required:!0,tsType:{name:`string`},description:`Where "Back to events" goes.`},event:{required:!0,tsType:{name:`union`,raw:`EventDetail | null`,elements:[{name:`EventDetail`},{name:`null`}]},description:``},currentUserId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:``},myAttribution:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Who last set the viewer's own answer, when it was a teammate (⑪).`},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},isSubstitutePending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the Substitute controls are held.`,defaultValue:{value:`false`,computed:!1}},onToggleMine:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`The viewer changing their own answer.`},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream.`},onSetSubstituteState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteState`},name:`state`}],return:{name:`void`}}},description:`Any Member changing a Substitute's state on this event (ADR-0033).`},onTakeOffSubstitute:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`}],return:{name:`void`}}},description:`Takes a Substitute off this event; they stay on the Team's list.`},onCallInSubstitutes:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: PositionRef | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Opens the picker for calling Substitutes in: for one Position from its nudge, else unfiltered.`},seriesPeek:{required:!0,tsType:{name:`union`,raw:`SeriesPeekModel | null`,elements:[{name:`SeriesPeekModel`},{name:`null`}]},description:``},adminActions:{required:!1,tsType:{name:`ReactNode`},description:`Scoped series edit/delete (ADR-0014 Phase 3); absent for members.`}}}})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Ve,Z,Q,$,He;function Ue(){return(Ue=e((()=>{j(),P(),C(),d(),a(),xe(),Ee(),r(),R(),z=i(),{expect:B,fn:V,within:H}=__STORYBOOK_MODULE_TEST__,U=[u(`u-me`,`Julius`,`Setter`),u(`u-2`,`Sanne`,`Setter`),u(`u-3`,`Lars`,`Libero`),u(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),u(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),u(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],W=`rg-1`,G=e=>new Date(2026,7,e,20,0).toISOString(),K=[c({id:`evt-1`,recurringGroup:W,startTime:G(5)}),c({id:`evt-2`,recurringGroup:W,startTime:G(12)}),c({id:`evt-3`,recurringGroup:W,startTime:G(19)}),c({id:`evt-4`,recurringGroup:W,startTime:G(26)})],q=c({id:`evt-2`,eventType:{id:`et-1`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,description:`Serve-receive drills first, then six-on-six. Bring both kits.`,startTime:G(12),endTime:new Date(2026,7,12,22,0).toISOString(),location:`Sporthal De Toekomst`,references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`}],recurringGroup:W,attendances:U,substitutes:[l(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},changedBy:`u-2`}),l(`sub-2`,`Mila Jansen`,{state:`MAYBE`})],myState:`ATTENDING`,roster:f({substituteAttending:1})}),J=c({id:`evt-social`,eventType:{id:`et-3`,name:`Social`,color:`#D9A23B`},title:`Season kick-off drinks`,startTime:G(22),endTime:new Date(2026,7,22,23,0).toISOString(),location:`Café De Zon`,attendances:U,myState:`ABSENT`,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1}]},roster:{...te,totalAttending:3}}),Y=(0,z.jsxs)(z.Fragment,{children:[(0,z.jsxs)(w,{variant:`outline`,className:`flex-1`,children:[(0,z.jsx)(A,{size:15}),`Edit event`]}),(0,z.jsxs)(w,{variant:`outline`,className:`flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red`,children:[(0,z.jsx)(N,{size:15}),`Delete`]})]}),X=Te(`events`),Ve={title:`pages/event-detail/EventDetailView`,component:F,decorators:X.decorators,parameters:X.parameters,args:{backTo:T.events,event:q,currentUserId:`u-me`,myState:`ATTENDING`,myAttribution:null,seriesPeek:Ce(K,q.id),adminActions:Y,onRetry:V(),onToggleMine:V(),onRespond:V(),onSetSubstituteState:V(),onTakeOffSubstitute:V(),onCallInSubstitutes:V()}},Z={parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await B(e.getByRole(`link`,{name:`Back to events`})).toHaveAttribute(`href`,T.events),await B(e.getByRole(`heading`,{level:1,name:`Training — Court 2`})).toBeInTheDocument(),await B(e.getByRole(`link`,{name:/Sporthal De Toekomst/})).toHaveAttribute(`href`,`https://maps.google.com/?q=Sporthal%20De%20Toekomst`);let t=H(e.getByRole(`group`,{name:`Your response`}));await B(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await B(e.getByText(`Serve-receive drills first, then six-on-six. Bring both kits.`)).toBeInTheDocument(),await B(e.getByRole(`link`,{name:`Nevobo`})).toBeInTheDocument(),await B(e.getByRole(`link`,{name:`Match form`})).toBeInTheDocument();for(let t of[`Julius`,`Sanne`,`Lars`,`Sofia`,`Tim`,`Noor`])await B(e.getByText(t)).toBeInTheDocument();await B(e.getByText(`+ 1 substitute`)).toBeInTheDocument();let n=e.getByRole(`region`,{name:`Substitutes`});await B(n).toHaveTextContent(`1 going · 1 asked`);let r=H(n);await B(r.getByText(`Jan de Vries`)).toBeInTheDocument(),await B(r.getByText(`Libero · set by Sanne`)).toBeInTheDocument(),await B(r.getByText(`Mila Jansen`)).toBeInTheDocument(),await B(e.getByRole(`button`,{name:/^Jan de Vries, substitute — Going/})).toBeInTheDocument(),await B(e.getByRole(`button`,{name:/^Mila Jansen, substitute — Maybe/})).toBeInTheDocument(),await B(e.getByRole(`button`,{name:`Edit event`})).toBeInTheDocument(),await B(e.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await B(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Q={render:e=>(0,z.jsx)(o,{items:{Loading:(0,z.jsx)(F,{...e,event:null,isLoading:!0}),Error:(0,z.jsx)(F,{...e,event:null,isError:!0}),"Not found":(0,z.jsx)(F,{...e,event:null}),"Member on a social":(0,z.jsx)(F,{...e,event:J,myState:`ABSENT`,myAttribution:`Tim de Vries`,seriesPeek:null,adminActions:void 0})}}),play:async({canvas:e})=>{let t=t=>H(e.getByRole(`region`,{name:t}));await B(t(`Loading`).queryByRole(`heading`,{level:1})).not.toBeInTheDocument(),await B(t(`Error`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await B(t(`Error`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await B(t(`Not found`).getByText(`Event not found.`)).toBeInTheDocument();let n=t(`Member on a social`);await B(n.getByRole(`heading`,{level:1,name:`Season kick-off drinks`})).toBeInTheDocument(),await B(n.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await B(n.queryByRole(`button`,{name:`Edit event`})).not.toBeInTheDocument(),await B(n.queryByText(`Additional info`)).not.toBeInTheDocument()}},$={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,z.jsx)(o,{items:{Event:(0,z.jsx)(F,{...e}),Error:(0,z.jsx)(F,{...e,event:null,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>H(e.getByRole(`region`,{name:t})),i=r(`Event`);await t.click(H(i.getByRole(`group`,{name:`Your response`})).getByRole(`button`,{name:`Maybe`})),await B(n.onToggleMine).toHaveBeenCalledWith(`MAYBE`),await t.click(i.getByRole(`button`,{name:/Sofia — Maybe/}));let a=H(await H(document.body).findByRole(`dialog`));await B(a.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Can't go`})),await B(n.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`);let o=H(i.getByRole(`region`,{name:`Substitutes`}));await t.click(H(o.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Going`})),await B(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ATTENDING`),await t.click(o.getByRole(`button`,{name:`Call in substitutes`})),await B(n.onCallInSubstitutes).toHaveBeenCalledWith(null),await t.click(i.getByRole(`button`,{name:/^Jan de Vries, substitute/}));let s=H(await H(document.body).findByRole(`dialog`,{name:`Jan de Vries`}));await B(s.getByText(`Substitute · Libero · set by Sanne`)).toBeInTheDocument(),await t.click(s.getByRole(`button`,{name:`Take off this event`})),await B(n.onTakeOffSubstitute).toHaveBeenCalledWith(`sub-1`),await t.click(o.getByRole(`button`,{name:/^Mila Jansen/})),s=H(await H(document.body).findByRole(`dialog`,{name:`Mila Jansen`})),await t.click(s.getByRole(`button`,{name:`Can't go`})),await B(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ABSENT`),await t.click(r(`Error`).getByRole(`button`,{name:/try again|retry/i})),await B(n.onRetry).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}},He=[`Data`,`Shells`,`Interactions`]})))()}Ue();export{Z as Data,$ as Interactions,Q as Shells,He as __namedExportsOrder,Ve as default};