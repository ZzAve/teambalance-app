import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n}from"./event-fixtures-HgN_WguE.js";import{n as r,t as i}from"./RecurringEventsWizard-DCONzb3g.js";async function a(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await c(document.body).findByRole(`option`,{name:/Training/}))}var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),r(),{expect:o,fn:s,within:c}=__STORYBOOK_MODULE_TEST__,l=[t({id:`et-1`,name:`Training`,color:`#225C9C`}),t({id:`et-2`,name:`Match`,color:`#249E6C`})],u={title:`features/create-recurring-events/RecurringEventsWizard`,component:i,args:{eventTypes:l,season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:s()}},d={play:async({canvas:e})=>{await o(e.getByText(`Details`)).toBeInTheDocument(),await o(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},f={play:async({canvas:e,userEvent:t})=>{await a(e,t),await o(e.getByLabelText(`Title`)).toHaveValue(`Training`),await o(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},p={play:async({canvas:e,userEvent:t})=>{await a(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await o(e.getByText(`On`)).toBeInTheDocument();let n=e.getByTestId(`occurrence-count`);await o(n).toBeInTheDocument(),await o(n).not.toHaveTextContent(`0 events`)}},m={args:{season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`},play:async({canvas:e,userEvent:t})=>{await a(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await o(e.getByText(/over 200 events/i)).toBeInTheDocument(),await o(e.getByRole(`button`,{name:/Next/})).toBeDisabled()}},h={play:async({canvas:e,userEvent:t,args:n})=>{await a(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Create/})),await o(n.onSubmit).toHaveBeenCalledWith(o.objectContaining({eventTypeId:`et-1`,title:`Training`}))}},g={args:{isPending:!0},play:async({canvas:e,userEvent:t})=>{await a(e,t),await t.click(e.getByRole(`button`,{name:/Next/})),await t.click(e.getByRole(`button`,{name:/Next/})),await o(e.getByRole(`button`,{name:/Creating/})).toBeDisabled()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`DetailsEmpty`,`DetailsFilled`,`RecurrencePreview`,`OverCap`,`CreateSeries`,`Submitting`]})))()}v();export{h as CreateSeries,d as DetailsEmpty,f as DetailsFilled,m as OverCap,p as RecurrencePreview,g as Submitting,_ as __namedExportsOrder,u as default};