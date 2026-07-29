import{i as e}from"./preload-helper-CT_b8DTk.js";import{t}from"./jsx-runtime-DqZldVDK.js";import{K as n,M as r,n as i,t as a}from"./lucide-react-B3XqDLk0.js";function o({value:e,onToggle:t,disabled:n=!1}){return(0,s.jsx)(`div`,{className:`flex gap-2.5`,children:c.map(({value:r,label:i,icon:a,activeClass:o,inactiveClass:c})=>{let l=e===r;return(0,s.jsxs)(`button`,{"aria-pressed":l,disabled:n,onClick:e=>{e.preventDefault(),t(r)},className:[`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all active:scale-95`,l?o:c,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,s.jsx)(a,{size:18}),i]},r)})})}var s,c,l=e((()=>{a(),s=t(),c=[{value:`ATTENDING`,label:`Going`,icon:r,activeClass:`bg-green text-white border-green hover:bg-green/90`,inactiveClass:`border-green/30 text-green hover:bg-green/10`},{value:`MAYBE`,label:`Maybe`,icon:n,activeClass:`bg-gold text-white border-gold hover:bg-gold/90`,inactiveClass:`border-gold/30 text-gold hover:bg-gold/10`},{value:`ABSENT`,label:`Can't go`,icon:i,activeClass:`bg-red-500 text-white border-red-500 hover:bg-red-500/90`,inactiveClass:`border-red-300 text-red-500 hover:bg-red-500/10`}],o.__docgenInfo={description:``,methods:[],displayName:`AttendanceToggle`,props:{value:{required:!0,tsType:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},description:``},onToggle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`union`,raw:`'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'`,elements:[{name:`literal`,value:`'ATTENDING'`},{name:`literal`,value:`'MAYBE'`},{name:`literal`,value:`'ABSENT'`},{name:`literal`,value:`'NOT_RESPONDED'`}]},name:`state`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}}));async function u(e,t){for(let n of[`Going`,`Maybe`,`Can't go`])await d(e.getByRole(`button`,{name:n})).toHaveAttribute(`aria-pressed`,String(n===t))}var d,f,p,m,h,g,_,v,y;e((()=>{l(),{expect:d,fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`features/attendance-toggle/AttendanceToggle`,component:o,args:{onToggle:f()}},m={args:{value:`ATTENDING`},play:async({canvas:e})=>u(e,`Going`)},h={args:{value:`MAYBE`},play:async({canvas:e})=>u(e,`Maybe`)},g={args:{value:`ABSENT`},play:async({canvas:e})=>u(e,`Can't go`)},_={args:{value:`NOT_RESPONDED`},play:async({canvas:e,userEvent:t,args:n})=>{await u(e,``),await t.click(e.getByRole(`button`,{name:`Going`})),await d(n.onToggle).toHaveBeenCalledWith(`ATTENDING`)}},v={args:{value:`ATTENDING`,disabled:!0},play:async({canvas:e})=>{for(let t of[`Going`,`Maybe`,`Can't go`])await d(e.getByRole(`button`,{name:t})).toBeDisabled()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Going')
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'MAYBE'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, 'Maybe')
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'ABSENT'
  },
  play: async ({
    canvas
  }) => expectPressed(canvas, "Can't go")
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Attending`,`Maybe`,`Absent`,`NotResponded`,`Disabled`]}))();export{g as Absent,m as Attending,v as Disabled,h as Maybe,_ as NotResponded,y as __namedExportsOrder,p as default};