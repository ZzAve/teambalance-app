import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-rWADIeMB.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,r as i}from"./event-fixtures-CRErpnsn.js";import{n as a,t as o}from"./SeriesScopeField-DslqjoYZ.js";function s({variant:e,initialScope:t,onScopeChange:n}){let[r,i]=(0,c.useState)(t);return(0,l.jsx)(`div`,{className:`max-w-md`,children:(0,l.jsx)(o,{siblings:f,currentId:`b`,scope:r,onScopeChange:e=>{n?.(e),i(e)},variant:e})})}var c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{c=t(),r(),a(),l=n(),{expect:u,fn:d}=__STORYBOOK_MODULE_TEST__,f=[i({id:`a`,startTime:`2026-09-01T18:30:00Z`,recurringGroup:`g1`}),i({id:`b`,startTime:`2026-09-08T18:30:00Z`,recurringGroup:`g1`}),i({id:`c`,startTime:`2026-09-15T18:30:00Z`,recurringGroup:`g1`}),i({id:`d`,startTime:`2026-09-22T18:30:00Z`,recurringGroup:`g1`})],p={title:`features/edit-event/SeriesScopeField`,component:s,args:{onScopeChange:d()}},m={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e})=>{await u(e.getByText(`Affects 1 of 4 events`)).toBeInTheDocument(),await u(e.getByRole(`button`,{name:`This event`})).toHaveAttribute(`aria-pressed`,`true`),await u(e.getByText(/Splits the series into three/)).toBeInTheDocument(),await u(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},h={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await u(n.onScopeChange).toHaveBeenCalledWith(`THIS_AND_FOLLOWING`),await u(e.getByText(`Affects 3 of 4 events`)).toBeInTheDocument(),await u(e.getByRole(`button`,{name:`This & following`})).toHaveAttribute(`aria-pressed`,`true`),await u(e.getByText(/Splits the series in two/)).toBeInTheDocument(),await u(e.getByText(/keeps its own date/)).toBeInTheDocument()}},g={args:{variant:`edit`,initialScope:`ALL`},play:async({canvas:e})=>{await u(e.getByText(`Affects 4 of 4 events`)).toBeInTheDocument(),await u(e.getByRole(`button`,{name:`All events`})).toHaveAttribute(`aria-pressed`,`true`),await u(e.getByText(/No split/)).toBeInTheDocument(),await u(e.getByText(/keeps its own date/)).toBeInTheDocument()}},_={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e})=>{await u(e.getByText(`Removes 1 of 4 events`)).toBeInTheDocument(),await u(e.getByText(/Removes just this occurrence/)).toBeInTheDocument(),await u(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},v={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await u(n.onScopeChange).toHaveBeenCalledWith(`THIS_AND_FOLLOWING`),await u(e.getByText(`Removes 3 of 4 events`)).toBeInTheDocument(),await u(e.getByText(/every later one/)).toBeInTheDocument()}},y={args:{variant:`delete`,initialScope:`ALL`},play:async({canvas:e})=>{await u(e.getByText(`Removes 4 of 4 events`)).toBeInTheDocument(),await u(e.getByText(/Removes the entire series/)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`EditThis`,`EditThisAndFollowing`,`EditAll`,`DeleteThis`,`DeleteThisAndFollowing`,`DeleteAll`]})))()}x();export{y as DeleteAll,_ as DeleteThis,v as DeleteThisAndFollowing,g as EditAll,m as EditThis,h as EditThisAndFollowing,b as __namedExportsOrder,p as default};