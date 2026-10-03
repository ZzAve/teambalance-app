import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./AttendanceToggle-Bct0G6By.js";import{a as i,i as a,n as o,o as s,r as c,t as l}from"./sheet-Dv2v1ekw.js";import{a as u,t as d}from"./lineup-TDQLra9X.js";function f({target:e,onRespond:t,onClose:n,pending:s}){return(0,p.jsx)(l,{open:e!==null,onOpenChange:e=>!e&&n(),children:(0,p.jsx)(o,{children:e&&(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(a,{children:[(0,p.jsx)(i,{children:e.displayName}),(0,p.jsxs)(c,{children:[e.position?`${e.position} · `:``,`currently `,d[e.state].toLowerCase(),!e.isSelf&&` · you are answering for them`]})]}),(0,p.jsx)(r,{value:e.state,disabled:s,onToggle:r=>{t(e.userId,r),n()}})]})})})}var p;function m(){return(m=e((()=>{s(),u(),n(),p=t(),f.__docgenInfo={description:`The one way to change anyone's answer.

Both surfaces that list people — the event card's lineup panel and the detail page's attendee
list — open this same sheet, so the gesture is one thing app-wide rather than a bottom sheet in
one place and an inline expander in the other. It lives in the attendance-toggle feature because
that is what it is: the answer control plus the context that says whose answer it is.

Anchored to the thumb rather than to the row, which is what makes it work on a long list: tapping
someone 2000px down does not push the page around, and the sheet names the person so the row it
came from need not stay in view.

A member may set a teammate's answer (ADR-0003), so when the target is someone else the sheet
says so plainly — the awareness is the safeguard, not a confirmation step.`,methods:[],displayName:`AnswerSheet`,props:{target:{required:!0,tsType:{name:`union`,raw:`AnswerTarget | null`,elements:[{name:`AnswerTarget`},{name:`null`}]},description:``},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(userId: string, state: LineupState) => void`,signature:{arguments:[{type:{name:`string`},name:`userId`},{type:{name:`LineupState`},name:`state`}],return:{name:`void`}}},description:`Fires with the *target* member's id, never the viewer's.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},pending:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}export{m as n,f as t};