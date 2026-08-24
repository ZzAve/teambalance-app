import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BmKi-jTa.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r}from"./event-fixtures-BaYeuP-I.js";import{n as i,t as a}from"./SeriesScopeField-SnjIQ0-y.js";import{n as o,t as s}from"./button-DAwrIbnS.js";import{i as c,s as l}from"./dialog-BwV-kTOz.js";function u({eventId:e,siblings:t=[],isPending:n,isError:r,onDelete:i,onCancel:o}){let l=t.length>1,[u,p]=(0,d.useState)(`THIS`);return(0,f.jsxs)(f.Fragment,{children:[l&&(0,f.jsx)(a,{siblings:t,currentId:e,scope:u,onScopeChange:p,variant:`delete`}),r&&(0,f.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red`,children:`Could not delete the event. Please try again.`}),(0,f.jsxs)(c,{children:[(0,f.jsx)(s,{variant:`outline`,onClick:o,disabled:n,children:`Cancel`}),(0,f.jsx)(s,{variant:`destructive`,onClick:()=>i(u),disabled:n,children:n?`Deleting…`:l&&u!==`THIS`?`Delete events`:`Delete event`})]})]})}var d,f;function p(){return(p=e((()=>{d=t(),l(),o(),i(),f=n(),u.__docgenInfo={description:`Presentational body of the delete-event dialog. Owns the local scope state and hands the chosen
scope up via onDelete; the mutation, the post-delete navigation, and the dialog open/close state
live in the DeleteEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / deleting / error — renders purely from props as a story,
with no network. See ADR-0017.

Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
siblings) deletes itself with the default THIS scope and no prompt. For a series, the
SeriesScopeField drives which occurrences go — and a delete never splits (survivors keep their
group). The dialog chrome (title + description) stays in the container, so this stays Radix-free.`,methods:[],displayName:`DeleteEventDialogView`,props:{eventId:{required:!0,tsType:{name:`string`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The delete mutation is in flight — the buttons disable and the confirm shows "Deleting…".`},isError:{required:!1,tsType:{name:`boolean`},description:`The delete mutation failed — render the inline error shell.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(scope: EventSeriesScope) => void`,signature:{arguments:[{type:{name:`EventSeriesScope`},name:`scope`}],return:{name:`void`}}},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{p(),{expect:m,fn:h}=__STORYBOOK_MODULE_TEST__,g=[r({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),r({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],_={title:`features/edit-event/DeleteEventDialogView`,component:u,args:{eventId:`evt-1`,onDelete:h(),onCancel:h()}},v={play:async({canvas:e,userEvent:t,args:n})=>{await m(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Delete event`})),await m(n.onDelete).toHaveBeenCalledWith(`THIS`)}},y={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Cancel`})),await m(n.onCancel).toHaveBeenCalled()}},b={args:{siblings:g},play:async({canvas:e,userEvent:t,args:n})=>{await m(e.getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await m(e.getByRole(`button`,{name:`Delete event`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`All events`})),await t.click(e.getByRole(`button`,{name:`Delete events`})),await m(n.onDelete).toHaveBeenCalledWith(`ALL`)}},x={args:{isPending:!0},play:async({canvas:e})=>{await m(e.getByRole(`button`,{name:`Deleting…`})).toBeDisabled(),await m(e.getByRole(`button`,{name:`Cancel`})).toBeDisabled()}},S={args:{isError:!0},play:async({canvas:e})=>{await m(e.getByText(`Could not delete the event. Please try again.`)).toBeInTheDocument()}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Could not delete the event. Please try again.')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C=[`Standalone`,`Cancel`,`Series`,`Deleting`,`ErrorState`]})))()}w();export{y as Cancel,x as Deleting,S as ErrorState,b as Series,v as Standalone,C as __namedExportsOrder,_ as default};