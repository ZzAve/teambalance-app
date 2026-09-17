import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./arrow-right-PkyPYRzw.js";import{n as i,t as a}from"./RosterPips-C8Slh_Rw.js";import{i as o,r as s}from"./router-decorator-Bt7JvMFd.js";import{n as c,t as l}from"./AttendeeList-IO1lIQjm.js";function u({event:e,view:t,currentUserId:n,detailHref:i}){let o=t===`members`||!e.roster.trackRoster,c=e.attendances.length-15;return(0,d.jsx)(`div`,{children:o?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{attendees:e.attendances.slice(0,15),roster:e.roster,currentUserId:n}),c>0&&(0,d.jsxs)(s,{to:i,className:`mt-2 flex items-center gap-1 px-2.5 text-xs font-semibold text-blue`,children:[`See all `,e.attendances.length,(0,d.jsx)(r,{size:12,"aria-hidden":!0})]})]}):(0,d.jsx)(a,{roster:e.roster})})}var d;function f(){return(f=e((()=>{o(),n(),i(),c(),d=t(),u.__docgenInfo={description:`What the card's roster disclosure opens onto: the position pips, or the team, the member's choice
(ADR-0030 §5). Composed here rather than in \`EventAnswerRow\` because the member list is
\`AttendeeList\` — a widget — and the card is an entity; the events route injects this whole panel
as a node, which is also what keeps the card prop-only.

The member list is \`AttendeeList\` itself, reused verbatim from the detail page and rendered
**read-only** (no \`onRespond\`): editing a teammate's attendance stays on detail-page rows (#271
⑫), and the card's own answer row already handles the viewer's own answer.

An event with roster tracking off has no pips to draw, so it always shows its members — which is
what finally gives a social something to expand to (#324 cause 3). It does not have to refuse the
preference to do that any more: the control has moved to the page header (\`PanelViewMenu\`), so a
card no longer answers for a setting it does not own, and this one simply renders the only view it
has.

Content only, therefore: no preference chrome on any card. That is the whole point of the move —
a control repeated once per open card reads as a per-card control, whatever the state behind it.`,methods:[],displayName:`EventRosterPanel`,props:{event:{required:!0,tsType:{name:`Event`},description:``},view:{required:!0,tsType:{name:`PanelView`},description:`The member's global choice of view. Set from the page header, never from here.`},currentUserId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:"The viewer, so their own row is marked `You`."},detailHref:{required:!0,tsType:{name:`string`},description:`Where the capped remainder lives — this event's own detail page.`}}}})))()}export{f as n,u as t};