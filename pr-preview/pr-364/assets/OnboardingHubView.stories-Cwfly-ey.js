import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D87d-8jv.js";function i({onChooseJoin:e,onChooseCreate:t,inviteUnavailable:n}){return(0,a.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm text-center`,children:[(0,a.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Welcome to TeamBalance 👋`}),n&&(0,a.jsxs)(`p`,{className:`mt-3 rounded-lg border border-gold/40 bg-gold/10 p-3 text-small text-foreground`,children:[`You're signed in, but the invite link you used has expired or been replaced. Ask your team for a new one, then use `,(0,a.jsx)(`span`,{className:`font-medium`,children:`I have an invite`}),` below.`]}),(0,a.jsx)(`p`,{className:`mt-2 text-small text-muted-foreground`,children:n?`How would you like to get started?`:`You're signed in, but not on a team yet. How would you like to get started?`}),(0,a.jsxs)(`div`,{className:`mt-8 flex flex-col gap-4`,children:[(0,a.jsxs)(`button`,{type:`button`,onClick:e,className:`rounded-lg border border-border bg-blue/5 p-4 text-left transition-colors hover:border-blue`,children:[(0,a.jsx)(`span`,{className:`block font-display text-lead font-bold`,children:`I have an invite`}),(0,a.jsx)(`span`,{className:`mt-1 block text-small text-muted-foreground`,children:`Someone shared a join link with you`})]}),(0,a.jsxs)(`button`,{type:`button`,onClick:t,className:`rounded-lg border border-border p-4 text-left transition-colors hover:border-blue`,children:[(0,a.jsx)(`span`,{className:`block font-semibold`,children:`Create a team`}),(0,a.jsx)(`span`,{className:`mt-1 block text-small text-muted-foreground`,children:`You'll need a creation code — team owners get these from us`})]})]})]})}var a;function o(){return(o=e((()=>{a=t(),i.__docgenInfo={description:`Presentational onboarding fork for a signed-in, teamless user — replaces the old hard redirect
onto the create-team form. Deliberately not personalized (displayName is an email-derived
placeholder for new users). The route container owns navigation to /onboarding/join and
/create-team.`,methods:[],displayName:`OnboardingHubView`,props:{onChooseJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},inviteUnavailable:{required:!1,tsType:{name:`boolean`},description:`They signed in from an Invite Link that had expired or been rotated by the time they clicked it
(#342). Naming it is the whole point: the sign-in worked, so without this they would be told only
that they have no team, and would have no idea the invite was the part that failed.`}}}})))()}var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),o(),s=t(),{expect:c,fn:l,within:u}=__STORYBOOK_MODULE_TEST__,d={title:`features/onboarding-hub/OnboardingHubView`,component:i,args:{onChooseJoin:l(),onChooseCreate:l()}},f={play:async({canvas:e})=>{await c(e.getByRole(`heading`,{name:/Welcome to TeamBalance/})).toBeInTheDocument(),await c(e.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument()}},p={render:e=>(0,s.jsx)(r,{items:{"Invite unavailable":(0,s.jsx)(i,{...e,inviteUnavailable:!0})}}),play:async({canvas:e})=>{let t=u(e.getByRole(`region`,{name:`Invite unavailable`}));await c(t.getByText(/invite link you used has expired or been replaced/)).toBeInTheDocument(),await c(t.getByRole(`button`,{name:/^I have an invite/})).toBeInTheDocument()}},m={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/^I have an invite/})),await c(n.onChooseJoin).toHaveBeenCalled(),await t.click(e.getByRole(`button`,{name:/^Create a team/})),await c(n.onChooseCreate).toHaveBeenCalled()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: /Welcome to TeamBalance/
    })).toBeInTheDocument();
    await expect(canvas.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // The state a joiner lands in when the Invite Link they signed in from expired or was
    // rotated before they clicked the email (#342). Its own picture, because the difference from
    // Default is the whole point: the sign-in worked, and only the invite half failed.
    'Invite unavailable': <OnboardingHubView {...args} inviteUnavailable />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = within(canvas.getByRole('region', {
      name: 'Invite unavailable'
    }));
    await expect(region.getByText(/invite link you used has expired or been replaced/)).toBeInTheDocument();
    // The recovery route stays reachable — this is a detour, not a dead end.
    await expect(region.getByRole('button', {
      name: /^I have an invite/
    })).toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
    // The accessible name includes the helper text, so match by substring rather than exact.
    await userEvent.click(canvas.getByRole('button', {
      name: /^I have an invite/
    }));
    await expect(args.onChooseJoin).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', {
      name: /^Create a team/
    }));
    await expect(args.onChooseCreate).toHaveBeenCalled();
  }
}`,...m.parameters?.docs?.source}}},h=[`Data`,`Shells`,`Interactions`]})))()}g();export{f as Data,m as Interactions,p as Shells,h as __namedExportsOrder,d as default};