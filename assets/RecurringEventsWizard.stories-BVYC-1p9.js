import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./RecurringEventsWizard-CQSISyS4.js";async function r(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await o(document.body).findByRole(`option`,{name:/Training/}))}var i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),{expect:i,fn:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`features/create-recurring-events/RecurringEventsWizard`,component:n,args:{eventTypes:[{id:`et-1`,name:`Training`,color:`#225C9C`},{id:`et-2`,name:`Match`,color:`#249E6C`}],season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:a()}},c={play:async({canvas:e})=>{await i(e.getByText(`Details`)).toBeInTheDocument(),await i(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},l={play:async({canvas:e,userEvent:t})=>{await r(e,t),await i(e.getByLabelText(`Title`)).toHaveValue(`Training`),await i(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},u={play:async({canvas:e,userEvent:t})=>{await r(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await i(e.getByText(`On`)).toBeInTheDocument();let n=e.getByTestId(`occurrence-count`);await i(n).toBeInTheDocument(),await i(n).not.toHaveTextContent(`0 events`)}},d={args:{season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`},play:async({canvas:e,userEvent:t})=>{await r(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await i(e.getByText(/over 200 events/i)).toBeInTheDocument(),await i(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},f={play:async({canvas:e,userEvent:t,args:n})=>{await r(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Create/})),await i(n.onSubmit).toHaveBeenCalledWith(i.objectContaining({eventTypeId:`et-1`,title:`Training`}))}},p={args:{isPending:!0},play:async({canvas:e,userEvent:t})=>{await r(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await i(e.getByRole(`button`,{name:/Creating/})).toBeDisabled()}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await expect(canvas.getByLabelText('Title')).toHaveValue('Training');
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeEnabled();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByText('On')).toBeInTheDocument();
    const count = canvas.getByTestId('occurrence-count');
    await expect(count).toBeInTheDocument();
    await expect(count).not.toHaveTextContent('0 events');
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    season: {
      start: '2026-01-01',
      end: '2027-12-31'
    },
    today: '2025-12-01'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByText(/over 200 events/i)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Create/
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      eventTypeId: 'et-1',
      title: 'Training'
    }));
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await chooseTraining(canvas, userEvent);
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /Next/
    }));
    await expect(canvas.getByRole('button', {
      name: /Creating/
    })).toBeDisabled();
  }
}`,...p.parameters?.docs?.source}}},m=[`DetailsEmpty`,`DetailsFilled`,`RecurrencePreview`,`OverCap`,`CreateSeries`,`Submitting`]})))()}h();export{f as CreateSeries,c as DetailsEmpty,l as DetailsFilled,d as OverCap,u as RecurrencePreview,p as Submitting,m as __namedExportsOrder,s as default};