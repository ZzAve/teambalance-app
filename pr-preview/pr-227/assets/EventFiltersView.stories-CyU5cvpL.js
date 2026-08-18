import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CDjj3s1N.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{i as r,n as i}from"./event-fixtures-BTSzdoeq.js";import{n as a,t as o}from"./createLucideIcon-D9hlFG1z.js";var s,c;function l(){return(l=e((()=>{a(),s=[[`path`,{d:`M10 5H3`,key:`1qgfaw`}],[`path`,{d:`M12 19H3`,key:`yhmn1j`}],[`path`,{d:`M14 3v4`,key:`1sua03`}],[`path`,{d:`M16 17v4`,key:`1q0r14`}],[`path`,{d:`M21 12h-9`,key:`1o4lsq`}],[`path`,{d:`M21 19h-5`,key:`1rlt1p`}],[`path`,{d:`M21 5h-7`,key:`1oszz2`}],[`path`,{d:`M8 10v4`,key:`tgpxqk`}],[`path`,{d:`M8 12H3`,key:`a7s4jb`}]],c=o(`sliders-horizontal`,s)})))()}function u({eventTypes:e,activeTypeIds:t,showPast:n,onToggleType:r,onToggleShowPast:i}){let[a,o]=(0,d.useState)(!1),s=n||t.size<e.length;return(0,d.useEffect)(()=>{if(!a)return;let e=e=>{e.key===`Escape`&&o(!1)};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[a]),(0,f.jsxs)(`div`,{className:`relative`,children:[(0,f.jsxs)(`button`,{"aria-label":`Filters`,"aria-expanded":a,"aria-haspopup":`dialog`,onClick:()=>o(e=>!e),className:`relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground`,children:[(0,f.jsx)(c,{size:16}),s&&(0,f.jsx)(`span`,{className:`absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-blue`})]}),a&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/20`,"aria-hidden":`true`,onClick:()=>o(!1)}),(0,f.jsxs)(`div`,{role:`dialog`,"aria-label":`Filters`,className:`card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-2xl border border-border/60 bg-card p-3.5`,children:[e.length>0&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`h3`,{className:`mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground`,children:`Event types`}),(0,f.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.map(e=>{let n=t.has(e.id),i=e.color??`#888`;return(0,f.jsx)(`button`,{"aria-pressed":n,onClick:()=>r(e.id),style:n?{backgroundColor:i,borderColor:i,color:`#fff`}:{borderColor:i+`66`,color:i},className:`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all`,children:e.name},e.id)})}),(0,f.jsx)(`div`,{className:`-mx-3.5 my-3.5 h-px bg-border/60`})]}),(0,f.jsxs)(`div`,{className:`flex items-center justify-between gap-2.5`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`div`,{className:`text-[13.5px] font-semibold`,children:`Show past events`}),(0,f.jsx)(`div`,{className:`mt-0.5 text-[11.5px] text-muted-foreground`,children:n?`On — past events included`:`Off — upcoming only`})]}),(0,f.jsx)(`button`,{role:`switch`,"aria-checked":n,"aria-label":`Show past events`,onClick:()=>i(!n),className:[`relative h-6 w-11 shrink-0 rounded-full transition-colors`,n?`bg-green`:`bg-muted-foreground/30`].join(` `),children:(0,f.jsx)(`span`,{className:[`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200`,n?`left-[22px]`:`left-0.5`].join(` `)})})]})]})]})]})}var d,f;function p(){return(p=e((()=>{d=t(),l(),f=n(),u.__docgenInfo={description:`The events page's single filter control: an icon button that opens a popover holding the
event-type chips and the "Show past events" switch. It replaces the old Upcoming/Past segmented
tab bar — past events are a filter, not a mode, and the page no longer spends a band of chrome on
a control that only flipped which way the same list grew.

Prop-only apart from the popover's own open/closed state, which is local view state: the selected
types and the show-past flag live in the route so they can drive \`useEvents\` and the hero.`,methods:[],displayName:`EventFiltersView`,props:{eventTypes:{required:!0,tsType:{name:`Array`,elements:[{name:`EventTypeItem`}],raw:`EventTypeItem[]`},description:``},activeTypeIds:{required:!0,tsType:{name:`Set`,elements:[{name:`string`}],raw:`Set<string>`},description:`Ids of the types currently shown. Every id active = no type filter in effect.`},showPast:{required:!0,tsType:{name:`boolean`},description:``},onToggleType:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},onToggleShowPast:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(showPast: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`showPast`}],return:{name:`void`}}},description:``}}}})))()}var m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{i(),p(),{expect:m,fn:h}=__STORYBOOK_MODULE_TEST__,g=[r({id:`et-1`,name:`Training`,color:`#249E6C`}),r({id:`et-2`,name:`Match`,color:`#225C9C`}),r({id:`et-3`,name:`Tournament`,color:`#7B5EA7`})],_=new Set(g.map(e=>e.id)),v={title:`features/filter-event-types/EventFiltersView`,component:u,args:{eventTypes:g,activeTypeIds:_,showPast:!1,onToggleType:h(),onToggleShowPast:h()}},y={play:async({canvas:e})=>{await m(e.getByRole(`button`,{name:`Filters`})).toHaveAttribute(`aria-expanded`,`false`),await m(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},b={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await m(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await m(e.getByRole(`button`,{name:`Training`})).toBeInTheDocument(),await m(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`false`),await m(e.getByText(`Off — upcoming only`)).toBeInTheDocument()}},x={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`button`,{name:`Match`})),await m(n.onToggleType).toHaveBeenCalledWith(`et-2`)}},S={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await m(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},C={args:{showPast:!0},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await m(e.getByRole(`switch`,{name:`Show past events`})).toHaveAttribute(`aria-checked`,`true`),await m(e.getByText(`On — past events included`)).toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await m(n.onToggleShowPast).toHaveBeenCalledWith(!1)}},w={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await m(e.getByRole(`dialog`,{name:`Filters`})).toBeInTheDocument(),await t.keyboard(`{Escape}`),await m(e.queryByRole(`dialog`)).not.toBeInTheDocument()}},T={args:{eventTypes:[],activeTypeIds:new Set},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await m(e.queryByText(`Event types`)).not.toBeInTheDocument(),await t.click(e.getByRole(`switch`,{name:`Show past events`})),await m(n.onToggleShowPast).toHaveBeenCalledWith(!0)}},E={args:{activeTypeIds:new Set([`et-2`])},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Filters`})),await m(e.getByRole(`button`,{name:`Match`})).toHaveAttribute(`aria-pressed`,`true`),await m(e.getByRole(`button`,{name:`Training`})).toHaveAttribute(`aria-pressed`,`false`)}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Filters'
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D=[`Closed`,`Open`,`TogglesType`,`TogglesShowPast`,`ShowingPast`,`ClosesOnEscape`,`WithoutEventTypes`,`FilteredToOneType`]})))()}O();export{y as Closed,w as ClosesOnEscape,E as FilteredToOneType,b as Open,C as ShowingPast,S as TogglesShowPast,x as TogglesType,T as WithoutEventTypes,D as __namedExportsOrder,v as default};