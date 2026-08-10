import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DrFIBqg2.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r}from"./event-fixtures-aDtuIL9P.js";import{n as i,t as a}from"./SeriesScopeField-DKXJMM05.js";function o({variant:e,initialScope:t,onScopeChange:n}){let[r,i]=(0,s.useState)(t);return(0,c.jsx)(`div`,{className:`max-w-md`,children:(0,c.jsx)(a,{siblings:d,currentId:`b`,scope:r,onScopeChange:e=>{n?.(e),i(e)},variant:e})})}var s,c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{s=t(),i(),c=n(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d=[r({id:`a`,startTime:`2026-09-01T18:30:00Z`,recurringGroup:`g1`}),r({id:`b`,startTime:`2026-09-08T18:30:00Z`,recurringGroup:`g1`}),r({id:`c`,startTime:`2026-09-15T18:30:00Z`,recurringGroup:`g1`}),r({id:`d`,startTime:`2026-09-22T18:30:00Z`,recurringGroup:`g1`})],f={title:`features/edit-event/SeriesScopeField`,component:o,args:{onScopeChange:u()}},p={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e})=>{await l(e.getByText(`Affects 1 of 4 events`)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`This event`})).toHaveAttribute(`aria-pressed`,`true`),await l(e.getByText(/Splits the series into three/)).toBeInTheDocument(),await l(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},m={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await l(n.onScopeChange).toHaveBeenCalledWith(`THIS_AND_FOLLOWING`),await l(e.getByText(`Affects 3 of 4 events`)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`This & following`})).toHaveAttribute(`aria-pressed`,`true`),await l(e.getByText(/Splits the series in two/)).toBeInTheDocument(),await l(e.getByText(/keeps its own date/)).toBeInTheDocument()}},h={args:{variant:`edit`,initialScope:`ALL`},play:async({canvas:e})=>{await l(e.getByText(`Affects 4 of 4 events`)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`All events`})).toHaveAttribute(`aria-pressed`,`true`),await l(e.getByText(/No split/)).toBeInTheDocument(),await l(e.getByText(/keeps its own date/)).toBeInTheDocument()}},g={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e})=>{await l(e.getByText(`Removes 1 of 4 events`)).toBeInTheDocument(),await l(e.getByText(/Removes just this occurrence/)).toBeInTheDocument(),await l(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},_={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await l(n.onScopeChange).toHaveBeenCalledWith(`THIS_AND_FOLLOWING`),await l(e.getByText(`Removes 3 of 4 events`)).toBeInTheDocument(),await l(e.getByText(/every later one/)).toBeInTheDocument()}},v={args:{variant:`delete`,initialScope:`ALL`},play:async({canvas:e})=>{await l(e.getByText(`Removes 4 of 4 events`)).toBeInTheDocument(),await l(e.getByText(/Removes the entire series/)).toBeInTheDocument()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Affects 1 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'This event'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/Splits the series into three/)).toBeInTheDocument();
    // THIS keeps the date free, so no lock note.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'THIS'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
    // Prop-contract: picking a scope reports it up (the dialog persists it as the chosen scope).
    await expect(args.onScopeChange).toHaveBeenCalledWith('THIS_AND_FOLLOWING');
    await expect(canvas.getByText('Affects 3 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'This & following'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/Splits the series in two/)).toBeInTheDocument();
    // A bulk scope locks the per-occurrence date.
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'edit',
    initialScope: 'ALL'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Affects 4 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'All events'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText(/No split/)).toBeInTheDocument();
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'THIS'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Removes 1 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/Removes just this occurrence/)).toBeInTheDocument();
    // Delete never locks a date — that note is edit-only.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'THIS'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
    // Same scope-report contract holds for the delete variant.
    await expect(args.onScopeChange).toHaveBeenCalledWith('THIS_AND_FOLLOWING');
    await expect(canvas.getByText('Removes 3 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/every later one/)).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'delete',
    initialScope: 'ALL'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Removes 4 of 4 events')).toBeInTheDocument();
    await expect(canvas.getByText(/Removes the entire series/)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y=[`EditThis`,`EditThisAndFollowing`,`EditAll`,`DeleteThis`,`DeleteThisAndFollowing`,`DeleteAll`]})))()}b();export{v as DeleteAll,g as DeleteThis,_ as DeleteThisAndFollowing,h as EditAll,p as EditThis,m as EditThisAndFollowing,y as __namedExportsOrder,f as default};