import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./modes-Bzyminl_.js";import{n as i,t as a}from"./createLucideIcon--fvGbGgY.js";import{n as o,t as s}from"./check-KUcMzeyC.js";import{n as c,t as l}from"./x-8nwycXBO.js";var u,d;function f(){return(f=e((()=>{i(),u=[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3`,key:`1u773s`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],d=a(`circle-question-mark`,u)})))()}function p({value:e,onToggle:t,disabled:n=!1}){return(0,m.jsx)(`div`,{className:`flex gap-2.5`,children:h.map(({value:r,label:i,icon:a,activeClass:o,inactiveClass:s})=>{let c=e===r;return(0,m.jsxs)(`button`,{"aria-pressed":c,disabled:n,onClick:e=>{e.preventDefault(),t(r)},className:[`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all active:scale-95`,c?o:s,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,m.jsx)(a,{size:18}),i]},r)})})}var m,h;function g(){return(g=e((()=>{o(),f(),c(),m=t(),h=[{value:`ATTENDING`,label:`Going`,icon:s,activeClass:`bg-green text-white border-green hover:bg-green/90`,inactiveClass:`border-green/30 text-green hover:bg-green/10`},{value:`MAYBE`,label:`Maybe`,icon:d,activeClass:`bg-gold text-white border-gold hover:bg-gold/90`,inactiveClass:`border-gold/30 text-gold hover:bg-gold/10`},{value:`ABSENT`,label:`Can't go`,icon:l,activeClass:`bg-red text-white border-red hover:bg-red/90`,inactiveClass:`border-red/30 text-red hover:bg-red/10`}],p.__docgenInfo={description:``,methods:[],displayName:`AttendanceToggle`,props:{value:{required:!0,tsType:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},description:``},onToggle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},name:`state`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}async function _(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await v(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),g(),{expect:v,fn:y}=__STORYBOOK_MODULE_TEST__,b={title:`features/attendance-toggle/AttendanceToggle`,component:p,args:{onToggle:y()},parameters:{chromatic:{modes:{light:r.light,dark:r.dark}}}},x={args:{value:`ATTENDING`},play:async({canvas:e})=>_(e,`Going`)},S={args:{value:`MAYBE`},play:async({canvas:e})=>_(e,`Maybe`)},C={args:{value:`ABSENT`},play:async({canvas:e})=>_(e,`Can't go`)},w={args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await _(e,``),await t.click(e.getByRole(`button`,{name:`Going`})),await v(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},T={args:{value:`ATTENDING`,disabled:!0},play:async({canvas:e})=>{for(let t of[`Going`,`Maybe`,`Can't go`])await v(e.getByRole(`button`,{name:t})).toBeDisabled()}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Going')
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'MAYBE'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Maybe')
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ABSENT'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, "Can't go")
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E=[`Attending`,`Maybe`,`Absent`,`NotResponded`,`Disabled`]})))()}D();export{C as Absent,x as Attending,T as Disabled,S as Maybe,w as NotResponded,E as __namedExportsOrder,b as default};