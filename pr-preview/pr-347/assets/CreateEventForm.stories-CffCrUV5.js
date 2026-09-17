import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{o as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./CreateEventForm-D0U3FvMa.js";var c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{a(),n(),o(),c=t(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f=[i({id:`et-1`,name:`Match`,color:`#3b82f6`}),i({id:`et-2`,name:`Training`,color:`#22c55e`})],p={title:`features/create-event/CreateEventForm`,component:s,args:{eventTypes:f,isPending:!1,onSubmit:u()}},m={play:async({canvas:e})=>{await l(e.getByText(`Type`)).toBeInTheDocument(),await l(e.getByLabelText(`Title`)).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Create Event`})).toBeEnabled()}},h={render:e=>(0,c.jsx)(r,{items:{Submitting:(0,c.jsx)(s,{...e,isPending:!0}),"No event types":(0,c.jsx)(s,{...e,eventTypes:[]}),"Create failed":(0,c.jsx)(s,{...e,error:`Could not create the event. Please try again.`})}}),play:async({canvas:e})=>{let t=t=>d(e.getByRole(`region`,{name:t})),n=t(`Submitting`).getByRole(`button`,{name:`Creating...`});await l(n).toBeInTheDocument(),await l(n).toBeDisabled(),await l(t(`No event types`).getByText(`Select type`)).toBeInTheDocument(),await l(t(`No event types`).getByRole(`button`,{name:`Create Event`})).toBeInTheDocument(),await l(t(`Create failed`).getByRole(`alert`)).toHaveTextContent(`Could not create the event. Please try again.`)}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`combobox`)[0]),await t.click(await d(document.body).findByRole(`option`,{name:/Match/})),await l(e.getByLabelText(`Title`)).toHaveValue(`Match`),await l(e.queryByLabelText(`Link 1 URL`)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await l(e.getByLabelText(`Link 1 label`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Add link/})),await l(e.getByLabelText(`Link 2 URL`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Remove link 1`})),await l(e.queryByLabelText(`Link 2 URL`)).not.toBeInTheDocument(),await l(e.getByLabelText(`Link 1 URL`)).toBeInTheDocument(),await t.type(e.getByLabelText(`Start time`),`2026-08-01T20:00`),await t.click(e.getByRole(`button`,{name:`Create Event`})),await l(n.onSubmit).toHaveBeenCalledTimes(1);let r=n.onSubmit.mock.calls[0][0],i=(new Date(r.endTime).getTime()-new Date(r.startTime).getTime())/6e4;await l(i).toBe(120)}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Type')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Title')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create Event'
    })).toBeEnabled();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Submitting: <CreateEventForm {...args} isPending />,
    'No event types': <CreateEventForm {...args} eventTypes={[]} />,
    'Create failed': <CreateEventForm {...args} error="Could not create the event. Please try again." />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const submit = region('Submitting').getByRole('button', {
      name: 'Creating...'
    });
    await expect(submit).toBeInTheDocument();
    await expect(submit).toBeDisabled();

    // With no types loaded, the selector shows its placeholder and the form is still rendered.
    await expect(region('No event types').getByText('Select type')).toBeInTheDocument();
    await expect(region('No event types').getByRole('button', {
      name: 'Create Event'
    })).toBeInTheDocument();

    // A failed create must surface feedback (regression: the dialog previously stayed open silently
    // on a 500). The message is exposed as an alert so assistive tech announces it.
    await expect(region('Create failed').getByRole('alert')).toHaveTextContent('Could not create the event. Please try again.');
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    // Selecting a type auto-suggests the title (until the user edits it themselves).
    // Two comboboxes now (Type, Duration); Type is first in DOM order.
    await userEvent.click(canvas.getAllByRole('combobox')[0]);
    await userEvent.click(await within(document.body).findByRole('option', {
      name: /Match/
    }));
    await expect(canvas.getByLabelText('Title')).toHaveValue('Match');

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

    // endTime is required by the contract; the form derives it from startTime + the (default 2h)
    // duration so a valid end is always sent — the fix for "create without endTime → 500".
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
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`Interactions`]})))()}v();export{m as Data,g as Interactions,h as Shells,_ as __namedExportsOrder,p as default};