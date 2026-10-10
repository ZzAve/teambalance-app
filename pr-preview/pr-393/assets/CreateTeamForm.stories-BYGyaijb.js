import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-D-gPkH2q.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-HJX3GoHV.js";import{n as s,t as c}from"./input-BjKFhnS8.js";import{n as l,t as u}from"./label-CG2NvSFY.js";import{n as d,t as f}from"./FormError-B3b4LG7B.js";import{a as p,i as m,n as h,r as g,t as _}from"./validate-slug-CPmhbyYx.js";function v(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``).slice(0,58).replace(/-+$/g,``)}function y(){return(y=e((()=>{_()})))()}function b({isPending:e,error:t,onSubmit:n,reassuranceDelayMs:r=5e3}){let[i,a]=(0,x.useState)(``),[s,l]=(0,x.useState)(``),[d,m]=(0,x.useState)(!1),[g,_]=(0,x.useState)(``),[y,b]=(0,x.useState)(!1),C=e=>{a(e),d||l(v(e))};(0,x.useEffect)(()=>{if(!e)return;let t=setTimeout(()=>b(!0),r);return()=>{clearTimeout(t),b(!1)}},[e,r]);let w=s.length>0?h(s):null,T=i.trim().length>0&&g.trim().length>0&&w===null&&s.length>0&&!e,E=e=>{e.preventDefault(),T&&n({name:i.trim(),slug:s,creationCode:g.trim()})},D=(...e)=>p(t,...e),O=D(`INVALID_NAME`),k=D(`INVALID_SLUG`,`SLUG_TAKEN`)??w,A=D(`INVALID_CREATION_CODE`),j=D(`GENERIC`);return(0,S.jsxs)(`form`,{onSubmit:E,className:`flex flex-col gap-4`,children:[j&&(0,S.jsx)(f,{children:j}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(u,{htmlFor:`team-name`,children:`Team name`}),(0,S.jsx)(c,{id:`team-name`,value:i,disabled:e,onChange:e=>C(e.target.value),placeholder:`e.g. Tovo Heren 4`}),O&&(0,S.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:O})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(u,{htmlFor:`team-slug`,children:`Team address`}),(0,S.jsx)(c,{id:`team-slug`,value:s,disabled:e,onChange:e=>{l(e.target.value),m(!0)},placeholder:`tovo-heren-4`}),k&&(0,S.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:k})]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(u,{htmlFor:`creation-code`,children:`Creation code`}),(0,S.jsx)(c,{id:`creation-code`,value:g,disabled:e,onChange:e=>_(e.target.value),placeholder:`Enter your creation code`}),A&&(0,S.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:A})]}),(0,S.jsx)(o,{type:`submit`,disabled:!T,children:e?`Creating your team…`:`Create team`}),e&&y&&(0,S.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Setting up your team's space — this can take a few seconds…`})]})}var x,S;function C(){return(C=e((()=>{x=t(),a(),s(),l(),m(),d(),y(),_(),S=n(),b.__docgenInfo={description:`Presentational create-team form (#158). Prop-only (isPending / error / onSubmit) so every state is a
story with no network; the mutation, navigation, and success side-effects live in the route
container. Owns only local field state and the slug's auto-suggest-until-edited behaviour.

The slug is validated, not derived: it is auto-suggested from the name until the user edits it (a
dirty flag then stops the sync), and validated client-side against the same contract the backend
enforces so a bad address is caught before submit.`,methods:[],displayName:`CreateTeamForm`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string; creationCode: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string; creationCode: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}},{key:`creationCode`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``},reassuranceDelayMs:{required:!1,tsType:{name:`number`},description:`Delay before the "still setting up" reassurance line appears while submitting. Exposed only so a
story can force it visible without a real wait; defaults to ~5s to cover the known API cold-start
(#92) — POST /api/teams runs CREATE SCHEMA + Flyway in-request.`,defaultValue:{value:`5000`,computed:!1}}}}})))()}var w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{m(),r(),C(),w=n(),{expect:T,fn:E,within:D}=__STORYBOOK_MODULE_TEST__,O={title:`features/create-team/CreateTeamForm`,component:b,args:{isPending:!1,onSubmit:E()}},k={play:async({canvas:e})=>{await T(e.getByLabelText(`Team name`)).toHaveValue(``),await T(e.getByLabelText(`Team address`)).toHaveValue(``),await T(e.getByLabelText(`Creation code`)).toHaveValue(``),await T(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},A={render:e=>(0,w.jsx)(i,{items:{Submitting:(0,w.jsx)(b,{...e,isPending:!0,reassuranceDelayMs:0}),"Code invalid":(0,w.jsx)(b,{...e,error:new g(`INVALID_CREATION_CODE`,`That creation code isn't valid.`)}),"Slug taken":(0,w.jsx)(b,{...e,error:new g(`SLUG_TAKEN`,`That address is already taken — try another.`)}),"Generic failure":(0,w.jsx)(b,{...e,error:new g(`GENERIC`,`Something went wrong creating your team. Please try again.`)})}}),play:async({canvas:e})=>{let t=t=>D(e.getByRole(`region`,{name:t})),n=t(`Submitting`).getByRole(`button`,{name:`Creating your team…`});await T(n).toBeDisabled(),await T(await t(`Submitting`).findByText(/Setting up your team's space/)).toBeInTheDocument(),await T(t(`Code invalid`).getByText(`That creation code isn't valid.`)).toBeInTheDocument(),await T(t(`Slug taken`).getByText(`That address is already taken — try another.`)).toBeInTheDocument(),await T(t(`Generic failure`).getByRole(`alert`)).toHaveTextContent(`Something went wrong creating your team.`)}},j={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Heren 4`),await T(e.getByLabelText(`Team address`)).toHaveValue(`tovo-heren-4`);let r=e.getByLabelText(`Team address`);await t.clear(r),await t.type(r,`Bad Slug`),await T(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await T(e.getByRole(`button`,{name:`Create team`})).toBeDisabled(),await t.clear(r),await t.type(r,`tovo-heren-4`),await t.type(e.getByLabelText(`Creation code`),`JOIN-2026`);let i=e.getByRole(`button`,{name:`Create team`});await T(i).toBeEnabled(),await t.click(i),await T(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Heren 4`,slug:`tovo-heren-4`,creationCode:`JOIN-2026`})}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M=[`Data`,`Shells`,`Interactions`]})))()}N();export{k as Data,j as Interactions,A as Shells,M as __namedExportsOrder,O as default};