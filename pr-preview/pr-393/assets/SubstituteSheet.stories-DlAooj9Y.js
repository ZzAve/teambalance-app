import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,r as n}from"./event-fixtures-C1ds5yXh.js";import{n as r,t as i}from"./SubstituteSheet-DA3XZdE_.js";var a,o,s,c,l,u;function d(){return(d=e((()=>{n(),r(),{expect:a,fn:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`features/call-in-substitutes/SubstituteSheet`,component:i,args:{substitute:t(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},state:`MAYBE`}),setBy:`Sanne`,onSetState:o(),onTakeOff:o(),onClose:o()}},l={play:async({userEvent:e,args:t})=>{let n=s(await s(document.body).findByRole(`dialog`,{name:`Jan de Vries`}));await a(n.getByText(`Substitute · Libero · set by Sanne`)).toBeInTheDocument(),await a(n.getByRole(`button`,{name:`Maybe`})).toHaveAttribute(`aria-pressed`,`true`),await a(n.getByRole(`button`,{name:`Take off this event`})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:`Going`})),await a(t.onSetState).toHaveBeenCalledWith(`sub-1`,`ATTENDING`),await a(t.onClose).toHaveBeenCalled(),document.activeElement?.blur()}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Jan de Vries'
    }));
    await expect(sheet.getByText('Substitute · Libero · set by Sanne')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: 'Maybe'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(sheet.getByRole('button', {
      name: 'Take off this event'
    })).toBeInTheDocument();

    // Picking an answer reports the Substitute's id and closes the sheet. \`substitute\` is a fixed
    // arg, so the sheet stays open for the picture.
    await userEvent.click(sheet.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'ATTENDING');
    await expect(args.onClose).toHaveBeenCalled()
    // The click left focus on the button; its ring would read as a second selection in the picture.
;
    (document.activeElement as HTMLElement | null)?.blur();
  }
}`,...l.parameters?.docs?.source}}},u=[`Open`]})))()}d();export{l as Open,u as __namedExportsOrder,c as default};