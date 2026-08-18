import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CDjj3s1N.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-BIeu3nlO.js";import{n as a,t as o}from"./input-CNQNw15L.js";import{n as s,t as c}from"./label-BZJOh2TC.js";function l(e){return e||void 0}function u(e){return l(e.start)!==void 0||l(e.end)!==void 0}function d(e){let t=l(e.start),n=l(e.end);return t&&n&&n<t?`End date must be on or after the start date.`:null}function f(e,t){return l(e.start)!==l(t.start)||l(e.end)!==l(t.end)}function p({season:e={},isLoading:t,isError:n,isSaving:r,error:a,onSave:s}){let[l,p]=(0,m.useState)(e.start??``),[g,_]=(0,m.useState)(e.end??``),v={start:l,end:g},y=d(v),b=f(e,v),x=b&&(u(e)||u(v));return(0,h.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Season`}),(0,h.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Bound your team's events to a season. Once set, events cannot be scheduled outside this window.`})]}),t&&(0,h.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,h.jsx)(`p`,{className:`text-sm text-red`,children:`Couldn't load team settings. Please try again.`}),!t&&!n&&(0,h.jsxs)(h.Fragment,{children:[!u(e)&&!b&&(0,h.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No season set — events can be scheduled on any date.`}),(0,h.jsxs)(`div`,{className:`flex flex-wrap gap-4`,children:[(0,h.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,h.jsx)(c,{htmlFor:`season-start`,children:`Start date`}),(0,h.jsx)(o,{id:`season-start`,type:`date`,value:l,max:g||void 0,onChange:e=>p(e.target.value),className:`w-48`})]}),(0,h.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,h.jsx)(c,{htmlFor:`season-end`,children:`End date`}),(0,h.jsx)(o,{id:`season-end`,type:`date`,value:g,min:l||void 0,onChange:e=>_(e.target.value),className:`w-48`})]})]}),y&&(0,h.jsx)(`p`,{className:`text-sm text-red`,children:y}),x&&!y&&(0,h.jsx)(`p`,{className:`rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-foreground`,role:`alert`,children:`Changing the season won't move or delete existing events — some may now fall outside the new window.`}),a&&(0,h.jsx)(`p`,{className:`text-sm text-red`,children:a}),(0,h.jsx)(`div`,{children:(0,h.jsx)(i,{disabled:r||!b||!!y,onClick:()=>{y||!b||s({start:l||void 0,end:g||void 0})},children:r?`Saving…`:`Save season`})})]})]})}var m,h;function g(){return(g=e((()=>{m=t(),r(),a(),s(),h=n(),p.__docgenInfo={description:`Presentational Team Settings UI — the complete section, heading and all: the season start/end
pickers. Owns only local draft state; the query + mutation live in the TeamSettings container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / unset / set / change-warning — renders purely from
props as a story (see TeamSettingsView.stories.tsx), with no network. Editing an already-configured
season surfaces a non-blocking warning — changing the window never moves or deletes existing events.`,methods:[],displayName:`TeamSettingsView`,props:{season:{required:!1,tsType:{name:`SeasonBounds`},description:`The saved season (the baseline the draft is compared against); defaults to an unset season.`,defaultValue:{value:`{}`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:`The season query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The season query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(bounds: SeasonInput) => void`,signature:{arguments:[{type:{name:`SeasonInput`},name:`bounds`}],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{g(),{expect:_,fn:v,waitFor:y}=__STORYBOOK_MODULE_TEST__,b={title:`features/team-settings/TeamSettingsView`,component:p,args:{onSave:v()}},x={args:{isLoading:!0},play:async({canvas:e})=>{await _(e.getByText(`Loading…`)).toBeInTheDocument(),await _(e.queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument()}},S={args:{isError:!0},play:async({canvas:e})=>{await _(e.getByText(`Couldn't load team settings. Please try again.`)).toBeInTheDocument(),await _(e.queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument()}},C={args:{season:{}},play:async({canvas:e})=>{await _(e.getByText(`No season set — events can be scheduled on any date.`)).toBeInTheDocument(),await _(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},w={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e})=>{await _(e.getByLabelText(`Start date`)).toHaveValue(`2026-09-01`),await _(e.getByLabelText(`End date`)).toHaveValue(`2027-04-30`),await _(e.getByRole(`button`,{name:`Save season`})).toBeDisabled(),await _(e.queryByRole(`alert`)).not.toBeInTheDocument()}},T={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Start date`);await t.clear(r),await t.type(r,`2026-10-01`),await y(()=>_(e.getByRole(`alert`)).toHaveTextContent(/won't move or delete existing events/));let i=e.getByRole(`button`,{name:`Save season`});await _(i).toBeEnabled(),await t.click(i),await _(n.onSave).toHaveBeenCalledWith({start:`2026-10-01`,end:`2027-04-30`})}},E={args:{season:{start:`2026-09-01`,end:`2027-04-30`}},play:async({canvas:e,userEvent:t})=>{let n=e.getByLabelText(`End date`);await t.clear(n),await t.type(n,`2026-08-01`),await y(()=>_(e.getByText(`End date must be on or after the start date.`)).toBeInTheDocument()),await _(e.getByRole(`button`,{name:`Save season`})).toBeDisabled()}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D=[`Loading`,`ErrorState`,`Unset`,`Set`,`ChangeWarning`,`InvalidRange`]})))()}O();export{T as ChangeWarning,S as ErrorState,E as InvalidRange,x as Loading,w as Set,C as Unset,D as __namedExportsOrder,b as default};