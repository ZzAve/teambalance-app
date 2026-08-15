import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DGFr5TML.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-BPgIp4uM.js";var a,o;function s(){return(s=e((()=>{r(),a=[[`path`,{d:`M10 5H3`,key:`1qgfaw`}],[`path`,{d:`M12 19H3`,key:`yhmn1j`}],[`path`,{d:`M14 3v4`,key:`1sua03`}],[`path`,{d:`M16 17v4`,key:`1q0r14`}],[`path`,{d:`M21 12h-9`,key:`1o4lsq`}],[`path`,{d:`M21 19h-5`,key:`1rlt1p`}],[`path`,{d:`M21 5h-7`,key:`1oszz2`}],[`path`,{d:`M8 10v4`,key:`tgpxqk`}],[`path`,{d:`M8 12H3`,key:`a7s4jb`}]],o=i(`sliders-horizontal`,a)})))()}function c({eventTypes:e,activeTypeIds:t,showPast:n,onToggleType:r,onToggleShowPast:i}){let[a,s]=(0,l.useState)(!1),c=n||t.size<e.length;return(0,l.useEffect)(()=>{if(!a)return;let e=e=>{e.key===`Escape`&&s(!1)};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[a]),(0,u.jsxs)(`div`,{className:`relative`,children:[(0,u.jsxs)(`button`,{"aria-label":`Filters`,"aria-expanded":a,"aria-haspopup":`dialog`,onClick:()=>s(e=>!e),className:`relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:[(0,u.jsx)(o,{size:16}),c&&(0,u.jsx)(`span`,{className:`absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-blue`})]}),a&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/20`,"aria-hidden":`true`,onClick:()=>s(!1)}),(0,u.jsxs)(`div`,{role:`dialog`,"aria-label":`Filters`,className:`card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-2xl border border-border/60 bg-card p-3.5`,children:[e.length>0&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`h3`,{className:`mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Event types`}),(0,u.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.map(e=>{let n=t.has(e.id),i=e.color??`#888`;return(0,u.jsx)(`button`,{"aria-pressed":n,onClick:()=>r(e.id),style:n?{backgroundColor:i,borderColor:i,color:`#fff`}:{borderColor:i+`66`,color:i},className:`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all`,children:e.name},e.id)})}),(0,u.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`})]}),(0,u.jsxs)(`div`,{className:`flex items-center justify-between gap-2.5`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`text-[13.5px] font-semibold`,children:`Show past events`}),(0,u.jsx)(`div`,{className:`mt-0.5 text-[11.5px] text-muted-foreground`,children:n?`On — past events included`:`Off — upcoming only`})]}),(0,u.jsx)(`button`,{role:`switch`,"aria-checked":n,"aria-label":`Show past events`,onClick:()=>i(!n),className:[`relative h-6 w-11 shrink-0 rounded-full transition-colors`,n?`bg-green`:`bg-muted-foreground/30`].join(` `),children:(0,u.jsx)(`span`,{className:[`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200`,n?`left-[22px]`:`left-0.5`].join(` `)})})]})]})]})]})}var l,u;function d(){return(d=e((()=>{l=t(),s(),u=n(),c.__docgenInfo={description:`The events page's single filter control: an icon button that opens a popover holding the
event-type chips and the "Show past events" switch. It replaces the old Upcoming/Past segmented
tab bar — past events are a filter, not a mode, and the page no longer spends a band of chrome on
a control that only flipped which way the same list grew.

Prop-only apart from the popover's own open/closed state, which is local view state: the selected
types and the show-past flag live in the route so they can drive \`useEvents\` and the hero.`,methods:[],displayName:`EventFiltersView`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},activeTypeIds:{required:!0,tsType:{name:`Set`,elements:[{name:`string`}],raw:`Set<string>`},description:`Ids of the types currently shown. Every id active = no type filter in effect.`},showPast:{required:!0,tsType:{name:`boolean`},description:``},onToggleType:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},onToggleShowPast:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(showPast: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`showPast`}],return:{name:`void`}}},description:``}}}})))()}var f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{d(),{expect:f,fn:p}=__STORYBOOK_MODULE_TEST__,m=[{id:`et-1`,name:`Training`,color:`#249E6C`},{id:`et-2`,name:`Match`,color:`#225C9C`},{id:`et-3`,name:`Tournament`,color:`#7B5EA7`}],h=new Set(m.map(e=>e.id)),g={title:`features/filter-event-types/EventFiltersView`,component:c,args:{eventTypes:m,activeTypeIds:h,showPast:!1,onToggleType:p(),onToggleShowPast:p()}},_={play:async({canvas:e})=>{await f(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await f(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},v={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await f(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await f(e.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await f(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await f(e.getByText(`Off — upcoming only`)).toBeInTheDocument()}},y={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Match`})),await f(n.onToggleType).toHaveBeenCalledWith(`et-2`)}},b={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await f(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},x={args:{showPast:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await f(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await f(e.getByText(`On — past events included`)).toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await f(n.onToggleShowPast).toHaveBeenCalledWith(!1)}},S={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await f(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await f(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},C={args:{eventTypes:[],activeTypeIds:new Set},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await f(e.queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await f(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},w={args:{activeTypeIds:new Set([`et-2`])},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await f(e.getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await f(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`)}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Filters'
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('dialog', {
      name: 'Filters'
    })).toBeInTheDocument();
    // Both halves of the popover: the type chips and the past-events switch.
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'false');
    await expect(canvas.getByText('Off — upcoming only')).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Match'
    }));
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2');
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true);
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    showPast: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('switch', {
      name: 'Show past events'
    })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText('On — past events included')).toBeInTheDocument();
    // Switching back off is the same callback with the opposite value.
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(false);
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('dialog', {
      name: 'Filters'
    })).toBeInTheDocument();
    // Focus is still on the trigger, which is a sibling of the panel — Escape is caught on the
    // document, so it has to work from there.
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: [],
    activeTypeIds: new Set<string>()
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.queryByText('Event types')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show past events'
    }));
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true);
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    activeTypeIds: new Set(['et-2'])
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Filters'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Match'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', {
      name: 'Training'
    })).toHaveAttribute('aria-pressed', 'false');
  }
}`,...w.parameters?.docs?.source}}},T=[`Closed`,`Open`,`TogglesType`,`TogglesShowPast`,`ShowingPast`,`ClosesOnEscape`,`WithoutEventTypes`,`FilteredToOneType`]})))()}E();export{_ as Closed,S as ClosesOnEscape,w as FilteredToOneType,v as Open,x as ShowingPast,b as TogglesShowPast,y as TogglesType,C as WithoutEventTypes,T as __namedExportsOrder,g as default};