import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BmKi-jTa.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-D6_WZdBO.js";var a,o;function s(){return(s=e((()=>{r(),a=[[`path`,{d:`m9 18 6-6-6-6`,key:`mthhwq`}]],o=i(`chevron-right`,a)})))()}function c({records:e=[],isLoading:t,isError:n}){let[r,i]=(0,d.useState)(!1),[a,s]=(0,d.useState)(null),[c,h]=(0,d.useState)(!1),_=e=>{s(t=>t===e?null:e),h(!1)};return(0,f.jsxs)(`section`,{children:[(0,f.jsx)(`h3`,{className:`font-display text-lg font-bold`,children:`Platform access`}),(0,f.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`When the people who run TeamBalance worked inside your team.`}),t&&(0,f.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:`Loading…`}),n&&(0,f.jsx)(`p`,{className:`mt-3 text-sm text-red`,children:`Couldn't load platform access. Please try again.`}),!t&&!n&&(e.length===0?(0,f.jsx)(`p`,{className:`mt-3 text-sm text-muted-foreground`,children:`The TeamBalance owner has never worked in your team.`}):(0,f.jsxs)(`div`,{className:`mt-3`,children:[(0,f.jsxs)(`button`,{type:`button`,"aria-expanded":r,onClick:()=>i(e=>!e),className:`flex w-full items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover`,children:[(0,f.jsx)(o,{size:16,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${r?`rotate-90`:``}`}),(0,f.jsx)(`span`,{className:`text-sm font-medium`,children:p(e.length)})]}),r&&(0,f.jsx)(`ul`,{className:`mt-2 divide-y divide-border rounded-lg border border-border`,children:e.map(e=>{let t=`${e.enteredAt}-${e.actorKind}`,n=a===t;return(0,f.jsxs)(`li`,{children:[(0,f.jsxs)(`button`,{type:`button`,"aria-expanded":n,onClick:()=>_(t),className:`flex w-full items-center gap-2 p-3 text-left`,children:[(0,f.jsx)(o,{size:15,className:`shrink-0 text-muted-foreground transition-transform duration-200 ${n?`rotate-90`:``}`}),(0,f.jsxs)(`span`,{children:[(0,f.jsxs)(`span`,{className:`block text-sm font-medium`,children:[l(e.actorKind),` worked in your team`]}),(0,f.jsx)(`span`,{className:`block text-sm text-muted-foreground`,children:u(e)})]})]}),n&&(0,f.jsxs)(`div`,{className:`pb-3 pl-9 pr-3 text-sm`,children:[(0,f.jsxs)(`dl`,{className:`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1`,children:[(0,f.jsx)(`dt`,{className:`text-muted-foreground`,children:`Started`}),(0,f.jsx)(`dd`,{children:g(new Date(e.enteredAt))}),(0,f.jsx)(`dt`,{className:`text-muted-foreground`,children:`Ended`}),(0,f.jsx)(`dd`,{children:m(e)}),(0,f.jsx)(`dt`,{className:`text-muted-foreground`,children:`Acting as`}),(0,f.jsx)(`dd`,{children:`An admin of your team`})]}),(0,f.jsx)(`button`,{type:`button`,"aria-expanded":c,onClick:()=>h(e=>!e),className:`mt-3 text-sm font-medium text-blue underline underline-offset-4`,children:`Why does this happen?`}),c&&(0,f.jsxs)(`div`,{className:`mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-sm text-muted-foreground`,children:[(0,f.jsx)(`p`,{children:`TeamBalance is run by a small team. The owner works inside a team to set it up, prepare a season, or fix something that was reported.`}),(0,f.jsx)(`p`,{children:`Access lasts an hour at a time and is never silent — it is listed here whether or not anything changed.`})]})]})]},t)})})]}))]})}function l(e){return e===`MEMBER`?`A team member`:`The TeamBalance owner`}function u(e){let t=new Date(e.enteredAt),n=h(e);return`${g(t)} – ${t.toDateString()===n.toDateString()?_(n):g(n)}`}var d,f,p,m,h,g,_;function v(){return(v=e((()=>{d=t(),s(),f=n(),p=e=>e===1?`The TeamBalance owner worked here once`:`The TeamBalance owner worked here ${e} times`,m=e=>e.exitedAt?`${_(h(e))}, when they left`:`${_(h(e))}, when the hour ran out`,h=e=>new Date(e.exitedAt??e.lastActiveAt),g=e=>e.toLocaleString(void 0,{day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),_=e=>e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),c.__docgenInfo={description:`The Admin-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.

Scoped to the act-as session rather than to individual rows — most tenant tables carry no
authorship column, so per-row attribution structurally cannot cover Season configuration or
Position curation, which is most of what setup is. That is also why nothing here claims a
*change* was made: the record knows access happened, never what came of it.

