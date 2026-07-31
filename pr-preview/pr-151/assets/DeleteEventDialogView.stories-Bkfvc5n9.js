import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BOS77XOy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{n as i,t as a}from"./event-fixtures-CKCzWaqm.js";import{n as o,t as s}from"./button-DDSktX6Q.js";import{i as c,s as l}from"./dialog-usp3gVH-.js";import{n as u,t as d}from"./SeriesScopeField-DqebLlcy.js";function f({eventId:e,siblings:t=[],isPending:n,isError:r,onDelete:i,onCancel:a}){let o=t.length>1,[l,u]=(0,p.useState)(`THIS`);return(0,m.jsxs)(m.Fragment,{children:[o&&(0,m.jsx)(d,{siblings:t,currentId:e,scope:l,onScopeChange:u,variant:`delete`}),r&&(0,m.jsx)(`p`,{className:`rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500`,children:`Could not delete the event. Please try again.`}),(0,m.jsxs)(c,{children:[(0,m.jsx)(s,{variant:`outline`,onClick:a,disabled:n,children:`Cancel`}),(0,m.jsx)(s,{variant:`destructive`,onClick:()=>i(l),disabled:n,children:n?`Deleting…`:o&&l!==`THIS`?`Delete events`:`Delete event`})]})]})}var p,m,h=e((()=>{p=t(n(),1),l(),o(),u(),m=r(),f.__docgenInfo={description:`Presentational body of the delete-event dialog. Owns the local scope state and hands the chosen
scope up via onDelete; the mutation, the post-delete navigation, and the dialog open/close state
live in the DeleteEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / deleting / error — renders purely from props as a story,
with no network. See ADR-0017.

Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
siblings) deletes itself with the default THIS scope and no prompt. For a series, the
SeriesScopeField drives which occurrences go — and a delete never splits (survivors keep their
group). The dialog chrome (title + description) stays in the container, so this stays Radix-free.`,methods:[],displayName:`DeleteEventDialogView`,props:{eventId:{required:!0,tsType:{name:`string`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The delete mutation is in flight — the buttons disable and the confirm shows "Deleting…".`},isError:{required:!1,tsType:{name:`boolean`},description:`The delete mutation failed — render the inline error shell.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(scope: EventSeriesScope) => void`,signature:{arguments:[{type:{name:`EventSeriesScope`},name:`scope`}],return:{name:`void`}}},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),g,_,v,y,b,x,S,C,w,T;e((()=>{a(),h(),{expect:g,fn:_}=__STORYBOOK_MODULE_TEST__,v=[i({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],y={title:`features/edit-event/DeleteEventDialogView`,component:f,args:{eventId:`evt-1`,onDelete:_(),onCancel:_()}},b={play:async({canvas:e,userEvent:t,args:n})=>{await g(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Delete event`})),await g(n.onDelete).toHaveBeenCalledWith(`THIS`)}},x={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Cancel`})),await g(n.onCancel).toHaveBeenCalled()}},S={args:{siblings:v},play:async({canvas:e,userEvent:t,args:n})=>{await g(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await g(e.getByRole(`button`,{name:`Delete event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`All events`})),await t.click(e.getByRole(`button`,{name:`Delete events`})),await g(n.onDelete).toHaveBeenCalledWith(`ALL`)}},C={args:{isPending:!0},play:async({canvas:e})=>{await g(e.getByRole(`button`,{name:`Deleting…`})).toBeDisabled(),await g(e.getByRole(`button`,{name:`Cancel`})).toBeDisabled()}},w={args:{isError:!0},play:async({canvas:e})=>{await g(e.getByText(`Could not delete the event. Please try again.`)).toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.queryByRole('group', {
      name: 'Scope'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Delete event'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith('THIS');
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onCancel).toHaveBeenCalled();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    siblings: SIBLINGS
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await expect(canvas.getByRole('group', {
      name: 'Scope'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Delete event'
    })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'All events'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Delete events'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith('ALL');
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Deleting…'
    })).toBeDisabled();
    await expect(canvas.getByRole('button', {
      name: 'Cancel'
    })).toBeDisabled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not delete the event. Please try again.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T=[`Standalone`,`Cancel`,`Series`,`Deleting`,`ErrorState`]}))();export{x as Cancel,C as Deleting,w as ErrorState,S as Series,b as Standalone,T as __namedExportsOrder,y as default};