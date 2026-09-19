import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./router-decorator-CakS7x0S.js";import{r as o,t as s}from"./app-column-decorator-0nMuVRZm.js";import{n as c,t as l}from"./button-Ce3gpAJ8.js";import{n as u,t as d}from"./PageHeader-RwAg2psb.js";var f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{a(),o(),n(),c(),u(),f=t(),{expect:p,fn:m,within:h}=__STORYBOOK_MODULE_TEST__,g=m(),_={title:`widgets/page-header/PageHeader`,component:d,decorators:[...s.decorators,i],parameters:s.parameters},v={parameters:{chromatic:{disableSnapshot:!0}},args:{title:`Training — Tuesday`},render:()=>(0,f.jsx)(r,{items:{"Title only":(0,f.jsx)(d,{title:`Training — Tuesday`}),"With back":(0,f.jsx)(d,{title:`Training — Tuesday`,backTo:`/`,backLabel:`Back to events`}),"With back and actions":(0,f.jsx)(d,{title:`Training — Tuesday`,backTo:`/`,backLabel:`Back to events`,actions:(0,f.jsx)(l,{variant:`outline`,size:`sm`,onClick:()=>g(),children:`Edit`})}),"Long title":(0,f.jsx)(d,{title:`Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam`,backTo:`/`,backLabel:`Back to events`}),"Sticky offset":(0,f.jsx)(`div`,{style:{"--header-height":`80px`},children:(0,f.jsx)(d,{title:`Training — Tuesday`})})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>h(e.getByRole(`region`,{name:t}));await p(n(`Title only`).getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument(),await p(n(`Title only`).queryByRole(`link`)).not.toBeInTheDocument();let r=n(`With back`).getByRole(`link`,{name:`Back to events`});await p(r).toHaveAttribute(`href`,`/`),await p(n(`With back`).getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument(),await p(n(`With back and actions`).getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),g.mockClear(),await t.click(n(`With back and actions`).getByRole(`button`,{name:`Edit`})),await p(g).toHaveBeenCalledTimes(1),await p(n(`Long title`).getByRole(`heading`)).toHaveClass(`truncate`);let i=n(`Sticky offset`).getByRole(`heading`).parentElement;await p(getComputedStyle(i).top).toBe(`80px`)}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Gallery`]})))()}b();export{v as Gallery,y as __namedExportsOrder,_ as default};