Quiet by default. Platform access is rare and, to an Admin who has never heard of it, alarming
out of context — so at rest it is one line, and the reasoning is reachable in two more taps
rather than pre-emptively defended on a page visited for other things.

The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
and no operator email on a surface the team's Admins read.`,methods:[],displayName:`ActAsRecordsView`,props:{records:{required:!1,tsType:{name:`Array`,elements:[{name:`ActAsRecord`}],raw:`ActAsRecord[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{v(),{expect:y,userEvent:b}=__STORYBOOK_MODULE_TEST__,x={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-20T09:00:00Z`,lastActiveAt:`2026-08-20T09:40:00Z`,exitedAt:`2026-08-20T09:45:00Z`},S={actorKind:`PLATFORM_ADMIN`,enteredAt:`2026-08-18T19:00:00Z`,lastActiveAt:`2026-08-18T19:20:00Z`,exitedAt:void 0},C={title:`features/act-as/ActAsRecordsView`,component:c,args:{records:[x,S]}},w={args:{isLoading:!0},play:async({canvas:e})=>{await y(e.getByText(`Loading…`)).toBeInTheDocument()}},T={args:{isError:!0},play:async({canvas:e})=>{await y(e.getByText(`Couldn't load platform access. Please try again.`)).toBeInTheDocument()}},E={args:{records:[]},play:async({canvas:e})=>{await y(e.getByText(`The TeamBalance owner has never worked in your team.`)).toBeInTheDocument(),await y(e.queryByRole(`button`)).not.toBeInTheDocument()}},D={play:async({canvas:e})=>{await y(e.getByRole(`button`,{name:/worked here 2 times/})).toHaveAttribute(`aria-expanded`,`false`),await y(e.queryByText(/worked in your team/)).not.toBeInTheDocument()}},O={args:{records:[x]},play:async({canvas:e})=>{await y(e.getByRole(`button`,{name:/worked here once/})).toBeInTheDocument()}},k={play:async({canvas:e})=>{await b.click(e.getByRole(`button`,{name:/worked here 2 times/})),await y(e.getAllByText(`The TeamBalance owner worked in your team`)).toHaveLength(2)}},A={play:async({canvas:e})=>{await b.click(e.getByRole(`button`,{name:/worked here 2 times/}));let[t]=e.getAllByRole(`button`,{name:/worked in your team/});await b.click(t),await y(e.getByText(`Started`)).toBeInTheDocument(),await y(e.getByText(/when they left/)).toBeInTheDocument(),await y(e.getByText(`An admin of your team`)).toBeInTheDocument()}},j={args:{records:[S]},play:async({canvas:e})=>{await b.click(e.getByRole(`button`,{name:/worked here once/})),await b.click(e.getByRole(`button`,{name:/worked in your team/})),await y(e.getByText(/when the hour ran out/)).toBeInTheDocument(),await y(e.queryByText(/when they left/)).not.toBeInTheDocument()}},M={play:async({canvas:e})=>{await b.click(e.getByRole(`button`,{name:/worked here 2 times/})),await b.click(e.getAllByRole(`button`,{name:/worked in your team/})[0]),await b.click(e.getByRole(`button`,{name:`Why does this happen?`})),await y(e.getByText(/TeamBalance is run by a small team/)).toBeInTheDocument(),await y(e.getByText(/whether or not anything changed/)).toBeInTheDocument()}},N={play:async({canvas:e})=>{await b.click(e.getByRole(`button`,{name:/worked here 2 times/}));let t=e.getAllByRole(`button`,{name:/worked in your team/});await b.click(t[0]),await b.click(e.getByRole(`button`,{name:`Why does this happen?`})),await b.click(t[1]),await y(e.queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument()}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load platform access. Please try again.")).toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /worked here 2 times/
    })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/worked in your team/)).not.toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /worked here 2 times/
    }));
    await expect(canvas.getAllByText('The TeamBalance owner worked in your team')).toHaveLength(2);
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P=[`Loading`,`ErrorState`,`NeverVisited`,`CollapsedByDefault`,`OneVisitReadsAsOnce`,`ExpandedListAttributesGenerically`,`RecordExpandsToItsDetail`,`RanOutRatherThanLeft`,`ReasoningIsReachable`,`ReasoningClosesWithItsRecord`]})))()}F();export{D as CollapsedByDefault,T as ErrorState,k as ExpandedListAttributesGenerically,w as Loading,E as NeverVisited,O as OneVisitReadsAsOnce,j as RanOutRatherThanLeft,N as ReasoningClosesWithItsRecord,M as ReasoningIsReachable,A as RecordExpandsToItsDetail,P as __namedExportsOrder,C as default};