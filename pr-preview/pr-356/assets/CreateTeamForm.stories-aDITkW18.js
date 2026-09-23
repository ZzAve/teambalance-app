import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BiajjKFy.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./button-BkXpgCJ0.js";import{n as s,t as c}from"./input-Bk94cEHf.js";import{n as l,t as u}from"./label-CoKbLJgp.js";import{n as d,t as f}from"./teams-CoOwVAF9.js";function p(e){return e.length===0?`Choose a team address.`:e.length>58?`Use 58 characters or fewer.`:m.test(e)?null:`Use lowercase letters, numbers, and hyphens.`}var m;function h(){return(h=e((()=>{m=/^[a-z0-9]+(-[a-z0-9]+)*$/})))()}function g(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``).slice(0,58).replace(/-+$/g,``)}function _(){return(_=e((()=>{h()})))()}function v({isPending:e,error:t,onSubmit:n,reassuranceDelayMs:r=5e3}){let[i,a]=(0,y.useState)(``),[s,l]=(0,y.useState)(``),[d,f]=(0,y.useState)(!1),[m,h]=(0,y.useState)(``),[_,v]=(0,y.useState)(!1),x=e=>{a(e),d||l(g(e))};(0,y.useEffect)(()=>{if(!e)return;let t=setTimeout(()=>v(!0),r);return()=>{clearTimeout(t),v(!1)}},[e,r]);let S=s.length>0?p(s):null,C=i.trim().length>0&&m.trim().length>0&&S===null&&s.length>0&&!e,w=e=>{e.preventDefault(),C&&n({name:i.trim(),slug:s,creationCode:m.trim()})},T=(...e)=>t&&e.includes(t.code)?t.message:null,E=T(`INVALID_NAME`),D=T(`INVALID_SLUG`,`SLUG_TAKEN`)??S,O=T(`INVALID_CREATION_CODE`),k=T(`GENERIC`);return(0,b.jsxs)(`form`,{onSubmit:w,className:`flex flex-col gap-4`,children:[k&&(0,b.jsx)(`p`,{role:`alert`,className:`text-small text-destructive`,children:k}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(u,{htmlFor:`team-name`,children:`Team name`}),(0,b.jsx)(c,{id:`team-name`,value:i,disabled:e,onChange:e=>x(e.target.value),placeholder:`e.g. Tovo Heren 4`}),E&&(0,b.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:E})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(u,{htmlFor:`team-slug`,children:`Team address`}),(0,b.jsx)(c,{id:`team-slug`,value:s,disabled:e,onChange:e=>{l(e.target.value),f(!0)},placeholder:`tovo-heren-4`}),D&&(0,b.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:D})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(u,{htmlFor:`creation-code`,children:`Creation code`}),(0,b.jsx)(c,{id:`creation-code`,value:m,disabled:e,onChange:e=>h(e.target.value),placeholder:`Enter your creation code`}),O&&(0,b.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:O})]}),(0,b.jsx)(o,{type:`submit`,disabled:!C,children:e?`Creating your team…`:`Create team`}),e&&_&&(0,b.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Setting up your team's space — this can take a few seconds…`})]})}var y,b;function x(){return(x=e((()=>{y=t(),a(),s(),l(),_(),h(),b=n(),v.__docgenInfo={description:`Presentational create-team form (#158). Prop-only (isPending / error / onSubmit) so every state is a
story with no network; the mutation, navigation, and success side-effects live in the route
container. Owns only local field state and the slug's auto-suggest-until-edited behaviour.

