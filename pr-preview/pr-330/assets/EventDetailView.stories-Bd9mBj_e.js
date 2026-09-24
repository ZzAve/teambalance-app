import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-BBGrpB76.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./stack-D87d-8jv.js";import{n as o,t as ee}from"./link-DGdRUlmH.js";import{a as s,i as c,r as l,s as u,t as d}from"./event-fixtures-CuRrQuRB.js";import{n as f,t as p}from"./createLucideIcon-Ch13e4Fz.js";import{n as m,t as te}from"./EventTypeIcon-Bg1QlIuu.js";import{n as h,t as ne}from"./ReferenceChips-PJ0M4pcb.js";import{n as re,t as ie}from"./map-pin-4l4KwjkX.js";import{n as ae,t as oe}from"./EventTypeBadge-C7AGEe8W.js";import{n as g,t as _}from"./EventDetailSkeleton-DP7EV03B.js";import{n as v,t as y}from"./button-Djr1cczI.js";import{n as se,t as ce}from"./RoleBreakdown-QN_vWfAD.js";import{n as b,t as x}from"./SectionLabel-B5oFQ-GJ.js";import{n as S,t as C}from"./RosterBar-CsLBlPKL.js";import{i as w,n as le,r as ue,t as de}from"./SeriesPeek-Bot_pl6y.js";import{n as fe,r as pe,t as T}from"./app-shell-decorator-BnadMABS.js";import{n as me,t as he}from"./AttendanceToggle-Bq3Ov78N.js";import{n as ge,t as _e}from"./QueryErrorState-DWrnom7K.js";import{n as ve,t as ye}from"./AttendeeList-BjyXIVQe.js";import{n as E,t as be}from"./PageHeader-nAX3cAEs.js";var D,O;function k(){return(k=e((()=>{f(),D=[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]],O=p(`pencil`,D)})))()}var A,j;function M(){return(M=e((()=>{f(),A=[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],j=p(`trash-2`,A)})))()}function N({isLoading:e,isError:t,onRetry:n,backTo:r,event:i,currentUserId:a,myState:o,myAttribution:s,isPending:c=!1,onToggleMine:l,onRespond:u,seriesPeek:d,adminActions:f}){if(e)return(0,P.jsx)(_,{});if(t)return(0,P.jsx)(_e,{title:`Couldn't load this event`,description:`Something went wrong on our end. Give it another try.`,onRetry:()=>n?.(),children:(0,P.jsx)(y,{asChild:!0,variant:`ghost`,children:(0,P.jsx)(ee,{to:r,children:`Back to events`})})});if(!i)return(0,P.jsx)(`p`,{children:`Event not found.`});let p=new Date(i.startTime),m=i.roster.positions.some(e=>e.required!=null),h=m||i.roster.trackRoster;return(0,P.jsxs)(`div`,{children:[(0,P.jsx)(be,{title:i.title,backTo:r,backLabel:`Back to events`}),(0,P.jsxs)(`div`,{className:`mt-2 flex items-start gap-4`,children:[(0,P.jsx)(te,{type:i.eventType,size:`md`}),(0,P.jsxs)(`div`,{className:`min-w-0`,children:[(0,P.jsx)(oe,{type:i.eventType}),(0,P.jsx)(`h1`,{className:`font-display text-title font-bold leading-tight`,children:i.title}),(0,P.jsxs)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:[p.toLocaleDateString(`nl-NL`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`}),` · `,p.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})]}),i.location&&(0,P.jsxs)(`a`,{href:`https://maps.google.com/?q=${encodeURIComponent(i.location)}`,target:`_blank`,rel:`noopener noreferrer`,className:`mt-0.5 flex items-center gap-1 text-small text-muted-foreground hover:text-blue hover:underline`,children:[(0,P.jsx)(ie,{size:13,className:`shrink-0`}),i.location]})]})]}),h&&(0,P.jsx)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:(0,P.jsx)(C,{roster:i.roster})}),a&&(0,P.jsxs)(`div`,{className:`mt-6`,children:[(0,P.jsx)(x,{as:`p`,className:`mb-3`,children:`Your response`}),(0,P.jsx)(`div`,{role:`group`,"aria-label":`Your response`,children:(0,P.jsx)(he,{value:o,disabled:c,onToggle:l})}),s&&(0,P.jsxs)(`p`,{className:`mt-2 text-caption text-muted-foreground`,children:[`set by `,s]})]}),i.description&&(0,P.jsxs)(`div`,{className:`mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm`,children:[(0,P.jsx)(x,{as:`p`,className:`mb-2`,children:`Description`}),(0,P.jsx)(`p`,{className:`text-small leading-relaxed text-muted-foreground`,children:i.description})]}),i.references.length>0&&(0,P.jsxs)(`div`,{className:`mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm`,children:[(0,P.jsx)(x,{as:`p`,className:`mb-3`,children:`Additional info`}),(0,P.jsx)(ne,{references:i.references,max:i.references.length})]}),(0,P.jsxs)(`div`,{className:`mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm`,children:[!m&&(0,P.jsx)(ce,{breakdown:i.attendanceSummary.roleBreakdown}),(0,P.jsx)(ye,{attendees:i.attendances,roster:i.roster,currentUserId:a,onRespond:u,pending:c})]}),d&&(0,P.jsx)(de,{peek:d}),f&&(0,P.jsx)(`div`,{className:`mt-6 flex gap-2.5 border-t border-border/40 pt-5`,children:f})]})}var P;function F(){return(F=e((()=>{o(),re(),v(),ge(),b(),ae(),m(),g(),h(),se(),S(),le(),ve(),E(),me(),P=r(),N.__docgenInfo={description:`The event-detail page laid out (ADR-0032 §3): load and error shells, then the header, roster
bar, the viewer's response, description, references, the attendance list, the series peek and
the admin actions. Prop-only — the mutation, its cross-member Undo toast and the sibling lookup
stay in the route; the story renders every section with zero network.`,methods:[],displayName:`EventDetailView`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},backTo:{required:!0,tsType:{name:`string`},description:`Where "Back to events" goes.`},event:{required:!0,tsType:{name:`union`,raw:`EventDetail | null`,elements:[{name:`EventDetail`},{name:`null`}]},description:``},currentUserId:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:``},myAttribution:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Who last set the viewer's own answer, when it was a teammate (⑪).`},isPending:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onToggleMine:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`The viewer changing their own answer.`},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: AttendanceState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:`Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream.`},seriesPeek:{required:!0,tsType:{name:`union`,raw:`SeriesPeekModel | null`,elements:[{name:`SeriesPeekModel`},{name:`null`}]},description:``},adminActions:{required:!1,tsType:{name:`ReactNode`},description:`Scoped series edit/delete (ADR-0014 Phase 3); absent for members.`}}}})))()}var I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{k(),M(),v(),l(),i(),w(),pe(),n(),F(),I=r(),{expect:L,fn:R,within:z}=__STORYBOOK_MODULE_TEST__,B=[c(`u-me`,`Julius`,`Setter`),c(`u-2`,`Sanne`,`Setter`),c(`u-3`,`Lars`,`Libero`),c(`u-4`,`Sofia`,`Middle`,{state:`MAYBE`}),c(`u-5`,`Tim`,`Middle`,{state:`ABSENT`}),c(`u-6`,`Noor`,`Unassigned`,{state:`NOT_RESPONDED`})],V=`rg-1`,H=e=>new Date(2026,7,e,20,0).toISOString(),U=[s({id:`evt-1`,recurringGroup:V,startTime:H(5)}),s({id:`evt-2`,recurringGroup:V,startTime:H(12)}),s({id:`evt-3`,recurringGroup:V,startTime:H(19)}),s({id:`evt-4`,recurringGroup:V,startTime:H(26)})],W=s({id:`evt-2`,eventType:{id:`et-1`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,description:`Serve-receive drills first, then six-on-six. Bring both kits.`,startTime:H(12),endTime:new Date(2026,7,12,22,0).toISOString(),location:`Sporthal De Toekomst`,references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`}],recurringGroup:V,attendances:B,myState:`ATTENDING`,roster:u()}),G=s({id:`evt-social`,eventType:{id:`et-3`,name:`Social`,color:`#D9A23B`},title:`Season kick-off drinks`,startTime:H(22),endTime:new Date(2026,7,22,23,0).toISOString(),location:`Café De Zon`,attendances:B,myState:`ABSENT`,attendanceSummary:{attending:3,maybe:1,absent:1,notResponded:1,roleBreakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1}]},roster:{...d,totalAttending:3}}),K=(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(y,{variant:`outline`,className:`flex-1`,children:[(0,I.jsx)(O,{size:15}),`Edit event`]}),(0,I.jsxs)(y,{variant:`outline`,className:`flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red`,children:[(0,I.jsx)(j,{size:15}),`Delete`]})]}),q=fe(`events`),J={title:`pages/event-detail/EventDetailView`,component:N,decorators:q.decorators,parameters:q.parameters,args:{backTo:T.events,event:W,currentUserId:`u-me`,myState:`ATTENDING`,myAttribution:null,seriesPeek:ue(U,W.id),adminActions:K,onRetry:R(),onToggleMine:R(),onRespond:R()}},Y={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await L(e.getByRole(`link`,{name:`Back to events`})).toHaveAttribute(`href`,T.events),await L(e.getByRole(`heading`,{level:1,name:`Training — Court 2`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:/Sporthal De Toekomst/})).toHaveAttribute(`href`,`https://maps.google.com/?q=Sporthal%20De%20Toekomst`);let t=z(e.getByRole(`group`,{name:`Your response`}));await L(t.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await L(e.getByText(`Serve-receive drills first, then six-on-six. Bring both kits.`)).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Nevobo`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Match form`})).toBeInTheDocument();for(let t of[`Julius`,`Sanne`,`Lars`,`Sofia`,`Tim`,`Noor`])await L(e.getByText(t)).toBeInTheDocument();await L(e.getByRole(`button`,{name:`Edit event`})).toBeInTheDocument(),await L(e.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await L(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`)}},X={render:e=>(0,I.jsx)(a,{items:{Loading:(0,I.jsx)(N,{...e,event:null,isLoading:!0}),Error:(0,I.jsx)(N,{...e,event:null,isError:!0}),"Not found":(0,I.jsx)(N,{...e,event:null}),"Member on a social":(0,I.jsx)(N,{...e,event:G,myState:`ABSENT`,myAttribution:`Tim de Vries`,seriesPeek:null,adminActions:void 0})}}),play:async({canvas:e})=>{let t=t=>z(e.getByRole(`region`,{name:t}));await L(t(`Loading`).queryByRole(`heading`,{level:1})).not.toBeInTheDocument(),await L(t(`Error`).getByText(`Couldn't load this event`)).toBeInTheDocument(),await L(t(`Error`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await L(t(`Not found`).getByText(`Event not found.`)).toBeInTheDocument();let n=t(`Member on a social`);await L(n.getByRole(`heading`,{level:1,name:`Season kick-off drinks`})).toBeInTheDocument(),await L(n.getByText(`set by Tim de Vries`)).toBeInTheDocument(),await L(n.queryByRole(`button`,{name:`Edit event`})).not.toBeInTheDocument(),await L(n.queryByText(`Additional info`)).not.toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,I.jsx)(a,{items:{Event:(0,I.jsx)(N,{...e}),Error:(0,I.jsx)(N,{...e,event:null,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>z(e.getByRole(`region`,{name:t})),i=r(`Event`);await t.click(z(i.getByRole(`group`,{name:`Your response`})).getByRole(`button`,{name:`Maybe`})),await L(n.onToggleMine).toHaveBeenCalledWith(`MAYBE`),await t.click(i.getByRole(`button`,{name:/Sofia — Maybe/}));let a=z(await z(document.body).findByRole(`dialog`));await L(a.getByText(/Middle · currently maybe · you are answering for them/)).toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Can't go`})),await L(n.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`),await t.click(r(`Error`).getByRole(`button`,{name:/try again|retry/i})),await L(n.onRetry).toHaveBeenCalled()}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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

    // The error shell's retry reaches the query.
    await userEvent.click(region('Error').getByRole('button', {
      name: /try again|retry/i
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`Interactions`]})))()}$();export{Y as Data,Z as Interactions,X as Shells,Q as __namedExportsOrder,J as default};