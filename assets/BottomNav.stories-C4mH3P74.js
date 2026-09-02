import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-JT0rtnVn.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{i as o,n as s,o as c,r as l,s as u,t as d}from"./team-routes-Bz1Ll_8B.js";import{n as f,t as p}from"./modes-Bzyminl_.js";import{n as m,t as h}from"./createLucideIcon-M6J-sC_A.js";import{n as g,t as _}from"./calendar-CbTHPQxs.js";import{n as v,t as y}from"./users-CYwxKRJZ.js";var b,x;function S(){return(S=e((()=>{m(),b=[[`path`,{d:`M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z`,key:`1piglc`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M2 8v1a2 2 0 0 0 2 2h1`,key:`1env43`}]],x=h(`piggy-bank`,b)})))()}var C,w;function T(){return(T=e((()=>{m(),C=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]],w=h(`user`,C)})))()}function E(e){let t=e=>t=>t.replace(/\/$/,``)===e,n=e=>t=>t===e||t.startsWith(`${e}/`);return[{icon:_,label:`Events`,to:e.events,isActive:t(e.events)},{icon:y,label:`Team`,to:e.team,isActive:n(e.team)},{icon:x,label:`Money`,to:e.money,isActive:n(e.money)},{icon:w,label:`Profile`,to:d,isActive:n(d)}]}function D(){let e=u({select:e=>e.location.pathname}),t=E(l(o(e)));return(0,O.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,style:{paddingBottom:`env(safe-area-inset-bottom)`},children:(0,O.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:t.map(({icon:t,label:n,to:i,isActive:a})=>{let o=a(e);return(0,O.jsxs)(r,{to:i,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,o?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":o?`page`:void 0,children:[(0,O.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,O.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${o?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,O.jsx)(t,{size:22,strokeWidth:o?2.5:1.75,className:`relative z-10`})]}),(0,O.jsx)(`span`,{className:o?`font-medium`:``,children:n})]},n)})})})}var O;function k(){return(k=e((()=>{t(),c(),g(),v(),S(),T(),s(),O=a(),D.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})))()}async function A(e){await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await j(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await j(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`pointer-events-none`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`)}var j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{i(),f(),k(),{expect:j}=__STORYBOOK_MODULE_TEST__,M={title:`shared/ui/BottomNav`,component:D,decorators:[n],parameters:{chromatic:{modes:{light:p.light,dark:p.dark}}}},N={parameters:{router:{initialEntries:[`/t/setpoint-vt`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},P={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},F={parameters:{router:{initialEntries:[`/t/setpoint-vt/money`]}},play:async({canvas:e})=>{await A(e),await j(e.getByRole(`link`,{name:`Money`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},I={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await j(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},L={parameters:{router:{initialEntries:[`/account`]}},play:async({canvas:e})=>{await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await j(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await j(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/`)}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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