import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./router-decorator-Bt7JvMFd.js";import{n as o,t as s}from"./button-W1GRNbO0.js";import{n as c,t as l}from"./PageHeader-BfPUsDqq.js";var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{a(),n(),o(),c(),u=t(),{expect:d,fn:f,within:p}=__STORYBOOK_MODULE_TEST__,m=f(),h={title:`widgets/page-header/PageHeader`,component:l,decorators:[e=>(0,u.jsx)(`div`,{className:`mx-auto max-w-2xl px-4`,children:(0,u.jsx)(e,{})}),i]},g={parameters:{chromatic:{disableSnapshot:!0}},args:{title:`Training — Tuesday`},render:()=>(0,u.jsx)(r,{items:{"Title only":(0,u.jsx)(l,{title:`Training — Tuesday`}),"With back":(0,u.jsx)(l,{title:`Training — Tuesday`,backTo:`/`,backLabel:`Back to events`}),"With back and actions":(0,u.jsx)(l,{title:`Training — Tuesday`,backTo:`/`,backLabel:`Back to events`,actions:(0,u.jsx)(s,{variant:`outline`,size:`sm`,onClick:()=>m(),children:`Edit`})}),"Long title":(0,u.jsx)(l,{title:`Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam`,backTo:`/`,backLabel:`Back to events`}),"Sticky offset":(0,u.jsx)(`div`,{style:{"--header-height":`80px`},children:(0,u.jsx)(l,{title:`Training — Tuesday`})})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>p(e.getByRole(`region`,{name:t}));await d(n(`Title only`).getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument(),await d(n(`Title only`).queryByRole(`link`)).not.toBeInTheDocument();let r=n(`With back`).getByRole(`link`,{name:`Back to events`});await d(r).toHaveAttribute(`href`,`/`),await d(n(`With back`).getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument(),await d(n(`With back and actions`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),m.mockClear(),await t.click(n(`With back and actions`).getByRole(`button`,{name:`Edit`})),await d(m).toHaveBeenCalledTimes(1),await d(n(`Long title`).getByRole(`heading`)).toHaveClass(`truncate`);let i=n(`Sticky offset`).getByRole(`heading`).parentElement;await d(getComputedStyle(i).top).toBe(`80px`)}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  // title is required on PageHeader; unused by render below — each Stack instance sets its own.
  args: {
    title: 'Training — Tuesday'
  },
  render: () => <Stack items={{
    // Title only: no back target, no actions — the minimal shape a page can use.
    'Title only': <PageHeader title="Training — Tuesday" />,
    // The event-detail shape: back link into the parent list plus a title.
    'With back': <PageHeader title="Training — Tuesday" backTo="/" backLabel="Back to events" />,
    // Back link plus a trailing actions slot — the actions are the caller's nodes, so the play
    // proves a click reaches the caller's handler rather than being swallowed by the header.
    'With back and actions': <PageHeader title="Training — Tuesday" backTo="/" backLabel="Back to events" actions={<Button variant="outline" size="sm" onClick={() => onAction()}>
                Edit
              </Button>} />,
    // A title long enough to overrun the bar: it must truncate on one line so the back button
    // and the actions slot keep their space (real event titles are user-authored and unbounded).
    'Long title': <PageHeader title="Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam" backTo="/" backLabel="Back to events" />,
    // The sticky offset is the whole point of the widget: it must be *derived* from
    // --header-height, never a hardcoded pixel value that drifts when the app header changes
    // (the F12 defect). Overriding the variable to an off-token value and reading the resolved
    // \`top\` back proves the derivation end-to-end — a plain class assertion would still pass if
    // the offset were re-hardcoded to today's header height.
    'Sticky offset': <div style={{
      '--header-height': '80px'
    } as React.CSSProperties}>
            <PageHeader title="Training — Tuesday" />
          </div>
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Title only').getByRole('heading', {
      name: 'Training — Tuesday'
    })).toBeInTheDocument();
    await expect(region('Title only').queryByRole('link')).not.toBeInTheDocument();
    const back = region('With back').getByRole('link', {
      name: 'Back to events'
    });
    await expect(back).toHaveAttribute('href', '/');
    await expect(region('With back').getByRole('heading', {
      name: 'Training — Tuesday'
    })).toBeInTheDocument();
    await expect(region('With back and actions').getByRole('link', {
      name: 'Back to events'
    })).toBeInTheDocument();
    onAction.mockClear();
    await userEvent.click(region('With back and actions').getByRole('button', {
      name: 'Edit'
    }));
    await expect(onAction).toHaveBeenCalledTimes(1);
    await expect(region('Long title').getByRole('heading')).toHaveClass('truncate');
    const stickyHeading = region('Sticky offset').getByRole('heading').parentElement as HTMLElement;
    await expect(getComputedStyle(stickyHeading).top).toBe('80px');
  }
}`,...g.parameters?.docs?.source}}},_=[`Gallery`]})))()}v();export{g as Gallery,_ as __namedExportsOrder,h as default};