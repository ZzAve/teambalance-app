import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./EventTypeIcon-pyQTYDhr.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`entities/event/EventTypeIcon`,component:n},a={args:{type:{id:`et-1`,name:`Training`,color:`#22c55e`}},play:async({canvasElement:e})=>{await r(e.querySelector(`.lucide-dumbbell`)).toBeInTheDocument()}},o={args:{type:{id:`et-2`,name:`Match`,color:`#3b82f6`}},play:async({canvasElement:e})=>{await r(e.querySelector(`.lucide-swords`)).toBeInTheDocument()}},s={args:{type:{id:`et-3`,name:`Tournament`,color:`#f59e0b`}},play:async({canvasElement:e})=>{await r(e.querySelector(`.lucide-trophy`)).toBeInTheDocument()}},c={args:{type:{id:`et-4`,name:`Social`,color:`#ec4899`}},play:async({canvasElement:e})=>{await r(e.querySelector(`.lucide-party-popper`)).toBeInTheDocument()}},l={args:{type:{id:`et-5`,name:`Beach Cleanup`,color:void 0}},play:async({canvasElement:e})=>{await r(e.querySelector(`.lucide-calendar`)).toBeInTheDocument()}},u={args:{type:{id:`et-1`,name:`Training`,color:`#22c55e`},size:`sm`},play:async({canvasElement:e})=>{await r(e.querySelector(`.h-9`)).toBeInTheDocument(),await r(e.querySelector(`.h-11`)).not.toBeInTheDocument()}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-1',
      name: 'Training',
      color: '#22c55e'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelector('.lucide-dumbbell')).toBeInTheDocument();
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-2',
      name: 'Match',
      color: '#3b82f6'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelector('.lucide-swords')).toBeInTheDocument();
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-3',
      name: 'Tournament',
      color: '#f59e0b'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelector('.lucide-trophy')).toBeInTheDocument();
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-4',
      name: 'Social',
      color: '#ec4899'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelector('.lucide-party-popper')).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-5',
      name: 'Beach Cleanup',
      color: undefined
    }
  },
  play: async ({
    canvasElement
  }) => {
    // Unmapped type → Calendar fallback.
    await expect(canvasElement.querySelector('.lucide-calendar')).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    type: {
      id: 'et-1',
      name: 'Training',
      color: '#22c55e'
    },
    size: 'sm'
  },
  play: async ({
    canvasElement
  }) => {
    // The sm variant uses a 36px (h-9) wrapper rather than the default 44px (h-11).
    await expect(canvasElement.querySelector('.h-9')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.h-11')).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d=[`Training`,`Match`,`Tournament`,`Social`,`UnknownFallback`,`Small`]})))()}f();export{o as Match,u as Small,c as Social,s as Tournament,a as Training,l as UnknownFallback,d as __namedExportsOrder,i as default};