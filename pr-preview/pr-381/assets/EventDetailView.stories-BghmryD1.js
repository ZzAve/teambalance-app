import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r}from"./iframe-4iGTBW-r.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./stack-D87d-8jv.js";import{n as s,t as ee}from"./link-D4BuvYmP.js";import{a as c,c as l,i as u,r as d,s as f,t as p}from"./event-fixtures-C1ds5yXh.js";import{n as m,t as h}from"./createLucideIcon-Bm6k8SC8.js";import{n as g,t as te}from"./EventTypeIcon-47Pb6yLZ.js";import{n as _,t as ne}from"./ReferenceChips-BTctuq1O.js";import{n as v,t as re}from"./map-pin-CtVogRd4.js";import{n as y,t as ie}from"./EventTypeBadge-C7AGEe8W.js";import{n as b,t as ae}from"./EventDetailSkeleton-D_9DFPxT.js";import{r as oe}from"./attribution-D0ubBBus.js";import{n as x,t as S}from"./button-DRD9RBsH.js";import{n as C,t as se}from"./RoleBreakdown-QN_vWfAD.js";import{n as ce,t as w}from"./SectionLabel-B5oFQ-GJ.js";import{n as le,t as ue}from"./RosterBar-DKGbCahK.js";import{i as de,n as fe,r as pe,t as me}from"./SeriesPeek-C4YBlfl1.js";import{n as he,r as ge,t as T}from"./app-shell-decorator-CCCwkxLC.js";import{n as _e,t as ve}from"./AttendanceToggle-BT-m_F2c.js";import{n as ye,r as be}from"./SubstitutesBlock-8Ixbf8b1.js";import{n as xe,t as Se}from"./QueryErrorState-BgyqQNWV.js";import{n as Ce,t as we}from"./AttendeeList-mrvdG-i7.js";import{n as Te,t as Ee}from"./PageHeader-BFfW8x2Q.js";import{n as De,t as Oe}from"./SubstituteSheet-Bqa4rWKC.js";var E,D;function O(){return(O=e((()=>{m(),E=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],D=h(`pencil`,E)})))()}var k,A;function j(){return(j=e((()=>{m(),k=[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],A=h(`trash-2`,k)})))()}function M({isLoading:e,isError:t,onRetry:n,backTo:r,event:i,currentUserId:a,myState:o,myAttribution:s,isPending:c=!1,isSubstitutePending:l=!1,onToggleMine:u,onRespond:d,onSetSubstituteState:f,onTakeOffSubstitute:p,onCallInSubstitutes:m,seriesPeek:h,adminActions:g}){let[_,v]=(0,N.useState)(null);if(e)return(0,P.jsx)(ae,{});if(t)return(0,P.jsx)(Se,{title:`Couldn't load this event`,description:`Something went wrong on our end. Give it another try.`,onRetry:()=>n?.(),children:(0,P.jsx)(S,{asChild:!0,variant:`ghost`,children:(0,P.jsx)(ee,{to:r,children:`Back to events`})})});if(!i)return(0,P.jsx)(`p`,{children:`Event not found.`});let y=new Date(i.startTime),b=i.roster.positions.some(e=>e.required!=null),x=i.substitutes.find(e=>e.substituteId===_),C=b||i.roster.trackRoster;return(0,P.jsxs)(`div`,{children:[(0,P.jsx)(Ee,{title:i.title,backTo:r,backLabel:`Back to events`}),(0,P.jsxs)(`div`,{className:`mt-2 flex items-start gap-4`,children:[(0,P.jsx)(te,{type:i.eventType,size:`md`}),(0,P.jsxs)(`div`,{className:`min-w-0`,children:[(0,P.jsx)(ie,{type:i.eventType}),(0,P.jsx)(`h1`,{className:`font-display text-title font-bold leading-tight`,children:i.title}),(0,P.jsxs)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:[y.toLocaleDateString(`nl-NL`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`}),` · `,y.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})]}),i.location&&(0,P.jsxs)(`a`,{href:`https://maps.google.com/?q=${encodeURIComponent(i.location)}`,target:`_blank`,rel:`noopener noreferrer`,className:`mt-0.5 flex items-center gap-1 text-small text-muted-foreground hover:text-blue hover:underline`,children:[(0,P.jsx)(re,{size:13,className:`shrink-0`}),i.location]})]})]}),C&&(0,P.jsx)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,P.jsx)(ue,{roster:i.roster})}),a&&(0,P.jsxs)(`div`,{className:`mt-6`,children:[(0,P.jsx)(w,{as:`p`,className:`mb-3`,children:`Your response`}),(0,P.jsx)(`div`,{role:`group`,"aria-label":`Your response`,children:(0,P.jsx)(ve,{value:o,disabled:c,onToggle:u})}),s&&(0,P.jsxs)(`p`,{className:`mt-2 text-caption text-muted-foreground`,children:[`set by `,s]})]}),i.description&&(0,P.jsxs)(`div`,{className:`mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm`,children:[(0,P.jsx)(w,{as:`p`,className:`mb-2`,children:`Description`}),(0,P.jsx)(`p`,{className:`text-small leading-relaxed text-muted-foreground`,children:i.description})]}),i.references.length>0&&(0,P.jsxs)(`div`,{className:`mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm`,children:[(0,P.jsx)(w,{as:`p`,className:`mb-3`,children:`Additional info`}),(0,P.jsx)(ne,{references:i.references,max:i.references.length})]}),(0,P.jsxs)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:[!b&&(0,P.jsx)(se,{breakdown:i.attendanceSummary.roleBreakdown}),(0,P.jsx)(we,{attendees:i.attendances,roster:i.roster,currentUserId:a,onRespond:d,pending:c,substitutes:i.substitutes,onOpenSubstitute:v,onFindSubstitute:m})]}),(0,P.jsx)(ye,{substitutes:i.substitutes,members:i.attendances,onSetState:f,onOpen:v,onCallIn:()=>m(null),pending:l}),(0,P.jsx)(Oe,{substitute:x??null,setBy:x?oe(x.changedBy,i.attendances):null,onSetState:f,onTakeOff:p,onClose:()=>v(null),pending:l}),h&&(0,P.jsx)(me,{peek:h}),g&&(0,P.jsx)(`div`,{className:`mt-6 flex gap-2.5 border-t border-border/40 pt-5`,children:g})]})}var N,P;function F(){return(F=e((()=>{N=t(),s(),v(),x(),xe(),ce(),y(),g(),b(),_(),C(),le(),fe(),Ce(),Te(),_e(),be(),De(),P=i(),M.__docgenInfo={description:`The event-detail page laid out (ADR-0032 §3): load and error shells, then the header, roster
bar, the viewer's response, description, references, the attendance list, the series peek and
the admin actions. Prop-only — the mutation, its cross-member Undo toast and the sibling lookup
stay in the route; the story renders every section with zero network.`,methods:[],displayName:`EventDetailView`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},backTo:{required:!0,tsType:{name:`string`},description:`Where "Back to events" goes.`},event:{required:!0,tsType:{name:`union`,raw:`EventDetail | null`,elements:[{name:`EventDetail`},{name:`null`}]},description:``},currentUserId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:``},myAttribution:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Who last set the viewer's own answer, when it was a teammate (⑪).`},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},isSubstitutePending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the Substitute controls are held.`,defaultValue:{value:`false`,computed:!1}},onToggleMine:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`The viewer changing their own answer.`},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream.`},onSetSubstituteState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteState`},name:`state`}],return:{name:`void`}}},description:`Any Member changing a Substitute's state on this event (ADR-0033).`},onTakeOffSubstitute:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`}],return:{name:`void`}}},description:`Takes a Substitute off this event; they stay on the Team's list.`},onCallInSubstitutes:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(position: PositionRef | null) => void`,signature:{arguments:[{type:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},name:`position`}],return:{name:`void`}}},description:`Opens the picker for calling Substitutes in: for one Position from its nudge, else unfiltered.`},seriesPeek:{required:!0,tsType:{name:`union`,raw:`SeriesPeekModel | null`,elements:[{name:`SeriesPeekModel`},{name:`null`}]},description:``},adminActions:{required:!1,tsType:{name:`ReactNode`},description:`Scoped series edit/delete (ADR-0014 Phase 3); absent for members.`}}}})))()}var I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{O(),j(),x(),d(),a(),de(),ge(),r(),F(),I=i(),{expect:L,fn:R,within:z}=__STORYBOOK_MODULE_TEST__,B=[u(`u-me`,`Julius`,`Setter`),u(`u-2`,`Sanne`,`Setter`),u(`u-3`,`Lars`,`Libero`),u(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),u(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),u(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],V=`rg-1`,H=e=>new Date(2026,7,e,20,0).toISOString(),U=[c({id:`evt-1`,recurringGroup:V,startTime:H(5)}),c({id:`evt-2`,recurringGroup:V,startTime:H(12)}),c({id:`evt-3`,recurringGroup:V,startTime:H(19)}),c({id:`evt-4`,recurringGroup:V,startTime:H(26)})],W=c({id:`evt-2`,eventType:{id:`et-1`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,description:`Serve-receive drills first, then six-on-six. Bring both kits.`,startTime:H(12),endTime:new Date(2026,7,12,22,0).toISOString(),location:`Sporthal De Toekomst`,references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`}],recurringGroup:V,attendances:B,substitutes:[l(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},changedBy:`u-2`}),l(`sub-2`,`Mila Jansen`,{state:`MAYBE`})],myState:`ATTENDING`,roster:f({substituteAttending:1})}),G=c({id:`evt-social`,eventType:{id:`et-3`,name:`Social`,color:`#D9A23B`},title:`Season kick-off drinks`,startTime:H(22),endTime:new Date(2026,7,22,23,0).toISOString(),location:`Café De Zon`,attendances:B,myState:`ABSENT`,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1}]},roster:{...p,totalAttending:3}}),K=(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(S,{variant:`outline`,className:`flex-1`,children:[(0,I.jsx)(D,{size:15}),`Edit event`]}),(0,I.jsxs)(S,{variant:`outline`,className:`flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red`,children:[(0,I.jsx)(A,{size:15}),`Delete`]})]}),q=he(`events`),J={title:`pages/event-detail/EventDetailView`,component:M,decorators:q.decorators,parameters:q.parameters,args:{backTo:T.events,event:W,currentUserId:`u-me`,myState:`ATTENDING`,myAttribution:null,seriesPeek:pe(U,W.id),adminActions:K,onRetry:R(),onToggleMine:R(),onRespond:R(),onSetSubstituteState:R(),onTakeOffSubstitute:R(),onCallInSubstitutes:R()}},Y={parameters:{chromatic:{modes:n}},play:async({canvas:e})=>{await L(e.getByRole(`link`,{name:`Back to events`})).toHaveAttribute(`href`,T.events),await L(e.getByRole(`heading`,{level:1,name:`Training — Court 2`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:/Sporthal De Toekomst/})).toHaveAttribute(`href`,`https://maps.google.com/?q=Sporthal%20De%20Toekomst`);let t=z(e.getByRole(`group`,{name:`Your response`}));await L(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await L(e.getByText(`Serve-receive drills first, then six-on-six. Bring both kits.`)).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Nevobo`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Match form`})).toBeInTheDocument();for(let t of[`Julius`,`Sanne`,`Lars`,`Sofia`,`Tim`,`Noor`])await L(e.getByText(t)).toBeInTheDocument();await L(e.getByText(`+ 1 substitute`)).toBeInTheDocument();let n=e.getByRole(`region`,{name:`Substitutes`});await L(n).toHaveTextContent(`1 going · 1 asked`);let r=z(n);await L(r.getByText(`Jan de Vries`)).toBeInTheDocument(),await L(r.getByText(`Libero · set by Sanne`)).toBeInTheDocument(),await L(r.getByText(`Mila Jansen`)).toBeInTheDocument(),await L(e.getByRole(`button`,{name:/^Jan de Vries, substitute — Going/})).toBeInTheDocument(),await L(e.getByRole(`button`,{name:/^Mila Jansen, substitute — Maybe/})).toBeInTheDocument(),await L(e.getByRole(`button`,{name:`Edit event`})).toBeInTheDocument(),await L(e.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},X={render:e=>(0,I.jsx)(o,{items:{Loading:(0,I.jsx)(M,{...e,event:null,isLoading:!0}),Error:(0,I.jsx)(M,{...e,event:null,isError:!0}),"Not found":(0,I.jsx)(M,{...e,event:null}),"Member on a social":(0,I.jsx)(M,{...e,event:G,myState:`ABSENT`,myAttribution:`Tim de Vries`,seriesPeek:null,adminActions:void 0})}}),play:async({canvas:e})=>{let t=t=>z(e.getByRole(`region`,{name:t}));await L(t(`Loading`).queryByRole(`heading`,{level:1})).not.toBeInTheDocument(),await L(t(`Error`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await L(t(`Error`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await L(t(`Not found`).getByText(`Event not found.`)).toBeInTheDocument();let n=t(`Member on a social`);await L(n.getByRole(`heading`,{level:1,name:`Season kick-off drinks`})).toBeInTheDocument(),await L(n.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await L(n.queryByRole(`button`,{name:`Edit event`})).not.toBeInTheDocument(),await L(n.queryByText(`Additional info`)).not.toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,I.jsx)(o,{items:{Event:(0,I.jsx)(M,{...e}),Error:(0,I.jsx)(M,{...e,event:null,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>z(e.getByRole(`region`,{name:t})),i=r(`Event`);await t.click(z(i.getByRole(`group`,{name:`Your response`})).getByRole(`button`,{name:`Maybe`})),await L(n.onToggleMine).toHaveBeenCalledWith(`MAYBE`),await t.click(i.getByRole(`button`,{name:/Sofia — Maybe/}));let a=z(await z(document.body).findByRole(`dialog`));await L(a.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Can't go`})),await L(n.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`);let o=z(i.getByRole(`region`,{name:`Substitutes`}));await t.click(z(o.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Going`})),await L(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ATTENDING`),await t.click(o.getByRole(`button`,{name:`Call in substitutes`})),await L(n.onCallInSubstitutes).toHaveBeenCalledWith(null),await t.click(i.getByRole(`button`,{name:/^Jan de Vries, substitute/}));let s=z(await z(document.body).findByRole(`dialog`,{name:`Jan de Vries`}));await L(s.getByText(`Substitute · Libero · set by Sanne`)).toBeInTheDocument(),await t.click(s.getByRole(`button`,{name:`Take off this event`})),await L(n.onTakeOffSubstitute).toHaveBeenCalledWith(`sub-1`),await t.click(o.getByRole(`button`,{name:/^Mila Jansen/})),s=z(await z(document.body).findByRole(`dialog`,{name:`Mila Jansen`})),await t.click(s.getByRole(`button`,{name:`Can't go`})),await L(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-2`,`ABSENT`),await t.click(r(`Error`).getByRole(`button`,{name:/try again|retry/i})),await L(n.onRetry).toHaveBeenCalled()}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`Interactions`]})))()}$();export{Y as Data,Z as Interactions,X as Shells,Q as __namedExportsOrder,J as default};