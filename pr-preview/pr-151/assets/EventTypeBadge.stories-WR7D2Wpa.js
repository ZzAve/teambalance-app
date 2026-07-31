import{i as e}from"./preload-helper-BdFrVu1K.js";import{n as t,t as n}from"./EventTypeBadge-cTq2vnym.js";var r,i,a,o,s;e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`entities/event/EventTypeBadge`,component:n},a={args:{type:{id:`et-1`,name:`Match`,color:`#3b82f6`}},play:async({canvas:e})=>{await r(e.getByText(`Match`)).toBeInTheDocument()}},o={args:{type:{id:`et-2`,name:`Social`,color:void 0}},play:async({canvas:e})=>{await r(e.getByText(`Social`)).toBeInTheDocument()}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-1',
      name: 'Match',
      color: '#3b82f6'
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument();
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-2',
      name: 'Social',
      color: undefined
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument();
  }
}`,...o.parameters?.docs?.source}}},s=[`WithColor`,`WithoutColor`]}))();export{a as WithColor,o as WithoutColor,s as __namedExportsOrder,i as default};