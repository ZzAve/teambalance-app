import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n}from"./event-fixtures-BTSzdoeq.js";import{n as r,t as i}from"./CreateEventForm-qo9KytQc.js";var a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),r(),{expect:a,fn:o,within:s}=__STORYBOOK_MODULE_TEST__,c=[t({id:`et-1`,name:`Match`,color:`#3b82f6`}),t({id:`et-2`,name:`Training`,color:`#22c55e`})],l={title:`features/create-event/CreateEventForm`,component:i,args:{onSubmit:()=>{}}},u={args:{eventTypes:c,isPending:!1},play:async({canvas:e})=>{await a(e.getByText(`Type`)).toBeInTheDocument(),await a(e.getByLabelText(`Title`)).toBeInTheDocument(),await a(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},d={args:{eventTypes:c,isPending:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating...`});await a(t).toBeInTheDocument(),await a(t).toBeDisabled()}},f={args:{eventTypes:c,isPending:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await s(document.body).findByRole(`option`,{name:/Match/})),await a(e.getByLabelText(`Title`)).toHaveValue(`Match`)}},p={args:{eventTypes:[],isPending:!1},play:async({canvas:e})=>{await a(e.getByText(`Select type`)).toBeInTheDocument(),await a(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument()}},m={args:{eventTypes:c,isPending:!1},play:async({canvas:e,userEvent:t})=>{await a(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await a(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await a(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await a(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await a(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await a(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},h={args:{eventTypes:c,isPending:!1,error:`Could not create the event. Please try again.`},play:async({canvas:e})=>{let t=e.getByRole(`alert`);await a(t).toHaveTextContent(`Could not create the event. Please try again.`)}},g={args:{eventTypes:c,isPending:!1,onSubmit:o()},play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getAllByRole(`combobox`)[0]),await n.click(await s(document.body).findByRole(`option`,{name:/Match/})),await n.type(t.getByLabelText(`Start time`),`2026-08-01T20:00`),await n.click(t.getByRole(`button`,{name:`Create Event`})),await a(e.onSubmit).toHaveBeenCalledTimes(1);let r=e.onSubmit.mock.calls[0][0],i=(new Date(r.endTime).getTime()-new Date(r.startTime).getTime())/6e4;await a(i).toBe(120)}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Type')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Title')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeEnabled();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    const submit = canvas.getByRole('button', {
      name: 'Creating...'
    });
    await expect(submit).toBeInTheDocument();
    await expect(submit).toBeDisabled();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    // Selecting a type auto-suggests the title (until the user edits it themselves).
    // Two comboboxes now (Type, Duration); Type is first in DOM order.
    await userEvent.click(canvas.getAllByRole('combobox')[0]);
    await userEvent.click(await within(document.body).findByRole('option', {
      name: /Match/
    }));
    await expect(canvas.getByLabelText('Title')).toHaveValue('Match');
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: [],
    isPending: false
  },
  play: async ({
    canvas
  }) => {
    // With no types loaded, the selector shows its placeholder and the form is still rendered.
    await expect(canvas.getByText('Select type')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    // No link rows until "Add link" is clicked.
    await expect(canvas.queryByLabelText('Link 1 URL')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 label')).toBeInTheDocument();

    // A second row is independent.
    await userEvent.click(canvas.getByRole('button', {
      name: /Add link/
    }));
    await expect(canvas.getByLabelText('Link 2 URL')).toBeInTheDocument();

    // Removing the first row collapses the list back to one.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Remove link 1'
    }));
    await expect(canvas.queryByLabelText('Link 2 URL')).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false,
    error: 'Could not create the event. Please try again.'
  },
  play: async ({
    canvas
  }) => {
    // A failed create must surface feedback (regression: the dialog previously stayed open silently
    // on a 500). The message is exposed as an alert so assistive tech announces it.
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Could not create the event. Please try again.');
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    eventTypes: EVENT_TYPES,
    isPending: false,
    onSubmit: fn()
  },
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    // endTime is required by the contract; the form derives it from startTime + the (default 2h)
    // duration so a valid end is always sent — the fix for "create without endTime → 500".
    await userEvent.click(canvas.getAllByRole('combobox')[0]);
    await userEvent.click(await within(document.body).findByRole('option', {
      name: /Match/
    }));
    await userEvent.type(canvas.getByLabelText('Start time'), '2026-08-01T20:00');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create Event'
    }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];
    // Default duration is 2h — assert the span rather than an absolute UTC value so the test is
    // independent of the runner's timezone.
    const spanMinutes = (new Date(submitted.endTime).getTime() - new Date(submitted.startTime).getTime()) / 60_000;
    await expect(spanMinutes).toBe(120);
  }
}`,...g.parameters?.docs?.source}}},_=[`Default`,`Submitting`,`TypeSelected`,`NoEventTypes`,`AddingLinks`,`CreateFailed`,`DerivesEndTimeFromDuration`]})))()}v();export{m as AddingLinks,h as CreateFailed,u as Default,g as DerivesEndTimeFromDuration,p as NoEventTypes,d as Submitting,f as TypeSelected,_ as __namedExportsOrder,l as default};