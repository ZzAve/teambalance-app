import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";function n({onChooseJoin:e,onChooseCreate:t}){return(0,r.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm text-center`,children:[(0,r.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Welcome to TeamBalance 👋`}),(0,r.jsx)(`p`,{className:`mt-2 text-sm text-muted-foreground`,children:`You're signed in, but not on a team yet. How would you like to get started?`}),(0,r.jsxs)(`div`,{className:`mt-8 flex flex-col gap-4`,children:[(0,r.jsxs)(`button`,{type:`button`,onClick:e,className:`rounded-lg border border-border bg-blue/5 p-4 text-left transition-colors hover:border-blue`,children:[(0,r.jsx)(`span`,{className:`block font-display text-lg font-bold`,children:`I have an invite`}),(0,r.jsx)(`span`,{className:`mt-1 block text-sm text-muted-foreground`,children:`Someone shared a join link with you`})]}),(0,r.jsxs)(`button`,{type:`button`,onClick:t,className:`rounded-lg border border-border p-4 text-left transition-colors hover:border-blue`,children:[(0,r.jsx)(`span`,{className:`block font-semibold`,children:`Create a team`}),(0,r.jsx)(`span`,{className:`mt-1 block text-sm text-muted-foreground`,children:`You'll need a creation code — team owners get these from us`})]})]})]})}var r;function i(){return(i=e((()=>{r=t(),n.__docgenInfo={description:`Presentational onboarding fork for a signed-in, teamless user — replaces the old hard redirect
onto the create-team form. Deliberately not personalized (displayName is an email-derived
placeholder for new users). The route container owns navigation to /onboarding/join and
/create-team.`,methods:[],displayName:`OnboardingHubView`,props:{onChooseJoin:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onChooseCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var a,o,s,c,l,u,d;function f(){return(f=e((()=>{i(),{expect:a,fn:o}=__STORYBOOK_MODULE_TEST__,s={title:`features/onboarding-hub/OnboardingHubView`,component:n,args:{onChooseJoin:o(),onChooseCreate:o()}},c={play:async({canvas:e})=>{await a(e.getByRole(`heading`,{name:/Welcome to TeamBalance/})).toBeInTheDocument(),await a(e.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument()}},l={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/^I have an invite/})),await a(n.onChooseJoin).toHaveBeenCalled()}},u={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/^Create a team/})),await a(n.onChooseCreate).toHaveBeenCalled()}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: /Welcome to TeamBalance/
    })).toBeInTheDocument();
    await expect(canvas.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /^Create a team/
    }));
    await expect(args.onChooseCreate).toHaveBeenCalled();
  }
}`,...u.parameters?.docs?.source}}},d=[`Default`,`ChooseJoin`,`ChooseCreate`]})))()}f();export{u as ChooseCreate,l as ChooseJoin,c as Default,d as __namedExportsOrder,s as default};