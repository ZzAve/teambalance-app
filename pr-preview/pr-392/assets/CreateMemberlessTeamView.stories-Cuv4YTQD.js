import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BnrpfBEu.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-DFNBMj0Z.js";import{n as s,t as c}from"./input-D8uJOBzb.js";import{n as l,t as u}from"./label-DVuwj_ZE.js";import{n as d,t as f}from"./FormError-B3b4LG7B.js";import{a as p,i as m,n as h,r as g,t as _}from"./validate-slug-DVNQemCN.js";function v({isPending:e,error:t,createdName:n,onSubmit:r}){let[i,a]=(0,y.useState)(``),[s,l]=(0,y.useState)(``),d=s.length>0?h(s):null,m=i.trim().length>0&&s.length>0&&d===null&&!e,g=e=>{e.preventDefault(),m&&r({name:i.trim(),slug:s})},_=(...e)=>p(t,...e),v=_(`INVALID_NAME`),x=_(`INVALID_SLUG`,`SLUG_TAKEN`)??d,S=_(`GENERIC`,`INVALID_CREATION_CODE`);return(0,b.jsxs)(`form`,{onSubmit:g,className:`flex flex-col gap-3`,children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Create a team`}),(0,b.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Creates an empty team you can enter and set up, then hand over with an admin invite link. You don't join it.`})]}),S&&(0,b.jsx)(f,{children:S}),n&&!S&&(0,b.jsxs)(`p`,{role:`status`,className:`text-small text-green`,children:[`Created “`,n,`”. Enter it from the list below to set it up.`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(u,{htmlFor:`ml-team-name`,children:`Team name`}),(0,b.jsx)(c,{id:`ml-team-name`,value:i,disabled:e,onChange:e=>a(e.target.value),placeholder:`e.g. Tovo Dames 5`}),v&&(0,b.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:v})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(u,{htmlFor:`ml-team-slug`,children:`Team address`}),(0,b.jsx)(c,{id:`ml-team-slug`,value:s,disabled:e,onChange:e=>l(e.target.value),placeholder:`tovo-dames-5`}),x&&(0,b.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:x})]}),(0,b.jsx)(o,{type:`submit`,disabled:!m,className:`self-start`,children:e?`Creating…`:`Create team`})]})}var y,b;function x(){return(x=e((()=>{y=t(),a(),s(),l(),_(),m(),d(),b=n(),v.__docgenInfo={description:`Presentational memberless-create form for the platform console (ADR-0024 §5). Prop-only
(isPending / error / createdName / onSubmit) so every state renders from props with no network; the
mutation and the team-list refresh live in the container. No creation code field — the platform-admin
allowlist on \`/admin\` is the gate — and no member is created, so there is no founder to name.`,methods:[],displayName:`CreateMemberlessTeamView`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},createdName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Set after a successful create, so the console confirms the (empty) team is ready to enter.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``}}}})))()}var S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{m(),r(),x(),S=n(),{expect:C,fn:w,within:T}=__STORYBOOK_MODULE_TEST__,E={title:`features/create-memberless-team/CreateMemberlessTeamView`,component:v,args:{isPending:!1,onSubmit:w()}},D={play:async({canvas:e})=>{await C(e.getByLabelText(`Team name`)).toBeInTheDocument(),await C(e.getByLabelText(`Team address`)).toBeInTheDocument(),await C(e.queryByLabelText(`Creation code`)).not.toBeInTheDocument(),await C(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},O={render:e=>(0,S.jsx)(i,{items:{Pending:(0,S.jsx)(v,{...e,isPending:!0}),"Slug taken":(0,S.jsx)(v,{...e,error:new g(`SLUG_TAKEN`,`That address is already taken — try another.`)}),"Generic error":(0,S.jsx)(v,{...e,error:new g(`GENERIC`,`Something went wrong creating the team. Please try again.`)}),Created:(0,S.jsx)(v,{...e,createdName:`Tovo Dames 5`})}}),play:async({canvas:e})=>{let t=t=>T(e.getByRole(`region`,{name:t}));await C(t(`Pending`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await C(t(`Slug taken`).getByText(`That address is already taken — try another.`)).toBeInTheDocument(),await C(t(`Generic error`).getByRole(`alert`)).toHaveTextContent(`Something went wrong creating the team.`),await C(t(`Created`).getByRole(`status`)).toHaveTextContent(`Created “Tovo Dames 5”.`)}},k={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Dames 5`),await t.type(e.getByLabelText(`Team address`),`Bad Slug`),await C(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await C(e.getByRole(`button`,{name:`Create team`})).toBeDisabled(),await C(n.onSubmit).not.toHaveBeenCalled(),await t.clear(e.getByLabelText(`Team address`)),await t.type(e.getByLabelText(`Team address`),`tovo-dames-5`),await t.click(e.getByRole(`button`,{name:`Create team`})),await C(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Dames 5`,slug:`tovo-dames-5`})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Team name')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Team address')).toBeInTheDocument();
    // No creation code — the /admin allowlist is the gate.
    await expect(canvas.queryByLabelText('Creation code')).not.toBeInTheDocument();
    // Submit is disabled until name + a valid slug are present.
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Pending: <CreateMemberlessTeamView {...args} isPending />,
    'Slug taken': <CreateMemberlessTeamView {...args} error={new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')} />,
    'Generic error': <CreateMemberlessTeamView {...args} error={new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.')} />,
    Created: <CreateMemberlessTeamView {...args} createdName="Tovo Dames 5" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Pending').getByRole('button', {
      name: 'Creating…'
    })).toBeDisabled();
    await expect(region('Slug taken').getByText('That address is already taken — try another.')).toBeInTheDocument();
    await expect(region('Generic error').getByRole('alert')).toHaveTextContent('Something went wrong creating the team.');
    await expect(region('Created').getByRole('status')).toHaveTextContent('Created “Tovo Dames 5”.');
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
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5');
    await userEvent.type(canvas.getByLabelText('Team address'), 'Bad Slug');
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.clear(canvas.getByLabelText('Team address'));
    await userEvent.type(canvas.getByLabelText('Team address'), 'tovo-dames-5');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create team'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'Tovo Dames 5',
      slug: 'tovo-dames-5'
    });
  }
}`,...k.parameters?.docs?.source}}},A=[`Data`,`Shells`,`Interactions`]})))()}j();export{D as Data,k as Interactions,O as Shells,A as __namedExportsOrder,E as default};