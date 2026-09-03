import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-ugXzxNVs.js";import{n,t as r}from"./chevron-right-CAdDR8Yo.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";function a({records:e=[],isLoading:t,isError:n}){let[i,a]=(0,c.useState)(!1),[f,m]=(0,c.useState)(null),[h,g]=(0,c.useState)(!1),_=e=>{m(t=>t===e?null:e),g(!1)};return(0,l.jsxs)(`section`,{children:[(0,l.jsx)(`h3`,{className:`font-display text-lg font-bold`,children:`Platform access`}),(0,l.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`When the people who run TeamBalance worked inside your team.`}),t&&(0,l.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,l.jsx)(`p`,{className:`mt-3 text-sm text-red`,children:`Couldn't load platform access. Please try again.`}),!t&&!n&&(e.length===0?(0,l.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:`The TeamBalance owner has never worked in your team.`}):(0,l.jsxs)(`div`,{className:`mt-3`,children:[(0,l.jsxs)(`button`,{type:`button`,"aria-expanded":i,onClick:()=>a(e=>!e),className:`flex w-full items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover`,children:[(0,l.jsx)(r,{size:16,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${i?`rotate-90`:``}`}),(0,l.jsx)(`span`,{className:`text-sm font-medium`,children:u(e.length)})]}),i&&(0,l.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-border`,children:e.map(e=>{let t=`${e.enteredAt}-${e.actorKind}`,n=f===t;return(0,l.jsxs)(`li`,{children:[(0,l.jsxs)(`button`,{type:`button`,"aria-expanded":n,onClick:()=>_(t),className:`flex w-full items-center gap-2 p-3 text-left`,children:[(0,l.jsx)(r,{size:15,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${n?`rotate-90`:``}`}),(0,l.jsxs)(`span`,{children:[(0,l.jsxs)(`span`,{className:`block text-sm font-medium`,children:[o(e.actorKind),` worked in your team`]}),(0,l.jsx)(`span`,{className:`block text-sm text-muted-foreground`,children:s(e)})]})]}),n&&(0,l.jsxs)(`div`,{className:`pb-3 pl-9 pr-3 text-sm`,children:[(0,l.jsxs)(`dl`,{className:`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1`,children:[(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Started`}),(0,l.jsx)(`dd`,{children:p(new Date(e.enteredAt))}),(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Ended`}),(0,l.jsx)(`dd`,{children:d(e)}),(0,l.jsx)(`dt`,{className:`text-muted-foreground`,children:`Acting as`}),(0,l.jsx)(`dd`,{children:`An admin of your team`})]}),(0,l.jsx)(`button`,{type:`button`,"aria-expanded":h,onClick:()=>g(e=>!e),className:`mt-3 text-sm font-medium text-blue underline underline-offset-4`,children:`Why does this happen?`}),h&&(0,l.jsxs)(`div`,{className:`mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-sm text-muted-foreground`,children:[(0,l.jsx)(`p`,{children:`TeamBalance is run by a small team. The owner works inside a team to set it up, prepare a season, or fix something that was reported.`}),(0,l.jsx)(`p`,{children:`Access lasts an hour at a time and is never silent — it is listed here whether or not anything changed.`})]})]})]},t)})})]}))]})}function o(e){return e===`MEMBER`?`A team member`:`The TeamBalance owner`}function s(e){let t=new Date(e.enteredAt),n=f(e);return`${p(t)} – ${t.toDateString()===n.toDateString()?m(n):p(n)}`}var c,l,u,d,f,p,m;function h(){return(h=e((()=>{c=t(),n(),l=i(),u=e=>e===1?`The TeamBalance owner worked here once`:`The TeamBalance owner worked here ${e} times`,d=e=>e.exitedAt?`${m(f(e))}, when they left`:`${m(f(e))}, when the hour ran out`,f=e=>new Date(e.exitedAt??e.lastActiveAt),p=e=>e.toLocaleString(void 0,{day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),m=e=>e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),a.__docgenInfo={description:`The Admin-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.

Scoped to the act-as session rather than to individual rows — most tenant tables carry no
authorship column, so per-row attribution structurally cannot cover Season configuration or
Position curation, which is most of what setup is. That is also why nothing here claims a
*change* was made: the record knows access happened, never what came of it.

Quiet by default. Platform access is rare and, to an Admin who has never heard of it, alarming
out of context — so at rest it is one line, and the reasoning is reachable in two more taps
rather than pre-emptively defended on a page visited for other things.

