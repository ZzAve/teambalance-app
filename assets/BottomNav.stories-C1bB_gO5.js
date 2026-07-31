import{i as e}from"./preload-helper-BdFrVu1K.js";import{i as t,n,r,t as i}from"./router-decorator-FOzLtNzo.js";import{t as a}from"./jsx-runtime-f3rHp9ZU.js";import{R as o,i as s,o as c,t as l}from"./lucide-react-Cc4aLrJ7.js";function u(){return(0,d.jsx)(`nav`,{className:`fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg`,children:(0,d.jsx)(`div`,{className:`mx-auto flex max-w-2xl items-center justify-around px-2 py-1`,children:f.map(({icon:e,label:n,to:r,active:i,disabled:a})=>(0,d.jsxs)(t,{to:r,className:[`flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors`,a?`pointer-events-none select-none text-muted-foreground/40`:i?`text-blue`:`text-muted-foreground hover:text-foreground`].join(` `),"aria-current":i?`page`:void 0,children:[(0,d.jsxs)(`span`,{className:`relative flex items-center justify-center`,children:[(0,d.jsx)(`span`,{className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${i?`scale-100`:`scale-0`}`,style:{transitionTimingFunction:`cubic-bezier(0.34, 1.56, 0.64, 1)`}}),(0,d.jsx)(e,{size:22,strokeWidth:i?2.5:1.75,className:`relative z-10`})]}),(0,d.jsx)(`span`,{className:i?`font-medium`:``,children:n})]},n))})})}var d,f,p=e((()=>{r(),l(),d=a(),f=[{icon:o,label:`Events`,to:`/`,active:!0,disabled:!1},{icon:s,label:`Money Pool`,to:`/`,active:!1,disabled:!0},{icon:c,label:`Team`,to:`/`,active:!1,disabled:!0}],u.__docgenInfo={description:``,methods:[],displayName:`BottomNav`}})),m,h,g,_;e((()=>{i(),p(),{expect:m}=__STORYBOOK_MODULE_TEST__,h={title:`shared/ui/BottomNav`,component:u,decorators:[n]},g={play:async({canvas:e})=>{await m(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await m(e.getByRole(`link`,{name:`Money Pool`})).toHaveClass(`pointer-events-none`),await m(e.getByRole(`link`,{name:`Team`})).toHaveClass(`pointer-events-none`)}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Every tab points at "/" (the other sections don't exist yet), so the router marks them all
    // aria-current — the active/disabled split lives in the styling instead: Events is the live
    // blue tab; Money Pool and Team are rendered but non-interactive.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money Pool'
    })).toHaveClass('pointer-events-none');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveClass('pointer-events-none');
  }
}`,...g.parameters?.docs?.source}}},_=[`Default`]}))();export{g as Default,_ as __namedExportsOrder,h as default};