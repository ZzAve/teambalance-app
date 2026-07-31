import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BOS77XOy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{n as i,t as a}from"./event-fixtures-CKCzWaqm.js";import{n as o,t as s}from"./SeriesScopeField-DqebLlcy.js";function c({variant:e,initialScope:t}){let[n,r]=(0,l.useState)(t);return(0,u.jsx)(`div`,{className:`max-w-md`,children:(0,u.jsx)(s,{siblings:f,currentId:`b`,scope:n,onScopeChange:r,variant:e})})}var l,u,d,f,p,m,h,g,_,v,y,b;e((()=>{l=t(n(),1),a(),o(),u=r(),{expect:d}=__STORYBOOK_MODULE_TEST__,f=[i({id:`a`,startTime:`2026-09-01T18:30:00Z`,recurringGroup:`g1`}),i({id:`b`,startTime:`2026-09-08T18:30:00Z`,recurringGroup:`g1`}),i({id:`c`,startTime:`2026-09-15T18:30:00Z`,recurringGroup:`g1`}),i({id:`d`,startTime:`2026-09-22T18:30:00Z`,recurringGroup:`g1`})],p={title:`features/edit-event/SeriesScopeField`,component:c},m={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e})=>{await d(e.getByText(`Affects 1 of 4 events`)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:`This event`})).toHaveAttribute(`aria-pressed`,`true`),await d(e.getByText(/Splits the series into three/)).toBeInTheDocument(),await d(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},h={args:{variant:`edit`,initialScope:`THIS`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await d(e.getByText(`Affects 3 of 4 events`)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:`This & following`})).toHaveAttribute(`aria-pressed`,`true`),await d(e.getByText(/Splits the series in two/)).toBeInTheDocument(),await d(e.getByText(/keeps its own date/)).toBeInTheDocument()}},g={args:{variant:`edit`,initialScope:`ALL`},play:async({canvas:e})=>{await d(e.getByText(`Affects 4 of 4 events`)).toBeInTheDocument(),await d(e.getByRole(`button`,{name:`All events`})).toHaveAttribute(`aria-pressed`,`true`),await d(e.getByText(/No split/)).toBeInTheDocument(),await d(e.getByText(/keeps its own date/)).toBeInTheDocument()}},_={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e})=>{await d(e.getByText(`Removes 1 of 4 events`)).toBeInTheDocument(),await d(e.getByText(/Removes just this occurrence/)).toBeInTheDocument(),await d(e.queryByText(/keeps its own date/)).not.toBeInTheDocument()}},v={args:{variant:`delete`,initialScope:`THIS`},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`This & following`})),await d(e.getByText(`Removes 3 of 4 events`)).toBeInTheDocument(),await d(e.getByText(/every later one/)).toBeInTheDocument()}},y={args:{variant:`delete`,initialScope:`ALL`},play:async({canvas:e})=>{await d(e.getByText(`Removes 4 of 4 events`)).toBeInTheDocument(),await d(e.getByText(/Removes the entire series/)).toBeInTheDocument()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
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
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'This & following'
    }));
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
}`,...y.parameters?.docs?.source}}},b=[`EditThis`,`EditThisAndFollowing`,`EditAll`,`DeleteThis`,`DeleteThisAndFollowing`,`DeleteAll`]}))();export{y as DeleteAll,_ as DeleteThis,v as DeleteThisAndFollowing,g as EditAll,m as EditThis,h as EditThisAndFollowing,b as __namedExportsOrder,p as default};