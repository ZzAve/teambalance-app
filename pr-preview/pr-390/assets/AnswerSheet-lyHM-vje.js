import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./sheet-C0Rgmf_2.js";import{a as c,t as l}from"./lineup-TDQLra9X.js";import{n as u,t as d}from"./AttendanceToggle-D12H6uG1.js";function f({target:e,onRespond:t,onClose:a,pending:c}){return(0,p.jsx)(s,{open:e!==null,onOpenChange:e=>!e&&a(),children:(0,p.jsx)(i,{children:e&&(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(r,{children:[(0,p.jsx)(n,{children:e.displayName}),(0,p.jsxs)(o,{children:[e.position?`${e.position} · `:``,`currently `,l[e.state].toLowerCase(),!e.isSelf&&` · you are answering for them`]})]}),(0,p.jsx)(d,{value:e.state,disabled:c,onToggle:n=>{t(e.userId,n),a()}})]})})})}var p;function m(){return(m=e((()=>{a(),c(),u(),p=t(),f.__docgenInfo={description:`The one way to change anyone's answer.

Both surfaces that list people — the event card's lineup panel and the detail page's attendee
list — open this same sheet, so the gesture is one thing app-wide rather than a bottom sheet in
one place and an inline expander in the other. It lives in the attendance-toggle feature because
that is what it is: the answer control plus the context that says whose answer it is.

Anchored to the thumb rather than to the row, which is what makes it work on a long list: tapping
someone 2000px down does not push the page around, and the sheet names the person so the row it
came from need not stay in view.

A member may set a teammate's answer (ADR-0003), so when the target is someone else the sheet
says so plainly — the awareness is the safeguard, not a confirmation step.`,methods:[],displayName:`AnswerSheet`,props:{target:{required:!0,tsType:{name:`union`,raw:`AnswerTarget | null`,elements:[{name:`AnswerTarget`},{name:`null`}]},description:``},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: LineupState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`LineupState`},name:`state`}],return:{name:`void`}}},description:`Fires with the *target* member's id, never the viewer's.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},pending:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}export{m as n,f as t};