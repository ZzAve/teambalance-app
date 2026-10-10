import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n}from"./iframe-BcBKxVyV.js";import{t as r}from"./react-dom-CpoQyH3L.js";import{n as i,t as a}from"./utils-BTemNN_S.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{c as s,r as c}from"./event-fixtures-C1ds5yXh.js";import{n as l,t as ee}from"./plus-TTbyJDIT.js";import{n as u,t as d}from"./button-x4YBE8ly.js";import{n as f,t as te}from"./input-BP4gL8sg.js";import{n as p,t as ne}from"./label-CWLt1yOr.js";import{n as m}from"./wirespec-client-fbPPB8jQ.js";import{a as re,i as ie,n as ae,o as h,r as oe,t as se}from"./sheet-CAj6NX26.js";import{a as g,i as ce}from"./lineup-TDQLra9X.js";import{n as _,t as le}from"./SubstituteAvatar-CAiik72l.js";import{i as v,n as ue,t as de}from"./SubstitutesBlock-DnSsRtfM.js";function y(e){if(!e||typeof document>`u`)return;let t=document.head||document.getElementsByTagName(`head`)[0],n=document.createElement(`style`);n.type=`text/css`,t.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}var b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=t((()=>{b=e(n(),1),r(),Array(12).fill(0),x=1,S=100,C=e=>typeof e?.id==`number`||e?.id?.length>0?e.id:x++,w=class{constructor(){this.subscribe=e=>(this.subscribers.push(e),this.getActiveToasts().forEach(t=>e(t)),()=>{let t=this.subscribers.indexOf(e);this.subscribers.splice(t,1)}),this.publish=e=>{this.subscribers.forEach(t=>t(e))},this.addToast=e=>{this.publish(e),this.toasts=[...this.toasts,e],this.trimHistory()},this.trimHistory=()=>{let e=this.toasts.length-S;e<=0||(this.toasts=this.toasts.filter(t=>e>0&&this.dismissedToasts.has(t.id)?(this.dismissedToasts.delete(t.id),e--,!1):!0))},this.create=e=>{let{message:t,...n}=e,r=C(e),i=this.pendingDismissals.get(r);i!==void 0&&(cancelAnimationFrame(i),this.pendingDismissals.delete(r),this.dismissedToasts.delete(r));let a=this.dismissedToasts.has(r),o=e.dismissible===void 0||e.dismissible;return a&&(this.dismissedToasts.delete(r),this.toasts=this.toasts.filter(e=>e.id!==r)),!a&&this.toasts.find(e=>e.id===r)?this.toasts=this.toasts.map(n=>n.id===r?(this.publish({...n,...e,id:r,title:t}),{...n,...e,id:r,dismissible:o,title:t}):n):this.addToast({title:t,...n,dismissible:o,id:r}),r},this.dismiss=e=>{if(e==null)return this.getActiveToasts().forEach(e=>{this.dismissedToasts.add(e.id),this.subscribers.forEach(t=>t({id:e.id,dismiss:!0}))}),e;this.dismissedToasts.add(e);let t=this.pendingDismissals.get(e);return t!==void 0&&cancelAnimationFrame(t),this.pendingDismissals.set(e,requestAnimationFrame(()=>{this.pendingDismissals.delete(e),this.subscribers.forEach(t=>t({id:e,dismiss:!0}))})),e},this.message=(e,t)=>this.create({...t,message:e,type:void 0}),this.error=(e,t)=>this.create({...t,message:e,type:`error`}),this.success=(e,t)=>this.create({...t,type:`success`,message:e}),this.info=(e,t)=>this.create({...t,type:`info`,message:e}),this.warning=(e,t)=>this.create({...t,type:`warning`,message:e}),this.loading=(e,t)=>this.create({...t,type:`loading`,message:e}),this.promise=(e,t)=>{if(!t)return;let n;t.loading!==void 0&&(n=this.create({...t,promise:e,type:`loading`,message:t.loading,description:typeof t.description==`function`?void 0:t.description}));let r=Promise.resolve(e instanceof Function?e():e),i=n!==void 0,a,o=r.then(async e=>{if(a=[`resolve`,e],b.isValidElement(e))i=!1,this.create({id:n,type:`default`,message:e});else if(D(e)&&!e.ok){i=!1;let r=typeof t.error==`function`?await t.error(`HTTP error! status: ${e.status}`):t.error,a=typeof t.description==`function`?await t.description(`HTTP error! status: ${e.status}`):t.description,o=typeof r==`object`&&!b.isValidElement(r)?r:{message:r};this.create({id:n,type:`error`,description:a,...o})}else if(e instanceof Error){i=!1;let r=typeof t.error==`function`?await t.error(e):t.error,a=typeof t.description==`function`?await t.description(e):t.description,o=typeof r==`object`&&!b.isValidElement(r)?r:{message:r};this.create({id:n,type:`error`,description:a,...o})}else if(t.success!==void 0){i=!1;let r=typeof t.success==`function`?await t.success(e):t.success,a=typeof t.description==`function`?await t.description(e):t.description,o=typeof r==`object`&&!b.isValidElement(r)?r:{message:r};this.create({id:n,type:`success`,description:a,...o})}}).catch(async e=>{if(a=[`reject`,e],t.error!==void 0){i=!1;let r=typeof t.error==`function`?await t.error(e):t.error,a=typeof t.description==`function`?await t.description(e):t.description,o=typeof r==`object`&&!b.isValidElement(r)?r:{message:r};this.create({id:n,type:`error`,description:a,...o})}}).finally(()=>{i&&(this.dismiss(n),n=void 0),t.finally==null||t.finally.call(t)}),s=()=>new Promise((e,t)=>o.then(()=>a[0]===`reject`?t(a[1]):e(a[1])).catch(t));return typeof n!=`string`&&typeof n!=`number`?{unwrap:s}:Object.assign(n,{unwrap:s})},this.custom=(e,t)=>{let n=C(t);return this.create({...t,jsx:e(n),id:n,type:void 0}),n},this.getActiveToasts=()=>this.toasts.filter(e=>!this.dismissedToasts.has(e.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set,this.pendingDismissals=new Map}},T=new w,E=(e,t)=>T.message(e,t),D=e=>e&&typeof e==`object`&&`ok`in e&&typeof e.ok==`boolean`&&`status`in e&&typeof e.status==`number`,O=E,k=()=>T.toasts,A=()=>T.getActiveToasts(),Object.assign(O,{success:T.success,info:T.info,warning:T.warning,error:T.error,custom:T.custom,message:T.message,promise:T.promise,dismiss:T.dismiss,loading:T.loading},{getHistory:k,getToasts:A}),y(`[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--normal-text);background:var(--normal-bg);border:1px solid var(--normal-border);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{-webkit-user-select:none;user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}`)})))()}var M;function N(){return(N=t((()=>{j(),m(),M=class extends Error{constructor(e){super(e),this.name=`SubstituteError`}}})))()}function P(e,t){return{plays:e.filter(e=>e.position?.id===t),others:e.filter(e=>e.position?.id!==t)}}function F({open:e,eventTitle:t,position:n=null,positions:r,substitutes:i,isLoading:o=!1,isError:s=!1,onRetry:c,positionsError:l=!1,onRetryPositions:u,pending:f=!1,onEvent:p,onSetState:m,onCreate:h,onClose:g}){let[_,v]=(0,L.useState)(!1),[y,b]=(0,L.useState)(``),[x,S]=(0,L.useState)(null),[C,w]=(0,L.useState)(!1),[T,E]=(0,L.useState)(null),D=(0,L.useRef)(0),O=y.trim(),k=i.find(e=>e.name.toLowerCase()===O.toLowerCase()),A=k?`${k.name} is already on the list — find them above.`:T,j=e=>{let t=p.find(t=>t.substituteId===e.id)?.state;return(0,R.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,R.jsx)(le,{name:e.name}),(0,R.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,R.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,R.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,R.jsx)(`span`,{className:`flex shrink-0 items-center gap-1`,children:de.map(n=>(0,R.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:f,onClick:()=>m(e.id,n.value),className:a(ue,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value))})]},e.id)},N=()=>{D.current++,v(!1),b(``),E(null),w(!1)},P=()=>{N(),g()},F=async()=>{let e=++D.current;w(!0),E(null);try{await h(O,x),e===D.current&&N()}catch(t){if(e!==D.current)return;E(t instanceof M?t.message:`Couldn't add the substitute — please try again.`),w(!1)}};return(0,R.jsx)(se,{open:e,onOpenChange:e=>!e&&P(),children:(0,R.jsxs)(ae,{children:[(0,R.jsxs)(ie,{children:[(0,R.jsx)(re,{children:n?ce(n.label):`Call in substitutes`}),(0,R.jsx)(oe,{children:t})]}),i.length===0?s?(0,R.jsx)(I,{className:`mb-3`,message:`Couldn't load the list.`,onRetry:c}):(0,R.jsx)(`p`,{className:`mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground`,children:o?`Loading the list…`:`Nobody on the list yet.`}):n?(0,R.jsx)(fe,{position:n,substitutes:i,renderRow:j}):(0,R.jsx)(`div`,{className:z,children:i.map(j)}),_?(0,R.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,R.jsx)(ne,{htmlFor:`new-substitute-name`,children:`Name`}),(0,R.jsx)(te,{id:`new-substitute-name`,value:y,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>{b(e.target.value),E(null)},"aria-invalid":A!==null}),A&&(0,R.jsx)(`p`,{role:`alert`,className:`text-small text-red`,children:A}),(0,R.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,R.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,R.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...r,{id:null,label:`None`}].map(e=>(0,R.jsx)(`button`,{type:`button`,"aria-pressed":x===e.id,onClick:()=>S(e.id),className:a(`min-h-11 rounded-full border px-3 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,x===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),l&&(0,R.jsx)(I,{message:`Couldn't load the positions.`,onRetry:u}),(0,R.jsx)(d,{type:`button`,disabled:!O||k!==void 0||C,onClick:F,children:C?`Adding…`:`Add as asked`})]}):(0,R.jsxs)(`button`,{type:`button`,onClick:()=>{S(n?.id??null),v(!0)},className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,R.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,R.jsx)(ee,{size:16})}),(0,R.jsxs)(`span`,{children:[`New substitute`,(0,R.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,R.jsx)(d,{type:`button`,variant:`outline`,className:`mt-4`,onClick:P,children:`Done`})]})})}function I({message:e,onRetry:t,className:n}){return(0,R.jsxs)(`p`,{role:`alert`,className:a(`flex items-center justify-between gap-3 rounded-lg bg-red/10 px-3 py-2 text-small text-red`,n),children:[e,(0,R.jsx)(d,{type:`button`,variant:`outline`,size:`sm`,onClick:t,children:`Try again`})]})}function fe({position:e,substitutes:t,renderRow:n}){let{plays:r,others:i}=P(t,e.id),a=`Plays ${e.label}`;return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(`div`,{role:`group`,"aria-label":a,children:[(0,R.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:a}),(0,R.jsx)(`div`,{className:z,children:r.length===0?(0,R.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:`Nobody on the list plays this yet.`}):r.map(n)})]}),i.length>0&&(0,R.jsxs)(`div`,{role:`group`,"aria-label":`Others`,children:[(0,R.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:`Others`}),(0,R.jsx)(`div`,{className:z,children:i.map(n)})]})]})}var L,R,z;function B(){return(B=t((()=>{L=n(),l(),N(),u(),f(),p(),h(),i(),_(),g(),v(),R=o(),z=`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,F.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Asked / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
the person on the event as declined; taking them off the event is not offered here, only in their
Substitute sheet, so recording a "no" can never delete that they were asked.

