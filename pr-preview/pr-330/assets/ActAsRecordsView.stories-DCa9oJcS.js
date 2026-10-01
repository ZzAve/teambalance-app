import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-Cm8AJftX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./chevron-right-DTOCVv5p.js";function s({records:e=[],isLoading:t,isError:n}){let[r,i]=(0,u.useState)(!1),[a,s]=(0,u.useState)(null),[m,g]=(0,u.useState)(!1),_=e=>{s(t=>t===e?null:e),g(!1)};return(0,d.jsxs)(`section`,{children:[(0,d.jsx)(`h3`,{className:`font-display text-lead font-bold`,children:`Platform access`}),(0,d.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`When the people who run TeamBalance worked inside your team.`}),t&&(0,d.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:`Loading…`}),n&&(0,d.jsx)(`p`,{className:`mt-3 text-small text-red`,children:`Couldn't load platform access. Please try again.`}),!t&&!n&&(e.length===0?(0,d.jsx)(`p`,{className:`mt-3 text-small text-muted-foreground`,children:`The TeamBalance owner has never worked in your team.`}):(0,d.jsxs)(`div`,{className:`mt-3`,children:[(0,d.jsxs)(`button`,{type:`button`,"aria-expanded":r,onClick:()=>i(e=>!e),className:`flex w-full items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover`,children:[(0,d.jsx)(o,{size:16,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${r?`rotate-90`:``}`}),(0,d.jsx)(`span`,{className:`text-small font-medium`,children:f(e.length)})]}),r&&(0,d.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-border`,children:e.map(e=>{let t=`${e.enteredAt}-${e.actorKind}`,n=a===t;return(0,d.jsxs)(`li`,{children:[(0,d.jsxs)(`button`,{type:`button`,"aria-expanded":n,onClick:()=>_(t),className:`flex w-full items-center gap-2 p-3 text-left`,children:[(0,d.jsx)(o,{size:15,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${n?`rotate-90`:``}`}),(0,d.jsxs)(`span`,{children:[(0,d.jsxs)(`span`,{className:`block text-small font-medium`,children:[c(e.actorKind),` worked in your team`]}),(0,d.jsx)(`span`,{className:`block text-small text-muted-foreground`,children:l(e)})]})]}),n&&(0,d.jsxs)(`div`,{className:`pb-3 pl-9 pr-3 text-small`,children:[(0,d.jsxs)(`dl`,{className:`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1`,children:[(0,d.jsx)(`dt`,{className:`text-muted-foreground`,children:`Started`}),(0,d.jsx)(`dd`,{children:h(new Date(e.enteredAt))}),(0,d.jsx)(`dt`,{className:`text-muted-foreground`,children:`Ended`}),(0,d.jsx)(`dd`,{children:p(e)}),(0,d.jsx)(`dt`,{className:`text-muted-foreground`,children:`Acting as`}),(0,d.jsx)(`dd`,{children:`An admin of your team`})]}),(0,d.jsx)(`button`,{type:`button`,"aria-expanded":m,onClick:()=>g(e=>!e),className:`mt-3 text-small font-medium text-blue underline underline-offset-4`,children:`Why does this happen?`}),m&&(0,d.jsxs)(`div`,{className:`mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-small text-muted-foreground`,children:[(0,d.jsx)(`p`,{children:`TeamBalance is run by a small team. The owner works inside a team to set it up, prepare a season, or fix something that was reported.`}),(0,d.jsx)(`p`,{children:`Access lasts an hour at a time and is never silent — it is listed here whether or not anything changed.`})]})]})]},t)})})]}))]})}function c(e){return e===`MEMBER`?`A team member`:`The TeamBalance owner`}function l(e){let t=new Date(e.enteredAt),n=m(e);return`${h(t)} – ${t.toDateString()===n.toDateString()?g(n):h(n)}`}var u,d,f,p,m,h,g;function _(){return(_=e((()=>{u=t(),a(),d=n(),f=e=>e===1?`The TeamBalance owner worked here once`:`The TeamBalance owner worked here ${e} times`,p=e=>e.exitedAt?`${g(m(e))}, when they left`:`${g(m(e))}, when the hour ran out`,m=e=>new Date(e.exitedAt??e.lastActiveAt),h=e=>e.toLocaleString(void 0,{day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),g=e=>e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),s.__docgenInfo={description:`The Admin-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.

Scoped to the act-as session rather than to individual rows — most tenant tables carry no
authorship column, so per-row attribution structurally cannot cover Season configuration or
Position curation, which is most of what setup is. That is also why nothing here claims a
*change* was made: the record knows access happened, never what came of it.

Quiet by default. Platform access is rare and, to an Admin who has never heard of it, alarming
out of context — so at rest it is one line, and the reasoning is reachable in two more taps
rather than pre-emptively defended on a page visited for other things.

