import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-CN0e_lCC.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,r as o}from"./app-column-decorator-0nMuVRZm.js";import{a as s,r as c}from"./event-fixtures-CuRrQuRB.js";import{n as l,t as u}from"./SeriesScopeField-x4vlpjn9.js";function d({variant:e,initialScope:t,onScopeChange:n}){let[r,i]=(0,f.useState)(t);return(0,p.jsx)(`div`,{children:(0,p.jsx)(u,{siblings:_,currentId:`b`,scope:r,onScopeChange:e=>{n?.(e),i(e)},variant:e})})}var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{f=t(),c(),r(),o(),l(),p=n(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_=[s({id:`a`,startTime:`2026-09-01T18:30:00Z`,recurringGroup:`g1`}),s({id:`b`,startTime:`2026-09-08T18:30:00Z`,recurringGroup:`g1`}),s({id:`c`,startTime:`2026-09-15T18:30:00Z`,recurringGroup:`g1`}),s({id:`d`,startTime:`2026-09-22T18:30:00Z`,recurringGroup:`g1`})],v={title:`features/edit-event/SeriesScopeField`,component:d,...a,args:{onScopeChange:h()}},y={args:{variant:`edit`,initialScope:`THIS`},render:e=>(0,p.jsx)(i,{items:{"Edit / This":(0,p.jsx)(d,{...e,variant:`edit`,initialScope:`THIS`}),"Edit / This & following":(0,p.jsx)(d,{...e,variant:`edit`,initialScope:`THIS_AND_FOLLOWING`}),"Edit / All":(0,p.jsx)(d,{...e,variant:`edit`,initialScope:`ALL`}),"Delete / This":(0,p.jsx)(d,{...e,variant:`delete`,initialScope:`THIS`}),"Delete / This & following":(0,p.jsx)(d,{...e,variant:`delete`,initialScope:`THIS_AND_FOLLOWING`}),"Delete / All":(0,p.jsx)(d,{...e,variant:`delete`,initialScope:`ALL`})}}),play:async({canvas:e})=>{let t=t=>g(e.getByRole(`region`,{name:t}));await m(t(`Edit / This`).getByText(`Affects 1 of 4 events`)).toBeInTheDocument(),await m(t(`Edit / This`).getByRole(`button`,{name:`This event`})).toHaveAttribute(`aria-pressed`,`true`),await m(t(`Edit / This`).getByText(/Splits the series into three/)).toBeInTheDocument(),await m(t(`Edit / This`).queryByText(/keeps its own date/)).not.toBeInTheDocument(),await m(t(`Edit / This & following`).getByText(`Affects 3 of 4 events`)).toBeInTheDocument(),await m(t(`Edit / This & following`).getByRole(`button`,{name:`This & following`})).toHaveAttribute(`aria-pressed`,`true`),await m(t(`Edit / This & following`).getByText(/Splits the series in two/)).toBeInTheDocument(),await m(t(`Edit / This & following`).getByText(/keeps its own date/)).toBeInTheDocument(),await m(t(`Edit / All`).getByText(`Affects 4 of 4 events`)).toBeInTheDocument(),await m(t(`Edit / All`).getByRole(`button`,{name:`All events`})).toHaveAttribute(`aria-pressed`,`true`),await m(t(`Edit / All`).getByText(/No split/)).toBeInTheDocument(),await m(t(`Edit / All`).getByText(/keeps its own date/)).toBeInTheDocument(),await m(t(`Delete / This`).getByText(`Removes 1 of 4 events`)).toBeInTheDocument(),await m(t(`Delete / This`).getByText(/Removes just this occurrence/)).toBeInTheDocument(),await m(t(`Delete / This`).queryByText(/keeps its own date/)).not.toBeInTheDocument(),await m(t(`Delete / This & following`).getByText(`Removes 3 of 4 events`)).toBeInTheDocument(),await m(t(`Delete / This & following`).getByText(/every later one/)).toBeInTheDocument(),await m(t(`Delete / All`).getByText(`Removes 4 of 4 events`)).toBeInTheDocument(),await m(t(`Delete / All`).getByText(/Removes the entire series/)).toBeInTheDocument()}},b={parameters:{chromatic:{disableSnapshot:!0}},args:{variant:`edit`,initialScope:`THIS`},render:e=>(0,p.jsx)(i,{items:{Edit:(0,p.jsx)(d,{...e,variant:`edit`,initialScope:`THIS`}),Delete:(0,p.jsx)(d,{...e,variant:`delete`,initialScope:`THIS`})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>g(e.getByRole(`region`,{name:t}));await t.click(r(`Edit`).getByRole(`button`,{name:`This & following`})),await m(n.onScopeChange).toHaveBeenLastCalledWith(`THIS_AND_FOLLOWING`),await t.click(r(`Delete`).getByRole(`button`,{name:`This & following`})),await m(n.onScopeChange).toHaveBeenLastCalledWith(`THIS_AND_FOLLOWING`)}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  // Unused by render below — every Stack item supplies its own \`variant\`/\`initialScope\` — but
  // required to satisfy the story's prop contract.
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  render: args => <Stack items={{
    'Edit / This': <Harness {...args} variant="edit" initialScope="THIS" />,
    'Edit / This & following': <Harness {...args} variant="edit" initialScope="THIS_AND_FOLLOWING" />,
    'Edit / All': <Harness {...args} variant="edit" initialScope="ALL" />,
    'Delete / This': <Harness {...args} variant="delete" initialScope="THIS" />,
    'Delete / This & following': <Harness {...args} variant="delete" initialScope="THIS_AND_FOLLOWING" />,
    'Delete / All': <Harness {...args} variant="delete" initialScope="ALL" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Edit / This').getByText('Affects 1 of 4 events')).toBeInTheDocument();
    await expect(region('Edit / This').getByRole('button', {
      name: 'This event'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Edit / This').getByText(/Splits the series into three/)).toBeInTheDocument();
    // THIS keeps the date free, so no lock note.
    await expect(region('Edit / This').queryByText(/keeps its own date/)).not.toBeInTheDocument();
    await expect(region('Edit / This & following').getByText('Affects 3 of 4 events')).toBeInTheDocument();
    await expect(region('Edit / This & following').getByRole('button', {
      name: 'This & following'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Edit / This & following').getByText(/Splits the series in two/)).toBeInTheDocument();
    // A bulk scope locks the per-occurrence date.
    await expect(region('Edit / This & following').getByText(/keeps its own date/)).toBeInTheDocument();
    await expect(region('Edit / All').getByText('Affects 4 of 4 events')).toBeInTheDocument();
    await expect(region('Edit / All').getByRole('button', {
      name: 'All events'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(region('Edit / All').getByText(/No split/)).toBeInTheDocument();
    await expect(region('Edit / All').getByText(/keeps its own date/)).toBeInTheDocument();
    await expect(region('Delete / This').getByText('Removes 1 of 4 events')).toBeInTheDocument();
    await expect(region('Delete / This').getByText(/Removes just this occurrence/)).toBeInTheDocument();
    // Delete never locks a date — that note is edit-only.
    await expect(region('Delete / This').queryByText(/keeps its own date/)).not.toBeInTheDocument();
    await expect(region('Delete / This & following').getByText('Removes 3 of 4 events')).toBeInTheDocument();
    await expect(region('Delete / This & following').getByText(/every later one/)).toBeInTheDocument();
    await expect(region('Delete / All').getByText('Removes 4 of 4 events')).toBeInTheDocument();
    await expect(region('Delete / All').getByText(/Removes the entire series/)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // Unused by render below — every Stack item supplies its own \`variant\`/\`initialScope\` — but
  // required to satisfy the story's prop contract.
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  render: args => <Stack items={{
    Edit: <Harness {...args} variant="edit" initialScope="THIS" />,
    Delete: <Harness {...args} variant="delete" initialScope="THIS" />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Edit').getByRole('button', {
      name: 'This & following'
    }));
    await expect(args.onScopeChange).toHaveBeenLastCalledWith('THIS_AND_FOLLOWING');

    // Same scope-report contract holds for the delete variant.
    await userEvent.click(region('Delete').getByRole('button', {
      name: 'This & following'
    }));
    await expect(args.onScopeChange).toHaveBeenLastCalledWith('THIS_AND_FOLLOWING');
  }
}`,...b.parameters?.docs?.source}}},x=[`Gallery`,`Interactions`]})))()}S();export{y as Gallery,b as Interactions,x as __namedExportsOrder,v as default};