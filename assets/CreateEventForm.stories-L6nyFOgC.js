import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./CreateEventForm-DEXurdYQ.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),{expect:r,fn:i,within:a}=__STORYBOOK_MODULE_TEST__,o=[{id:`et-1`,name:`Match`,color:`#3b82f6`},{id:`et-2`,name:`Training`,color:`#22c55e`}],s={title:`features/create-event/CreateEventForm`,component:n,args:{onSubmit:()=>{}}},c={args:{eventTypes:o,isPending:!1},play:async({canvas:e})=>{await r(e.getByText(`Type`)).toBeInTheDocument(),await r(e.getByLabelText(`Title`)).toBeInTheDocument(),await r(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},l={args:{eventTypes:o,isPending:!0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating...`});await r(t).toBeInTheDocument(),await r(t).toBeDisabled()}},u={args:{eventTypes:o,isPending:!1},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await a(document.body).findByRole(`option`,{name:/Match/})),await r(e.getByLabelText(`Title`)).toHaveValue(`Match`)}},d={args:{eventTypes:[],isPending:!1},play:async({canvas:e})=>{await r(e.getByText(`Select type`)).toBeInTheDocument(),await r(e.getByRole(`button`,{name:`Create Event`})).toBeInTheDocument()}},f={args:{eventTypes:o,isPending:!1},play:async({canvas:e,userEvent:t})=>{await r(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await r(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await r(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await r(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await r(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await r(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument()}},p={args:{eventTypes:o,isPending:!1,error:`Could not create the event. Please try again.`},play:async({canvas:e})=>{let t=e.getByRole(`alert`);await r(t).toHaveTextContent(`Could not create the event. Please try again.`)}},m={args:{eventTypes:o,isPending:!1,onSubmit:i()},play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getAllByRole(`combobox`)[0]),await n.click(await a(document.body).findByRole(`option`,{name:/Match/})),await n.type(t.getByLabelText(`Start time`),`2026-08-01T20:00`),await n.click(t.getByRole(`button`,{name:`Create Event`})),await r(e.onSubmit).toHaveBeenCalledTimes(1);let i=e.onSubmit.mock.calls[0][0],o=(new Date(i.endTime).getTime()-new Date(i.startTime).getTime())/6e4;await r(o).toBe(120)}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Submitting`,`TypeSelected`,`NoEventTypes`,`AddingLinks`,`CreateFailed`,`DerivesEndTimeFromDuration`]})))()}g();export{f as AddingLinks,p as CreateFailed,c as Default,m as DerivesEndTimeFromDuration,d as NoEventTypes,l as Submitting,u as TypeSelected,h as __namedExportsOrder,s as default};