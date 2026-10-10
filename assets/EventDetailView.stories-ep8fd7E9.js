import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-zlVgRMQF.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-DUXBP51x.js";import{n as s,t as c}from"./link-C-nR7X0h.js";import{n as l,t as u}from"./router-decorator-BzAdsEOW.js";import{r as d,t as f}from"./app-column-decorator-TBKmRSPK.js";import{a as p,c as m,i as h,r as g,s as _,t as v}from"./event-fixtures-C1ds5yXh.js";import{n as y,t as b}from"./createLucideIcon-D79y4Vw2.js";import{n as x,t as ee}from"./calendar-days-DpyZPtLS.js";import{n as S,t as te}from"./chevron-right-CS1E1YBl.js";import{i as C,n as w,r as ne,t as re}from"./map-pin-aIF6dwQ1.js";import{n as ie,t as ae}from"./EventTypeIcon-Dh9yikRy.js";import{i as oe,n as se,r as ce,t as le}from"./ReferenceChips-_lCtOxnp.js";import{i as ue,n as de,r as fe,t as T}from"./InfoRow-ChL3-K7D.js";import{n as pe,t as me}from"./EventTypeBadge-C7AGEe8W.js";import{n as he,t as ge}from"./EventDetailSkeleton-BtYUGjNR.js";import{r as _e}from"./attribution-D0ubBBus.js";import{n as E,t as D}from"./button-BwV8yAab.js";import{n as ve,t as ye}from"./RoleBreakdown-QN_vWfAD.js";import{n as be,t as xe}from"./SectionLabel-_vzOhMMA.js";import{n as Se,t as Ce}from"./RosterBar-CUwcDeuJ.js";import{i as we,n as Te,r as Ee,t as De}from"./SeriesPeek-eLN9BGXt.js";import{n as Oe,r as ke,t as O}from"./app-shell-decorator-BDtGTo-s.js";import{n as Ae,t as je}from"./AttendanceToggle-C51tGOKb.js";import{n as Me,t as Ne}from"./QueryErrorState-DQDoN8Uw.js";import{n as Pe,r as Fe}from"./SubstitutesBlock-BA6YnDIs.js";import{n as Ie,t as Le}from"./SubstituteSheet-CJOLmtvc.js";import{n as Re,t as ze}from"./MapsLink-BoIsKYBK.js";import{n as Be,t as Ve}from"./AttendeeList-vxm1DFb6.js";import{n as He,t as Ue}from"./PageHeader-BuIlfAWn.js";var k,A;function j(){return(j=e((()=>{y(),k=[[`path`,{d:`M16 18h6`,key:`987eiv`}],[`path`,{d:`M16 2v3`,key:`otl347`}],[`path`,{d:`M19 15v6`,key:`10aioa`}],[`path`,{d:`M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3`,key:`jgwkxf`}],[`path`,{d:`M3 9h18`,key:`1pudct`}],[`path`,{d:`M8 2v3`,key:`1ioesn`}]],A=b(`calendar-plus`,k)})))()}var M,N;function P(){return(P=e((()=>{y(),M=[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]],N=b(`link-2`,M)})))()}var F,We;function Ge(){return(Ge=e((()=>{y(),F=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],We=b(`pencil`,F)})))()}var Ke,qe;function Je(){return(Je=e((()=>{y(),Ke=[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],qe=b(`trash-2`,Ke)})))()}function I({isLoading:e,isError:t,onRetry:n,backTo:r,calendarHref:i,event:a,currentUserId:o,myState:s,myAttribution:l,isPending:u=!1,isSubstitutePending:d=!1,onToggleMine:f,onRespond:p,onSetSubstituteState:m,onTakeOffSubstitute:h,onCallInSubstitutes:g,seriesPeek:_,adminActions:v}){let[y,b]=(0,L.useState)(null);if(e)return(0,R.jsx)(ge,{});if(t)return(0,R.jsx)(Ne,{title:`Couldn't load this event`,description:`Something went wrong on our end. Give it another try.`,onRetry:()=>n?.(),children:(0,R.jsx)(D,{asChild:!0,variant:`ghost`,children:(0,R.jsx)(c,{to:r,children:`Back to events`})})});if(!a)return(0,R.jsx)(`p`,{children:`Event not found.`});let x=new Date(a.startTime),S=a.roster.positions.some(e=>e.required!=null),C=a.substitutes.find(e=>e.substituteId===y),w=S||a.roster.trackRoster;return(0,R.jsxs)(`div`,{children:[(0,R.jsx)(Ue,{title:a.title,backTo:r,backLabel:`Back to events`}),(0,R.jsxs)(`div`,{className:`mt-2 rounded-lg border border-border/40 bg-card p-5 shadow-sm`,children:[(0,R.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,R.jsx)(ae,{type:a.eventType,size:`md`}),(0,R.jsxs)(`div`,{className:`min-w-0`,children:[(0,R.jsx)(me,{type:a.eventType}),(0,R.jsx)(`h1`,{className:`mt-1 font-display text-title font-bold leading-tight`,children:a.title})]})]}),(0,R.jsxs)(`dl`,{className:`mt-5 space-y-4 border-t border-border/40 pt-5 text-body`,children:[(0,R.jsx)(T,{icon:ee,label:`Date`,children:x.toLocaleDateString(`nl-NL`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}),(0,R.jsx)(T,{icon:ne,label:`Time`,children:x.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})}),a.location&&(0,R.jsx)(T,{icon:re,label:`Location`,children:(0,R.jsxs)(ze,{location:a.location,className:`inline-flex items-center gap-1.5 font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue`,children:[a.location,(0,R.jsx)(ce,{size:14,className:`shrink-0`,"aria-hidden":!0})]})}),a.description&&(0,R.jsx)(T,{icon:fe,label:`Description`,children:(0,R.jsx)(`p`,{className:`leading-relaxed text-muted-foreground`,children:a.description})}),a.references.length>0&&(0,R.jsx)(T,{icon:N,label:`Additional info`,children:(0,R.jsx)(le,{references:a.references,max:a.references.length})})]}),i&&(0,R.jsxs)(c,{to:i,className:`mt-5 flex items-center gap-2 border-t border-border/40 pt-4 text-small font-medium text-blue`,children:[(0,R.jsx)(A,{size:16,className:`shrink-0`,"aria-hidden":!0}),`Add your team's events to your calendar`,(0,R.jsx)(te,{size:16,className:`ml-auto shrink-0`,"aria-hidden":!0})]})]}),w&&(0,R.jsx)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,R.jsx)(Ce,{roster:a.roster})}),o&&(0,R.jsxs)(`div`,{className:`mt-6`,children:[(0,R.jsx)(xe,{as:`p`,className:`mb-3`,children:`Your response`}),(0,R.jsx)(`div`,{role:`group`,"aria-label":`Your response`,children:(0,R.jsx)(je,{value:s,disabled:u,onToggle:f})}),l&&(0,R.jsxs)(`p`,{className:`mt-2 text-caption text-muted-foreground`,children:[`set by `,l]})]}),(0,R.jsxs)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:[!S&&(0,R.jsx)(ye,{breakdown:a.attendanceSummary.roleBreakdown}),(0,R.jsx)(Ve,{attendees:a.attendances,roster:a.roster,currentUserId:o,onRespond:p,pending:u,substitutes:a.substitutes,onOpenSubstitute:b,onFindSubstitute:g})]}),(0,R.jsx)(Pe,{substitutes:a.substitutes,members:a.attendances,onSetState:m,onOpen:b,onCallIn:()=>g(null),pending:d}),(0,R.jsx)(Le,{substitute:C??null,setBy:C?_e(C.changedBy,a.attendances):null,onSetState:m,onTakeOff:h,onClose:()=>b(null),pending:d}),_&&(0,R.jsx)(De,{peek:_}),v&&(0,R.jsx)(`div`,{className:`mt-6 flex gap-2.5 border-t border-border/40 pt-5`,children:v})]})}var L,R;function z(){return(z=e((()=>{L=t(),s(),ue(),x(),j(),S(),C(),oe(),P(),w(),E(),de(),Re(),Me(),be(),pe(),ie(),he(),se(),ve(),Se(),Te(),Be(),He(),Ae(),Fe(),Ie(),R=i(),I.__docgenInfo={description:`The event-detail page laid out (ADR-0032 §3): load and error shells, then one card with the
event's identity, description and references, the roster bar, the viewer's response, the
attendance list, the series peek and the admin actions. Prop-only — the mutation, its
cross-member Undo toast and the sibling lookup stay in the route; the story renders every
section with zero network.`,methods:[],displayName:`EventDetailView`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},backTo:{required:!0,tsType:{name:`string`},description:`Where "Back to events" goes.`},calendarHref:{required:!1,tsType:{name:`string`},description:`The member's calendar-links page; omitted for a Platform Admin acting as the team (ADR-0024).`},event:{required:!0,tsType:{name:`union`,raw:`EventDetail | null`,elements:[{name:`EventDetail`},{name:`null`}]},description:``},currentUserId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:``},myAttribution:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Who last set the viewer's own answer, when it was a teammate (⑪).`},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},isSubstitutePending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the Substitute controls are held.`,defaultValue:{value:`false`,computed:!1}},onToggleMine:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`The viewer changing their own answer.`},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream.`},onSetSubstituteState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteState`},name:`state`}],return:{name:`void`}}},description:`Any Member changing a Substitute's state on this event (ADR-0033).`},onTakeOffSubstitute:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`}],return:{name:`void`}}},description:`Takes a Substitute off this event; they stay on the Team's list.`},onCallInSubstitutes:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: PositionRef | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Opens the picker for calling Substitutes in: for one Position from its nudge, else unfiltered.`},seriesPeek:{required:!0,tsType:{name:`union`,raw:`SeriesPeekModel | null`,elements:[{name:`SeriesPeekModel`},{name:`null`}]},description:``},adminActions:{required:!1,tsType:{name:`ReactNode`},description:`Scoped series edit/delete (ADR-0014 Phase 3); absent for members.`}}}})))()}var B,V,H,U,W,G,K,q,J,Ye,Y,X,Xe,Z,Q,$,Ze;function Qe(){return(Qe=e((()=>{Ge(),Je(),E(),g(),a(),d(),u(),we(),ke(),r(),z(),B=i(),{expect:V,fn:H,within:U}=__STORYBOOK_MODULE_TEST__,W=[h(`u-me`,`Julius`,`Setter`),h(`u-2`,`Sanne`,`Setter`),h(`u-3`,`Lars`,`Libero`),h(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),h(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),h(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],G=`rg-1`,K=e=>new Date(2026,7,e,20,0).toISOString(),q=[p({id:`evt-1`,recurringGroup:G,startTime:K(5)}),p({id:`evt-2`,recurringGroup:G,startTime:K(12)}),p({id:`evt-3`,recurringGroup:G,startTime:K(19)}),p({id:`evt-4`,recurringGroup:G,startTime:K(26)})],J=p({id:`evt-2`,eventType:{id:`et-1`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,description:`Serve-receive drills first, then six-on-six. Bring both kits.`,startTime:K(12),endTime:new Date(2026,7,12,22,0).toISOString(),location:`Sporthal De Toekomst`,references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`}],recurringGroup:G,attendances:W,substitutes:[m(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},changedBy:`u-2`}),m(`sub-2`,`Mila Jansen`,{state:`MAYBE`})],myState:`ATTENDING`,roster:_({substituteAttending:1})}),Ye=p({id:`evt-social`,eventType:{id:`et-3`,name:`Social`,color:`#D9A23B`},title:`Season kick-off drinks`,startTime:K(22),endTime:new Date(2026,7,22,23,0).toISOString(),location:`Café De Zon`,attendances:W,myState:`ABSENT`,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1}]},roster:{...v,totalAttending:3}}),Y=(0,B.jsxs)(B.Fragment,{children:[(0,B.jsxs)(D,{variant:`outline`,className:`flex-1`,children:[(0,B.jsx)(We,{size:15}),`Edit event`]}),(0,B.jsxs)(D,{variant:`outline`,className:`flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red`,children:[(0,B.jsx)(qe,{size:15}),`Delete`]})]}),X=Oe(`events`),Xe={title:`pages/event-detail/EventDetailView`,component:I,parameters:X.parameters,args:{backTo:O.events,calendarHref:`${O.events}/calendar`,event:J,currentUserId:`u-me`,myState:`ATTENDING`,myAttribution:null,seriesPeek:Ee(q,J.id),adminActions:Y,onRetry:H(),onToggleMine:H(),onRespond:H(),onSetSubstituteState:H(),onTakeOffSubstitute:H(),onCallInSubstitutes:H()}},Z={decorators:X.decorators,parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await V(e.getByRole(`link`,{name:`Back to events`})).toHaveAttribute(`href`,O.events),await V(e.getByRole(`heading`,{level:1,name:`Training — Court 2`})).toBeInTheDocument(),await V(e.getByRole(`link`,{name:/Sporthal De Toekomst/})).toHaveAttribute(`href`,`https://maps.google.com/?q=Sporthal%20De%20Toekomst`);let t=U(e.getByRole(`group`,{name:`Your response`}));await V(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await V(e.getByText(`Serve-receive drills first, then six-on-six. Bring both kits.`)).toBeInTheDocument(),await V(e.getByRole(`link`,{name:`Nevobo`})).toBeInTheDocument(),await V(e.getByRole(`link`,{name:`Match form`})).toBeInTheDocument(),await V(e.getByRole(`link`,{name:/Add your team's events to your calendar/})).toHaveAttribute(`href`,`${O.events}/calendar`);for(let t of[`Julius`,`Sanne`,`Lars`,`Sofia`,`Tim`,`Noor`])await V(e.getByText(t)).toBeInTheDocument();await V(e.getByText(`+ 1 substitute`)).toBeInTheDocument();let n=e.getByRole(`region`,{name:`Substitutes`});await V(n).toHaveTextContent(`1 going · 1 asked`);let r=U(n);await V(r.getByText(`Jan de Vries`)).toBeInTheDocument(),await V(r.getByText(`Libero · set by Sanne`)).toBeInTheDocument(),await V(r.getByText(`Mila Jansen`)).toBeInTheDocument(),await V(e.getByRole(`button`,{name:/^Jan de Vries, substitute — Going/})).toBeInTheDocument(),await V(e.getByRole(`button`,{name:/^Mila Jansen, substitute — Maybe/})).toBeInTheDocument(),await V(e.getByRole(`button`,{name:`Edit event`})).toBeInTheDocument(),await V(e.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await V(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},Q={decorators:[...f.decorators,l],render:e=>(0,B.jsx)(o,{items:{Loading:(0,B.jsx)(I,{...e,event:null,isLoading:!0}),Error:(0,B.jsx)(I,{...e,event:null,isError:!0}),"Not found":(0,B.jsx)(I,{...e,event:null}),"Member on a social":(0,B.jsx)(I,{...e,event:Ye,myState:`ABSENT`,myAttribution:`Tim de Vries`,seriesPeek:null,adminActions:void 0})}}),play:async({canvas:e})=>{let t=t=>U(e.getByRole(`region`,{name:t}));await V(t(`Loading`).queryByRole(`heading`,{level:1})).not.toBeInTheDocument(),await V(t(`Error`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await V(t(`Error`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await V(t(`Not found`).getByText(`Event not found.`)).toBeInTheDocument();let n=t(`Member on a social`);await V(n.getByRole(`heading`,{level:1,name:`Season kick-off drinks`})).toBeInTheDocument(),await V(n.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await V(n.queryByRole(`button`,{name:`Edit event`})).not.toBeInTheDocument(),await V(n.queryByText(`Additional info`)).not.toBeInTheDocument()}},$={decorators:X.decorators,parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,B.jsx)(o,{items:{Event:(0,B.jsx)(I,{...e}),Error:(0,B.jsx)(I,{...e,event:null,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>U(e.getByRole(`region`,{name:t})),i=r(`Event`);await t.click(U(i.getByRole(`group`,{name:`Your response`})).getByRole(`button`,{name:`Maybe`})),await V(n.onToggleMine).toHaveBeenCalledWith(`MAYBE`),await t.click(i.getByRole(`button`,{name:/Sofia — Maybe/}));let a=U(await U(document.body).findByRole(`dialog`));await V(a.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Can't go`})),await V(n.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`);let o=U(i.getByRole(`region`,{name:`Substitutes`}));await t.click(U(o.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Going`})),await V(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ATTENDING`);let s=U(o.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`});s.scrollIntoView({block:`center`});let c=s.getBoundingClientRect(),l=(44-c.height)/2-1;for(let e of[c.top-l,c.bottom+l])await V(document.elementFromPoint(c.left+c.width/2,e)).toBe(s);await t.click(o.getByRole(`button`,{name:`Call in substitutes`})),await V(n.onCallInSubstitutes).toHaveBeenCalledWith(null),await t.click(i.getByRole(`button`,{name:/^Jan de Vries, substitute/}));let u=U(await U(document.body).findByRole(`dialog`,{name:`Jan de Vries`}));await V(u.getByText(`Substitute · Libero · set by Sanne`)).toBeInTheDocument(),await t.click(u.getByRole(`button`,{name:`Take off this event`})),await V(n.onTakeOffSubstitute).toHaveBeenCalledWith(`sub-1`),await t.click(o.getByRole(`button`,{name:/^Mila Jansen/})),u=U(await U(document.body).findByRole(`dialog`,{name:`Mila Jansen`})),await t.click(u.getByRole(`button`,{name:`Can't go`})),await V(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ABSENT`),await t.click(r(`Error`).getByRole(`button`,{name:/try again|retry/i})),await V(n.onRetry).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
    // A pointer to the member's calendar links, so the events reach their phone's calendar.
    await expect(canvas.getByRole('link', {
      name: /Add your team's events to your calendar/
    })).toHaveAttribute('href', \`\${SHELL_ROUTES.events}/calendar\`);
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
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(substitutes.getByRole('group', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Asked'
    });
    pill.scrollIntoView({
      block: 'center'
    });
    const box = pill.getBoundingClientRect();
    const reach = (44 - box.height) / 2 - 1;
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill);
    }
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
}`,...$.parameters?.docs?.source}}},Ze=[`Data`,`Shells`,`Interactions`]})))()}Qe();export{Z as Data,$ as Interactions,Q as Shells,Ze as __namedExportsOrder,Xe as default};