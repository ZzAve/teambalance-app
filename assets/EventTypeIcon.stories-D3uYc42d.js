import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./EventTypeIcon-DUJX-CTf.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i(),o=t(),{expect:s}=__STORYBOOK_MODULE_TEST__,c={training:{type:{id:`et-1`,name:`Training`,color:`#22c55e`}},match:{type:{id:`et-2`,name:`Match`,color:`#3b82f6`}},tournament:{type:{id:`et-3`,name:`Tournament`,color:`#f59e0b`}},social:{type:{id:`et-4`,name:`Social`,color:`#ec4899`}},unknown:{type:{id:`et-5`,name:`Beach Cleanup`,color:void 0}},small:{type:{id:`et-1`,name:`Training`,color:`#22c55e`},size:`sm`}},l={title:`entities/event/EventTypeIcon`,component:a},u={args:c.training,render:()=>(0,o.jsx)(r,{columns:`grid-cols-3`,items:Object.fromEntries(Object.entries(c).map(([e,t])=>[e,(0,o.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,o.jsx)(a,{...t})})]))}),play:async({canvas:e})=>{let t=t=>e.getByTestId(`variant-${t}`);await s(t(`training`).querySelector(`.lucide-dumbbell`)).toBeInTheDocument(),await s(t(`match`).querySelector(`.lucide-swords`)).toBeInTheDocument(),await s(t(`tournament`).querySelector(`.lucide-trophy`)).toBeInTheDocument(),await s(t(`social`).querySelector(`.lucide-party-popper`)).toBeInTheDocument(),await s(t(`unknown`).querySelector(`.lucide-calendar`)).toBeInTheDocument(),await s(t(`small`).querySelector(`.h-9`)).toBeInTheDocument(),await s(t(`small`).querySelector(`.h-11`)).not.toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.training,
  render: () => <Stack columns="grid-cols-3" items={Object.fromEntries(Object.entries(VARIANTS).map(([name, props]): [string, ReactNode] => [name, <div data-testid={\`variant-\${name}\`}>
            <EventTypeIcon {...props} />
          </div>]))} />,
  play: async ({
    canvas
  }) => {
    const variant = (name: keyof typeof VARIANTS) => canvas.getByTestId(\`variant-\${name}\`);
    await expect(variant('training').querySelector('.lucide-dumbbell')).toBeInTheDocument();
    await expect(variant('match').querySelector('.lucide-swords')).toBeInTheDocument();
    await expect(variant('tournament').querySelector('.lucide-trophy')).toBeInTheDocument();
    await expect(variant('social').querySelector('.lucide-party-popper')).toBeInTheDocument();
    // Unmapped type → Calendar fallback.
    await expect(variant('unknown').querySelector('.lucide-calendar')).toBeInTheDocument();
    // The sm variant uses a 36px (h-9) wrapper rather than the default 44px (h-11).
    await expect(variant('small').querySelector('.h-9')).toBeInTheDocument();
    await expect(variant('small').querySelector('.h-11')).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d=[`Gallery`]})))()}f();export{u as Gallery,d as __namedExportsOrder,l as default};