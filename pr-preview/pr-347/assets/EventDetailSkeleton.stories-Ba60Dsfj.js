import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./EventDetailSkeleton-BDOG4GKW.js";var r,i,a,o;function s(){return(s=e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`entities/event/EventDetailSkeleton`,component:n},a={play:async({canvas:e})=>{await r(e.getByRole(`status`,{name:/loading event/i})).toBeInTheDocument()}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('status', {
      name: /loading event/i
    })).toBeInTheDocument();
  }
}`,...a.parameters?.docs?.source}}},o=[`Default`]})))()}s();export{a as Default,o as __namedExportsOrder,i as default};