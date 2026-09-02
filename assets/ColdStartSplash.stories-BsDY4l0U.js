import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-zeEvxunR.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";function r(e){return e>=1e4?`warming`:e>=2500?`waking`:`brand`}function i(e){return e<6e3?`Rounding up the team…`:`Almost there…`}function a(e){return e<15e3?1:e<22e3?2:u.length-1}function o(){return(0,l.jsxs)(`span`,{className:`font-display text-2xl font-bold text-blue`,children:[`Team`,(0,l.jsx)(`span`,{className:`text-green`,children:`Balance`})]})}function s({elapsedMs:e}){let t=a(e);return(0,l.jsx)(`ul`,{className:`flex flex-col gap-2 text-sm`,children:u.map((e,n)=>{let r=n<t,i=n===t;return(0,l.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(`span`,{"aria-hidden":!0,className:r?`h-2 w-2 rounded-full bg-green`:i?`h-2 w-2 animate-pulse rounded-full bg-gold`:`h-2 w-2 rounded-full bg-muted-foreground/30`}),(0,l.jsxs)(`span`,{className:r?`text-muted-foreground`:i?`font-semibold text-foreground`:`text-muted-foreground/50`,children:[e,i?`…`:``]})]},e)})})}function c({elapsedMs:e=0}){let t=r(e);return(0,l.jsxs)(`div`,{className:`flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center`,role:`status`,"aria-live":`polite`,children:[(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{}),(0,l.jsx)(`span`,{className:t===`brand`?``:`animate-bounce`,"aria-hidden":!0,children:`🏐`})]}),t===`waking`&&(0,l.jsx)(`p`,{className:`animate-pulse text-sm text-muted-foreground`,children:i(e)}),t===`warming`&&(0,l.jsxs)(`div`,{className:`flex flex-col items-center gap-4`,children:[(0,l.jsx)(s,{elapsedMs:e}),(0,l.jsx)(`p`,{className:`max-w-xs text-xs text-muted-foreground`,children:`Still warming up the court — this happens after a quiet spell. Hang tight! 🏐`})]})]})}var l,u;function d(){return(d=e((()=>{t(),l=n(),u=[`Waking the server`,`Connecting`,`Loading your team`],c.__docgenInfo={description:`Presentational splash for a given elapsed time. Pure — no timers, fully controlled by props.`,methods:[],displayName:`ColdStartSplash`,props:{elapsedMs:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`0`,computed:!1}}}}})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{d(),{expect:f}=__STORYBOOK_MODULE_TEST__,p={title:`shared/ColdStartSplash`,component:c},m={args:{elapsedMs:0},play:async({canvas:e})=>{await f(e.getByText(`Team`)).toBeInTheDocument(),await f(e.queryByText(/rounding up the team/i)).not.toBeInTheDocument(),await f(e.queryByText(/waking the server/i)).not.toBeInTheDocument()}},h={args:{elapsedMs:3e3},play:async({canvas:e})=>{await f(e.getByText(/rounding up the team/i)).toBeInTheDocument()}},g={args:{elapsedMs:7e3},play:async({canvas:e})=>{await f(e.getByText(/almost there/i)).toBeInTheDocument()}},_={args:{elapsedMs:12e3},play:async({canvas:e})=>{await f(e.getByText(`Waking the server`)).toBeInTheDocument(),await f(e.getByText(/connecting/i)).toBeInTheDocument(),await f(e.getByText(`Loading your team`)).toBeInTheDocument(),await f(e.getByText(/warming up the court/i)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 0
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Team')).toBeInTheDocument();
    await expect(canvas.queryByText(/rounding up the team/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/waking the server/i)).not.toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 3_000
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/rounding up the team/i)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 7_000
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/almost there/i)).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 12_000
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Waking the server')).toBeInTheDocument();
    await expect(canvas.getByText(/connecting/i)).toBeInTheDocument();
    await expect(canvas.getByText('Loading your team')).toBeInTheDocument();
    await expect(canvas.getByText(/warming up the court/i)).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v=[`Brand`,`Waking`,`WakingLater`,`Warming`]})))()}y();export{m as Brand,h as Waking,g as WakingLater,_ as Warming,v as __namedExportsOrder,p as default};