import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";import{n as i,t as a}from"./button-Djr1cczI.js";function o({teams:e=[],isLoading:t,isError:n,isForbidden:r,isEntering:i,wasExpired:o,onEnter:c}){return(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Teams`}),(0,s.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Enter a team to set it up. You stay off its roster, and the team can see that you were here.`}),o&&(0,s.jsx)(`p`,{className:`mt-4 text-small text-gold-ink`,children:`Your act-as ran out after 60 minutes. Enter a team again to continue.`}),t&&(0,s.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,s.jsx)(`p`,{className:`mt-4 text-small text-muted-foreground`,children:`You don't have access to the platform console.`}),n&&!r&&(0,s.jsx)(`p`,{className:`mt-4 text-small text-red`,children:`Couldn't load teams. Please try again.`}),!t&&!n&&!r&&(0,s.jsx)(`div`,{className:`mt-4`,children:e.length===0?(0,s.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No teams yet.`}):(0,s.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,s.jsxs)(`li`,{className:`flex flex-wrap items-center gap-3 p-3`,children:[(0,s.jsx)(`span`,{className:`text-small font-medium`,children:e.name}),(0,s.jsxs)(`span`,{className:`font-mono text-caption text-muted-foreground`,children:[`/`,e.slug]}),(0,s.jsx)(a,{size:`sm`,className:`ml-auto`,disabled:i,onClick:()=>c(e),children:`Enter`})]},e.id))})})]})}var s;function c(){return(c=e((()=>{i(),s=t(),o.__docgenInfo={description:`The platform console's team list (ADR-0024 §6): **every** team, because restricting the list would
be theatre — a Platform Admin owns the database. What makes it defensible is that entering is
explicit, time-boxed and recorded.

Presentational; the query and the enter mutation live in the container, so every state is a
no-network story (ADR-0017).`,methods:[],displayName:`PlatformTeamsView`,props:{teams:{required:!1,tsType:{name:`Array`,elements:[{name:`TeamRef`}],raw:`TeamRef[]`},description:``,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isForbidden:{required:!1,tsType:{name:`boolean`},description:`403 — the caller is not a Platform Admin; renders a no-access shell rather than an error.`},isEntering:{required:!1,tsType:{name:`boolean`},description:``},wasExpired:{required:!1,tsType:{name:`boolean`},description:`Set when the operator was returned here because the 60-minute box ran out.`},onEnter:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(team: TeamRef) => void`,signature:{arguments:[{type:{name:`TeamRef`},name:`team`}],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),c(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p=[{id:`t1`,name:`Tovo Dames 5`,slug:`tovo-dames-5`},{id:`t2`,name:`Tovo Heren 3`,slug:`tovo-heren-3`}],m={title:`features/act-as/PlatformTeamsView`,component:o,args:{teams:p,onEnter:d()}},h={play:async({canvas:e})=>{await u(e.getByText(`Tovo Dames 5`)).toBeInTheDocument(),await u(e.getByText(`/tovo-heren-3`)).toBeInTheDocument(),await u(e.getAllByRole(`button`,{name:`Enter`})).toHaveLength(2)}},g={render:e=>(0,l.jsx)(r,{items:{Loading:(0,l.jsx)(o,{...e,isLoading:!0}),Error:(0,l.jsx)(o,{...e,isError:!0}),Forbidden:(0,l.jsx)(o,{...e,isForbidden:!0}),Empty:(0,l.jsx)(o,{...e,teams:[]}),"After a lapse":(0,l.jsx)(o,{...e,wasExpired:!0}),Entering:(0,l.jsx)(o,{...e,isEntering:!0})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await u(t(`Loading`).queryByRole(`button`,{name:`Enter`})).not.toBeInTheDocument(),await u(t(`Error`).getByText(`Couldn't load teams. Please try again.`)).toBeInTheDocument(),await u(t(`Forbidden`).getByText(`You don't have access to the platform console.`)).toBeInTheDocument(),await u(t(`Forbidden`).queryByRole(`button`,{name:`Enter`})).not.toBeInTheDocument(),await u(t(`Empty`).getByText(`No teams yet.`)).toBeInTheDocument(),await u(t(`After a lapse`).getByText(/Your act-as ran out after 60 minutes/)).toBeInTheDocument(),await u(t(`After a lapse`).getAllByRole(`button`,{name:`Enter`})).toHaveLength(2);for(let e of t(`Entering`).getAllByRole(`button`,{name:`Enter`}))await u(e).toBeDisabled()}},_={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getAllByRole(`button`,{name:`Enter`})[1]),await u(n.onEnter).toHaveBeenCalledWith(p[1])}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
  render: args => <Stack items={{
    Loading: <PlatformTeamsView {...args} isLoading />,
    Error: <PlatformTeamsView {...args} isError />,
    // 403 — the caller is not a Platform Admin; renders a no-access shell rather than an error.
    Forbidden: <PlatformTeamsView {...args} isForbidden />,
    Empty: <PlatformTeamsView {...args} teams={[]} />,
    // Where a lapse lands: back on the console, told why (ADR-0024 §4).
    'After a lapse': <PlatformTeamsView {...args} wasExpired />,
    Entering: <PlatformTeamsView {...args} isEntering />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Enter'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load teams. Please try again.")).toBeInTheDocument();
    await expect(region('Forbidden').getByText("You don't have access to the platform console.")).toBeInTheDocument();
    await expect(region('Forbidden').queryByRole('button', {
      name: 'Enter'
    })).not.toBeInTheDocument();
    await expect(region('Empty').getByText('No teams yet.')).toBeInTheDocument();
    await expect(region('After a lapse').getByText(/Your act-as ran out after 60 minutes/)).toBeInTheDocument();
    await expect(region('After a lapse').getAllByRole('button', {
      name: 'Enter'
    })).toHaveLength(2);
    for (const button of region('Entering').getAllByRole('button', {
      name: 'Enter'
    })) {
      await expect(button).toBeDisabled();
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`Data`,`Shells`,`Interactions`]})))()}y();export{h as Data,_ as Interactions,g as Shells,v as __namedExportsOrder,m as default};