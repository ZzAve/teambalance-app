import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-D4FUF-yi.js";import{a as o,r as s}from"./event-fixtures-CuRrQuRB.js";import{i as c,n as l,r as u,t as d}from"./SeriesPeek-CLcrRjyX.js";var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{a(),s(),n(),c(),l(),f=t(),{expect:p,within:m}=__STORYBOOK_MODULE_TEST__,h={title:`entities/event/SeriesPeek`,component:d,decorators:[i]},g=[`a`,`b`,`c`,`d`,`e`].map((e,t)=>o({id:e,recurringGroup:`g1`,startTime:`2026-09-0${t+1}T18:30:00Z`})),_=u(g,`c`),v=u(g,`a`),y=u(g.slice(0,3),`b`),b={args:{peek:_},render:()=>(0,f.jsx)(r,{items:{"Long series":(0,f.jsx)(d,{peek:_}),"Current in head":(0,f.jsx)(d,{peek:v}),"Short series":(0,f.jsx)(d,{peek:y})}}),play:async({canvas:e})=>{let t=t=>m(e.getByRole(`region`,{name:t}));await p(t(`Long series`).getByText(`Part of a series`)).toBeInTheDocument(),await p(t(`Long series`).getByText(`Occurrence 3 of 5`)).toBeInTheDocument(),await p(t(`Long series`).queryByText(/\+1 more/)).not.toBeInTheDocument(),await p(t(`Long series`).getByRole(`button`)).toHaveAttribute(`aria-expanded`,`false`),await p(t(`Current in head`).getByText(`Occurrence 1 of 5`)).toBeInTheDocument(),await p(t(`Short series`).getByText(`Occurrence 2 of 3`)).toBeInTheDocument()}},x={parameters:{chromatic:{disableSnapshot:!0}},args:{peek:_},render:()=>(0,f.jsx)(r,{items:{"Long series":(0,f.jsx)(d,{peek:_}),"Current in head":(0,f.jsx)(d,{peek:v}),"Short series":(0,f.jsx)(d,{peek:y})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>m(e.getByRole(`region`,{name:t}));await t.click(n(`Long series`).getByRole(`button`)),await p(n(`Long series`).getByRole(`button`)).toHaveAttribute(`aria-expanded`,`true`),await p(n(`Long series`).getByText(/\+1 more/)).toBeInTheDocument(),await t.click(n(`Current in head`).getByRole(`button`)),await p(n(`Current in head`).getByText(`This one`)).toBeInTheDocument(),await t.click(n(`Short series`).getByRole(`button`)),await p(n(`Short series`).queryByText(/more/)).not.toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    peek: LONG
  },
  render: () => <Stack items={{
    'Long series': <SeriesPeek peek={LONG} />,
    'Current in head': <SeriesPeek peek={CURRENT_IN_HEAD} />,
    'Short series': <SeriesPeek peek={SHORT} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Long series').getByText('Part of a series')).toBeInTheDocument();
    await expect(region('Long series').getByText('Occurrence 3 of 5')).toBeInTheDocument();
    // The occurrence list stays hidden until expanded.
    await expect(region('Long series').queryByText(/\\+1 more/)).not.toBeInTheDocument();
    await expect(region('Long series').getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    await expect(region('Current in head').getByText('Occurrence 1 of 5')).toBeInTheDocument();
    await expect(region('Short series').getByText('Occurrence 2 of 3')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    peek: LONG
  },
  render: () => <Stack items={{
    'Long series': <SeriesPeek peek={LONG} />,
    'Current in head': <SeriesPeek peek={CURRENT_IN_HEAD} />,
    'Short series': <SeriesPeek peek={SHORT} />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Long series').getByRole('button'));
    await expect(region('Long series').getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    await expect(region('Long series').getByText(/\\+1 more/)).toBeInTheDocument();
    await userEvent.click(region('Current in head').getByRole('button'));
    await expect(region('Current in head').getByText('This one')).toBeInTheDocument();
    await userEvent.click(region('Short series').getByRole('button'));
    await expect(region('Short series').queryByText(/more/)).not.toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S=[`Gallery`,`Interactions`]})))()}C();export{b as Gallery,x as Interactions,S as __namedExportsOrder,h as default};