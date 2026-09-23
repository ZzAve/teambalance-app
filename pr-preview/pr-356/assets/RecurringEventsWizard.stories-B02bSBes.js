import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{o as i,r as a}from"./event-fixtures-CuRrQuRB.js";import{n as o,t as s}from"./RecurringEventsWizard-C0BcVCaX.js";async function c(e,t){await t.click(e.getByRole(`combobox`)),await t.click(await f(document.body).findByRole(`option`,{name:/Training/}))}var l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{a(),n(),o(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p=[i({id:`et-1`,name:`Training`,color:`#225C9C`}),i({id:`et-2`,name:`Match`,color:`#249E6C`})],m={title:`features/create-recurring-events/RecurringEventsWizard`,component:s,args:{eventTypes:p,season:{start:`2026-09-01`,end:`2027-05-31`},isPending:!1,today:`2026-08-01`,onSubmit:d()}},h={play:async({canvas:e,userEvent:t})=>{await c(e,t),await u(e.getByLabelText(`Title`)).toHaveValue(`Training`),await u(e.getByRole(`button`,{name:/Next/})).toBeEnabled()}},g={render:e=>(0,l.jsx)(r,{items:{Empty:(0,l.jsx)(s,{...e})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Empty`).getByText(`Details`)).toBeInTheDocument(),await u(t(`Empty`).getByRole(`button`,{name:/Next/})).toBeDisabled()}},_={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,l.jsx)(r,{items:{Series:(0,l.jsx)(s,{...e}),OverCap:(0,l.jsx)(s,{...e,season:{start:`2026-01-01`,end:`2027-12-31`},today:`2025-12-01`}),Submitting:(0,l.jsx)(s,{...e,isPending:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>f(e.getByRole(`region`,{name:t}));await c(r(`Series`),t),await t.click(r(`Series`).getByRole(`button`,{name:/Next/})),await u(r(`Series`).getByText(`On`)).toBeInTheDocument();let i=r(`Series`).getByTestId(`occurrence-count`);await u(i).toBeInTheDocument(),await u(i).not.toHaveTextContent(`0 events`),await t.click(r(`Series`).getByRole(`button`,{name:/Next/})),await t.click(r(`Series`).getByRole(`button`,{name:/Create/})),await u(n.onSubmit).toHaveBeenCalledWith(u.objectContaining({eventTypeId:`et-1`,title:`Training`})),await c(r(`OverCap`),t),await t.click(r(`OverCap`).getByRole(`button`,{name:/Next/})),await u(r(`OverCap`).getByText(/over 200 events/i)).toBeInTheDocument(),await u(r(`OverCap`).getByRole(`button`,{name:/Next/})).toBeDisabled(),await c(r(`Submitting`),t),await t.click(r(`Submitting`).getByRole(`button`,{name:/Next/})),await t.click(r(`Submitting`).getByRole(`button`,{name:/Next/})),await u(r(`Submitting`).getByRole(`button`,{name:/Creating/})).toBeDisabled()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    // A type picked auto-suggests the title and unlocks Next.
    await chooseTraining(canvas, userEvent);
    await expect(canvas.getByLabelText('Title')).toHaveValue('Training');
    await expect(canvas.getByRole('button', {
      name: /Next/
    })).toBeEnabled();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Nothing chosen yet — Next is blocked until a type + title exist.
    Empty: <RecurringEventsWizard {...args} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Empty').getByText('Details')).toBeInTheDocument();
    await expect(region('Empty').getByRole('button', {
      name: /Next/
    })).toBeDisabled();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Series: <RecurringEventsWizard {...args} />,
    // Over-cap: a two-season-wide window blows past the 200 cap.
    OverCap: <RecurringEventsWizard {...args} season={{
      start: '2026-01-01',
      end: '2027-12-31'
    }} today="2025-12-01" />,
    Submitting: <RecurringEventsWizard {...args} isPending />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Step 2 with the live preview — the default Tue+Thu weekly series renders a running count.
    await chooseTraining(region('Series'), userEvent);
    await userEvent.click(region('Series').getByRole('button', {
      name: /Next/
    }));
    await expect(region('Series').getByText('On')).toBeInTheDocument();
    const count = region('Series').getByTestId('occurrence-count');
    await expect(count).toBeInTheDocument();
    await expect(count).not.toHaveTextContent('0 events');

    // Prop-contract: walking the wizard to the end and confirming fires onSubmit with the assembled
    // request — the chosen type + auto-filled title carry through the three steps to the mutation.
    await userEvent.click(region('Series').getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(region('Series').getByRole('button', {
      name: /Create/
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      eventTypeId: 'et-1',
      title: 'Training'
    }));

    // Over-cap: the preview warns and Next stays blocked.
    await chooseTraining(region('OverCap'), userEvent);
    await userEvent.click(region('OverCap').getByRole('button', {
      name: /Next/
    }));
    await expect(region('OverCap').getByText(/over 200 events/i)).toBeInTheDocument();
    await expect(region('OverCap').getByRole('button', {
      name: /Next/
    })).toBeDisabled();

    // Submitting — the confirm button reflects the pending mutation.
    await chooseTraining(region('Submitting'), userEvent);
    await userEvent.click(region('Submitting').getByRole('button', {
      name: /Next/
    }));
    await userEvent.click(region('Submitting').getByRole('button', {
      name: /Next/
    }));
    await expect(region('Submitting').getByRole('button', {
      name: /Creating/
    })).toBeDisabled();
  }
}`,..._.parameters?.docs?.source}}},v=[`Data`,`Shells`,`Interactions`]})))()}y();export{h as Data,_ as Interactions,g as Shells,v as __namedExportsOrder,m as default};