The slug is validated, not derived: it is auto-suggested from the name until the user edits it (a
dirty flag then stops the sync), and validated client-side against the same contract the backend
enforces so a bad address is caught before submit.`,methods:[],displayName:`CreateTeamForm`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string; creationCode: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string; creationCode: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}},{key:`creationCode`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``},reassuranceDelayMs:{required:!1,tsType:{name:`number`},description:`Delay before the "still setting up" reassurance line appears while submitting. Exposed only so a
story can force it visible without a real wait; defaults to ~5s to cover the known API cold-start
(#92) — POST /api/teams runs CREATE SCHEMA + Flyway in-request.`,defaultValue:{value:`5000`,computed:!1}}}}})))()}var S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{d(),r(),x(),S=n(),{expect:C,fn:w,within:T}=__STORYBOOK_MODULE_TEST__,E={title:`features/create-team/CreateTeamForm`,component:v,args:{isPending:!1,onSubmit:w()}},D={play:async({canvas:e})=>{await C(e.getByLabelText(`Team name`)).toHaveValue(``),await C(e.getByLabelText(`Team address`)).toHaveValue(``),await C(e.getByLabelText(`Creation code`)).toHaveValue(``),await C(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},O={render:e=>(0,S.jsx)(i,{items:{Submitting:(0,S.jsx)(v,{...e,isPending:!0,reassuranceDelayMs:0}),"Code invalid":(0,S.jsx)(v,{...e,error:new f(`INVALID_CREATION_CODE`,`That creation code isn't valid.`)}),"Slug taken":(0,S.jsx)(v,{...e,error:new f(`SLUG_TAKEN`,`That address is already taken — try another.`)}),"Generic failure":(0,S.jsx)(v,{...e,error:new f(`GENERIC`,`Something went wrong creating your team. Please try again.`)})}}),play:async({canvas:e})=>{let t=t=>T(e.getByRole(`region`,{name:t})),n=t(`Submitting`).getByRole(`button`,{name:`Creating your team…`});await C(n).toBeDisabled(),await C(await t(`Submitting`).findByText(/Setting up your team's space/)).toBeInTheDocument(),await C(t(`Code invalid`).getByText(`That creation code isn't valid.`)).toBeInTheDocument(),await C(t(`Slug taken`).getByText(`That address is already taken — try another.`)).toBeInTheDocument(),await C(t(`Generic failure`).getByRole(`alert`)).toHaveTextContent(`Something went wrong creating your team.`)}},k={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Heren 4`),await C(e.getByLabelText(`Team address`)).toHaveValue(`tovo-heren-4`);let r=e.getByLabelText(`Team address`);await t.clear(r),await t.type(r,`Bad Slug`),await C(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await C(e.getByRole(`button`,{name:`Create team`})).toBeDisabled(),await t.clear(r),await t.type(r,`tovo-heren-4`),await t.type(e.getByLabelText(`Creation code`),`JOIN-2026`);let i=e.getByRole(`button`,{name:`Create team`});await C(i).toBeEnabled(),await t.click(i),await C(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Heren 4`,slug:`tovo-heren-4`,creationCode:`JOIN-2026`})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Team name')).toHaveValue('');
    await expect(canvas.getByLabelText('Team address')).toHaveValue('');
    await expect(canvas.getByLabelText('Creation code')).toHaveValue('');
    // Nothing typed yet → submit is disabled (hard gate before anything can be sent).
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // reassuranceDelayMs: 0 forces the delayed "still setting up" line visible without a real wait.
    Submitting: <CreateTeamForm {...args} isPending reassuranceDelayMs={0} />,
    'Code invalid': <CreateTeamForm {...args} error={new CreateTeamError('INVALID_CREATION_CODE', "That creation code isn't valid.")} />,
    'Slug taken': <CreateTeamForm {...args} error={new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')} />,
    // GENERIC is the only error with nowhere better to go than a banner, now that ADR-0023 lifted
    // ALREADY_IN_TEAM — so this shell keeps that slot covered.
    'Generic failure': <CreateTeamForm {...args} error={new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const submit = region('Submitting').getByRole('button', {
      name: 'Creating your team…'
    });
    await expect(submit).toBeDisabled();
    await expect(await region('Submitting').findByText(/Setting up your team's space/)).toBeInTheDocument();
    await expect(region('Code invalid').getByText("That creation code isn't valid.")).toBeInTheDocument();
    await expect(region('Slug taken').getByText('That address is already taken — try another.')).toBeInTheDocument();
    await expect(region('Generic failure').getByRole('alert')).toHaveTextContent('Something went wrong creating your team.');
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4');
    // The slug is auto-suggested from the name until the user edits it.
    await expect(canvas.getByLabelText('Team address')).toHaveValue('tovo-heren-4');

    // The user edits the auto-suggested slug into something invalid — client validation catches it.
    const slug = canvas.getByLabelText('Team address');
    await userEvent.clear(slug);
    await userEvent.type(slug, 'Bad Slug');
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();

    // Fixing the slug back up unblocks submit again.
    await userEvent.clear(slug);
    await userEvent.type(slug, 'tovo-heren-4');
    await userEvent.type(canvas.getByLabelText('Creation code'), 'JOIN-2026');
    const submit = canvas.getByRole('button', {
      name: 'Create team'
    });
    await expect(submit).toBeEnabled();
    await userEvent.click(submit);
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'Tovo Heren 4',
      slug: 'tovo-heren-4',
      creationCode: 'JOIN-2026'
    });
  }
}`,...k.parameters?.docs?.source}}},A=[`Data`,`Shells`,`Interactions`]})))()}j();export{D as Data,k as Interactions,O as Shells,A as __namedExportsOrder,E as default};