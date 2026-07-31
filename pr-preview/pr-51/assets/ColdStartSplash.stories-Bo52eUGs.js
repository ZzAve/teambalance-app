import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-BiWk_8Xc.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";function i(e){return e>=1e4?`warming`:e>=2500?`waking`:`brand`}function a(e){return e<6e3?`Rounding up the team…`:`Almost there…`}function o(e){return e<15e3?1:e<22e3?2:p.length-1}function s(){return(0,f.jsxs)(`span`,{className:`font-display text-2xl font-bold text-blue`,children:[`Team`,(0,f.jsx)(`span`,{className:`text-green`,children:`Balance`})]})}function c({elapsedMs:e}){let t=o(e);return(0,f.jsx)(`ul`,{className:`flex flex-col gap-2 text-sm`,children:p.map((e,n)=>{let r=n<t,i=n===t;return(0,f.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,f.jsx)(`span`,{"aria-hidden":!0,className:r?`h-2 w-2 rounded-full bg-green`:i?`h-2 w-2 animate-pulse rounded-full bg-gold`:`h-2 w-2 rounded-full bg-muted-foreground/30`}),(0,f.jsxs)(`span`,{className:r?`text-muted-foreground`:i?`font-semibold text-foreground`:`text-muted-foreground/50`,children:[e,i?`…`:``]})]},e)})})}function l({elapsedMs:e=0}){let t=i(e);return(0,f.jsxs)(`div`,{className:`flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center`,role:`status`,"aria-live":`polite`,children:[(0,f.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,f.jsx)(s,{}),(0,f.jsx)(`span`,{className:t===`brand`?``:`animate-bounce`,"aria-hidden":!0,children:`🏐`})]}),t===`waking`&&(0,f.jsx)(`p`,{className:`animate-pulse text-sm text-muted-foreground`,children:a(e)}),t===`warming`&&(0,f.jsxs)(`div`,{className:`flex flex-col items-center gap-4`,children:[(0,f.jsx)(c,{elapsedMs:e}),(0,f.jsx)(`p`,{className:`max-w-xs text-xs text-muted-foreground`,children:`Still warming up the court — this happens after a quiet spell. Hang tight! 🏐`})]})]})}function u(){let[e,t]=(0,d.useState)(0);return(0,d.useEffect)(()=>{let e=Date.now(),n=window.setInterval(()=>t(Date.now()-e),500);return()=>window.clearInterval(n)},[]),(0,f.jsx)(l,{elapsedMs:e})}var d,f,p,m=e((()=>{d=t(n(),1),f=r(),p=[`Waking the server`,`Connecting`,`Loading your team`],l.__docgenInfo={description:`Presentational splash for a given elapsed time. Pure — no timers, fully controlled by props.`,methods:[],displayName:`ColdStartSplash`,props:{elapsedMs:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`0`,computed:!1}}}},u.__docgenInfo={description:`The splash the router mounts while a route is pending. Owns the only real clock: it ticks the
elapsed time so the presentational <ColdStartSplash> escalates through its stages. Unmounts the
moment the route resolves (the real completion signal), so nothing here needs to fake progress.`,methods:[],displayName:`WakingSplash`}})),h,g,_,v,y,b,x;e((()=>{m(),{expect:h}=__STORYBOOK_MODULE_TEST__,g={title:`shared/ColdStartSplash`,component:l},_={args:{elapsedMs:0},play:async({canvas:e})=>{await h(e.getByText(`Team`)).toBeInTheDocument(),await h(e.queryByText(/rounding up the team/i)).not.toBeInTheDocument(),await h(e.queryByText(/waking the server/i)).not.toBeInTheDocument()}},v={args:{elapsedMs:3e3},play:async({canvas:e})=>{await h(e.getByText(/rounding up the team/i)).toBeInTheDocument()}},y={args:{elapsedMs:7e3},play:async({canvas:e})=>{await h(e.getByText(/almost there/i)).toBeInTheDocument()}},b={args:{elapsedMs:12e3},play:async({canvas:e})=>{await h(e.getByText(`Waking the server`)).toBeInTheDocument(),await h(e.getByText(/connecting/i)).toBeInTheDocument(),await h(e.getByText(`Loading your team`)).toBeInTheDocument(),await h(e.getByText(/warming up the court/i)).toBeInTheDocument()}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 3_000
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/rounding up the team/i)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    elapsedMs: 7_000
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/almost there/i)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`Brand`,`Waking`,`WakingLater`,`Warming`]}))();export{_ as Brand,v as Waking,y as WakingLater,b as Warming,x as __namedExportsOrder,g as default};