Any Member may also add someone who is not on the list yet: a name and an optional Position, added
as Asked (Maybe), since the person has been asked and not yet answered. Prop-only; the writes live
in [SubstitutePicker].`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},position:{required:!1,tsType:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},description:`Opened from one Position's open spot: who plays it comes first, and a new one plays it too.`,defaultValue:{value:`null`,computed:!1}},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionRef`}],raw:`PositionRef[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},isError:{required:!1,tsType:{name:`boolean`},description:`The list could not be loaded: say so, with a retry, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},positionsError:{required:!1,tsType:{name:`boolean`},description:`The Positions could not be loaded: the form says so, with a retry, instead of offering only None.`,defaultValue:{value:`false`,computed:!1}},onRetryPositions:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => Promise<unknown>`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`Promise`,elements:[{name:`unknown`}],raw:`Promise<unknown>`}}},description:`Creates a Substitute and adds them to the event as Asked. Resolves once they are on the list; a
rejection keeps the form open with the name, and a [SubstituteError]'s message is shown as is.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var V,H,U,W,G,K,q,J,Y,X,Z,Q,$,pe;function me(){return(me=t((()=>{V=n(),N(),c(),B(),H=o(),{expect:U,fn:W,within:G}=__STORYBOOK_MODULE_TEST__,K=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],q={id:`pos-libero`,label:`Libero`},J=[{id:`sub-1`,name:`Jan de Vries`,position:q,shirtNumber:void 0},{id:`sub-2`,name:`Mila Jansen`,position:void 0,shirtNumber:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`},shirtNumber:void 0},{id:`sub-4`,name:`Pieter Smit`,position:{id:`pos-setter`,label:`Setter`},shirtNumber:void 0}],Y=[s(`sub-1`,`Jan de Vries`,{position:q}),s(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),s(`sub-4`,`Pieter Smit`,{state:`ABSENT`})],X={title:`features/call-in-substitutes/SubstitutePickerView`,component:F,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:K,substitutes:J,onEvent:Y,onSetState:W(),onCreate:W(),onClose:W(),onRetry:W(),onRetryPositions:W()}},Z={args:{position:q},play:async()=>{let e=G(await G(document.body).findByRole(`dialog`,{name:`Find a Libero`})),t=G(e.getByRole(`group`,{name:`Plays Libero`}));await U(t.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Jan de Vries`]);let n=G(e.getByRole(`group`,{name:`Others`}));await U(n.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Mila Jansen`,`Kees Bakker`,`Pieter Smit`]);let r=G(e.getByRole(`group`,{name:`Jan de Vries`}));await U(r.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await U(r.getByText(`Libero`)).toBeInTheDocument();let i=G(e.getByRole(`group`,{name:`Mila Jansen`}));await U(i.getByRole(`button`,{name:`Asked`})).toHaveAttribute(`aria-pressed`,`true`);let a=G(e.getByRole(`group`,{name:`Pieter Smit`}));await U(a.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`true`);let o=G(e.getByRole(`group`,{name:`Kees Bakker`}));await U(o.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await U(e.queryByRole(`button`,{name:/take off/i})).not.toBeInTheDocument()}},Q={args:{substitutes:[],onEvent:[],positions:[],positionsError:!0},render:function(e){let[t,n]=(0,V.useState)(!1);return(0,H.jsx)(F,{...e,isError:!t,isLoading:t,onRetry:()=>{e.onRetry?.(),n(!0)}})},play:async({userEvent:e,args:t})=>{let n=G(await G(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await U(n.getByRole(`alert`)).toHaveTextContent(`Couldn't load the list.`),await U(n.queryByText(`Nobody on the list yet.`)).not.toBeInTheDocument(),await U(n.queryByRole(`group`,{name:`Others`})).not.toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:`Try again`})),await U(t.onRetry).toHaveBeenCalled(),await U(await n.findByText(`Loading the list…`)).toBeInTheDocument(),await U(n.queryByText(`Nobody on the list yet.`)).not.toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await U(n.getByLabelText(`Name`)).toBeInTheDocument(),await U(n.getByRole(`button`,{name:`None`})).toHaveAttribute(`aria-pressed`,`true`),await U(n.queryByRole(`button`,{name:`Setter`})).not.toBeInTheDocument(),await U(n.getByRole(`alert`)).toHaveTextContent(`Couldn't load the positions.`),await e.click(n.getByRole(`button`,{name:`Try again`})),await U(t.onRetryPositions).toHaveBeenCalled(),await U(n.getByRole(`button`,{name:`Add as asked`})).toBeDisabled()}},$={args:{position:q,isError:!0},parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=G(await G(document.body).findByRole(`dialog`,{name:`Find a Libero`}));await U(n.getByRole(`group`,{name:`Plays Libero`})).toBeInTheDocument(),await U(n.queryByRole(`alert`)).not.toBeInTheDocument(),await e.click(G(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await U(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(G(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Asked`})),await U(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(G(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Can't`})),await U(t.onSetState).toHaveBeenCalledWith(`sub-2`,`ABSENT`);let r=G(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Asked`}),i=r.getBoundingClientRect(),a=(44-i.height)/2-1;for(let e of[i.top-a,i.bottom+a])await U(document.elementFromPoint(i.left+i.width/2,e)).toBe(r);await e.click(n.getByRole(`button`,{name:/New substitute/}));let o=n.getByRole(`button`,{name:`Add as asked`});await U(o).toBeDisabled(),await U(n.getByRole(`button`,{name:`Libero`})).toHaveAttribute(`aria-pressed`,`true`);for(let e of[`Setter`,`Libero`,`None`]){let t=n.getByRole(`button`,{name:e});t.scrollIntoView({block:`center`});let r=t.getBoundingClientRect();await U(r.height).toBeGreaterThanOrEqual(44);for(let e of[r.top+1,r.bottom-1])await U(document.elementFromPoint(r.left+r.width/2,e)).toBe(t)}await e.type(n.getByLabelText(`Name`),`Anouk de Boer`),await e.click(o),await U(t.onCreate).toHaveBeenCalledWith(`Anouk de Boer`,`pos-libero`),await U(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`None`})),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await U(t.onCreate).toHaveBeenCalledWith(`Sanne Vos`,null),await U(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),` kees BAKKER `),await U(n.getByRole(`alert`)).toHaveTextContent(`Kees Bakker is already on the list — find them above.`),await U(n.getByRole(`button`,{name:`Add as asked`})).toBeDisabled(),await e.type(n.getByLabelText(`Name`),`jr`),await U(n.queryByRole(`alert`)).not.toBeInTheDocument(),await U(t.onCreate).not.toHaveBeenCalledWith(U.stringMatching(/kees/i),U.anything()),t.onCreate.mockRejectedValueOnce(new M(`Kees Bakker jr is already on the list.`)),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await U(t.onCreate).toHaveBeenCalledWith(`kees BAKKER jr`,`pos-libero`),await U(await n.findByRole(`alert`)).toHaveTextContent(`Kees Bakker jr is already on the list.`),await U(n.getByLabelText(`Name`)).toHaveValue(` kees BAKKER jr`),t.onCreate.mockRejectedValueOnce(Error(`offline`)),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await U(await n.findByRole(`alert`)).toHaveTextContent(`Couldn't add the substitute — please try again.`),await U(n.getByLabelText(`Name`)).toHaveValue(` kees BAKKER jr`),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await U(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Half`),await e.click(n.getByRole(`button`,{name:`Done`})),await U(t.onClose).toHaveBeenCalled(),await U(n.queryByLabelText(`Name`)).not.toBeInTheDocument();let s=()=>{};t.onCreate.mockReturnValueOnce(new Promise(e=>s=e)),await e.click(n.getByRole(`button`,{name:/New substitute/})),await U(n.getByLabelText(`Name`)).toHaveValue(``),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`Add as asked`})),await U(await n.findByRole(`button`,{name:`Adding…`})).toBeDisabled(),await U(n.getByLabelText(`Name`)).toHaveValue(`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`Done`})),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Bram Visser`),await U(n.getByRole(`button`,{name:`Add as asked`})).toBeEnabled(),s(),await new Promise(e=>setTimeout(e,0)),await U(n.getByLabelText(`Name`)).toHaveValue(`Bram Visser`)}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO
  },
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Find a Libero'
    }));
    // Who plays the Position comes first, the rest after (#359 decision 9).
    const plays = within(sheet.getByRole('group', {
      name: 'Plays Libero'
    }));
    await expect(plays.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Jan de Vries']);
    const others = within(sheet.getByRole('group', {
      name: 'Others'
    }));
    await expect(others.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Mila Jansen', 'Kees Bakker', 'Pieter Smit']);
    const jan = within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    }));
    await expect(jan.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(jan.getByText('Libero')).toBeInTheDocument();
    const mila = within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    }));
    await expect(mila.getByRole('button', {
      name: 'Asked'
    })).toHaveAttribute('aria-pressed', 'true');
    // Asked and said no: kept on the event as declined, not deleted.
    const pieter = within(sheet.getByRole('group', {
      name: 'Pieter Smit'
    }));
    await expect(pieter.getByRole('button', {
      name: "Can't"
    })).toHaveAttribute('aria-pressed', 'true');
    // Not on this event yet: nothing pressed.
    const kees = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    }));
    await expect(kees.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // Deleting someone from the event is not a picker action; it lives in their sheet on the page.
    await expect(sheet.queryByRole('button', {
      name: /take off/i
    })).not.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    substitutes: [],
    onEvent: [],
    positions: [],
    positionsError: true
  },
  render: function Render(args) {
    const [retried, setRetried] = useState(false);
    return <SubstitutePickerView {...args} isError={!retried} isLoading={retried} onRetry={() => {
      args.onRetry?.();
      setRetried(true);
    }} />;
  },
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the list.");
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument();
    await expect(sheet.queryByRole('group', {
      name: 'Others'
    })).not.toBeInTheDocument();
    await userEvent.click(sheet.getByRole('button', {
      name: 'Try again'
    }));
    await expect(args.onRetry).toHaveBeenCalled();
    await expect(await sheet.findByText('Loading the list…')).toBeInTheDocument();
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument();

    // Opened without a Position, so none is chosen yet; the Positions failed to load, so None is the
    // only chip, next to its own Try again.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await expect(sheet.getByLabelText('Name')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: 'None'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(sheet.queryByRole('button', {
      name: 'Setter'
    })).not.toBeInTheDocument();
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the positions.");
    await userEvent.click(sheet.getByRole('button', {
      name: 'Try again'
    }));
    await expect(args.onRetryPositions).toHaveBeenCalled();
    await expect(sheet.getByRole('button', {
      name: 'Add as asked'
    })).toBeDisabled();
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO,
    isError: true
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Find a Libero'
    }));
    await expect(sheet.getByRole('group', {
      name: 'Plays Libero'
    })).toBeInTheDocument();
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument();

    // Several people can be called in before Done: one confirmed, one only asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ATTENDING');
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Asked'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE');
    // Mila answered no: recorded as declined, so the team still sees she was asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    })).getByRole('button', {
      name: "Can't"
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ABSENT');

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Asked'
    });
    const box = pill.getBoundingClientRect();
    const reach = (44 - box.height) / 2 - 1;
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill);
    }

    // Someone not on the list yet: a name and an optional Position, added as Asked. Opened for
    // Libero, so Libero is already chosen.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    const add = sheet.getByRole('button', {
      name: 'Add as asked'
    });
    await expect(add).toBeDisabled();
    await expect(sheet.getByRole('button', {
      name: 'Libero'
    })).toHaveAttribute('aria-pressed', 'true');
    // A Position chip is a full 44px target itself: the chip is the box, no band around it (#388).
    for (const label of ['Setter', 'Libero', 'None']) {
      const chip = sheet.getByRole('button', {
        name: label
      });
      chip.scrollIntoView({
        block: 'center'
      });
      const box = chip.getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(44);
      for (const y of [box.top + 1, box.bottom - 1]) {
        await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(chip);
      }
    }
    await userEvent.type(sheet.getByLabelText('Name'), 'Anouk de Boer');
    await userEvent.click(add);
    await expect(args.onCreate).toHaveBeenCalledWith('Anouk de Boer', 'pos-libero');
    // Added: the form closes and the picker stays open for the next one.
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // The form starts from the Position again; None is a choice.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos');
    await userEvent.click(sheet.getByRole('button', {
      name: 'None'
    }));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('Sanne Vos', null);
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // Someone already on the list, in another case: caught before any request, with a pointer to
    // where they are (#389). The hint goes once the name differs.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), ' kees BAKKER ');
    await expect(sheet.getByRole('alert')).toHaveTextContent('Kees Bakker is already on the list — find them above.');
    await expect(sheet.getByRole('button', {
      name: 'Add as asked'
    })).toBeDisabled();
    await userEvent.type(sheet.getByLabelText('Name'), 'jr');
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument();
    await expect(args.onCreate).not.toHaveBeenCalledWith(expect.stringMatching(/kees/i), expect.anything());

    // The request is refused (someone else added them meanwhile), then fails outright: each time the
    // form stays open with the name, and says why under the field (#389).
    args.onCreate.mockRejectedValueOnce(new SubstituteError('Kees Bakker jr is already on the list.'));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('kees BAKKER jr', 'pos-libero');
    await expect(await sheet.findByRole('alert')).toHaveTextContent('Kees Bakker jr is already on the list.');
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr');
    args.onCreate.mockRejectedValueOnce(new Error('offline'));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(await sheet.findByRole('alert')).toHaveTextContent("Couldn't add the substitute — please try again.");
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr');
    // Third time lucky: the same name goes through and the form closes.
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // Closing drops a half-typed name, so the next open starts fresh.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Half');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(sheet.queryByLabelText('Name')).not.toBeInTheDocument();

    // While the request is out, the button says so and holds, and the name stays put.
    let settle = () => {};
    args.onCreate.mockReturnValueOnce(new Promise<void>(resolve => settle = resolve));
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await expect(sheet.getByLabelText('Name')).toHaveValue('');
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as asked'
    }));
    await expect(await sheet.findByRole('button', {
      name: 'Adding…'
    })).toBeDisabled();
    await expect(sheet.getByLabelText('Name')).toHaveValue('Sanne Vos');

    // Closed and reopened while that request is still out: the fresh form is not held by it, and
    // its settling later leaves the fresh form alone.
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Bram Visser');
    await expect(sheet.getByRole('button', {
      name: 'Add as asked'
    })).toBeEnabled();
    settle();
    await new Promise(resolve => setTimeout(resolve, 0));
    await expect(sheet.getByLabelText('Name')).toHaveValue('Bram Visser');
  }
}`,...$.parameters?.docs?.source}}},pe=[`Data`,`Shells`,`Interactions`]})))()}me();export{Z as Data,$ as Interactions,Q as Shells,pe as __namedExportsOrder,X as default};