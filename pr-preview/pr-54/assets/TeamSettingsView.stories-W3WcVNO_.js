import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-3HOVDQts.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{i,n as a,r as o,t as s}from"./input--gx_CYUx.js";import{n as c,t as l}from"./label-rXoExVYJ.js";function u(e){return e||void 0}function d(e){return u(e.start)!==void 0||u(e.end)!==void 0}function f(e){let t=u(e.start),n=u(e.end);return t&&n&&n<t?`End date must be on or after the start date.`:null}function p(e,t){return u(e.start)!==u(t.start)||u(e.end)!==u(t.end)}var m=e((()=>{}));function h({season:e,isSaving:t,error:n,onSave:r}){let[i,a]=(0,g.useState)(e.start??``),[c,u]=(0,g.useState)(e.end??``),m={start:i,end:c},h=f(m),v=p(e,m),y=v&&(d(e)||d(m));return(0,_.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Season`}),(0,_.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Bound your team's events to a season. Once set, events cannot be scheduled outside this window.`})]}),!d(e)&&!v&&(0,_.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No season set — events can be scheduled on any date.`}),(0,_.jsxs)(`div`,{className:`flex flex-wrap gap-4`,children:[(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(l,{htmlFor:`season-start`,children:`Start date`}),(0,_.jsx)(s,{id:`season-start`,type:`date`,value:i,max:c||void 0,onChange:e=>a(e.target.value),className:`w-48`})]}),(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(l,{htmlFor:`season-end`,children:`End date`}),(0,_.jsx)(s,{id:`season-end`,type:`date`,value:c,min:i||void 0,onChange:e=>u(e.target.value),className:`w-48`})]})]}),h&&(0,_.jsx)(`p`,{className:`text-sm text-red-500`,children:h}),y&&!h&&(0,_.jsx)(`p`,{className:`rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-foreground`,role:`alert`,children:`Changing the season won't move or delete existing events — some may now fall outside the new window.`}),n&&(0,_.jsx)(`p`,{className:`text-sm text-red-500`,children:n}),(0,_.jsx)(`div`,{children:(0,_.jsx)(o,{disabled:t||!v||!!h,onClick:()=>{h||!v||r({start:i||void 0,end:c||void 0})},children:t?`Saving…`:`Save season`})})]})}var g,_,v=e((()=>{g=t(n(),1),i(),a(),c(),m(),_=r(),h.__docgenInfo={description:`Presentational Team Settings UI: the season start/end pickers. Owns only local draft state; the
query + mutation live in the TeamSettings container, so every state (unset / set / change-warning)
renders purely from props (see TeamSettingsView.stories.tsx). Editing an already-configured season
surfaces a non-blocking warning — changing the window never moves or deletes existing events.`,methods:[],displayName:`TeamSettingsView`,props:{season:{required:!0,tsType:{name:`SeasonBounds`},description:`The saved season (the baseline the draft is compared against).`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(bounds: SeasonInput) => void`,signature:{arguments:[{type:{name:`SeasonInput`},name:`bounds`}],return:{name:`void`}}},description:``}}}})),y,b,x,S,C,w,T,E,D;e((()=>{v(),{expect:y,fn:b,waitFor:x}=__STORYBOOK_MODULE_TEST__,S={title:`features/team-settings/TeamSettingsView`,component:h,args:{onSave:b()}},C={args:{season:{}},play:async({canvas:e})=>{await y(e.getByText(`No season set — events can be scheduled on any date.`)).toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},w={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e})=>{await y(e.getByLabelText(`Start date`)).toHaveValue(`2026-09-01`),await y(e.getByLabelText(`End date`)).toHaveValue(`2027-04-30`),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled(),await y(e.queryByRole(`alert`)).not.toBeInTheDocument()}},T={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Start date`);await t.clear(r),await t.type(r,`2026-10-01`),await x(()=>y(e.getByRole(`alert`)).toHaveTextContent(/won't move or delete existing events/));let i=e.getByRole(`button`,{name:`Save season`});await y(i).toBeEnabled(),await t.click(i),await y(n.onSave).toHaveBeenCalledWith({start:`2026-10-01`,end:`2027-04-30`})}},E={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`End date`);await t.clear(n),await t.type(n,`2026-08-01`),await x(()=>y(e.getByText(`End date must be on or after the start date.`)).toBeInTheDocument()),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    season: {}
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No season set — events can be scheduled on any date.')).toBeInTheDocument();
    // Nothing to save until the user picks a date.
    await expect(canvas.getByRole('button', {
      name: 'Save season'
    })).toBeDisabled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    season: {
      start: '2026-09-01',
      end: '2027-04-30'
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Start date')).toHaveValue('2026-09-01');
    await expect(canvas.getByLabelText('End date')).toHaveValue('2027-04-30');
    // Pristine form: Save disabled, no change warning.
    await expect(canvas.getByRole('button', {
      name: 'Save season'
    })).toBeDisabled();
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    season: {
      start: '2026-09-01',
      end: '2027-04-30'
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const start = canvas.getByLabelText('Start date');
    await userEvent.clear(start);
    await userEvent.type(start, '2026-10-01');

    // Editing a configured season surfaces the non-blocking warning and enables Save.
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent(/won't move or delete existing events/));
    const save = canvas.getByRole('button', {
      name: 'Save season'
    });
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalledWith({
      start: '2026-10-01',
      end: '2027-04-30'
    });
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    season: {
      start: '2026-09-01',
      end: '2027-04-30'
    }
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    const end = canvas.getByLabelText('End date');
    await userEvent.clear(end);
    await userEvent.type(end, '2026-08-01');
    await waitFor(() => expect(canvas.getByText('End date must be on or after the start date.')).toBeInTheDocument());
    // An inverted range blocks the save.
    await expect(canvas.getByRole('button', {
      name: 'Save season'
    })).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D=[`Unset`,`Set`,`ChangeWarning`,`InvalidRange`]}))();export{T as ChangeWarning,E as InvalidRange,w as Set,C as Unset,D as __namedExportsOrder,S as default};