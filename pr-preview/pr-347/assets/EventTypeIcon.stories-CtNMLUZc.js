import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./EventTypeIcon-B2DSqDhS.js";var i,a,o,s,c,l;function u(){return(u=e((()=>{n(),i=t(),{expect:a}=__STORYBOOK_MODULE_TEST__,o={training:{type:{id:`et-1`,name:`Training`,color:`#22c55e`}},match:{type:{id:`et-2`,name:`Match`,color:`#3b82f6`}},tournament:{type:{id:`et-3`,name:`Tournament`,color:`#f59e0b`}},social:{type:{id:`et-4`,name:`Social`,color:`#ec4899`}},unknown:{type:{id:`et-5`,name:`Beach Cleanup`,color:void 0}},small:{type:{id:`et-1`,name:`Training`,color:`#22c55e`},size:`sm`}},s={title:`entities/event/EventTypeIcon`,component:r},c={args:o.training,render:()=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-center gap-4`,children:Object.entries(o).map(([e,t])=>(0,i.jsx)(`div`,{"data-testid":`variant-${e}`,children:(0,i.jsx)(r,{...t})},e))}),play:async({canvas:e})=>{let t=t=>e.getByTestId(`variant-${t}`);await a(t(`training`).querySelector(`.lucide-dumbbell`)).toBeInTheDocument(),await a(t(`match`).querySelector(`.lucide-swords`)).toBeInTheDocument(),await a(t(`tournament`).querySelector(`.lucide-trophy`)).toBeInTheDocument(),await a(t(`social`).querySelector(`.lucide-party-popper`)).toBeInTheDocument(),await a(t(`unknown`).querySelector(`.lucide-calendar`)).toBeInTheDocument(),await a(t(`small`).querySelector(`.h-9`)).toBeInTheDocument(),await a(t(`small`).querySelector(`.h-11`)).not.toBeInTheDocument()}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: VARIANTS.training,
  render: () => <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => <div key={name} data-testid={\`variant-\${name}\`}>
          <EventTypeIcon {...props} />
        </div>)}
    </div>,
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
}`,...c.parameters?.docs?.source}}},l=[`Gallery`]})))()}u();export{c as Gallery,l as __namedExportsOrder,s as default};