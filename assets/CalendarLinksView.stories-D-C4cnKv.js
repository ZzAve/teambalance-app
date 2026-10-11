import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n}from"./iframe-CYCobZcx.js";import{n as r,t as i}from"./utils-BTemNN_S.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./stack-DUXBP51x.js";import{n as c,t as l}from"./createLucideIcon-Vj5Mj1Ac.js";import{n as u,t as d}from"./chevron-down-BcCMxqOZ.js";import{a as f,i as p,n as m,r as h}from"./dist-B-_XL1Gx.js";import{n as ee,t as g}from"./button-D3-L6dP2.js";import{n as _,t as v}from"./input-4t6kcCr9.js";import{r as te,t as y}from"./dist-BCa4agiB.js";import{n as ne,t as re}from"./label-BReChcjM.js";import{A as b,C as x,D as S,O as ie,S as ae,b as oe,c as se,d as ce,f as le,h as ue,k as C,l as de,m as fe,n as pe,o as me,p as he,s as ge,t as _e,u as ve,v as ye,x as be,y as xe}from"./Combination-D6zR6_Kw.js";import{a as Se,i as Ce,n as we,r as Te,t as Ee}from"./dist-Cl1VZh2L.js";import{n as De,t as Oe}from"./ConfirmDialog-BQtcx0bD.js";import{n as ke,t as Ae}from"./chip-CRvIZomc.js";import{n as je,t as Me}from"./switch-C4KeThMR.js";import{n as Ne,t as Pe}from"./FormError-B3b4LG7B.js";import{n as Fe,t as Ie}from"./QueryErrorState-R-4JiKun.js";var Le,Re;function ze(){return(ze=t((()=>{c(),Le=[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]],Re=l(`info`,Le)})))()}function Be(e){return e?`open`:`closed`}var w,T,Ve,E,D,O,He,k,Ue,A,We,Ge,Ke,qe,Je,Ye,Xe,j,Ze,Qe,$e,et,M,tt,nt,rt,it;function at(){return(at=t((()=>{w=e(n(),1),b(),p(),ie(),x(),oe(),xe(),fe(),Se(),he(),ce(),te(),h(),se(),ge(),pe(),T=a(),Ve=Object.defineProperty,E=(e,t)=>Ve(e,`name`,{value:t,configurable:!0}),D=`Popover`,[O,He]=S(D,[Ce]),k=Ce(),[Ue,A]=O(D),We=E(e=>{let{__scopePopover:t,children:n,open:r,defaultOpen:i,onOpenChange:a,modal:o=!1}=e,s=k(t),c=w.useRef(null),[l,u]=w.useState(!1),[d,f]=de({prop:r,defaultProp:i??!1,onChange:a,caller:D});return(0,T.jsx)(Te,{...s,children:(0,T.jsx)(Ue,{scope:t,contentId:ue(),triggerRef:c,open:d,onOpenChange:f,onOpenToggle:w.useCallback(()=>f(e=>!e),[f]),hasCustomAnchor:l,onCustomAnchorAdd:w.useCallback(()=>u(!0),[]),onCustomAnchorRemove:w.useCallback(()=>u(!1),[]),modal:o,children:n})})},`Popover`),Ge=`PopoverTrigger`,Ke=w.forwardRef(E(function(e,t){let{__scopePopover:n,...r}=e,i=A(Ge,n),a=k(n),o=f(t,i.triggerRef),s=(0,T.jsx)(y.button,{type:`button`,"aria-haspopup":`dialog`,"aria-expanded":i.open,"aria-controls":i.open?i.contentId:void 0,"data-state":Be(i.open),...r,ref:o,onClick:C(e.onClick,i.onOpenToggle)});return i.hasCustomAnchor?s:(0,T.jsx)(Ee,{asChild:!0,...a,children:s})},`PopoverTrigger`)),qe=`PopoverPortal`,[Je,Ye]=O(qe,{forceMount:void 0}),Xe=E(e=>{let{__scopePopover:t,forceMount:n,children:r,container:i}=e,a=A(qe,t);return(0,T.jsx)(Je,{scope:t,forceMount:n,children:(0,T.jsx)(ve,{present:n||a.open,children:(0,T.jsx)(le,{asChild:!0,container:i,children:r})})})},`PopoverPortal`),j=`PopoverContent`,Ze=w.forwardRef(E(function(e,t){let n=Ye(j,e.__scopePopover),{forceMount:r=n.forceMount,...i}=e,a=A(j,e.__scopePopover);return(0,T.jsx)(ve,{present:r||a.open,children:a.modal?(0,T.jsx)($e,{...i,ref:t}):(0,T.jsx)(et,{...i,ref:t})})},`PopoverContent`)),Qe=m(`PopoverContent.RemoveScroll`),$e=w.forwardRef(E(function(e,t){let n=A(j,e.__scopePopover),r=w.useRef(null),i=f(t,r),a=w.useRef(!1);return w.useEffect(()=>{let e=r.current;if(e)return me(e)},[]),(0,T.jsx)(_e,{as:Qe,allowPinchZoom:!0,children:(0,T.jsx)(M,{...e,ref:i,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:C(e.onCloseAutoFocus,e=>{e.preventDefault(),a.current||n.triggerRef.current?.focus()}),onPointerDownOutside:C(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=t.button===0&&t.ctrlKey===!0,r=t.button===2||n;a.current=r},{checkForDefaultPrevented:!1}),onFocusOutside:C(e.onFocusOutside,e=>e.preventDefault(),{checkForDefaultPrevented:!1})})})},`PopoverContentModal`)),et=w.forwardRef(E(function(e,t){let n=A(j,e.__scopePopover),r=w.useRef(!1),i=w.useRef(!1);return(0,T.jsx)(M,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(r.current||n.triggerRef.current?.focus(),t.preventDefault()),r.current=!1,i.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(r.current=!0,t.detail.originalEvent.type===`pointerdown`&&(i.current=!0));let a=t.target;n.triggerRef.current?.contains(a)&&t.preventDefault(),t.detail.originalEvent.type===`focusin`&&i.current&&t.preventDefault()}})},`PopoverContentNonModal`)),M=w.forwardRef(E(function(e,t){let{__scopePopover:n,trapFocus:r,onOpenAutoFocus:i,onCloseAutoFocus:a,disableOutsidePointerEvents:o,onEscapeKeyDown:s,onPointerDownOutside:c,onFocusOutside:l,onInteractOutside:u,...d}=e,f=A(j,n),p=k(n);return be(),(0,T.jsx)(ye,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:i,onUnmountAutoFocus:a,children:(0,T.jsx)(ae,{asChild:!0,disableOutsidePointerEvents:o,onInteractOutside:u,onEscapeKeyDown:s,onPointerDownOutside:c,onFocusOutside:l,onDismiss:()=>f.onOpenChange(!1),deferPointerDownOutside:!0,children:(0,T.jsx)(we,{"data-state":Be(f.open),role:`dialog`,id:f.contentId,...p,...d,ref:t,style:{...d.style,"--radix-popover-content-transform-origin":`var(--radix-popper-transform-origin)`,"--radix-popover-content-available-width":`var(--radix-popper-available-width)`,"--radix-popover-content-available-height":`var(--radix-popper-available-height)`,"--radix-popover-trigger-width":`var(--radix-popper-anchor-width)`,"--radix-popover-trigger-height":`var(--radix-popper-anchor-height)`}})})})},`PopoverContentImpl`)),E(Be,`getState`),tt=We,nt=Ke,rt=Xe,it=Ze})))()}function ot({className:e,align:t=`center`,sideOffset:n=4,...r}){return(0,N.jsx)(rt,{children:(0,N.jsx)(it,{"data-slot":`popover-content`,align:t,sideOffset:n,className:i(`z-50 w-72 rounded-md border border-border bg-popover p-3 text-small text-popover-foreground shadow-md outline-none`,e),...r})})}var N,st,ct;function lt(){return(lt=t((()=>{at(),r(),N=a(),st=tt,ct=nt,ot.__docgenInfo={description:``,methods:[],displayName:`PopoverContent`,props:{align:{defaultValue:{value:`'center'`,computed:!1},required:!1},sideOffset:{defaultValue:{value:`4`,computed:!1},required:!1}}}})))()}function ut(e){return e.replace(/^https?:\/\//,`webcal://`)}function dt(e){return`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(ut(e))}`}function ft(e){return e.label??`Link from ${pt(e.createdAt)}`}function pt(e){return new Date(e).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`})}function mt({attendanceStates:e,showAttendancePrefix:t}){let n=new Set(e);return t&&P.every(e=>n.has(e))?`me`:!t&&n.size===1&&n.has(`ATTENDING`)?`partner`:`custom`}var P,F,I;function L(){return(L=t((()=>{P=[`ATTENDING`,`MAYBE`,`ABSENT`,`NOT_RESPONDED`],F={ATTENDING:`Going`,MAYBE:`Maybe`,ABSENT:`Can't`,NOT_RESPONDED:`Not responded`},I={me:{attendanceStates:P,showAttendancePrefix:!0,calendarNameSuffix:void 0},partner:{attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`}}})))()}function ht(e,t){let n=[!P.every(t=>e.attendanceStates.includes(t))&&`${P.filter(t=>e.attendanceStates.includes(t)).map(e=>F[e]).join(`, `)} only`,!e.showAttendancePrefix&&`no ✓/✗ marks`,e.calendarNameSuffix&&`calendar: ${t} · ${e.calendarNameSuffix}`].filter(Boolean);return n.length>0?n.join(` · `):void 0}function gt(){return(gt=t((()=>{L()})))()}function R({teamName:e,links:t=[],isLoading:n,isError:r,isSaving:i,actionError:a,copiedId:o,copyFailedId:s,onGenerate:c,onDelete:l,onCopy:u,onRetry:d}){let[f,p]=(0,z.useState)(``),[m,h]=(0,z.useState)(I.me),[ee,_]=(0,z.useState)(!1),[te,y]=(0,z.useState)(!1),ne=ee?`custom`:mt(m),[b,x]=(0,z.useState)(null),S=t.length>=V;return(0,B.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Subscribe to your team's events once and your phone's calendar stays in sync. Changes can take up to a day to appear on Google Calendar.`}),n&&(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),r&&(0,B.jsx)(Ie,{title:`Couldn't load your calendar links`,description:`Check your connection and try again.`,onRetry:d}),!n&&!r&&(0,B.jsxs)(B.Fragment,{children:[t.length===0?(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No calendar links yet.`}):(0,B.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:t.map(t=>(0,B.jsx)(yt,{link:t,teamName:e,copied:o===t.id,copyFailed:s===t.id,isSaving:i,onCopy:u,onRequestDelete:x},t.id))}),(0,B.jsxs)(`form`,{className:`flex flex-col gap-4`,onSubmit:e=>{e.preventDefault(),c({label:f.trim()||void 0,attendanceStates:P.filter(e=>m.attendanceStates.includes(e)),showAttendancePrefix:m.showAttendancePrefix,calendarNameSuffix:m.calendarNameSuffix?.trim()||void 0}),p(``),h(I.me),_(!1),y(!1)},children:[(0,B.jsx)(_t,{value:ne,teamName:e,disabled:S,onChange:e=>{if(e===`custom`){_(!0),y(!0);return}h(I[e]),_(!1),e===`partner`&&f.trim()===``&&p(H),e===`me`&&f===H&&p(``)}}),(0,B.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,B.jsx)(re,{htmlFor:`calendar-link-label`,children:`Label (optional)`}),(0,B.jsxs)(`div`,{className:`flex gap-2`,children:[(0,B.jsx)(v,{id:`calendar-link-label`,value:f,maxLength:bt,placeholder:`e.g. My phone`,disabled:S,onChange:e=>p(e.target.value)}),(0,B.jsx)(g,{type:`submit`,disabled:S||i,children:`Generate link`})]})]}),(0,B.jsx)(vt,{open:te,onOpenChange:y,options:m,teamName:e,disabled:S,onChange:e=>{h(e),_(!0)}}),S&&(0,B.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[`You have `,V,` links, the maximum. Delete one to generate a new link.`]}),a&&(0,B.jsx)(Pe,{children:`Something went wrong. Please try again.`})]}),(0,B.jsx)(Oe,{open:b!==null,title:`Delete calendar link?`,description:`Every calendar subscribed with this link stops updating.`,confirmLabel:`Delete link`,onConfirm:()=>{b&&l(b.id),x(null)},onCancel:()=>x(null)})]})]})}function _t({value:e,teamName:t,disabled:n,onChange:r}){let i=(0,z.useId)(),a=(0,z.useId)();return(0,B.jsxs)(`div`,{children:[(0,B.jsxs)(`div`,{className:`flex items-center gap-1`,children:[(0,B.jsx)(`h3`,{id:i,className:`text-small font-semibold text-muted-foreground`,children:`Who is this calendar for?`}),(0,B.jsxs)(st,{children:[(0,B.jsx)(ct,{asChild:!0,children:(0,B.jsx)(`button`,{type:`button`,"aria-label":`About Me and Partner`,className:`inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground`,children:(0,B.jsx)(Re,{size:16,"aria-hidden":`true`})})}),(0,B.jsxs)(ot,{className:`flex flex-col gap-2`,children:[(0,B.jsxs)(`p`,{children:[(0,B.jsx)(`strong`,{children:`Me:`}),` everything the team schedules, with your answer marked.`]}),(0,B.jsxs)(`p`,{children:[(0,B.jsx)(`strong`,{children:`Partner:`}),` only events you are attending, no marks, calendar named '`,t,` · Partner'.`]})]})]})]}),(0,B.jsx)(`div`,{role:`radiogroup`,"aria-labelledby":i,className:`mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-card p-1`,children:St.map(({value:t,label:i})=>{let o=e===t;return(0,B.jsxs)(`label`,{className:`cursor-pointer`,children:[(0,B.jsx)(`input`,{type:`radio`,name:a,value:t,checked:o,disabled:n,onChange:()=>r(t),className:`peer sr-only`}),(0,B.jsx)(`span`,{className:[`flex min-h-11 items-center justify-center rounded-lg text-caption font-semibold transition-colors`,`peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card`,o?`bg-blue/10 text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),children:i})]},t)})})]})}function vt({open:e,onOpenChange:t,options:n,teamName:r,disabled:i,onChange:a}){let o=(0,z.useId)(),s=(0,z.useId)(),c=e=>{let t=n.attendanceStates.includes(e);t&&n.attendanceStates.length===1||a({...n,attendanceStates:t?n.attendanceStates.filter(t=>t!==e):[...n.attendanceStates,e]})};return(0,B.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,B.jsxs)(`button`,{type:`button`,"aria-expanded":e,"aria-controls":o,onClick:()=>t(!e),className:`flex items-center gap-1 self-start text-small font-semibold text-muted-foreground hover:text-foreground`,children:[`Advanced`,(0,B.jsx)(d,{size:16,"aria-hidden":`true`,className:e?`rotate-180 transition-transform`:`transition-transform`})]}),e&&(0,B.jsxs)(`div`,{id:o,className:`flex flex-col gap-4 rounded-md border border-border p-3`,children:[(0,B.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,B.jsx)(`p`,{id:s,className:`text-small font-medium`,children:`Include events you answered`}),(0,B.jsx)(`div`,{role:`group`,"aria-labelledby":s,className:`flex flex-wrap gap-2`,children:P.map(e=>(0,B.jsx)(Ae,{pressed:n.attendanceStates.includes(e),disabled:i,onToggle:()=>c(e),activeClassName:`border-blue bg-blue/10 text-blue`,inactiveClassName:`border-border text-muted-foreground`,children:F[e]},e))})]}),(0,B.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,B.jsx)(`span`,{className:`text-small font-medium`,children:`Mark your answer (✓ ? ✗) on titles`}),(0,B.jsx)(Me,{checked:n.showAttendancePrefix,disabled:i,onCheckedChange:e=>a({...n,showAttendancePrefix:e}),"aria-label":`Mark your answer on titles`})]}),(0,B.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,B.jsx)(re,{htmlFor:`${o}-suffix`,children:`Calendar name suffix (optional)`}),(0,B.jsx)(v,{id:`${o}-suffix`,value:n.calendarNameSuffix??``,maxLength:xt,placeholder:`e.g. Partner`,disabled:i,onChange:e=>a({...n,calendarNameSuffix:e.target.value||void 0})}),(0,B.jsxs)(`p`,{className:`text-caption text-muted-foreground`,children:[`Your calendar app shows it as '`,r,n.calendarNameSuffix?.trim()?` · ${n.calendarNameSuffix.trim()}`:``,`'.`]})]})]})]})}function yt({link:e,teamName:t,copied:n,copyFailed:r,isSaving:i,onCopy:a,onRequestDelete:o}){let s=ft(e),c=ht(e,t);return(0,B.jsxs)(`li`,{"aria-label":s,className:`flex flex-col gap-3 p-3`,children:[(0,B.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,B.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:s,children:s}),e.expired&&(0,B.jsx)(`span`,{className:`shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red`,children:`Expired`})]}),(0,B.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[e.expired?`Expired`:`Expires`,` `,pt(e.expiresAt)]}),c&&(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:c}),(0,B.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[e.url?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(g,{asChild:!0,size:`sm`,variant:`outline`,children:(0,B.jsx)(`a`,{href:ut(e.url),children:`Open in Calendar`})}),(0,B.jsx)(g,{asChild:!0,size:`sm`,variant:`outline`,children:(0,B.jsx)(`a`,{href:dt(e.url),target:`_blank`,rel:`noopener noreferrer`,children:`Add to Google Calendar`})}),(0,B.jsx)(g,{size:`sm`,variant:`outline`,onClick:()=>a(e),children:n?`Copied!`:`Copy link`})]}):(0,B.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This link can no longer be shown.`}),(0,B.jsx)(g,{size:`sm`,variant:`ghost`,className:`text-red`,disabled:i,onClick:()=>o(e),children:`Delete`})]}),r&&e.url&&(0,B.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,B.jsx)(Pe,{children:`Couldn't copy automatically. Copy the link below.`}),(0,B.jsx)(v,{readOnly:!0,"aria-label":`Calendar link URL for ${s}`,value:e.url,onFocus:e=>e.currentTarget.select()})]})]})}var z,B,V,bt,H,xt,St;function Ct(){return(Ct=t((()=>{z=n(),u(),ze(),ee(),ke(),_(),ne(),lt(),je(),De(),Ne(),Fe(),gt(),L(),B=a(),V=3,bt=50,H=`Partner`,xt=30,St=[{value:`me`,label:`Me`},{value:`partner`,label:`Partner`},{value:`custom`,label:`Custom`}],R.__docgenInfo={description:`The member's calendar links for this team: a short explainer, the list with its per-link actions,
and the generate form. Prop-only; the query, the mutations, the clipboard write and the copied
flag live in the CalendarLinks container (ADR-0017). Owns only the create form (label, preset and
options) and the delete-confirm target.`,methods:[],displayName:`CalendarLinksView`,props:{teamName:{required:!0,tsType:{name:`string`},description:`The Active Team's name, which a link's calendar is named after.`},links:{required:!1,tsType:{name:`Array`,elements:[{name:`CalendarLink`}],raw:`CalendarLink[]`},description:`The member's links in this team, newest first, as the server returned them.`,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:`A create or delete is in flight.`},actionError:{required:!1,tsType:{name:`boolean`},description:`The last create or delete failed.`},copiedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose URL was just copied, so its button can say so.`},copyFailedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose clipboard write the browser refused, so its URL can be copied by hand.`},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(request: CalendarLinkRequest) => void`,signature:{arguments:[{type:{name:`CalendarLinkRequest`},name:`request`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(link: CalendarLink) => void`,signature:{arguments:[{type:{name:`CalendarLink`},name:`link`}],return:{name:`void`}}},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var U,W,G,K,q,J,Y,wt,Tt,X,Et,Z,Q,$,Dt;function Ot(){return(Ot=t((()=>{o(),Ct(),U=a(),{expect:W,fn:G,within:K}=__STORYBOOK_MODULE_TEST__,q=`https://api.teambalance.nl/api/calendar/setpoint-vt`,J=[`ATTENDING`,`MAYBE`,`ABSENT`,`NOT_RESPONDED`],Y={id:`l3`,label:`My phone`,createdAt:`2026-09-01T10:00:00Z`,expiresAt:`2027-09-01T10:00:00Z`,expired:!1,url:`${q}/token-phone.ics`,attendanceStates:J,showAttendancePrefix:!0,calendarNameSuffix:void 0},wt={id:`l2`,label:`Partner`,createdAt:`2026-03-14T10:00:00Z`,expiresAt:`2027-03-14T10:00:00Z`,expired:!1,url:`${q}/token-partner.ics`,attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`},Tt=[Y,wt,{id:`l1`,label:void 0,createdAt:`2025-06-02T10:00:00Z`,expiresAt:`2026-06-02T10:00:00Z`,expired:!0,url:`${q}/token-custom.ics`,attendanceStates:[`ATTENDING`,`MAYBE`],showAttendancePrefix:!0,calendarNameSuffix:void 0}],X={attendanceStates:J,showAttendancePrefix:!0,calendarNameSuffix:void 0},Et={title:`features/calendar-links/CalendarLinksView`,component:R,args:{teamName:`Setpoint VT`,links:Tt,onGenerate:G(),onDelete:G(),onCopy:G(),onRetry:G()}},Z={play:async({canvas:e})=>{let t=t=>K(e.getByRole(`listitem`,{name:t}));await W(t(`My phone`).getByText(`Expires 1 sep 2027`)).toBeInTheDocument(),await W(t(`Link from 2 jun 2025`).getByText(`Expired 2 jun 2026`)).toBeInTheDocument(),await W(t(`Link from 2 jun 2025`).getByText(`Expired`,{exact:!0})).toBeInTheDocument(),await W(t(`My phone`).queryByText(`Expired`)).not.toBeInTheDocument(),await W(t(`My phone`).queryByText(/only|marks|calendar:/)).not.toBeInTheDocument(),await W(t(`Partner`).getByText(`Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner`)).toBeInTheDocument(),await W(t(`Link from 2 jun 2025`).getByText(`Going, Maybe only`)).toBeInTheDocument(),await W(t(`My phone`).getByRole(`link`,{name:`Open in Calendar`})).toHaveAttribute(`href`,`webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics`);let n=t(`My phone`).getByRole(`link`,{name:`Add to Google Calendar`});await W(n).toHaveAttribute(`href`,`https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics`),await W(n).toHaveAttribute(`target`,`_blank`),await W(t(`Link from 2 jun 2025`).getByRole(`button`,{name:`Delete`})).toBeEnabled(),await W(e.getByRole(`button`,{name:`Generate link`})).toBeDisabled(),await W(e.getByText(/You have 3 links, the maximum/)).toBeInTheDocument()}},Q={render:e=>(0,U.jsx)(s,{items:{Loading:(0,U.jsx)(R,{...e,isLoading:!0}),Error:(0,U.jsx)(R,{...e,isError:!0}),Empty:(0,U.jsx)(R,{...e,links:[]}),"Copy refused":(0,U.jsx)(R,{...e,links:[Y],copyFailedId:`l3`})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>K(e.getByRole(`region`,{name:t}));await W(n(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await W(n(`Loading`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await W(n(`Error`).getByRole(`alert`)).toHaveTextContent(`Couldn't load your calendar links`),await W(n(`Error`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await W(n(`Empty`).getByText(`No calendar links yet.`)).toBeInTheDocument(),await W(n(`Empty`).getByRole(`button`,{name:`Generate link`})).toBeEnabled();let r=n(`Copy refused`);await W(r.getByRole(`alert`)).toHaveTextContent(`Couldn't copy automatically. Copy the link below.`),await W(r.getByLabelText(`Calendar link URL for My phone`)).toHaveValue(Y.url),await W(r.getByRole(`button`,{name:`Copy link`})).toBeInTheDocument(),await t.click(n(`Empty`).getByRole(`button`,{name:`About Me and Partner`})),await W(await K(document.body).findByText(/only events you are attending/)).toBeVisible()}},$={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,U.jsx)(s,{items:{"Below the cap":(0,U.jsx)(R,{...e,links:[Y,wt],copiedId:`l2`}),Error:(0,U.jsx)(R,{...e,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=K(e.getByRole(`region`,{name:`Below the cap`})),i=K(document.body);await W(K(r.getByRole(`listitem`,{name:`Partner`})).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument();let a=K(r.getByRole(`listitem`,{name:`My phone`}));await t.click(a.getByRole(`button`,{name:`Copy link`})),await W(n.onCopy).toHaveBeenCalledWith(Y),await t.click(a.getByRole(`button`,{name:`Delete`})),await W(await i.findByText(`Every calendar subscribed with this link stops updating.`)).toBeInTheDocument(),await W(i.getByRole(`heading`,{name:`Delete calendar link?`})).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await W(n.onDelete).not.toHaveBeenCalled(),await t.click(a.getByRole(`button`,{name:`Delete`})),await t.click(await i.findByRole(`button`,{name:`Delete link`})),await W(n.onDelete).toHaveBeenCalledWith(`l3`),await W(r.getByRole(`radio`,{name:`Me`})).toBeChecked(),await t.click(r.getByRole(`button`,{name:`Generate link`})),await W(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,...X});let o=r.getByLabelText(`Label (optional)`);await W(o).toHaveAttribute(`maxLength`,`50`),await t.type(o,`  Work laptop {Enter}`),await W(n.onGenerate).toHaveBeenLastCalledWith({label:`Work laptop`,...X}),await W(o).toHaveValue(``),await t.click(r.getByRole(`radio`,{name:`Partner`})),await W(o).toHaveValue(`Partner`),await t.click(r.getByRole(`button`,{name:`Generate link`})),await W(n.onGenerate).toHaveBeenLastCalledWith({label:`Partner`,attendanceStates:[`ATTENDING`],showAttendancePrefix:!1,calendarNameSuffix:`Partner`}),await W(r.getByRole(`radio`,{name:`Me`})).toBeChecked(),await t.click(r.getByRole(`radio`,{name:`Partner`})),await W(o).toHaveValue(`Partner`),await t.click(r.getByRole(`radio`,{name:`Me`})),await t.click(r.getByRole(`button`,{name:`Generate link`})),await W(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,...X}),await t.type(o,`Sanne`),await t.click(r.getByRole(`radio`,{name:`Partner`})),await W(o).toHaveValue(`Sanne`),await t.click(r.getByRole(`radio`,{name:`Me`})),await W(o).toHaveValue(`Sanne`),await t.clear(o),await t.click(r.getByRole(`button`,{name:`Advanced`})),await W(r.getByRole(`button`,{name:`Advanced`})).toHaveAttribute(`aria-expanded`,`true`),await t.click(r.getByRole(`button`,{name:`Can't`})),await W(r.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`false`),await W(r.getByRole(`radio`,{name:`Custom`})).toBeChecked();let s=r.getByLabelText(`Calendar name suffix (optional)`);await W(s).toHaveAttribute(`maxLength`,`30`),await t.type(s,`Work`),await W(r.getByText(`Your calendar app shows it as 'Setpoint VT · Work'.`)).toBeInTheDocument(),await t.click(r.getByRole(`switch`,{name:`Mark your answer on titles`})),await t.click(r.getByRole(`button`,{name:`Generate link`})),await W(n.onGenerate).toHaveBeenLastCalledWith({label:void 0,attendanceStates:[`ATTENDING`,`MAYBE`,`NOT_RESPONDED`],showAttendancePrefix:!1,calendarNameSuffix:`Work`}),await t.click(r.getByRole(`button`,{name:`Advanced`})),await t.click(r.getByRole(`button`,{name:`Maybe`})),await W(r.getByRole(`radio`,{name:`Custom`})).toBeChecked(),await t.click(r.getByRole(`radio`,{name:`Me`})),await W(r.getByRole(`button`,{name:`Maybe`})).toHaveAttribute(`aria-pressed`,`true`),await t.click(r.getByRole(`button`,{name:`About Me and Partner`})),await W(await i.findByText(`everything the team schedules, with your answer marked.`,{exact:!1})).toBeInTheDocument(),await W(i.getByText(`only events you are attending, no marks, calendar named 'Setpoint VT · Partner'.`,{exact:!1})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await t.click(K(e.getByRole(`region`,{name:`Error`})).getByRole(`button`,{name:`Retry`})),await W(n.onRetry).toHaveBeenCalled()}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
    await expect(row('Link from 2 jun 2025').getByText('Going, Maybe only')).toBeInTheDocument();

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
    const label = region.getByLabelText('Label (optional)');
    await expect(label).toHaveAttribute('maxLength', '50');
    // Enter submits the form, like the button does.
    await userEvent.type(label, '  Work laptop {Enter}');
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: 'Work laptop',
      ...ME_REQUEST
    });
    await expect(label).toHaveValue('');

    // Partner: attending only, no marks, a suffixed calendar name — and the empty label prefilled.
    await userEvent.click(region.getByRole('radio', {
      name: 'Partner'
    }));
    await expect(label).toHaveValue('Partner');
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
    await expect(label).toHaveValue('Partner');
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
    await userEvent.type(label, 'Sanne');
    await userEvent.click(region.getByRole('radio', {
      name: 'Partner'
    }));
    await expect(label).toHaveValue('Sanne');
    await userEvent.click(region.getByRole('radio', {
      name: 'Me'
    }));
    await expect(label).toHaveValue('Sanne');
    await userEvent.clear(label);

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
}`,...$.parameters?.docs?.source}}},Dt=[`Data`,`Shells`,`Interactions`]})))()}Ot();export{Z as Data,$ as Interactions,Q as Shells,Dt as __namedExportsOrder,Et as default};