import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./createLucideIcon-tJXJv6yH.js";import{n as i,t as a}from"./check-BtPhMidL.js";import{n as o,t as s}from"./x-BezGFqSR.js";var c,l;function u(){return(u=e((()=>{n(),c=[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3`,key:`1u773s`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],l=r(`circle-question-mark`,c)})))()}function d({value:e,onToggle:t,disabled:n=!1}){return(0,f.jsx)(`div`,{className:`flex gap-2.5`,children:p.map(({value:r,label:i,icon:a,activeClass:o,inactiveClass:s})=>{let c=e===r;return(0,f.jsxs)(`button`,{"aria-pressed":c,disabled:n,onClick:e=>{e.preventDefault(),t(r)},className:[`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all active:scale-95`,c?o:s,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,f.jsx)(a,{size:18}),i]},r)})})}var f,p;function m(){return(m=e((()=>{i(),u(),o(),f=t(),p=[{value:`ATTENDING`,label:`Going`,icon:a,activeClass:`bg-green text-white border-green hover:bg-green/90`,inactiveClass:`border-green/30 text-green hover:bg-green/10`},{value:`MAYBE`,label:`Maybe`,icon:l,activeClass:`bg-gold text-white border-gold hover:bg-gold/90`,inactiveClass:`border-gold/30 text-gold hover:bg-gold/10`},{value:`ABSENT`,label:`Can't go`,icon:s,activeClass:`bg-red text-white border-red hover:bg-red/90`,inactiveClass:`border-red/30 text-red hover:bg-red/10`}],d.__docgenInfo={description:``,methods:[],displayName:`AttendanceToggle`,props:{value:{required:!0,tsType:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},description:``},onToggle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},name:`state`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}async function h(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await g(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{m(),{expect:g,fn:_}=__STORYBOOK_MODULE_TEST__,v={title:`features/attendance-toggle/AttendanceToggle`,component:d,args:{onToggle:_()}},y={args:{value:`ATTENDING`},play:async({canvas:e})=>h(e,`Going`)},b={args:{value:`MAYBE`},play:async({canvas:e})=>h(e,`Maybe`)},x={args:{value:`ABSENT`},play:async({canvas:e})=>h(e,`Can't go`)},S={args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await h(e,``),await t.click(e.getByRole(`button`,{name:`Going`})),await g(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},C={args:{value:`ATTENDING`,disabled:!0},play:async({canvas:e})=>{for(let t of[`Going`,`Maybe`,`Can't go`])await g(e.getByRole(`button`,{name:t})).toBeDisabled()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Going')
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'MAYBE'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Maybe')
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ABSENT'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, "Can't go")
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'NOT_RESPONDED'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // No option matches → none is pressed. Clicking one reports its value to the container.
    await expectPressed(canvas, '');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onToggle).toHaveBeenCalledWith('ATTENDING');
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ATTENDING',
    disabled: true
  },
  play: async ({
    canvas
  }) => {
    for (const name of ['Going', 'Maybe', "Can't go"]) {
      await expect(canvas.getByRole('button', {
        name
      })).toBeDisabled();
    }
  }
}`,...C.parameters?.docs?.source}}},w=[`Attending`,`Maybe`,`Absent`,`NotResponded`,`Disabled`]})))()}T();export{x as Absent,y as Attending,C as Disabled,b as Maybe,S as NotResponded,w as __namedExportsOrder,v as default};