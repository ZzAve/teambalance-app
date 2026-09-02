import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CaGHz1tK.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-D4zxQ99R.js";import{n as a,t as o}from"./input-eWzH88pK.js";import{n as s,t as c}from"./label-DHHbv_6y.js";import{n as l,t as u}from"./teams-CivOJ-q5.js";function d(e){return e.length===0?`Choose a team address.`:e.length>58?`Use 58 characters or fewer.`:f.test(e)?null:`Use lowercase letters, numbers, and hyphens.`}var f;function p(){return(p=e((()=>{f=/^[a-z0-9]+(-[a-z0-9]+)*$/})))()}function m(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``).slice(0,58).replace(/-+$/g,``)}function h(){return(h=e((()=>{p()})))()}function g({isPending:e,error:t,onSubmit:n,reassuranceDelayMs:r=5e3}){let[a,s]=(0,_.useState)(``),[l,u]=(0,_.useState)(``),[f,p]=(0,_.useState)(!1),[h,g]=(0,_.useState)(``),[y,b]=(0,_.useState)(!1),x=e=>{s(e),f||u(m(e))};(0,_.useEffect)(()=>{if(!e)return;let t=setTimeout(()=>b(!0),r);return()=>{clearTimeout(t),b(!1)}},[e,r]);let S=l.length>0?d(l):null,C=a.trim().length>0&&h.trim().length>0&&S===null&&l.length>0&&!e,w=e=>{e.preventDefault(),C&&n({name:a.trim(),slug:l,creationCode:h.trim()})},T=(...e)=>t&&e.includes(t.code)?t.message:null,E=T(`INVALID_NAME`),D=T(`INVALID_SLUG`,`SLUG_TAKEN`)??S,O=T(`INVALID_CREATION_CODE`),k=T(`GENERIC`);return(0,v.jsxs)(`form`,{onSubmit:w,className:`flex flex-col gap-4`,children:[k&&(0,v.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:k}),(0,v.jsxs)(`div`,{children:[(0,v.jsx)(c,{htmlFor:`team-name`,children:`Team name`}),(0,v.jsx)(o,{id:`team-name`,value:a,disabled:e,onChange:e=>x(e.target.value),placeholder:`e.g. Tovo Heren 4`}),E&&(0,v.jsx)(`p`,{className:`mt-1 text-sm text-destructive`,children:E})]}),(0,v.jsxs)(`div`,{children:[(0,v.jsx)(c,{htmlFor:`team-slug`,children:`Team address`}),(0,v.jsx)(o,{id:`team-slug`,value:l,disabled:e,onChange:e=>{u(e.target.value),p(!0)},placeholder:`tovo-heren-4`}),D&&(0,v.jsx)(`p`,{className:`mt-1 text-sm text-destructive`,children:D})]}),(0,v.jsxs)(`div`,{children:[(0,v.jsx)(c,{htmlFor:`creation-code`,children:`Creation code`}),(0,v.jsx)(o,{id:`creation-code`,value:h,disabled:e,onChange:e=>g(e.target.value),placeholder:`Enter your creation code`}),O&&(0,v.jsx)(`p`,{className:`mt-1 text-sm text-destructive`,children:O})]}),(0,v.jsx)(i,{type:`submit`,disabled:!C,children:e?`Creating your team…`:`Create team`}),e&&y&&(0,v.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Setting up your team's space — this can take a few seconds…`})]})}var _,v;function y(){return(y=e((()=>{_=t(),r(),a(),s(),h(),p(),v=n(),g.__docgenInfo={description:`Presentational create-team form (#158). Prop-only (isPending / error / onSubmit) so every state is a
story with no network; the mutation, navigation, and success side-effects live in the route
container. Owns only local field state and the slug's auto-suggest-until-edited behaviour.

