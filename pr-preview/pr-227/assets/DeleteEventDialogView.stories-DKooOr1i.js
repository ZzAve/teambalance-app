import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CDjj3s1N.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,r as i}from"./event-fixtures-BTSzdoeq.js";import{n as a,t as o}from"./SeriesScopeField-DQlXrqE_.js";import{n as s,t as c}from"./button-BIeu3nlO.js";import{i as l,s as u}from"./dialog-DdujXZ24.js";function d({eventId:e,siblings:t=[],isPending:n,isError:r,onDelete:i,onCancel:a}){let s=t.length>1,[u,d]=(0,f.useState)(`THIS`);return(0,p.jsxs)(p.Fragment,{children:[s&&(0,p.jsx)(o,{siblings:t,currentId:e,scope:u,onScopeChange:d,variant:`delete`}),r&&(0,p.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red`,children:`Could not delete the event. Please try again.`}),(0,p.jsxs)(l,{children:[(0,p.jsx)(c,{variant:`outline`,onClick:a,disabled:n,children:`Cancel`}),(0,p.jsx)(c,{variant:`destructive`,onClick:()=>i(u),disabled:n,children:n?`Deleting…`:s&&u!==`THIS`?`Delete events`:`Delete event`})]})]})}var f,p;function m(){return(m=e((()=>{f=t(),u(),s(),a(),p=n(),d.__docgenInfo={description:`Presentational body of the delete-event dialog. Owns the local scope state and hands the chosen
scope up via onDelete; the mutation, the post-delete navigation, and the dialog open/close state
live in the DeleteEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / deleting / error — renders purely from props as a story,
with no network. See ADR-0017.

Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
siblings) deletes itself with the default THIS scope and no prompt. For a series, the
SeriesScopeField drives which occurrences go — and a delete never splits (survivors keep their
group). The dialog chrome (title + description) stays in the container, so this stays Radix-free.`,methods:[],displayName:`DeleteEventDialogView`,props:{eventId:{required:!0,tsType:{name:`string`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The delete mutation is in flight — the buttons disable and the confirm shows "Deleting…".`},isError:{required:!1,tsType:{name:`boolean`},description:`The delete mutation failed — render the inline error shell.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(scope: EventSeriesScope) => void`,signature:{arguments:[{type:{name:`EventSeriesScope`},name:`scope`}],return:{name:`void`}}},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{r(),m(),{expect:h,fn:g}=__STORYBOOK_MODULE_TEST__,_=[i({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),i({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],v={title:`features/edit-event/DeleteEventDialogView`,component:d,args:{eventId:`evt-1`,onDelete:g(),onCancel:g()}},y={play:async({canvas:e,userEvent:t,args:n})=>{await h(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Delete event`})),await h(n.onDelete).toHaveBeenCalledWith(`THIS`)}},b={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Cancel`})),await h(n.onCancel).toHaveBeenCalled()}},x={args:{siblings:_},play:async({canvas:e,userEvent:t,args:n})=>{await h(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await h(e.getByRole(`button`,{name:`Delete event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`All events`})),await t.click(e.getByRole(`button`,{name:`Delete events`})),await h(n.onDelete).toHaveBeenCalledWith(`ALL`)}},S={args:{isPending:!0},play:async({canvas:e})=>{await h(e.getByRole(`button`,{name:`Deleting…`})).toBeDisabled(),await h(e.getByRole(`button`,{name:`Cancel`})).toBeDisabled()}},C={args:{isError:!0},play:async({canvas:e})=>{await h(e.getByText(`Could not delete the event. Please try again.`)).toBeInTheDocument()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not delete the event. Please try again.')).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Standalone`,`Cancel`,`Series`,`Deleting`,`ErrorState`]})))()}T();export{b as Cancel,S as Deleting,C as ErrorState,x as Series,y as Standalone,w as __namedExportsOrder,v as default};