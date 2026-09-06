import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./createLucideIcon-D3jGRTpG.js";import{n as r,t as i}from"./calendar-B5M0MXqp.js";import{n as a,t as o}from"./users-DhWVqUZy.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{i as c,n as l,r as u,t as d}from"./router-decorator-EgKV_jGV.js";import{i as f,n as p,o as m,r as h,s as g,t as _}from"./team-routes-BwUqbr2R.js";import{n as v,t as y}from"./modes-Bzyminl_.js";var b,x;function S(){return(S=e((()=>{t(),b=[[`path`,{d:`M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z`,key:`1piglc`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M2 8v1a2 2 0 0 0 2 2h1`,key:`1env43`}]],x=n(`piggy-bank`,b)})))()}var C,w;function T(){return(T=e((()=>{t(),C=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]],w=n(`user`,C)})))()}function E(e){let t=e=>t=>t.replace(/\/$/,``)===e,n=e=>t=>t===e||t.startsWith(`${e}/`);return[{icon:i,label:`Events`,to:e.events,isActive:t(e.events)},{icon:o,label:`Team`,to:e.team,isActive:n(e.team)},{icon:x,label:`Money`,to:e.money,isActive:n(e.money)},{icon:w,label:`Profile`,to:_,isActive:n(_)}]}function D(){let e=g({select:e=>e.location.pathname}),t=E(h(f(e)));return(0,O.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,style:{paddingBottom:`env(safe-area-inset-bottom)`},children:(0,O.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:t.map(({icon:t,label:n,to:r,isActive:i})=>{let a=i(e);return(0,O.jsxs)(u,{to:r,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,a?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":a?`page`:void 0,children:[(0,O.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,O.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${a?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,O.jsx)(t,{size:22,strokeWidth:a?2.5:1.75,className:`relative z-10`})]}),(0,O.jsx)(`span`,{className:a?`font-medium`:``,children:n})]},n)})})})}var O;function k(){return(k=e((()=>{c(),m(),r(),a(),S(),T(),p(),O=s(),D.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})))()}async function A(e){await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await j(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await j(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`)}var j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{d(),v(),k(),{expect:j}=__STORYBOOK_MODULE_TEST__,M={title:`shared/ui/BottomNav`,component:D,decorators:[l],parameters:{chromatic:{modes:{light:y.light,dark:y.dark}}}},N={parameters:{router:{initialEntries:[`/t/setpoint-vt`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},P={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},F={parameters:{router:{initialEntries:[`/t/setpoint-vt/money`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Money`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},I={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await j(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},L={parameters:{router:{initialEntries:[`/account`]}},play:async({canvas:e})=>{await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/`)}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of TeamActive — a nested route that keeps the Team tab active renders the same
  // picture (ADR-0027 §2).
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/team/settings']
    },
    chromatic: {
      disableSnapshot: true
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/account']
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('href', '/account');
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
    // With no slug in scope the non-Profile tabs point at the dispatcher.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('href', '/');
  }
}`,...L.parameters?.docs?.source}}},R=[`EventsActive`,`TeamActive`,`MoneyActive`,`TeamSettingsActive`,`ProfileActive`]})))()}z();export{N as EventsActive,F as MoneyActive,L as ProfileActive,P as TeamActive,I as TeamSettingsActive,R as __namedExportsOrder,M as default};