The slug is validated, not derived: it is auto-suggested from the name until the user edits it (a
dirty flag then stops the sync), and validated client-side against the same contract the backend
enforces so a bad address is caught before submit.`,methods:[],displayName:`CreateTeamForm`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string; creationCode: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string; creationCode: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}},{key:`creationCode`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``},reassuranceDelayMs:{required:!1,tsType:{name:`number`},description:`Delay before the "still setting up" reassurance line appears while submitting. Exposed only so a
story can force it visible without a real wait; defaults to ~5s to cover the known API cold-start
(#92) — POST /api/teams runs CREATE SCHEMA + Flyway in-request.`,defaultValue:{value:`5000`,computed:!1}}}}})))()}var b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{l(),y(),{expect:b,fn:x}=__STORYBOOK_MODULE_TEST__,S={title:`features/create-team/CreateTeamForm`,component:g,args:{isPending:!1,onSubmit:x()}},C={play:async({canvas:e})=>{await b(e.getByLabelText(`Team name`)).toHaveValue(``),await b(e.getByLabelText(`Team address`)).toHaveValue(``),await b(e.getByLabelText(`Creation code`)).toHaveValue(``),await b(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},w={play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Heren 4`),await b(e.getByLabelText(`Team address`)).toHaveValue(`tovo-heren-4`),await t.type(e.getByLabelText(`Creation code`),`JOIN-2026`);let r=e.getByRole(`button`,{name:`Create team`});await b(r).toBeEnabled(),await t.click(r),await b(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Heren 4`,slug:`tovo-heren-4`,creationCode:`JOIN-2026`})}},T={args:{isPending:!0,reassuranceDelayMs:0},play:async({canvas:e})=>{let t=e.getByRole(`button`,{name:`Creating your team…`});await b(t).toBeDisabled(),await b(await e.findByText(/Setting up your team's space/)).toBeInTheDocument()}},E={args:{error:new u(`INVALID_CREATION_CODE`,`That creation code isn't valid.`)},play:async({canvas:e})=>{await b(e.getByText(`That creation code isn't valid.`)).toBeInTheDocument()}},D={args:{error:new u(`SLUG_TAKEN`,`That address is already taken — try another.`)},play:async({canvas:e})=>{await b(e.getByText(`That address is already taken — try another.`)).toBeInTheDocument()}},O={play:async({canvas:e,userEvent:t})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Heren 4`);let n=e.getByLabelText(`Team address`);await t.clear(n),await t.type(n,`Bad Slug`),await b(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await b(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},k={args:{error:new u(`GENERIC`,`Something went wrong creating your team. Please try again.`)},play:async({canvas:e})=>{await b(e.getByRole(`alert`)).toHaveTextContent(`Something went wrong creating your team.`)}},A={parameters:{chromatic:{disableSnapshot:!0}},args:{error:new u(`GENERIC`,`Something went wrong creating your team. Please try again.`)},play:async({canvas:e})=>{await b(e.getByRole(`alert`)).toHaveTextContent(`Something went wrong creating your team.`)}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4');
    // The slug is auto-suggested from the name until the user edits it.
    await expect(canvas.getByLabelText('Team address')).toHaveValue('tovo-heren-4');
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  // reassuranceDelayMs: 0 forces the delayed "still setting up" line visible without a real wait.
  args: {
    isPending: true,
    reassuranceDelayMs: 0
  },
  play: async ({
    canvas
  }) => {
    const submit = canvas.getByRole('button', {
      name: 'Creating your team…'
    });
    await expect(submit).toBeDisabled();
    await expect(await canvas.findByText(/Setting up your team's space/)).toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    error: new CreateTeamError('INVALID_CREATION_CODE', "That creation code isn't valid.")
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("That creation code isn't valid.")).toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    error: new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That address is already taken — try another.')).toBeInTheDocument();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4');
    // The user edits the auto-suggested slug into something invalid — client validation catches it.
    const slug = canvas.getByLabelText('Team address');
    await userEvent.clear(slug);
    await userEvent.type(slug, 'Bad Slug');
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    error: new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating your team.');
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  // Behavioural twin of GenericFailure — a literal duplicate render (ADR-0027 §2).
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  args: {
    error: new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating your team.');
  }
}`,...A.parameters?.docs?.source}}},j=[`Pristine`,`Valid`,`Submitting`,`CodeInvalid`,`SlugTaken`,`NameOrSlugInvalid`,`GenericFailure`,`GenericError`]})))()}M();export{E as CodeInvalid,A as GenericError,k as GenericFailure,O as NameOrSlugInvalid,C as Pristine,D as SlugTaken,T as Submitting,w as Valid,j as __namedExportsOrder,S as default};