import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Cm8AJftX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{a,r as o}from"./event-fixtures-CuRrQuRB.js";import{n as s,t as c}from"./SeriesScopeField-CvV1Rj-r.js";import{n as l,t as u}from"./button-jmcBUdua.js";import{i as d,s as f}from"./dialog-B4vEaeYy.js";function p({eventId:e,siblings:t=[],isPending:n,isError:r,onDelete:i,onCancel:a}){let o=t.length>1,[s,l]=(0,m.useState)(`THIS`);return(0,h.jsxs)(h.Fragment,{children:[o&&(0,h.jsx)(c,{siblings:t,currentId:e,scope:s,onScopeChange:l,variant:`delete`}),r&&(0,h.jsx)(`p`,{className:`rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-small text-red`,children:`Could not delete the event. Please try again.`}),(0,h.jsxs)(d,{children:[(0,h.jsx)(u,{variant:`outline`,onClick:a,disabled:n,children:`Cancel`}),(0,h.jsx)(u,{variant:`destructive`,onClick:()=>i(s),disabled:n,children:n?`Deleting…`:o&&s!==`THIS`?`Delete events`:`Delete event`})]})]})}var m,h;function g(){return(g=e((()=>{m=t(),f(),l(),s(),h=n(),p.__docgenInfo={description:`Presentational body of the delete-event dialog. Owns the local scope state and hands the chosen
scope up via onDelete; the mutation, the post-delete navigation, and the dialog open/close state
live in the DeleteEventDialog container.

The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
so every state — standalone / series / deleting / error — renders purely from props as a story,
with no network. See ADR-0017.

Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
siblings) deletes itself with the default THIS scope and no prompt. For a series, the
SeriesScopeField drives which occurrences go — and a delete never splits (survivors keep their
group). The dialog chrome (title + description) stays in the container, so this stays Radix-free.`,methods:[],displayName:`DeleteEventDialogView`,props:{eventId:{required:!0,tsType:{name:`string`},description:``},siblings:{required:!1,tsType:{name:`Array`,elements:[{name:`Event`}],raw:`Event[]`},description:`Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone.`,defaultValue:{value:`[]`,computed:!1}},isPending:{required:!1,tsType:{name:`boolean`},description:`The delete mutation is in flight — the buttons disable and the confirm shows "Deleting…".`},isError:{required:!1,tsType:{name:`boolean`},description:`The delete mutation failed — render the inline error shell.`},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(scope: EventSeriesScope) => void`,signature:{arguments:[{type:{name:`EventSeriesScope`},name:`scope`}],return:{name:`void`}}},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{o(),r(),g(),_=n(),{expect:v,fn:y,within:b}=__STORYBOOK_MODULE_TEST__,x=[a({id:`evt-0`,startTime:`2026-08-25T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-1`,startTime:`2026-09-01T18:30:00+02:00`,recurringGroup:`g1`}),a({id:`evt-2`,startTime:`2026-09-08T18:30:00+02:00`,recurringGroup:`g1`})],S={title:`features/edit-event/DeleteEventDialogView`,component:p,args:{eventId:`evt-1`,onDelete:y(),onCancel:y()}},C={play:async({canvas:e})=>{await v(e.queryByRole(`group`,{name:`Scope`})).not.toBeInTheDocument()}},w={render:e=>(0,_.jsx)(i,{items:{Series:(0,_.jsx)(p,{...e,siblings:x}),Deleting:(0,_.jsx)(p,{...e,isPending:!0}),Error:(0,_.jsx)(p,{...e,isError:!0})}}),play:async({canvas:e})=>{let t=t=>b(e.getByRole(`region`,{name:t}));await v(t(`Series`).getByRole(`group`,{name:`Scope`})).toBeInTheDocument(),await v(t(`Series`).getByRole(`button`,{name:`Delete event`})).toBeInTheDocument(),await v(t(`Deleting`).getByRole(`button`,{name:`Deleting…`})).toBeDisabled(),await v(t(`Deleting`).getByRole(`button`,{name:`Cancel`})).toBeDisabled(),await v(t(`Error`).getByText(`Could not delete the event. Please try again.`)).toBeInTheDocument()}},T={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,_.jsx)(i,{items:{Standalone:(0,_.jsx)(p,{...e}),Series:(0,_.jsx)(p,{...e,siblings:x})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>b(e.getByRole(`region`,{name:t}));await t.click(r(`Standalone`).getByRole(`button`,{name:`Cancel`})),await v(n.onCancel).toHaveBeenCalled(),await t.click(r(`Standalone`).getByRole(`button`,{name:`Delete event`})),await v(n.onDelete).toHaveBeenCalledWith(`THIS`),await t.click(r(`Series`).getByRole(`button`,{name:`All events`})),await t.click(r(`Series`).getByRole(`button`,{name:`Delete events`})),await v(n.onDelete).toHaveBeenLastCalledWith(`ALL`)}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('group', {
      name: 'Scope'
    })).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // A series occurrence surfaces the scope selector; the confirm button still reads singular
    // until a bulk scope is picked.
    Series: <DeleteEventDialogView {...args} siblings={SIBLINGS} />,
    Deleting: <DeleteEventDialogView {...args} isPending />,
    Error: <DeleteEventDialogView {...args} isError />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Series').getByRole('group', {
      name: 'Scope'
    })).toBeInTheDocument();
    await expect(region('Series').getByRole('button', {
      name: 'Delete event'
    })).toBeInTheDocument();
    await expect(region('Deleting').getByRole('button', {
      name: 'Deleting…'
    })).toBeDisabled();
    await expect(region('Deleting').getByRole('button', {
      name: 'Cancel'
    })).toBeDisabled();
    await expect(region('Error').getByText('Could not delete the event. Please try again.')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Standalone: <DeleteEventDialogView {...args} />,
    Series: <DeleteEventDialogView {...args} siblings={SIBLINGS} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Standalone').getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onCancel).toHaveBeenCalled();
    await userEvent.click(region('Standalone').getByRole('button', {
      name: 'Delete event'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith('THIS');
    await userEvent.click(region('Series').getByRole('button', {
      name: 'All events'
    }));
    await userEvent.click(region('Series').getByRole('button', {
      name: 'Delete events'
    }));
    await expect(args.onDelete).toHaveBeenLastCalledWith('ALL');
  }
}`,...T.parameters?.docs?.source}}},E=[`Data`,`Shells`,`Interactions`]})))()}D();export{C as Data,T as Interactions,w as Shells,E as __namedExportsOrder,S as default};