The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
and no operator email on a surface the team's Admins read.`,methods:[],displayName:`ActAsRecordsView`,props:{records:{required:!1,tsType:{name:`Array`,elements:[{name:`ActAsRecord`}],raw:`ActAsRecord[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{h(),{expect:g,userEvent:_}=__STORYBOOK_MODULE_TEST__,v={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-20T09:00:00Z`,lastActiveAt:`2026-08-20T09:40:00Z`,exitedAt:`2026-08-20T09:45:00Z`},y={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-18T19:00:00Z`,lastActiveAt:`2026-08-18T19:20:00Z`,exitedAt:void 0},b={title:`features/act-as/ActAsRecordsView`,component:a,args:{records:[v,y]}},x={args:{isLoading:!0},play:async({canvas:e})=>{await g(e.getByText(`Loading…`)).toBeInTheDocument()}},S={args:{isError:!0},play:async({canvas:e})=>{await g(e.getByText(`Couldn't load platform access. Please try again.`)).toBeInTheDocument()}},C={args:{records:[]},play:async({canvas:e})=>{await g(e.getByText(`The TeamBalance owner has never worked in your team.`)).toBeInTheDocument(),await g(e.queryByRole(`button`)).not.toBeInTheDocument()}},w={play:async({canvas:e})=>{await g(e.getByRole(`button`,{name:/worked here 2 times/})).toHaveAttribute(`aria-expanded`,`false`),await g(e.queryByText(/worked in your team/)).not.toBeInTheDocument()}},T={args:{records:[v]},play:async({canvas:e})=>{await g(e.getByRole(`button`,{name:/worked here once/})).toBeInTheDocument()}},E={play:async({canvas:e})=>{await _.click(e.getByRole(`button`,{name:/worked here 2 times/})),await g(e.getAllByText(`The TeamBalance owner worked in your team`)).toHaveLength(2)}},D={play:async({canvas:e})=>{await _.click(e.getByRole(`button`,{name:/worked here 2 times/}));let[t]=e.getAllByRole(`button`,{name:/worked in your team/});await _.click(t),await g(e.getByText(`Started`)).toBeInTheDocument(),await g(e.getByText(/when they left/)).toBeInTheDocument(),await g(e.getByText(`An admin of your team`)).toBeInTheDocument()}},O={args:{records:[y]},play:async({canvas:e})=>{await _.click(e.getByRole(`button`,{name:/worked here once/})),await _.click(e.getByRole(`button`,{name:/worked in your team/})),await g(e.getByText(/when the hour ran out/)).toBeInTheDocument(),await g(e.queryByText(/when they left/)).not.toBeInTheDocument()}},k={play:async({canvas:e})=>{await _.click(e.getByRole(`button`,{name:/worked here 2 times/})),await _.click(e.getAllByRole(`button`,{name:/worked in your team/})[0]),await _.click(e.getByRole(`button`,{name:`Why does this happen?`})),await g(e.getByText(/TeamBalance is run by a small team/)).toBeInTheDocument(),await g(e.getByText(/whether or not anything changed/)).toBeInTheDocument()}},A={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await _.click(e.getByRole(`button`,{name:/worked here 2 times/}));let t=e.getAllByRole(`button`,{name:/worked in your team/});await _.click(t[0]),await _.click(e.getByRole(`button`,{name:`Why does this happen?`})),await _.click(t[1]),await g(e.queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument()}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load platform access. Please try again.")).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    records: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('The TeamBalance owner has never worked in your team.')).toBeInTheDocument();
    // Nothing to disclose, so the section does not offer a control that opens an empty list.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /worked here 2 times/
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/worked in your team/)).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    records: [LEFT_DELIBERATELY]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /worked here once/
    })).toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here 2 times/
    }));
    await expect(canvas.getAllByText('The TeamBalance owner worked in your team')).toHaveLength(2);
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here 2 times/
    }));
    const [first] = canvas.getAllByRole('button', {
      name: /worked in your team/
    });
    await userEvent.click(first);
    await expect(canvas.getByText('Started')).toBeInTheDocument();
    await expect(canvas.getByText(/when they left/)).toBeInTheDocument();
    await expect(canvas.getByText('An admin of your team')).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    records: [RAN_OUT]
  },
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here once/
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: /worked in your team/
    }));
    await expect(canvas.getByText(/when the hour ran out/)).toBeInTheDocument();
    await expect(canvas.queryByText(/when they left/)).not.toBeInTheDocument();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here 2 times/
    }));
    await userEvent.click(canvas.getAllByRole('button', {
      name: /worked in your team/
    })[0]);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Why does this happen?'
    }));
    await expect(canvas.getByText(/TeamBalance is run by a small team/)).toBeInTheDocument();
    await expect(canvas.getByText(/whether or not anything changed/)).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of RecordExpandsToItsDetail — the final frame is the expanded-record detail
  // (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here 2 times/
    }));
    const records = canvas.getAllByRole('button', {
      name: /worked in your team/
    });
    await userEvent.click(records[0]);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Why does this happen?'
    }));
    await userEvent.click(records[1]);
    await expect(canvas.queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j=[`Loading`,`ErrorState`,`NeverVisited`,`CollapsedByDefault`,`OneVisitReadsAsOnce`,`ExpandedListAttributesGenerically`,`RecordExpandsToItsDetail`,`RanOutRatherThanLeft`,`ReasoningIsReachable`,`ReasoningClosesWithItsRecord`]})))()}M();export{w as CollapsedByDefault,S as ErrorState,E as ExpandedListAttributesGenerically,x as Loading,C as NeverVisited,T as OneVisitReadsAsOnce,O as RanOutRatherThanLeft,A as ReasoningClosesWithItsRecord,k as ReasoningIsReachable,D as RecordExpandsToItsDetail,j as __namedExportsOrder,b as default};