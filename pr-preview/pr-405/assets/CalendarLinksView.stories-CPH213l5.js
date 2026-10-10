import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n}from"./iframe-tCqUWrF4.js";import{n as r,t as i}from"./utils-BTemNN_S.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./stack-DUXBP51x.js";import{n as c,t as l}from"./createLucideIcon-D89ngBPt.js";import{n as u,t as d}from"./chevron-down-BXKlzZ9I.js";import{a as f,i as p,n as m,r as h}from"./dist-DQ6lza4V.js";import{n as g,t as _}from"./button-DGs1rKnN.js";import{n as v,t as y}from"./input-Bg6XsOtQ.js";import{r as b,t as x}from"./dist-Bhs0Fgsp.js";import{n as S,t as C}from"./label-CwPDs6yz.js";import{A as ee,C as te,D as ne,O as re,S as ie,b as ae,c as oe,d as se,f as ce,h as le,k as w,l as ue,m as de,n as fe,o as pe,p as me,s as he,t as ge,u as _e,v as ve,x as ye,y as be}from"./Combination-C3oJT2S2.js";import{a as xe,i as Se,n as Ce,r as we,t as Te}from"./dist-8-g0kQEO.js";import{n as Ee,t as De}from"./ConfirmDialog-CwOc4f2F.js";import{n as Oe,t as ke}from"./FormError-B3b4LG7B.js";import{n as Ae,t as je}from"./QueryErrorState-CKd1uiUM.js";import{a as T,i as Me,n as Ne,o as Pe,r as Fe,s as Ie,t as Le}from"./EventTypeChip-DIrJddbh.js";import{n as Re,t as ze}from"./switch-C4KeThMR.js";var Be,Ve;function He(){return(He=t((()=>{c(),Be=[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]],Ve=l(`info`,Be)})))()}function Ue(e){return e.replace(/^https?:\/\//,`webcal://`)}function We(e){return`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(Ue(e))}`}function Ge(e){return e.label??`Link from ${Ke(e.createdAt)}`}function Ke(e){return new Date(e).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`})}function qe(e,t,n){let r=T.every(t=>e.attendanceStates.includes(t)),i=[e.eventTypeIds&&Je(e.eventTypeIds,n),!r&&`${T.filter(t=>e.attendanceStates.includes(t)).map(e=>Pe[e]).join(`, `)} only`,!e.showAttendancePrefix&&`no ✓/✗ marks`,e.calendarNameSuffix&&`calendar: ${t} · ${e.calendarNameSuffix}`].filter(Boolean);return i.length>0?i.join(` · `):void 0}function Je(e,t){let n=t.filter(t=>e.includes(t.id)).map(e=>e.archived?`${e.name} (archived)`:e.name),r=e.length-n.length;if(r===0)return n.join(`, `);let i=`${r} ${n.length>0?`other `:``}event type${r===1?``:`s`}`;return[...n,i].join(`, `)}function Ye(){return(Ye=t((()=>{Ie()})))()}function Xe({attendanceStates:e,showAttendancePrefix:t,eventTypeIds:n}){if(n!==void 0)return`custom`;let r=new Set(e);return t&&T.every(e=>r.has(e))?`me`:!t&&r.size===1&&r.has(`ATTENDING`)?`partner`:`custom`}var Ze;function Qe(){return(Qe=t((()=>{Ie(),Ze={me:{attendanceStates:T,showAttendancePrefix:!0,calendarNameSuffix:void 0,eventTypeIds:void 0},partner:{attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`,eventTypeIds:void 0}}})))()}function $e({open:e,onOpenChange:t,options:n,teamName:r,eventTypes:i,disabled:a,onChange:o}){let s=(0,E.useId)(),c=(0,E.useId)(),l=(0,E.useId)(),u=e=>{let t=n.attendanceStates.includes(e);t&&n.attendanceStates.length===1||o({...n,attendanceStates:t?n.attendanceStates.filter(t=>t!==e):[...n.attendanceStates,e]})},f=e=>{let t=n.eventTypeIds??[],r=t.includes(e)?t.filter(t=>t!==e):[...t,e];o({...n,eventTypeIds:r.length>0?r:void 0})};return(0,D.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,D.jsxs)(`button`,{type:`button`,"aria-expanded":e,"aria-controls":s,onClick:()=>t(!e),className:`flex items-center gap-1 self-start text-small font-semibold text-muted-foreground hover:text-foreground`,children:[`Advanced`,(0,D.jsx)(d,{size:16,"aria-hidden":`true`,className:e?`rotate-180 transition-transform`:`transition-transform`})]}),e&&(0,D.jsxs)(`div`,{id:s,className:`flex flex-col gap-4 rounded-md border border-border p-3`,children:[(0,D.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,D.jsx)(`p`,{id:c,className:`text-small font-medium`,children:`Include events you answered`}),(0,D.jsx)(`div`,{role:`group`,"aria-labelledby":c,className:`flex flex-wrap gap-2`,children:T.map(e=>(0,D.jsx)(Fe,{pressed:n.attendanceStates.includes(e),disabled:a,onToggle:()=>u(e),activeClassName:`border-blue bg-blue/10 text-blue`,inactiveClassName:`border-border text-muted-foreground`,children:Pe[e]},e))})]}),(0,D.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,D.jsx)(`p`,{id:l,className:`text-small font-medium`,children:`Include event types`}),(0,D.jsxs)(`div`,{role:`group`,"aria-labelledby":l,className:`flex flex-wrap gap-2`,children:[(0,D.jsx)(Fe,{pressed:n.eventTypeIds===void 0,disabled:a,onToggle:()=>o({...n,eventTypeIds:void 0}),activeClassName:`border-blue bg-blue/10 text-blue`,inactiveClassName:`border-border text-muted-foreground`,children:`All types`}),i.map(e=>(0,D.jsx)(Le,{type:e,pressed:n.eventTypeIds?.includes(e.id)??!1,disabled:a,onToggle:()=>f(e.id)},e.id))]}),(0,D.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:n.eventTypeIds===void 0?`Types your team adds later are included.`:`Types your team adds later are not included.`})]}),(0,D.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,D.jsx)(`span`,{className:`text-small font-medium`,children:`Mark your answer (✓ ? ✗) on titles`}),(0,D.jsx)(ze,{checked:n.showAttendancePrefix,disabled:a,onCheckedChange:e=>o({...n,showAttendancePrefix:e}),"aria-label":`Mark your answer on titles`})]}),(0,D.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,D.jsx)(C,{htmlFor:`${s}-suffix`,children:`Calendar name suffix (optional)`}),(0,D.jsx)(y,{id:`${s}-suffix`,value:n.calendarNameSuffix??``,maxLength:et,placeholder:`e.g. Partner`,disabled:a,onChange:e=>o({...n,calendarNameSuffix:e.target.value||void 0})}),(0,D.jsxs)(`p`,{className:`text-caption text-muted-foreground`,children:[`Your calendar app shows it as '`,r,n.calendarNameSuffix?.trim()?` · ${n.calendarNameSuffix.trim()}`:``,`'.`]})]})]})]})}var E,D,et;function tt(){return(tt=t((()=>{E=n(),u(),Me(),v(),S(),Re(),Ie(),Ne(),D=a(),et=30,$e.__docgenInfo={description:``,methods:[],displayName:`AdvancedOptions`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},onOpenChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(open: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`open`}],return:{name:`void`}}},description:``},options:{required:!0,tsType:{name:`LinkOptions`},description:``},teamName:{required:!0,tsType:{name:`string`},description:``},eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`The types a member may pick, in the team's order.`},disabled:{required:!1,tsType:{name:`boolean`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(options: LinkOptions) => void`,signature:{arguments:[{type:{name:`LinkOptions`},name:`options`}],return:{name:`void`}}},description:``}}}})))()}function nt(e){return e?`open`:`closed`}var O,k,rt,A,j,it,at,M,ot,N,st,ct,lt,ut,dt,ft,pt,P,mt,ht,gt,_t,vt,yt,bt,xt,St;function Ct(){return(Ct=t((()=>{O=e(n(),1),ee(),p(),re(),te(),ae(),be(),de(),xe(),me(),se(),b(),h(),oe(),he(),fe(),k=a(),rt=Object.defineProperty,A=(e,t)=>rt(e,`name`,{value:t,configurable:!0}),j=`Popover`,[it,at]=ne(j,[Se]),M=Se(),[ot,N]=it(j),st=A(e=>{let{__scopePopover:t,children:n,open:r,defaultOpen:i,onOpenChange:a,modal:o=!1}=e,s=M(t),c=O.useRef(null),[l,u]=O.useState(!1),[d,f]=ue({prop:r,defaultProp:i??!1,onChange:a,caller:j});return(0,k.jsx)(we,{...s,children:(0,k.jsx)(ot,{scope:t,contentId:le(),triggerRef:c,open:d,onOpenChange:f,onOpenToggle:O.useCallback(()=>f(e=>!e),[f]),hasCustomAnchor:l,onCustomAnchorAdd:O.useCallback(()=>u(!0),[]),onCustomAnchorRemove:O.useCallback(()=>u(!1),[]),modal:o,children:n})})},`Popover`),ct=`PopoverTrigger`,lt=O.forwardRef(A(function(e,t){let{__scopePopover:n,...r}=e,i=N(ct,n),a=M(n),o=f(t,i.triggerRef),s=(0,k.jsx)(x.button,{type:`button`,"aria-haspopup":`dialog`,"aria-expanded":i.open,"aria-controls":i.open?i.contentId:void 0,"data-state":nt(i.open),...r,ref:o,onClick:w(e.onClick,i.onOpenToggle)});return i.hasCustomAnchor?s:(0,k.jsx)(Te,{asChild:!0,...a,children:s})},`PopoverTrigger`)),ut=`PopoverPortal`,[dt,ft]=it(ut,{forceMount:void 0}),pt=A(e=>{let{__scopePopover:t,forceMount:n,children:r,container:i}=e,a=N(ut,t);return(0,k.jsx)(dt,{scope:t,forceMount:n,children:(0,k.jsx)(_e,{present:n||a.open,children:(0,k.jsx)(ce,{asChild:!0,container:i,children:r})})})},`PopoverPortal`),P=`PopoverContent`,mt=O.forwardRef(A(function(e,t){let n=ft(P,e.__scopePopover),{forceMount:r=n.forceMount,...i}=e,a=N(P,e.__scopePopover);return(0,k.jsx)(_e,{present:r||a.open,children:a.modal?(0,k.jsx)(gt,{...i,ref:t}):(0,k.jsx)(_t,{...i,ref:t})})},`PopoverContent`)),ht=m(`PopoverContent.RemoveScroll`),gt=O.forwardRef(A(function(e,t){let n=N(P,e.__scopePopover),r=O.useRef(null),i=f(t,r),a=O.useRef(!1);return O.useEffect(()=>{let e=r.current;if(e)return pe(e)},[]),(0,k.jsx)(ge,{as:ht,allowPinchZoom:!0,children:(0,k.jsx)(vt,{...e,ref:i,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:w(e.onCloseAutoFocus,e=>{e.preventDefault(),a.current||n.triggerRef.current?.focus()}),onPointerDownOutside:w(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=t.button===0&&t.ctrlKey===!0,r=t.button===2||n;a.current=r},{checkForDefaultPrevented:!1}),onFocusOutside:w(e.onFocusOutside,e=>e.preventDefault(),{checkForDefaultPrevented:!1})})})},`PopoverContentModal`)),_t=O.forwardRef(A(function(e,t){let n=N(P,e.__scopePopover),r=O.useRef(!1),i=O.useRef(!1);return(0,k.jsx)(vt,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(r.current||n.triggerRef.current?.focus(),t.preventDefault()),r.current=!1,i.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(r.current=!0,t.detail.originalEvent.type===`pointerdown`&&(i.current=!0));let a=t.target;n.triggerRef.current?.contains(a)&&t.preventDefault(),t.detail.originalEvent.type===`focusin`&&i.current&&t.preventDefault()}})},`PopoverContentNonModal`)),vt=O.forwardRef(A(function(e,t){let{__scopePopover:n,trapFocus:r,onOpenAutoFocus:i,onCloseAutoFocus:a,disableOutsidePointerEvents:o,onEscapeKeyDown:s,onPointerDownOutside:c,onFocusOutside:l,onInteractOutside:u,...d}=e,f=N(P,n),p=M(n);return ye(),(0,k.jsx)(ve,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:i,onUnmountAutoFocus:a,children:(0,k.jsx)(ie,{asChild:!0,disableOutsidePointerEvents:o,onInteractOutside:u,onEscapeKeyDown:s,onPointerDownOutside:c,onFocusOutside:l,onDismiss:()=>f.onOpenChange(!1),deferPointerDownOutside:!0,children:(0,k.jsx)(Ce,{"data-state":nt(f.open),role:`dialog`,id:f.contentId,...p,...d,ref:t,style:{...d.style,"--radix-popover-content-transform-origin":`var(--radix-popper-transform-origin)`,"--radix-popover-content-available-width":`var(--radix-popper-available-width)`,"--radix-popover-content-available-height":`var(--radix-popper-available-height)`,"--radix-popover-trigger-width":`var(--radix-popper-anchor-width)`,"--radix-popover-trigger-height":`var(--radix-popper-anchor-height)`}})})})},`PopoverContentImpl`)),A(nt,`getState`),yt=st,bt=lt,xt=pt,St=mt})))()}function wt({className:e,align:t=`center`,sideOffset:n=4,...r}){return(0,Tt.jsx)(xt,{children:(0,Tt.jsx)(St,{"data-slot":`popover-content`,align:t,sideOffset:n,className:i(`z-50 w-72 rounded-md border border-border bg-popover p-3 text-small text-popover-foreground shadow-md outline-none`,e),...r})})}var Tt,Et,Dt;function Ot(){return(Ot=t((()=>{Ct(),r(),Tt=a(),Et=yt,Dt=bt,wt.__docgenInfo={description:``,methods:[],displayName:`PopoverContent`,props:{align:{defaultValue:{value:`'center'`,computed:!1},required:!1},sideOffset:{defaultValue:{value:`4`,computed:!1},required:!1}}}})))()}function kt({value:e,teamName:t,disabled:n,onChange:r}){let i=(0,At.useId)(),a=(0,At.useId)();return(0,F.jsxs)(`div`,{children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,F.jsx)(`h3`,{id:i,className:`text-small font-semibold text-muted-foreground`,children:`Who is this calendar for?`}),(0,F.jsxs)(Et,{children:[(0,F.jsx)(Dt,{asChild:!0,children:(0,F.jsx)(`button`,{type:`button`,"aria-label":`About Me and Partner`,className:`inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground`,children:(0,F.jsx)(Ve,{size:16,"aria-hidden":`true`})})}),(0,F.jsxs)(wt,{className:`flex flex-col gap-2`,children:[(0,F.jsxs)(`p`,{children:[(0,F.jsx)(`strong`,{children:`Me:`}),` everything the team schedules, with your answer marked.`]}),(0,F.jsxs)(`p`,{children:[(0,F.jsx)(`strong`,{children:`Partner:`}),` only events you are attending, no marks, calendar named '`,t,` · Partner'.`]})]})]})]}),(0,F.jsx)(`div`,{role:`radiogroup`,"aria-labelledby":i,className:`mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-card p-1`,children:jt.map(({value:t,label:i})=>{let o=e===t;return(0,F.jsxs)(`label`,{className:`cursor-pointer`,children:[(0,F.jsx)(`input`,{type:`radio`,name:a,value:t,checked:o,disabled:n,onChange:()=>r(t),className:`peer sr-only`}),(0,F.jsx)(`span`,{className:[`flex min-h-11 items-center justify-center rounded-lg text-caption font-semibold transition-colors`,`peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card`,o?`bg-blue/10 text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),children:i})]},t)})})]})}var At,F,jt;function Mt(){return(Mt=t((()=>{At=n(),He(),Ot(),F=a(),jt=[{value:`me`,label:`Me`},{value:`partner`,label:`Partner`},{value:`custom`,label:`Custom`}],kt.__docgenInfo={description:`Me / Partner / Custom as a native radiogroup, the ThemeToggleView pattern, with an explainer popover.`,methods:[],displayName:`PresetControl`,props:{value:{required:!0,tsType:{name:`union`,raw:`'me' | 'partner' | 'custom'`,elements:[{name:`literal`,value:`'me'`},{name:`literal`,value:`'partner'`},{name:`literal`,value:`'custom'`}]},description:``},teamName:{required:!0,tsType:{name:`string`},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(preset: Preset) => void`,signature:{arguments:[{type:{name:`union`,raw:`'me' | 'partner' | 'custom'`,elements:[{name:`literal`,value:`'me'`},{name:`literal`,value:`'partner'`},{name:`literal`,value:`'custom'`}]},name:`preset`}],return:{name:`void`}}},description:``}}}})))()}function Nt({initial:e={label:``,...Ze.me},teamName:t,eventTypes:n,disabled:r,isSaving:i,submitLabel:a,onSubmit:o,onCancel:s}){let c=(0,I.useId)(),[l,u]=(0,I.useState)(e.label??``),[d,f]=(0,I.useState)({attendanceStates:e.attendanceStates,showAttendancePrefix:e.showAttendancePrefix,calendarNameSuffix:e.calendarNameSuffix,eventTypeIds:e.eventTypeIds}),[p,m]=(0,I.useState)(!1),[h,g]=(0,I.useState)(()=>Xe(d)===`custom`),v=p?`custom`:Xe(d),b=e=>{let t=n.findIndex(t=>t.id===e);return t===-1?n.length:t};return(0,L.jsxs)(`form`,{className:`flex flex-col gap-4`,onSubmit:e=>{e.preventDefault(),o({label:l.trim()||void 0,attendanceStates:T.filter(e=>d.attendanceStates.includes(e)),showAttendancePrefix:d.showAttendancePrefix,calendarNameSuffix:d.calendarNameSuffix?.trim()||void 0,eventTypeIds:d.eventTypeIds&&[...d.eventTypeIds].sort((e,t)=>b(e)-b(t))})},children:[(0,L.jsx)(kt,{value:v,teamName:t,disabled:r,onChange:e=>{if(e===`custom`){m(!0),g(!0);return}f(Ze[e]),m(!1),e===`partner`&&l.trim()===``&&u(Ft),e===`me`&&l===Ft&&u(``)}}),(0,L.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,L.jsx)(C,{htmlFor:c,children:`Label (optional)`}),(0,L.jsxs)(`div`,{className:`flex gap-2`,children:[(0,L.jsx)(y,{id:c,value:l,maxLength:Pt,placeholder:`e.g. My phone`,disabled:r,onChange:e=>u(e.target.value)}),(0,L.jsx)(_,{type:`submit`,disabled:r||i,children:a}),s&&(0,L.jsx)(_,{type:`button`,variant:`ghost`,onClick:s,children:`Cancel`})]})]}),(0,L.jsx)($e,{open:h,onOpenChange:g,options:d,teamName:t,eventTypes:n,disabled:r,onChange:e=>{f(e),m(!0)}})]})}var I,L,Pt,Ft;function It(){return(It=t((()=>{I=n(),g(),v(),S(),Ie(),Qe(),tt(),Mt(),L=a(),Pt=50,Ft=`Partner`,Nt.__docgenInfo={description:"A link's label, preset and options, for creating a link and for editing one in place. Owns its\nfield state from `initial` on; a parent that wants a fresh form renders it under a new `key`.",methods:[],displayName:`CalendarLinkForm`,props:{initial:{required:!1,tsType:{name:`intersection`,raw:`LinkOptions & { label?: string }`,elements:[{name:`LinkOptions`},{name:`signature`,type:`object`,raw:`{ label?: string }`,signature:{properties:[{key:`label`,value:{name:`string`,required:!1}}]}}]},description:`What the form starts from: the Me preset for a new link, the link itself when editing.`,defaultValue:{value:`{ label: '', ...PRESET_OPTIONS.me }`,computed:!1}},teamName:{required:!0,tsType:{name:`string`},description:`The Active Team's name, which a link's calendar is named after.`},eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`The types the picker offers, in the team's order.`},disabled:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:``},submitLabel:{required:!0,tsType:{name:`string`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: CalendarLinkRequest) => void`,signature:{arguments:[{type:{name:`CalendarLinkRequest`},name:`request`}],return:{name:`void`}}},description:``},onCancel:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Offered as a Cancel button when given.`}}}})))()}function R({teamName:e,links:t=[],eventTypes:n=[],isLoading:r,isError:i,isSaving:a,actionError:o,updateError:s,copiedId:c,copyFailedId:l,onGenerate:u,onUpdate:d,onEditOpenOrClose:f,onDelete:p,onCopy:m,onRetry:h}){let g=n.filter(e=>!e.archived),[_,v]=(0,z.useState)(null),[y,b]=(0,z.useState)(0),[x,S]=(0,z.useState)(null),C=t.length>=Rt;return(0,B.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Subscribe to your team's events once and your phone's calendar stays in sync. Changes can take up to a day to appear on Google Calendar.`}),r&&(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),i&&(0,B.jsx)(je,{title:`Couldn't load your calendar links`,description:`Check your connection and try again.`,onRetry:h}),!r&&!i&&(0,B.jsxs)(B.Fragment,{children:[t.length===0?(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No calendar links yet.`}):(0,B.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:t.map(t=>(0,B.jsx)(Lt,{link:t,teamName:e,copied:c===t.id,copyFailed:l===t.id,eventTypes:n,editing:_===t.id,isSaving:a,updateError:s,onCopy:m,onEdit:()=>{f(),v(t.id)},onCancelEdit:()=>{f(),v(null)},onUpdate:e=>d(t.id,e,()=>v(e=>e===t.id?null:e)),onRequestDelete:S},t.id))}),(0,B.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,B.jsx)(Nt,{teamName:e,eventTypes:g,disabled:C,isSaving:a,submitLabel:`Generate link`,onSubmit:e=>{u(e),b(e=>e+1)}},y),C&&(0,B.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[`You have `,Rt,` links, the maximum. Delete one to generate a new link.`]}),o&&_===null&&(0,B.jsx)(ke,{children:`Something went wrong. Please try again.`})]}),(0,B.jsx)(De,{open:x!==null,title:`Delete calendar link?`,description:`Every calendar subscribed with this link stops updating.`,confirmLabel:`Delete link`,onConfirm:()=>{x&&p(x.id),S(null)},onCancel:()=>S(null)})]})]})}function Lt({link:e,teamName:t,eventTypes:n,editing:r,copied:i,copyFailed:a,isSaving:o,updateError:s,onCopy:c,onEdit:l,onCancelEdit:u,onUpdate:d,onRequestDelete:f}){let p=Ge(e),m=qe(e,t,n),h=n.filter(t=>!t.archived||e.eventTypeIds?.includes(t.id));return(0,B.jsxs)(`li`,{"aria-label":p,className:`flex flex-col gap-3 p-3`,children:[(0,B.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,B.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:p,children:p}),e.expired&&(0,B.jsx)(`span`,{className:`shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red`,children:`Expired`})]}),(0,B.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[e.expired?`Expired`:`Expires`,` `,Ke(e.expiresAt)]}),r?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(Nt,{initial:e,teamName:t,eventTypes:h,isSaving:o,submitLabel:`Save`,onSubmit:d,onCancel:u}),s&&(0,B.jsx)(ke,{children:`Something went wrong. Please try again.`})]}):(0,B.jsxs)(B.Fragment,{children:[m&&(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:m}),(0,B.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[e.url?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(_,{asChild:!0,size:`sm`,variant:`outline`,children:(0,B.jsx)(`a`,{href:Ue(e.url),children:`Open in Calendar`})}),(0,B.jsx)(_,{asChild:!0,size:`sm`,variant:`outline`,children:(0,B.jsx)(`a`,{href:We(e.url),target:`_blank`,rel:`noopener noreferrer`,children:`Add to Google Calendar`})}),(0,B.jsx)(_,{size:`sm`,variant:`outline`,onClick:()=>c(e),children:i?`Copied!`:`Copy link`})]}):(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This link can no longer be shown.`}),!e.expired&&(0,B.jsx)(_,{size:`sm`,variant:`outline`,onClick:l,children:`Edit`}),(0,B.jsx)(_,{size:`sm`,variant:`ghost`,className:`text-red`,disabled:o,onClick:()=>f(e),children:`Delete`})]})]}),a&&e.url&&(0,B.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,B.jsx)(ke,{children:`Couldn't copy automatically. Copy the link below.`}),(0,B.jsx)(y,{readOnly:!0,"aria-label":`Calendar link URL for ${p}`,value:e.url,onFocus:e=>e.currentTarget.select()})]})]})}var z,B,Rt;function zt(){return(zt=t((()=>{z=n(),g(),v(),Ee(),Oe(),Ae(),Ye(),It(),B=a(),Rt=3,R.__docgenInfo={description:`The member's calendar links for this team: a short explainer, the list with its per-link actions
and in-place edit, and the generate form. Prop-only; the queries, the mutations, the clipboard
write and the copied flag live in the CalendarLinks container (ADR-0017). Owns only the create
form's reset key, which row is being edited, and the delete-confirm target.`,methods:[],displayName:`CalendarLinksView`,props:{teamName:{required:!0,tsType:{name:`string`},description:`The Active Team's name, which a link's calendar is named after.`},links:{required:!1,tsType:{name:`Array`,elements:[{name:`CalendarLink`}],raw:`CalendarLink[]`},description:`The member's links in this team, newest first, as the server returned them.`,defaultValue:{value:`[]`,computed:!1}},eventTypes:{required:!1,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:`The team's event types, archived ones included: a link may still list one.`,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:`A create, edit or delete is in flight.`},actionError:{required:!1,tsType:{name:`boolean`},description:`The last create, edit or delete failed.`},updateError:{required:!1,tsType:{name:`boolean`},description:`The last edit failed. Shown in the row being edited.`},copiedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose URL was just copied, so its button can say so.`},copyFailedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose clipboard write the browser refused, so its URL can be copied by hand.`},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: CalendarLinkRequest) => void`,signature:{arguments:[{type:{name:`CalendarLinkRequest`},name:`request`}],return:{name:`void`}}},description:``},onUpdate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, request: CalendarLinkRequest, onSaved: () => void) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`CalendarLinkRequest`},name:`request`},{type:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},name:`onSaved`}],return:{name:`void`}}},description:"`onSaved` is called once the edit is stored; until then the row stays open with its edits."},onEditOpenOrClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`A row's edit opened or was cancelled, so an earlier edit's error no longer applies.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(link: CalendarLink) => void`,signature:{arguments:[{type:{name:`CalendarLink`},name:`link`}],return:{name:`void`}}},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var V,H,U,W,G,Bt,K,q,J,Vt,Ht,Y,Ut,Wt,Gt,X,Kt,Z,Q,$,qt;function Jt(){return(Jt=t((()=>{o(),zt(),V=a(),{expect:H,fn:U,within:W}=__STORYBOOK_MODULE_TEST__,G=`https://api.teambalance.nl/api/calendar/setpoint-vt`,Bt=[`ATTENDING`,`MAYBE`,`ABSENT`,`NOT_RESPONDED`],K=(e,t,n,r=!1)=>({id:e,name:t,color:n,archived:r,rosterDefault:{trackRoster:!1,totalTarget:void 0,positionTargets:[]}}),q=K(`t-training`,`Training`,`#249E6C`),J=K(`t-match`,`Match`,`#225C9C`),Vt=K(`t-beach`,`Beach`,`#F4B400`,!0),Ht=[q,J,Vt],Y={id:`l3`,label:`My phone`,createdAt:`2026-09-01T10:00:00Z`,expiresAt:`2027-09-01T10:00:00Z`,expired:!1,url:`${G}/token-phone.ics`,attendanceStates:Bt,showAttendancePrefix:!0,calendarNameSuffix:void 0,eventTypeIds:void 0},Ut={id:`l2`,label:`Partner`,createdAt:`2026-03-14T10:00:00Z`,expiresAt:`2027-03-14T10:00:00Z`,expired:!1,url:`${G}/token-partner.ics`,attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`,eventTypeIds:void 0},Wt={id:`l1`,label:void 0,createdAt:`2025-06-02T10:00:00Z`,expiresAt:`2026-06-02T10:00:00Z`,expired:!0,url:`${G}/token-custom.ics`,attendanceStates:[`ATTENDING`,`MAYBE`],showAttendancePrefix:!0,calendarNameSuffix:void 0,eventTypeIds:[Vt.id,q.id]},Gt=[Y,Ut,Wt],X={attendanceStates:Bt,showAttendancePrefix:!0,calendarNameSuffix:void 0,eventTypeIds:void 0},Kt={title:`features/calendar-links/CalendarLinksView`,component:R,args:{teamName:`Setpoint VT`,links:Gt,eventTypes:Ht,onGenerate:U(),onUpdate:U(),onEditOpenOrClose:U(),onDelete:U(),onCopy:U(),onRetry:U()}},Z={play:async({canvas:e})=>{let t=t=>W(e.getByRole(`listitem`,{name:t}));await H(t(`My phone`).getByText(`Expires 1 sep 2027`)).toBeInTheDocument(),await H(t(`Link from 2 jun 2025`).getByText(`Expired 2 jun 2026`)).toBeInTheDocument(),await H(t(`Link from 2 jun 2025`).getByText(`Expired`,{exact:!0})).toBeInTheDocument(),await H(t(`My phone`).queryByText(`Expired`)).not.toBeInTheDocument(),await H(t(`My phone`).queryByText(/only|marks|calendar:/)).not.toBeInTheDocument(),await H(t(`Partner`).getByText(`Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner`)).toBeInTheDocument(),await H(t(`Link from 2 jun 2025`).getByText(`Training, Beach (archived) · Going, Maybe only`)).toBeInTheDocument(),await H(t(`My phone`).getByRole(`link`,{name:`Open in Calendar`})).toHaveAttribute(`href`,`webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics`);let n=t(`My phone`).getByRole(`link`,{name:`Add to Google Calendar`});await H(n).toHaveAttribute(`href`,`https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics`),await H(n).toHaveAttribute(`target`,`_blank`),await H(t(`Link from 2 jun 2025`).getByRole(`button`,{name:`Delete`})).toBeEnabled(),await H(e.getByRole(`button`,{name:`Generate link`})).toBeDisabled(),await H(e.getByText(/You have 3 links, the maximum/)).toBeInTheDocument()}},Q={render:e=>(0,V.jsx)(s,{items:{Loading:(0,V.jsx)(R,{...e,isLoading:!0}),Error:(0,V.jsx)(R,{...e,isError:!0}),Empty:(0,V.jsx)(R,{...e,links:[]}),"Copy refused":(0,V.jsx)(R,{...e,links:[Y],copyFailedId:`l3`})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>W(e.getByRole(`region`,{name:t}));await H(n(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await H(n(`Loading`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await H(n(`Error`).getByRole(`alert`)).toHaveTextContent(`Couldn't load your calendar links`),await H(n(`Error`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await H(n(`Empty`).getByText(`No calendar links yet.`)).toBeInTheDocument(),await H(n(`Empty`).getByRole(`button`,{name:`Generate link`})).toBeEnabled();let r=n(`Copy refused`);await H(r.getByRole(`alert`)).toHaveTextContent(`Couldn't copy automatically. Copy the link below.`),await H(r.getByLabelText(`Calendar link URL for My phone`)).toHaveValue(Y.url),await H(r.getByRole(`button`,{name:`Copy link`})).toBeInTheDocument(),await t.click(n(`Empty`).getByRole(`button`,{name:`About Me and Partner`})),await H(await W(document.body).findByText(/only events you are attending/)).toBeVisible()}},$={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,V.jsx)(s,{items:{"Below the cap":(0,V.jsx)(R,{...e,links:[Y,Ut],copiedId:`l2`}),"An expired link":(0,V.jsx)(R,{...e,links:[Wt]}),"Save failed":(0,V.jsx)(R,{...e,links:[Y],updateError:!0}),"Earlier failure, types unknown":(0,V.jsx)(R,{...e,links:[{...Y,eventTypeIds:[J.id]}],eventTypes:[],actionError:!0}),Error:(0,V.jsx)(R,{...e,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=W(e.getByRole(`region`,{name:`Below the cap`})),i=W(document.body);await H(W(r.getByRole(`listitem`,{name:`Partner`})).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument();let a=W(r.getByRole(`listitem`,{name:`My phone`}));await t.click(a.getByRole(`button`,{name:`Copy link`})),await H(n.onCopy).toHaveBeenCalledWith(Y),await t.click(a.getByRole(`button`,{name:`Delete`})),await H(await i.findByText(`Every calendar subscribed with this link stops updating.`)).toBeInTheDocument(),await H(i.getByRole(`heading`,{name:`Delete calendar link?`})).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await H(n.onDelete).not.toHaveBeenCalled(),await t.click(a.getByRole(`button`,{name:`Delete`})),await t.click(await i.findByRole(`button`,{name:`Delete link`})),await H(n.onDelete).toHaveBeenCalledWith(`l3`),await H(r.getByRole(`radio`,{name:`Me`})).toBeChecked(),await t.click(r.getByRole(`button`,{name:`Generate link`})),await H(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,...X});let o=()=>r.getByLabelText(`Label (optional)`);await H(o()).toHaveAttribute(`maxLength`,`50`),await t.type(o(),`  Work laptop {Enter}`),await H(n.onGenerate).toHaveBeenLastCalledWith({label:`Work laptop`,...X}),await H(o()).toHaveValue(``),await t.click(r.getByRole(`radio`,{name:`Partner`})),await H(o()).toHaveValue(`Partner`),await t.click(r.getByRole(`button`,{name:`Generate link`})),await H(n.onGenerate).toHaveBeenLastCalledWith({label:`Partner`,attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`}),await H(r.getByRole(`radio`,{name:`Me`})).toBeChecked(),await t.click(r.getByRole(`radio`,{name:`Partner`})),await H(o()).toHaveValue(`Partner`),await t.click(r.getByRole(`radio`,{name:`Me`})),await t.click(r.getByRole(`button`,{name:`Generate link`})),await H(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,...X}),await t.type(o(),`Sanne`),await t.click(r.getByRole(`radio`,{name:`Partner`})),await H(o()).toHaveValue(`Sanne`),await t.click(r.getByRole(`radio`,{name:`Me`})),await H(o()).toHaveValue(`Sanne`),await t.clear(o()),await t.click(r.getByRole(`button`,{name:`Advanced`})),await H(r.getByRole(`button`,{name:`Advanced`})).toHaveAttribute(`aria-expanded`,`true`),await t.click(r.getByRole(`button`,{name:`Can't`})),await H(r.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`false`),await H(r.getByRole(`radio`,{name:`Custom`})).toBeChecked();let s=r.getByLabelText(`Calendar name suffix (optional)`);await H(s).toHaveAttribute(`maxLength`,`30`),await t.type(s,`Work`),await H(r.getByText(`Your calendar app shows it as 'Setpoint VT · Work'.`)).toBeInTheDocument(),await t.click(r.getByRole(`switch`,{name:`Mark your answer on titles`})),await t.click(r.getByRole(`button`,{name:`Generate link`})),await H(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,attendanceStates:[`ATTENDING`,`MAYBE`,`NOT_RESPONDED`],showAttendancePrefix:!1,calendarNameSuffix:`Work`}),await t.click(r.getByRole(`button`,{name:`Advanced`})),await t.click(r.getByRole(`button`,{name:`Maybe`})),await H(r.getByRole(`radio`,{name:`Custom`})).toBeChecked(),await t.click(r.getByRole(`radio`,{name:`Me`})),await H(r.getByRole(`button`,{name:`Maybe`})).toHaveAttribute(`aria-pressed`,`true`),await H(r.getByRole(`button`,{name:`Advanced`})).toHaveAttribute(`aria-expanded`,`true`),await H(r.getByRole(`button`,{name:`All types`})).toHaveAttribute(`aria-pressed`,`true`),await H(r.queryByRole(`button`,{name:`Beach`})).not.toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`Match`})),await H(r.getByRole(`button`,{name:`All types`})).toHaveAttribute(`aria-pressed`,`false`),await H(r.getByRole(`radio`,{name:`Custom`})).toBeChecked(),await t.click(r.getByRole(`button`,{name:`Match`})),await H(r.getByRole(`button`,{name:`All types`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r.getByRole(`button`,{name:`Match`})),await t.click(r.getByRole(`button`,{name:`Training`})),await t.click(r.getByRole(`button`,{name:`Generate link`})),await H(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,...X,eventTypeIds:[q.id,J.id]});let c=()=>W(r.getByRole(`listitem`,{name:`Partner`}));await t.click(a.getByRole(`button`,{name:`Edit`})),await t.type(a.getByLabelText(`Label (optional)`),` 2`),await t.click(a.getByRole(`button`,{name:`Cancel`})),await H(n.onUpdate).not.toHaveBeenCalled(),await H(a.queryByLabelText(`Label (optional)`)).not.toBeInTheDocument(),await t.click(a.getByRole(`button`,{name:`Edit`})),await t.click(c().getByRole(`button`,{name:`Edit`})),await H(a.queryByLabelText(`Label (optional)`)).not.toBeInTheDocument(),await H(c().getByRole(`radio`,{name:`Partner`})).toBeChecked(),await H(c().getByLabelText(`Label (optional)`)).toHaveValue(`Partner`),await t.clear(c().getByLabelText(`Label (optional)`)),await t.type(c().getByLabelText(`Label (optional)`),`Sanne`),await t.click(c().getByRole(`button`,{name:`Advanced`})),await t.click(c().getByRole(`button`,{name:`Match`})),await t.click(c().getByRole(`button`,{name:`Save`})),await H(n.onUpdate).toHaveBeenCalledWith(`l2`,{label:`Sanne`,attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`,eventTypeIds:[J.id]},H.any(Function)),await H(c().getByRole(`button`,{name:`Save`})).toBeInTheDocument();let l=n.onUpdate.mock.calls[0][2];l(),await H(await c().findByRole(`button`,{name:`Edit`})).toBeInTheDocument();let u=W(e.getByRole(`region`,{name:`Save failed`})),d=W(u.getByRole(`listitem`,{name:`My phone`}));await H(d.queryByRole(`alert`)).not.toBeInTheDocument(),await t.click(d.getByRole(`button`,{name:`Edit`})),await H(d.getByRole(`alert`)).toHaveTextContent(`Something went wrong. Please try again.`),await H(u.getAllByRole(`alert`)).toHaveLength(1);let f=W(e.getByRole(`region`,{name:`Earlier failure, types unknown`})),p=W(f.getByRole(`listitem`,{name:`My phone`}));await H(p.getByText(`1 event type`)).toBeInTheDocument();let m=n.onEditOpenOrClose;m.mockClear(),await t.click(p.getByRole(`button`,{name:`Edit`})),await H(m).toHaveBeenCalledTimes(1),await H(p.queryByRole(`alert`)).not.toBeInTheDocument(),await H(p.getByRole(`button`,{name:`All types`})).toHaveAttribute(`aria-pressed`,`false`),await t.click(p.getByRole(`button`,{name:`All types`})),await H(p.getByRole(`button`,{name:`All types`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(p.getByRole(`button`,{name:`Cancel`})),await H(m).toHaveBeenCalledTimes(2);let h=W(W(e.getByRole(`region`,{name:`An expired link`})).getByRole(`listitem`,{name:`Link from 2 jun 2025`}));await H(h.getByRole(`button`,{name:`Delete`})).toBeInTheDocument(),await H(h.queryByRole(`button`,{name:`Edit`})).not.toBeInTheDocument(),await t.click(r.getByRole(`button`,{name:`About Me and Partner`})),await H(await i.findByText(`everything the team schedules, with your answer marked.`,{exact:!1})).toBeInTheDocument(),await H(i.getByText(`only events you are attending, no marks, calendar named 'Setpoint VT · Partner'.`,{exact:!1})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await t.click(W(e.getByRole(`region`,{name:`Error`})).getByRole(`button`,{name:`Retry`})),await H(n.onRetry).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const row = (name: string) => within(canvas.getByRole('listitem', {
      name
    }));
    await expect(row('My phone').getByText('Expires 1 sep 2027')).toBeInTheDocument();
    // No label: the creation date names the link instead.
    await expect(row('Link from 2 jun 2025').getByText('Expired 2 jun 2026')).toBeInTheDocument();
    await expect(row('Link from 2 jun 2025').getByText('Expired', {
      exact: true
    })).toBeInTheDocument();
    await expect(row('My phone').queryByText('Expired')).not.toBeInTheDocument();

    // A link at the Me defaults looks as it always did; any other says how it differs.
    await expect(row('My phone').queryByText(/only|marks|calendar:/)).not.toBeInTheDocument();
    await expect(row('Partner').getByText('Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner')).toBeInTheDocument();
    // Types in the team's order; an archived one is still listed, and says so.
    await expect(row('Link from 2 jun 2025').getByText('Training, Beach (archived) · Going, Maybe only')).toBeInTheDocument();

    // Every action on every link, no platform detection.
    await expect(row('My phone').getByRole('link', {
      name: 'Open in Calendar'
    })).toHaveAttribute('href', 'webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics');
    const google = row('My phone').getByRole('link', {
      name: 'Add to Google Calendar'
    });
    await expect(google).toHaveAttribute('href', 'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics');
    await expect(google).toHaveAttribute('target', '_blank');
    await expect(row('Link from 2 jun 2025').getByRole('button', {
      name: 'Delete'
    })).toBeEnabled();

    // Three links (the expired one counted) is the cap.
    await expect(canvas.getByRole('button', {
      name: 'Generate link'
    })).toBeDisabled();
    await expect(canvas.getByText(/You have 3 links, the maximum/)).toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <CalendarLinksView {...args} isLoading />,
    Error: <CalendarLinksView {...args} isError />,
    Empty: <CalendarLinksView {...args} links={[]} />,
    'Copy refused': <CalendarLinksView {...args} links={[PHONE]} copyFailedId="l3" />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Generate link'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByRole('alert')).toHaveTextContent("Couldn't load your calendar links");
    await expect(region('Error').queryByRole('button', {
      name: 'Generate link'
    })).not.toBeInTheDocument();
    await expect(region('Empty').getByText('No calendar links yet.')).toBeInTheDocument();
    await expect(region('Empty').getByRole('button', {
      name: 'Generate link'
    })).toBeEnabled();

    // The browser refused the clipboard write: say so, and put the URL where it can be copied by hand.
    const refused = region('Copy refused');
    await expect(refused.getByRole('alert')).toHaveTextContent("Couldn't copy automatically. Copy the link below.");
    await expect(refused.getByLabelText('Calendar link URL for My phone')).toHaveValue(PHONE.url);
    await expect(refused.getByRole('button', {
      name: 'Copy link'
    })).toBeInTheDocument();

    // Left open for the snapshot: the Me/Partner explainer is shown by no page composite.
    await userEvent.click(region('Empty').getByRole('button', {
      name: 'About Me and Partner'
    }));
    await expect(await within(document.body).findByText(/only events you are attending/)).toBeVisible();
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Below the cap': <CalendarLinksView {...args} links={[PHONE, PARTNER]} copiedId="l2" />,
    'An expired link': <CalendarLinksView {...args} links={[UNLABELLED_CUSTOM]} />,
    'Save failed': <CalendarLinksView {...args} links={[PHONE]} updateError />,
    'Earlier failure, types unknown': <CalendarLinksView {...args} links={[{
      ...PHONE,
      eventTypeIds: [MATCH.id]
    }]} eventTypes={[]} actionError />,
    Error: <CalendarLinksView {...args} isError />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = within(canvas.getByRole('region', {
      name: 'Below the cap'
    }));
    const portal = within(document.body);

    // The copied feedback is per link: only the one the container says was copied reads "Copied!".
    await expect(within(region.getByRole('listitem', {
      name: 'Partner'
    })).getByRole('button', {
      name: 'Copied!'
    })).toBeInTheDocument();
    const phone = within(region.getByRole('listitem', {
      name: 'My phone'
    }));
    await userEvent.click(phone.getByRole('button', {
      name: 'Copy link'
    }));
    await expect(args.onCopy).toHaveBeenCalledWith(PHONE);

    // Cancelling the confirmation deletes nothing.
    await userEvent.click(phone.getByRole('button', {
      name: 'Delete'
    }));
    await expect(await portal.findByText('Every calendar subscribed with this link stops updating.')).toBeInTheDocument();
    // A fixed title: one built from the target would go blank while the dialog animates out.
    await expect(portal.getByRole('heading', {
      name: 'Delete calendar link?'
    })).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onDelete).not.toHaveBeenCalled();
    await userEvent.click(phone.getByRole('button', {
      name: 'Delete'
    }));
    await userEvent.click(await portal.findByRole('button', {
      name: 'Delete link'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith('l3');

    // Me is the default. No label is sent as none, so the server falls back to the creation date.
    await expect(region.getByRole('radio', {
      name: 'Me'
    })).toBeChecked();
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      ...ME_REQUEST
    });

    // Re-queried each time: a submit renders a fresh form.
    const label = () => region.getByLabelText('Label (optional)');
    await expect(label()).toHaveAttribute('maxLength', '50');
    // Enter submits the form, like the button does.
    await userEvent.type(label(), '  Work laptop {Enter}');
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: 'Work laptop',
      ...ME_REQUEST
    });
    await expect(label()).toHaveValue('');

    // Partner: attending only, no marks, a suffixed calendar name — and the empty label prefilled.
    await userEvent.click(region.getByRole('radio', {
      name: 'Partner'
    }));
    await expect(label()).toHaveValue('Partner');
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: 'Partner',
      attendanceStates: ['ATTENDING'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Partner'
    });
    // The form starts over at Me.
    await expect(region.getByRole('radio', {
      name: 'Me'
    })).toBeChecked();

    // Switching back to Me takes the auto-filled label with it, so a Me link is not named Partner.
    await userEvent.click(region.getByRole('radio', {
      name: 'Partner'
    }));
    await expect(label()).toHaveValue('Partner');
    await userEvent.click(region.getByRole('radio', {
      name: 'Me'
    }));
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      ...ME_REQUEST
    });

    // A label the member typed is theirs: kept when Partner is picked, and when Me is picked again.
    await userEvent.type(label(), 'Sanne');
    await userEvent.click(region.getByRole('radio', {
      name: 'Partner'
    }));
    await expect(label()).toHaveValue('Sanne');
    await userEvent.click(region.getByRole('radio', {
      name: 'Me'
    }));
    await expect(label()).toHaveValue('Sanne');
    await userEvent.clear(label());

    // Any edit under Advanced makes the form Custom, and the request carries exactly the edit.
    await userEvent.click(region.getByRole('button', {
      name: 'Advanced'
    }));
    await expect(region.getByRole('button', {
      name: 'Advanced'
    })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(region.getByRole('button', {
      name: "Can't"
    }));
    await expect(region.getByRole('button', {
      name: "Can't"
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(region.getByRole('radio', {
      name: 'Custom'
    })).toBeChecked();
    const suffix = region.getByLabelText('Calendar name suffix (optional)');
    await expect(suffix).toHaveAttribute('maxLength', '30');
    await userEvent.type(suffix, 'Work');
    await expect(region.getByText("Your calendar app shows it as 'Setpoint VT · Work'.")).toBeInTheDocument();
    await userEvent.click(region.getByRole('switch', {
      name: 'Mark your answer on titles'
    }));
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      attendanceStates: ['ATTENDING', 'MAYBE', 'NOT_RESPONDED'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Work'
    });

    // Tapping a preset after an edit resets the options to it.
    await userEvent.click(region.getByRole('button', {
      name: 'Advanced'
    }));
    await userEvent.click(region.getByRole('button', {
      name: 'Maybe'
    }));
    await expect(region.getByRole('radio', {
      name: 'Custom'
    })).toBeChecked();
    await userEvent.click(region.getByRole('radio', {
      name: 'Me'
    }));
    await expect(region.getByRole('button', {
      name: 'Maybe'
    })).toHaveAttribute('aria-pressed', 'true');

    // Event types: every type until one is picked, then exactly the picked ones, in the team's order.
    // An archived type is not offered for a new link. Picking a type makes the link Custom.
    await expect(region.getByRole('button', {
      name: 'Advanced'
    })).toHaveAttribute('aria-expanded', 'true');
    await expect(region.getByRole('button', {
      name: 'All types'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region.queryByRole('button', {
      name: 'Beach'
    })).not.toBeInTheDocument();
    await userEvent.click(region.getByRole('button', {
      name: 'Match'
    }));
    await expect(region.getByRole('button', {
      name: 'All types'
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(region.getByRole('radio', {
      name: 'Custom'
    })).toBeChecked();
    // Deselecting the last one is every type again.
    await userEvent.click(region.getByRole('button', {
      name: 'Match'
    }));
    await expect(region.getByRole('button', {
      name: 'All types'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(region.getByRole('button', {
      name: 'Match'
    }));
    await userEvent.click(region.getByRole('button', {
      name: 'Training'
    }));
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      ...ME_REQUEST,
      eventTypeIds: [TRAINING.id, MATCH.id]
    });

    // Editing happens in the row, in the same form, starting from the link's own preset. Cancel
    // leaves the link alone.
    const partner = () => within(region.getByRole('listitem', {
      name: 'Partner'
    }));
    await userEvent.click(phone.getByRole('button', {
      name: 'Edit'
    }));
    await userEvent.type(phone.getByLabelText('Label (optional)'), ' 2');
    await userEvent.click(phone.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onUpdate).not.toHaveBeenCalled();
    await expect(phone.queryByLabelText('Label (optional)')).not.toBeInTheDocument();

    // One row open at a time.
    await userEvent.click(phone.getByRole('button', {
      name: 'Edit'
    }));
    await userEvent.click(partner().getByRole('button', {
      name: 'Edit'
    }));
    await expect(phone.queryByLabelText('Label (optional)')).not.toBeInTheDocument();
    await expect(partner().getByRole('radio', {
      name: 'Partner'
    })).toBeChecked();
    await expect(partner().getByLabelText('Label (optional)')).toHaveValue('Partner');
    await userEvent.clear(partner().getByLabelText('Label (optional)'));
    await userEvent.type(partner().getByLabelText('Label (optional)'), 'Sanne');
    await userEvent.click(partner().getByRole('button', {
      name: 'Advanced'
    }));
    await userEvent.click(partner().getByRole('button', {
      name: 'Match'
    }));
    await userEvent.click(partner().getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onUpdate).toHaveBeenCalledWith('l2', {
      label: 'Sanne',
      attendanceStates: ['ATTENDING'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Partner',
      eventTypeIds: [MATCH.id]
    }, expect.any(Function));
    // The row stays open until the container says the save landed, so a failed one keeps the edits.
    await expect(partner().getByRole('button', {
      name: 'Save'
    })).toBeInTheDocument();
    const onSaved: () => void = (args.onUpdate as ReturnType<typeof fn>).mock.calls[0][2];
    onSaved();
    await expect(await partner().findByRole('button', {
      name: 'Edit'
    })).toBeInTheDocument();

    // A failed save is reported in the row being edited, not under the create form.
    const failed = within(canvas.getByRole('region', {
      name: 'Save failed'
    }));
    const failedRow = within(failed.getByRole('listitem', {
      name: 'My phone'
    }));
    await expect(failedRow.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(failedRow.getByRole('button', {
      name: 'Edit'
    }));
    await expect(failedRow.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.');
    await expect(failed.getAllByRole('alert')).toHaveLength(1);

    // An earlier create or delete failure is not the edit's: a freshly opened row shows no error, and
    // the container is told the edit opened (and later closed) so it can clear the last update's.
    const earlier = within(canvas.getByRole('region', {
      name: 'Earlier failure, types unknown'
    }));
    const earlierRow = within(earlier.getByRole('listitem', {
      name: 'My phone'
    }));
    // Types not loaded yet: the link still reads as limited.
    await expect(earlierRow.getByText('1 event type')).toBeInTheDocument();
    const editSpy = args.onEditOpenOrClose as ReturnType<typeof fn>;
    editSpy.mockClear();
    await userEvent.click(earlierRow.getByRole('button', {
      name: 'Edit'
    }));
    await expect(editSpy).toHaveBeenCalledTimes(1);
    await expect(earlierRow.queryByRole('alert')).not.toBeInTheDocument();
    // With no type names to show, the link can still go back to every type.
    await expect(earlierRow.getByRole('button', {
      name: 'All types'
    })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(earlierRow.getByRole('button', {
      name: 'All types'
    }));
    await expect(earlierRow.getByRole('button', {
      name: 'All types'
    })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(earlierRow.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(editSpy).toHaveBeenCalledTimes(2);

    // An expired link is not edited: it serves nothing, so there is nothing to change.
    const expired = within(within(canvas.getByRole('region', {
      name: 'An expired link'
    })).getByRole('listitem', {
      name: 'Link from 2 jun 2025'
    }));
    await expect(expired.getByRole('button', {
      name: 'Delete'
    })).toBeInTheDocument();
    await expect(expired.queryByRole('button', {
      name: 'Edit'
    })).not.toBeInTheDocument();

    // The explainer opens on a click (a tap on a phone), not only on hover.
    await userEvent.click(region.getByRole('button', {
      name: 'About Me and Partner'
    }));
    await expect(await portal.findByText('everything the team schedules, with your answer marked.', {
      exact: false
    })).toBeInTheDocument();
    await expect(portal.getByText("only events you are attending, no marks, calendar named 'Setpoint VT · Partner'.", {
      exact: false
    })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(within(canvas.getByRole('region', {
      name: 'Error'
    })).getByRole('button', {
      name: 'Retry'
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...$.parameters?.docs?.source}}},qt=[`Data`,`Shells`,`Interactions`]})))()}Jt();export{Z as Data,$ as Interactions,Q as Shells,qt as __namedExportsOrder,Kt as default};