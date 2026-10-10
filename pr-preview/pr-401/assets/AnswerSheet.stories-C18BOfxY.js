import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./AnswerSheet-Uk_CaPUu.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{t(),{expect:r,fn:i,within:a}=__STORYBOOK_MODULE_TEST__,o={title:`features/attendance-toggle/AnswerSheet`,component:n,args:{target:{userId:`u-4`,displayName:`Sofia`,state:`MAYBE`,isSelf:!1,position:`Middle`},onRespond:i(),onClose:i()}},s={play:async({userEvent:e,args:t})=>{let n=a(await a(document.body).findByRole(`dialog`));await r(n.getByText(`Sofia`)).toBeInTheDocument(),await r(n.getByText(`Middle · currently maybe · you are answering for them`)).toBeInTheDocument(),await r(n.getByRole(`button`,{name:`Maybe`})).toHaveAttribute(`aria-pressed`,`true`),await e.click(n.getByRole(`button`,{name:`Can't go`})),await r(t.onRespond).toHaveBeenCalledWith(`u-4`,`ABSENT`),await r(t.onClose).toHaveBeenCalled(),document.activeElement?.blur()}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  play: async ({
    userEvent,
    args
  }) => {
    // The sheet is a portal: queried from the document, not the canvas (same as EventDetailView and
    // EventLineupPanel's Interactions).
    const sheet = within(await within(document.body).findByRole('dialog'));
    await expect(sheet.getByText('Sofia')).toBeInTheDocument();
    // A teammate's row, not the viewer's own: the sheet says so plainly (ADR-0003).
    await expect(sheet.getByText('Middle · currently maybe · you are answering for them')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: 'Maybe'
    })).toHaveAttribute('aria-pressed', 'true');

    // Picking an option reports the *target* member's id, never the viewer's, and closes the sheet.
    await userEvent.click(sheet.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-4', 'ABSENT');
    await expect(args.onClose).toHaveBeenCalled()
    // The click left focus on the button; its ring would read as a second selection in the picture.
;
    (document.activeElement as HTMLElement | null)?.blur();
  }
}`,...s.parameters?.docs?.source}}},c=[`Open`]})))()}l();export{s as Open,c as __namedExportsOrder,o as default};