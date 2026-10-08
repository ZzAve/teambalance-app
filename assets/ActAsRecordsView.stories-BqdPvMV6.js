import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./chevron-right-Bi9LMFH1.js";function o({records:e=[],isLoading:t,isError:n}){return(0,l.jsxs)(`section`,{children:[(0,l.jsx)(`h3`,{className:`font-display text-lead font-bold`,children:`Platform access`}),(0,l.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`When the people who run TeamBalance worked inside your team.`}),t&&(0,l.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:`Loading…`}),n&&(0,l.jsx)(`p`,{className:`mt-3 text-small text-red`,children:`Couldn't load platform access. Please try again.`}),!t&&!n&&(e.length===0?(0,l.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:`The TeamBalance owner has never worked in your team.`}):(0,l.jsxs)(`details`,{className:`group/list mt-3`,children:[(0,l.jsxs)(`summary`,{className:`flex w-full list-none items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover [&::-webkit-details-marker]:hidden`,children:[(0,l.jsx)(a,{size:16,className:`shrink-0 text-muted-foreground transition-transform duration-200 group-open/list:rotate-90`}),(0,l.jsx)(`span`,{className:`text-small font-medium`,children:u(e.length)})]}),(0,l.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,l.jsx)(`li`,{children:(0,l.jsxs)(`details`,{className:`group/record`,children:[(0,l.jsxs)(`summary`,{className:`flex w-full list-none items-center gap-2 p-3 text-left [&::-webkit-details-marker]:hidden`,children:[(0,l.jsx)(a,{size:15,className:`shrink-0 text-muted-foreground transition-transform duration-200 group-open/record:rotate-90`}),(0,l.jsxs)(`span`,{children:[(0,l.jsxs)(`span`,{className:`block text-small font-medium`,children:[s(e.actorKind),` worked in your team`]}),(0,l.jsx)(`span`,{className:`block text-small text-muted-foreground`,children:c(e)})]})]}),(0,l.jsxs)(`div`,{className:`pb-3 pl-9 pr-3 text-small`,children:[(0,l.jsxs)(`dl`,{className:`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1`,children:[(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Started`}),(0,l.jsx)(`dd`,{children:p(new Date(e.enteredAt))}),(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Ended`}),(0,l.jsx)(`dd`,{children:d(e)}),(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Acting as`}),(0,l.jsx)(`dd`,{children:`An admin of your team`})]}),(0,l.jsxs)(`details`,{className:`mt-3`,children:[(0,l.jsx)(`summary`,{className:`w-fit list-none text-small font-medium text-blue underline underline-offset-4 [&::-webkit-details-marker]:hidden`,children:`Why does this happen?`}),(0,l.jsxs)(`div`,{className:`mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-small text-muted-foreground`,children:[(0,l.jsx)(`p`,{children:`TeamBalance is run by a small team. The owner works inside a team to set it up, prepare a season, or fix something that was reported.`}),(0,l.jsx)(`p`,{children:`Access lasts an hour at a time and is never silent — it is listed here whether or not anything changed.`})]})]})]})]})},`${e.enteredAt}-${e.actorKind}`))})]}))]})}function s(e){return e===`MEMBER`?`A team member`:`The TeamBalance owner`}function c(e){let t=new Date(e.enteredAt),n=f(e);return`${p(t)} – ${t.toDateString()===n.toDateString()?m(n):p(n)}`}var l,u,d,f,p,m;function h(){return(h=e((()=>{i(),l=t(),u=e=>e===1?`The TeamBalance owner worked here once`:`The TeamBalance owner worked here ${e} times`,d=e=>e.exitedAt?`${m(f(e))}, when they left`:`${m(f(e))}, when the hour ran out`,f=e=>new Date(e.exitedAt??e.lastActiveAt),p=e=>e.toLocaleString(void 0,{day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),m=e=>e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),o.__docgenInfo={description:`The Admin-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.

Scoped to the act-as session rather than to individual rows — most tenant tables carry no
authorship column, so per-row attribution structurally cannot cover Season configuration or
Position curation, which is most of what setup is. That is also why nothing here claims a
*change* was made: the record knows access happened, never what came of it.

