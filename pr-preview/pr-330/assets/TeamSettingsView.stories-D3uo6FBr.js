import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BBGrpB76.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./button-Djr1cczI.js";import{n as s,t as c}from"./input-DehWHqXb.js";import{n as l,t as u}from"./label-Cp7GISFn.js";function d(e){return e||void 0}function f(e){return d(e.start)!==void 0||d(e.end)!==void 0}function p(e){let t=d(e.start),n=d(e.end);return t&&n&&n<t?`End date must be on or after the start date.`:null}function m(e,t){return d(e.start)!==d(t.start)||d(e.end)!==d(t.end)}function h({season:e={},isLoading:t,isError:n,isSaving:r,error:i,onSave:a}){let[s,l]=(0,g.useState)(e.start??``),[d,h]=(0,g.useState)(e.end??``),v={start:s,end:d},y=p(v),b=m(e,v),x=b&&(f(e)||f(v));return(0,_.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Season`}),(0,_.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Bound your team's events to a season. Once set, events cannot be scheduled outside this window.`})]}),t&&(0,_.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),n&&(0,_.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load team settings. Please try again.`}),!t&&!n&&(0,_.jsxs)(_.Fragment,{children:[!f(e)&&!b&&(0,_.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No season set — events can be scheduled on any date.`}),(0,_.jsxs)(`div`,{className:`flex flex-wrap gap-4`,children:[(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(u,{htmlFor:`season-start`,children:`Start date`}),(0,_.jsx)(c,{id:`season-start`,type:`date`,value:s,max:d||void 0,onChange:e=>l(e.target.value),className:`w-48`})]}),(0,_.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,_.jsx)(u,{htmlFor:`season-end`,children:`End date`}),(0,_.jsx)(c,{id:`season-end`,type:`date`,value:d,min:s||void 0,onChange:e=>h(e.target.value),className:`w-48`})]})]}),y&&(0,_.jsx)(`p`,{className:`text-small text-red`,children:y}),x&&!y&&(0,_.jsx)(`p`,{className:`rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-small text-foreground`,role:`alert`,children:`Changing the season won't move or delete existing events — some may now fall outside the new window.`}),i&&(0,_.jsx)(`p`,{className:`text-small text-red`,children:i}),(0,_.jsx)(`div`,{children:(0,_.jsx)(o,{disabled:r||!b||!!y,onClick:()=>{y||!b||a({start:s||void 0,end:d||void 0})},children:r?`Saving…`:`Save season`})})]})]})}var g,_;function v(){return(v=e((()=>{g=t(),a(),s(),l(),_=n(),h.__docgenInfo={description:`Presentational Team Settings UI — the complete section, heading and all: the season start/end
pickers. Owns only local draft state; the query + mutation live in the TeamSettings container.

The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
container, so every state — loading / error / unset / set / change-warning — renders purely from
props as a story (see TeamSettingsView.stories.tsx), with no network. Editing an already-configured
season surfaces a non-blocking warning — changing the window never moves or deletes existing events.`,methods:[],displayName:`TeamSettingsView`,props:{season:{required:!1,tsType:{name:`SeasonBounds`},description:`The saved season (the baseline the draft is compared against); defaults to an unset season.`,defaultValue:{value:`{}`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:`The season query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The season query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(bounds: SeasonInput) => void`,signature:{arguments:[{type:{name:`SeasonInput`},name:`bounds`}],return:{name:`void`}}},description:``}}}})))()}var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{r(),v(),y=n(),{expect:b,fn:x,waitFor:S,within:C}=__STORYBOOK_MODULE_TEST__,w={title:`features/team-settings/TeamSettingsView`,component:h,args:{season:{start:`2026-09-01`,end:`2027-04-30`},onSave:x()}},T={play:async({canvas:e})=>{await b(e.getByLabelText(`Start date`)).toHaveValue(`2026-09-01`),await b(e.getByLabelText(`End date`)).toHaveValue(`2027-04-30`),await b(e.getByRole(`button`,{name:`Save season`})).toBeDisabled(),await b(e.queryByRole(`alert`)).not.toBeInTheDocument()}},E={render:e=>(0,y.jsx)(i,{items:{Loading:(0,y.jsx)(h,{...e,isLoading:!0}),Error:(0,y.jsx)(h,{...e,isError:!0}),Unset:(0,y.jsx)(h,{...e,season:{}})}}),play:async({canvas:e})=>{let t=t=>C(e.getByRole(`region`,{name:t}));await b(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await b(t(`Loading`).queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument(),await b(t(`Error`).getByText(`Couldn't load team settings. Please try again.`)).toBeInTheDocument(),await b(t(`Error`).queryByRole(`button`,{name:`Save season`})).not.toBeInTheDocument(),await b(t(`Unset`).getByText(`No season set — events can be scheduled on any date.`)).toBeInTheDocument(),await b(t(`Unset`).getByRole(`button`,{name:`Save season`})).toBeDisabled()}},D={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`End date`);await t.clear(r),await t.type(r,`2026-08-01`),await S(()=>b(e.getByText(`End date must be on or after the start date.`)).toBeInTheDocument()),await b(e.getByRole(`button`,{name:`Save season`})).toBeDisabled(),await t.clear(r),await t.type(r,`2027-04-30`);let i=e.getByLabelText(`Start date`);await t.clear(i),await t.type(i,`2026-10-01`),await S(()=>b(e.getByRole(`alert`)).toHaveTextContent(/won't move or delete existing events/));let a=e.getByRole(`button`,{name:`Save season`});await b(a).toBeEnabled(),await t.click(a),await b(n.onSave).toHaveBeenCalledWith({start:`2026-10-01`,end:`2027-04-30`})}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <TeamSettingsView {...args} isLoading />,
    Error: <TeamSettingsView {...args} isError />,
    Unset: <TeamSettingsView {...args} season={{}} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    // The form is suppressed while the query is in flight — no save control yet.
    await expect(region('Loading').queryByRole('button', {
      name: 'Save season'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load team settings. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByRole('button', {
      name: 'Save season'
    })).not.toBeInTheDocument();
    await expect(region('Unset').getByText('No season set — events can be scheduled on any date.')).toBeInTheDocument();
    // Nothing to save until the user picks a date.
    await expect(region('Unset').getByRole('button', {
      name: 'Save season'
    })).toBeDisabled();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const end = canvas.getByLabelText('End date');
    await userEvent.clear(end);
    await userEvent.type(end, '2026-08-01');
    await waitFor(() => expect(canvas.getByText('End date must be on or after the start date.')).toBeInTheDocument());
    // An inverted range blocks the save.
    await expect(canvas.getByRole('button', {
      name: 'Save season'
    })).toBeDisabled();

    // Fixing the range back up unblocks it again.
    await userEvent.clear(end);
    await userEvent.type(end, '2027-04-30');
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
}`,...D.parameters?.docs?.source}}},O=[`Data`,`Shells`,`Interactions`]})))()}k();export{T as Data,D as Interactions,E as Shells,O as __namedExportsOrder,w as default};