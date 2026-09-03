import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-DxgScssa.js";function i({teams:e=[],isLoading:t,isError:n,isForbidden:i,isEntering:o,wasExpired:s,onEnter:c}){return(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Teams`}),(0,a.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Enter a team to set it up. You stay off its roster, and the team can see that you were here.`}),s&&(0,a.jsx)(`p`,{className:`mt-4 text-sm text-gold`,children:`Your act-as ran out after 60 minutes. Enter a team again to continue.`}),t&&(0,a.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`Loading…`}),i&&(0,a.jsx)(`p`,{className:`mt-4 text-sm text-muted-foreground`,children:`You don't have access to the platform console.`}),n&&!i&&(0,a.jsx)(`p`,{className:`mt-4 text-sm text-red`,children:`Couldn't load teams. Please try again.`}),!t&&!n&&!i&&(0,a.jsx)(`div`,{className:`mt-4`,children:e.length===0?(0,a.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No teams yet.`}):(0,a.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,a.jsxs)(`li`,{className:`flex flex-wrap items-center gap-3 p-3`,children:[(0,a.jsx)(`span`,{className:`text-sm font-medium`,children:e.name}),(0,a.jsxs)(`span`,{className:`font-mono text-xs text-muted-foreground`,children:[`/`,e.slug]}),(0,a.jsx)(r,{size:`sm`,className:`ml-auto`,disabled:o,onClick:()=>c(e),children:`Enter`})]},e.id))})})]})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`The platform console's team list (ADR-0024 §6): **every** team, because restricting the list would
be theatre — a Platform Admin owns the database. What makes it defensible is that entering is
explicit, time-boxed and recorded.

Presentational; the query and the enter mutation live in the container, so every state is a
no-network story (ADR-0017).`,methods:[],displayName:`PlatformTeamsView`,props:{teams:{required:!1,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isForbidden:{required:!1,tsType:{name:`boolean`},description:`403 — the caller is not a Platform Admin; renders a no-access shell rather than an error.`},isEntering:{required:!1,tsType:{name:`boolean`},description:``},wasExpired:{required:!1,tsType:{name:`boolean`},description:`Set when the operator was returned here because the 60-minute box ran out.`},onEnter:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(team: TeamRef) => void`,signature:{arguments:[{type:{name:`TeamRef`},name:`team`}],return:{name:`void`}}},description:``}}}})))()}var s,c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{o(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l=[{id:`t1`,name:`Tovo Dames 5`,slug:`tovo-dames-5`},{id:`t2`,name:`Tovo Heren 3`,slug:`tovo-heren-3`}],u={title:`features/act-as/PlatformTeamsView`,component:i,args:{teams:l,onEnter:c()}},d={args:{isLoading:!0},play:async({canvas:e})=>{await s(e.getByText(`Loading…`)).toBeInTheDocument(),await s(e.queryByRole(`button`,{name:`Enter`})).not.toBeInTheDocument()}},f={args:{isError:!0},play:async({canvas:e})=>{await s(e.getByText(`Couldn't load teams. Please try again.`)).toBeInTheDocument()}},p={args:{isForbidden:!0},play:async({canvas:e})=>{await s(e.getByText(`You don't have access to the platform console.`)).toBeInTheDocument(),await s(e.queryByRole(`button`,{name:`Enter`})).not.toBeInTheDocument()}},m={args:{teams:[]},play:async({canvas:e})=>{await s(e.getByText(`No teams yet.`)).toBeInTheDocument()}},h={play:async({canvas:e})=>{await s(e.getByText(`Tovo Dames 5`)).toBeInTheDocument(),await s(e.getByText(`/tovo-heren-3`)).toBeInTheDocument(),await s(e.getAllByRole(`button`,{name:`Enter`})).toHaveLength(2)}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Enter`})[1]),await s(n.onEnter).toHaveBeenCalledWith(l[1])}},_={args:{wasExpired:!0},play:async({canvas:e})=>{await s(e.getByText(/Your act-as ran out after 60 minutes/)).toBeInTheDocument(),await s(e.getAllByRole(`button`,{name:`Enter`})).toHaveLength(2)}},v={args:{isEntering:!0},play:async({canvas:e})=>{for(let t of e.getAllByRole(`button`,{name:`Enter`}))await s(t).toBeDisabled()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Enter'
    })).not.toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    isError: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("Couldn't load teams. Please try again.")).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isForbidden: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You don't have access to the platform console.")).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Enter'
    })).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    teams: []
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No teams yet.')).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Tovo Dames 5')).toBeInTheDocument();
    await expect(canvas.getByText('/tovo-heren-3')).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', {
      name: 'Enter'
    })).toHaveLength(2);
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of EveryTeam — onEnter fires; the team-list picture is unchanged (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getAllByRole('button', {
      name: 'Enter'
    })[1]);
    await expect(args.onEnter).toHaveBeenCalledWith(TEAMS[1]);
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    wasExpired: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/Your act-as ran out after 60 minutes/)).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', {
      name: 'Enter'
    })).toHaveLength(2);
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    isEntering: true
  },
  play: async ({
    canvas
  }) => {
    for (const button of canvas.getAllByRole('button', {
      name: 'Enter'
    })) {
      await expect(button).toBeDisabled();
    }
  }
}`,...v.parameters?.docs?.source}}},y=[`Loading`,`ErrorState`,`Forbidden`,`Empty`,`EveryTeam`,`EnterATeam`,`AfterALapse`,`Entering`]})))()}b();export{_ as AfterALapse,m as Empty,g as EnterATeam,v as Entering,f as ErrorState,h as EveryTeam,p as Forbidden,d as Loading,y as __namedExportsOrder,u as default};