import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-mmd4IF3P.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{a as o,n as s,o as c,r as l,t as u}from"./team-routes-DEjpHvGt.js";import{n as d,t as f}from"./createLucideIcon-DOrFRgUI.js";import{n as p,t as m}from"./calendar-D1eaF3M9.js";import{n as h,t as g}from"./users-BzMtqrcc.js";var _,v;function y(){return(y=e((()=>{d(),_=[[`path`,{d:`M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z`,key:`1piglc`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M2 8v1a2 2 0 0 0 2 2h1`,key:`1env43`}]],v=f(`piggy-bank`,_)})))()}var b,x;function S(){return(S=e((()=>{d(),b=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]],x=f(`user`,b)})))()}function C(e){let t=e=>t=>t.replace(/\/$/,``)===e,n=e=>t=>t===e||t.startsWith(`${e}/`);return[{icon:m,label:`Events`,to:e.events,isActive:t(e.events)},{icon:g,label:`Team`,to:e.team,isActive:n(e.team)},{icon:v,label:`Money`,to:e.money,isActive:n(e.money)},{icon:x,label:`Profile`,to:e.profile,isActive:n(e.profile)}]}function w(){let e=c({select:e=>e.location.pathname}),t=C(s(l(e)));return(0,T.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,style:{paddingBottom:`env(safe-area-inset-bottom)`},children:(0,T.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:t.map(({icon:t,label:n,to:i,isActive:a})=>{let o=a(e);return(0,T.jsxs)(r,{to:i,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,o?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":o?`page`:void 0,children:[(0,T.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,T.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${o?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,T.jsx)(t,{size:22,strokeWidth:o?2.5:1.75,className:`relative z-10`})]}),(0,T.jsx)(`span`,{className:o?`font-medium`:``,children:n})]},n)})})})}var T;function E(){return(E=e((()=>{t(),o(),p(),h(),y(),S(),u(),T=a(),w.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})))()}async function D(e){await O(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await O(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await O(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`),await O(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/t/setpoint-vt/profile`),await O(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await O(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await O(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`pointer-events-none`),await O(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`)}var O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{i(),E(),{expect:O}=__STORYBOOK_MODULE_TEST__,k={title:`shared/ui/BottomNav`,component:w,decorators:[n]},A={parameters:{router:{initialEntries:[`/t/setpoint-vt`]}},play:async({canvas:e})=>{await D(e),await O(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await O(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},j={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}},play:async({canvas:e})=>{await D(e),await O(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await O(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},M={parameters:{router:{initialEntries:[`/t/setpoint-vt/money`]}},play:async({canvas:e})=>{await D(e),await O(e.getByRole(`link`,{name:`Money`})).toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`),await O(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},N={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]}},play:async({canvas:e})=>{await O(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},P={parameters:{router:{initialEntries:[`/t/setpoint-vt/profile`]}},play:async({canvas:e})=>{await D(e),await O(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await O(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await O(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`)}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt']
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/team']
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('aria-current', 'page');
    // Events must not stay active on a nested route — an exact-match seam, not a prefix match.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/money']
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/team/settings']
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/profile']
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
  }
}`,...P.parameters?.docs?.source}}},F=[`EventsActive`,`TeamActive`,`MoneyActive`,`TeamSettingsActive`,`ProfileActive`]})))()}I();export{A as EventsActive,M as MoneyActive,P as ProfileActive,j as TeamActive,N as TeamSettingsActive,F as __namedExportsOrder,k as default};