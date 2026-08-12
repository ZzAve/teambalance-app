import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,c as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./router-decorator-c_box6ZK.js";import{t as d}from"./jsx-runtime-DeHZSEgm.js";import{n as f,t as p}from"./createLucideIcon-CBmb1Ywi.js";import{n as m,t as h}from"./calendar-DHToqXxq.js";function g(e){let t=u({warn:e?.router===void 0}),r=e?.router||t;return n(r.stores.__store,o(e,r))}function _(){return(_=e((()=>{i(),t(),c()})))()}var v,y;function b(){return(b=e((()=>{f(),v=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]],y=p(`user`,v)})))()}var x,S;function C(){return(C=e((()=>{f(),x=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]],S=p(`users`,x)})))()}function w(){let e=g({select:e=>e.location.pathname});return(0,T.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,style:{paddingBottom:`env(safe-area-inset-bottom)`},children:(0,T.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:E.map(({icon:t,label:n,to:r,isActive:i})=>{let a=i(e);return(0,T.jsxs)(s,{to:r,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,a?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":a?`page`:void 0,children:[(0,T.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,T.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${a?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,T.jsx)(t,{size:22,strokeWidth:a?2.5:1.75,className:`relative z-10`})]}),(0,T.jsx)(`span`,{className:a?`font-medium`:``,children:n})]},n)})})})}var T,E;function D(){return(D=e((()=>{r(),_(),m(),C(),b(),T=d(),E=[{icon:h,label:`Events`,to:`/`,isActive:e=>e===`/`},{icon:S,label:`Team`,to:`/team`,isActive:e=>e===`/team`||e.startsWith(`/team/`)},{icon:y,label:`Profile`,to:`/profile`,isActive:e=>e===`/profile`||e.startsWith(`/profile/`)}],w.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})))()}async function O(e){await k(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/`),await k(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/team`),await k(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/profile`),await k(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await k(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await k(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`),await k(e.queryByRole(`link`,{name:`Money Pool`})).not.toBeInTheDocument()}var k,A,j,M,N,P,F;function I(){return(I=e((()=>{l(),D(),{expect:k}=__STORYBOOK_MODULE_TEST__,A={title:`shared/ui/BottomNav`,component:w,decorators:[a]},j={parameters:{router:{initialEntries:[`/`]}},play:async({canvas:e})=>{await O(e),await k(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await k(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},M={parameters:{router:{initialEntries:[`/team`]}},play:async({canvas:e})=>{await O(e),await k(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await k(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},N={parameters:{router:{initialEntries:[`/team/settings`]}},play:async({canvas:e})=>{await k(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},P={parameters:{router:{initialEntries:[`/profile`]}},play:async({canvas:e})=>{await O(e),await k(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await k(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await k(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`)}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/']
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/team']
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/team/settings']
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
      initialEntries: ['/profile']
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
}`,...P.parameters?.docs?.source}}},F=[`EventsActive`,`TeamActive`,`TeamSettingsActive`,`ProfileActive`]})))()}I();export{j as EventsActive,P as ProfileActive,M as TeamActive,N as TeamSettingsActive,F as __namedExportsOrder,A as default};