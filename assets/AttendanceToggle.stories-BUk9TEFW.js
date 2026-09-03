import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./check-DhtU_wgD.js";import{n as r,t as i}from"./circle-question-mark-C91CkPLd.js";import{n as a,t as o}from"./x-B_VxGsp5.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./modes-Bzyminl_.js";function u({value:e,onToggle:t,disabled:n=!1}){return(0,d.jsx)(`div`,{className:`flex gap-2.5`,children:f.map(({value:r,label:i,icon:a,activeClass:o,inactiveClass:s})=>{let c=e===r;return(0,d.jsxs)(`button`,{"aria-pressed":c,disabled:n,onClick:e=>{e.preventDefault(),t(r)},className:[`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all active:scale-95`,c?o:s,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,d.jsx)(a,{size:18}),i]},r)})})}var d,f;function p(){return(p=e((()=>{t(),r(),a(),d=s(),f=[{value:`ATTENDING`,label:`Going`,icon:n,activeClass:`bg-green text-white border-green hover:bg-green/90`,inactiveClass:`border-green/30 text-green hover:bg-green/10`},{value:`MAYBE`,label:`Maybe`,icon:i,activeClass:`bg-gold text-white border-gold hover:bg-gold/90`,inactiveClass:`border-gold/30 text-gold hover:bg-gold/10`},{value:`ABSENT`,label:`Can't go`,icon:o,activeClass:`bg-red text-white border-red hover:bg-red/90`,inactiveClass:`border-red/30 text-red hover:bg-red/10`}],u.__docgenInfo={description:``,methods:[],displayName:`AttendanceToggle`,props:{value:{required:!0,tsType:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},description:``},onToggle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},name:`state`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}async function m(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await h(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{c(),p(),{expect:h,fn:g}=__STORYBOOK_MODULE_TEST__,_={title:`features/attendance-toggle/AttendanceToggle`,component:u,args:{onToggle:g()},parameters:{chromatic:{modes:{light:l.light,dark:l.dark}}}},v={args:{value:`ATTENDING`},play:async({canvas:e})=>m(e,`Going`)},y={args:{value:`MAYBE`},play:async({canvas:e})=>m(e,`Maybe`)},b={args:{value:`ABSENT`},play:async({canvas:e})=>m(e,`Can't go`)},x={args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await m(e,``),await t.click(e.getByRole(`button`,{name:`Going`})),await h(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},S={args:{value:`ATTENDING`,disabled:!0},play:async({canvas:e})=>{for(let t of[`Going`,`Maybe`,`Can't go`])await h(e.getByRole(`button`,{name:t})).toBeDisabled()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Going')
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'MAYBE'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Maybe')
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ABSENT'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, "Can't go")
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C=[`Attending`,`Maybe`,`Absent`,`NotResponded`,`Disabled`]})))()}w();export{b as Absent,v as Attending,S as Disabled,y as Maybe,x as NotResponded,C as __namedExportsOrder,_ as default};