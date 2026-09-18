import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-D1VBtmRF.js";import{n as i,t as a}from"./button-CmXzxiAJ.js";import{n as o,t as s}from"./input-DnghFZpx.js";import{n as c,t as l}from"./label-TdKac9RL.js";function u(e){let t=e.trim(),n=t.indexOf(`/invite/`);return(n===-1?t:t.slice(n+8)).split(/[?#]/)[0].replace(/\/+$/,``).trim()}function d({value:e,onChange:t,onSubmit:n,submitting:r,error:i}){let o=e.trim().length>0&&!r;return(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Join your team`}),(0,f.jsx)(`p`,{className:`mt-2 text-small text-muted-foreground`,children:`Paste the invite link you were sent below — or easiest of all, just click the link directly.`}),(0,f.jsxs)(`form`,{onSubmit:t=>{t.preventDefault(),o&&n(u(e))},className:`mt-6 flex flex-col gap-4`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(l,{htmlFor:`invite-token`,children:`Invite link`}),(0,f.jsx)(s,{id:`invite-token`,value:e,disabled:r,onChange:e=>t(e.target.value),placeholder:`https://app.teambalance.nl/invite/...`})]}),i&&(0,f.jsx)(`p`,{role:`alert`,className:`text-small text-destructive`,children:i}),(0,f.jsx)(a,{type:`submit`,disabled:!o,children:r?`Joining…`:`Join`})]}),(0,f.jsxs)(`details`,{className:`mt-8 text-small text-muted-foreground`,children:[(0,f.jsx)(`summary`,{className:`cursor-pointer font-medium text-foreground`,children:`I don't have a link`}),(0,f.jsx)(`p`,{className:`mt-2`,children:`Ask your team's captain or admin to send you the invite link — they can generate one from the team's Members page. Once you have it, paste it above.`}),(0,f.jsxs)(`p`,{className:`mt-2`,children:[`Starting your own team instead?`,` `,(0,f.jsx)(`a`,{href:`/create-team`,className:`text-blue underline`,children:`Create a team`})]})]})]})}var f;function p(){return(p=e((()=>{i(),o(),c(),f=t(),d.__docgenInfo={description:`Presentational paste-your-invite UI (the /onboarding/join fork branch). value/onChange are
controlled by the route container rather than owned locally, so a failed submit can be retried
without losing what was pasted. Accepts a full invite URL or a bare token — parsed via the pure
parseInviteToken before onSubmit ever sees it.`,methods:[],displayName:`JoinTeamView`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(token: string) => void`,signature:{arguments:[{type:{name:`string`},name:`token`}],return:{name:`void`}}},description:``},submitting:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``}}}})))()}var m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),p(),m=t(),{expect:h,fn:g,within:_}=__STORYBOOK_MODULE_TEST__,v={title:`features/join-team/JoinTeamView`,component:d,args:{value:``,onChange:g(),onSubmit:g()}},y={play:async({canvas:e})=>{await h(e.getByLabelText(`Invite link`)).toHaveValue(``),await h(e.getByRole(`button`,{name:`Join`})).toBeDisabled(),await h(e.getByText(`I don't have a link`)).toBeInTheDocument()}},b={render:e=>(0,m.jsx)(r,{items:{Submitting:(0,m.jsx)(d,{...e,value:`abc123`,submitting:!0}),Error:(0,m.jsx)(d,{...e,value:`abc123`,error:`That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one.`})}}),play:async({canvas:e})=>{let t=t=>_(e.getByRole(`region`,{name:t}));await h(t(`Submitting`).getByRole(`button`,{name:`Joining…`})).toBeDisabled(),await h(t(`Error`).getByRole(`alert`)).toHaveTextContent(`invalid or expired`)}},x={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,m.jsx)(r,{items:{Typing:(0,m.jsx)(d,{...e}),"Ready to submit":(0,m.jsx)(d,{...e,value:`https://app.teambalance.nl/invite/abc123?utm=share`}),"No link fallback":(0,m.jsx)(d,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>_(e.getByRole(`region`,{name:t}));await t.type(r(`Typing`).getByLabelText(`Invite link`),`abc`),await h(n.onChange).toHaveBeenCalled();let i=r(`Ready to submit`).getByRole(`button`,{name:`Join`});await h(i).toBeEnabled(),await t.click(i),await h(n.onSubmit).toHaveBeenCalledWith(`abc123`),await t.click(r(`No link fallback`).getByText(`I don't have a link`)),await h(await r(`No link fallback`).findByText(/Ask your team's captain or admin/)).toBeInTheDocument(),await h(r(`No link fallback`).getByRole(`link`,{name:`Create a team`})).toBeInTheDocument()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Invite link')).toHaveValue('');
    // Nothing pasted yet → submit is disabled.
    await expect(canvas.getByRole('button', {
      name: 'Join'
    })).toBeDisabled();
    await expect(canvas.getByText("I don't have a link")).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Submitting: <JoinTeamView {...args} value="abc123" submitting />,
    Error: <JoinTeamView {...args} value="abc123" error="That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one." />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Submitting').getByRole('button', {
      name: 'Joining…'
    })).toBeDisabled();
    await expect(region('Error').getByRole('alert')).toHaveTextContent('invalid or expired');
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Typing: <JoinTeamView {...args} />,
    'Ready to submit': <JoinTeamView {...args} value="https://app.teambalance.nl/invite/abc123?utm=share" />,
    'No link fallback': <JoinTeamView {...args} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));

    // Typing reports to onChange without changing the picture — the field is controlled by the
    // container (ADR-0027 §2).
    await userEvent.type(region('Typing').getByLabelText('Invite link'), 'abc');
    await expect(args.onChange).toHaveBeenCalled();
    const submitButton = region('Ready to submit').getByRole('button', {
      name: 'Join'
    });
    await expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);
    // The view parses the pasted URL down to the bare token before calling onSubmit.
    await expect(args.onSubmit).toHaveBeenCalledWith('abc123');
    await userEvent.click(region('No link fallback').getByText("I don't have a link"));
    await expect(await region('No link fallback').findByText(/Ask your team's captain or admin/)).toBeInTheDocument();
    await expect(region('No link fallback').getByRole('link', {
      name: 'Create a team'
    })).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S=[`Data`,`Shells`,`Interactions`]})))()}C();export{y as Data,x as Interactions,b as Shells,S as __namedExportsOrder,v as default};