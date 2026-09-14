import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-exsfVg0I.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-CKd6OPi-.js";function a(e){return e>=1e4?`warming`:e>=2500?`waking`:`brand`}function o(e){return e<6e3?`Rounding up the team…`:`Almost there…`}function s(e){return e<15e3?1:e<22e3?2:f.length-1}function c(){return(0,d.jsxs)(`span`,{className:`font-display text-2xl font-bold text-blue`,children:[`Team`,(0,d.jsx)(`span`,{className:`text-green`,children:`Balance`})]})}function l({elapsedMs:e}){let t=s(e);return(0,d.jsx)(`ul`,{className:`flex flex-col gap-2 text-sm`,children:f.map((e,n)=>{let r=n<t,i=n===t;return(0,d.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,d.jsx)(`span`,{"aria-hidden":!0,className:r?`h-2 w-2 rounded-full bg-green`:i?`h-2 w-2 animate-pulse rounded-full bg-gold`:`h-2 w-2 rounded-full bg-muted-foreground/30`}),(0,d.jsxs)(`span`,{className:r?`text-muted-foreground`:i?`font-semibold text-foreground`:`text-muted-foreground/50`,children:[e,i?`…`:``]})]},e)})})}function u({elapsedMs:e=0}){let t=a(e);return(0,d.jsxs)(`div`,{className:`flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center`,role:`status`,"aria-live":`polite`,children:[(0,d.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,d.jsx)(c,{}),(0,d.jsx)(`span`,{className:t===`brand`?``:`animate-bounce motion-reduce:animate-none`,"aria-hidden":!0,children:`🏐`})]}),t===`waking`&&(0,d.jsx)(`p`,{className:`animate-pulse text-sm text-muted-foreground motion-reduce:animate-none`,children:o(e)}),t===`warming`&&(0,d.jsxs)(`div`,{className:`flex flex-col items-center gap-4`,children:[(0,d.jsx)(l,{elapsedMs:e}),(0,d.jsx)(`p`,{className:`max-w-xs text-xs text-muted-foreground`,children:`Still warming up the court — this happens after a quiet spell. Hang tight! 🏐`})]})]})}var d,f;function p(){return(p=e((()=>{t(),d=n(),f=[`Waking the server`,`Connecting`,`Loading your team`],u.__docgenInfo={description:`Presentational splash for a given elapsed time. Pure — no timers, fully controlled by props.`,methods:[],displayName:`ColdStartSplash`,props:{elapsedMs:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`0`,computed:!1}}}}})))()}var m,h,g,_,v,y;function b(){return(b=e((()=>{r(),p(),m=n(),{expect:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`shared/ColdStartSplash`,component:u},v={render:()=>(0,m.jsx)(i,{items:{Brand:(0,m.jsx)(u,{elapsedMs:0}),Waking:(0,m.jsx)(u,{elapsedMs:3e3}),WakingLater:(0,m.jsx)(u,{elapsedMs:7e3}),Warming:(0,m.jsx)(u,{elapsedMs:12e3})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await h(t(`Brand`).getByText(`Team`)).toBeInTheDocument(),await h(t(`Brand`).queryByText(/rounding up the team/i)).not.toBeInTheDocument(),await h(t(`Brand`).queryByText(/waking the server/i)).not.toBeInTheDocument(),await h(t(`Waking`).getByText(/rounding up the team/i)).toBeInTheDocument(),await h(t(`WakingLater`).getByText(/almost there/i)).toBeInTheDocument(),await h(t(`Warming`).getByText(`Waking the server`)).toBeInTheDocument(),await h(t(`Warming`).getByText(/connecting/i)).toBeInTheDocument(),await h(t(`Warming`).getByText(`Loading your team`)).toBeInTheDocument(),await h(t(`Warming`).getByText(/warming up the court/i)).toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Stack items={{
    // Warm load: just the brand mark, no "waking" copy.
    Brand: <ColdStartSplash elapsedMs={0} />,
    // ~3s in: the warm "rounding up the team" line has appeared.
    Waking: <ColdStartSplash elapsedMs={3_000} />,
    // ~6s in: the stage-2 line has rotated to keep the wait feeling like motion.
    WakingLater: <ColdStartSplash elapsedMs={7_000} />,
    // ~12s in: past the cold-start threshold, the step indicator has replaced the looped motion.
    Warming: <ColdStartSplash elapsedMs={12_000} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Brand').getByText('Team')).toBeInTheDocument();
    await expect(region('Brand').queryByText(/rounding up the team/i)).not.toBeInTheDocument();
    await expect(region('Brand').queryByText(/waking the server/i)).not.toBeInTheDocument();
    await expect(region('Waking').getByText(/rounding up the team/i)).toBeInTheDocument();
    await expect(region('WakingLater').getByText(/almost there/i)).toBeInTheDocument();
    await expect(region('Warming').getByText('Waking the server')).toBeInTheDocument();
    await expect(region('Warming').getByText(/connecting/i)).toBeInTheDocument();
    await expect(region('Warming').getByText('Loading your team')).toBeInTheDocument();
    await expect(region('Warming').getByText(/warming up the court/i)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y=[`Gallery`]})))()}b();export{v as Gallery,y as __namedExportsOrder,_ as default};