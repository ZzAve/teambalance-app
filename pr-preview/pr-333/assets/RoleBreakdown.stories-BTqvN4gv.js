import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";function n({breakdown:e}){return e.length===0?null:(0,r.jsx)(`div`,{className:`flex flex-wrap gap-1.5 px-3 py-2`,children:e.map(({role:e,attending:t})=>(0,r.jsxs)(`span`,{className:`rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green`,children:[t,` `,e]},e))})}var r;function i(){return(i=e((()=>{r=t(),n.__docgenInfo={description:`Presentational breakdown of attending members grouped by role, rendered as chips.
Renders nothing when no role has attendees. Extracted from the event-detail page so
its empty/populated states are testable in isolation (see RoleBreakdown.stories.tsx).`,methods:[],displayName:`RoleBreakdown`,props:{breakdown:{required:!0,tsType:{name:`Array`,elements:[{name:`RoleCount`}],raw:`RoleCount[]`},description:``}}}})))()}var a,o,s,c,l,u;function d(){return(d=e((()=>{i(),{expect:a}=__STORYBOOK_MODULE_TEST__,o={title:`entities/event/RoleBreakdown`,component:n},s={args:{breakdown:[{role:`Setter`,attending:2},{role:`Outside Hitter`,attending:3},{role:`Libero`,attending:1}]},play:async({canvas:e})=>{await a(e.getByText(`2 Setter`)).toBeInTheDocument(),await a(e.getByText(`3 Outside Hitter`)).toBeInTheDocument(),await a(e.getByText(`1 Libero`)).toBeInTheDocument()}},c={args:{breakdown:[]},play:async({canvasElement:e})=>{await a(e).toBeEmptyDOMElement()}},l={args:{breakdown:[{role:`Setter`,attending:2},{role:`Libero`,attending:1},{role:`Unassigned`,attending:3}]},play:async({canvas:e})=>{await a(e.getByText(`2 Setter`)).toBeInTheDocument(),await a(e.getByText(`3 Unassigned`)).toBeInTheDocument()}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: [{
      role: 'Setter',
      attending: 2
    }, {
      role: 'Outside Hitter',
      attending: 3
    }, {
      role: 'Libero',
      attending: 1
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('2 Setter')).toBeInTheDocument();
    await expect(canvas.getByText('3 Outside Hitter')).toBeInTheDocument();
    await expect(canvas.getByText('1 Libero')).toBeInTheDocument();
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: []
  },
  play: async ({
    canvasElement
  }) => {
    // Nothing to break down -> the component renders nothing at all.
    await expect(canvasElement).toBeEmptyDOMElement();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: [{
      role: 'Setter',
      attending: 2
    }, {
      role: 'Libero',
      attending: 1
    }, {
      role: 'Unassigned',
      attending: 3
    }]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('2 Setter')).toBeInTheDocument();
    await expect(canvas.getByText('3 Unassigned')).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u=[`Populated`,`Empty`,`WithUnassigned`]})))()}d();export{c as Empty,s as Populated,l as WithUnassigned,u as __namedExportsOrder,o as default};