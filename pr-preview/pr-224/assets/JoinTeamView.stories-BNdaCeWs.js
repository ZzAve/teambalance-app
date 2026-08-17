import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-_zjQQXNi.js";import{n as i,t as a}from"./input-DlkaCJcl.js";import{n as o,t as s}from"./label-BRviubNr.js";function c(e){let t=e.trim(),n=t.indexOf(`/invite/`);return(n===-1?t:t.slice(n+8)).split(/[?#]/)[0].replace(/\/+$/,``).trim()}function l({value:e,onChange:t,onSubmit:n,submitting:i,error:o}){let l=e.trim().length>0&&!i;return(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`h1`,{className:`font-display text-2xl font-bold`,children:`Join your team`}),(0,u.jsx)(`p`,{className:`mt-2 text-sm text-muted-foreground`,children:`Paste the invite link you were sent below — or easiest of all, just click the link directly.`}),(0,u.jsxs)(`form`,{onSubmit:t=>{t.preventDefault(),l&&n(c(e))},className:`mt-6 flex flex-col gap-4`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(s,{htmlFor:`invite-token`,children:`Invite link`}),(0,u.jsx)(a,{id:`invite-token`,value:e,disabled:i,onChange:e=>t(e.target.value),placeholder:`https://app.teambalance.nl/invite/...`})]}),o&&(0,u.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:o}),(0,u.jsx)(r,{type:`submit`,disabled:!l,children:i?`Joining…`:`Join`})]}),(0,u.jsxs)(`details`,{className:`mt-8 text-sm text-muted-foreground`,children:[(0,u.jsx)(`summary`,{className:`cursor-pointer font-medium text-foreground`,children:`I don't have a link`}),(0,u.jsx)(`p`,{className:`mt-2`,children:`Ask your team's captain or admin to send you the invite link — they can generate one from the team's Members page. Once you have it, paste it above.`}),(0,u.jsxs)(`p`,{className:`mt-2`,children:[`Starting your own team instead?`,` `,(0,u.jsx)(`a`,{href:`/create-team`,className:`text-blue underline`,children:`Create a team`})]})]})]})}var u;function d(){return(d=e((()=>{n(),i(),o(),u=t(),l.__docgenInfo={description:`Presentational paste-your-invite UI (the /onboarding/join fork branch). value/onChange are
controlled by the route container rather than owned locally, so a failed submit can be retried
without losing what was pasted. Accepts a full invite URL or a bare token — parsed via the pure
parseInviteToken before onSubmit ever sees it.`,methods:[],displayName:`JoinTeamView`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(token: string) => void`,signature:{arguments:[{type:{name:`string`},name:`token`}],return:{name:`void`}}},description:``},submitting:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``}}}})))()}var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{d(),{expect:f,fn:p}=__STORYBOOK_MODULE_TEST__,m={title:`features/join-team/JoinTeamView`,component:l,args:{value:``,onChange:p(),onSubmit:p()}},h={play:async({canvas:e})=>{await f(e.getByLabelText(`Invite link`)).toHaveValue(``),await f(e.getByRole(`button`,{name:`Join`})).toBeDisabled(),await f(e.getByText(`I don't have a link`)).toBeInTheDocument()}},g={play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Invite link`),`abc`),await f(n.onChange).toHaveBeenCalled()}},_={args:{value:`https://app.teambalance.nl/invite/abc123?utm=share`},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByRole(`button`,{name:`Join`});await f(r).toBeEnabled(),await t.click(r),await f(n.onSubmit).toHaveBeenCalledWith(`abc123`)}},v={args:{value:`abc123`,submitting:!0},play:async({canvas:e})=>{await f(e.getByRole(`button`,{name:`Joining…`})).toBeDisabled()}},y={args:{value:`abc123`,error:`That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one.`},play:async({canvas:e})=>{await f(e.getByRole(`alert`)).toHaveTextContent(`invalid or expired`)}},b={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByText(`I don't have a link`)),await f(await e.findByText(/Ask your team's captain or admin/)).toBeInTheDocument(),await f(e.getByRole(`link`,{name:`Create a team`})).toBeInTheDocument()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.type(canvas.getByLabelText('Invite link'), 'abc');
    await expect(args.onChange).toHaveBeenCalled();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'https://app.teambalance.nl/invite/abc123?utm=share'
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const button = canvas.getByRole('button', {
      name: 'Join'
    });
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    // The view parses the pasted URL down to the bare token before calling onSubmit.
    await expect(args.onSubmit).toHaveBeenCalledWith('abc123');
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'abc123',
    submitting: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Joining…'
    })).toBeDisabled();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'abc123',
    error: "That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one."
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('invalid or expired');
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByText("I don't have a link"));
    await expect(await canvas.findByText(/Ask your team's captain or admin/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Create a team'
    })).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x=[`Default`,`TypingUpdatesTheContainer`,`Submit`,`Submitting`,`ErrorState`,`NoLinkFallback`]})))()}S();export{h as Default,y as ErrorState,b as NoLinkFallback,_ as Submit,v as Submitting,g as TypingUpdatesTheContainer,x as __namedExportsOrder,m as default};