import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-C1cAu_y2.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-DvkV4uQN.js";import{n as a,t as o}from"./switch-DFgYNqWb.js";import{n as s,t as c}from"./use-escape-to-close-CGR5QbYc.js";var l,u;function d(){return(d=e((()=>{r(),l=[[`rect`,{width:`7`,height:`7`,x:`3`,y:`3`,rx:`1`,key:`1g98yp`}],[`rect`,{width:`7`,height:`7`,x:`3`,y:`14`,rx:`1`,key:`1bb6yr`}],[`path`,{d:`M14 4h7`,key:`3xa0d5`}],[`path`,{d:`M14 9h7`,key:`1icrd9`}],[`path`,{d:`M14 15h7`,key:`1mj8o2`}],[`path`,{d:`M14 20h7`,key:`11slyb`}]],u=i(`layout-list`,l)})))()}function f({defaultExpanded:e,onDefaultExpandedChange:t}){let[n,r]=(0,p.useState)(!1);return s(n,()=>r(!1)),(0,m.jsxs)(`div`,{className:`relative`,children:[(0,m.jsx)(`button`,{"aria-label":`View options`,"aria-expanded":n,"aria-haspopup":`dialog`,onClick:()=>r(e=>!e),className:`flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:(0,m.jsx)(u,{size:16})}),n&&(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/20`,"aria-hidden":`true`,onClick:()=>r(!1)}),(0,m.jsx)(`div`,{role:`dialog`,"aria-label":`View options`,className:`card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-lg border border-border/60 bg-card p-3.5`,children:(0,m.jsxs)(`div`,{className:`flex items-center justify-between gap-2.5`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`div`,{className:`text-small font-semibold`,children:`Keep panels open`}),(0,m.jsx)(`div`,{className:`mt-0.5 text-caption text-muted-foreground`,children:e?`On — every card starts open`:`Off — tap to open a card`})]}),(0,m.jsx)(o,{checked:e,onCheckedChange:t,"aria-label":`Keep panels open`})]})})]})]})}var p,m;function h(){return(h=e((()=>{p=t(),d(),a(),c(),m=n(),f.__docgenInfo={description:`The events page's view control: an icon button beside \`Filters\` that opens a small popover holding
the panel preference — whether a card's roster panel starts open (ADR-0030 §6).

It held two settings until the lineup panel landed. ADR-0030 §5's pips-or-people choice went with
the either/or it selected: the panel is both halves at once now, so there is nothing to pick.

**Why it is here rather than inside the panel**, which is where §5 first put its sibling: the
setting is one global choice, and a control drawn once per open card reads as a per-card one
however the state is actually held. It also charged every open panel a row of chrome for a setting
a member touches once. The page header is where the scope is legible — beside the other page-level
control, at no vertical cost — and the list behind the popover still re-renders live.

**Its own trigger, not a section inside \`Filters\`**, for the reason §3 draws the line at all: a
filter is "where was I" and this is "how do I like this". One popover holding both would be the
taxonomy the ADR spent a decision separating.

No dot on the trigger, unlike \`Filters\`. A dot there warns that the list may be hiding events; a
non-default view hides nothing — the panel plainly shows what it shows.

Prop-only apart from the popover's own open state: the preferences live in \`event-panel-store\`.`,methods:[],displayName:`PanelViewMenu`,props:{defaultExpanded:{required:!0,tsType:{name:`boolean`},description:``},onDefaultExpandedChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(defaultExpanded: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`defaultExpanded`}],return:{name:`void`}}},description:``}}}})))()}export{h as n,f as t};