Quiet by default. Platform access is rare and, to an Admin who has never heard of it, alarming
out of context — so at rest it is one line, and the reasoning is reachable in two more taps
rather than pre-emptively defended on a page visited for other things.

Each level is a native \`<details>\`, so the browser owns open/closed state and keyboard handling.

The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
and no operator email on a surface the team's Admins read.`,methods:[],displayName:`ActAsRecordsView`,props:{records:{required:!1,tsType:{name:`Array`,elements:[{name:`ActAsRecord`}],raw:`ActAsRecord[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),h(),g=t(),{expect:_,userEvent:v,within:y}=__STORYBOOK_MODULE_TEST__,b={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-20T09:00:00Z`,lastActiveAt:`2026-08-20T09:40:00Z`,exitedAt:`2026-08-20T09:45:00Z`},x={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-18T19:00:00Z`,lastActiveAt:`2026-08-18T19:20:00Z`,exitedAt:void 0},S={title:`features/act-as/ActAsRecordsView`,component:o,args:{records:[b,x]}},C={render:e=>(0,g.jsx)(r,{items:{Collapsed:(0,g.jsx)(o,{...e}),Expanded:(0,g.jsx)(o,{...e})}}),play:async({canvas:e})=>{let t=t=>y(e.getByRole(`region`,{name:t})),n=t(`Collapsed`);await _(n.getByText(/worked here 2 times/).closest(`details`)).not.toHaveAttribute(`open`),await _(n.getAllByText(/worked in your team/)[0]).not.toBeVisible();let r=t(`Expanded`);await v.click(r.getByText(/worked here 2 times/)),await v.click(r.getAllByText(/worked in your team/)[0]),await v.click(r.getAllByText(`Why does this happen?`)[0]),await _(r.getAllByText(`Started`)[0]).toBeVisible(),await _(r.getAllByText(/TeamBalance is run by a small team/)[0]).toBeVisible()}},w={render:e=>(0,g.jsx)(r,{items:{Loading:(0,g.jsx)(o,{...e,isLoading:!0}),Error:(0,g.jsx)(o,{...e,isError:!0}),"Never visited":(0,g.jsx)(o,{...e,records:[]}),"One visit":(0,g.jsx)(o,{...e,records:[b]})}}),play:async({canvas:e})=>{let t=t=>y(e.getByRole(`region`,{name:t}));await _(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await _(t(`Error`).getByText(`Couldn't load platform access. Please try again.`)).toBeInTheDocument(),await _(t(`Never visited`).getByText(`The TeamBalance owner has never worked in your team.`)).toBeInTheDocument(),await _(t(`Never visited`).queryByText(/worked here/)).not.toBeInTheDocument(),await _(t(`One visit`).getByText(/worked here once/)).toBeInTheDocument()}},T={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,g.jsx)(r,{items:{Records:(0,g.jsx)(o,{...e}),"Ran out":(0,g.jsx)(o,{...e,records:[x]})}}),play:async({canvas:e})=>{let t=t=>y(e.getByRole(`region`,{name:t}));await v.click(t(`Records`).getByText(/worked here 2 times/)),await _(t(`Records`).getByText(/worked here 2 times/).closest(`details`)).toHaveAttribute(`open`),await _(t(`Records`).getAllByText(`The TeamBalance owner worked in your team`)).toHaveLength(2);let[n]=t(`Records`).getAllByText(/worked in your team/);await v.click(n),await _(t(`Records`).getAllByText(`Started`)[0]).toBeVisible(),await _(t(`Records`).getByText(/when they left/)).toBeVisible(),await _(t(`Records`).getAllByText(`An admin of your team`)[0]).toBeVisible(),await v.click(t(`Records`).getAllByText(`Why does this happen?`)[0]),await _(t(`Records`).getAllByText(/TeamBalance is run by a small team/)[0]).toBeVisible(),await _(t(`Records`).getAllByText(/whether or not anything changed/)[0]).toBeVisible(),await v.click(t(`Ran out`).getByText(/worked here once/)),await v.click(t(`Ran out`).getByText(/worked in your team/)),await _(t(`Ran out`).getByText(/when the hour ran out/)).toBeVisible(),await _(t(`Ran out`).queryByText(/when they left/)).not.toBeInTheDocument()}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Collapsed: <ActAsRecordsView {...args} />,
    Expanded: <ActAsRecordsView {...args} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const collapsed = region('Collapsed');
    await expect(collapsed.getByText(/worked here 2 times/).closest('details')).not.toHaveAttribute('open');
    await expect(collapsed.getAllByText(/worked in your team/)[0]).not.toBeVisible();

    // Open the list, then a record, then its nested reasoning — the deepest disclosure. Each level
    // is a native <details>, so clicking its <summary> is what opens it.
    const expanded = region('Expanded');
    await userEvent.click(expanded.getByText(/worked here 2 times/));
    await userEvent.click(expanded.getAllByText(/worked in your team/)[0]);
    await userEvent.click(expanded.getAllByText('Why does this happen?')[0]);
    await expect(expanded.getAllByText('Started')[0]).toBeVisible();
    await expect(expanded.getAllByText(/TeamBalance is run by a small team/)[0]).toBeVisible();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <ActAsRecordsView {...args} isLoading />,
    Error: <ActAsRecordsView {...args} isError />,
    'Never visited': <ActAsRecordsView {...args} records={[]} />,
    // Singular wording, not "1 times".
    'One visit': <ActAsRecordsView {...args} records={[LEFT_DELIBERATELY]} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load platform access. Please try again.")).toBeInTheDocument();
    await expect(region('Never visited').getByText('The TeamBalance owner has never worked in your team.')).toBeInTheDocument();
    // Nothing to disclose, so the section does not offer a disclosure that opens an empty list.
    await expect(region('Never visited').queryByText(/worked here/)).not.toBeInTheDocument();
    await expect(region('One visit').getByText(/worked here once/)).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Records: <ActAsRecordsView {...args} />,
    'Ran out': <ActAsRecordsView {...args} records={[RAN_OUT]} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // The actor is the platform, never a person: no name, no email, nothing to look up (ADR-0024 §4).
    await userEvent.click(region('Records').getByText(/worked here 2 times/));
    await expect(region('Records').getByText(/worked here 2 times/).closest('details')).toHaveAttribute('open');
    await expect(region('Records').getAllByText('The TeamBalance owner worked in your team')).toHaveLength(2);

    // Second tap: the per-visit facts. Nothing here claims a change was made — the record is scoped
    // to the session, so it knows access happened and not what came of it.
    const [first] = region('Records').getAllByText(/worked in your team/);
    await userEvent.click(first);
    await expect(region('Records').getAllByText('Started')[0]).toBeVisible();
    await expect(region('Records').getByText(/when they left/)).toBeVisible();
    await expect(region('Records').getAllByText('An admin of your team')[0]).toBeVisible();

    // Third tap: the reason. This is the whole point of the redesign — an Admin who asks "why was
    // someone in our team?" gets an answer in place rather than having to write to us.
    await userEvent.click(region('Records').getAllByText('Why does this happen?')[0]);
    await expect(region('Records').getAllByText(/TeamBalance is run by a small team/)[0]).toBeVisible();
    await expect(region('Records').getAllByText(/whether or not anything changed/)[0]).toBeVisible();

    // An episode that ran out has no exitedAt, so the window ends at the last activity rather than
    // at a time the record cannot actually vouch for.
    await userEvent.click(region('Ran out').getByText(/worked here once/));
    await userEvent.click(region('Ran out').getByText(/worked in your team/));
    await expect(region('Ran out').getByText(/when the hour ran out/)).toBeVisible();
    await expect(region('Ran out').queryByText(/when they left/)).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E=[`Data`,`Shells`,`Interactions`]})))()}D();export{C as Data,T as Interactions,w as Shells,E as __namedExportsOrder,S as default};