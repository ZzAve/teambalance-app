import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-CzDymFKp.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{a as o,n as s,o as c,r as l,t as u}from"./team-routes-D-CcB4D7.js";import{n as d,t as f}from"./createLucideIcon-CcSVMMKz.js";import{n as p,t as m}from"./calendar-CnYr6W82.js";import{n as h,t as g}from"./users-Cem_l_en.js";var _,v;function y(){return(y=e((()=>{d(),_=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]],v=f(`user`,_)})))()}function b(e){let t=e=>t=>t.replace(/\/$/,``)===e,n=e=>t=>t===e||t.startsWith(`${e}/`);return[{icon:m,label:`Events`,to:e.events,isActive:t(e.events)},{icon:g,label:`Team`,to:e.team,isActive:n(e.team)},{icon:v,label:`Profile`,to:e.profile,isActive:n(e.profile)}]}function x(){let e=c({select:e=>e.location.pathname}),t=b(s(l(e)));return(0,S.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,style:{paddingBottom:`env(safe-area-inset-bottom)`},children:(0,S.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:t.map(({icon:t,label:n,to:i,isActive:a})=>{let o=a(e);return(0,S.jsxs)(r,{to:i,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,o?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":o?`page`:void 0,children:[(0,S.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,S.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${o?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,S.jsx)(t,{size:22,strokeWidth:o?2.5:1.75,className:`relative z-10`})]}),(0,S.jsx)(`span`,{className:o?`font-medium`:``,children:n})]},n)})})})}var S;function C(){return(C=e((()=>{t(),o(),p(),h(),y(),u(),S=a(),x.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})))()}async function w(e){await T(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await T(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await T(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/t/setpoint-vt/profile`),await T(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await T(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await T(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`),await T(e.queryByRole(`link`,{name:`Money Pool`})).not.toBeInTheDocument()}var T,E,D,O,k,A,j;function M(){return(M=e((()=>{i(),C(),{expect:T}=__STORYBOOK_MODULE_TEST__,E={title:`shared/ui/BottomNav`,component:x,decorators:[n]},D={parameters:{router:{initialEntries:[`/t/setpoint-vt`]}},play:async({canvas:e})=>{await w(e),await T(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await T(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},O={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]}},play:async({canvas:e})=>{await w(e),await T(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await T(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},k={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]}},play:async({canvas:e})=>{await T(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},A={parameters:{router:{initialEntries:[`/t/setpoint-vt/profile`]}},play:async({canvas:e})=>{await w(e),await T(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await T(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await T(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`)}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
  }
}`,...A.parameters?.docs?.source}}},j=[`EventsActive`,`TeamActive`,`TeamSettingsActive`,`ProfileActive`]})))()}M();export{D as EventsActive,A as ProfileActive,O as TeamActive,k as TeamSettingsActive,j as __namedExportsOrder,E as default};