The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
and no operator email on a surface the team's Admins read.`,methods:[],displayName:`ActAsRecordsView`,props:{records:{required:!1,tsType:{name:`Array`,elements:[{name:`ActAsRecord`}],raw:`ActAsRecord[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{r(),_(),v=n(),{expect:y,userEvent:b,within:x}=__STORYBOOK_MODULE_TEST__,S={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-20T09:00:00Z`,lastActiveAt:`2026-08-20T09:40:00Z`,exitedAt:`2026-08-20T09:45:00Z`},C={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-18T19:00:00Z`,lastActiveAt:`2026-08-18T19:20:00Z`,exitedAt:void 0},w={title:`features/act-as/ActAsRecordsView`,component:s,args:{records:[S,C]}},T={play:async({canvas:e})=>{await y(e.getByRole(`button`,{name:/worked here 2 times/})).toHaveAttribute(`aria-expanded`,`false`),await y(e.queryByText(/worked in your team/)).not.toBeInTheDocument()}},E={render:e=>(0,v.jsx)(i,{items:{Loading:(0,v.jsx)(s,{...e,isLoading:!0}),Error:(0,v.jsx)(s,{...e,isError:!0}),"Never visited":(0,v.jsx)(s,{...e,records:[]}),"One visit":(0,v.jsx)(s,{...e,records:[S]})}}),play:async({canvas:e})=>{let t=t=>x(e.getByRole(`region`,{name:t}));await y(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await y(t(`Error`).getByText(`Couldn't load platform access. Please try again.`)).toBeInTheDocument(),await y(t(`Never visited`).getByText(`The TeamBalance owner has never worked in your team.`)).toBeInTheDocument(),await y(t(`Never visited`).queryByRole(`button`)).not.toBeInTheDocument(),await y(t(`One visit`).getByRole(`button`,{name:/worked here once/})).toBeInTheDocument()}},D={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,v.jsx)(i,{items:{Records:(0,v.jsx)(s,{...e}),"Ran out":(0,v.jsx)(s,{...e,records:[C]})}}),play:async({canvas:e})=>{let t=t=>x(e.getByRole(`region`,{name:t}));await b.click(t(`Records`).getByRole(`button`,{name:/worked here 2 times/})),await y(t(`Records`).getAllByText(`The TeamBalance owner worked in your team`)).toHaveLength(2);let[n,r]=t(`Records`).getAllByRole(`button`,{name:/worked in your team/});await b.click(n),await y(t(`Records`).getByText(`Started`)).toBeInTheDocument(),await y(t(`Records`).getByText(/when they left/)).toBeInTheDocument(),await y(t(`Records`).getByText(`An admin of your team`)).toBeInTheDocument(),await b.click(t(`Records`).getByRole(`button`,{name:`Why does this happen?`})),await y(t(`Records`).getByText(/TeamBalance is run by a small team/)).toBeInTheDocument(),await y(t(`Records`).getByText(/whether or not anything changed/)).toBeInTheDocument(),await b.click(r),await y(t(`Records`).queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument(),await b.click(t(`Ran out`).getByRole(`button`,{name:/worked here once/})),await b.click(t(`Ran out`).getByRole(`button`,{name:/worked in your team/})),await y(t(`Ran out`).getByText(/when the hour ran out/)).toBeInTheDocument(),await y(t(`Ran out`).queryByText(/when they left/)).not.toBeInTheDocument()}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /worked here 2 times/
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/worked in your team/)).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
    // Nothing to disclose, so the section does not offer a control that opens an empty list.
    await expect(region('Never visited').queryByRole('button')).not.toBeInTheDocument();
    await expect(region('One visit').getByRole('button', {
      name: /worked here once/
    })).toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(region('Records').getByRole('button', {
      name: /worked here 2 times/
    }));
    await expect(region('Records').getAllByText('The TeamBalance owner worked in your team')).toHaveLength(2);

    // Second tap: the per-visit facts. Nothing here claims a change was made — the record is scoped
    // to the session, so it knows access happened and not what came of it.
    const [first, second] = region('Records').getAllByRole('button', {
      name: /worked in your team/
    });
    await userEvent.click(first);
    await expect(region('Records').getByText('Started')).toBeInTheDocument();
    await expect(region('Records').getByText(/when they left/)).toBeInTheDocument();
    await expect(region('Records').getByText('An admin of your team')).toBeInTheDocument();

    // Third tap: the reason. This is the whole point of the redesign — an Admin who asks "why was
    // someone in our team?" gets an answer in place rather than having to write to us.
    await userEvent.click(region('Records').getByRole('button', {
      name: 'Why does this happen?'
    }));
    await expect(region('Records').getByText(/TeamBalance is run by a small team/)).toBeInTheDocument();
    await expect(region('Records').getByText(/whether or not anything changed/)).toBeInTheDocument();

    // The reasoning belongs to the record it was opened from: collapsing that record takes it with
    // it, so opening a different one never starts mid-explanation.
    await userEvent.click(second);
    await expect(region('Records').queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument();

    // An episode that ran out has no exitedAt, so the window ends at the last activity rather than
    // at a time the record cannot actually vouch for.
    await userEvent.click(region('Ran out').getByRole('button', {
      name: /worked here once/
    }));
    await userEvent.click(region('Ran out').getByRole('button', {
      name: /worked in your team/
    }));
    await expect(region('Ran out').getByText(/when the hour ran out/)).toBeInTheDocument();
    await expect(region('Ran out').queryByText(/when they left/)).not.toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O=[`Data`,`Shells`,`Interactions`]})))()}k();export{T as Data,D as Interactions,E as Shells,O as __namedExportsOrder,w as default};