import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{t as n}from"./iframe-BXclvPvy.js";import{t as r}from"./jsx-runtime-f3rHp9ZU.js";import{n as i,t as a}from"./button-BHtExP71.js";import{n as o,t as s}from"./input-BSXte1aw.js";import{n as c,t as l}from"./label-B6iEqIuF.js";function u(e){return e||void 0}function d(e){return u(e.start)!==void 0||u(e.end)!==void 0}function f(e){let t=u(e.start),n=u(e.end);return t&&n&&n<t?`End date must be on or after the start date.`:null}function p(e,t){return u(e.start)!==u(t.start)||u(e.end)!==u(t.end)}var m=e((()=>{}));function h({season:e={},isLoading:t,isError:n,isSaving:r,error:i,onSave:o}){let[c,u]=(0,g.useState)(e.start??``),[m,h]=(0,g.useState)(e.end??``),v={start:c,end:m},y=f(v),b=p(e,v),x=b&&(d(e)||d(v));return(0,_.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Season`}),(0,_.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Bound your team's events to a season. Once set, events cannot be scheduled outside this window.`})]}),t&&(0,_.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,_.jsx)(`p`,{className:`text-sm text-red-500`,children:`Couldn't load team settings. Please try again.`}),!t&&!n&&(0,_.jsxs)(_.Fragment,{children:[!d(e)&&!b&&(0,_.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No season set — events can be scheduled on any date.`}),(0,_.jsxs)(`div`,{className:`flex flex-wrap gap-4`,children:[(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(l,{htmlFor:`season-start`,children:`Start date`}),(0,_.jsx)(s,{id:`season-start`,type:`date`,value:c,max:m||void 0,onChange:e=>u(e.target.value),className:`w-48`})]}),(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(l,{htmlFor:`season-end`,children:`End date`}),(0,_.jsx)(s,{id:`season-end`,type:`date`,value:m,min:c||void 0,onChange:e=>h(e.target.value),className:`w-48`})]})]}),y&&(0,_.jsx)(`p`,{className:`text-sm text-red-500`,children:y}),x&&!y&&(0,_.jsx)(`p`,{className:`rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-foreground`,role:`alert`,children:`Changing the season won't move or delete existing events — some may now fall outside the new window.`}),i&&(0,_.jsx)(`p`,{className:`text-sm text-red-500`,children:i}),(0,_.jsx)(`div`,{children:(0,_.jsx)(a,{disabled:r||!b||!!y,onClick:()=>{y||!b||o({start:c||void 0,end:m||void 0})},children:r?`Saving…`:`Save season`})})]})]})}var g,_,v=e((()=>{g=t(n(),1),i(),o(),c(),m(),_=r(),h.__docgenInfo={description:`Presentational Team Settings UI — the complete section, heading and all: the season start/end
pickers. Owns only local draft state; the query + mutation live in the TeamSettings container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / unset / set / change-warning — renders purely from
props as a story (see TeamSettingsView.stories.tsx), with no network. Editing an already-configured
season surfaces a non-blocking warning — changing the window never moves or deletes existing events.`,methods:[],displayName:`TeamSettingsView`,props:{season:{required:!1,tsType:{name:`SeasonBounds`},description:`The saved season (the baseline the draft is compared against); defaults to an unset season.`,defaultValue:{value:`{}`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:`The season query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The season query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(bounds: SeasonInput) => void`,signature:{arguments:[{type:{name:`SeasonInput`},name:`bounds`}],return:{name:`void`}}},description:``}}}})),y,b,x,S,C,w,T,E,D,O,k;e((()=>{v(),{expect:y,fn:b,waitFor:x}=__STORYBOOK_MODULE_TEST__,S={title:`features/team-settings/TeamSettingsView`,component:h,args:{onSave:b()}},C={args:{isLoading:!0},play:async({canvas:e})=>{await y(e.getByText(`Loading…`)).toBeInTheDocument(),await y(e.queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument()}},w={args:{isError:!0},play:async({canvas:e})=>{await y(e.getByText(`Couldn't load team settings. Please try again.`)).toBeInTheDocument(),await y(e.queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument()}},T={args:{season:{}},play:async({canvas:e})=>{await y(e.getByText(`No season set — events can be scheduled on any date.`)).toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},E={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e})=>{await y(e.getByLabelText(`Start date`)).toHaveValue(`2026-09-01`),await y(e.getByLabelText(`End date`)).toHaveValue(`2027-04-30`),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled(),await y(e.queryByRole(`alert`)).not.toBeInTheDocument()}},D={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Start date`);await t.clear(r),await t.type(r,`2026-10-01`),await x(()=>y(e.getByRole(`alert`)).toHaveTextContent(/won't move or delete existing events/));let i=e.getByRole(`button`,{name:`Save season`});await y(i).toBeEnabled(),await t.click(i),await y(n.onSave).toHaveBeenCalledWith({start:`2026-10-01`,end:`2027-04-30`})}},O={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`End date`);await t.clear(n),await t.type(n,`2026-08-01`),await x(()=>y(e.getByText(`End date must be on or after the start date.`)).toBeInTheDocument()),await y(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    // The form is suppressed while the query is in flight — no save control yet.
    await expect(canvas.queryByRole('button', {
      name: 'Save season'
    })).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load team settings. Please try again.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Save season'
    })).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`Loading`,`ErrorState`,`Unset`,`Set`,`ChangeWarning`,`InvalidRange`]}))();export{D as ChangeWarning,w as ErrorState,O as InvalidRange,C as Loading,E as Set,T as Unset,k as __namedExportsOrder,S as default};